import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";
import {
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function CreateVoucher() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    maxUses: 100,
    validFrom: new Date().toISOString().slice(0, 10),
    validUntil: "2025-12-31",
    isActive: true,
  });

  // Fetch vouchers
  async function fetchVouchers() {
    try {
      const res = await fetch("/api/admin/vouchers");
      const data = await res.json();
      if (Array.isArray(data.vouchers)) {
        setVouchers(data.vouchers);
        setFiltered(data.vouchers);
      }
    } catch (err) {
      console.error("❌ Error fetching vouchers:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    if (search.trim() === "") setFiltered(vouchers);
    else {
      const s = search.toLowerCase();
      setFiltered(
        vouchers.filter(
          (v) =>
            v.code.toLowerCase().includes(s) ||
            v.discountType.toLowerCase().includes(s)
        )
      );
    }
  }, [search, vouchers]);

  // CREATE or UPDATE
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `/api/admin/vouchers/${editing}`
        : "/api/admin/vouchers";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(editing ? "✏️ Gutschein aktualisiert!" : "✅ Gutschein erstellt!");
        setFormData({
          code: "",
          discountType: "percent",
          discountValue: "",
          maxUses: 100,
          validFrom: new Date().toISOString().slice(0, 10),
          validUntil: "2025-12-31",
          isActive: true,
        });
        setEditing(null);
        fetchVouchers();
      } else {
        alert("❌ Fehler: " + (data.error || "Operation fehlgeschlagen."));
      }
    } catch (error) {
      console.error("❌ Fehler:", error);
    }
  }

  async function handleDelete(id) {
    if (!confirm("⚠️ Diesen Gutschein wirklich löschen?")) return;
    try {
      const res = await fetch(`/api/admin/vouchers/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("🗑️ Gutschein gelöscht!");
        fetchVouchers();
      } else {
        alert("❌ Löschen fehlgeschlagen!");
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  }

  function handleEdit(voucher) {
    setEditing(voucher.id);
    setFormData({
      code: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      maxUses: voucher.maxUses,
      validFrom: voucher.validFrom?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      validUntil: voucher.validUntil?.slice(0, 10) || "2025-12-31",
      isActive: voucher.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              🎟 Gutscheinverwaltung
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Erstellen, bearbeiten oder löschen Sie Gutscheine.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin-dashboard")}
            className="text-blue-600 hover:underline text-sm mt-4 md:mt-0"
          >
            ← Zurück zum Dashboard
          </button>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-10">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="WELCOME10"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rabatt-Typ
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({ ...formData, discountType: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="percent">Prozent (%)</option>
                <option value="fixed">Fixbetrag (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wert
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue: e.target.value,
                  })
                }
                placeholder="10"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max. Verwendung
              </label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) =>
                  setFormData({ ...formData, maxUses: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gültig von
              </label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) =>
                  setFormData({ ...formData, validFrom: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gültig bis
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <label className="text-sm font-medium text-gray-700">
                Aktiv
              </label>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className={`w-full ${
                  editing
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-[#0F1F38] hover:opacity-90"
                } text-white py-3 rounded-lg font-medium shadow transition-all flex items-center justify-center gap-2`}
              >
                {editing ? (
                  <>
                    <CheckCircle2 size={18} /> Gutschein aktualisieren
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} /> Gutschein erstellen
                  </>
                )}
              </button>
            </div>
          </form>

          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setFormData({
                  code: "",
                  discountType: "percent",
                  discountValue: "",
                  maxUses: 100,
                  validFrom: new Date().toISOString().slice(0, 10),
                  validUntil: "2025-12-31",
                  isActive: true,
                });
              }}
              className="mt-4 text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
            >
              <XCircle size={16} /> Abbrechen
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Wird geladen...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-lg font-medium">Keine Gutscheine gefunden 😕</p>
              <p className="text-sm mt-2">
                Erstellen Sie Ihren ersten Gutschein oben.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-[#0F1F38] text-white text-sm uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Code</th>
                    <th className="px-6 py-3 font-semibold">Typ</th>
                    <th className="px-6 py-3 font-semibold">Wert</th>
                    <th className="px-6 py-3 font-semibold">Max.</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Gültig bis</th>
                    <th className="px-6 py-3 font-semibold">Erstellt am</th>
                    <th className="px-6 py-3 font-semibold text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => (
                    <tr
                      key={v.id}
                      className="border-t hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-6 py-3 font-medium">{v.code}</td>
                      <td className="px-6 py-3 capitalize">{v.discountType}</td>
                      <td className="px-6 py-3">{v.discountValue}</td>
                      <td className="px-6 py-3">{v.maxUses}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            v.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {v.isActive ? "Aktiv" : "Inaktiv"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {new Date(v.validUntil).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </td>
               <td className="px-6 py-3 text-center">
  <div className="flex items-center justify-center gap-3">
    <button
      onClick={() => handleEdit(v)}
      title="Bearbeiten"
      className="p-2 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-800 transition-all duration-200"
    >
      <Pencil size={16} />
    </button>

    <button
      onClick={() => handleDelete(v.id)}
      title="Löschen"
      className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 transition-all duration-200"
    >
      <Trash2 size={16} />
    </button>
  </div>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>
    </AdminLayout>
  );
}
