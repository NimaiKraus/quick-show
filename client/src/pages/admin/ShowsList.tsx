import React, { useEffect, useState } from 'react'
import Title from '../../components/admin/Title'
import type { ActiveShow } from '../../types';
import { dummyShowsData } from '../../dummyData';
import Loader from '../../components/Loader';
import { isoDateFormat } from '../../lib/utils';

const ShowsList = () => {
  const [shows, setShows] = useState<ActiveShow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currency = import.meta.env.VITE_CURRENCY;

  const getShows = async () => {
    try {
      setIsLoading(true);
      setShows([
        {
          _id: '1',
          movie: dummyShowsData[0],
          showDateTime: "2025-06-30T02:30:00.000Z",
          showPrice: 10,
          occupiedSeats: { A1: 'user1', A2: 'user2' },
        }
      ])
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getShows();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Title text1="Shows" text2="List" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 pl-5">Movie Name</th>
              <th className="p-2">Show Time</th>
              <th className="p-2">Total Bookings</th>
              <th className="p-2">Earnings</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {shows.map((show, index) => (
              <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                <td className="p-2">{isoDateFormat(show.showDateTime)}</td>
                <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                <td className="p-2">{currency} {show.showPrice * Object.keys(show.occupiedSeats).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ShowsList