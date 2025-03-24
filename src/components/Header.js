import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Pages', path: '/pages' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <header className="flex justify-between items-center mx-auto max-w-[1430px] p-4 bg-[#FAFCFF] z-50">
      {/* Desktop and Tablet View */}
      <div className="flex items-center gap-8 hidden lg:flex">
        {navLinks.map((link) => (
          <Link key={link.name} href={link.path}
              className={`text-[18px] font-medium leading-[25.6px] font-[Metropolis] ${
                router.pathname === link.path ? 'text-[#04436F]' : 'text-[#222]'
              } hover:text-[#A99558]`}
            >
              {link.name}
          </Link>
        ))}
      </div>

      {/* Logo Section */}
      <div className="lg:block hidden flex items-center gap-4 xl:mr-[100px]">
        <Image src="/Link - home.png" alt="PHC Logo" width={140} height={70} />
      </div>
      <div className="lg:hidden block flex items-center gap-4 lg:mr-[120px]">
        <Image src="/Link - home.png" alt="PHC Logo" width={100} height={50} />
      </div>
      {/* Register and Login Buttons */}
      <div className="flex gap-4 hidden lg:flex">
        <Link href="/register" className=" px-[34px] py-[12px] rounded-[6px] bg-[#A99558] text-white text-center text-[15px] font-[Metropolis] font-medium leading-normal tracking-[-0.225px]">
          Register
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
        {navLinks.map((link) => (
          <Link key={link.name} href={link.path}
              className={`mt-[-70px] text-[18px] font-medium leading-[25.6px] font-[Metropolis] ${
                router.pathname === link.path ? 'text-[#04436F]' : 'text-[#222]'
              } hover:text-[#A99558]`}
              onClick={() => setIsMobileMenuOpen(false)} // Close the menu on item click
            >
              {link.name}
          </Link>
        ))}

        <div className="flex flex-col gap-4">
          <Link href="/register" className="px-[44px] py-[15px] rounded-[6px] bg-[#A99558] text-white text-center  text-[15px] font-medium leading-normal tracking-[-0.225px]">
            Register
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
