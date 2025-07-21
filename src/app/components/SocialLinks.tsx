import React from "react";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";

const links = [
  {
    href: "https://github.com/jimmyNicholas",
    label: "GitHub",
    icon: <AiFillGithub size={32} strokeWidth={2.2} />,
  },
  {
    href: "https://linkedin.com/in/jimmy-nicholas/",
    label: "LinkedIn",
    icon: <AiFillLinkedin size={32} strokeWidth={2.2} />,
  },
];

const SocialLinks: React.FC = () => {
  return (
    <div className="fixed top-4 left-12 z-[100] flex flex-row gap-3">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-14 h-14 border-2 border-secondary rounded-xl bg-themed/80 text-primary hover:bg-accent hover:text-themed transition-colors shadow-md font-mono text-base relative"
        >
          {link.icon}
          <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-secondary text-themed text-sm whitespace-nowrap shadow-lg z-50">
            {link.label}
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
