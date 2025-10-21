import React, { useState } from "react";

export default function DateEmployee({ form, setForm, handleChange, hidden }) {
  const [openStartIndex, setOpenStartIndex] = useState(null);
  const [openEndIndex, setOpenEndIndex] = useState(null);

  const allDays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];

  const availableDays = allDays;

  const generateTimeOptions = (start = "07:00", end = "23:00") => {
    const options = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    while (h < endH || (h === endH && m <= endM)) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      options.push(`${hh}:${mm}`);
      m += 30;
      if (m >= 60) {
        m = 0;
        h += 1;
      }
    }
    return options;
  };

  const addDay = () => {
    if (!form.newAvailableDay) return;
    const updated = [
      ...(form.availabilityDays || []),
      { day: form.newAvailableDay, startTime: "08:00", endTime: "10:00" },
    ];
    setForm((prev) => ({
      ...prev,
      availabilityDays: updated,
      newAvailableDay: "",
    }));
  };

  const updateTime = (index, type, value) => {
    const updated = [...form.availabilityDays];
    updated[index][type] = value;
    setForm((prev) => ({ ...prev, availabilityDays: updated }));
  };

  const removeDay = (index) => {
    const updated = form.availabilityDays.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, availabilityDays: updated }));
  };

  return (
<div className="mb-14">
  <h3 className="font-semibold mb-6 text-lg text-gray-900 tracking-wide">
    Ihre Verfügbarkeit
  </h3>

  {/* Add new day */}
  <div className="flex flex-wrap gap-3 mb-8 items-center">
    <select
      value={form.newAvailableDay || ""}
      onChange={(e) =>
        setForm((prev) => ({ ...prev, newAvailableDay: e.target.value }))
      }
      className="border border-gray-300 bg-white px-4 py-2 rounded-full w-56 text-sm focus:ring-2 focus:ring-gray-300 focus:outline-none transition"
    >
      <option value="">Wochentag wählen</option>
      {availableDays.map((day) => (
        <option key={day} value={day}>
          {day}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={addDay}
      className="px-5 py-2 bg-[#0C243C] text-white text-sm font-medium rounded-full hover:bg-[#123a60] transition"
    >
      Hinzufügen
    </button>
  </div>

  {/* Availability cards */}
  <div className="flex flex-wrap gap-4">
    {form.availabilityDays?.map((entry, index) => (
      <div
        key={index}
        className="flex items-center justify-between w-[270px] bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">
            {entry.day}
          </span>
          <span className="text-sm text-gray-500">
            {entry.startTime} – {entry.endTime}
          </span>
        </div>

        <button
          onClick={() => removeDay(index)}
          className="p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition"
          aria-label="Entfernen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    ))}
  </div>
</div>

  );
}
