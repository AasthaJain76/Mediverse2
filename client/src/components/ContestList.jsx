import React, { useEffect, useState } from "react";

const platformsList = [
  "leetcode.com",
  "codeforces.com",
  "hackerrank.com",
  "hackerearth.com",
  "kaggle.com",
];

const dateOptions = ["All", "Today", "Next 7 Days"];

export default function ContestList() {
  const [contests, setContests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");

  useEffect(() => {
    fetch("https://cloud.appwrite.io/v1/functions/<YOUR_FUNCTION_ID>/executions", {
      method: "POST",
      headers: {
        "x-appwrite-project": "<YOUR_PROJECT_ID>",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const output = JSON.parse(data.responseBody);
        setContests(output.contests || []);
        setFiltered(output.contests || []);
      })
      .catch((err) => console.error("Error fetching contests:", err));
  }, []);

  // Apply filters
  useEffect(() => {
    let result = contests;

    if (selectedPlatform !== "All") {
      result = result.filter((c) => c.platform === selectedPlatform);
    }

    if (selectedDate === "Today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter((c) => c.start.startsWith(today));
    } else if (selectedDate === "Next 7 Days") {
      const now = new Date();
      const weekLater = new Date();
      weekLater.setDate(now.getDate() + 7);
      result = result.filter((c) => {
        const start = new Date(c.start);
        return start >= now && start <= weekLater;
      });
    }

    setFiltered(result);
  }, [selectedPlatform, selectedDate, contests]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Platforms</option>
          {platformsList.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>

        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          {dateOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Contest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 col-span-full">
            🚫 No contests found.
          </div>
        ) : (
          filtered.map((contest) => (
            <a
              key={contest.id}
              href={contest.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {contest.name}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                📌 Platform: <span className="font-medium">{contest.platform}</span>
              </p>
              <p className="text-sm text-gray-500">
                🕒 {new Date(contest.start).toLocaleString()} →{" "}
                {new Date(contest.end).toLocaleString()}
              </p>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
