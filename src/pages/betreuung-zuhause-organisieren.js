export default function HomeCarePage() {
    return (
      <div className="bg-[#FFFFFF] px-4 lg:px-[70px]">
        
        {/* Hero Section */}
        <section className="bg-[#B99B5F] gap-10 lg:gap-[100px] text-white p-4 lg:p-[60px] rounded-[20px] flex flex-col lg:flex-row items-start">
      
        <div className="lg:w-1/2 flex flex-col justify-start items-start">
        <p className="text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter']">
        Seniorenbetreuung Schweiz
</p>
        <h1 className="text-[40px] lg:text-[52px] font-semibold leading-[47px] mt-2 lg:leading-[60px] tracking-[-1.04px] font-['Metropolis']">
  <span className="text-[#FFFFFF]">Professionelle<br></br> Unterstützung im Alter<br></br> Seniorenbetreuung<br></br> Schweiz</span>
</h1>


<p className="text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2">
Prime Home Care – Ihr zuverlässiger Partner für die Seniorenbetreuung <br></br>zuhause in der Schweiz!  </p>

          </div>
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <img src="/images/hero-services.png" alt="Home Care" className="rounded-lg lg:w-[545px] lg:h-[335px] w-full" />
          </div>
          
        </section>
  
        {/* Introduction Section */}
        <section className="mt-[120px] px-6  flex flex-col lg:flex-row items-center gap-20">
          <img src="/images/intro2.png" alt="Senior care" className="w-full lg:w-1/2 rounded-lg lg:h-[810px] items-start flex justify-start align-top" />
          <div className="lg:w-1/2 text-left">
          <p className="lg:w-[220px] flex flex-col items-start px-[10px] pr-[100px] py-[2px] 
              rounded-l-[50px] 
              bg-[linear-gradient(94deg,#04436F_0%,rgba(0,0,0,0)_100%)] 
              text-[#FAFCFF] text-[18px] font-normal leading-[23.4px] font-['Inter'] mb-2">
  Lorem ipsum
</p>


          <h2 className="text-[#04436F] text-[40px] lg:text-[56px] font-semibold leading-[50px] lg:leading-[64px] font-['Instrument Sans']">
          Professionelle Seniorenbetreuung<br></br> für den Alltag im Alter
</h2>

<p className="text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-2">
Die private Seniorenbetreuung zuhause stellt einen stetig wichtiger werdenden Bestandteil des Lebens im Alter dar.</p>
<p className="text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-4">
Bei alltäglichen Aktivitäten wie der Körperpflege, der Zubereitung von Mahlzeiten, beim Einkaufen sowie bei der Hausarbeit können erfahrene und qualifizierte Betreuerinnen und Betreuer können eine weitreichende Unterstützung leisten. Sie begleiten sie zu Arztterminen oder anderen Terminen, bieten Gesellschaft und Unterhaltung. Sie kümmern sich gerne um Haustiere und teilweise auch um Balkon und Pflanzen. Zudem wünschen sich viele Angehörige, dass stets eine vertraute Ansprechperson vor Ort ist, die im Haus für Schutz und Sicherheit sorgen kann.
</p>
<p className="text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-4">
Die Prime Home Care organisiert umfassende Unterstützung sowie Betreuung und Pflege für das selbstbestimmte Leben im gewohnten Zuhause. Gerade bei einer Live-In-Betreuung müssen die gesetzliche Rahmenbedingungen genau beachtet werden. Die Prime Home Care hilft Ihnen, Probleme und Stolperfallen von vornherein zu vermeiden.<br></br>
💡In unserem Erklärvideo erfahren Sie, wie wir Betreuung zu Hause optimal organisieren.</p>



          </div>
        </section>
  
  
        {/* Call-to-Action Section */}
        <section className="mt-[120px] px-6 py-6 text-left bg-[#EDF2FB] lg:py-[120px] lg:px-[70px]">
        <p className="text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
  Sie müssen private Betreuung für sich <br></br>oder für einen nahen Angehörigen<br></br> organisieren?
</p>

<p className="text-[#003588] text-[24px] font-normal leading-[32px] font-['Metropolis'] mt-[16px]">
  Sie haben das Gefühl, nicht alle Fakten zu kennen und sollen<br></br> weitreichende und kostspielige Entscheidungen erst noch unter<br></br> Zeitdruck treffen?<br></br>
Nehmen Sie zuerst mit uns Kontakt auf, bevor Sie einen Entscheid<br></br> treffen!<br></br>
Sichern Sie sich unsere kostenlose Online-Beratung. Mit Prime<br></br> Home Care erhalten Sie alle Informationen rund um das Thema<br></br> Seniorenbetreuung zu Hause!
</p>

          <button className="bg-[#04436F] text-white lg:mt-[60px] px-6 py-3 rounded-full text-[18px] font-medium mt-6 transition duration-300 hover:bg-[#6FCF97]">
          Jetzt bessere Betreuung organisieren
                    </button>
        </section>
  
        {/* Image & Text Grid */}
        <section className="mt-[120px] px-6 lg:px-0 grid grid-cols-1 lg:grid-cols-2 gap-10">
  
  {/* Left Side - Images */}
  <div className="flex lg:flex-row flex-col gap-8 lg:gap-0 items-start">
    <img src="/images/photo1testt.png" alt="Care 1" 
         className="rounded-lg lg:max-w-[230px] w-full lg:mt-[305px]" />
    <img src="/images/photo2testt.png" alt="Care 2" 
         className="rounded-lg lg:max-w-[338.25px] w-full  lg:ml-[-120px]" />
    <img src="/images/photo2testt.png" alt="Care 3" 
         className="rounded-lg lg:max-w-[338.25px] w-full lg:mt-[250px] lg:ml-[-140px]" />
  </div>

  {/* Right Side - Text Content */}
  <div className="text-left">
    
    {/* Heading */}
    <h3 className="text-[#04436F] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
      Unsere Lösungen für eine optimale Betreuungs-Organisation
    </h3>

    {/* Description */}
    <p className="text-[#04436F] text-[16px] font-light leading-[24px] font-['Metropolis'] mt-4">
      Wir bei Prime Home Care haben viele Jahre Erfahrung in der professionellen Betreuung von 
      Senioren und pflegebedürftigen Menschen gesammelt. Hand in Hand mit externen 
      Pflegefachleuten, die uns bei der Bedarfsanalyse unterstützen, organisieren wir für Sie 
      und Ihre Angehörigen individuelle und ganzheitliche Betreuungslösungen.
      <br /><br />
      Wir haben uns zum Ziel gesetzt, unseren Kunden eine umfassende und neutrale Beratung sowie 
      eine nahtlose Organisation rund um das Thema Pflege und Seniorenbetreuung zuhause zu bieten. 
      Im Folgenden stellen wir Ihnen einige unserer Lösungen vor.
    </p>

    {/* List with SVG Icons */}
    <ul className="mt-6 space-y-6">
      {[
        "Individuelle Pflege-Lösungen",
        "Betreuung zuhause",
        "Fachkundige Beratung"
      ].map((item, index) => (
        <li key={index} className="flex items-center gap-4">
          
          {/* SVG Icon Background */}
          <div className="flex justify-center items-center w-[50px] h-[50px] 
                          bg-[#F1F1F1] rounded-full p-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
            <g clip-path="url(#clip0_1352_2183)">
              <path d="M10.157 22.7589C7.44348 22.8094 5.25 25.0289 5.25 27.7544V29.2544C5.25 30.0814 5.923 30.7544 6.75 30.7544H23.75C24.577 30.7544 25.25 30.0814 25.25 29.2544V27.7544C25.25 25.0284 23.056 22.8084 20.3415 22.7589C20.1705 22.6974 19.2125 22.2814 18.3945 20.5349C18.651 20.3429 18.886 20.1399 19.0985 19.9264C19.689 20.1399 20.4055 20.2544 21.25 20.2544C22.8525 20.2544 23.7415 19.6819 24.2025 19.2039C24.413 18.9889 24.517 18.6929 24.4875 18.3914C24.458 18.0829 24.2945 17.8044 24.033 17.6239C23.652 17.3689 22.7645 16.4379 22.745 13.3094V13.1604C22.749 11.5469 22.75 10.2274 22.75 9.85987L24.6145 5.6529C24.8735 5.13439 24.752 4.50739 24.3195 4.1274C22.8825 2.86839 19.793 0.754395 15.25 0.754395C10.707 0.754395 7.61748 2.86839 6.1795 4.12789C5.7475 4.50789 5.6265 5.13489 5.8755 5.63289L7.75002 9.86041C7.75002 10.2284 7.75098 11.5469 7.755 13.1594V13.3069C7.7355 16.4384 6.84798 17.3694 6.46098 17.6289C6.205 17.8054 6.0415 18.0834 6.0125 18.3919C5.983 18.6934 6.087 18.9894 6.29502 19.2019C6.75852 19.6824 7.64748 20.2544 9.25002 20.2544C10.0945 20.2544 10.8105 20.1399 11.401 19.9264C11.6135 20.1399 11.8485 20.3434 12.105 20.5349C11.2905 22.2719 10.3235 22.6969 10.157 22.7589ZM24.25 27.7544V29.2544C24.25 29.5304 24.026 29.7544 23.75 29.7544H6.75C6.474 29.7544 6.25002 29.5304 6.25002 29.2544V27.7544C6.25002 25.6444 7.893 23.9154 9.96648 23.7689C10.452 24.5789 12.0515 26.8609 15.113 27.7354C15.158 27.7479 15.204 27.7544 15.25 27.7544C15.296 27.7544 15.3425 27.7479 15.387 27.7354C18.4485 26.8609 20.048 24.5789 20.5335 23.7689C22.607 23.9154 24.25 25.6444 24.25 27.7544ZM19.539 23.4674C19 24.2799 17.62 26.0059 15.25 26.7329C12.8795 26.0059 11.4995 24.2794 10.961 23.4674C11.4885 23.1444 12.278 22.4594 12.953 21.0739C13.338 21.2784 13.759 21.4594 14.2285 21.6024C14.5625 21.7049 14.906 21.7564 15.25 21.7564C15.594 21.7564 15.937 21.7049 16.271 21.6024C16.741 21.4594 17.1615 21.2784 17.547 21.0739C18.222 22.4594 19.011 23.1444 19.539 23.4674ZM23.4765 18.4554L23.755 18.0399L23.4855 18.5079C23.157 18.8489 22.5015 19.2549 21.25 19.2549C20.6995 19.2549 20.214 19.1969 19.798 19.0949C20.849 17.6154 21.1425 15.9694 21.2205 15.1984C21.4415 15.1444 21.65 15.0489 21.841 14.9244C22.1005 17.0694 22.8395 18.0284 23.4765 18.4554ZM8.75148 11.5509C8.75052 10.8894 8.74998 10.3644 8.74998 10.0564C9.462 9.70741 11.7265 8.75437 15.25 8.75437C15.398 8.75437 15.538 8.75989 15.6815 8.76338C14.9305 9.81242 13.279 11.2319 9.82698 11.2544C9.43302 11.2569 9.066 11.3669 8.75148 11.5509ZM21.748 11.5554C21.4305 11.3669 21.061 11.2544 20.6695 11.2544C18.5675 11.2544 17.7515 9.96542 17.4355 8.88241C19.716 9.15439 21.199 9.78638 21.7495 10.0564C21.7495 10.3649 21.749 10.8914 21.748 11.5554ZM6.83952 4.87989C8.17098 3.71239 11.035 1.7544 15.25 1.7544C19.465 1.7544 22.329 3.71239 23.66 4.87989C23.752 4.9599 23.776 5.09439 23.7105 5.22739L22.0075 9.06841C21.046 8.62141 18.732 7.75442 15.25 7.75442C11.768 7.75442 9.45348 8.62141 8.49252 9.06841L6.77952 5.20689C6.72348 5.09389 6.7485 4.9599 6.83952 4.87989ZM7.01502 18.5074L7.02402 18.4554C7.6605 18.0289 8.4 17.0694 8.6595 14.9239C8.85048 15.0484 9.0585 15.1439 9.28002 15.1979C9.35802 15.9689 9.65148 17.6149 10.7025 19.0944C10.287 19.1964 9.80148 19.2544 9.2505 19.2544C7.99902 19.2544 7.344 18.8484 7.01502 18.5074ZM10.2505 14.7534C10.2495 14.4779 10.026 14.2544 9.75048 14.2544C9.47202 14.2544 9.21402 14.1424 9.02298 13.9394C8.838 13.7429 8.74548 13.4864 8.7555 13.2134V13.1809C8.78748 12.6729 9.26952 12.2574 9.834 12.2539C13.745 12.2284 15.649 10.5479 16.522 9.30937C16.935 10.5879 17.989 12.2539 20.6705 12.2539C21.233 12.2539 21.713 12.6694 21.7455 13.1839V13.2159C21.7555 13.4859 21.663 13.7419 21.478 13.9389C21.287 14.1419 21.029 14.2539 20.7505 14.2539C20.475 14.2539 20.2515 14.4774 20.2505 14.7529C20.2505 14.9404 20.185 19.3639 15.979 20.6459C15.503 20.7929 14.9995 20.7929 14.5215 20.6459C10.316 19.3639 10.251 14.9409 10.2505 14.7534Z" fill="#04436F"/>
              <path d="M13.75 5.25488H14.75V6.25489C14.75 6.53139 14.9735 6.75491 15.25 6.75491C15.5265 6.75491 15.75 6.53139 15.75 6.25489V5.25488H16.75C17.0265 5.25488 17.25 5.03138 17.25 4.75489C17.25 4.47838 17.0265 4.25488 16.75 4.25488H15.75V3.25489C15.75 2.97838 15.5265 2.75488 15.25 2.75488C14.9735 2.75488 14.75 2.97838 14.75 3.25489V4.25488H13.75C13.4735 4.25488 13.25 4.47838 13.25 4.75489C13.25 5.03138 13.4735 5.25488 13.75 5.25488Z" fill="#04436F"/>
            </g>
            <defs>
              <clipPath id="clip0_1352_2183">
                <rect width="30" height="30" fill="white" transform="translate(0.25 0.754395)"/>
              </clipPath>
            </defs>
          </svg>
          </div>

          {/* List Text */}
          <span className="text-[#04436F] text-[30px] font-semibold leading-[36px] font-['Instrument Sans']">
            {item}
          </span>

        </li>
      ))}
    </ul>

  </div>

</section>

<section className="mt-[120px] px-6  flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 text-left">

          <h2 className="text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
          Optimale Seniorenbetreuung <br></br>mit Prime Home Care</h2>

<p className="text-[#04436F] text-[16px]  font-light leading-[24.6px]  font-['Metropolis'] mt-2">
Die Prime Home Care organisiert bedarfsgerechte und qualitativ hochwertige Seniorenbetreuung für das eigene Zuhause. Ganzheitlich überblicken wir den gesamten Prozess der häuslichen Betreuung mit allen dafür benötigten Pflegeleistungen und beziehen auch die benötigten Hilfsmittel und baulichen Massnahmen mit in unsere Überlegungen ein.</p>
<p className="text-[#04436F] text-[16px]  font-light leading-[24.6px]  font-['Metropolis'] mt-4">
Die Prime Home Care ist selbst kein Pflege-Anbieter oder Personaldienstleister. Es ist jedoch unser Ziel, die jeweils individuell beste und günstigste Hilfe für den Alltag in der gewohnten Umgebung zu organisieren. Dabei sind wir einzig unseren Kunden verpflichtet und agieren treuhänderisch. Unsere Empfehlungen orientieren sich allein an Ihren jeweiligen Betreuungs- und Pflegebedürfnissen. Unsere eigenen Leistungen erbringen wir zum Fixpreis und sind in unserer Beratung daher unabhängig davon, welche Lösung aus Anbietersicht lukrativer erscheint.</p>
<p className="text-[#04436F] text-[16px] font-light leading-[24.6px] font-['Metropolis'] mt-4">
Bei der Organisation professioneller Seniorenbetreuung in der Schweiz ist dieser Ansatz völlig neu. Erfahren Sie mehr über unsere Lösungen für die häufigsten Probleme bei der privaten Altenbetreuung zu Hause.</p>
          </div>
          <img src="/images/image123.png" alt="Senior care" className="w-full lg:w-1/2 rounded-lg lg:h-[547px] items-start flex justify-start align-top" />

        </section>
  
        {/* Join Our Community Section */}
        <section className="bg-[#F1F1F1] lg:py-[50px] lg:px-[330px] px-6 py-6 
                    rounded-[20px] text-center mt-[120px] relative">
  
  {/* Cropped Background Corners */}
  <div className="absolute top-0 left-0 w-[80px] h-[80px] bg-white rounded-br-[40px]"></div>
  <div className="absolute bottom-0 right-0 w-[80px] h-[80px] bg-white rounded-tl-[40px]"></div>

  {/* Heading */}
  <h2 className="text-[#04436F] text-[44px] font-semibold leading-[52.8px] font-['Instrument Sans'] text-center">
    Join our community of care
  </h2>

  {/* Paragraph */}
  <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] font-['Inter'] text-center mt-1">
    At Prime Home Care, we're here to provide compassionate and personalized care to you or your loved ones.
  </p>

  {/* Button */}
  <button className="bg-[#04436F] text-white py-3 px-6 rounded-full text-[18px] font-medium mt-4 
                     lg:mt-[40px] transition duration-300 hover:bg-[#B99B5F]">
    Get started
  </button>

</section>



  
        {/* Flexible Care Models */}
        <section className="mt-[120px]  flex flex-col lg:flex-row items-start gap-10">
          <img src="/images/flexible-care.png" alt="Care model" className="lg:h-[500px] w-full lg:w-1/2 rounded-[20px]" />
          <div className="lg:w-1/2 text-left px-6">
          <h3 className="text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
          Qualifizierte Betreuungskräfte</h3>
<p className="text-[#04436F]  text-[16px] font-normal leading-[24px] font-['Metropolis'] mt-2">
Die eigene Suche nach geeigneten, qualifizierten und zuverlässigen Betreuerinnen und Betreuern ist oft ein langwieriger und mühsamer Prozess. Lieber möchten sich Senioren und Angehörige auf professionelle Anbieter verlassen. Wer aber stellt sicher, dass Betreuungskräfte über die notwendigen Fähigkeiten verfügen, sie sorgfältig ausgewählt und geschult werden? 
Werden Betreuungskräfte eingesetzt, die mindestens über ein in der Schweiz anerkanntes Pflegehelfer-Zertifikat verfügen, so können diejenigen Stunden, welche Grundpflege darstellen, kassenfähig gestaltet werden. Dafür sorgen wir aufgrund unserer Zusammenarbeit mit bewilligten Spitex-Partnern unter deren unter Weisung und Obhut dann die Pflege erfolgt. So wird sichergestellt, dass jede Betreuungskraft über ausreichende Erfahrung und Qualifikationen verfügt. Die Betreuungs- und Pflegekräfte erhalten neben Weiterbildung so auch eine Entlastung bei ihrer Pflegearbeit.<br></br>
Dank der Beteiligung der Krankenkassen an den Betreuungskosten können Sie den Pflegekräften gerne ein überdurchschnittliches Gehalt bezahlen, ohne dass sich dies negativ auf Ihre Gesamtkosten auswirkt. 
</p>

          </div>
        </section>
        <section className="mt-[120px]  flex flex-col lg:flex-row items-start gap-10">
          <div className="lg:w-1/2 text-left ">
          <h3 className="text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
  Flexible Betreuungs-Modelle
</h3>
<p className="text-[#04436F]  text-[16px] font-normal leading-[24px] font-['Metropolis'] mt-2">
  Flexibilität und die Anpassungsfähigkeit an sich wandelnde Bedürfnisse sind wichtige Aspekte bei Wahl 
  der richtigen der Seniorenbetreuung. Unser Modell bietet gegenüber reinen Verleihangeboten mehr 
  Flexibilität, die häusliche Betreuung vertraglich umfassend und zugleich rechtskonform zu regeln. 
  <br /><br />
  Individuelle Arbeitsverträge können dank unserer Beratung und einer umfassenden juristischen 
  Hilfestellung leichter auf sich im Zeitablauf ändernde Rahmenbedingungen angepasst werden. Zugleich 
  bietet unser Treuhandmodell für unsere Kunden den Komfort, sich für alle Fragen und Wünsche nur an 
  einen Ansprechpartner wenden zu müssen.
</p>

          </div>
          <img src="/images/flexible-care.png" alt="Care model" className="lg:h-[500px] w-full lg:w-1/2 rounded-[20px]" />

        </section>
        <section className="mt-[120px]  flex flex-col lg:flex-row items-start gap-10">
          <img src="/images/flexible-care.png" alt="Care model" className="lg:h-[500px] w-full lg:w-1/2 rounded-[20px]" />
          <div className="lg:w-1/2 text-left px-6">
          <h3 className="text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
          Transparente und faire Preise</h3>
<p className="text-[#04436F]  text-[16px] font-normal leading-[24px] font-['Metropolis'] mt-2">
Geld und Finanzen sind für Senioren ein sensibles Thema. Die Seniorenbetreuung soll sich daher häufig zuerst am Kriterium der Preiswürdigkeit orientieren. Überall dort, wo Pflegekräfte zum Einsatz kommen, sollte es zugleich allerdings auch um angemessene und faire Löhne sowie korrekte Arbeitsbedingungen gehen.<br></br><br></br>

Lohn und Kosten miteinander in ein günstiges Verhältnis zu setzen, dies ist eine Aufgabe, die sich die Prime Home Care AG zum Ziel gesetzt hat. Dafür bieten wir eine umfangreiche Beratung für ältere Menschen und deren Angehörige.<br></br><br></br>

Als Kunde profitieren Sie davon einerseits durch zufriedenen und motiviertes Betreuungspersonal mit hoher Qualität, zum andere durch günstige Kosten und eine detaillierte und transparente Kostenaufstellung.Aufgrund sorgfältiger Planung sowie schlanker Prozessabläufe können wir unseren Kunden einen erstklassigen Service bieten und hochwertige private Betreuung zu sehr fairen Kosten organisieren.
</p>

          </div>
        </section>
  
        {/* FAQ Section */}
        <section className="mt-[120px] text-center">
        <h2 className="text-[#04436F] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
    Häufig gestellte Fragen bei der Betreuungs-Organisation
  </h2>

  {/* Paragraph */}
  <p className="text-[#04436F] lg:px-[60px] text-[24px] font-normal leading-[32px] font-['Metropolis'] mt-3">
    Wir haben hier für Sie einige der am häufigsten gestellten Fragen zusammengestellt.
    <br /><br />
    Ihre Frage wurde nicht beantwortet? Warum treten Sie nicht direkt mit uns in Kontakt? 
    Unser<br></br> Team freut sich, von Ihnen zu hören!
  </p>
  <div className="mt-6 lg:mt-[60px] space-y-[30px] lg:px-[80px] mb-[70px]">
  {[
    "Wie wird sichergestellt, dass die Pflegekräfte zuverlässig und qualifiziert sind?",
    "Wie funktioniert die Abrechnung und Bezahlung Ihrer Dienstleistungen?",
    "Was passiert, wenn sich die Betreuungs-Bedürfnisse im Laufe der Zeit ändern?",
    "Wie läuft die Betreuungs-Organisation ab, wenn Betreuung und Pflege kurzfristig notwendig ist oder unerwartet mehr Unterstützung benötigt wird?",
    "Wie wird sichergestellt, dass die Pflegekräfte individuelle Bedürfnisse und Wünsche verstehen und umsetzen?",
  ].map((faq, index) => (
    <div 
      key={index} 
      className="bg-[#EDF2FB] p-5 rounded-[20px] flex justify-between items-center cursor-pointer"
    >
      {/* FAQ Text */}
      <h4 className="text-[#04436F] lg:w-[850px] text-left text-[20px] font-semibold leading-[28px] font-['Metropolis']">
        {faq}
      </h4>

      {/* Dropdown Icon */}
      <div className="w-[24px] h-[26px] flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none">
          <g clip-path="url(#clip0_1352_2251)">
            <path d="M12 0.630859C5.37258 0.630859 0 6.00344 0 12.6309C0 19.2583 5.37258 24.6309 12 24.6309C18.6274 24.6309 24 19.2583 24 12.6309C24 6.00344 18.6274 0.630859 12 0.630859Z" fill="#04436F"/>
            <path d="M16.4443 10.409L11.9999 14.8535L7.5554 10.409" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_1352_2251">
              <rect width="24" height="25" fill="white" transform="matrix(-1 0 0 -1 24 25.1309)"/>
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  ))}
</div>

        </section>
  
      </div>
    );
  }
  