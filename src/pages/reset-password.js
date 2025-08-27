import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (router.isReady) {
      setResetToken(router.query.resetToken || "");
    }
  }, [router.isReady, router.query.resetToken]);

  async function handleReset(e) {
    e.preventDefault();

    if (!resetToken) {
      alert("Missing reset token.");
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    if (res.ok) {
      alert("Password reset successful!");
      window.location.href = "/login";
    } else {
      const data = await res.json();
      alert(data.message || "Something went wrong");
    }
  }

  if (!resetToken) {
    return <div className="text-center mt-20">Loading token...</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4 text-center text-[#04436F]">Setzen Sie Ihr Passwort zurück</h1>
      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New Password"
          className="border rounded p-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-[#04436F] text-white py-3 rounded">
Passwort zurücksetzen        </button>
      </form>
    </div>
  );
}
