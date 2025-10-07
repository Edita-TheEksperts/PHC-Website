import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EmailTemplatesAdmin() {
  const [emails, setEmails] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ subject: "", body: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/emails")
      .then(res => res.json())
      .then(setEmails);
  }, []);

  const startEdit = (email) => {
    setEditing(email.id);
    setForm({ subject: email.subject, body: email.body });
  };

  const saveEdit = async () => {
    const res = await fetch("/api/admin/emails", {
      method: "PUT",  
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing, ...form }),
    });
    const updated = await res.json();
    setEmails(emails.map(e => (e.id === updated.id ? updated : e)));
    setEditing(null);
  };

  const highlightPlaceholders = (text) => {
    return text.replace(/{{(.*?)}}/g,
      `<span class="px-1 bg-yellow-200 text-yellow-900 rounded">{{$1}}</span>`
    );
  };

  const filtered = emails.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Search bar */}
      <input
        type="text"
        placeholder="🔍 Search templates..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4 focus:ring focus:ring-blue-300"
      />

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((email) => (
          <div
            key={email.id}
            className="p-6 border rounded-xl shadow bg-white hover:shadow-md transition flex flex-col"
          >
            {editing === email.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Email Subject"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                />

                <ReactQuill
                  theme="snow"
                  value={form.body}
                  onChange={(value) => setForm({ ...form, body: value })}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      [{ 'align': [] }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                />

                <div className="flex gap-3">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                  >
                    ✖ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900">{email.subject}</h3>
                <div
                  className="mt-2 text-sm text-gray-500"
                >
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                    {email.name}
                  </span>
                </div>
                <div
                  className="mt-3 p-3 bg-gray-50 rounded border text-gray-700 h-32 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: highlightPlaceholders(email.body) }}
                />
                <button
                  onClick={() => startEdit(email)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                >
                  ✏️ Edit Template
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
