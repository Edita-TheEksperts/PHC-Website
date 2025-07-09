import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const navLinks = [
  { name: 'Home', path: '/' },
  {
    name: 'Über uns',
    path: '/about', // <-- make parent clickable
    subLinks: [
      { name: 'Blog', path: '/BlogPage' },
      { name: 'E-Learning', path: '/E-Learning' },
      { name: 'FAQ', path: '/FAQ' },
    ],
  },
  {
    name: 'Dienstleistungen',
    path: '/services', // <-- make parent clickable
    subLinks: [
      { name: 'Häusliche Pflege planen', path: '/hausliche-pflege-planen' },
      { name: 'Betreuung zuhause organisieren', path: '/betreuung-zuhause-organisieren' },
    ],
  },
  { name: 'Jobs', path: '/jobs' },
  { name: 'Support', path: '/contact' },
];



  return (
<header className="sticky top-0 z-[999] flex justify-between items-center mx-auto max-w-[1430px] p-4 bg-[#FAFCFF] ">
      {/* Desktop and Tablet View */}
      <div className="flex items-center gap-8 hidden lg:flex">
   <nav className="flex gap-6 items-center">
  {navLinks.map((link, index) => (
    <div key={index} className="relative group">
      {/* Top-level Link */}
      <a
        href={link.path || '#'}
        className="text-[#04436F] font-medium px-2 py-2 inline-block"
      >
        {link.name}
      </a>

      {/* Dropdown Menu */}
      {link.subLinks && (
        <div
          className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md z-10 min-w-[220px]"
        >
          <ul className="flex flex-col">
            {link.subLinks.map((sub, subIndex) => (
              <li key={subIndex}>
                <a
                  href={sub.path}
                  className="block px-4 py-2 text-sm text-[#04436F] hover:bg-[#EAF1F8] whitespace-nowrap"
                >
                  {sub.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ))}
</nav>



      </div>

      {/* Logo Section */}
      <div className="lg:block hidden flex items-center gap-4 xl:mr-[160px]">
        <Image src="/Link - home.png" alt="PHC Logo" width={140} height={70} />
      </div>
      <div className="lg:hidden block flex items-center gap-4 lg:mr-[120px]">
        <Image src="/Link - home.png" alt="PHC Logo" width={100} height={50} />
      </div>
      {/* Register and Login Buttons */}
      <div className="flex gap-4 hidden lg:flex">
        <Link href="/register-client" className=" px-[34px] py-[12px] rounded-[6px] bg-[#A99558] text-white text-center text-[15px] font-[Metropolis] font-medium leading-normal tracking-[-0.225px]">
          Jetzt Buchen
        </Link>
        <Link href="/login" className="px-[34px] py-[12px] rounded-[6px] border border-[#A99558] bg-white text-[#A99558] font-[Metropolis] text-center  text-[15px] font-medium leading-normal tracking-[-0.225px]">
          Log in
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <button className="text-[#04436F] flex flex-col justify-between items-center w-8 h-8">
          {/* Hamburger Icon (Three Lines) */}
          <div className="w-full h-[3px] bg-[#04436F]"></div>
          <div className="w-full h-[3px] bg-[#04436F]"></div>
          <div className="w-full h-[3px] bg-[#04436F]"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white z-40 flex flex-col items-center justify-center space-y-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        style={{ top: '70px' }} // Adjust the space to the header height
      >
       {navLinks.map((link, index) => (
  <div key={index} className="text-center">
    {/* Top-level link */}
    {link.subLinks ? (
      <>
        <p className="text-[18px] font-medium text-[#222] hover:text-[#A99558]">
          {link.name}
        </p>
        <div className="flex flex-col gap-2 mt-2">
          {link.subLinks.map((sub, subIndex) => (
            <Link
              key={subIndex}
              href={sub.path}
              className="text-[16px] text-[#555] hover:text-[#A99558]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </>
    ) : (
      <Link
        href={link.path}
        className={`text-[18px] font-medium ${
          router.pathname === link.path ? 'text-[#04436F]' : 'text-[#222]'
        } hover:text-[#A99558]`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {link.name}
      </Link>
    )}
  </div>
))}


        <div className="flex flex-col gap-4">
          <Link href="/register-client" className="px-[44px] py-[15px] rounded-[6px] bg-[#A99558] text-white text-center  text-[15px] font-medium leading-normal tracking-[-0.225px]">
            Jetzt Buchen
          </Link>
          <Link href="/login" className="px-[44px] py-[15px] rounded-[6px] border border-[#A99558] bg-white text-[#A99558] text-center  text-[15px] font-medium leading-normal tracking-[-0.225px]">
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
