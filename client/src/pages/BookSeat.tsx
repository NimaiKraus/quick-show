import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Movie } from '../types';
import { dummyDateTimeData, dummyShowsData } from '../dummyData';
import Loader from '../components/Loader';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import { isoTimeFormat } from '../lib/utils';
import BlurCircle from '../components/BlurCircle';
import { assets } from '../assets';
import toast from 'react-hot-toast';

const groupRows = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']];
const MAXIMUM_SEAT_SELECTABLE = 5;

const BookSeat = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTimeKey, setSelectedTimeKey] = useState<string | null>(null);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const { id, date } = useParams<{ id: string, date: string }>();
  const navigate = useNavigate();

  const isSeatSelected = (seatId: string) => {
    return selectedSeats.includes(seatId);
  }

  const handleSeatClick = (seatId: string) => {
    if (!selectedTimeKey) {
      toast("Please select a show time first", { icon: '⚠️' });
      return; // Prevent seat selection if no time is selected
    } else if (selectedSeats.length >= MAXIMUM_SEAT_SELECTABLE && !isSeatSelected(seatId)) {
      toast(`You can select a maximum of ${MAXIMUM_SEAT_SELECTABLE} seats`, { icon: '⚠️' });
      return; // Prevent selecting more than MAXIMUM_SEAT_SELECTABLE seats
    }

    if (isSeatSelected(seatId)) {
      setSelectedSeats(prev => prev.filter(seat => seat !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  }

  const renderSeatsGrid = (row: string, count: number) => {
    return (
      <div key={row} className='flex gap-2 mt-2'>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: count }, (_, index) => {
            const seatId = `${row}${index + 1}`;
            return (
              <button
                key={seatId}
                className={`w-8 h-8 rounded border border-primary/60 ${isSeatSelected(seatId) && 'bg-primary text-white'}`}
                onClick={() => handleSeatClick(seatId)}
              >
                {seatId}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const getMovie = async () => {
    const movie = dummyShowsData.find((movie) => movie._id === id);
    if (movie) {
      setCurrentMovie({
        ...movie,
        dateTime: dummyDateTimeData
      });
    }
  }

  useEffect(() => {
    getMovie();
  }, []);

  if (!currentMovie) {
    return <Loader />;
  }

  return (
    <div className='flex flex-col xl:flex-row max-xl:gap-8 max-xl:items-center px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/* Available Timings */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max xl:sticky md:top-30">
        <p className="text-lg font-semibold px-6 text-center">Available Timings</p>
        <div className='mt-5 space-y-1'>
          {(currentMovie.dateTime!)[date as keyof typeof currentMovie.dateTime].map((time) => {
            // Build a unique key per slot (use showId if it’s unique, or combine)
            const key = `${time.showId}:${time.time}`;
            const isSelected = selectedTimeKey === key;

            return (
              <button
                key={key}
                className={`flex items-center gap-2 px-6 py-2 w-max mx-auto rounded-md transition ${isSelected ? 'bg-primary text-white' : 'hover:bg-primary/20'}`}
                onClick={() => setSelectedTimeKey(key)}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(time.time)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seat Selection */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top='-100px' left='-100px' />
        <BlurCircle bottom='0' right='0' />

        <h1 className="text-2xl font-bold mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeatsGrid(row, 8))}
          </div>

          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, index) => (
              <div key={index}>
                {group.map((row) => renderSeatsGrid(row, 10))}
              </div>
            ))}
          </div>
        </div>

        <button
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full active:scale-95"
          onClick={() => navigate('/my-bookings')}
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default BookSeat