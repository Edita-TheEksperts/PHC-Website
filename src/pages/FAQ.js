import { useState } from "react";

export default function FAQ() {
  // FAQ Data with Questions & Answers
  const faqData = [
    {
      category: "General",
      questions: [
        {
          question: "How can I get involved with your organization?",
          answer:
            "You can get involved by volunteering, donating, or spreading awareness about our cause.",
        },
        {
          question: "How can I stay updated on your latest news and events?",
          answer:
            "Follow our website or subscribe to our newsletter to stay informed about our latest news and events.",
        },
        {
          question: "Are your care services available 24/7?",
          answer:
            "Yes, we provide round-the-clock care services to ensure continuous support for our clients.",
        },
        {
          question: "How can I arrange for nursing care at home?",
          answer:
            "Contact our support team, and we will guide you through the process of arranging nursing care at home.",
        },
      ],
    },
    {
      category: "Help Care",
      questions: [
        {
          question: "How do I know if I need professional care at home?",
          answer:
            "If daily tasks become challenging or if a medical condition requires supervision, professional home care can be beneficial.",
        },
        {
          question: "Can I choose the person who will provide my care?",
          answer:
            "Yes, we match caregivers based on your specific needs and preferences.",
        },
        {
          question: "How do I provide feedback about the person care I receive?",
          answer:
            "You can provide feedback through our customer support or by filling out a review form on our website.",
        },
        {
          question:
            "Can your caregivers assist with medication management?",
          answer:
            "Yes, our caregivers are trained to assist with medication reminders and basic management.",
        },
      ],
    },
  ];

  // State to manage open FAQ
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle FAQ Answer
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-4 lg:p-2" >
      
      {/* Header Section */}
      <div className="bg-[#B99B5F] text-center  rounded-[20px] py-[90px] max-w-[1390px] mx-auto">
      <h2 className="text-[#FAFCFF] text-center text-[55px] font-semibold leading-[66px] font-['Instrument Sans']">
  Frequently asked<br></br> questions
</h2>

        <p className="text-white text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2">
        Find answers to the most commonly asked questions about our<br></br> services, policies, and more.
                </p>
      </div>

      {/* FAQ Content */}
      <div className="max-w-[1100px] mx-auto mt-20 lg:mt-[120px] lg:px-6 mb-[80px]">
        {faqData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mt-8 lg:mt-[60px]">
            
            {/* Section Title */}
            <h3 className="text-[#04436F] text-[36px] font-[700] leading-[43px] font-['Metropolis'] mb-4 lg:mb-[40px]">
              {section.category}
            </h3>

            {/* FAQ List */}
            <div className="space-y-4 lg:space-y-[30px]">
              {section.questions.map((item, index) => {
                const isOpen = openIndex === `${sectionIndex}-${index}`;
                return (
                  <div key={index} className="bg-[#ECF2FF] rounded-[20px]">
                    {/* Question */}
                    <div
                      onClick={() => toggleFAQ(`${sectionIndex}-${index}`)}
                      className="lg:p-6 p-3 flex justify-between items-center cursor-pointer transition duration-300  hover:bg-[#E1E8F0] rounded-[20px]"
                    >
                      <h4 className="text-[#04436F] text-[14px] lg:text-[20px] font-[600] lg:font-[700] leading-[26px]">{item.question}</h4>

                      {/* Dropdown Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="26"
                        viewBox="0 0 24 26"
                        fill="none"
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
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

                    {/* Answer Section (Only shown if open) */}
                    {isOpen && (
                      <div className="p-4 text-[#04436F] text-[14px] lg:text-[18px] font-normal leading-[26px] font-['Metropolis'] bg-[#F1F1F1] rounded-b-[10px]">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
