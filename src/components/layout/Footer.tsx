import React from "react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

import { fetchSetting } from "@/api/api";

const SOCIALS = [
  { key: "github_link", label: "GitHub", icon: FaGithub },
  { key: "linkedin_link", label: "LinkedIn", icon: FaLinkedin },
  { key: "instagram_link", label: "Instagram", icon: FaInstagram },
  { key: "facebook_link", label: "Facebook", icon: FaFacebook },
  { key: "youtube_link", label: "YouTube", icon: FaYoutube },
] as const;

const Footer = async () => {
  const setting = (await fetchSetting()) as Record<string, any> | undefined;

  const socials = SOCIALS.filter((item) => setting?.[item.key]);
  const name = setting?.name || "Dammar Singh Rana";

  return (
    <footer className="w-full border-t border-gray-400 px-4 py-4 dark:border-gray-700 md:px-8">
      {socials.length > 0 && (
        <ul className="flex w-full items-center justify-center gap-4">
          {socials.map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <a
                href={setting![key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="text-gray-600 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Icon className="text-xl" />
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} {name}. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
