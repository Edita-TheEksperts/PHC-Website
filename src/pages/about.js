
const teamMembers = [
  { name: "Emma Johnson, RN", position: "Lorem", image: "/images/team1.png" },
  { name: "David Miller, LPN", position: "Lorem", image: "/images/team1.png" },
  { name: "Olivia Martinez, RN", position: "Lorem", image: "/images/team1.png" },
  { name: "Sophia Brown, CNA", position: "Lorem", image: "/images/team1.png" }
];
export default function About() {
  return (
    <div className="bg-[#FAFCFF] px-4 py-4 max-w-[1430px] mx-auto lg:py-0">
        <section className="bg-[#B99B5F] p-4 rounded-[20px]">
        <h1 className="mt-[200px] text-[#FAFCFF] text-center lg:text-[65px] text-[45px] leading-[55px] font-semibold lg:leading-[84.5px]">
        Über die Prime Home Care AG</h1>
        <p className="text-[#FAFCFF] mb-[200px] text-center text-[16px] font-normal leading-[25.6px]">
        Willkommen bei der Prime Home Care AG – Ihrem zuverlässigen Partner für individuelle und professionelle stundenweise Betreuung zu Hause.        </p>
        </section>

      {/* Content with Image */}
      <section className="flex flex-col p-4 lg:flex-row items-center justify-between mt-[120px] gap-[40px]">
        <div className="flex-1">
          <h2 className="text-[#04436F] text-[40px] font-semibold leading-[48px] ">
          Verpflichtet zu fürsorglicher Seniorenbetreuung in den<br></br> eigenen vier Wänden.
          </h2>
          <p className="text-[#04436F] lg:pr-[80px] text-[16px] font-normal leading-[25.6px] mt-4">
          Seit unserer Gründung verfolgen wir das Ziel, Menschen in ihrem vertrauten Umfeld die bestmögliche Betreuung und Unterstützung zu bieten. Mit einem engagierten Team aus erfahrenen Mitarbeitern und einem breiten Spektrum an Dienstleistungen setzen wir uns täglich dafür ein, die Lebensqualität unserer Kundinnen und Kunden zu verbessern.          </p>
          <div className="flex flex-col justify-center mt-[16px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="41" viewBox="0 0 40 41" fill="none" className="w-[50px] h-[50px] bg-[#B99B5F] rounded-[100px]">
            <path d="M20 8.52327V5.18994M20 8.52327C26.4433 8.52327 31.6667 13.7466 31.6667 20.1899M20 8.52327C13.5567 8.52327 8.33333 13.7466 8.33333 20.1899M31.6667 20.1899C31.6667 26.6332 26.4433 31.8566 20 31.8566M31.6667 20.1899H35M8.33333 20.1899H5M8.33333 20.1899C8.33333 26.6332 13.5567 31.8566 20 31.8566M20 31.8566V35.1899M20 24.3566C17.6988 24.3566 15.8333 22.4911 15.8333 20.1899C15.8333 17.8887 17.6988 16.0232 20 16.0232C22.3012 16.0232 24.1667 17.8887 24.1667 20.1899C24.1667 22.4911 22.3012 24.3566 20 24.3566Z" stroke="#04436F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-[#04436F] text-[28px] font-[500] leading-[33.6px]  mt-3">
          Unsere Philosophie
        </p>
          <p className="text-[#04436F] lg:pr-[70px] text-[16px] font-normal leading-[25.6px] mt-2">
          Unsere Philosophie basiert auf Empathie, Respekt und Kompetenz. Wir wissen, dass jede Person einzigartige Bedürfnisse hat. Daher legen wir grossen Wert auf eine persönliche und flexible Betreuung, die genau auf die individuellen Anforderungen abgestimmt ist. Von der Betreuung über Gesellschaft Leisten bis hin zu hauswirtschaftlichen Dienstleistungen – wir stehen Ihnen zuverlässig zur Seite.        </p>
        </div>
        <div className="flex flex-col justify-center mt-[16px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="41" viewBox="0 0 40 41" fill="none" className="w-[50px] h-[50px] bg-[#B99B5F] rounded-[100px]">
            <path d="M20 8.52327V5.18994M20 8.52327C26.4433 8.52327 31.6667 13.7466 31.6667 20.1899M20 8.52327C13.5567 8.52327 8.33333 13.7466 8.33333 20.1899M31.6667 20.1899C31.6667 26.6332 26.4433 31.8566 20 31.8566M31.6667 20.1899H35M8.33333 20.1899H5M8.33333 20.1899C8.33333 26.6332 13.5567 31.8566 20 31.8566M20 31.8566V35.1899M20 24.3566C17.6988 24.3566 15.8333 22.4911 15.8333 20.1899C15.8333 17.8887 17.6988 16.0232 20 16.0232C22.3012 16.0232 24.1667 17.8887 24.1667 20.1899C24.1667 22.4911 22.3012 24.3566 20 24.3566Z" stroke="#04436F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-[#04436F] text-[28px] font-[500] leading-[33.6px]  mt-3">
          Unsere Vision
        </p>
          <p className="text-[#04436F] lg:pr-[70px] text-[16px] font-normal leading-[25.6px] mt-2">
          Als digitales Unternehmen verbinden wir professionelle Betreuung mit modernster Technologie. Über unsere benutzerfreundliche digitale Plattform ermöglichen wir es Ihnen, flexibel und unkompliziert die passende Betreuung zu finden und zu buchen. Unser Ziel ist es, Menschen in ihrem vertrauten Umfeld die bestmögliche Unterstützung zu bieten – individuell abgestimmt und genau dann, wenn sie gebraucht wird.           </p>
        </div>
        
        </div>
        <div className="mt-10 lg:mt-0 lg:max-w-[625px] flex-1">
          <img src="/images/phc-about-image1.png" alt="Elderly care" className="w-full h-auto rounded-[20px]" />
        </div>
      </section>


      <section 
  className="bg-[#F1F1F1] lg:h-[300px] h-[400px] flex flex-col rounded-[20px] justify-center items-center text-center mt-[120px] relative overflow-hidden" 
  style={{ backgroundImage: 'url(/images/phc-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <h2 className="text-[#04436F] text-[44px] font-semibold leading-[52.8px]">
    Join our community of care
  </h2>
  <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2 mb-10">
    At Prime Home Care, we're here to provide compassionate and personalized care to you or your loved ones.
  </p>
  <button className="bg-[#04436F] w-[140px] text-[#FAFCFF] text-[18px] font-medium leading-[21.6px] py-3 px-5 rounded-[50px]">
    Get started
  </button>
</section>


      <section className="flex flex-col lg:flex-row items-center justify-between mx-auto mt-[120px] lg:px-[70px] gap-[70px] ">
      {/* Images */}
      <div className="flex flex-col lg:flex-row gap-10">
        <img
          src="/images/photo1.png"
          alt="Elderly care 1"
          className="lg:max-w-[294.59px] lg:h-[306px] lg:mt-[150px] w-full h-auto rounded-[20px]"
        />
        <img
          src="/images/phc-2-container.png"
          alt="Elderly care 2"
          className="max-w-[368.25px] lg:h-[406px] w-full h-auto rounded-[20px]"
        />
      </div>

      {/* Text Content */}
      <div className=" flex-1 text-left p-4 lg:p-0">
        <h2 className="text-[#04436F] text-[50px] lg:text-[55px] font-semibold leading-[71.5px]">
        Unsere Werte
        </h2>
        <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2">
        Qualität und Vertrauen sind die Grundlagen unseres Handelns. Durch kontinuierliche Weiterbildung und hohe Standards in der Betreuungstellen wir sicher, dass unsere Kundinnen und Kunden jederzeit in besten Händen sind. Unsere digitale Plattform sorgt zudem für maximale Transparenz und Effizienz – von der Buchung bis zur Abrechnung.        
        </p>
      </div>
    </section>

    <section className="bg-[#FAFCFF] mt-[120px] px-4 lg:px-[70px] text-center">
      <div className="flex flex-wrap justify-center gap-[40px]">
        {/* Stats Array */}
        {[
          { number: "300", label: "Patients served" },
          { number: "30", label: "Caregivers" },
          { number: "10", label: "Services offered" },
          { number: "95%", label: "Client satisfaction" }
        ].map((stat, index) => (
          <div key={index} className="flex flex-col items-center w-[275px] gap-[10px]">
            <h2 className="text-[#04436F] text-[65px] font-semibold leading-[78px]">
              {stat.number}
            </h2>
            <p className="text-[#04436F] w-[110px] text-[18px] font-normal leading-[25.6px] ">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-[#FAFCFF] mt-[120px] mb-[40px] px-4 lg:px-[20px] text-center">
      {/* Title */}
      <h2 className="text-[#04436F] text-left text-[40px] leading-[47px] lg:text-[55px] font-semibold lg:leading-[71.5px]  mb-[60px]">
      Ihre Zufriedenheit ist unser Antrieb      
      </h2>
      <h2 className="text-[#04436F] text-left text-[32px] font-[400] leading-[40.5px]  mb-[120px]">
      Wir bei der Prime Home Care AG sind stolz darauf, Ihnen ein Stück Lebensqualität und Selbstständigkeit zurückzugeben – in Ihrem Zuhause, wo Sie sich am wohlsten fühlen.      </h2>
    </section>
      </div>
  );
}
