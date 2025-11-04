import React, { useEffect, useState } from 'react'
import type { DateTime, Movie } from '../../types';
import { dummyShowsData } from '../../dummyData';
import Title from '../../components/admin/Title';
import Loader from '../../components/Loader';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { formatNumberWithK } from '../../lib/utils';

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [dateTimeSelection, setDateTimeSelection] = useState<Record<string, string[]>>({});
  const [dateTimeInput, setDateTimeInput] = useState<string>('');
  const [showPrice, setShowPrice] = useState<string>('');

  const getNowPlayingMovies = async () => {
    try {
      setNowPlayingMovies(dummyShowsData);
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
    }
  }

  const handleDateTimeAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split('T');
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] ?? [];
      if (!times.includes(time)) {
        return {
          ...prev,
          [date]: [...times, time],
        };
      }
      return prev;
    });
  }

  const handleRemoveTime = (date: string, time: string) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = (prev[date] ?? []).filter(t => t !== time);
      if (filteredTimes.length === 0) {
        // rimuove del tutto la chiave se non restano orari
        const { [date]: _omitted, ...rest } = prev;
        return rest;
      }

      // altrimenti aggiorna la data con gli orari rimanenti
      return {
        ...prev,
        [date]: filteredTimes,
      }
    })
  };
  useEffect(() => {
    getNowPlayingMovies();
  }, []);

  if (nowPlayingMovies.length === 0) {
    return <Loader />;
  }
  return (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <button
              key={movie.id}
              className={`relative max-w-40 group-hover:not-hover:opacity-40 hover:-translate-y-1 transition-transform duration-300`}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img src={movie.poster_path} alt="poster" className='w-full object-cover brightness-90' />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-300">{formatNumberWithK(movie.vote_count)} Votes</p>
                </div>
              </div>
              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <p className="truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Show price input */}
      <form className='mt-8'>
        <label className="block text-sm mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            type="number"
            value={showPrice}
            min={0}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder='Enter show price'
            className="outline-none"
          />
        </div>
      </form>

      {/* Date & Time Selection */}
      <form className="mt-6" onSubmit={handleDateTimeAdd}>
        <label className="block text-sm mb-2">Select Date and Time</label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md"
            step={60}
          />
          <button className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary transition-colors duration-300">
            Add Time
          </button>
        </div>
      </form>

      {/* Display Selected Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2">Selected Date-Time</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div>{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div key={time} className='border border-primary px-2 py-1 flex items-center rounded'>
                      <span>{time}</span>
                      <DeleteIcon
                        width={15}
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleRemoveTime(date, time)}
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default AddShows