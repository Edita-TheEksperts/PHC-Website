import React, { useState } from "react"; // ✅ Import React and useState
import Link from 'next/link';
import blogsData from "../data/blogsData"; // Import blog data
import { slugify } from "../utils/slugify";

export default function BlogPage() {
    const blogsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1); // ✅ Now works!

  // Calculate total pages
  const totalPages = Math.ceil(blogsData.length / blogsPerPage);

  // Get blogs for the current page
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogsData.slice(indexOfFirstBlog, indexOfLastBlog);
  const categories = [...new Set(blogsData.map((blog) => blog.category))];

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
const formatCategory = (cat) => cat.toLowerCase().replace(/\s+/g, "-");


  return (
    <div className="bg-[#FAFCFF] max-w-[1430px] mx-auto lg:px-6 p-4">
      
      {/* Header */}
      <div className="bg-[#B99B5F] max-w-[1400px] text-center py-[90px] rounded-[20px] mb-[120px]">
        <h1 className="text-white text-[44px] lg:text-[65px] lg:leading-[84px] font-semibold leading-[52px] font-['Instrument Sans']">
          Blogs
        </h1>
        <p className="text-white text-[16px] font-normal leading-[25.6px] font-['Inter']">
        Erhalten Sie fundierte Experteneinschätzungen und detaillierte<br></br> Analysen zu aktuellen Trends und Entwicklungen in der Altenpflege
        </p>
      </div>

       {/* Blog Categories */}
       <div className="mb-[60px]">
        <h1 className="text-[#04436F] text-center font-metropolis text-[55px] font-semibold leading-[71.5px]">
          Blog Kategorien
        </h1>
        
        {/* Render categories dynamically */}
<div className="mt-4 flex flex-wrap justify-center md:justify-start space-y-2 gap-3 sm:gap-4">
  {categories.map((category, index) => (
    <Link key={index} href={`/blog/category/${slugify(category)}`}>
      <span className="category-item hover:bg-[#04436F] text-[#FAFCFF] bg-[#B7B6BA] text-[16px] font-medium p-[12px] rounded-[10px] cursor-pointer">
        {category}
      </span>
    </Link>
  ))}
</div>

      </div>

      {/* Blog Grid */}
      <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[60px]">
        {currentBlogs.map((blog, index) => (
          <div key={index} className="bg-white  rounded-[10px] overflow-hidden">
            
            {/* Blog Image */}
            <img src={blog.image} alt={blog.title} className="w-full h-[300px]" />

            {/* Blog Details */}
            <div className="py-5">
                <div className="flex flex-row justify-between">
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
              </h3>
              <Link href={`/blog/${blog.slug}`}>
              <button className="bg-[#04436F] text-white mt-4 py-2 px-4 rounded-[20px] text-[16px] font-medium hover:bg-[#B99B5F] transition">
                  Mehr lesen
                </button>
              </Link>
            </div>

          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mb-[100px] lg:justify-between mt-10 space-x-4">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className={`px-6 py-2 lg:px-[150px] lg:py-[14px] rounded-full text-white bg-[#04436F] transition hover:bg-[#B99B5F] ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Zurück
        </button>
        
        <span className="text-[#04436F] text-[18px] font-medium mt-4">
          {currentPage} / {totalPages}
        </span>
        
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
          className={`px-6 py-2 lg:px-[150px] lg:py-[14px] rounded-full text-white bg-[#04436F] transition hover:bg-[#B99B5F] ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Weiter
        </button>
      </div>

    </div>
  );
}
