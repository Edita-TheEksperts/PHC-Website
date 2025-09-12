// pages/blog/category/[category].js
import { useRouter } from "next/router";
import Link from "next/link";
import blogsData from "../../../data/blogsData";
import { slugify } from "../../../utils/slugify";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const filteredBlogs = blogsData.filter(
    (blog) => slugify(blog.category) === category
  );

  if (filteredBlogs.length === 0) {
    return (
      <div className="text-center mt-[180px] mb-[180px]">
        <h1 className="text-[#04436F] text-[30px] font-semibold">
          Keine Blogs in dieser Kategorie
        </h1>
        <Link href="/BlogPage">
          <button className="mt-4 px-6 py-2 bg-[#04436F] text-white rounded-full">
            Zurück zu allen Blogs
          </button>
        </Link>
      </div>
    );
  }

  const displayCategory = category?.replace("-", " ");

  return (
    <div className="max-w-[1410px] mx-auto  mt-[180px] mb-[180px]">
      <h1 className="text-[40px] font-bold text-[#04436F] mb-6">
        Kategorie: {displayCategory}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <Link key={blog.slug} href={`/blog/${blog.slug}`}>
            <div className="bg-[#f1f1f1] p-4 rounded-[20px] hover:shadow-lg transition-shadow cursor-pointer">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-[200px] rounded-[20px]"
              />
              <h3 className="text-[#04436F] text-[22px] font-semibold mt-4">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{blog.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
