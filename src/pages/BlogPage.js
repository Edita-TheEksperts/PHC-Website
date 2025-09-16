import React, { useState } from "react";
import blogsData from "../data/blogsData"; 
import { slugify } from "../utils/slugify";

export default function BlogPage() {
  const blogsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Alle"); // Default: show all

  const normalizeCategory = (cat) =>
  cat.replace(/\u00A0/g, " ").trim(); // remove non-breaking spaces & trim

const categories = [
  "Alle",
  ...new Set(blogsData.map((blog) => normalizeCategory(blog.category))),
];


  // Filter blogs by selected category
  const filteredBlogs =
    selectedCategory === "Alle"
      ? blogsData
      : blogsData.filter((blog) => blog.category === selectedCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-[#FAFCFF] max-w-[1430px] mx-auto lg:px-6 p-4">
      {/* Header */}
      <div className="bg-[#B99B5F] max-w-[1400px] text-center py-[90px] rounded-[20px] mb-[120px]">
        <h1 className="text-white text-[44px] lg:text-[65px] font-semibold">
          Blogs
        </h1>
        <p className="text-white text-[16px] leading-[25.6px]">
          Erhalten Sie fundierte Experteneinschätzungen und detaillierte <br />
          Analysen zu aktuellen Trends und Entwicklungen in der Altenpflege
        </p>
      </div>

      {/* Blog Categories */}
      <div className="mb-[60px]">
        <h1 className="text-[#04436F] text-center text-[55px] font-semibold">
          Blog Kategorien
        </h1>

        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4 mx-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1); // reset to first page on filter
              }}
              className={`p-[12px] rounded-[10px] text-[16px] font-medium cursor-pointer transition 
                ${
                  selectedCategory === category
                    ? "bg-[#04436F] text-white"
                    : "bg-[#B7B6BA] text-[#FAFCFF] hover:bg-[#04436F]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[60px]">
        {currentBlogs.map((blog, index) => (
          <div
            key={index}
            className="bg-white rounded-[10px] overflow-hidden shadow-md"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-[300px] object-cover"
            />

            <div className="py-5 px-4">
              <div className="flex justify-between items-center">
                <span
                  className="text-[14px] font-[400] px-4 py-2 rounded-l-[20px]"
                  style={{
                    background:
                      "linear-gradient(94deg, #04436F 0%, rgba(0,0,0,0.00) 100%)",
                    color: "#fff",
                  }}
                >
                  {blog.category}
                </span>
                <p className="text-[#04436F] text-[14px]">{blog.date}</p>
              </div>

              <h3 className="text-[#04436F] text-[26px] font-[600] mt-2">
                {blog.title}
              </h3>
              <a href={`/blog/${blog.slug}`}>
                <button className="bg-[#04436F] text-white mt-4 py-2 px-4 rounded-[20px] text-[16px] font-medium hover:bg-[#B99B5F] transition">
                  Mehr lesen
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mb-[100px] lg:justify-between mt-10 space-x-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-6 py-2 lg:px-[150px] lg:py-[14px] rounded-full text-white bg-[#04436F] transition hover:bg-[#B99B5F] ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Zurück
          </button>

          <span className="text-[#04436F] text-[18px] font-medium mt-4">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 lg:px-[150px] lg:py-[14px] rounded-full text-white bg-[#04436F] transition hover:bg-[#B99B5F] ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}
