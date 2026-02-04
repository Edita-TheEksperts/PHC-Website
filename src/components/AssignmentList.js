import { useState } from "react";

export default function AssignmentsList({ confirmedAssignments = [], onUpdate }) {
  const today = new Date();
  const [updates, setUpdates] = useState({});

  const schedules = confirmedAssignments.flatMap((assignment) => {
    const client = assignment.user;

    if (!client?.schedules || client.schedules.length === 0) {
      return [{
        id: assignment.id,
        assignmentId: assignment.id,
        scheduleId: null,
        clientName: `${client.firstName} ${client.lastName}`,
        service: client.services?.map((s) => s.name).join(", ") || "—",
        date: null,
        startTime: null,
        status: "noSchedule",
        baseHours: 0,
        baseKm: 0,
      }];
    }

    return client.schedules.map((schedule) => {
      const date = schedule.date ? new Date(schedule.date) : null;
      let status = "future";
      if (schedule.status === "cancelled") status = "cancelled";
      else if (date) {
        if (date.toDateString() === today.toDateString()) status = "inProgress";
        else if (date < today) status = "done";
      }

      return {
        id: `${assignment.id}-${schedule.id}`,
        assignmentId: assignment.id,
        scheduleId: schedule.id,
        employeeId: assignment.employeeId,
        clientName: `${client.firstName} ${client.lastName}`,
        service: client.services?.map((s) => s.name).join(", ") || "—",
        date,
        startTime: schedule.startTime,
        status,
        baseHours: schedule.hours || 0,
        baseKm: schedule.kilometers || 0,
      };
  // Cancel schedule handler
  const handleCancel = async (s) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diesen Einsatz stornieren möchten?")) return;
    try {
      const res = await fetch("/api/schedule/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId: s.scheduleId }),
      });
      if (!res.ok) throw new Error("Stornierung fehlgeschlagen");
      alert("Einsatz wurde storniert und alle Parteien informiert.");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("❌ Fehler beim Stornieren:", err);
      alert("❌ Fehler beim Stornieren des Einsatzes.");
    }
  };

    });
  });

const handleSave = async (s) => {
  const { extraHours, extraKm } = updates[s.id] || {};

  console.log("SENDING TO API:", {
    scheduleId: s.scheduleId,
    extraHours,
    extraKm,
    employeeId: s.employeeId,
  });


    // ❌ ndalo vlerat negative
    if ((extraHours && extraHours < 0) || (extraKm && extraKm < 0)) {
      alert("❌ Nuk lejohen vlera negative.");
      return;
    }

if (
  (extraHours === "" || extraHours === undefined) &&
  (extraKm === "" || extraKm === undefined)
) return;

    try {
      const res = await fetch("/api/employee/update-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId: s.scheduleId,
          hours: Number(extraHours || 0),
          kilometers: Number(extraKm || 0),
            employeeId: s.employeeId,  

        }),
      });

      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();

      // reset input
      setUpdates((prev) => ({ ...prev, [s.id]: {} }));

      // update local values
      confirmedAssignments.forEach((a) => {
        a.user.schedules.forEach((sch) => {
          if (sch.id === s.scheduleId) {
            sch.hours = data.schedule.hours;
            sch.kilometers = data.schedule.kilometers;
          }
        });
      });

      if (onUpdate) onUpdate();

    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      alert("❌ Fehler beim Speichern der Daten.");
    }
  };

  const renderCard = (s) => (
    <div key={s.id} className="p-4 bg-white border rounded mb-3">
      <p><strong>Kunde:</strong> {s.clientName}</p>
      <p><strong>Service:</strong> {s.service}</p>

      {s.date ? (
        <p>
          <strong>Datum:</strong> {s.date.toLocaleDateString("de-DE")}
          {s.startTime && ` um ${s.startTime}`}
        </p>
      ) : (
        <p className="text-sm italic text-gray-500">Kein Datum</p>
      )}

      <p className="mt-2 text-sm text-gray-700">
        ⏱ Gespeichert: {s.baseHours} Std, {s.baseKm} km
      </p>

      {s.status === "done" && (
        <div className="mt-3 space-y-2">
          <input
            type="number"
            min="0"
            placeholder="Zusätzliche Stunden"
            className="border rounded p-2 w-full"
            value={updates[s.id]?.extraHours || ""}
            onChange={(e) =>
              setUpdates((prev) => ({
                ...prev,
                [s.id]: { ...prev[s.id], extraHours: e.target.value },
              }))
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Zusätzliche Kilometer"
            className="border rounded p-2 w-full"
            value={updates[s.id]?.extraKm || ""}
            onChange={(e) =>
              setUpdates((prev) => ({
                ...prev,
                [s.id]: { ...prev[s.id], extraKm: e.target.value },
              }))
            }
          />

          <button
            onClick={() => handleSave(s)}
            className="bg-[#04436F] text-white px-3 py-1 rounded"
          >
            Speichern
          </button>
        </div>
      )}

      {s.status === "inProgress" && (
        <div className="flex items-center gap-2 mt-2">
          <p className="text-blue-600 font-medium flex-1">🔄 Läuft gerade</p>
          <button
            onClick={() => handleCancel(s)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Stornieren
          </button>
        </div>
      )}

      {s.status === "future" && (
        <div className="flex items-center gap-2 mt-2">
          <p className="text-gray-500 italic flex-1">⏳ Geplant</p>
          <button
            onClick={() => handleCancel(s)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Stornieren
          </button>
        </div>
      )}

      {s.status === "cancelled" && (
        <p className="text-red-500 mt-2 font-semibold">❌ Storniert</p>
      )}

      {s.status === "noSchedule" && (
        <p className="text-orange-500 mt-2 italic">⚠️ Kein Termin geplant</p>
      )}
    </div>
  );

  return (
    <div className="p-2">
      {schedules.length === 0 && (
        <p className="text-sm text-gray-500">Keine bestätigten Einsätze.</p>
      )}

      <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">🔄 Läuft gerade</h4>
      {schedules.filter((s) => s.status === "inProgress").map(renderCard)}

      <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">✅ Erledigt</h4>
      {schedules.filter((s) => s.status === "done").map(renderCard)}

      <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">⏳ Geplant</h4>
      {schedules.filter((s) => s.status === "future").map(renderCard)}

      <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">❌ Storniert</h4>
      {schedules.filter((s) => s.status === "cancelled").map(renderCard)}
    </div>
  );
}
