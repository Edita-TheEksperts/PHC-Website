import React, { useState } from "react"; // ✅ Import React and useState
import Link from 'next/link';
import blogsData from "../data/blogsData"; // Import blog data

export default function BlogPage() {
    const blogsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1); // ✅ Now works!

  // Calculate total pages
  const totalPages = Math.ceil(blogsData.length / blogsPerPage);

  // Get blogs for the current page
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogsData.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="max-w-[1430px] mx-auto lg:px-6 p-4">
      
      {/* Header */}
      <div className="bg-[#B99B5F] max-w-[1400px] text-center py-[90px] rounded-[20px] mb-[120px]">
        <h1 className="text-white text-[44px] lg:text-[65px] lg:leading-[84px] font-semibold leading-[52px] font-['Instrument Sans']">
          Blog & article
        </h1>
        <p className="text-white text-[16px] font-normal leading-[25.6px] font-['Inter']">
          Gain expert experience while exploring insights of the latest trends and<br></br> developments in Home Care.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[60px]">
        {currentBlogs.map((blog, index) => (
          <div key={index} className="bg-white  rounded-[10px] overflow-hidden">
            
            {/* Blog Image */}
            <img src={blog.image} alt={blog.title} className="w-full h-[300px]" />

            {/* Blog Details */}
            <div className="py-5">
              <span className="bg-[#04436F] text-white text-[14px] font-medium px-3 py-1 rounded-full">
                {blog.category}
              </span>
              <h3 className="text-[#04436F] text-[26px] leading-[33px] font-semibold mt-2">
                {blog.title}
              </h3>
              <p className="text-[#666] text-[14px] mt-1">{blog.date}</p>
              <Link href={`/blog/${blog.id}`}>
              <button className="bg-[#04436F] text-white mt-4 py-2 px-4 rounded-full text-[16px] font-medium hover:bg-[#B99B5F] transition">
                  Read More
                </button>
              </Link>
            </div>

          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-10 space-x-4">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className={`px-6 py-2 rounded-full text-white bg-[#04436F] transition hover:bg-[#B99B5F] ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Previous
        </button>
        
        <span className="text-[#04436F] text-[18px] font-medium">
          {currentPage} / {totalPages}
        </span>
        
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
          className={`px-6 py-2 rounded-full text-white bg-[#04436F] transition hover:bg-[#B99B5F] ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Next
        </button>
      </div>

    </div>
  );
}
