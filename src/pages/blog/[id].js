import { useRouter } from "next/router";
import blogsData from "../../data/blogsData";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function BlogPost() {
  const router = useRouter();
  const [faqOpen, setFaqOpen] = useState(null); // Add FAQ open state

  const { id } = router.query;
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const sectionsRef = useRef([]);

  // Find the current blog post by ID
  const blog = blogsData.find((blog) => blog.id === id);

  useEffect(() => {
    window.scrollTo(0, 0); // Ensure page loads at the top
  }, []);

  const scrollToSection = (index) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate Recommended Blogs
  useEffect(() => {
    if (blog) {
      const filteredBlogs = blogsData.filter((b) => b.id !== id); // Exclude current blog
      const shuffledBlogs = filteredBlogs.sort(() => 0.5 - Math.random()); // Shuffle list
      setRecommendedBlogs(shuffledBlogs.slice(0, 3)); // Select 3 random blogs
    }
  }, [blog, id]);

  // If blog not found, show a 404 message
  if (!blog) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-[#04436F] text-[30px] font-semibold">Blog Not Found</h1>
        <p className="text-gray-600">Sorry, we couldn't find the blog you're looking for.</p>
        <Link href="/BlogPage">
          <button className="mt-4 px-6 py-2 bg-[#04436F] text-white rounded-full">
            Back to Blogs
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1410px] mx-auto px-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 mt-[50px] lg:grid-cols-2 gap-8 items-center">
        {/* Left: Title & Main Text */}
        <div>
        <h1 className="text-[#003588] font-['Instrument Sans'] text-[64px] font-semibold leading-[72px] mt-10">
  {blog.title}
</h1>
          <p className="text-black mt-2">{blog.date} | {blog.category}</p>

          {/* Main Text */}
          {blog.maintext && (
            <p className="text-[#04436F] font-['Metropolis'] text-[16px] font-light leading-[24px] mt-6">
  {blog.maintext}
</p>
          )}

<div className="flex flex-row gap-[8px]">
          {/* Read Blog Button */}
          <button
  className="mt-6 px-6 py-3 bg-[#04436F] text-[#FAFCFF] text-center font-['Inter'] text-[18px] font-medium leading-[21.6px] 
             underline rounded-[100px] flex items-center gap-2 hover:bg-[#033559] transition"
  onClick={() => scrollToSection(0)}
>
Unten weiterlesen 
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" viewBox="0 0 16 22" fill="none" className="ml-2">
  <g clip-path="url(#clip0_1541_6690)">
    <path d="M7.75 1L7.75 21M7.75 21L1.5 14.75M7.75 21L14 14.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_1541_6690">
      <rect width="22" height="15" fill="white" transform="translate(0.5 22) rotate(-90)"/>
    </clipPath>
  </defs>
</svg>
  </div>
</button>

    {/* Read Blog Button */}
    <span
  className="mt-6 px-6 py-3 bg-[#B99B5F] text-[#FAFCFF] text-center font-['Inter'] text-[18px] font-medium leading-[20px] 
             rounded-[100px] flex items-center hover:bg-[#033559] transition">
  {blog.category}
  <div>

  </div>
</span>
</div>
        </div>

        {/* Right: Blog Image */}
        <img src={blog.image} alt={blog.title} className="w-full rounded-[20px] lg:h-[580px] mt-2" />
      </div>

  {/* Author & Table of Contents */}
<div className="mt-[120px] flex flex-col lg:flex-row items-start gap-6">
  
  {/* Left: Author Info */}
  <div className="lg:w-1/3 bg-white p-2">
    <img
      src={blog.author.image}
      alt={blog.author.name}
      className="w-[393px] h-[388px] mx-auto mt-6"
    />
    <div className="flex flex-col p-[30px]">
<h3 className="text-left font-['Instrument Sans'] text-[#04436F] text-[22px] font-medium leading-[26.4px]">
  {blog.author.name}
</h3>
<p className="text-left font-['Inter'] text-[#04436F] text-[16px] font-normal leading-[25.6px]">
  {blog.author.position}
</p>
<p className="mt-4 lg:mt-[40px] text-left font-['Inter'] text-[#04436F] text-[16px] font-normal leading-[25.6px]">
  {blog.author.description}
</p>
    </div>
  </div>

  {/* Right: Table of Contents */}
  <div className="lg:w-2/3  p-2">
    <ul className="space-y-3">
      {blog.sections.map((section, index) => (
        <li
          key={section.id}
          className="cursor-pointer flex justify-between items-center bg-[#EDF2FB] p-4 rounded-[12px]"
          onClick={() => scrollToSection(index)}
        >
        <span className="text-[#04436F] font-['Metropolis'] text-[20px] font-semibold leading-[28px] underline">
   {section.title}
</span>

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none">
  <g clip-path="url(#clip0_1352_2701)">
    <path d="M12 0.669922C5.37258 0.669922 0 6.04251 0 12.6699C0 19.2973 5.37258 24.6699 12 24.6699C18.6274 24.6699 24 19.2973 24 12.6699C24 6.04251 18.6274 0.669922 12 0.669922Z" fill="#04436F"/>
    <path d="M16.4443 10.4481L11.9999 14.8926L7.5554 10.4481" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_1352_2701">
      <rect width="24" height="25" fill="white" transform="matrix(-1 0 0 -1 24 25.1699)"/>
    </clipPath>
  </defs>
</svg>
        </li>
      ))}
    </ul>
  </div>

</div>


      {/* Blog Content */}
      <div className="max-w-[1410px] mx-auto px-4">
 {/* Ensure `blog` and `blog.sections` exist before mapping */}
{blog && blog.sections && blog.sections.length > 0 && (
  <div className="max-w-[1410px] mx-auto px-4">
    {blog.sections.map((section, sectionIndex) => (
      <div key={section.id} ref={(el) => (sectionsRef.current[sectionIndex] = el)} className="space-y-[24px] mt-12 lg:mt-[120px]">
        
        {/* Section Title */}
        <h2 className="text-[#003588] font-['Metropolis'] text-[40px] font-semibold leading-[48px]">
          {sectionIndex + 1}. {section.title}
        </h2>

        {/* Render `title2` only if it exists */}
        {section.title2 && (
          <h2 className="text-[#003588] font-['Metropolis'] text-[24px] font-[400] leading-[25.6px]">
            {section.title2}
          </h2>
        )}

        {/* Section Paragraphs */}
        {section.paragraphs && Array.isArray(section.paragraphs) && section.paragraphs.length > 0 ? (
          section.paragraphs.map((paragraph, paragraphIndex) =>
            paragraph.tip ? (
              <div key={paragraph.id} className="p-4 flex flex-col justify-start items-start bg-[#F1F1F1] text-[#04436F] lg:py-[30px] lg:px-[80px] font-['Inter'] text-[16px] font-normal leading-[25.6px] mt-2 rounded-[20px]">
                <strong className="text-[#04436F] text-center font-['Instrument Sans'] text-[44px] font-semibold leading-[52.8px]">
                  TIP:
                </strong>
                {paragraph.tip}
              </div>
            ) : (
              <p key={paragraph.id} className="mt-2 text-[#04436F] font-['Metropolis'] text-[16px] font-normal leading-[24px]">
                <span className="font-semibold">{sectionIndex + 1}.{paragraphIndex + 1}</span> {paragraph.text}
              </p>
            )
          )
        ) : (
          <p className="text-gray-500"></p>
        )}

        {/* FAQ Section - Only if `faqs` exist in the section */}
        {section.faqs && Array.isArray(section.faqs) && section.faqs.length > 0 && (
          <div className="mt-10 space-y-4">
            {section.faqs.map((faq, faqIndex) => (
              <div key={faq.id} className="bg-[#EDF2FB] p-4 rounded-[12px]">
                <button
                  className="w-full flex justify-between items-center text-[#04436F] font-['Metropolis'] text-[20px] font-semibold leading-[28px] underline"
                  onClick={() => setFaqOpen(faqOpen === faqIndex ? null : faqIndex)}
                >
                  {faq.question}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="26"
                    viewBox="0 0 24 26"
                    fill="none"
                    className={`transform transition-transform ${faqOpen === faqIndex ? "rotate-180" : ""}`}
                  >
                    <g clipPath="url(#clip0_1352_2701)">
                      <path
                        d="M12 0.669922C5.37258 0.669922 0 6.04251 0 12.6699C0 19.2973 5.37258 24.6699 12 24.6699C18.6274 24.6699 24 19.2973 24 12.6699C24 6.04251 18.6274 0.669922 12 0.669922Z"
                        fill="#04436F"
                      />
                      <path
                        d="M16.4443 10.4481L11.9999 14.8926L7.5554 10.4481"
                        stroke="white"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1352_2701">
                        <rect
                          width="24"
                          height="25"
                          fill="white"
                          transform="matrix(-1 0 0 -1 24 25.1699)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>

                {/* FAQ Answer - Only show when clicked */}
                {faqOpen === faqIndex && (
                  <p className="mt-3 text-[#04436F] font-['Metropolis'] text-[16px] font-normal leading-[24px]">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
)}

</div>



      {/* Recommended Blogs Section */}
      <div className="max-w-[1410px] mx-auto mt-[120px]">
        <h2 className="text-[40px] leading-[48px] font-[600] text-[#04436F] text-left">Passende Themen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {recommendedBlogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`} passHref>
              <div className="cursor-pointer">
          {/* Blog Image */}
          <img src={blog.image} alt={blog.title} className="w-full h-[300px]" />
          <div className="flex flex-row justify-between mt-4">
                <span
                className="bg-[#04436F] text-[14px] text-center justify-center flex font-[400] leading-[25px] px-4 py-2 rounded-l-[20px] relative"
                style={{
                    background: "linear-gradient(94deg, #04436F 0%, rgba(0, 0, 0, 0.00) 100%)",
                    padding: "4px 12px", // px-3 → 12px, py-1 → 4px
                }}
                >
                {blog.category}
                </span>

              <p className="text-[#04436F] text-[14px] font-[400] leading-[25px]">{blog.date}</p>

              </div>
              <h3 className="text-[#04436F] text-[26px] leading-[33px] font-[600] mt-2">
                {blog.title}
              </h3>              </div>
            </Link>
          ))}
        </div>
      </div>

      <section className="bg-[#EDF2FB] rounded-[20px] py-[100px] px-[20px] mt-[120px] mb-[120px] max-w-[1430px] mx-auto flex flex-col lg:flex-row items-center gap-6">
      {/* Left Content */}
      <div className="lg:w-1/2 gap-[60px]">
      <h2 className="text-[#003588] font-['Metropolis'] text-[40px] font-semibold leading-[48px]">
  Geld sparen bei Betreuung<br></br> zuhause: Beteiligen Sie Ihre <br></br> Krankenkasse an den Kosten!
</h2>

        
<p className="text-[#003588] font-['Metropolis'] text-[24px] font-normal leading-[32px] mt-2">
  Mit unserer Hilfe können Sie bei der Betreuung zuhause viel Geld einsparen.
  Übernimmt anstelle der regulären Spitex eine zertifizierte Live-In-Betreuungskraft 
  die Aufgaben bei der Grundpflege, können diese Leistungen in vielen Kantonen mit der 
  Krankenkasse abgerechnet werden. Die Aufsicht über die Pflegetätigkeit sowie die Abrechnung 
  der geleisteten Stunden mit den Krankenkassen übernehmen spezialisierte und bewilligte Partner. 
  Gegenüber den üblichen Verleih-Lösungen bei der Betreuung zuhause können Sie Monat für Monat oft 
  mehrere Tausend Franken einsparen.
</p>


        {/* Button */}
        <button className="mt-6 lg:mt-[60px] px-[20px] py-[12px] bg-[#04436F] text-[#FAFCFF] 
                   font-['Inter'] text-[18px] font-medium leading-[21.6px] 
                   rounded-[50px] flex items-center justify-center 
                   hover:bg-[#033559] transition 
                   underline decoration-solid decoration-auto underline-offset-auto">
  Kostenlose Pflegeberatung sichern
</button>

      </div>

      {/* Right Image */}
      <div className="lg:w-1/2 flex justify-end">
        <img 
          src="/images/hero-image-phc.png" 
          alt="Happy Elderly Woman" 
          className="w-full max-w-[600px] rounded-[12px]"
        />
      </div>
    </section>
    </div>
  );
}
