import React, { useEffect, useState } from 'react';
import './Moviesearch.css';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";

const MovieRecommendations=() => {

    const [movies, setMovies] = useState([]);
    const [searchQuery, setsearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popurality.desc');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [expandedMovieId, setExpandedMovieId] = useState(null);
    const [favorites, setFavorites] = useState([]);


    useEffect(() => {
        const fetchGenres = async () => {
            const response = await axios.get(
                'https://api.themoviedb.org/3/genre/movie/list',
                {
                    params: {
                        api_key:'0fa2853e7c4d6c8f146aba861c5e4a06',
                    },
                }
            );
            setGenres(response.data.genres);
        };
        fetchGenres();
        }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await axios.get(
                'https://api.themoviedb.org/3/discover/movie',
                {
                    params: {
                        api_key: '0fa2853e7c4d6c8f146aba861c5e4a06',
                        sort_by: sortBy,
                        page: 1,
                        with_genres: selectedGenre,
                        query: searchQuery,
                    },
                }
            );
            setMovies(response.data.results);
        };
        fetchMovies();
    }, [searchQuery, sortBy, selectedGenre]);

    const handleSearchChange = (event) => {
        setsearchQuery(event.target.value);
    }

    const handleSearchSubmit = async () => {
        const response = await axios.get(
        'https://api.themoviedb.org/3/search/movie',
        {
            params: {
            api_key: '0fa2853e7c4d6c8f146aba861c5e4a06',
            query: searchQuery,
            },
        }
        );
        setMovies(response.data.results);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };
    
    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    const toggleDescription = (movieId) => {
        setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
    };

    const toggleFavorite = (movie) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.some((fav) => fav.id === movie.id)) {
                return prevFavorites.filter((fav) => fav.id !== movie.id);
            } else {
                return [...prevFavorites, movie];
            }
        });
    };
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);
    
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    return (
    <div>
        <h1>Movie search app</h1>
        <div className='searchbar'>
            <input type='text' placeholder='search movies..' value={searchQuery} onChange={handleSearchChange} className='searchinput'></input>
            <button onClick={handleSearchSubmit} className='searchbutton'>
                <FaSearch></FaSearch>
            </button>
        </div>
        <div className='filter'>
            <label htmlFor='sort-by'>Sort by: </label>
            <select id='sort-by' value={sortBy} onChange={handleSortChange}>
            <option value='popularity.desc'>Popularity Desc</option>
            <option value='popularity.asc'>Popularity Asc</option>
            <option value='vote_average.desc'>Rating Desc</option>
            <option value='vote_average.asc'>Rating Asc</option>
            <option value='release_date.desc'>Release Date Desc</option>
            <option value='release_date.asc'>Release Date Asc</option>
            </select>
            <label htmlFor="genre">Genre: </label>
            <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
            <option value="">All Genres</option>
            {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
                {genre.name}
            </option>
            ))}
        </select>
        </div>
        <div className="movie-wrapper">
        {movies.map((movie) => (
            <div key={movie.id} className="movie">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h2>{movie.title} </h2>
            <p className='rating'>Rating: {movie.vote_average}</p>
            {expandedMovieId === movie.id ? (
                <p>{movie.overview}</p>
            ) : (
                <p>{movie.overview.substring(0, 150)}...</p>
            )}
            <button onClick={() => toggleDescription(movie.id)} className='read-more'>
                {expandedMovieId === movie.id ? 'Show Less' : 'Read More'}
            </button>
            <button 
            onClick={() => toggleFavorite(movie)}
            className={`favorite-button ${favorites.some((fav) => fav.id === movie.id) ? 'favorited' : ''}`}
            >
                {favorites.some((fav) => fav.id === movie.id) ? '❤️' : '♡'}
            </button>
            </div>
        ))}
        <div className="favorites-section">
            <h2>Favorites</h2>
            {favorites.length > 0 ? (
                <div className="favorites-wrapper">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="movie">
                            <img src={`https://image.tmdb.org/t/p/w500${fav.poster_path}`} alt={fav.title} />
                            <h2>{fav.title}</h2>
                            <p className='rating'>Rating: {fav.vote_average}</p>
                            <button onClick={() => toggleFavorite(fav)} className="favorite-button">
                                Remove from Favorites</button>
                        </div>
                        ))}
                </div>
                ) : (
                <p>No favorites added yet!</p>
                )}
            </div>
        </div>
    </div>
    );
};

export default MovieRecommendations;
