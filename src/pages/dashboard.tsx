import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface EventDate {
  date?: string;     
  dateTime?: string;
}

interface Attendee {
  email?: string;
  displayName?: string;
  responseStatus?: string;
}

interface Event {
  id?: string;
  summary?: string;
  description?: string;
  htmlLink?: string;  
  attendees?: Attendee[];
  start?: EventDate;
  end?: EventDate;
}

/** Parse .dateTime or .date into a Date object. */
function parseEventDate(ed?: EventDate): Date | null {
  if (!ed) return null;
  const ds = ed.dateTime ?? ed.date;
  return ds ? new Date(ds) : null;
}

export default function Dashboard() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Searching, filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Sort preference: "desc" or "asc"
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Modal state for "View Details"
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/calendar-events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data || []);
        } else if (res.status === 401) {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [router]);

  /** 
   * Handle "AI Summaries" button: 
   * Calls /api/ai-summarize with summary+description 
   */
  const handleAISummary = async (ev: Event) => {
    const text = `${ev.summary ?? ""} ${ev.description ?? ""}`.trim();
    if (!text) {
      alert("No text available to summarize.");
      return;
    }
    try {
      const res = await fetch("/api/ai-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        alert("Failed to get AI summary from server.");
        return;
      }
      const data = await res.json();
      alert(`AI Summary:\n${data.summary}`);
    } catch (err) {
      console.error("AI Summaries Error:", err);
      alert("Error calling AI Summaries API");
    }
  };

  const handleRemindMe = (ev: Event) => {
    alert(`Mock reminder set for event: ${ev.summary}`);
  };

  const handleViewDetails = (ev: Event) => {
    setSelectedEvent(ev);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  /** Filtering & Sorting **/
  const fromDate = startDateFilter ? new Date(startDateFilter) : null;
  const toDate = endDateFilter ? new Date(endDateFilter) : null;

  let filteredEvents = events.filter((ev) =>
    ev.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredEvents = filteredEvents.filter((ev) => {
    const s = parseEventDate(ev.start);
    if (!s) return true;
    if (fromDate && s < fromDate) return false;
    if (toDate && s > toDate) return false;
    return true;
  });

  filteredEvents.sort((a, b) => {
    const aStart = parseEventDate(a.start)?.getTime() ?? 0;
    const bStart = parseEventDate(b.start)?.getTime() ?? 0;
    return sortOrder === "desc" ? bStart - aStart : aStart - bStart;
  });

  if (loading) {
    return <div className="p-4">Loading events...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Your Calendar Events</h1>
        <button
          className="text-blue-600"
          onClick={() => (window.location.href = "/api/auth/logout")}
        >
          Sign Out
        </button>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-4">
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="w-full md:w-1/2">
            <label className="block text-sm text-gray-600 mb-1">
              Search by Title
            </label>
            <input
              type="text"
              placeholder="e.g. 'Team Meeting'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>

          <div className="w-full md:w-1/2 flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="block text-sm text-gray-600">Sort Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="desc">Most Recent First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Table */}
        {filteredEvents.length === 0 ? (
          <p className="mt-4">No events found.</p>
        ) : (
          <table className="mt-4 w-full bg-white border rounded shadow">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Start
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  End
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev) => {
                const startDateObj = parseEventDate(ev.start);
                const endDateObj = parseEventDate(ev.end);
                const startStr = startDateObj
                  ? startDateObj.toLocaleString()
                  : "N/A";
                const endStr = endDateObj
                  ? endDateObj.toLocaleString()
                  : "N/A";

                return (
                  <tr key={ev.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <span className="font-semibold">
                        {ev.summary ?? "Untitled Event"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {startStr}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {endStr}
                    </td>
                    <td className="px-4 py-2 text-sm space-x-2">
                      <button
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                        onClick={() => handleViewDetails(ev)}
                      >
                        Details
                      </button>
                      <button
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                        onClick={() => handleAISummary(ev)}
                      >
                        AI Summaries
                      </button>
                      <button
                        className="bg-pink-100 text-pink-700 px-2 py-1 rounded hover:bg-pink-200"
                        onClick={() => handleRemindMe(ev)}
                      >
                        Remind Me
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for "Details" */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowModal(false);
                setSelectedEvent(null);
              }}
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selectedEvent.summary ?? "No Title"}
            </h2>
            <p className="text-sm text-gray-500">
              <strong>Start:</strong>{" "}
              {parseEventDate(selectedEvent.start)?.toLocaleString() ?? "N/A"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <strong>End:</strong>{" "}
              {parseEventDate(selectedEvent.end)?.toLocaleString() ?? "N/A"}
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Description: </strong>
              {selectedEvent.description ?? "No description provided."}
            </p>

            {selectedEvent.attendees?.length ? (
              <div className="mb-2">
                <strong>Attendees:</strong>
                <ul className="list-disc list-inside ml-4">
                  {selectedEvent.attendees.map((a, idx) => (
                    <li key={idx} className="text-gray-700">
                      {a.displayName ?? a.email} ({a.responseStatus ?? "unknown"})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-700 mb-2">
                <strong>Attendees: </strong>N/A
              </p>
            )}

            {selectedEvent.htmlLink ? (
              <p className="text-blue-600 underline mb-4">
                <a
                  href={selectedEvent.htmlLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  View in Google Calendar
                </a>
              </p>
            ) : null}

            {/* Optional "Remind Me" inside the modal as well */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => handleRemindMe(selectedEvent)}
            >
              Remind Me
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
