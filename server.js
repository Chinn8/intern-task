const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movies', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Movie Schema
const movieSchema = new mongoose.Schema({
  plot: { type: String },
  genres: [{ type: String }],
  runtime: { type: Number },
  cast: [{ type: String }],
  num_mflix_comments: { type: Number },
  poster: { type: String },
  title: { type: String, required: true },
  fullplot: { type: String },
  languages: [{ type: String }],
  released: { type: Date },
  directors: [{ type: String }],
  writers: [{ type: String }],
  awards: {
    wins: { type: Number },
    nominations: { type: Number },
    text: { type: String }
  },
  lastupdated: { type: Date },
  year: { type: Number },
  imdb: {
    rating: { type: Number },
    votes: { type: Number },
    id: { type: Number }
  },
  countries: [{ type: String }],
  type: { type: String }
});

// Create text index for search
movieSchema.index({
  title: 'text',
  fullplot: 'text',
  cast: 'text',
  genres: 'text'
});

const Movie = mongoose.model('movies', movieSchema);

// Comment Schema
const commentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true }
});

const Comment = mongoose.model('comments', commentSchema);

// Routes

// Get movies with pagination and sorting
app.get('/api/movies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemPerPage = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sort || 'released';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const skip = itemPerPage * (page - 1);
    
    const movies = await Movie.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(itemPerPage);

    const total = await Movie.countDocuments();
    const totalPages = Math.ceil(total / itemPerPage);

    res.json({
      movies,
      currentPage: page,
      totalPages,
      totalMovies: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get directors with pagination
app.get('/api/directors', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemPerPage = parseInt(req.query.limit) || 20;
    const skip = itemPerPage * (page - 1);

    const directors = await Movie.distinct('directors');
    const filteredDirectors = directors.filter(director => director && director.trim() !== '');
    
    const paginatedDirectors = filteredDirectors.slice(skip, skip + itemPerPage);
    const totalPages = Math.ceil(filteredDirectors.length / itemPerPage);

    res.json({
      directors: paginatedDirectors,
      currentPage: page,
      totalPages,
      totalDirectors: filteredDirectors.length,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cast/actors with pagination
app.get('/api/cast', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemPerPage = parseInt(req.query.limit) || 20;
    const skip = itemPerPage * (page - 1);

    const cast = await Movie.distinct('cast');
    const filteredCast = cast.filter(actor => actor && actor.trim() !== '');
    
    const paginatedCast = filteredCast.slice(skip, skip + itemPerPage);
    const totalPages = Math.ceil(filteredCast.length / itemPerPage);

    res.json({
      cast: paginatedCast,
      currentPage: page,
      totalPages,
      totalActors: filteredCast.length,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie by ID
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments by movie ID
app.get('/api/movies/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ movie_id: req.params.id })
      .sort({ date: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search movies
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const movies = await Movie.find({
      $text: { $search: query }
    }, {
      score: { $meta: 'textScore' }
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);

    res.json({
      movies,
      query,
      total: movies.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});