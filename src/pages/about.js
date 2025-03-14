
const teamMembers = [
  { name: "Emma Johnson, RN", position: "Lorem", image: "/images/team1.png" },
  { name: "David Miller, LPN", position: "Lorem", image: "/images/team1.png" },
  { name: "Olivia Martinez, RN", position: "Lorem", image: "/images/team1.png" },
  { name: "Sophia Brown, CNA", position: "Lorem", image: "/images/team1.png" }
];
export default function About() {
  return (
    <div className="bg-white px-4 py-4 max-w-[1430px] mx-auto lg:py-0">
        <section className="bg-[#B99B5F] p-4 rounded-[20px]">
        <h1 className="mt-[200px] text-[#FAFCFF] text-center text-[65px] font-semibold leading-[84.5px]">
        About Prime Home Care</h1>
        <p className="text-[#FAFCFF] mb-[200px] text-center text-[16px] font-normal leading-[25.6px]">
        Brief introduction or mission statement that encapsulates the essence of Prime Home Care.
        </p>
        </section>

      {/* Content with Image */}
      <section className="flex flex-col lg:flex-row items-center justify-between mt-[120px] gap-[50px]">
        <div className="flex-1">
          <h2 className="text-[#04436F] text-[50px] font-semibold leading-[65px] ">
            Dedicated to providing compassionate elder <br></br>home care
          </h2>
          <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-4">
            Founded in ---- by healthcare professionals passionate about home care, Prime Home Care has grown to become a trusted name in home healthcare.
          </p>
          <div className="flex flex-col justify-center mt-[50px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="41" viewBox="0 0 40 41" fill="none" className="w-[50px] h-[50px] bg-[#B99B5F] rounded-[100px]">
            <path d="M20 8.52327V5.18994M20 8.52327C26.4433 8.52327 31.6667 13.7466 31.6667 20.1899M20 8.52327C13.5567 8.52327 8.33333 13.7466 8.33333 20.1899M31.6667 20.1899C31.6667 26.6332 26.4433 31.8566 20 31.8566M31.6667 20.1899H35M8.33333 20.1899H5M8.33333 20.1899C8.33333 26.6332 13.5567 31.8566 20 31.8566M20 31.8566V35.1899M20 24.3566C17.6988 24.3566 15.8333 22.4911 15.8333 20.1899C15.8333 17.8887 17.6988 16.0232 20 16.0232C22.3012 16.0232 24.1667 17.8887 24.1667 20.1899C24.1667 22.4911 22.3012 24.3566 20 24.3566Z" stroke="#04436F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-[#04436F] text-[28px] font-[500] leading-[33.6px]  mt-3">
          Our Mission
        </p>
          <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2">
          At Prime Home Care, our mission is to provide high-quality, compassionate care to individuals in the comfort of their own homes.
        </p>
        </div>
        
        </div>
        <div className="mt-10 lg:mt-0 lg:max-w-[625px] flex-1">
          <img src="/images/about-image.png" alt="Elderly care" className="w-full h-auto rounded-lg" />
        </div>
      </section>


      <section className="bg-[#F1F1F1] p-12 rounded-[20px] text-center mt-[120px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[60px] h-[60px] bg-white rounded-br-[40px]"></div>
        <div className="absolute bottom-0 right-0 w-[60px] h-[60px] bg-white rounded-tl-[40px]"></div>
        <h2 className="text-[#04436F] text-[44px] font-semibold leading-[52.8px] font-['Instrument Sans']">
          Join our community of care
        </h2>
        <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2 mb-10">
          At Prime Home Care, we're here to provide compassionate and personalized care to you or your loved ones.
        </p>
        <button className="bg-[#04436F] text-[#FAFCFF] text-[18px] font-medium leading-[21.6px] font-['Inter'] py-3 px-5 rounded-[50px]">
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
          src="/images/photo2.png"
          alt="Elderly care 2"
          className="max-w-[368.25px] lg:h-[406px] w-full h-auto rounded-[20px]"
        />
      </div>

      {/* Text Content */}
      <div className=" text-left">
        <h2 className="text-[#04436F] text-[55px] font-semibold leading-[71.5px] font-['Instrument Sans']">
          Our value
        </h2>
        <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2">
          Our values guide everything we do. We believe in Compassion,<br></br> Integrity, Excellence, Respect, and Innovation.
        </p>

        {/* Checklist Items */}
        <div className="mt-6 space-y-4">
          {[
            "We care deeply about our clients and their families.",
            "We act with honesty and transparency.",
            "We treat everyone with dignity and respect.",
            "We strive for the highest standards in all we do."
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* SVG Checkmark Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
                <path d="M15.8398 29.8643C23.0195 29.8643 28.8398 24.044 28.8398 16.8643C28.8398 9.68456 23.0195 3.86426 15.8398 3.86426C8.66014 3.86426 2.83984 9.68456 2.83984 16.8643C2.83984 24.044 8.66014 29.8643 15.8398 29.8643Z" fill="#ECF2FF"/>
                <path d="M11.1733 16.8636L13.1228 19.1846C13.4738 19.6024 13.6493 19.8114 13.8755 19.8584C13.9482 19.8736 14.023 19.8764 14.0966 19.8669C14.3257 19.8373 14.5167 19.6424 14.8987 19.2526L20.5066 13.5303" stroke="#04436F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Checklist Text */}
              <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] font-['Inter']">
                {item}
              </p>
            </div>
          ))}
        </div>
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

    <section className="bg-[#FAFCFF] mt-[120px] mb-[40px] px-4 lg:px-[70px] text-center">
      {/* Title */}
      <h2 className="text-[#04436F] text-left text-[55px] font-semibold leading-[71.5px]  mb-[60px]">
        Meet our dedicated team
      </h2>

      {/* Team Members Grid */}
      <div className="flex flex-wrap justify-center gap-[40px]">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex flex-col items-center max-w-[267.5px]">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-auto rounded-lg"
            />
            <h3 className="text-[#04436F] text-[22px] font-medium leading-[26.4px] mt-4">
              {member.name}
            </h3>
            <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] ">
              {member.position}
            </p>
          </div>
        ))}
      </div>
    </section>
      </div>
  );
}
