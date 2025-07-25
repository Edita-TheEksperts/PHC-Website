export default function ContactPage() {
    return (
      <section className="bg-[#FAFCFF] px-4 mx-auto py-16 max-w-[1430px]">
        {/* Header Section */}
      {/* Header Section */}
<div className="bg-[rgba(4,67,111,0.10)] p-8 rounded-[20px] flex flex-col gap-8 lg:gap-[140px] lg:flex-row justify-between items-center">
  {/* Left Side - Heading */}
  <div className="lg:w-1/2 text-left">
    <h1 className=" text-[50px] leading-[62px] lg:text-[60px] font-semibold lg:leading-[80px] font-['Instrument Sans']">
      <span className="text-[#04436F]">Wir sind für Sie da –<br></br>
      kontaktieren Sie uns</span>
    </h1>
  </div>

  {/* Right Side - Paragraph & Icons */}
  <div className="lg:w-1/2 flex flex-col lg:items-start text-left lg:text-left">
    <p className="text-[#04436F] text-[20px] font-normal leading-[25.6px] font-['Inter'] mt-2 mb-4">
    Unser motiviertes Team ist hier um Sie bei Fragen, Anliegen oder einfach für ein Feedback zu unterstützen
        </p>
  </div>
</div>

  
        {/* Contact Info Cards */}
        <div className="flex flex-wrap justify-center gap-[40px] mt-[120px]">
          {[
            { icon: "location", title: "Schulhausstrasse 1, 8834 Schindellegi" },
            { icon: "clock", title: "8:30 - 11:00 und 13:30 - 16:00 Uhr" }
          ].map((item, index) => (
            <div key={index} className="lg:w-[675px] w-[350px] py-[20px] px-[10px] lg:py-[20px] lg:px-[60px] bg-[#EAF1F8] gap-[20px] lg:gap-[24px] rounded-[20px] flex flex-row items-left">
                <div className="w-[60px] h-[60px] bg-[#04436F] rounded-full justify-center flex items-center lg:mb-2">              
                     <img src={`/images/${item.icon}.svg`} alt={item.title} className="bg-[#04436F] rounded-full w-[40px] h-[40px] " />
                </div>
              <h3 className="text-[#04436F] w-[160px] lg:w-auto text-[17px] lg:text-[24px] font-semibold leading-[25.6px] justify-center flex items-center">{item.title}</h3>
            </div>
          ))}
        </div>
  
        {/* Image & Contact Form */}
        <div className="flex flex-col lg:flex-row gap-[60px] items-center justify-between mt-[120px]">
          {/* Image Section */}
          <div className="relative w-full lg:w-1/2">
            <img
              src="/images/phc-contact-image-1.png"
              alt="Support Team"
              className="w-full lg:max-h-[750px] h-auto rounded-lg"
            />
          </div>
  
          {/* Contact Form */}
          <div className="w-full px-4 py-4 lg:px-[45px] lg:py-[55px] lg:w-1/2 bg-[rgba(4,67,111,0.10)] p-8 rounded-[20px] mt-10 lg:mt-0">
          <form className="flex flex-col space-y-4 lg:space-y-[30px]">
  {/* Name */}
  <div className="flex flex-col">
    <label className="text-[#04436F] text-[15px] font-bold leading-[25.6px] font-['Inter']">
      Ihre Name
    </label>
    <input type="text" className="p-3 rounded-md border border-gray-300 w-full" />
  </div>

  {/* Phone No */}
  <div className="flex flex-col">
    <label className="text-[#04436F] text-[15px] font-bold leading-[25.6px] font-['Inter']">
      Telefonnummer
    </label>
    <input type="text" className="p-3 rounded-md border border-gray-300 w-full" />
  </div>

  {/* Email */}
  <div className="flex flex-col">
    <label className="text-[#04436F] text-[15px] font-bold leading-[25.6px] font-['Inter']">
      Email
    </label>
    <input type="email" className="p-3 rounded-md border border-gray-300 w-full" />
  </div>

  {/* Message */}
  <div className="flex flex-col">
    <label className="text-[#04436F] text-[15px] font-bold leading-[25.6px] font-['Inter']">
      Ihre Nachricht
    </label>
    <textarea className="p-3 rounded-md border border-gray-300 w-full lg:h-[212px] h-[100px]"></textarea>
  </div>

  {/* Submit Button */}
  <button className="bg-[#04436F] text-white p-3 rounded-[20px] text-[18px] font-medium">
    Senden
  </button>
</form>

          </div>
        </div>
      </section>
    );
  }
  