import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../dummyData';
import type { Movie } from '../types';
import BlurCircle from '../components/BlurCircle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import { getHoursAndMinutes } from '../lib/utils';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const MovieDetails = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getMovie = (id: string) => {
    const movie = dummyShowsData.find((movie) => movie._id === id);
    return movie || null;
  }

  const handleShowMore = () => {
    navigate('/movies');
    scrollTo(0, 0);
  }

  useEffect(() => {
    if (id) {
      const movie = getMovie(id);
      if (movie) {
        setCurrentMovie({
          ...movie,
          dateTime: dummyDateTimeData
        });
      }
    }
  }, [id]);

  if (!currentMovie) {
    return <Loader />;
  }

  return (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={currentMovie.poster_path}
          alt="movie image"
          className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top='-100px' left='-100px' />
          <p className="text-primary">ENGLISH</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {currentMovie.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            <span>{currentMovie.vote_average.toFixed(1)}</span>
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">{currentMovie.overview}</p>

          <p>
            {getHoursAndMinutes(currentMovie.runtime)} • {currentMovie.genres.map(genre => genre.name).join(', ')} • {currentMovie.release_date.split('-')[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md active:scale-95">
              <PlayCircleIcon className="w-5 h-5" />
              Watch trailer
            </button>
            <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md active:scale-95'>
              Buy Tickets
            </a>
            <button className="bg-gray-700 p-2.5 rounded-full transition active:scale-95">
              <Heart className={`w-5 h-5`} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {currentMovie.casts.map((actor, index) => (
            <div key={index} className='flex flex-col items-center text-center'>
              <img src={actor.profile_path} alt={actor.name} className="rounded-full h-20 aspect-square object-cover" />
              <p className="mt-3 text-sm">{actor.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={currentMovie.dateTime!} movieId={id!} />

      <p className="text-lg mt-20 mb-8">You may also like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {dummyShowsData.slice(0, 4).map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button
          onClick={handleShowMore}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md"
        >
          Show more
        </button>
      </div>

    </div>
  )
}

export default MovieDetails