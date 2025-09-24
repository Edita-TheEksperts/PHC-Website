import React from "react";

const DashboardLink = () => {
  return (
    <div>
      Sie können Ihre Rechnungen hier einsehen:{" "}
      <a
        href="http://localhost:3000/client-dashboard"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontWeight: "bold", textDecoration: "underline" }}
      >
        Zum Dashboard
      </a>
      . <br />
      Falls Sie nicht eingeloggt sind, werden Sie automatisch zur{" "}
      <a
        href="http://localhost:3000/login"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontWeight: "bold", textDecoration: "underline" }}
      >
        Login
      </a>{" "}
      -Seite weitergeleitet.
    </div>
  );
};

export default DashboardLink;
