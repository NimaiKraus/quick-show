import React, { useEffect, useState } from 'react'
import type { Booking } from '../../types';
import { dummyBookingData } from '../../dummyData';
import Loader from '../../components/Loader';
import Title from '../../components/admin/Title';
import { isoDateFormat } from '../../lib/utils';

const BookingsList = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getBookings = async () => {
    try {
      setIsLoading(true);
      setBookings(dummyBookingData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getBookings();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Title text1="Bookings" text2="List" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 pl-5">User Name</th>
              <th className="p-2">Movie Name</th>
              <th className="p-2">Show Time</th>
              <th className="p-2">Seats</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {bookings.map((booking, index) => (
              <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                <td className="p-2 min-w-45 pl-5">{booking.user.name}</td>
                <td className="p-2">{booking.show.movie.title}</td>
                <td className="p-2">{isoDateFormat(booking.show.showDateTime)}</td>
                <td className="p-2">{Object.keys(booking.bookedSeats).map(seat => booking.bookedSeats[seat as keyof typeof booking.bookedSeats]).join(", ")}</td>
                <td className="p-2">{currency} {booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default BookingsList