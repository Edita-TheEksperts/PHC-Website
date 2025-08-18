
import Link from 'next/link';

const teamMembers = [
  { name: "Emma Johnson, RN", position: "Lorem", image: "/images/team1.png" },
  { name: "David Miller, LPN", position: "Lorem", image: "/images/team1.png" },
  { name: "Olivia Martinez, RN", position: "Lorem", image: "/images/team1.png" },
  { name: "Sophia Brown, CNA", position: "Lorem", image: "/images/team1.png" }
];
export default function About() {
  return (
    <div className="bg-[#FAFCFF] px-4 py-4 max-w-[1430px] mx-auto lg:py-0">
 
                <section className="bg-[#B99B5F] gap-10 lg:gap-[100px] text-white p-4 lg:p-[60px] rounded-[20px] flex flex-col lg:flex-row items-start">
        <div className="lg:w-1/2 mt-6 lg:mt-0">
            <img src="/images/hero-services.png" alt="Home Care" className="rounded-lg lg:w-[545px] lg:h-[335px] w-full" />
          </div>
        <div className="lg:w-1/2 flex flex-col justify-start items-start">
  
        <h1 className="text-[40px] lg:text-[52px] font-semibold leading-[47px] mt-2 lg:mt-[38px] lg:leading-[60px] tracking-[-1.04px] font-['Metropolis']">
  <span className="text-[#FFFFFF]">Über die Prime Home Care AG</span>
</h1>


<p className="text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2">
Willkommen bei der Prime Home Care AG – Ihrem zuverlässigen Partner für individuelle und professionelle stundenweise Betreuung zu Hause. </p>

          </div>
          
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
          <path d="M20 9.32308V5.98975M20 9.32308C26.4433 9.32308 31.6667 14.5464 31.6667 20.9897M20 9.32308C13.5567 9.32308 8.33333 14.5464 8.33333 20.9897M31.6667 20.9897C31.6667 27.433 26.4433 32.6564 20 32.6564M31.6667 20.9897H35M8.33333 20.9897H5M8.33333 20.9897C8.33333 27.433 13.5567 32.6564 20 32.6564M20 32.6564V35.9897M20 25.1564C17.6988 25.1564 15.8333 23.2909 15.8333 20.9897C15.8333 18.6885 17.6988 16.823 20 16.823C22.3012 16.823 24.1667 18.6885 24.1667 20.9897C24.1667 23.2909 22.3012 25.1564 20 25.1564Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>          </svg>
          <p className="text-[#04436F] text-[28px] font-[500] leading-[33.6px]  mt-3">
          Unsere Philosophie
        </p>
          <p className="text-[#04436F] lg:pr-[70px] text-[16px] font-normal leading-[25.6px] mt-2">
          Unsere Philosophie basiert auf Empathie, Respekt und Kompetenz. Wir wissen, dass jede Person einzigartige Bedürfnisse hat. Daher legen wir grossen Wert auf eine persönliche und flexible Betreuung, die genau auf die individuellen Anforderungen abgestimmt ist. Von der Betreuung über Gesellschaft Leisten bis hin zu hauswirtschaftlichen Dienstleistungen – wir stehen Ihnen zuverlässig zur Seite.        </p>
        </div>
        <div className="flex flex-col justify-center mt-[16px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="41" viewBox="0 0 40 41" fill="none" className="w-[50px] h-[50px] bg-[#B99B5F] rounded-[100px]">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.68317 21.8998C6.39984 21.4165 6.18317 21.0165 6.03317 20.7165C6.18317 20.4165 6.39984 20.0165 6.68317 19.5331C7.29984 18.4998 8.24984 17.1165 9.5165 15.7331C12.0832 12.9831 15.9498 10.2998 21.3165 10.2998C26.2498 10.2998 30.1165 12.9498 32.8165 15.7498C34.1498 17.1331 35.1665 18.5331 35.8498 19.5831C36.1665 20.0498 36.4165 20.4665 36.5832 20.7498C36.4332 21.0498 36.2165 21.4331 35.9498 21.8998C35.3332 22.9331 34.3832 24.3165 33.1165 25.6998C30.5498 28.4498 26.6832 31.1331 21.3165 31.1331C15.9498 31.1331 12.0832 28.4498 9.5165 25.6998C8.24984 24.3165 7.29984 22.9331 6.68317 21.8998ZM39.1332 21.2165C39.2832 20.8665 39.2665 20.4831 39.0998 20.1498V20.1165C39.0998 20.1165 39.0498 20.0498 39.0165 19.9998C38.9665 19.8998 38.8998 19.7665 38.7998 19.5998C38.5998 19.2665 38.3165 18.7831 37.9498 18.2165C37.1998 17.0665 36.0832 15.5498 34.6165 14.0165C31.6832 10.9831 27.2165 7.7998 21.3165 7.7998C15.0165 7.7998 10.5498 10.9498 7.69984 14.0331C6.2665 15.5665 5.2165 17.0998 4.53317 18.2498C4.19984 18.8331 3.93317 19.3165 3.7665 19.6498C3.68317 19.8331 3.6165 19.9665 3.5665 20.0665C3.54984 20.1165 3.53317 20.1498 3.5165 20.1831V20.2165C3.45049 20.3749 3.4165 20.5448 3.4165 20.7165C3.4165 20.8881 3.45049 21.058 3.5165 21.2165V21.2498C3.53317 21.2831 3.54984 21.3165 3.5665 21.3665C3.6165 21.4665 3.68317 21.5998 3.7665 21.7831C3.93317 22.1165 4.19984 22.5998 4.53317 23.1831C5.2165 24.3331 6.2665 25.8665 7.69984 27.3998C10.5498 30.4831 15.0165 33.6331 21.3165 33.6331C27.6165 33.6331 32.0832 30.4831 34.9332 27.3998C36.3665 25.8665 37.4165 24.3331 38.0998 23.1831C38.4332 22.5998 38.6998 22.1165 38.8665 21.7831C38.9498 21.5998 39.0165 21.4665 39.0665 21.3665C39.0832 21.3165 39.0998 21.2831 39.1165 21.2498V21.2165H39.1332ZM23.6332 15.6498L22.9165 14.4998C22.7419 14.2351 22.5043 14.0178 22.2251 13.8674C21.9458 13.7171 21.6336 13.6384 21.3165 13.6384C20.9994 13.6384 20.6872 13.7171 20.4079 13.8674C20.1287 14.0178 19.8911 14.2351 19.7165 14.4998L18.9998 15.6498C18.2998 16.7498 17.3498 17.6998 16.2498 18.3998L15.0998 19.1165C14.8351 19.2911 14.6178 19.5287 14.4675 19.8079C14.3171 20.0871 14.2384 20.3993 14.2384 20.7165C14.2384 21.0336 14.3171 21.3458 14.4675 21.625C14.6178 21.9043 14.8351 22.1419 15.0998 22.3165L16.2498 23.0331C17.3498 23.7331 18.2998 24.6831 18.9998 25.7831L19.7165 26.9331C20.4665 28.0831 22.1665 28.0831 22.9165 26.9331L23.6332 25.7831C24.3332 24.6831 25.2832 23.7331 26.3832 23.0331L27.5332 22.3165C28.6832 21.5665 28.6832 19.8665 27.5332 19.1165L26.3832 18.3998C25.2832 17.6998 24.3332 16.7498 23.6332 15.6498ZM21.0998 16.9831L21.3165 16.6665L21.5332 16.9831C22.4332 18.3998 23.6332 19.5998 25.0498 20.4998L25.3665 20.7165L25.0498 20.9331C23.6332 21.8331 22.4332 23.0331 21.5332 24.4498L21.3165 24.7665L21.0998 24.4498C20.2003 23.0334 18.9996 21.8327 17.5832 20.9331L17.2665 20.7165L17.5832 20.4998C18.9998 19.5998 20.1998 18.3998 21.0998 16.9831Z" fill="#FAFCFF"/>
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
Werden Sie Teil unserer Pflegegemeinschaft 
  </h2>
  <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2 mb-10">
Bei Prime Home Care bieten wir einfühlsame und individuelle Betreuung – für Sie oder Ihre Liebsten.   </p>
  <Link   href="/register-client" className="bg-[#04436F] hover:bg-[#B99B5F] w-[180px] text-[#FAFCFF] text-[18px] font-medium leading-[21.6px] py-3 px-5 rounded-[50px]">
    Buchen Sie jetzt
  </Link>
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
        Qualität und Vertrauen sind die Grundlagen unseres Handelns. Durch kontinuierliche Weiterbildung und hohe Standards in der Betreuung, stellen wir sicher, dass unsere Kundinnen und Kunden jederzeit in besten Händen sind. Unsere digitale Plattform sorgt zudem für maximale Transparenz und Effizienz – von der Buchung bis zur Abrechnung.        
        </p>
      </div>
    </section>
   <section 
  className="bg-[#F1F1F1] lg:h-[300px] h-[400px] flex flex-col rounded-[20px] justify-center items-center text-center mt-[120px] relative overflow-hidden" 
  style={{ backgroundImage: 'url(/images/phc-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <h2 className="text-[#04436F] text-[44px] font-semibold leading-[52.8px]">
 Haben Sie Fragen?<br></br> Kontaktieren Sie uns über unser Kontaktformular
   </h2>
  <Link href="/contact">
  <button className="bg-[#04436F]  hover:bg-[#B99B5F] w-[180px] text-[#FAFCFF] mt-4 text-[18px] font-medium leading-[21.6px] py-3 px-5 rounded-[50px]">
    Kontakt
  </button>
</Link>
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
