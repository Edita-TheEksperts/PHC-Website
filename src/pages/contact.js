export default function ContactPage() {
    return (
      <section className="bg-[#FAFCFF] px-4 lg:px-[70px] py-16">
        {/* Header Section */}
      {/* Header Section */}
<div className="bg-[rgba(4,67,111,0.10)] p-10 rounded-[20px] flex flex-col gap-8 lg:gap-[140px] lg:flex-row justify-between items-center">
  {/* Left Side - Heading */}
  <div className="lg:w-1/2 text-left">
    <h1 className="text-[62px] font-semibold leading-[80.6px] font-['Instrument Sans']">
      <span className="text-[#04436F]">Connect with</span> <span className="text-[#B99B5F]">customer </span><span className="text-[#04436F]">support</span>
    </h1>
  </div>

  {/* Right Side - Paragraph & Icons */}
  <div className="lg:w-1/2 flex flex-col lg:items-start text-left lg:text-left">
    <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2 mb-4">
      Our dedicated customer support team is here to assist you with any questions, concerns, or feedback you may have.
    </p>

    {/* Social Media Icons */}
    <div className="flex gap-4">
      {["facebook", "instagram", "twitter", "linkedin"].map((platform, index) => (
        <a key={index} href="#" className="w-[40px] h-[40px] flex items-center justify-center bg-[#C8D4E7] rounded-full ">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M12.3601 22.6396H12.7601C13.51 22.6396 13.885 22.6396 14.1479 22.4486C14.2328 22.3869 14.3074 22.3123 14.3691 22.2274C14.5601 21.9645 14.5601 21.5896 14.5601 20.8396V14.5146H15.7601C16.51 14.5146 16.885 14.5146 17.1479 14.3236C17.2328 14.2619 17.3074 14.1873 17.3691 14.1024C17.5601 13.8395 17.5601 13.4645 17.5601 12.7146V12.5229C17.5601 11.773 17.5601 11.398 17.3691 11.1351C17.3074 11.0503 17.2328 10.9756 17.1479 10.9139C16.885 10.723 16.51 10.723 15.7601 10.723H14.5601V8.43132C14.5601 7.96538 14.5601 7.7324 14.6362 7.54863C14.7377 7.30361 14.9324 7.10893 15.1774 7.00744C15.3612 6.93132 15.5942 6.93132 16.0601 6.93132C16.526 6.93132 16.759 6.93132 16.9428 6.8552C17.1878 6.7537 17.3825 6.55903 17.484 6.314C17.5601 6.13023 17.5601 5.89726 17.5601 5.43132V4.69521C17.5601 4.17704 17.5601 3.91796 17.4664 3.71703C17.367 3.50396 17.1958 3.3327 16.9827 3.23334C16.7818 3.13965 16.5227 3.13965 16.0045 3.13965C14.191 3.13965 13.2842 3.13965 12.5809 3.46757C11.8352 3.81533 11.2358 4.41472 10.888 5.16049C10.5601 5.86372 10.5601 6.77051 10.5601 8.5841V10.723H9.36006C8.61011 10.723 8.23514 10.723 7.97227 10.9139C7.88738 10.9756 7.81272 11.0503 7.75104 11.1351C7.56006 11.398 7.56006 11.773 7.56006 12.5229V12.7146C7.56006 13.4645 7.56006 13.8395 7.75104 14.1024C7.81272 14.1873 7.88738 14.2619 7.97227 14.3236C8.23514 14.5146 8.61011 14.5146 9.36006 14.5146H10.5601V20.8396C10.5601 21.5896 10.5601 21.9645 10.7511 22.2274C10.8128 22.3123 10.8874 22.3869 10.9723 22.4486C11.2352 22.6396 11.6102 22.6396 12.3601 22.6396Z" fill="#04436F"/>
</svg>
        </a>
      ))}
    </div>
  </div>
</div>

  
        {/* Contact Info Cards */}
        <div className="flex flex-wrap justify-center gap-[40px] mt-[120px]">
          {[
            { icon: "phone", title: "Talk to our support experts", description: "Lorem" },
            { icon: "email", title: "Send your queries", description: "Lorem" },
            { icon: "location", title: "Where to find us", description: "Lorem" },
            { icon: "clock", title: "Service hours", description: "Lorem" }
          ].map((item, index) => (
            <div key={index} className="lg:w-[315px] w-[280px] p-[24px] bg-[#EAF1F8] gap-[8px] rounded-[20px] flex flex-col items-left">
                <div className="w-[60px] h-[60px] bg-[#04436F] rounded-full justify-center flex items-center mb-2">              
                     <img src={`/images/${item.icon}.svg`} alt={item.title} className="bg-[#04436F] rounded-full w-[40px] h-[40px] " />
                </div>
              <h3 className="text-[#04436F] text-[18px] font-semibold">{item.title}</h3>
              <p className="text-[#04436F] text-[16px] font-normal leading-[27px] underline">{item.description}</p>
            </div>
          ))}
        </div>
  
        {/* Image & Contact Form */}
        <div className="flex flex-col lg:flex-row gap-[60px] items-center justify-between mt-[120px]">
          {/* Image Section */}
          <div className="relative w-full lg:w-1/2">
            <img
              src="/images/support-image.png"
              alt="Support Team"
              className="w-full lg:max-h-[752px] h-auto rounded-lg"
            />
          </div>
  
          {/* Contact Form */}
          <div className="w-full px-4 py-4 lg:px-[45px] lg:py-[55px] lg:w-1/2 bg-[rgba(4,67,111,0.10)] p-8 rounded-[20px] mt-10 lg:mt-0">
          <form className="flex flex-col space-y-4 lg:space-y-[30px]">
  {/* Name */}
  <div className="flex flex-col">
    <label className="text-[#04436F] text-[15px] font-bold leading-[25.6px] font-['Inter']">
      Name
    </label>
    <input type="text" className="p-3 rounded-md border border-gray-300 w-full" />
  </div>

  {/* Phone No */}
  <div className="flex flex-col">
    <label className="text-[#04436F] text-[15px] font-bold leading-[25.6px] font-['Inter']">
      Phone No
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
      Message
    </label>
    <textarea className="p-3 rounded-md border border-gray-300 w-full lg:h-[212px] h-[100px]"></textarea>
  </div>

  {/* Submit Button */}
  <button className="bg-[#04436F] text-white p-3 rounded-[20px] text-[18px] font-medium">
    Submit
  </button>
</form>

          </div>
        </div>
      </section>
    );
  }
  