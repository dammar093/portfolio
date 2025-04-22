import Link from "next/link";
import React from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full border-t-1 border-gray-400 dark:border-gray-700  px-4 md:px-8 py-4 ">
      <div className="flex items-center gap-4 justify-center w-full">
        <Link
          className="text-gray-600 text-md hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          href={"https://github.com/dammar093"}
        >
          <FaGithub className="text-xl" />
        </Link>
        <Link
          className="text-gray-600 text-md hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          href={"https://www.linkedin.com/in/dammar-rana-983077238/"}
        >
          <FaLinkedin className="text-xl" />
        </Link>
        <Link
          className="text-gray-600 text-md hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          href={"https://www.instagram.com/iamdyams/"}
        >
          <FaInstagram className="text-xl" />
        </Link>
      </div>
      <div>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">
          &copy; {new Date().getFullYear()} Dammar Singh Rana. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
