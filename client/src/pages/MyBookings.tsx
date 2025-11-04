import React, { useEffect, useState } from 'react'
import type { Booking } from '../types';
import { dummyBookingData } from '../dummyData';
import Loader from '../components/Loader';
import BlurCircle from '../components/BlurCircle';
import { getHoursAndMinutes, isoDateFormat } from '../lib/utils';

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currency = import.meta.env.VITE_CURRENCY || '€';

  const getBookings = async () => {
    try {
      setIsLoading(true);
      // Fetch bookings from API or use dummy data
      setBookings(dummyBookingData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top={'100px'} left={'100px'} />
      <div>
        <BlurCircle bottom={'0'} left={'600px'} />
      </div>

      <h1 className="text-lg font-bold mb-4">My Bookings</h1>

      {bookings.map((booking) => (
        <div key={booking._id} className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl">
          <div className="flex flex-col md:flex-row">
            <img
              src={booking.show.movie.poster_path}
              alt="movie poster"
              className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'
            />
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{booking.show.movie.title}</p>
              <p className="text-sm text-gray-400">{getHoursAndMinutes(booking.show.movie.runtime)}</p>
              <p className="text-sm text-gray-400">{isoDateFormat(booking.show.showDateTime)}</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end md:text-right justify-end p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">{currency}{booking.amount}</p>
              {!booking.isPaid && <button className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full'>Pay Now</button>}
            </div>
            <div className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets:</span> {booking.bookedSeats.length}
              </p>
              <p>
                <span className="text-gray-400">Seat Number:</span> {booking.bookedSeats.join(', ')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyBookings