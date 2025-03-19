export default function HomeCarePage() {
    return (
      <div className="bg-[#FFFFFF] px-4 mx-auto max-w-[1430px]">
        
        {/* Hero Section */}
        <section className="bg-[#B99B5F] gap-10 lg:gap-[100px] text-white p-4 lg:p-[60px] rounded-[20px] flex flex-col lg:flex-row items-start">
        <div className="lg:w-1/2 flex flex-col justify-start items-start">
        <h1 className="text-[40px] lg:text-[60px] font-semibold lg:leading-[72px] leading-[47px]">
  <span className="text-[#04436F]">Comprehensive <br></br>home care</span> 
  <span className="text-[#FFFFFF]"> services</span>
</h1>

<p className="text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] mt-2">
Discover a range of services designed to provide compassionate and
professional care in the comfort of your home.</p>

          </div>
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <img src="/images/hero-services.png" alt="Home Care" className="rounded-lg lg:w-[545px] lg:h-[335px] w-full" />
          </div>
        </section>
  
        {/* Services Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px] mt-[120px]">
          {[
            { icon: "user", title: "Personal care assistance", description: "Lorem ipsum dolor sit amet." },
            { icon: "heart", title: "Specialized care", description: "Customized care solutions." },
            { icon: "house", title: "Home nursing services", description: "Providing quality healthcare at home." },
            { icon: "users", title: "Companionship services", description: "Ensuring emotional and social support." },
            { icon: "wheelchair", title: "Rehabilitation support", description: "Helping individuals recover safely." },
            { icon: "medkit", title: "Palliative care services", description: "Compassionate end-of-life care." },
          ].map((service, index) => (
            <div key={index} className="p-8 bg-[#EDF2FB] rounded-[10px] flex flex-col items-left  justify-starttext-left hover:bg-[#E8F5E9]">
                <div className="flex justify-center items-center p-4 bg-white w-[100px] h-[100px] rounded-full mb-[10px] lg:mb-[30px]">
              <img src={`/images/${service.icon}.svg`} alt={service.title} className="w-[40px] h-[40px]" />
              </div>
              <h3 className="text-[#04436F] text-[28px] mb-2 font-semibold leading-[33.6px] ">
                {service.title}
                </h3>
                <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] ">
                {service.description}
                </p>
                <p className="text-[#04436F] text-[16px] font-medium leading-[25.6px]  mt-[10px] lg:mt-[30px]">
  Learn more
</p>
            </div>
          ))}
        </section>
  
        {/* Join Community Section */}
        <section 
  className="bg-cover  bg-center bg-no-repeat p-[90px] rounded-[20px]  text-center mt-[120px] relative "
  style={{ backgroundImage: "url('/images/community-bg.png')" }} // Update with your image path
>
  {/* Heading */}
  <h2 className="text-[#FAFCFF] text-[44px] font-semibold leading-[52.8px]">
    Join our community of care
  </h2>

  {/* Button with hover effect */}
  <button className="bg-[#B99B5F] text-[#FAFCFF] py-3 px-6 rounded-[50px] text-[14px] lg:text-[18px] font-medium mt-4 
                     transition duration-300 hover:bg-[#04436F]">
Schedule a consultation  </button>
</section>

  
        {/* Why Choose Us */}
        <section className="flex flex-col gap-[70px] lg:flex-row items-center justify-between mt-[120px] mx-auto">
          <div className="lg:w-1/2">
          <h2 className="text-[#04436F] text-[55px] font-semibold leading-[71.5px] ">
  Why choose<br></br> <span className="text-[#B99B5F]">Prime Home Care?</span>
</h2>
<p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2">
  We uphold the highest standards of medical excellence and patient safety, ensuring that
  every patient receives personalized attention and support throughout their healthcare
  journey.
</p>

<ul className="mt-[45px] space-y-4">
  {[
    { icon: "/images/experienced.svg", title: "Experienced team", description: "Our caregivers are trained professionals who truly care about your well-being." },
    { icon: "/images/scheduling.svg", title: "Flexible scheduling", description: "We offer flexible scheduling to fit your lifestyle." }
  ].map((item, index) => (
    <li key={index} className="flex items-center gap-4">
      {/* SVG Background Container */}
      <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#EAF1F8] rounded-full p-2">
        <img src={item.icon} className="w-[24px] h-[24px]" alt={item.title} />
      </div>

      {/* Text Content */}
      <div>
        <h3 className="text-[#04436F] text-[22px] lg:text-[30px] font-semibold leading-[36px] font-[Metropolis]">
          {item.title}
        </h3>
        <p className="text-[#04436F] text-[14px] lg:text-[16px] font-normal leading-[25.6px] w-[300px] lg:w-full font-[Metropolis]">
          {item.description}
        </p>
      </div>
    </li>
  ))}
</ul>

          </div>
          <div className="lg:w-1/2 lg:mt-0 ">
            <img src="/images/why-choose.png" alt="Why Choose Us" className="rounded-[20px] h-[450px] lg:w-[550px] lg:ml-[90px] w-full" />
          </div>
        </section>
  
        {/* Pricing Section */}
        <section className="text-center mt-[120px]">
        <h2 className="text-[#04436F] text-[55px] mb-4 lg:mb-[70px] font-semibold leading-[71.5px] text-center">
            Pricing
         </h2>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  
  {/* Hourly Care Plan */}
  <div className="rounded-[20px] text-center relative overflow-hidden bg-[#FFFFFF]">
    
    {/* Header */}
    <div className="w-full p-[50px] text-left rounded-t-[20px] bg-[#EDF2FB] text-[#000000]">

{/* Plan Title */}
<h3 className="text-[22px] font-medium leading-[30.8px] ">
  Hourly Care Plan
</h3>

{/* Price Section - Now properly aligned */}
<div className="flex items-baseline gap-1 mt-[20px]">
  <span className="text-[#04436F] text-[70px] font-semibold leading-[70px] font-[Metropolis]">
    $19
  </span>
  <span className="text-[#04436F] text-[22px] font-normal leading-[22px] font-[Metropolis]">
    /hour
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
<h3 className="text-[22px] font-medium leading-[30.8px]">
  Hourly Care Plan
</h3>

{/* Price Section - Now properly aligned */}
<div className="flex items-baseline gap-1 mt-[20px]">
  <span className="text-white text-[70px] font-semibold leading-[70px] ">
    $199
  </span>
  <span className="text-white text-[22px] font-normal leading-[22px]">
    /month
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
                         transition duration-300 hover:bg-[#6FCF97]">
        Get Started
      </button>
    </div>

  </div>

  {/* Customized Care Plan */}
  <div className="p-[50px] lg:h-[730px] rounded-[20px] text-center bg-[#EDF2FB] flex flex-col justify-between h-full">
    
    {/* Header */}
    <div className="w-full text-left text-[22px] font-medium leading-[30.8px]
                    rounded-t-[20px]  text-black">
      Customized Care Plan
    </div>
    <p className="text-[#04436F] text-left text-[16px] font-normal leading-[25.6px] mt-[20px] mb-[20px]">
  At Prime Home Care, we understand<br></br> that every individual has unique care<br></br> needs.
</p>

    {/* Features */}
    <ul className="mt-4 text-left space-y-[20px] text-[#04436F] text-[16px] font-normal text-left leading-[25.6px] list-disc pl-[20px]">
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
  
        {/* Footer Placeholder */}
        <section className="mt-[120px] mb-[80px] text-center">
          <div className="flex justify-center gap-[120px]">
            <div className="w-[180px] h-[50px] bg-[#04436F] "></div>
            <div className="w-[180px] h-[50px] bg-[#04436F] "></div>
            <div className="w-[180px] h-[50px] bg-[#04436F] "></div>
            <div className="w-[180px] h-[50px] bg-[#04436F] "></div>
            <div className="w-[180px] h-[50px] bg-[#04436F] "></div>

          </div>
        </section>
  
      </div>
    );
  }
  