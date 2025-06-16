import React, { useState, useEffect } from 'react';
import { Search, Film, Users, User, Star, Calendar, Clock, Globe, Award } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

// Movie Card Component
const MovieCard = ({ movie, onClick }) => (
  <div 
    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
    onClick={() => onClick(movie)}
  >
    <div className="aspect-[2/3] bg-gray-200">
      {movie.poster ? (
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyAxMDBIMTEzVjEyNkg4N1YxMDBaIiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik04NyAxNDBIMTEzVjE1NEg4N1YxNDBaIiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik04NyAxNjBIMTEzVjE3NEg4N1YxNjBaIiBmaWxsPSIjOUI5QkEzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkEzIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <Film className="w-16 h-16 text-gray-400" />
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{movie.year}</p>
      {movie.imdb?.rating && (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{movie.imdb.rating}</span>
        </div>
      )}
    </div>
  </div>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center gap-2 mt-8">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage <= 1}
      className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Previous
    </button>
    
    <span className="px-4 py-2">
      Page {currentPage} of {totalPages}
    </span>
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
      className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Next
    </button>
  </div>
);

// Movie Details Modal
const MovieDetails = ({ movie, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movies/${movie._id}/comments`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [movie._id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
                {movie.poster ? (
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-4">
                {movie.plot && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Plot</h3>
                    <p className="text-gray-700">{movie.plot}</p>
                  </div>
                )}

                {movie.fullplot && movie.fullplot !== movie.plot && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Full Plot</h3>
                    <p className="text-gray-700">{movie.fullplot}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {movie.year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{movie.year}</span>
                    </div>
                  )}

                  {movie.runtime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{movie.runtime} min</span>
                    </div>
                  )}

                  {movie.imdb?.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{movie.imdb.rating}/10</span>
                    </div>
                  )}

                  {movie.rated && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span>{movie.rated}</span>
                    </div>
                  )}
                </div>

                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Cast
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.cast.slice(0, 10).map((actor, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {movie.directors && movie.directors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Directors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.directors.map((director, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {director}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {movie.genres && movie.genres.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-xl mb-4">Comments</h3>
            {loading ? (
              <p className="text-gray-500">Loading comments...</p>
            ) : comments.length > 0 ? (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{comment.name}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments available for this movie.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const MovieApp = () => {
  const [movies, setMovies] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [cast, setCast] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('movies');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movies
  const fetchMovies = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/movies?page=${page}&limit=20`);
      const data = await response.json();
      setMovies(data.movies);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch directors
  const fetchDirectors = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/directors?page=${page}&limit=20`);
      const data = await response.json();
      setDirectors(data.directors);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching directors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cast
  const fetchCast = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cast?page=${page}&limit=20`);
      const data = await response.json();
      setCast(data.cast);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching cast:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search movies
  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.movies);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'movies') {
      fetchMovies(1);
    } else if (activeTab === 'directors') {
      fetchDirectors(1);
    } else if (activeTab === 'cast') {
      fetchCast(1);
    }
  }, [activeTab]);

  const handlePageChange = (page) => {
    if (activeTab === 'movies') {
      fetchMovies(page);
    } else if (activeTab === 'directors') {
      fetchDirectors(page);
    } else if (activeTab === 'cast') {
      fetchCast(page);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MovieDB</h1>
            </div>
            
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveTab('movies')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'movies' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setActiveTab('directors')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'directors' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Directors
              </button>
              <button
                onClick={() => setActiveTab('cast')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'cast' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Actors
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies by title, plot, cast, or genre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            {isSearching && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Search Results */}
            {isSearching && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  Search Results ({searchResults.length})
                </h2>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {searchResults.map((movie) => (
                      <MovieCard
                        key={movie._id}
                        movie={movie}
                        onClick={setSelectedMovie}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No movies found for your search.</p>
                )}
              </div>
            )}

            {/* Movies Tab */}
            {activeTab === 'movies' && !isSearching && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Latest Movies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie._id}
                      movie={movie}
                      onClick={setSelectedMovie}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Directors Tab */}
            {activeTab === 'directors' && !isSearching && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Directors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {directors.map((director, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                      <div className="flex items-center gap-3">
                        <User className="w-8 h-8 text-gray-500" />
                        <span className="font-medium">{director}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Cast Tab */}
            {activeTab === 'cast' && !isSearching && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Actors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cast.map((actor, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                      <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-gray-500" />
                        <span className="font-medium">{actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default MovieApp;