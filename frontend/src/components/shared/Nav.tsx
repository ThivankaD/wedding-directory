"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Links = [
  {
    name: "home",
    path: "/",
  },
  {
    name: "blog",
    path: "/blog",
  },
  {
    name: "vendors",
    path: "/vendor-search",
  },
  {
    name: "about",
    path: "/about",
  },

  {
    name: "contact",
    path: "/contact",
  },
  {
    name: "help",
    path: "/help",
  }
];


const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 sm:gap-2 font-title text-sm sm:text-base">
      {Links.map((link, index) => {
        const isActive =
          link.path === "/"
            ? pathname === "/"
            : pathname.startsWith(link.path);
        return (
          <Link
            href={link.path}
            key={index}
            className={`
              capitalize px-3.5 py-1.5 rounded-xl transition-all
              ${
                isActive
                  ? "bg-orange text-white shadow-xs font-semibold"
                  : "text-gray-700 hover:text-orange hover:bg-orange/10 font-medium"
              }
            `}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
