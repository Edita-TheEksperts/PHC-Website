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
    <div className="mb-4" hidden={hidden}>
      <h3 className="font-medium mb-1">Ihre Verfügbarkeit</h3>

      <div className="flex gap-4 items-center">
        <select
          value={form.newAvailableDay || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, newAvailableDay: e.target.value }))
          }
          className="border border-gray-300 px-4 py-2 rounded-md w-52 text-sm focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
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
          className="px-4 py-2 bg-[#B99B5F] text-white rounded-full text-sm hover:bg-[#a2884f] transition"
        >
          +
        </button>
      </div>

      {form.availabilityDays?.map((entry, index) => (
        <div
          key={`${entry.day}-${index}`}
          className="flex gap-4 items-center bg-gray-100 p-3 rounded-md flex-wrap relative"
        >
          <span className="min-w-[80px] font-medium">{entry.day}</span>

          {/* START TIME */}
          <div className="relative">
            <button
              type="button"
              className="border px-4 py-3 rounded-md text-base bg-white w-32 text-left shadow-sm"
              onClick={() =>
                setOpenStartIndex(openStartIndex === index ? null : index)
              }
            >
              {entry.startTime}
            </button>

            {openStartIndex === index && (
              <div className="absolute mt-1 bg-white border rounded-lg shadow-lg grid grid-cols-4 gap-3 p-3 z-10 max-h-72 overflow-y-auto w-72">
                {generateTimeOptions().map((time) => (
                  <button
                    key={time}
                    className={`text-base px-3 py-2 rounded-lg transition-all hover:bg-[#B99B5F] hover:text-white ${
                      entry.startTime === time
                        ? "bg-[#B99B5F] text-white"
                        : "bg-gray-50"
                    }`}
                    onClick={() => {
                      updateTime(index, "startTime", time);
                      setOpenStartIndex(null);
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span>bis</span>

          {/* END TIME */}
          <div className="relative">
            <button
              type="button"
              className="border px-4 py-3 rounded-md text-base bg-white w-32 text-left shadow-sm"
              onClick={() =>
                setOpenEndIndex(openEndIndex === index ? null : index)
              }
            >
              {entry.endTime}
            </button>

            {openEndIndex === index && (
              <div className="absolute mt-1 bg-white border rounded-lg shadow-lg grid grid-cols-4 gap-3 p-3 z-10 max-h-72 overflow-y-auto w-72">
                {generateTimeOptions().map((time) => (
                  <button
                    key={time}
                    className={`text-base px-3 py-2 rounded-lg transition-all hover:bg-[#B99B5F] hover:text-white ${
                      entry.endTime === time
                        ? "bg-[#B99B5F] text-white"
                        : "bg-gray-50"
                    }`}
                    onClick={() => {
                      updateTime(index, "endTime", time);
                      setOpenEndIndex(null);
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => removeDay(index)}
            className="text-red-600 text-sm hover:underline ml-auto"
          >
            Entfernen
          </button>
        </div>
      ))}
    </div>
  );
}
