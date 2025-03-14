import Image from "next/image";
import "../styles/globals.css";

export default function Home() {
  return (
    <div className=" max-w-[1430] mx-auto">
      {/* Hero Section */}
      <section className="max-w-[1430px] bg-[#EDF2FB] rounded-[20px] mx-auto flex flex-col lg:flex-row items-center gap-6 lg:px-[70px]  px-6 py-12 lg:py-20">
        {/* Left Content */}
        <div className="lg:w-1/2 gap-[32px]">
        <h1 className="text-[#04436F] font-['Instrument Sans'] text-[45px] lg:text-[65px] font-semibold lg:leading-[84.5px]">
  Empowering <br></br>home care<br></br> solutions.
</h1>


<button className="mt-6 px-[20px] py-[12px] bg-[#04436F] text-[#FAFCFF] 
                   font-['Inter'] text-[18px] font-medium leading-[21.6px] 
                   rounded-[50px] flex items-center justify-center 
                   hover:bg-[#033559] transition 
                   text-center">
  Explore our services
</button>

          {/* Avatars & Bullet Points */}
          <div className="mt-4 flex items-center gap-4">
            {/* Staff Avatars */}
            <div className="flex -space-x-4">
              <Image src="/images/avatar1.png" alt="Staff 1" width={50} height={50} className="rounded-full border border-white" />
              <Image src="/images/avatar2.png" alt="Staff 2" width={50} height={50} className="rounded-full border border-white" />
              <Image src="/images/avatar3.png" alt="Staff 3" width={50} height={50} className="rounded-full border border-white" />
              <Image src="/images/avatar4.png" alt="Staff 3" width={50} height={50} className="rounded-full border border-white" />

            </div>
          </div>
          
          <div className="mt-[30px]">
          <h1 className="text-[#04436F] font-['Instrument Sans'] text-[22px] font-semibold leading-[26.4px]">
  24/7 availability
</h1>
          </div>
          <ul className="mt-2 space-y-2 text-[#04436F] font-['Inter'] text-[16px] font-normal leading-[25.6px] pl-[30px] list-disc">
          <li>Continuous monitoring</li>
            <li>Assistance with activities of daily living</li>
          </ul>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2">
          <Image src="/images/hero-phc123.png" alt="Elderly care" width={800} height={600} className="rounded-[20px]" />
          
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#EDF2FB] rounded-[20px] max-w-[1430px] mx-auto px-6 mt-[120px] ">
      <h2 className="text-[#04436F] text-center font-['Instrument Sans'] text-[55px] font-semibold leading-[71.5px] pt-4">
  Explore our comprehensive services
</h2>


       {/* Services Grid */}
<div className="mt-10 lg:mt-[70px] grid grid-cols-1 px-[120px] md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-[60px] pb-[120px]">
  {[
    {
      title: "Skilled nursing care",
      description: "Killed nursing care refers to specialized medical care provided by licensed nurses under the supervision of healthcare professionals.",
      icon: "/images/icon-nursing.png",
    },
    {
      title: "Companion services",
      description: "Companion services involve non-medical support and companionship provided to individuals who require assistance.",
      icon: "/images/icon-companion.png",
    },
    {
      title: "Home health aides",
      description: "Meal Preparation: Planning and preparing nutritious meals based on dietary needs and preferences.",
      icon: "/images/icon-health-aides.png",
    },
    {
      title: "Medication management",
      description: "Home health aides may administer medications according to a prescribed schedule, ensuring that the correct dosage is taken at the right time.",
      icon: "/images/icon-medication.png",
    },
    {
      title: "Personalized care plan",
      description: "A thorough assessment is conducted to evaluate the individual's current health status, medical history, functional abilities, and any specific care needs.",
      icon: "/images/icon-care-plan.png",
    },
  ].map((service, index, array) => (
    <div
      key={index}
      className={`bg-white p-[40px] rounded-[20px] flex flex-col justify-center items-center text-center 
      ${index === array.length - 1 ? "md:col-span-2 lg:col-span-2 flex justify-center lg:w-[541px] lg:h-[330px] mx-auto" : ""}`}
    >
      {/* Icon Background */}
      <div className="w-[100px] h-[100px] bg-[#EDF2FB] rounded-full flex justify-center items-center mb-[30px]">
        <Image src={service.icon} alt={service.title} width={50} height={50} />
      </div>

      {/* Title */}
      <h3 className="text-[#04436F] text-center font-['Instrument Sans'] text-[28px] font-semibold leading-[33.6px]">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-[#04436F] text-center font-['Inter'] text-[16px] font-normal leading-[25.6px] mt-[10px]">
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
          src="/images/bg-hero-1.png"  // Change this to your image path
          alt="Consultation"
          layout="fill"
          objectFit="cover"
          className="rounded-[20px] lg:block hidden "
        />
           <Image
          src="/images/consultation-bg.png"  // Change this to your image path
          alt="Consultation"
          layout="fill"
          objectFit="cover"
          className="rounded-[20px] lg:hidden block "
        />
        {/* Overlay */}
        <div className="absolute inset-0 lg:mt-[-100px]  rounded-[20px] flex flex-col gap-3 lg:gap-[30px] justify-center items-center text-center px-6 ">
        <p className="text-[#FAFCFF] text-[18px] font-['Inter'] font-normal leading-[23.4px] 
            px-[10px] py-[2px] flex flex-col items-start 
            rounded-l-[50px] rounded-r-none 
            bg-[linear-gradient(97deg,#04436F_0%,rgba(0,0,0,0.00)_100%)] text-center">
            Get in Touch
            </p>

            <h2 className="text-[#FAFCFF] text-center font-['Instrument Sans'] 
            text-[32px] lg:text-[55px] font-semibold leading-[38px] lg:leading-[71.5px] mt-2">
            Have a question or are you <br /> ready to schedule a <br /> consultation?
            </h2>

            <button className="mt-4 px-[20px] py-[12px] bg-[#04436F] text-[#FAFCFF] 
   text-[18px] font-['Inter'] font-medium leading-[21.6px] 
   rounded-[50px] flex flex-col items-center text-center 
   hover:bg-[#033559] transition">
  Schedule a home visit
</button>

        </div>
      </div>

      {/* Contact Options */}
      <div className="marginclass mt-10 lg:mt-[-80px] z-999 lg:ml-[650px] absolute flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-[40px]">
        {/* Online Session */}
        <div className="flex flex-col items-right text-right">
        <p className="text-[#04436F] font-['Instrument Sans'] text-[22px] font-medium leading-[26.4px] text-right">
  Call us for home service
</p>

<p className="text-[#04436F] font-['Inter'] text-[16px] font-normal leading-[25.6px] text-right underline">
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
        {/* Home Service */}
        <div className="flex flex-col  items-start  text-left">
        <p className="text-[#04436F] font-['Instrument Sans'] text-[22px] font-medium leading-[26.4px] text-right">
  Call us for home service
</p>

<p className="text-[#04436F] font-['Inter'] text-[16px] font-normal leading-[25.6px] text-right underline">
  Lorem
</p>
        </div>
      </div>
    </section>

    <section className="max-w-[1400] mt-[120px] mx-auto p-4 lg:px-0 flex flex-col lg:flex-row items-center gap-12 lg:gap-[80px]">
      
      {/* Left: Image with Custom Cropped Shape */}
      <div className="relative w-full lg:w-[610px] h-[400px] lg:h-[730px]">
        <Image
          src="/images/easy-care-steps.png"  // Change to your actual image path
          alt="Easy Care"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Right: Text Content */}
      <div className="lg:w-1/2">
        {/* Tag: "How we work" */}
        <p className="mb-[10px] px-[14px] py-[2px] text-[#FAFCFF] text-[18px] font-normal leading-[23.4px] rounded-l-[50px]  inline-block"
         style={{
            background: "linear-gradient(94deg, #04436F 0%, rgba(0, 0, 0, 0.00) 100%)",
          }}>
  How we work
</p>


        {/* Main Title */}
        <h2 className="text-[#04436F] font-['Instrument Sans'] text-[32px] lg:text-[55px] font-semibold leading-[40px] lg:leading-[71.5px] mb-10 lg:mb-[70px]">
  Easy care in three steps
</h2>


        {/* Steps List */}
        <div className="space-y-6 lg:space-y-[50px]">
          {[
            {
              number: "01",
              title: "Collaboration",
              description:
                "We believe in the power of collaboration and teamwork.",
              bgColor: "bg-[#EDF2FB]",
              textColor: "text-[#003588]",
            },
            {
              number: "02",
              title: "Caregiver match",
              description:
                "Once your care plan is in place, we’ll carefully match you with a qualified caregiver.",
              bgColor: "bg-[#B99B5F]",
              textColor: "text-white",
            },
            {
              number: "03",
              title: "Enjoy care at home",
              description:
                "With your caregiver in place, you can relax and enjoy personalized care in the comfort of your own home.",
              bgColor: "bg-[#003588]",
              textColor: "text-white",
            },
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Step Number */}
              <div
                className={`w-[70px] h-[70px] text-[36px] flex items-center justify-center leading-[500] font-[500] rounded-full ${step.bgColor} ${step.textColor}`}
              >
                {step.number}
              </div>

              {/* Step Content */}
              <div>
                <h3 className="text-[#04436F] font-['Instrument Sans'] text-[22px] lg:text-[28px] font-medium leading-[28px] lg:leading-[33.6px]">
                {step.title}
                </h3>

                <p className="text-[#04436F] lg:w-[500px] font-['Inter'] text-[16px] font-normal leading-[25.6px]">
                {step.description}
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


    <section className="text-center mt-[120px]">
        <h2 className="text-[#04436F] text-[55px] mb-4 lg:mb-[70px] font-semibold leading-[71.5px] font-['Instrument Sans'] text-center">
            Pricing
         </h2>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  
  {/* Hourly Care Plan */}
  <div className="rounded-[20px] text-center relative overflow-hidden bg-[#FFFFFF]">
    
    {/* Header */}
    <div className="w-full p-[50px] text-left rounded-t-[20px] bg-[#EDF2FB] text-[#000000]">

{/* Plan Title */}
<h3 className="text-[22px] font-medium leading-[30.8px] font-['Instrument Sans']">
  Hourly Care Plan
</h3>

{/* Price Section - Now properly aligned */}
<div className="flex items-baseline gap-1 mt-[20px]">
  <span className="text-[#04436F] text-[70px] font-semibold leading-[70px] font-['Instrument Sans']">
    $19
  </span>
  <span className="text-[#04436F] text-[22px] font-normal leading-[22px] font-['Inter']">
    /hour
  </span>
</div>

</div>

<div className="p-[50px] flex flex-col justify-center">
  {/* Features */}
  <ul className="mt-4 space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px] font-['Inter'] list-disc pl-[20px]">
    <li>Personal care assistance</li>
    <li>Medication reminders</li>
    <li>Meal preparation and feeding assistance</li>
    <li>Companionship and emotional support</li>
  </ul>
</div>


    {/* Button */}
    <div className="lg:mt-[100px] mt-6 mb-[50px]">
      <button className="bg-[#04436F] text-white lg:px-[120px] py-3 px-6 rounded-full text-[18px] font-medium 
                         transition duration-300 hover:bg-[#6FCF97]">
        Book now
      </button>
    </div>

  </div>

  {/* Hourly Care Plan */}
  <div className="rounded-[20px] text-center relative overflow-hidden bg-[#EDF2FB]">
    
    {/* Header */}
    <div className="w-full p-[50px] text-left rounded-t-[20px] bg-[#B99B5F] text-white">

{/* Plan Title */}
<h3 className="text-[22px] font-medium leading-[30.8px] font-['Instrument Sans']">
  Hourly Care Plan
</h3>

{/* Price Section - Now properly aligned */}
<div className="flex items-baseline gap-1 mt-[20px]">
  <span className="text-white text-[70px] font-semibold leading-[70px] font-['Instrument Sans']">
    $199
  </span>
  <span className="text-white text-[22px] font-normal leading-[22px] font-['Inter']">
    /month
  </span>
</div>

</div>

<div className="p-[50px] flex flex-col justify-center">
  {/* Features */}
  <ul className="mt-4 space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px] font-['Inter'] list-disc pl-[20px]">
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
                         transition duration-300 hover:bg-[#6FCF97]">
        Get Started
      </button>
    </div>

  </div>

  {/* Customized Care Plan */}
  <div className="p-[50px] lg:h-[730px] rounded-[20px] text-center bg-[#EDF2FB] flex flex-col justify-between h-full">
    
    {/* Header */}
    <div className="w-full text-left text-[22px] font-medium leading-[30.8px] font-['Instrument Sans'] 
                    rounded-t-[20px]  text-black">
      Customized Care Plan
    </div>
    <p className="text-[#04436F] text-left text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-[20px] mb-[20px]">
  At Prime Home Care, we understand<br></br> that every individual has unique care<br></br> needs.
</p>

    {/* Features */}
    <ul className="mt-4 text-left space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px] font-['Inter'] list-disc pl-[20px]">
    <li>Personal care assistance</li>
    <li>Medication reminders</li>
    <li>Meal preparation and feeding assistance</li>
    <li>Companionship and emotional support</li>
    <li>Companionship and emotional support</li>

    <li>Companionship and emotional support</li>

    <li>Companionship and emotional support</li>

  </ul>

    {/* Button */}
    <div className="lg:mt-[100px] items-center justify-center mt-[60px] lg:mb-[50px]">
      <button className="bg-[#04436F] text-white lg:px-[120px] py-3 px-6 rounded-full text-[18px] font-medium 
                         transition duration-300 hover:bg-[#6FCF97]">
        Contact us
      </button>
    </div>

  </div>

</div>



        </section>

        <section className="bg-[#EDF2FB] mt-[180px] max-w-[1430px] mx-auto  px-6 py-6 lg:px-[70px] lg:py-[120px] rounded-[20px]">
        <h2 className="text-[#003588] font-['Metropolis'] text-left text-[32px] lg:text-[42px] font-semibold  mb-[50px]">
        What our clients say
      </h2>
      
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-[40px]">
        {/* Left Text Testimonial */}
        <div className="bg-white p-[30px] rounded-[20px] shadow-md flex flex-col lg:w-[396px] lg:h-[547px]">
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
            I can't thank Prime Home Care enough for the exceptional care they provided to my mother. Their caregivers are not only highly skilled but also compassionate and caring.
          </p>
          <div className="flex items-center gap-3 mt-auto">
            <Image src="/images/avatar1.png" width={70} height={70} className="rounded-full" alt="Client 1" />
            <div>
              <p className="text-[#04436F] leading-[26px] font-[500] text-[22px]">Lorem Ipsum</p>
              <p className="text-[#04436F] text-[16px] leading-[25px]">Lorem Ipsum</p>
            </div>
          </div>
        </div>

        {/* Center Video Testimonial */}
        <div className="relative group cursor-pointer rounded-[20px] overflow-hidden w-full lg:w-[396px] lg:h-[547px]">
      {/* Background Image */}
      <Image
        src="/images/hero-phc.png"
        width={400}
        height={250}
        className="w-full h-full object-cover"
        alt="Testimonial Background"
      />

      {/* Content Overlay */}
      <div className="absolute bottom-0 mb-[9px] left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-center gap-3">
        {/* Avatar */}
        <Image
          src="/images/avatar1.png"
          width={70}
          height={70}
          className="rounded-full"
          alt="Client 1"
        />
        {/* Text */}
        <div>
          <p className="text-white font-[500] text-[22px] leading-[26px]">
            Lorem Ipsum
          </p>
          <p className="text-white text-[16px] leading-[25px]">Lorem Ipsum</p>
        </div>
      </div>
    </div>
        {/* Right Text Testimonial with Curved Design */}
        <div className="bg-white  rounded-[20px]  relative lg:w-[396px] lg:h-[547px]">
        <div className="w-full h-[180px] overflow-hidden rounded-t-[20px]">
    <Image
      src="/images/testimonial-img.png" // Replace with your actual image path
      width={393}
      height={180}
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
          <div className="flex items-center gap-3 mt-auto lg:mt-[130px]">
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
             <h2 className="text-[#04436F] text-center font-['Instrument Sans'] text-[55px] font-semibold leading-[71.5px]">
                Have questions?<br /> (FAQs)
            </h2>


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
