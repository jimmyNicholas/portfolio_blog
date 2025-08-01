import React from "react";
import { AiFillGithub, AiFillLinkedin, AiFillMail } from "react-icons/ai";
import { SiBandcamp } from "react-icons/si";
import PortfolioButton from "./PortfolioButton";
import PortfolioTooltip from "./PortfolioTooltip";

const defaultSize = 32;
const defaultStrokeWidth = 2.2;
const links = [
  {
    href: "https://github.com/jimmyNicholas",
    label: "GitHub",
    icon: <AiFillGithub size={defaultSize} strokeWidth={defaultStrokeWidth} aria-label="GitHub" />,
  },
  {
    href: "https://linkedin.com/in/jimmy-nicholas/",
    label: "LinkedIn",
    icon: (
      <AiFillLinkedin size={defaultSize} strokeWidth={defaultStrokeWidth} aria-label="LinkedIn" />
    ),
  },
  {
    href: "mailto:jimmynicholas@duck.com",
    label: "Email",
    icon: <AiFillMail size={defaultSize} strokeWidth={defaultStrokeWidth} aria-label="Email" />,
  },
  {
    href: "https://lashlash.bandcamp.com/",
    label: "Bandcamp",
    icon: <SiBandcamp size={defaultSize} strokeWidth={defaultStrokeWidth} aria-label="Bandcamp" />,
  },
];

const SocialLinks: React.FC = () => {
  return (
    <div className="fixed top-4 left-12 z-[100] flex flex-row gap-3">
      {links.map((link) => (
        <PortfolioButton
          key={link.href}
          onClick={() => window.open(link.href, "_blank")}
          aria-label={link.label}
          className="group flex items-center justify-center w-14 h-14 border-2 border-secondary rounded-xl bg-themed/80 text-primary hover:bg-accent hover:text-themed transition-colors shadow-md font-mono text-base relative"
        >
          {link.icon}
          <PortfolioTooltip>{link.label}</PortfolioTooltip>
        </PortfolioButton>
      ))}
    </div>
  );
};

export default SocialLinks;
