export default function DateEmployee({ form, setForm }) {
  const allDays = [
    "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag",
  ];

  const availableDays = allDays.filter(
    (day) => !form.availabilityDays?.some((entry) => entry.day === day)
  );

  const addDay = () => {
    if (!form.newAvailableDay) return;
    const updated = [
      ...(form.availabilityDays || []),
      {
        day: form.newAvailableDay,
        startTime: "08:00",
        endTime: "17:00",
      },
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Ihre Verfügbarkeit</h3>

      <div className="flex gap-4 items-center">
        <select
          value={form.newAvailableDay || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, newAvailableDay: e.target.value }))}
          className="border border-gray-300 px-4 py-2 rounded-md w-52 text-sm focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
        >
          <option value="">Wochentag wählen</option>
          {availableDays.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={addDay}
          className="px-4 py-2 bg-[#B99B5F] text-white rounded-md text-sm hover:bg-[#a2884f] transition"
        >
          + Hinzufügen
        </button>
      </div>

      {form.availabilityDays?.map((entry, index) => (
        <div key={index} className="flex gap-4 items-center bg-gray-100 p-3 rounded-md">
          <span className="min-w-[80px] font-medium">{entry.day}</span>
          <input
            type="time"
            value={entry.startTime}
            onChange={(e) => updateTime(index, "startTime", e.target.value)}
            className="border rounded px-2 py-1"
          />
          <span>bis</span>
          <input
            type="time"
            value={entry.endTime}
            onChange={(e) => updateTime(index, "endTime", e.target.value)}
            className="border rounded px-2 py-1"
          />
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
