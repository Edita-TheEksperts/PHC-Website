import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";


export default function Home() {
  const faqs = [
    {
      question: "Was genau leistet die Prime Home Care?",
      answer: " Wenn ein Familienmitglied oder ein geliebter Mensch pflegebedürftig wird, müssen Angehörige und Freund oft unter grossem Zeitdruck Betreuung sowie die dafür benötigten Hilfsmittel organisieren. Häusliche Betreuung stellt ein komplexes Thema mit sehr vielen Dimensionen dar: Zum einen geht es um viel Geld und bedeutet für die Betroffenen häufig auch einen Verzehr von Vermögen. Zum anderen gibt es in der Schweiz die rechtliche Dimension, bei der es um die korrekte Gestaltung und Abwicklung von Arbeitsverhältnissen geht. Hierbei ist es zentral, das richtige Betreuungsmodell zu wählen und einen arbeits- und sozialversicherungsrechtlich versierten Partner an seiner Seite zu wissen. Und schliesslich geht es um zwischenmenschliche Aspekte, immerhin leben in einer Betreuungssituation häufig zwei oder mehrere Menschen in einem Haushalt mit einer Pflegehilfe, die häufig vom Ausland anreist. Senioren oder hilfsbedürftigen Menschen unter unseren Kunden sowie deren pflegende Angehörige oder Partner wissen zu schätzen, dass sie mit uns alle benötigten Leistungen nahtlos und «wie aus einer Hand» erhalten können und wir zudem zu allen Aspekten der Betreuung optimal beraten können. Wir holen für sie unterschiedliche Angebote von Partnerunternehmen ein und haben stets ein Auge auf die Einhaltung korrekter Anstellungsbedingungen sowie auf alle Rechtsnormen. Auf diese Weise können wir bei der Seniorenbetreuung zuhause zugleich geringe Kosten und eine hohe Qualität sicherstellen. So leisten wir unseren Beitrag dafür, dass sich betroffene Menschen sowohl in ihrem eigenen Haushalt als auch unterwegs 24h am Tag sicher und geborgen fühlen können.",
    },
    {
      question: "Welche Vorteile bietet die Zusammenarbeit mit Prime Home Care für eine Betreuung zu Hause?",
      answer: "Wenn ein Familienmitglied oder ein geliebter Mensch pflegebedürftig wird, müssen Angehörige und Freund oft unter grossem Zeitdruck Betreuung sowie die dafür benötigten Hilfsmittel organisieren. Häusliche Betreuung stellt ein komplexes Thema mit sehr vielen Dimensionen dar: Zum einen geht es um viel Geld und bedeutet für die Betroffenen häufig auch einen Verzehr von Vermögen. Zum anderen gibt es in der Schweiz die rechtliche Dimension, bei der es um die korrekte Gestaltung und Abwicklung von Arbeitsverhältnissen geht. Hierbei ist es zentral, das richtige Betreuungsmodell zu wählen und einen arbeits- und sozialversicherungsrechtlich versierten Partner an seiner Seite zu wissen. Und schliesslich geht es um zwischenmenschliche Aspekte, immerhin leben in einer Betreuungssituation häufig zwei oder mehrere Menschen in einem Haushalt mit einer Pflegehilfe, die häufig vom Ausland anreist. Senioren oder hilfsbedürftigen Menschen unter unseren Kunden sowie deren pflegende Angehörige oder Partner wissen zu schätzen, dass sie mit uns alle benötigten Leistungen nahtlos und «wie aus einer Hand» erhalten können und wir zudem zu allen Aspekten der Betreuung optimal beraten können. Wir holen für sie unterschiedliche Angebote von Partnerunternehmen ein und haben stets ein Auge auf die Einhaltung korrekter Anstellungsbedingungen sowie auf alle Rechtsnormen. Auf diese Weise können wir bei der Seniorenbetreuung zuhause zugleich geringe Kosten und eine hohe Qualität sicherstellen. So leisten wir unseren Beitrag dafür, dass sich betroffene Menschen sowohl in ihrem eigenen Haushalt als auch unterwegs 24h am Tag sicher und geborgen fühlen können.",
    },
    {
      question: "Welche Kosten entstehen für eine private Betreuung zu Hause?",
      answer: "Unser Ziel ist es stets, Betreuung für unsere Kunden so bequem wie möglich und gleichzeitig maximal kostengünstig zu organisieren. Die Höhe der Betreuungskosten richtet sich nach Ihren individuellen Wünschen, dem Pflegebedarf sowie der damit verbundenen der Höhe der möglichen Kostenübernahme seitens der Krankenkasse und schliesslich dem gewählten Anstellungsmodell. Auch kantonal unterscheiden sich die Abgaben, was einen Einfluss auf Lohn und Kosten hat. Vorgängig ist es dadurch allerdings nicht möglich, ein pauschales Angebot abzugeben. In aller Regel übernehmen wir ein umfassendes Mandat, welches die vorgängige Planung, Vorschläge und Vorselektion der eingebundenen Partner sowie die Kontrolle und Aufsicht über diese sowie die Lohnadministration miteinschliesst. Unsere Leistungen bieten wir zu einem monatlichen Pauschalhonorar an. Sie erhalten von uns jeweils eine Rechnung, in welcher alle Kostenbestandteile transparent aufgeschlüsselt werden. Ein pauschaler Preis für eine Betreuung zu Hause mit Tages- oder Monatspauschalen wie er von vielen Verleihagenturen angeboten wird, wird stets höher liegen, als die Kosten, die mit unserem Administrativ-Modell verbunden sind. Einen ersten Überblick über die zu erwartenden monatlichen Betreuungskosten erhalten Sie mit unserem Kontaktformular.",
    },
    {
      question: "Können auch einzelne Leistungen in Anspruch genommen werden?",
      answer: "Als Auftraggeber entscheiden Sie gemeinsam mit Ihrer Familie darüber, in welchem Umfang Sie unser Angebot in Anspruch nehmen. Ganz egal, ob Sie lediglich eine Beratung über das zu wählende Pflegemodell benötigen, unsere Hilfe bei der Beschaffung von Hilfsmitteln oder baulichen Veränderungen oder die Übernahme administrativer Belange sowie eine laufende Koordination wünschen.",
    },
    {
      question: "Wenn eine Betreuungskraft benötigt wird, wer wählt diese aus?",
      answer: "Aufgrund unserer Erfahrung wissen wir, dass es von zentraler Bedeutung ist, dass sich die zu pflegenden Senioren mit den Betreuerinnen oder Betreuern wohlfühlen und ein liebevoller Umgang gegeben ist. Wir bieten jedoch selbst keine Betreuungsdienstleistungen an und betreiben auch keine Arbeitsvermittlung. Für die Personalrekrutierung oder -verleih empfehlen wir Ihnen dazu zuverlässige und SECO-bewilligte Partner. In der Regel stellen Ihnen diese mehrere Kandidaten vor, mit denen Sie Kontakt aufnehmen und selbst Ihre Favoriten auswählen können.",
    },
    {
      question: "Welche Aufgaben und Tätigkeiten übernimmt ein Betreuer oder eine Betreuerin?",
      answer: "Die Unterstützung bei Alltagsaufgaben durch eine Haushaltshilfe wird oft mit zu Hause geleisteter Altenbetreuung gleichgesetzt. Professionelle Betreuung zu Hause ist jedoch viel weitreichender: Leistet zum Beispiel eine Betreuungsperson Grundpflege im Namen und unter Obhut einer kantonal anerkannten Organisation mit Spitex-Bewilligung, können die Kosten für solche Pflegeleistungen mit der Krankenkasse abgerechnet werden. Dafür vermitteln wir Ihnen – zunächst in den deutschsprachigen Kantonen der Schweiz – geeignete und zugelassene Partner für die Abrechnung mit Ihrer Krankenkasse. Allerdings stellt es für die Betreuungskräfte häufig eine Entlastung dar, wenn für Pflegetätigkeiten zusätzlich Spitex-Mitarbeitende ins Haus kommen. Für die (medizinische) Behandlungspflege braucht diese ohnehin. Durch uns organisierte Betreuung bezieht solche Überlegungen von vornherein in die Planung mit ein. Ganz allgemein gehören zu den typischen Betreuungsaufgaben Tätigkeiten wie Einkaufen, Kochen, Putzen, Waschen oder Bügeln. Auch Handreichungen bei der Einnahme von Speisen und Getränken sowie der Mobilität drinnen und draussen sowie bei Körperpflege und -hygiene gewährleisten eine grosse Entlastung für Senioren und ihre pflegenden Angehörigen. Mehr und mehr steht heute auch die Betreuung zuhause bei Demenz oder Alzheimer sowie die palliative Pflege in den heimischen vier Wänden im Vordergrund.",
    },
    {
      question: "Was unterscheidet stundenweise Betreuung von einer 24 Stunden Betreuung?",
      answer: "Bei einer Live-In-Betreuung wohnen Betreute und Betreuende zusammen unter einem Dach. Bei diesem auch 24-Stunden-Betreuung genannten Modell bedeutet dies aber keineswegs «Arbeit rund um die Uhr». Vielmehr wird ein normales Arbeitspensum von in der Regel 42 Wochenstunden über den ganzen Tag und über die Woche verteilt. Maximal zulässig ist in der Schweiz ein Arbeitspensum von 50 Stunden pro Woche. Zusätzlich zu den vereinbarten Arbeits- und Bereitschaftszeiten müssen einer Betreuungsperson über den Tag und vor allem in der Nacht genügend Freizeit und Pausen gewährt werden. Überstunden, ausgefallenen Freitage oder kantonale Feiertage müssen kompensiert werden. Wir helfen Ihnen bei der Wahl und Konzeption des richtigen Modells. Wird hingegen nur eine punktuelle Alltagsbetreuung oder eine Hilfe im Haushalt benötigt, ohne dass der zu betreuende Mensch mit den Betreuerinnen oder einem Betreuer rund um die Uhr zusammen leben, kann es günstiger sein, nur für einige Stunden pro Woche eine Betreuung über die lokale Spitex oder einen Pflegedienst wie Home Instead zu beziehen. So eine stundenweise Begleitung kommt jedoch schnell sehr teuer, vor allem, wenn der Pflege- und Betreuungsumfang mit der Zeit ansteigt. Gerne beraten wir Sie auch hierzu umfassend.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
const services = {
  "Alltagsbegleitung und Besorgungen": [
    "Beleitung zu Terminen",
    "Einkäufe erledigen",
    "Postgänge",
    "Sonstige Begleitungen",
  ],
  "Freizeit und Soziale Aktivitäten": [
    "Gesellschaft leisten",
    "Gemeinsames Kochen",
    "Vorlesen",
    "Kartenspiele",
    "Ausflüge und Reisebegleitung",
  ],
  "Gesundheitsführsorge": [
    "Körperliche Unterstützung",
    "Nahrungsaufnahme",
    "Grundpflegerische Tätigkeiten",
    "Gesundheitsfördernde Aktivitäten",
    "Geistige Unterstützung",
  ],
  "Haushaltshilfe und Wohnpflege": [
    "Hauswirtschaft",
    "Balkon und Blumenpflege",
    "Waschen / Bügeln",
    "Kochen",
    "Fenster Putzen",
    "Bettwäsche wechseln",
    "Aufräumen",
    "Trennung / Entsorgung / Abfall",
    "Abstauben",
    "Staubsaugen",
    "Boden wischen",
    "Vorhänge reinigen",
  ],
};

 const router = useRouter();
  const [selectedService, setSelectedService] = useState("");
  const [selectedSubService, setSelectedSubService] = useState("");

  const handleSubmit = () => {
    if (!selectedService || !selectedSubService) {
      alert("Bitte wählen Sie einen Service und Subservice.");
      return;
    }
    router.push(
      `/register-client?service=${encodeURIComponent(
        selectedService
      )}&subService=${encodeURIComponent(selectedSubService)}`
    );
  };
    const [email, setEmail] = useState("");
const [agbAccepted, setAgbAccepted] = useState(false);

const handleEmployeeStart = () => {
  if (!email || !agbAccepted) {
    alert("Bitte E-Mail eingeben und AGB akzeptieren.");
    return;
  }

  // Save to localStorage
  localStorage.setItem("employeeEmail", email);
  localStorage.setItem("employeeAgbAccepted", agbAccepted.toString());

  // Redirect to employee register
  router.push("/employee-register");
};


  return (
    
    <div className="bg-[#FAFCFF] px-4 mx-auto max-w-[1430px]">
      {/* Hero Section */}
    <section className="max-w-[1430px] bg-[#EDF2FB] rounded-[20px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-2 px-4 lg:px-[20px] py-12 lg:py-[70px]">
  {/* Left Content */}
  <div className="flex-1 w-full max-w-[830px]">
    <h1 className="text-[#04436F] text-[40px] lg:text-[60px] font-semibold leading-tight">
      Individuelle<br /> Betreuungslösungen<br /> für Ihr Zuhause
    </h1>

    {/* Service Selector */}
   <div className="bg-white rounded-[20px]  p-6 lg:p-8 mt-8 w-full">
  <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-4 w-full">
    
    {/* Service Dropdown */}
    <div className="w-full lg:w-[300px]">
      <select
        className="w-full border border-gray-300 rounded-[12px] px-5 py-5 text-base focus:outline-none focus:ring-2 focus:ring-[#04436F] transition"
        value={selectedService}
        onChange={(e) => {
          setSelectedService(e.target.value);
          setSelectedSubService("");
        }}
      >
        <option value="">Bitte wählen</option>
        {Object.keys(services).map((srv) => (
          <option key={srv}>{srv}</option>
        ))}
      </select>
    </div>

    {/* Subservice Dropdown */}
    <div className="w-full lg:w-[300px]">
      <select
        className="w-full border border-gray-300 rounded-[12px] px-5 py-5 text-base focus:outline-none focus:ring-2 focus:ring-[#04436F] transition"
        value={selectedSubService}
        onChange={(e) => setSelectedSubService(e.target.value)}
        disabled={!selectedService}
      >
        <option value="">Bitte wählen</option>
        {selectedService &&
          services[selectedService].map((sub) => (
            <option key={sub}>{sub}</option>
          ))}
      </select>
    </div>

    {/* Submit Button */}
    <div className="w-full lg:w-auto mt-4 lg:mt-0">
      <button
        onClick={handleSubmit}
        className="w-full bg-[#04436F] hover:bg-[#033559] text-white text-[16px] font-semibold rounded-[12px] px-6 py-4 transition shadow-lg"
      >
        Los geht’s!
      </button>
    </div>
  </div>
  {/* Rating Section */}
<div className="flex items-center gap-3 mt-6 lg:mt-8 text-[#04436F]">
  {/* Stars */}
  <div className="flex items-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        fill="gold"
        viewBox="0 0 24 24"
        stroke="none"
        className="w-5 h-5"
      >
        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848 1.417 8.268L12 19.771l-7.417 4.093L6 15.596 0 9.748l8.332-1.73z" />
      </svg>
    ))}
  </div>

  {/* Score Text */}
  <span className="text-[18px] font-semibold">4.6/5</span>

  {/* Review Count */}
  <span className="text-sm text-gray-600">
    293.029 verifizierte Bewertungen seit 2015
  </span>
</div>

</div>


    {/* Avatars and Benefits */}
    <div className="mt-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex -space-x-4">
          <Image src="/images/phc-avatar1.png" alt="Staff 1" width={50} height={50} className="rounded-full border border-white" />
          <Image src="/images/phc-avatar2.png" alt="Staff 2" width={50} height={50} className="rounded-full border border-white" />
          <Image src="/images/phc-avatar3.png" alt="Staff 3" width={50} height={50} className="rounded-full border border-white" />
          <Image src="/images/phc-avatar4.png" alt="Staff 4" width={50} height={50} className="rounded-full border border-white" />
        </div>
      </div>

      <h2 className="text-[#04436F] text-[20px] font-semibold mb-2">
        Hilfreiche Lösungen für eine selbstbestimmte Pflege zu Hause
      </h2>
      <ul className="list-disc pl-6 text-[#04436F] text-[16px] space-y-1">
        <li>Volldigitale Plattform</li>
        <li>Die innovative Betreuungslösung</li>
      </ul>
    </div>
  </div>

  {/* Right Image */}
  <div className="w-full lg:w-[500px] flex justify-end">
    <Image
      src="/images/phc-hero-phc123.png"
      alt="Elderly care"
      width={500}
      height={600}
      className="rounded-[20px] object-cover"
    />
  </div>
</section>


      {/* Services Section */}
      <section className="max-w-[1430px] mx-auto px-6 mt-[120px] ">
      <h2 className="text-[#04436F] text-center text-[30px] leading-[37px] lg:text-[55px] font-semibold lg:leading-[71.5px] pt-4">
      Entdecken Sie unser umfassendes<br></br> Dienstleistungsangebot
</h2>


{/* Services Grid */}
<div className="mt-10 lg:mt-[70px] grid grid-cols-1 lg:px-[120px] md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-[60px] ">
  {[
    {
      title: "Alltagsbegleitung & Besorgungen",
      description:
        "Wir begleiten Sie zuverlässig zu Arztterminen, Therapien, Behördengängen oder beim Einkaufen – ob Supermarkt, Apotheke oder Modegeschäft. Auch Postgänge und sonstige Erledigungen übernehmen wir gerne.",
      icon: "/images/phc-icon-nursing.png",
    },
    {
      title: "Freizeit & soziale Aktivitäten",
      description:
        "Für mehr Lebensfreude im Alltag: Wir leisten Gesellschaft, kochen gemeinsam, lesen vor, spielen Karten oder begleiten Sie zu Theater, Kino, Konzerten, Sportanlässen oder in den Urlaub.",
      icon: "/images/phc-icon-companion.png",
    },
    {
      title: "Gesundheitsfürsorge & Grundpflege",
      description:
        "Einfühlsame Unterstützung bei der Körperpflege, Nahrungsaufnahme und bei alltäglichen pflegerischen Aufgaben – ergänzt durch gesundheitsfördernde Aktivitäten für Körper und Geist.",
      icon: "/images/phc-icon-health-aides.png",
    },
    {
      title: "Haushaltshilfe & Wohnpflege",
      description:
        "Wir sorgen für ein sauberes, gepflegtes Zuhause: von Kochen, Waschen und Bügeln bis hin zu Fenster putzen, Staubsaugen, Pflanzenpflege oder dem Wechseln der Bettwäsche.",
      icon: "/images/phc-icon-medication.png",
    },
  ].map((service, index) => (
    <div
      key={index}
      className="bg-[FAFCFF] p-4 lg:p-[40px] rounded-[20px] flex flex-col justify-center items-center text-center"
    >
      {/* Icon Background */}
      <div className="w-[100px] h-[100px] bg-[#EDF2FB] rounded-full flex justify-center items-center mb-[30px]">
        <Image src={service.icon} alt={service.title} width={50} height={50} />
      </div>

      {/* Title */}
      <h3 className="text-[#04436F] text-center text-[28px] font-semibold leading-[33.6px]">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-[#04436F] text-center text-[16px] font-normal leading-[25.6px] mt-[10px]">
        {service.description}
      </p>
    </div>
  ))}
</div>


      </section>

      <section className="relative mt-[120px]  rounded-[20px]  mx-auto p-4">
      {/* Background Image */}
      <div className="relative w-full h-[350px] lg:h-[576px] overflow-hidden rounded-[20px]">
        <Image
          src="/images/phc-bg-hero.png"  // Change this to your image path
          alt="Consultation"
          layout="fill"
          objectFit="cover"
          className="rounded-[20px] lg:block hidden "
        />
           <Image
          src="/images/phc-bg-hero-mobile.jpg"  // Change this to your image path
          alt="Consultation"
          layout="fill"
          objectFit="cover"
          className="rounded-[20px] lg:hidden block bg-black bg-opacity-60"
          />
        {/* Overlay */}
        <div className="absolute inset-0 lg:mt-[-100px]  rounded-[20px] flex flex-col gap-3 lg:gap-[30px] justify-center items-center text-center px-6 ">
        <p className="text-[#FAFCFF] text-[18px]  font-normal leading-[23.4px] 
            px-[10px] py-[2px] flex flex-col items-start 
            rounded-l-[50px] rounded-r-none 
            bg-[linear-gradient(97deg,#04436F_0%,rgba(0,0,0,0.00)_100%)] text-center">
            Get in Touch
            </p>

            <h2 className="text-[#FAFCFF] text-center
            text-[32px] lg:text-[55px] font-semibold leading-[38px] lg:leading-[71.5px] mt-2">
            Haben Sie Fragen oder<br></br> sind Sie bereit für ein<br></br> Onlinegespräch?
            </h2>

            <button className="mt-4 px-[20px] py-[12px] bg-[#04436F] text-[#FAFCFF] 
   text-[18px] font-medium leading-[21.6px] 
   rounded-[50px] flex flex-col items-center text-center 
   hover:bg-[#033559] transition">
  Schedule a home visit
</button>

        </div>
      </div>

      {/* Contact Options */}
      <div className="marginclass mt-10 lg:mt-[-80px] z-999 lg:ml-[850px] relative flex flex-row justify-center items-center gap-[40px]">
      {/* Online Session */}
        <div className="flex flex-col lg:items-right lg:text-right">
        <p className="text-[#04436F] text-[22px] font-medium leading-[26.4px] lg:text-right lg:block hidden">
        Buchen Sie hier ihren online-Termin
        </p>
        <p className="text-[#04436F] text-[22px] font-medium leading-[26.4px] lg:text-right lg:hidden block">
        Buchen Sie hier<br></br> ihren online-Termin
        </p>

<p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] lg:text-right underline">
  Lorem
</p>
        </div>
        <div className="w-[80px] h-[80px] bg-[#B99B5F] rounded-full flex justify-center items-center">
        <svg
      xmlns="http://www.w3.org/2000/svg"
      width="51"
      height="51"
      viewBox="0 0 51 51"
      fill="none"
    >
      <mask
        id="mask0"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="51"
        height="51"
      >
        <path
          d="M50.4805 50.3526V0.450195H0.578125V50.3526H50.4805Z"
          fill="white"
          stroke="white"
          strokeWidth="0.0976562"
        />
      </mask>
      <g mask="url(#mask0)">
        <path
          d="M9.27735 41.6529C-7.28808 25.0874 7.2461 12.4911 10.7268 17.2307C10.7268 17.2307 13.9509 21.2203 14.6621 22.1502C15.3731 23.08 16.147 24.626 12.6138 27.3223C8.51993 30.4466 11.5208 34.1175 14.1462 36.7839C16.8126 39.4094 20.4836 42.4102 23.6078 38.3162C26.3041 34.7831 27.8501 35.557 28.7799 36.268C29.7098 36.9791 33.6994 40.2033 33.6994 40.2033C38.4389 43.6841 25.8426 58.2183 9.27735 41.6529Z"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34.9043 1.37793C42.9945 1.37793 49.5528 7.93623 49.5528 16.0264C49.5528 24.1165 42.9945 30.6748 34.9043 30.6748C32.1017 30.6748 29.483 29.8872 27.2569 28.5219C25.6887 28.9428 24.1203 29.3635 22.5518 29.7838C21.7147 30.0202 20.9129 29.2541 21.1423 28.3933C21.5641 26.8189 21.9861 25.2458 22.4082 23.6729C21.0433 21.4471 20.2559 18.8287 20.2559 16.0264C20.2559 7.93623 26.8142 1.37793 34.9043 1.37793Z"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.70508 17.9458L12.7347 26.7336"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M33.0369 45.2532L24.1592 38.1514"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34.1368 6.97287C35.0863 7.92238 35.0863 9.47609 34.1368 10.4255L29.303 15.2594C28.3535 16.2088 26.7998 16.2088 25.8502 15.2594C24.9008 14.3097 24.9008 12.7561 25.8502 11.8066L30.6841 6.97287C31.6335 6.02336 33.1872 6.02336 34.1368 6.97287Z"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.6128 9.73486L31.3748 12.497"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.8805 25.7919C38.3008 25.7919 40.275 23.8178 40.275 21.3974C40.275 18.977 38.3008 17.0029 35.8805 17.0029C33.46 17.0029 31.4858 18.977 31.4858 21.3974C31.4858 23.8178 33.46 25.7919 35.8805 25.7919Z"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31.9741 21.3975H35.8803"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.8813 16.9267C35.9012 15.7879 36.3624 14.7014 37.1678 13.896C38.8839 12.1798 41.6664 12.1798 43.3825 13.896C45.0987 15.6121 45.0987 18.3946 43.3825 20.1108C42.5772 20.9162 41.4905 21.3774 40.3518 21.3972"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M39.2441 18.0343L40.2751 17.0034"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
          </div>

      </div>
    </section>

    <section className="max-w-[1400] mt-[120px] mx-auto p-4 lg:px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-[80px]">
      
      {/* Left: Image with Custom Cropped Shape */}
      <div className="relative w-full lg:w-[610px] h-[400px] lg:h-[730px]">
        <Image
          src="/images/phc-easy-care-steps.png"  // Change to your actual image path
          alt="Easy Care"
          layout="fill"
          objectFit="cover rounded-[20px]"
        />
      </div>

      {/* Right: Text Content */}
      <div className="lg:w-1/2">
        {/* Tag: "How we work" */}
        <p className="mb-[10px] lg:pl-[14px] lg:pr-[100px] px-[14px] py-[2px] text-[#FAFCFF] text-[18px] font-normal leading-[23.4px] rounded-l-[50px]  inline-block"
         style={{
            background: "linear-gradient(94deg, #04436F 0%, rgba(0, 0, 0, 0.00) 100%)",
          }}>
 Wie wir arbeiten
</p>


        {/* Main Title */}
        <h2 className="text-[#04436F] text-[32px] lg:text-[55px] font-semibold leading-[40px] lg:leading-[71.5px] mb-10 lg:mb-[70px]">
        So einfach geht’s –<br></br>
        in drei Schritten
</h2>


        {/* Steps List */}
        <div className="space-y-6 lg:space-y-[50px]">
          {[
            {
              number: "01",
              title: "Registration",
              description:
                "Erstellen Sie Ihr Profil samt Ihren Wünschen an die Betreuung",
              bgColor: "bg-[#EDF2FB]",
              textColor: "text-[#003588]",
            },
            {
              number: "02",
              title: "Passende Betreuungsperson finden",
              description:
                "Wir finden die richtige Betreuungsperson – einfühlsam, fachlich versiert und zuverlässig.",
              bgColor: "bg-[#B99B5F]",
              textColor: "text-white",
            },
            {
              number: "03",
              title: "Geniessen Sie Ihre Betreuung Zuhause",
              description:
                "Wir übernehmen die Betreuung – Sie oder Ihre Angehörigen können sich entspannen.",
              bgColor: "bg-[#003588]",
              textColor: "text-white",
            },
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-2 lg:gap-4">
              {/* Step Number */}
              <div
                className={`lg:w-[70px] lg:h-[70px] h-[35px] w-[40px] text-[22px] lg:text-[36px] flex items-center justify-center  font-[500] rounded-full ${step.bgColor} ${step.textColor}`}
              >
                {step.number}
              </div>

              {/* Step Content */}
              <div>
                <h3 className="text-[#04436F] text-[22px] lg:text-[28px] font-medium leading-[28px] lg:leading-[33.6px]">
                {step.title}
                </h3>

                <p className="text-[#04436F] lg:w-[500px] text-[16px] font-normal leading-[25.6px]">
                {step.description}
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


    <section className="text-center mt-[120px]">
        <h2 className="text-[#04436F] text-[55px] mb-4 lg:mb-[70px] font-semibold leading-[71.5px] text-center">
        Unsere Preismodelle
         </h2>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  
  {/* Hourly Care Plan */}
  <div className="rounded-[20px] text-center relative overflow-hidden bg-[#FFFFFF]">
    
    {/* Header */}
    <div className="w-full p-[50px] text-left rounded-t-[20px] bg-[#EDF2FB] text-[#000000]">

{/* Plan Title */}
<h3 className="text-[22px] font-medium leading-[30.8px]">
Regelmässige Betreuung
</h3>

{/* Price Section - Now properly aligned */}
<div className="flex items-baseline gap-1 mt-[20px]">
  <span className="text-[#04436F] text-[48px] font-semibold leading-[70px] ">
  CHF 49/
  </span>
  <span className="text-[#04436F] text-[16px] font-normal leading-[25px] ">
  Stunde
  </span>
</div>

</div>

<div className="p-[50px] flex flex-col justify-center">
  {/* Features */}
  <ul className="mt-4 space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px] list-disc pl-[20px]">
    <li>Personal care assistance</li>
    <li>Medication reminders</li>
    <li>Meal preparation and feeding assistance</li>
    <li>Companionship and emotional support</li>
  </ul>
</div>


    {/* Button */}
    <div className="lg:mt-[100px] mt-6 mb-[50px]">
      <button className="bg-[#04436F] text-white lg:px-[120px] py-3 px-6 rounded-full text-[18px] font-medium 
                         transition duration-300 hover:bg-[#033559]">
        Book now
      </button>
    </div>

  </div>

  {/* Hourly Care Plan */}
  <div className="rounded-[20px] text-center relative overflow-hidden bg-[#EDF2FB]">
    
    {/* Header */}
    <div className="w-full p-[50px] text-left rounded-t-[20px] bg-[#B99B5F] text-white">

{/* Plan Title */}
<h3 className="text-[22px] font-medium leading-[30.8px] ">
Einmalige Einsätze
</h3>

{/* Price Section - Now properly aligned */}
<div className="flex items-baseline gap-1 mt-[20px]">
  <span className="text-white text-[48px] font-semibold leading-[70px] ">
  CHF 60/
  </span>
  <span className="text-white text-[16px] font-normal leading-[25px]">
  Stunde
  </span>
</div>

</div>

<div className="p-[50px] flex flex-col justify-center">
  {/* Features */}
  <ul className="mt-4 space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px] list-disc pl-[20px]">
    <li>Personal care assistance</li>
    <li>Medication reminders</li>
    <li>Meal preparation and feeding assistance</li>
    <li>Companionship and emotional support</li>
    <li>Companionship and emotional support</li>

    <li>Companionship and emotional support</li>

    <li>Companionship and emotional support</li>

  </ul>
</div>


    {/* Button */}
    <div className="lg:mt-[100px] mt-6 mb-[50px]">
      <button className="bg-[#04436F] text-white lg:px-[120px] py-3 px-6 rounded-full text-[18px] font-medium 
                         transition duration-300 hover:bg-[#033559]">
        Get Started
      </button>
    </div>

  </div>

  {/* Customized Care Plan */}
  <div className="p-[50px] lg:h-[730px] rounded-[20px] text-center bg-[#EDF2FB] flex flex-col justify-between h-full">
    
    {/* Header */}
    <div className="w-full text-left text-[22px] font-medium leading-[30.8px] 
                    rounded-t-[20px]  text-[#04436F]">
      Individuelle Dientsleitungen
    </div>
    <p className="text-[#04436F] text-left text-[16px] font-normal leading-[25.6px]  mt-[20px] mb-[20px]">
    Wir bei der Prime Home Care AG <br></br>verstehen die individuellen Bedürfnisse<br></br> unserer Kunden
</p>

    {/* Features */}
    <ul className="mt-4 text-left space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px]  list-disc pl-[20px]">
    <li>24 Stunden Live-In Betreuung</li>
    <li>Ferienbegleitung</li>
    <li>Konzertbesuche</li>
    <li>Biographiearbeit</li>
  

  </ul>

    {/* Button */}
    <div className="lg:mt-[100px] items-center justify-center mt-[60px] lg:mb-[50px]">
      <button className="bg-[#04436F] text-white lg:px-[120px] py-3 px-6 rounded-full text-[18px] font-medium 
                         transition duration-300 hover:bg-[#033559]">
        Contact us
      </button>
    </div>

  </div>

</div>



        </section>

        <section className="bg-[#EDF2FB] mt-[180px] max-w-[1430px] mx-auto p-4 px-4 py-4 lg:px-[70px] lg:py-[120px] rounded-[20px]">
        <h2 className="text-[#003588] font-['Metropolis'] text-left text-[32px] lg:text-[42px] font-semibold  mb-[50px]">
        Was unsere Kunden über uns sagen
      </h2>
      
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-[40px]">
        {/* Left Text Testimonial */}
        <div className="bg-white p-[30px] rounded-[20px] flex flex-col lg:w-[396px] lg:h-[547px]">
          <div className="flex gap-1 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="25" viewBox="0 0 140 25" fill="none">
            <path d="M8.38333 6.70392C8.84521 5.44002 9.07616 4.80807 9.27754 4.49847C10.5593 2.52786 13.4446 2.52786 14.7264 4.49847C14.9278 4.80807 15.1587 5.44002 15.6206 6.70393L15.6678 6.8331C15.7078 6.94265 15.7278 6.99743 15.7487 7.04632C16.0481 7.74765 16.7203 8.21768 17.4818 8.25819C17.5349 8.26101 17.5933 8.26101 17.7099 8.26101H18.2079C18.5417 8.26101 18.7086 8.26101 18.7907 8.26516C21.8177 8.41833 23.0059 12.2656 20.5924 14.099C20.5269 14.1487 20.3891 14.2428 20.1135 14.431C20.0649 14.4642 20.0407 14.4808 20.0193 14.4961C19.3092 15.0089 19.0153 15.9242 19.2943 16.7545C19.3026 16.7794 19.3138 16.8099 19.3361 16.8709C19.5762 17.5281 19.6963 17.8567 19.7378 18.0228C20.4134 20.7235 17.6023 22.9681 15.1181 21.7115C14.9653 21.6343 14.6883 21.4553 14.1343 21.0974L13.2911 20.5528C13.0948 20.4259 12.9966 20.3625 12.9002 20.3141C12.3351 20.03 11.6689 20.03 11.1038 20.3141C11.0074 20.3625 10.9092 20.4259 10.7128 20.5528L9.88664 21.0864C9.3189 21.4532 9.03502 21.6366 8.87825 21.7153C6.39788 22.9618 3.59742 20.7257 4.26402 18.031C4.30615 17.8607 4.4288 17.5251 4.67408 16.8538C4.69756 16.7896 4.7093 16.7575 4.71819 16.7309C4.99168 15.912 4.70881 15.01 4.01664 14.4939C3.99416 14.4772 3.96858 14.4592 3.91743 14.4232C3.62918 14.2207 3.48505 14.1194 3.41583 14.0649C1.06046 12.211 2.25684 8.42814 5.24988 8.26578C5.33784 8.26101 5.514 8.26101 5.86633 8.26101H6.29724C6.41079 8.26101 6.46757 8.261 6.51925 8.25834C7.28284 8.21879 7.95706 7.74734 8.2563 7.04373C8.27655 6.9961 8.29604 6.94278 8.33501 6.83613L8.38333 6.70392Z" fill="#04436F"/>
            <path d="M37.3833 6.70392C37.8452 5.44002 38.0761 4.80807 38.2775 4.49847C39.5592 2.52786 42.4446 2.52786 43.7264 4.49847C43.9278 4.80807 44.1587 5.44002 44.6206 6.70393L44.6677 6.8331C44.7077 6.94265 44.7277 6.99743 44.7486 7.04632C45.048 7.74765 45.7202 8.21768 46.4817 8.25819C46.5348 8.26101 46.5932 8.26101 46.7098 8.26101H47.2078C47.5416 8.26101 47.7085 8.26101 47.7906 8.26516C50.8176 8.41833 52.0058 12.2656 49.5923 14.099C49.5268 14.1487 49.3891 14.2428 49.1135 14.431C49.0649 14.4642 49.0407 14.4808 49.0193 14.4961C48.3092 15.0089 48.0152 15.9242 48.2942 16.7545C48.3025 16.7794 48.3137 16.8099 48.3361 16.8709C48.5762 17.5281 48.6962 17.8567 48.7377 18.0228C49.4133 20.7235 46.6022 22.9681 44.118 21.7115C43.9652 21.6343 43.6882 21.4553 43.1342 21.0974L42.291 20.5528C42.0947 20.4259 41.9965 20.3625 41.9001 20.3141C41.335 20.03 40.6688 20.03 40.1038 20.3141C40.0073 20.3625 39.9091 20.4259 39.7127 20.5528L38.8866 21.0864C38.3188 21.4532 38.035 21.6366 37.8782 21.7153C35.3978 22.9618 32.5974 20.7257 33.264 18.031C33.3061 17.8607 33.4287 17.5251 33.674 16.8538C33.6975 16.7896 33.7092 16.7575 33.7181 16.7309C33.9916 15.912 33.7087 15.01 33.0166 14.4939C32.9941 14.4772 32.9685 14.4592 32.9174 14.4232C32.6291 14.2207 32.485 14.1194 32.4158 14.0649C30.0604 12.211 31.2568 8.42814 34.2498 8.26578C34.3378 8.26101 34.5139 8.26101 34.8663 8.26101H35.2973C35.4108 8.26101 35.4676 8.261 35.5193 8.25834C36.2829 8.21879 36.9571 7.74734 37.2563 7.04373C37.2766 6.9961 37.2961 6.94278 37.3351 6.83613L37.3833 6.70392Z" fill="#04436F"/>
            <path d="M66.3833 6.70392C66.8452 5.44002 67.0762 4.80807 67.2776 4.49847C68.5593 2.52786 71.4446 2.52786 72.7264 4.49847C72.9278 4.80807 73.1586 5.44002 73.6205 6.70393L73.6677 6.8331C73.7077 6.94265 73.7278 6.99743 73.7487 7.04632C74.0481 7.74765 74.7203 8.21768 75.4818 8.25819C75.5349 8.26101 75.5932 8.26101 75.7098 8.26101H76.2078C76.5416 8.26101 76.7086 8.26101 76.7907 8.26516C79.8177 8.41833 81.0058 12.2656 78.5923 14.099C78.5268 14.1487 78.3891 14.2428 78.1135 14.431C78.0649 14.4642 78.0407 14.4808 78.0193 14.4961C77.3092 15.0089 77.0153 15.9242 77.2943 16.7545C77.3026 16.7794 77.3137 16.8099 77.336 16.8709C77.5761 17.5281 77.6962 17.8567 77.7377 18.0228C78.4133 20.7235 75.6023 22.9681 73.1181 21.7115C72.9653 21.6343 72.6882 21.4553 72.1342 21.0974L71.291 20.5528C71.0947 20.4259 70.9965 20.3625 70.9001 20.3141C70.335 20.03 69.6688 20.03 69.1037 20.3141C69.0073 20.3625 68.9091 20.4259 68.7127 20.5528L67.8867 21.0864C67.3189 21.4532 67.0351 21.6366 66.8783 21.7153C64.3979 22.9618 61.5974 20.7257 62.264 18.031C62.3061 17.8607 62.4287 17.5251 62.674 16.8538C62.6975 16.7896 62.7092 16.7575 62.7181 16.7309C62.9916 15.912 62.7087 15.01 62.0166 14.4939C61.9941 14.4772 61.9685 14.4592 61.9174 14.4232C61.6291 14.2207 61.485 14.1194 61.4158 14.0649C59.0604 12.211 60.2568 8.42814 63.2498 8.26578C63.3378 8.26101 63.5139 8.26101 63.8663 8.26101H64.2973C64.4108 8.26101 64.4676 8.261 64.5193 8.25834C65.2829 8.21879 65.9571 7.74734 66.2563 7.04373C66.2766 6.9961 66.296 6.94278 66.335 6.83613L66.3833 6.70392Z" fill="#04436F"/>
            <path d="M95.3833 6.70392C95.8452 5.44002 96.0762 4.80807 96.2776 4.49847C97.5593 2.52786 100.445 2.52786 101.726 4.49847C101.928 4.80807 102.159 5.44002 102.621 6.70393L102.668 6.8331C102.708 6.94265 102.728 6.99743 102.749 7.04632C103.048 7.74765 103.72 8.21768 104.482 8.25819C104.535 8.26101 104.593 8.26101 104.71 8.26101H105.208C105.542 8.26101 105.709 8.26101 105.791 8.26516C108.818 8.41833 110.006 12.2656 107.592 14.099C107.527 14.1487 107.389 14.2428 107.114 14.431C107.065 14.4642 107.041 14.4808 107.019 14.4961C106.309 15.0089 106.015 15.9242 106.294 16.7545C106.303 16.7794 106.314 16.8099 106.336 16.8709C106.576 17.5281 106.696 17.8567 106.738 18.0228C107.413 20.7235 104.602 22.9681 102.118 21.7115C101.965 21.6343 101.688 21.4553 101.134 21.0974L100.291 20.5528C100.095 20.4259 99.9965 20.3625 99.9001 20.3141C99.335 20.03 98.6688 20.03 98.1037 20.3141C98.0073 20.3625 97.9091 20.4259 97.7127 20.5528L96.8867 21.0864C96.3189 21.4532 96.0351 21.6366 95.8783 21.7153C93.3979 22.9618 90.5974 20.7257 91.264 18.031C91.3061 17.8607 91.4288 17.5251 91.6741 16.8538C91.6976 16.7896 91.7092 16.7575 91.7181 16.7309C91.9916 15.912 91.7087 15.01 91.0166 14.4939C90.9941 14.4772 90.9686 14.4592 90.9175 14.4232C90.6292 14.2207 90.485 14.1194 90.4158 14.0649C88.0604 12.211 89.2568 8.42814 92.2498 8.26578C92.3378 8.26101 92.5139 8.26101 92.8663 8.26101H93.2973C93.4108 8.26101 93.4676 8.261 93.5193 8.25834C94.2829 8.21879 94.9571 7.74734 95.2563 7.04373C95.2766 6.9961 95.296 6.94278 95.335 6.83613L95.3833 6.70392Z" fill="#04436F"/>
            <path d="M124.383 6.70392C124.845 5.44002 125.076 4.80807 125.278 4.49847C126.559 2.52786 129.445 2.52786 130.726 4.49847C130.928 4.80807 131.159 5.44002 131.621 6.70393L131.668 6.8331C131.708 6.94265 131.728 6.99743 131.749 7.04632C132.048 7.74765 132.72 8.21768 133.482 8.25819C133.535 8.26101 133.593 8.26101 133.71 8.26101H134.208C134.542 8.26101 134.709 8.26101 134.791 8.26516C137.818 8.41833 139.006 12.2656 136.592 14.099C136.527 14.1487 136.389 14.2428 136.114 14.431C136.065 14.4642 136.041 14.4808 136.019 14.4961C135.309 15.0089 135.015 15.9242 135.294 16.7545C135.303 16.7794 135.314 16.8099 135.336 16.8709C135.576 17.5281 135.696 17.8567 135.738 18.0228C136.413 20.7235 133.602 22.9681 131.118 21.7115C130.965 21.6343 130.688 21.4553 130.134 21.0974L129.291 20.5528C129.095 20.4259 128.997 20.3625 128.9 20.3141C128.335 20.03 127.669 20.03 127.104 20.3141C127.007 20.3625 126.909 20.4259 126.713 20.5528L125.887 21.0864C125.319 21.4532 125.035 21.6366 124.878 21.7153C122.398 22.9618 119.598 20.7257 120.264 18.031C120.306 17.8607 120.429 17.5251 120.674 16.8538C120.698 16.7896 120.709 16.7575 120.718 16.7309C120.992 15.912 120.709 15.01 120.017 14.4939C119.994 14.4772 119.969 14.4592 119.918 14.4232C119.629 14.2207 119.485 14.1194 119.416 14.0649C117.061 12.211 118.257 8.42814 121.25 8.26578C121.338 8.26101 121.514 8.26101 121.866 8.26101H122.297C122.411 8.26101 122.468 8.261 122.519 8.25834C123.283 8.21879 123.957 7.74734 124.256 7.04373C124.277 6.9961 124.296 6.94278 124.335 6.83613L124.383 6.70392Z" fill="#04436F"/>
            </svg>
          </div>
          <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mb-6">
          "Dank der stundenweisen Betreuung durch Prime Home Care kann ich weiterhin zu Hause leben – genau so, wie ich es mir wünsche. Meine Betreuerin hilft mir beim Einkaufen und leistet mir Gesellschaft. Ich freue mich jedes Mal auf ihren Besuch."          </p>
          <div className="flex items-center gap-3 mt-auto">
            <Image src="/images/avatar1.png" width={70} height={70} className="rounded-full" alt="Client 1" />
            <div>
              <p className="text-[#04436F] leading-[26px] font-[500] text-[22px]">Lorem Ipsum</p>
              <p className="text-[#04436F] text-[16px] leading-[25px]">Lorem Ipsum</p>
            </div>
          </div>
        </div>

        {/* Center Video Testimonial */}
          {/* Right Text Testimonial with Curved Design */}
          <div className="bg-white  rounded-[20px]  relative lg:w-[396px] lg:h-[547px]">
    
  <div className="p-[30px]">
          <div className="flex gap-1 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="25" viewBox="0 0 140 25" fill="none">
            <path d="M8.38333 6.70392C8.84521 5.44002 9.07616 4.80807 9.27754 4.49847C10.5593 2.52786 13.4446 2.52786 14.7264 4.49847C14.9278 4.80807 15.1587 5.44002 15.6206 6.70393L15.6678 6.8331C15.7078 6.94265 15.7278 6.99743 15.7487 7.04632C16.0481 7.74765 16.7203 8.21768 17.4818 8.25819C17.5349 8.26101 17.5933 8.26101 17.7099 8.26101H18.2079C18.5417 8.26101 18.7086 8.26101 18.7907 8.26516C21.8177 8.41833 23.0059 12.2656 20.5924 14.099C20.5269 14.1487 20.3891 14.2428 20.1135 14.431C20.0649 14.4642 20.0407 14.4808 20.0193 14.4961C19.3092 15.0089 19.0153 15.9242 19.2943 16.7545C19.3026 16.7794 19.3138 16.8099 19.3361 16.8709C19.5762 17.5281 19.6963 17.8567 19.7378 18.0228C20.4134 20.7235 17.6023 22.9681 15.1181 21.7115C14.9653 21.6343 14.6883 21.4553 14.1343 21.0974L13.2911 20.5528C13.0948 20.4259 12.9966 20.3625 12.9002 20.3141C12.3351 20.03 11.6689 20.03 11.1038 20.3141C11.0074 20.3625 10.9092 20.4259 10.7128 20.5528L9.88664 21.0864C9.3189 21.4532 9.03502 21.6366 8.87825 21.7153C6.39788 22.9618 3.59742 20.7257 4.26402 18.031C4.30615 17.8607 4.4288 17.5251 4.67408 16.8538C4.69756 16.7896 4.7093 16.7575 4.71819 16.7309C4.99168 15.912 4.70881 15.01 4.01664 14.4939C3.99416 14.4772 3.96858 14.4592 3.91743 14.4232C3.62918 14.2207 3.48505 14.1194 3.41583 14.0649C1.06046 12.211 2.25684 8.42814 5.24988 8.26578C5.33784 8.26101 5.514 8.26101 5.86633 8.26101H6.29724C6.41079 8.26101 6.46757 8.261 6.51925 8.25834C7.28284 8.21879 7.95706 7.74734 8.2563 7.04373C8.27655 6.9961 8.29604 6.94278 8.33501 6.83613L8.38333 6.70392Z" fill="#04436F"/>
            <path d="M37.3833 6.70392C37.8452 5.44002 38.0761 4.80807 38.2775 4.49847C39.5592 2.52786 42.4446 2.52786 43.7264 4.49847C43.9278 4.80807 44.1587 5.44002 44.6206 6.70393L44.6677 6.8331C44.7077 6.94265 44.7277 6.99743 44.7486 7.04632C45.048 7.74765 45.7202 8.21768 46.4817 8.25819C46.5348 8.26101 46.5932 8.26101 46.7098 8.26101H47.2078C47.5416 8.26101 47.7085 8.26101 47.7906 8.26516C50.8176 8.41833 52.0058 12.2656 49.5923 14.099C49.5268 14.1487 49.3891 14.2428 49.1135 14.431C49.0649 14.4642 49.0407 14.4808 49.0193 14.4961C48.3092 15.0089 48.0152 15.9242 48.2942 16.7545C48.3025 16.7794 48.3137 16.8099 48.3361 16.8709C48.5762 17.5281 48.6962 17.8567 48.7377 18.0228C49.4133 20.7235 46.6022 22.9681 44.118 21.7115C43.9652 21.6343 43.6882 21.4553 43.1342 21.0974L42.291 20.5528C42.0947 20.4259 41.9965 20.3625 41.9001 20.3141C41.335 20.03 40.6688 20.03 40.1038 20.3141C40.0073 20.3625 39.9091 20.4259 39.7127 20.5528L38.8866 21.0864C38.3188 21.4532 38.035 21.6366 37.8782 21.7153C35.3978 22.9618 32.5974 20.7257 33.264 18.031C33.3061 17.8607 33.4287 17.5251 33.674 16.8538C33.6975 16.7896 33.7092 16.7575 33.7181 16.7309C33.9916 15.912 33.7087 15.01 33.0166 14.4939C32.9941 14.4772 32.9685 14.4592 32.9174 14.4232C32.6291 14.2207 32.485 14.1194 32.4158 14.0649C30.0604 12.211 31.2568 8.42814 34.2498 8.26578C34.3378 8.26101 34.5139 8.26101 34.8663 8.26101H35.2973C35.4108 8.26101 35.4676 8.261 35.5193 8.25834C36.2829 8.21879 36.9571 7.74734 37.2563 7.04373C37.2766 6.9961 37.2961 6.94278 37.3351 6.83613L37.3833 6.70392Z" fill="#04436F"/>
            <path d="M66.3833 6.70392C66.8452 5.44002 67.0762 4.80807 67.2776 4.49847C68.5593 2.52786 71.4446 2.52786 72.7264 4.49847C72.9278 4.80807 73.1586 5.44002 73.6205 6.70393L73.6677 6.8331C73.7077 6.94265 73.7278 6.99743 73.7487 7.04632C74.0481 7.74765 74.7203 8.21768 75.4818 8.25819C75.5349 8.26101 75.5932 8.26101 75.7098 8.26101H76.2078C76.5416 8.26101 76.7086 8.26101 76.7907 8.26516C79.8177 8.41833 81.0058 12.2656 78.5923 14.099C78.5268 14.1487 78.3891 14.2428 78.1135 14.431C78.0649 14.4642 78.0407 14.4808 78.0193 14.4961C77.3092 15.0089 77.0153 15.9242 77.2943 16.7545C77.3026 16.7794 77.3137 16.8099 77.336 16.8709C77.5761 17.5281 77.6962 17.8567 77.7377 18.0228C78.4133 20.7235 75.6023 22.9681 73.1181 21.7115C72.9653 21.6343 72.6882 21.4553 72.1342 21.0974L71.291 20.5528C71.0947 20.4259 70.9965 20.3625 70.9001 20.3141C70.335 20.03 69.6688 20.03 69.1037 20.3141C69.0073 20.3625 68.9091 20.4259 68.7127 20.5528L67.8867 21.0864C67.3189 21.4532 67.0351 21.6366 66.8783 21.7153C64.3979 22.9618 61.5974 20.7257 62.264 18.031C62.3061 17.8607 62.4287 17.5251 62.674 16.8538C62.6975 16.7896 62.7092 16.7575 62.7181 16.7309C62.9916 15.912 62.7087 15.01 62.0166 14.4939C61.9941 14.4772 61.9685 14.4592 61.9174 14.4232C61.6291 14.2207 61.485 14.1194 61.4158 14.0649C59.0604 12.211 60.2568 8.42814 63.2498 8.26578C63.3378 8.26101 63.5139 8.26101 63.8663 8.26101H64.2973C64.4108 8.26101 64.4676 8.261 64.5193 8.25834C65.2829 8.21879 65.9571 7.74734 66.2563 7.04373C66.2766 6.9961 66.296 6.94278 66.335 6.83613L66.3833 6.70392Z" fill="#04436F"/>
            <path d="M95.3833 6.70392C95.8452 5.44002 96.0762 4.80807 96.2776 4.49847C97.5593 2.52786 100.445 2.52786 101.726 4.49847C101.928 4.80807 102.159 5.44002 102.621 6.70393L102.668 6.8331C102.708 6.94265 102.728 6.99743 102.749 7.04632C103.048 7.74765 103.72 8.21768 104.482 8.25819C104.535 8.26101 104.593 8.26101 104.71 8.26101H105.208C105.542 8.26101 105.709 8.26101 105.791 8.26516C108.818 8.41833 110.006 12.2656 107.592 14.099C107.527 14.1487 107.389 14.2428 107.114 14.431C107.065 14.4642 107.041 14.4808 107.019 14.4961C106.309 15.0089 106.015 15.9242 106.294 16.7545C106.303 16.7794 106.314 16.8099 106.336 16.8709C106.576 17.5281 106.696 17.8567 106.738 18.0228C107.413 20.7235 104.602 22.9681 102.118 21.7115C101.965 21.6343 101.688 21.4553 101.134 21.0974L100.291 20.5528C100.095 20.4259 99.9965 20.3625 99.9001 20.3141C99.335 20.03 98.6688 20.03 98.1037 20.3141C98.0073 20.3625 97.9091 20.4259 97.7127 20.5528L96.8867 21.0864C96.3189 21.4532 96.0351 21.6366 95.8783 21.7153C93.3979 22.9618 90.5974 20.7257 91.264 18.031C91.3061 17.8607 91.4288 17.5251 91.6741 16.8538C91.6976 16.7896 91.7092 16.7575 91.7181 16.7309C91.9916 15.912 91.7087 15.01 91.0166 14.4939C90.9941 14.4772 90.9686 14.4592 90.9175 14.4232C90.6292 14.2207 90.485 14.1194 90.4158 14.0649C88.0604 12.211 89.2568 8.42814 92.2498 8.26578C92.3378 8.26101 92.5139 8.26101 92.8663 8.26101H93.2973C93.4108 8.26101 93.4676 8.261 93.5193 8.25834C94.2829 8.21879 94.9571 7.74734 95.2563 7.04373C95.2766 6.9961 95.296 6.94278 95.335 6.83613L95.3833 6.70392Z" fill="#04436F"/>
            <path d="M124.383 6.70392C124.845 5.44002 125.076 4.80807 125.278 4.49847C126.559 2.52786 129.445 2.52786 130.726 4.49847C130.928 4.80807 131.159 5.44002 131.621 6.70393L131.668 6.8331C131.708 6.94265 131.728 6.99743 131.749 7.04632C132.048 7.74765 132.72 8.21768 133.482 8.25819C133.535 8.26101 133.593 8.26101 133.71 8.26101H134.208C134.542 8.26101 134.709 8.26101 134.791 8.26516C137.818 8.41833 139.006 12.2656 136.592 14.099C136.527 14.1487 136.389 14.2428 136.114 14.431C136.065 14.4642 136.041 14.4808 136.019 14.4961C135.309 15.0089 135.015 15.9242 135.294 16.7545C135.303 16.7794 135.314 16.8099 135.336 16.8709C135.576 17.5281 135.696 17.8567 135.738 18.0228C136.413 20.7235 133.602 22.9681 131.118 21.7115C130.965 21.6343 130.688 21.4553 130.134 21.0974L129.291 20.5528C129.095 20.4259 128.997 20.3625 128.9 20.3141C128.335 20.03 127.669 20.03 127.104 20.3141C127.007 20.3625 126.909 20.4259 126.713 20.5528L125.887 21.0864C125.319 21.4532 125.035 21.6366 124.878 21.7153C122.398 22.9618 119.598 20.7257 120.264 18.031C120.306 17.8607 120.429 17.5251 120.674 16.8538C120.698 16.7896 120.709 16.7575 120.718 16.7309C120.992 15.912 120.709 15.01 120.017 14.4939C119.994 14.4772 119.969 14.4592 119.918 14.4232C119.629 14.2207 119.485 14.1194 119.416 14.0649C117.061 12.211 118.257 8.42814 121.25 8.26578C121.338 8.26101 121.514 8.26101 121.866 8.26101H122.297C122.411 8.26101 122.468 8.261 122.519 8.25834C123.283 8.21879 123.957 7.74734 124.256 7.04373C124.277 6.9961 124.296 6.94278 124.335 6.83613L124.383 6.70392Z" fill="#04436F"/>
            </svg>
          </div>

          <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mb-6">
            I was apprehensive at first, but from my very first visit, I felt welcomed and cared for. The caregivers and staff are like family.
          </p>
          <div className="flex items-center gap-3 mt-auto lg:mt-[70px]">
            <div>
            <p className="text-[#04436F] leading-[26px] font-[500] text-[22px]">Lorem Ipsum</p>
            <p className="text-[#04436F] text-[16px] leading-[25px]">Lorem Ipsum</p>
            </div>
          </div>
          </div>
          <div className="w-full h-[238px] overflow-hidden rounded-b-[20px]">
    <Image
      src="/images/testimonial-img.png" // Replace with your actual image path
      width={393}
      height={230}
      className="w-full h-full object-cover"
      alt="Testimonial"
    />
  </div>
        </div>
        {/* Right Text Testimonial with Curved Design */}
        <div className="bg-white  rounded-[20px]  relative lg:w-[396px] lg:h-[547px]">
        <div className="w-full h-[238px] overflow-hidden rounded-t-[20px]">
    <Image
      src="/images/testimonial-img.png" // Replace with your actual image path
      width={393}
      height={238}
      className="w-full h-full object-cover"
      alt="Testimonial"
    />
  </div>
  <div className="p-[30px]">
          <div className="flex gap-1 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="25" viewBox="0 0 140 25" fill="none">
            <path d="M8.38333 6.70392C8.84521 5.44002 9.07616 4.80807 9.27754 4.49847C10.5593 2.52786 13.4446 2.52786 14.7264 4.49847C14.9278 4.80807 15.1587 5.44002 15.6206 6.70393L15.6678 6.8331C15.7078 6.94265 15.7278 6.99743 15.7487 7.04632C16.0481 7.74765 16.7203 8.21768 17.4818 8.25819C17.5349 8.26101 17.5933 8.26101 17.7099 8.26101H18.2079C18.5417 8.26101 18.7086 8.26101 18.7907 8.26516C21.8177 8.41833 23.0059 12.2656 20.5924 14.099C20.5269 14.1487 20.3891 14.2428 20.1135 14.431C20.0649 14.4642 20.0407 14.4808 20.0193 14.4961C19.3092 15.0089 19.0153 15.9242 19.2943 16.7545C19.3026 16.7794 19.3138 16.8099 19.3361 16.8709C19.5762 17.5281 19.6963 17.8567 19.7378 18.0228C20.4134 20.7235 17.6023 22.9681 15.1181 21.7115C14.9653 21.6343 14.6883 21.4553 14.1343 21.0974L13.2911 20.5528C13.0948 20.4259 12.9966 20.3625 12.9002 20.3141C12.3351 20.03 11.6689 20.03 11.1038 20.3141C11.0074 20.3625 10.9092 20.4259 10.7128 20.5528L9.88664 21.0864C9.3189 21.4532 9.03502 21.6366 8.87825 21.7153C6.39788 22.9618 3.59742 20.7257 4.26402 18.031C4.30615 17.8607 4.4288 17.5251 4.67408 16.8538C4.69756 16.7896 4.7093 16.7575 4.71819 16.7309C4.99168 15.912 4.70881 15.01 4.01664 14.4939C3.99416 14.4772 3.96858 14.4592 3.91743 14.4232C3.62918 14.2207 3.48505 14.1194 3.41583 14.0649C1.06046 12.211 2.25684 8.42814 5.24988 8.26578C5.33784 8.26101 5.514 8.26101 5.86633 8.26101H6.29724C6.41079 8.26101 6.46757 8.261 6.51925 8.25834C7.28284 8.21879 7.95706 7.74734 8.2563 7.04373C8.27655 6.9961 8.29604 6.94278 8.33501 6.83613L8.38333 6.70392Z" fill="#04436F"/>
            <path d="M37.3833 6.70392C37.8452 5.44002 38.0761 4.80807 38.2775 4.49847C39.5592 2.52786 42.4446 2.52786 43.7264 4.49847C43.9278 4.80807 44.1587 5.44002 44.6206 6.70393L44.6677 6.8331C44.7077 6.94265 44.7277 6.99743 44.7486 7.04632C45.048 7.74765 45.7202 8.21768 46.4817 8.25819C46.5348 8.26101 46.5932 8.26101 46.7098 8.26101H47.2078C47.5416 8.26101 47.7085 8.26101 47.7906 8.26516C50.8176 8.41833 52.0058 12.2656 49.5923 14.099C49.5268 14.1487 49.3891 14.2428 49.1135 14.431C49.0649 14.4642 49.0407 14.4808 49.0193 14.4961C48.3092 15.0089 48.0152 15.9242 48.2942 16.7545C48.3025 16.7794 48.3137 16.8099 48.3361 16.8709C48.5762 17.5281 48.6962 17.8567 48.7377 18.0228C49.4133 20.7235 46.6022 22.9681 44.118 21.7115C43.9652 21.6343 43.6882 21.4553 43.1342 21.0974L42.291 20.5528C42.0947 20.4259 41.9965 20.3625 41.9001 20.3141C41.335 20.03 40.6688 20.03 40.1038 20.3141C40.0073 20.3625 39.9091 20.4259 39.7127 20.5528L38.8866 21.0864C38.3188 21.4532 38.035 21.6366 37.8782 21.7153C35.3978 22.9618 32.5974 20.7257 33.264 18.031C33.3061 17.8607 33.4287 17.5251 33.674 16.8538C33.6975 16.7896 33.7092 16.7575 33.7181 16.7309C33.9916 15.912 33.7087 15.01 33.0166 14.4939C32.9941 14.4772 32.9685 14.4592 32.9174 14.4232C32.6291 14.2207 32.485 14.1194 32.4158 14.0649C30.0604 12.211 31.2568 8.42814 34.2498 8.26578C34.3378 8.26101 34.5139 8.26101 34.8663 8.26101H35.2973C35.4108 8.26101 35.4676 8.261 35.5193 8.25834C36.2829 8.21879 36.9571 7.74734 37.2563 7.04373C37.2766 6.9961 37.2961 6.94278 37.3351 6.83613L37.3833 6.70392Z" fill="#04436F"/>
            <path d="M66.3833 6.70392C66.8452 5.44002 67.0762 4.80807 67.2776 4.49847C68.5593 2.52786 71.4446 2.52786 72.7264 4.49847C72.9278 4.80807 73.1586 5.44002 73.6205 6.70393L73.6677 6.8331C73.7077 6.94265 73.7278 6.99743 73.7487 7.04632C74.0481 7.74765 74.7203 8.21768 75.4818 8.25819C75.5349 8.26101 75.5932 8.26101 75.7098 8.26101H76.2078C76.5416 8.26101 76.7086 8.26101 76.7907 8.26516C79.8177 8.41833 81.0058 12.2656 78.5923 14.099C78.5268 14.1487 78.3891 14.2428 78.1135 14.431C78.0649 14.4642 78.0407 14.4808 78.0193 14.4961C77.3092 15.0089 77.0153 15.9242 77.2943 16.7545C77.3026 16.7794 77.3137 16.8099 77.336 16.8709C77.5761 17.5281 77.6962 17.8567 77.7377 18.0228C78.4133 20.7235 75.6023 22.9681 73.1181 21.7115C72.9653 21.6343 72.6882 21.4553 72.1342 21.0974L71.291 20.5528C71.0947 20.4259 70.9965 20.3625 70.9001 20.3141C70.335 20.03 69.6688 20.03 69.1037 20.3141C69.0073 20.3625 68.9091 20.4259 68.7127 20.5528L67.8867 21.0864C67.3189 21.4532 67.0351 21.6366 66.8783 21.7153C64.3979 22.9618 61.5974 20.7257 62.264 18.031C62.3061 17.8607 62.4287 17.5251 62.674 16.8538C62.6975 16.7896 62.7092 16.7575 62.7181 16.7309C62.9916 15.912 62.7087 15.01 62.0166 14.4939C61.9941 14.4772 61.9685 14.4592 61.9174 14.4232C61.6291 14.2207 61.485 14.1194 61.4158 14.0649C59.0604 12.211 60.2568 8.42814 63.2498 8.26578C63.3378 8.26101 63.5139 8.26101 63.8663 8.26101H64.2973C64.4108 8.26101 64.4676 8.261 64.5193 8.25834C65.2829 8.21879 65.9571 7.74734 66.2563 7.04373C66.2766 6.9961 66.296 6.94278 66.335 6.83613L66.3833 6.70392Z" fill="#04436F"/>
            <path d="M95.3833 6.70392C95.8452 5.44002 96.0762 4.80807 96.2776 4.49847C97.5593 2.52786 100.445 2.52786 101.726 4.49847C101.928 4.80807 102.159 5.44002 102.621 6.70393L102.668 6.8331C102.708 6.94265 102.728 6.99743 102.749 7.04632C103.048 7.74765 103.72 8.21768 104.482 8.25819C104.535 8.26101 104.593 8.26101 104.71 8.26101H105.208C105.542 8.26101 105.709 8.26101 105.791 8.26516C108.818 8.41833 110.006 12.2656 107.592 14.099C107.527 14.1487 107.389 14.2428 107.114 14.431C107.065 14.4642 107.041 14.4808 107.019 14.4961C106.309 15.0089 106.015 15.9242 106.294 16.7545C106.303 16.7794 106.314 16.8099 106.336 16.8709C106.576 17.5281 106.696 17.8567 106.738 18.0228C107.413 20.7235 104.602 22.9681 102.118 21.7115C101.965 21.6343 101.688 21.4553 101.134 21.0974L100.291 20.5528C100.095 20.4259 99.9965 20.3625 99.9001 20.3141C99.335 20.03 98.6688 20.03 98.1037 20.3141C98.0073 20.3625 97.9091 20.4259 97.7127 20.5528L96.8867 21.0864C96.3189 21.4532 96.0351 21.6366 95.8783 21.7153C93.3979 22.9618 90.5974 20.7257 91.264 18.031C91.3061 17.8607 91.4288 17.5251 91.6741 16.8538C91.6976 16.7896 91.7092 16.7575 91.7181 16.7309C91.9916 15.912 91.7087 15.01 91.0166 14.4939C90.9941 14.4772 90.9686 14.4592 90.9175 14.4232C90.6292 14.2207 90.485 14.1194 90.4158 14.0649C88.0604 12.211 89.2568 8.42814 92.2498 8.26578C92.3378 8.26101 92.5139 8.26101 92.8663 8.26101H93.2973C93.4108 8.26101 93.4676 8.261 93.5193 8.25834C94.2829 8.21879 94.9571 7.74734 95.2563 7.04373C95.2766 6.9961 95.296 6.94278 95.335 6.83613L95.3833 6.70392Z" fill="#04436F"/>
            <path d="M124.383 6.70392C124.845 5.44002 125.076 4.80807 125.278 4.49847C126.559 2.52786 129.445 2.52786 130.726 4.49847C130.928 4.80807 131.159 5.44002 131.621 6.70393L131.668 6.8331C131.708 6.94265 131.728 6.99743 131.749 7.04632C132.048 7.74765 132.72 8.21768 133.482 8.25819C133.535 8.26101 133.593 8.26101 133.71 8.26101H134.208C134.542 8.26101 134.709 8.26101 134.791 8.26516C137.818 8.41833 139.006 12.2656 136.592 14.099C136.527 14.1487 136.389 14.2428 136.114 14.431C136.065 14.4642 136.041 14.4808 136.019 14.4961C135.309 15.0089 135.015 15.9242 135.294 16.7545C135.303 16.7794 135.314 16.8099 135.336 16.8709C135.576 17.5281 135.696 17.8567 135.738 18.0228C136.413 20.7235 133.602 22.9681 131.118 21.7115C130.965 21.6343 130.688 21.4553 130.134 21.0974L129.291 20.5528C129.095 20.4259 128.997 20.3625 128.9 20.3141C128.335 20.03 127.669 20.03 127.104 20.3141C127.007 20.3625 126.909 20.4259 126.713 20.5528L125.887 21.0864C125.319 21.4532 125.035 21.6366 124.878 21.7153C122.398 22.9618 119.598 20.7257 120.264 18.031C120.306 17.8607 120.429 17.5251 120.674 16.8538C120.698 16.7896 120.709 16.7575 120.718 16.7309C120.992 15.912 120.709 15.01 120.017 14.4939C119.994 14.4772 119.969 14.4592 119.918 14.4232C119.629 14.2207 119.485 14.1194 119.416 14.0649C117.061 12.211 118.257 8.42814 121.25 8.26578C121.338 8.26101 121.514 8.26101 121.866 8.26101H122.297C122.411 8.26101 122.468 8.261 122.519 8.25834C123.283 8.21879 123.957 7.74734 124.256 7.04373C124.277 6.9961 124.296 6.94278 124.335 6.83613L124.383 6.70392Z" fill="#04436F"/>
            </svg>
          </div>

          <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mb-6">
            I was apprehensive at first, but from my very first visit, I felt welcomed and cared for. The caregivers and staff are like family.
          </p>
          <div className="flex items-center gap-3 mt-auto lg:mt-[70px]">
            <div>
            <p className="text-[#04436F] leading-[26px] font-[500] text-[22px]">Lorem Ipsum</p>
            <p className="text-[#04436F] text-[16px] leading-[25px]">Lorem Ipsum</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>



             {/* FAQ Section */}
             <section className="mt-[120px] mb-[120px] text-center">
             <h2 className="text-[#04436F] text-center text-[55px] font-semibold leading-[71.5px]">
             Haben Sie noch Fragen?
            </h2>


            <div className="mt-6 lg:mt-[60px] space-y-[30px] lg:px-[80px] mb-[70px]">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-[#EDF2FB] p-5 rounded-[20px] cursor-pointer"
          onClick={() => toggleFAQ(index)}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-[#04436F] lg:w-[850px] text-left text-[20px] font-semibold leading-[28px] font-['Metropolis']">
              {faq.question}
            </h4>

            {/* Dropdown Icon Rotation */}
            <div
              className={`w-[24px] h-[26px] flex justify-center items-center transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="26"
                viewBox="0 0 24 26"
                fill="none"
              >
                <g clipPath="url(#clip0_1352_2251)">
                  <path
                    d="M12 0.630859C5.37258 0.630859 0 6.00344 0 12.6309C0 19.2583 5.37258 24.6309 12 24.6309C18.6274 24.6309 24 19.2583 24 12.6309C24 6.00344 18.6274 0.630859 12 0.630859Z"
                    fill="#04436F"
                  />
                  <path
                    d="M16.4443 10.409L11.9999 14.8535L7.5554 10.409"
                    stroke="white"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1352_2251">
                    <rect
                      width="24"
                      height="25"
                      fill="white"
                      transform="matrix(-1 0 0 -1 24 25.1309)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          {/* Answer Section */}
          {openIndex === index && (
            <p className="text-[#04436F] text-left mt-4 text-[16px] leading-[26px] font-['Metropolis']">
              {faq.answer}
            </p>
          )}
        </div>
      ))}
    </div>

        </section>
        <section className="bg-[#EDF2FB] rounded-[20px] py-14 px-6 md:px-20 mb-[120px]">
  <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-xl space-y-6 border border-[#F2E6C6]">
    <h2 className="text-3xl font-bold text-[#B99B5F] text-center">
      Mitarbeiter Registrierung starten
    </h2>

    <div className="space-y-4">
      <input
        type="email"
        placeholder="Ihre E-Mail-Adresse"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-5 py-3 text-base focus:ring-2 focus:ring-[#B99B5F] outline-none"
      />

      <label className="flex items-center space-x-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={agbAccepted}
          onChange={() => setAgbAccepted(!agbAccepted)}
          className="h-5 w-5 text-[#B99B5F] focus:ring-[#B99B5F] rounded border-gray-300"
        />
        <span>Ich akzeptiere die <a href="/agb" className="underline text-[#B99B5F] hover:text-[#A6884A]">AGB</a></span>
      </label>

      <button
        onClick={handleEmployeeStart}
        className="w-full py-3 bg-[#B99B5F] text-white font-semibold rounded-xl hover:bg-[#A6884A] transition duration-200"
      >
        Jetzt registrieren
      </button>
    </div>
  </div>
</section>

    </div>
   
  );
}
