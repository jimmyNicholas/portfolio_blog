import { useThemeContext } from "./ThemeProvider";

interface PortfolioButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

const PortfolioButton = ({ onClick, children, className, ariaLabel, style }: PortfolioButtonProps) => {
  const { palette } = useThemeContext();

  const baseStyle = {
    backgroundColor: palette.background,
    color: palette.text,
    borderColor: palette.secondary,
    borderWidth: "2px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const baseClassName = "group flex items-center justify-center w-14 h-14 border-2 rounded-xl bg-themed/80 text-accent hover:bg-accent hover:text-themed transition-colors shadow-md font-mono text-base relative";

  return (
    <button onClick={onClick} className={`${baseClassName} ${className}`} aria-label={ariaLabel} style={{...baseStyle, ...style}}>
      {children}
    </button>
  );
};

export default PortfolioButton;
