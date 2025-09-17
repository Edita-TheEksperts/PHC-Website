import React from "react";

export default function KundigungPage() {
  return (
    <div className="flex">
     <>
   {/* --- MOBILE TOP NAVBAR --- */}
   <div className="lg:hidden bg-[#B99B5F] text-white shadow-lg w-full fixed top-0 left-0 z-50">
     {/* Top bar */}
     <div className="flex items-center justify-between p-4">
       <h1
         className="text-xl font-bold cursor-pointer"
         onClick={() => router.push("/client-dashboard")}
       >
         PHC
       </h1>
       <button onClick={() => setIsOpen(!isOpen)}>
         {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
       </button>
     </div>
   </div>
 
   {/* Fullscreen Mobile Menu Overlay */}
   {isOpen && (
     <div className="lg:hidden fixed inset-0 bg-[#B99B5F] text-white z-40 flex flex-col">
       {/* Top bar inside overlay */}
       <div className="flex items-center justify-between p-4 border-b border-white/20">
         <h1
           className="text-xl font-bold cursor-pointer"
           onClick={() => {
             router.push("/client-dashboard");
             setIsOpen(false);
           }}
         >
           PHC
         </h1>
         <button onClick={() => setIsOpen(false)}>
           <X className="w-6 h-6" />
         </button>
       </div>
 
       {/* Menu items */}
       <ul className="flex flex-col space-y-6 px-6 py-8 text-lg font-medium">
         <li
           onClick={() => {
             router.push("/client-dashboard");
             setIsOpen(false);
           }}
           className="cursor-pointer hover:text-[#A6884A]"
         >
           Dashboard
         </li>
         <li
           onClick={() => {
             router.push("/dashboard/personal-info");
             setIsOpen(false);
           }}
           className="cursor-pointer hover:text-[#A6884A]"
         >
           Persönliche Informationen
         </li>
         <li
           onClick={() => {
             router.push("/dashboard/formular");
             setIsOpen(false);
           }}
           className="cursor-pointer hover:text-[#A6884A]"
         >
           Formular
         </li>
       </ul>
     </div>
   )}
 
   {/* --- DESKTOP SIDEBAR --- */}
   <nav className="hidden lg:flex bg-[#B99B5F] text-white p-4 flex-col shadow-lg lg:w-72">
     <h1
       className="text-4xl font-bold text-center mb-12 select-none cursor-pointer"
       onClick={() => router.push("/client-dashboard")}
     >
       PHC
     </h1>
 
     <ul className="space-y-6 flex-grow">
       <li
         onClick={() => router.push("/client-dashboard")}
         className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
       >
         Dashboard
       </li>
       <li
         onClick={() => router.push("/dashboard/personal-info")}
         className="relative flex items-center gap-3 text-lg font-medium cursor-pointer hover:text-[#A6884A] transition"
       >
         Persönliche Informationen
         {isNotifVisible && (
           <span className="w-4 h-4 bg-[#04436F] rounded-full animate-pulse"></span>
         )}
       </li>
       <li
         onClick={() => router.push("/dashboard/formular")}
         className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
       >
         Formular
       </li>
     </ul>
   </nav>
 </>
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-[#B99B5F] mb-8">
          Kündigungsbedingungen & Rückerstattung
        </h1>

        <section className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border-l-8 border-yellow-500">
          <h2 className="text-2xl font-bold text-yellow-600">📌 Regeln</h2>

          <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-relaxed">
            <li>
              Das Vertragsverhältnis beginnt mit der Buchung der Dienstleistung
              und ist auf unbestimmte Zeit abgeschlossen.
            </li>
            <li>
              Eine Kündigung ist nach 3 Monaten ab dem ersten
              Dienstleistungseinsatz mit einer Frist von 14 Tagen über das
              Online-Portal möglich.
            </li>
            <li>
              Aus wichtigen Gründen können beide Parteien den Vertrag jederzeit
              fristlos kündigen – es wird eine Aufwandsentschädigung von{" "}
              <strong>CHF 300.– exkl. MwSt.</strong> berechnet.
            </li>
            <li>
              Kunden erhalten automatisch eine Bestätigungs-E-Mail mit Details
              zur Kündigung.
            </li>
            <li>
              Rückerstattung erfolgt automatisch gemäss den Bedingungen. Bei
              rechtzeitiger Kündigung wird der Betrag innerhalb von{" "}
              <strong>48 Stunden</strong> über die ursprüngliche Zahlungsmethode
              zurückerstattet.
            </li>
          </ul>

          {/* ✅ E-Formular */}
          <div className="bg-gray-50 p-6 rounded-xl border mt-6 text-gray-700">
            <p className="mb-4">
              Wenn Sie den Vertrag wirklich beenden möchten und sich sicher
              sind, klicken Sie bitte auf den Button unten.
            </p>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700">
              Vertrag kündigen
            </button>
            <p className="mt-6 text-sm">
              ❓ Haben Sie Fragen? Kontaktieren Sie uns unter{" "}
              <a
                href="mailto:support@primehomecare.ch"
                className="text-blue-600 underline"
              >
                support@primehomecare.ch
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
