// pages/admin/clients/[id].jsx
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function ClientDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ edit
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  const [showSchedules, setShowSchedules] = useState(false);

  function formatDate(dateString) {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "—";
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}.${d.getFullYear()}`;
  }

  useEffect(() => {
    if (!id) return;

    async function fetchClient() {
      setLoading(true);
      try {
        const res = await fetch(`/api/clients/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setClient(null);
          return;
        }
        setClient(data);
      } catch (err) {
        setClient(null);
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [id]);

  const uniqueAssignments = useMemo(() => {
    const list = client?.assignments || [];
    const filtered = list.filter((a) => a?.employee?.id);
    return Array.from(new Map(filtered.map((a) => [a.employee.id, a])).values());
  }, [client]);

  useEffect(() => {
    if (!client) return;
    console.log("client updated", client);
  }, [client]);

  // =========================================================
  // ✅ HELPERS
  // =========================================================

  const EXCLUDE_KEYS = new Set([
    "passwordHash",
    "resetToken",
    "resetTokenExpiry",
    "stripeCustomerId",
    "stripePaymentMethodId",
    "paymentIntentId",
    "services",
    "subServices",
    "assignments",
    "schedules",
    "transactions",
    "reminders",
    "vouchers",
    "activityLogs",
    "vacations",
  ]);

  // ✅ SAME LIST AS API (so frontend only edits what backend accepts)
  const ALLOWED_FIELDS = useMemo(
    () => [
      "anrede",
      "firstName",
      "lastName",
      "email",
      "phone",
      "languages",

      "careStreet",
      "carePostalCode",
      "careCity",

      "frequency",
      "duration",

      "emergencyContactName",
      "emergencyContactPhone",

      // Fragebogen
      "hasAllergies",
      "allergyDetails",
      "healthFindings",
      "medicalFindings",
      "mobility",
      "mobilityAids",
      "householdRooms",
      "householdPeople",
      "cooking",
      "jointCooking",
      "shoppingType",
      "shoppingWithClient",
      "communicationVision",
      "communicationSehen",
      "communicationHearing",
      "communicationHören",
      "communicationSpeech",
      "communicationSprechen",

      // (optional extra questionnaire keys if your backend has them)
      "careFirstName",
      "careLastName",
      "requestFirstName",
      "requestLastName",
      "arrivalKeyStored",
      "arrivalSomeoneHome",
      "parkingAvailable",
      "entranceLocation",
      "additionalInfo",

      "doctorVisits",
      "physioVisits",
      "authorityVisits",
      "postKeyWhere",
      "postBoxWhich",
      "otherAccompaniments",

      "companionship",
      "biographyWork",
      "reading",
      "cardgames",
      "trips",

      "heightCm",
      "weightKg",
      "careTools",
      "incontinence",
      "foodSupport",
      "swallowingProblems",
      "appetiteLoss",
      "hygieneSupport",
      "dressingSupport",
      "mentalHealthNotes",
      "diagnosisDepression",
      "diagnosisDementia",
      "diagnosisAlzheimer",
      "restlessness",
      "dayNightReversed",
      "wandering",
      "personalityChange",
      "aggressiveness",
      "apathy",

      "houseTasksBalcony",
      "houseTasksLaundry",
      "houseTasksCooking",
      "houseTasksWindows",
      "houseTasksBedSheets",
      "houseTasksTidyUp",
      "houseTasksTrash",
      "houseTasksDusting",
      "houseTasksVacuum",
      "houseTasksMop",
      "houseTasksCurtains",
      "petsInHousehold",
      "otherLanguage",
    ],
    []
  );

  const ALLOWED_SET = useMemo(() => new Set(ALLOWED_FIELDS), [ALLOWED_FIELDS]);

  // =========================================================
  // ✅ FIELD LABELS (RENAMED) — used inside Fragebogen + general
  // =========================================================
  const FIELD_LABELS = {
    // Persönliche Daten
    anrede: "Anrede",
    firstname: "Vorname",
    lastname: "Nachname",

    // Zu betreuende Person (Einsatzort)
    carefirstname: "Vorname (zu betreuende Person)",
    carelastname: "Nachname (zu betreuende Person)",

    // Anfragende Person
    requestfirstname: "Vorname (anfragende Person)",
    requestlastname: "Nachname (anfragende Person)",

    role: "Rolle",
    status: "Status",

    // Kontakt
    email: "E-Mail",
    phone: "Telefonnummer",
    languages: "Sprachen",
    otherlanguage: "Sonstige Sprache",

    // Adresse (Einsatzort / Betreuung)
    carestreet: "Strasse",
    carepostalcode: "PLZ",
    carecity: "Ort",

    // Service / Vertrag
    frequency: "Häufigkeit",
    duration: "Dauer (Std.)",
    firstdate: "Erstes Einsatzdatum",

    // Notfallkontakt
    emergencycontactname: "Notfallkontakt Name",
    emergencycontactphone: "Notfallkontakt Telefon",

    // Sektion 1 – Ankunft / Eingang
    arrivalkeystored: "Schlüssel ist hinterlegt",
    arrivalsomeonehome: "Es ist jemand zu Hause",
    parkingavailable: "Parkplatz vorhanden?",
    entrancelocation: "Wo befindet sich der Eingang?",
    additionalinfo: "Zusätzliche Informationen",

    // Sektion 2 – Alltagsbegleitung & Besorgungen
    doctorvisits: "Begleitung zu Terminen: Arzt",
    physiovisits: "Begleitung zu Terminen: Physiotherapie",
    authorityvisits: "Begleitung zu Terminen: Behördengänge",
    shoppingwithclient: "Begleitung durch die PHC?",
    shoppingtype: "Art der Einkäufe",
    postkeywhere: "Wo ist der Briefkastenschlüssel?",
    postboxwhich: "Welches Postfach?",
    otheraccompaniments: "Weitere Begleitungen",

    // Sektion 3 – Freizeit & soziale Aktivitäten
    companionship: "Gesellschaft leisten",
    jointcooking: "Gemeinsames Kochen",
    biographywork: "Biografiearbeit",
    reading: "Vorlesen",
    cardgames: "Gesellschaftsspiele / Kartenspiele",
    trips: "Ausflüge & Reisebegleitung",

    // Sektion 4 – Gesundheitsinformationen
    heightcm: "Grösse (cm)",
    weightkg: "Gewicht (kg)",
    mobility: "Zustand / Mobilität",
    mobilityaids: "Vorhandene Hilfsmittel",
    caretools: "Pflegehilfsmittel",
    incontinence: "Inkontinenz",
    communicationvision: "Sehen",
    communicationsehen: "Sehen",
    communicationhearing: "Hören",
    communicationhören: "Hören",
    communicationspeech: "Sprechen",
    communicationsprechen: "Sprechen",
    hasallergies: "Allergien vorhanden",
    allergydetails: "Allergiedetails",
    healthfindings: "Gesundheitliche Hinweise",
    medicalfindings: "Medizinische Befunde",
    foodsupport: "Nahrungsaufnahme: Unterstützung nötig",
    swallowingproblems: "Probleme beim Schlucken",
    appetiteloss: "Appetitlosigkeit",
    hygienessupport: "Grundpflege: Körperhygiene",
    dressingsupport: "Grundpflege: An-/Auskleiden",

    diagnosisdepression: "Diagnose: Depression",
    diagnosisdementia: "Diagnose: Demenz",
    diagnosisalzheimer: "Diagnose: Alzheimer",
    restlessness: "Starke Unruhe",
    daynightreversed: "Gestörter Tag-/Nachtrhythmus",
    wandering: "Weglauftendenz",
    personalitychange: "Persönlichkeitsveränderungen",
    aggressiveness: "Aggressivität",
    apathy: "Apathie",
    mentalhealthnotes: "Geistiger Zustand / Hinweise",

    // Sektion 5 – Haushaltshilfe & Wohnpflege
    householdrooms: "Anzahl Zimmer",
    householdpeople: "Wieviel-Personen-Haushalt?",
    housetasksbalcony: "Balkon- & Blumenpflege",
    housetaskslaundry: "Waschen / Bügeln / Verräumen",
    housetaskscooking: "Kochen",
    housetaskswindows: "Fenster putzen",
    housetasksbedsheets: "Bettwäsche wechseln",
    housetaskstidyup: "Aufräumen",
    housetaskstrash: "Abfall trennen / entsorgen",
    housetasksdusting: "Abstauben",
    housetasksvacuum: "Staubsaugen",
    housetasksmop: "Boden wischen",
    housetaskscurtains: "Vorhänge reinigen",
    petsinhousehold: "Haustiere im Haushalt?",
  };

  function labelize(key) {
    const lower = (key || "").toLowerCase();
    if (FIELD_LABELS[lower]) return FIELD_LABELS[lower];

    return (key || "")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase());
  }

  function formatPrimitiveValue(key, value) {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Ja" : "Nein";
    if (typeof value === "number") return String(value);

    if (typeof value === "string") {
      if (value.trim() === "") return "—";
      if (key.toLowerCase().includes("date") || key.toLowerCase().includes("at")) {
        const d = new Date(value);
        if (!Number.isNaN(d.getTime())) return d.toLocaleString();
      }
      return value;
    }

    return "—";
  }

  function normalizeForInput(key, value) {
    // keep booleans as booleans, numbers as numbers, strings as strings
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value;
    if (typeof value === "string") return value;
    return "";
  }

  function isLongText(key) {
    const k = (key || "").toLowerCase();
    return (
      k.includes("details") ||
      k.includes("findings") ||
      k.includes("diagnos") ||
      k.includes("notes") ||
      k.includes("comment") ||
      k.includes("beschreibung") ||
      k.includes("bemerk") ||
      k.includes("allergy") ||
      k.includes("medical") ||
      k.includes("health") ||
      k.includes("additionalinfo") ||
      k.includes("otheraccompaniments") ||
      k.includes("mentalhealthnotes")
    );
  }

  function inferFieldType(key, value) {
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    return "string";
  }

  function InputField({ fieldKey, value }) {
    const canEdit = ALLOWED_SET.has(fieldKey);
    const type = inferFieldType(fieldKey, value);

    if (!isEditing || !canEdit) {
      return (
        <span className="text-gray-900 break-words text-right flex-1">
          {formatPrimitiveValue(fieldKey, value)}
        </span>
      );
    }

    // ✅ boolean as select
    if (type === "boolean") {
      return (
        <select
          className="w-full max-w-[420px] border rounded-lg px-3 py-2 text-gray-900"
          value={formData[fieldKey] === true ? "true" : formData[fieldKey] === false ? "false" : ""}
          onChange={(e) => {
            const v = e.target.value;
            setFormData((p) => ({
              ...p,
              [fieldKey]: v === "true" ? true : v === "false" ? false : null,
            }));
          }}
        >
          <option value="">—</option>
          <option value="true">Ja</option>
          <option value="false">Nein</option>
        </select>
      );
    }

    // ✅ number
    if (type === "number") {
      return (
        <input
          type="number"
          className="w-full max-w-[420px] border rounded-lg px-3 py-2 text-gray-900"
          value={formData[fieldKey] ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            setFormData((p) => ({
              ...p,
              [fieldKey]: raw === "" ? null : Number(raw),
            }));
          }}
        />
      );
    }

    // ✅ string (textarea for long)
    if (isLongText(fieldKey)) {
      return (
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-gray-900 min-h-[90px]"
          value={formData[fieldKey] ?? ""}
          onChange={(e) => setFormData((p) => ({ ...p, [fieldKey]: e.target.value }))}
        />
      );
    }

    return (
      <input
        type="text"
        className="w-full max-w-[520px] border rounded-lg px-3 py-2 text-gray-900"
        value={formData[fieldKey] ?? ""}
        onChange={(e) => setFormData((p) => ({ ...p, [fieldKey]: e.target.value }))}
      />
    );
  }

  function startEdit() {
    if (!client) return;

    // preload only allowed fields so form is clean
    const initial = {};
    for (const key of ALLOWED_FIELDS) {
      initial[key] = normalizeForInput(key, client[key]);
    }

    setFormData(initial);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setSaving(false);
    setFormData({});
  }

  async function saveEdit() {
    if (!id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Speichern fehlgeschlagen");
        return;
      }

      // refresh client data (merge but also keep relations in UI)
      setClient((prev) => ({
        ...prev,
        ...data,
      }));

      setIsEditing(false);
      setFormData({});
    } catch (e) {
      alert("Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // ✅ AUTO-FIELDS FROM PRISMA (flat primitive fields)
  // =========================================================

  const mergedClient = useMemo(() => {
    if (!client) return null;
    if (!isEditing) return client;
    // show edited values live
    return {
      ...client,
      ...formData,
    };
  }, [client, isEditing, formData]);

  const allClientFields = useMemo(() => {
    if (!mergedClient) return [];

    return Object.entries(mergedClient)
      .filter(([key, value]) => {
        if (EXCLUDE_KEYS.has(key)) return false;
        const t = typeof value;
        if (value === null) return true;
        if (t === "string" || t === "number" || t === "boolean") return true;
        return false;
      })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({
        key,
        label: labelize(key),
        rawValue: value,
        value: formatPrimitiveValue(key, value),
      }));
  }, [mergedClient]);

  // =========================================================
  // ✅ FRAGEBOGEN SECTIONS (like screenshot: Sektion 1..5)
  // =========================================================

  const QUESTIONNAIRE_SECTIONS = useMemo(
    () => [
   {
  id: "sektion-1",
  title: "Sektion 1 — Persönliche Angaben (Zusammenfassung)",
  fields: [
    // ✅ Zu betreuende Person / Einsatzort
    { key: "careFirstName", label: "Vorname (zu betreuende Person)" },
    { key: "careLastName", label: "Nachname (zu betreuende Person)" },
    { key: "carePhone", label: "Telefonnummer (zu betreuende Person)" },

    // ✅ Kontakt (anfragende Person / account)
    { key: "phone", label: "Telefonnummer" },
    { key: "email", label: "E-Mail" },

    // ✅ Adresse Einsatzort
    { key: "careStreet", label: "Strasse" },
    { key: "carePostalCode", label: "PLZ" },
    { key: "careCity", label: "Ort" },

    // ✅ Anfragende Person
    { key: "requestFirstName", label: "Vorname (anfragende Person)" },
    { key: "requestLastName", label: "Nachname (anfragende Person)" },
    { key: "requestPhone", label: "Telefonnummer (anfragende Person)" },
    { key: "requestEmail", label: "E-Mail (anfragende Person)" },

    // ✅ Ankunftsbedingungen / Eingang
    { key: "careArrivalConditions", label: "Ankunftsbedingungen" },
    { key: "careHasParking", label: "Parkplatz vorhanden?" },
    { key: "mailboxKeyLocation", label: "Wo ist der Briefkastenschlüssel?" },
    { key: "postfach", label: "Welches Postfach?" },
    { key: "careEntrance", label: "Wo befindet sich der Eingang?" },
    { key: "careEntranceDetails", label: "Eingang Details" },

    // ✅ Additional info
    { key: "specialRequests", label: "Zusätzliche Informationen / Wünsche" },
  ],
}
,
    {
  id: "sektion-2",
  title: "Sektion 2 — Alltagsbegleitung & Besorgungen",
  fields: [
    // ✅ Begleitung zu Terminen (Arzt / Physiotherapie / Behördengänge)
    { key: "appointmentTypes", label: "Begleitung zu Terminen" },
    { key: "appointmentOther", label: "Sonstiges (Termine)" },

    // ✅ Einkäufe
    { key: "shoppingWithClient", label: "Begleitung durch die PHC?" },
    { key: "shoppingItems", label: "Art der Einkäufe" },

    // ✅ Postgänge
    { key: "mailboxKeyLocation", label: "Wo ist der Briefkastenschlüssel?" },
    { key: "postfach", label: "Welches Postfach?" },

    // ✅ Weitere Begleitungen
    { key: "additionalAccompaniment", label: "Weitere Begleitungen" },
  ],
}
,
  {
  id: "sektion-3",
  title: "Sektion 3 — Freizeit & soziale Aktivitäten",
  fields: [
    { key: "companionship", label: "Gesellschaft leisten" },
    { key: "jointCooking", label: "Gemeinsames Kochen" },
    { key: "biographyWork", label: "Biografiearbeit" },
    { key: "reading", label: "Vorlesen" },
    { key: "cardGames", label: "Gesellschaftsspiele" },
    { key: "trips", label: "Ausflüge & Reisebegleitung" },
  ],
}
,
{
  id: "sektion-4",
  title: "Sektion 4 — Gesundheitsinformationen",
  fields: [
    // ✅ Körperliche Unterstützung
    { key: "height", label: "Grösse (cm)" },
    { key: "weight", label: "Gewicht (kg)" },

    { key: "physicalState", label: "Zustand" },

    // ✅ Vorhandene Hilfsmittel
    { key: "mobilityAids", label: "Vorhandene Hilfsmittel" },
    { key: "toolsAvailable", label: "Pflegehilfsmittel" },
    { key: "toolsOther", label: "Pflegehilfsmittel (Sonstige)" },

    // ✅ Mobilität
    { key: "mobility", label: "Mobilität" },

    // ✅ Inkontinenz
    { key: "incontinence", label: "Inkontinenz" },
    { key: "incontinenceTypes", label: "Art der Inkontinenz" },

    // ✅ Kommunikation
    { key: "communicationVision", label: "Sehen" },
    { key: "communicationHearing", label: "Hören" },
    { key: "communicationSpeech", label: "Sprechen" },

    // ✅ Nahrungsaufnahme
    { key: "foodSupport", label: "Unterstützung notwendig" },
    { key: "foodSupportTypes", label: "Art der Unterstützung" },

    // ✅ Grundpflege
    { key: "basicCare", label: "Grundpflege" },
    { key: "basicCareNeeds", label: "Grundpflege Bedarf" },
    { key: "basicCareOtherField", label: "Grundpflege Sonstiges" },

    // ✅ Geistiger Zustand – Diagnosen
    { key: "mentalDiagnoses", label: "Diagnosen" },

    // ✅ Verhaltensmerkmale
    { key: "behaviorTraits", label: "Verhaltensmerkmale" },

    // ✅ Gesundheitsbefunde / Hinweise
    { key: "medicalFindings", label: "Gesundheitsbefunde" },
    { key: "healthFindings", label: "Gesundheitliche Hinweise" },
  ],
}
,
  {
  id: "sektion-5",
  title: "Sektion 5 — Haushaltshilfe & Wohnpflege",
  fields: [
    // ✅ Allgemeines
    { key: "householdRooms", label: "Anzahl Zimmer" },
    { key: "householdPeople", label: "Wieviel-Personen-Haushalt?" },

    // ✅ Tätigkeiten (checkbox list in UI) — stored as Json
    { key: "householdTasks", label: "Ihre Tätigkeiten aus" },

    // ✅ Sonstige Angaben
    { key: "languages", label: "Wunschsprache der Betreuungsperson" },
    { key: "otherLanguage", label: "Sonstige Sprache" },

    { key: "pets", label: "Haustiere im Haushalt?" },

    // ✅ Allergien (photo has dropdown)
    { key: "hasAllergies", label: "Allergien" },
    { key: "allergyWhich", label: "Welche Allergien?" },
    { key: "allergyDetails", label: "Allergie Details" },
  ],
}

    ],
    []
  );

  const questionnaireUsedKeys = useMemo(() => {
    const s = new Set();
    for (const sec of QUESTIONNAIRE_SECTIONS) {
      for (const f of sec.fields) s.add(f.key);
    }
    return s;
  }, [QUESTIONNAIRE_SECTIONS]);

  const remainingQuestionnaireFields = useMemo(() => {
    // show any other primitive fields that are NOT already displayed in Sektion 1..5
    // (so you "don't lose" anything)
    return (allClientFields || []).filter((f) => {
      const k = f.key;
      if (EXCLUDE_KEYS.has(k)) return false;
      if (questionnaireUsedKeys.has(k)) return false;

      // keep Prisma/meta + other fields too, but this "Weitere Felder" stays under Fragebogen
      // (so your request "dont remove something" is respected)
      return true;
    });
  }, [allClientFields, questionnaireUsedKeys]);

  function FieldRow({ label, fieldKey }) {
    return (
      <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 items-start">
        <strong className="text-gray-700">{label}</strong>
        <div className="flex justify-end min-w-0">
          <InputField fieldKey={fieldKey} value={mergedClient?.[fieldKey]} />
        </div>
      </li>
    );
  }

  // =========================================================
  // ✅ RETURNS LAST
  // =========================================================

  if (loading) return <p className="p-6 text-gray-600">Loading client data...</p>;
  if (!client) return <p className="p-6 text-red-600">Client not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="border-b pb-4 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#04436F]">Kundenprofil</h1>
          <p className="text-lg text-gray-600 mt-1">
            {client.firstName || "—"} {client.lastName || ""}
          </p>
        </div>

        {/* ✅ Edit actions (LEFT SIDE ONLY) */}
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={startEdit}
              className="px-5 py-2 bg-white border border-[#04436F] text-[#04436F] rounded-lg hover:bg-[#f3f7fb] transition font-medium"
            >
              Bearbeiten
            </button>
          ) : (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="px-5 py-2 bg-white border rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-60"
              >
                Abbrechen
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-5 py-2 bg-[#04436F] text-white rounded-lg hover:bg-[#033350] transition font-medium disabled:opacity-60"
              >
                {saving ? "Speichern..." : "Speichern"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="bg-white rounded-xl shadow p-8 border space-y-10">
          <h2 className="text-2xl font-bold text-[#04436F]">Funnel & Persönliche Infos</h2>

          <div className="flex flex-col gap-8">
            <section className="bg-gray-50 rounded-xl border p-6 overflow-hidden">
              <h3 className="text-xl font-semibold text-[#04436F] mb-5">Persönliche Infos</h3>

              <ul className="grid gap-y-4 text-gray-800">
                <li className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 items-start">
                  <span className="text-sm font-medium text-gray-500">E-Mail</span>
                  <div className="w-full min-w-0 break-words">
                    <InputField fieldKey="email" value={mergedClient?.email} className="w-full" />
                  </div>
                </li>

                <li className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 items-start">
                  <span className="text-sm font-medium text-gray-500">Telefon</span>
                  <div className="w-full min-w-0">
                    <InputField fieldKey="phone" value={mergedClient?.phone} className="w-full" />
                  </div>
                </li>

                <li className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 items-start">
                  <span className="text-sm font-medium text-gray-500">Sprachen</span>
                  <div className="w-full min-w-0">
                    <InputField
                      fieldKey="languages"
                      value={mergedClient?.languages}
                      className="w-full"
                    />
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Adresse</h3>

              <ul className="space-y-3 text-gray-800">
                <li className="grid grid-cols-[160px_1fr] gap-4">
                  <strong className="text-gray-700">Strasse:</strong>
                  <div className="break-words">
                    <InputField fieldKey="careStreet" value={mergedClient?.careStreet} />
                  </div>
                </li>

                <li className="grid grid-cols-[160px_1fr] gap-4">
                  <strong className="text-gray-700">PLZ:</strong>
                  <div>
                    <InputField fieldKey="carePostalCode" value={mergedClient?.carePostalCode} />
                  </div>
                </li>

                <li className="grid grid-cols-[160px_1fr] gap-4">
                  <strong className="text-gray-700">Ort:</strong>
                  <div>
                    <InputField fieldKey="careCity" value={mergedClient?.careCity} />
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Notfallkontakt</h3>
              <ul className="space-y-3 text-gray-800">
                <li className="grid grid-cols-[160px_1fr] items-center gap-4">
                  <strong className="min-w-[140px] text-gray-700">Name:</strong>
                  <div className="flex-1 flex justify-end">
                    <InputField
                      fieldKey="emergencyContactName"
                      value={mergedClient?.emergencyContactName}
                    />
                  </div>
                </li>

                <li className="grid grid-cols-[160px_1fr] items-center gap-4">
                  <strong className="min-w-[140px] text-gray-700">Telefon:</strong>
                  <div className="flex-1 flex justify-end">
                    <InputField
                      fieldKey="emergencyContactPhone"
                      value={mergedClient?.emergencyContactPhone}
                    />
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Dienstleistungen</h3>
              {/* keep relations read-only */}
              <ul className="space-y-1 text-gray-800">
                <li>
                  <strong>Hauptdienstleistungen:</strong>{" "}
                  {(client.services || []).map((s) => s.name).join(", ") || "—"}
                </li>
                <li>
                  <strong>Nebendienstleistungen:</strong>{" "}
                  {(client.subServices || []).map((s) => s.name).join(", ") || "—"}
                </li>
              </ul>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-2">
                  Dienstleistungen werden hier nicht bearbeitet (Relations).
                </p>
              )}
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Service Präferenzen</h3>
              <ul className="space-y-3 text-gray-800">
                <li className="grid grid-cols-[160px_1fr] items-center gap-4">
                  <strong className="min-w-[140px] text-gray-700">Erstes Datum:</strong>
                  <span className="text-gray-900 break-words text-right flex-1">
                    {formatDate(client.firstDate)}
                  </span>
                </li>

                <li className="grid grid-cols-[160px_1fr] items-center gap-4">
                  <strong className="min-w-[140px] text-gray-700">Häufigkeit:</strong>
                  <div className="flex-1 flex justify-end">
                    <InputField fieldKey="frequency" value={mergedClient?.frequency} />
                  </div>
                </li>

                <li className="grid grid-cols-[160px_1fr] items-center gap-4">
                  <strong className="min-w-[140px] text-gray-700">Dauer:</strong>
                  <div className="flex-1 flex justify-end">
                    <InputField fieldKey="duration" value={mergedClient?.duration} />
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Meta</h3>
              <ul className="space-y-1 text-gray-800">
                <li>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      client.status === "canceled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {client.status || "open"}
                  </span>
                </li>
                <li>
                  <strong>Rolle:</strong> {client.role || "—"}
                </li>
                <li>
                  <strong>Angelegt:</strong>{" "}
                  {client.createdAt ? new Date(client.createdAt).toLocaleString() : "—"}
                </li>
                <li>
                  <strong>Aktualisiert:</strong>{" "}
                  {client.updatedAt ? new Date(client.updatedAt).toLocaleString() : "—"}
                </li>
              </ul>
            </section>

            {/* ✅ NEW: Fragebogen split into Sektion 1..5 (like screenshot) */}
            <section className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Fragebogen</h3>

              <div className="space-y-6">
                {QUESTIONNAIRE_SECTIONS.map((sec) => (
                  <div key={sec.id} className="bg-gray-50 p-6 rounded-xl border">
                    <h4 className="text-lg font-semibold text-[#04436F] mb-4">{sec.title}</h4>

                    <ul className="space-y-3 text-gray-800">
                      {sec.fields.map((f) => (
                        <FieldRow key={f.key} label={f.label} fieldKey={f.key} />
                      ))}
                    </ul>

                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-4">
                        Nur Felder aus der erlaubten Liste sind editierbar. Andere bleiben read-only.
                      </p>
                    )}
                  </div>
                ))}

             
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT (DO NOT TOUCH) */}
        <div className="bg-white rounded-xl shadow p-8 border space-y-10">
          <h2 className="text-2xl font-bold text-[#04436F]">Einsatzinformationen</h2>

          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Zuweisungen</h3>

            {uniqueAssignments.length > 0 ? (
              <ul className="space-y-3">
                {uniqueAssignments.map((a) => (
                  <li key={a.id} className="p-4 bg-white border rounded shadow-sm">
                    <p>
                      <strong>Mitarbeiter:</strong> {a.employee?.firstName} {a.employee?.lastName}
                    </p>
                    <p>
                      <strong>Status:</strong> {a.status || "—"}
                    </p>
                    <p>
                      <strong>Zugewiesen am:</strong> {formatDate(a.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Keine Einsätze gefunden</p>
            )}
          </div>

          {/* Schedules placeholder */}
          {showSchedules && (
            <div className="bg-gray-50 p-6 rounded-xl border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Schedules</h3>
              <p className="text-gray-500 italic">Noch nicht implementiert…</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8">
        <button
          onClick={() => router.push("/admin/clients")}
          className="px-6 py-2 bg-[#04436F] text-white rounded hover:bg-[#033350] transition"
        >
          ← Zurück zu Kunden
        </button>
      </div>
    </div>
  );
}
