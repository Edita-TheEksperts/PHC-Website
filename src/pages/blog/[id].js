import { useRouter } from "next/router";
import blogsData from "../../data/blogsData";
import Link from "next/link";

export default function BlogPost() {
  const router = useRouter();
  const { id } = router.query;

  // Find the blog post by ID
  const blog = blogsData.find((blog) => blog.id === id);

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
    <div className="max-w-[800px] mx-auto px-6">
      {/* Blog Header */}
      <h1 className="text-[#04436F] text-[40px] font-semibold">{blog.title}</h1>
      <p className="text-gray-500">{blog.date} | {blog.category}</p>
      
      {/* Blog Image */}
      <img src={blog.image} alt={blog.title} className="w-full rounded-lg mt-4" />

      {/* Blog Content */}
      <p className="text-[#04436F] text-[18px] font-normal mt-6 leading-[28px]">
        {blog.content}
      </p>

      {/* Back Button */}
      <Link href="/BlogPage">
        <button className="mt-6 px-6 py-2 bg-[#04436F] text-white rounded-full">
          Back to Blogs
        </button>
      </Link>
    </div>
  );
}
