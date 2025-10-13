// src/pages/Contests.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import conf from '../conf/conf';

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      const username = conf.clist_userName;
      const apiKey = conf.clist_ApiKey;
      const now = new Date().toISOString();
      const platforms = '1,102,73,74,368';

      try {
        const res = await axios.get(`https://clist.by/api/v2/contest/`, {
          params: {
            start__gte: now,
            order_by: 'start',
            limit: 20,
            resource_id_in: platforms,
          },
          headers: {
            Authorization: `ApiKey ${username}:${apiKey}`,
          },
        });
        setContests(res.data.objects);
      } catch (err) {
        console.error('Error fetching contests:', err);
        setError('Failed to load contests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading contests...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reduced slightly for balance */}
        <h1 className="text-2xl md:text-3xl font-extrabold mb-10 text-center text-blue-600">
          🚀 Upcoming Competitions & Challenges
        </h1>

        {contests.length === 0 ? (
          <p className="text-gray-600 text-center text-base md:text-lg">
            No upcoming contests found right now. Stay tuned!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="flex flex-col justify-between p-6 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl bg-white transition-transform transform hover:-translate-y-1 duration-300"
              >
                <div>
                  {/* Reduced a bit for better hierarchy */}
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">
                    {contest.event}
                  </h3>

                  <span className="inline-block mb-3 px-3 py-1 text-xs md:text-sm font-semibold rounded-full bg-blue-100 text-blue-700">
                    {contest.host}
                  </span>

                  <p className="text-xs md:text-sm text-gray-600 mb-1">
                    📅 <strong>Start:</strong> {new Date(contest.start).toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    ⏰ <strong>End:</strong> {new Date(contest.end).toLocaleString()}
                  </p>
                </div>

                <a
                  href={contest.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-center px-5 py-2 text-sm md:text-base bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full shadow-md hover:from-blue-700 hover:to-blue-600 transition"
                >
                  Register Here →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contests;
