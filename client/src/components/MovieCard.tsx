import React from 'react'
import type { Movie } from '../types'
import { useNavigate } from 'react-router-dom'
import { StarIcon } from 'lucide-react';
import { getHoursAndMinutes } from '../lib/utils';

const MovieCard = ({ movie }: { movie: Movie }) => {
    const navigate = useNavigate();

    const goToMovieDetails = () => {
        navigate(`/movies/${movie._id}`);
        scrollTo(0, 0);
    }
    return (
        <div className='flex flex-col gap-2 justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition max-[380px]:w-full max-[600px]:w-80 w-66'>
            <img
                src={movie.backdrop_path}
                alt="movie image"
                className='h-52 w-full rounded-t-2xl object-cover object-bottom-right cursor-pointer'
                onClick={goToMovieDetails}
            />

            <p className="mt-2 font-semibold truncate">{movie.title}</p>

            <p className="text-sm text-gray-400 mt-2">
                {new Date(movie.release_date).getFullYear()} • {movie.genres.slice(0, 2).map(genre => genre.name).join(' | ')} • {getHoursAndMinutes(movie.runtime)}
            </p>

            <div className="flex items-center justify-between mt-4 pb-3">
                <button className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full" onClick={goToMovieDetails}>
                    Buy Tickets
                </button>

                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
        </div>
    )
}

export default MovieCard