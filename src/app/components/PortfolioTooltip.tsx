interface PortfolioTooltipProps {
  children: React.ReactNode;
  className?: string;
}

const PortfolioTooltip = ({ children, className }: PortfolioTooltipProps) => {
  const baseClassName =
    "pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-secondary text-themed text-sm whitespace-nowrap shadow-lg z-50";

  return <div className={`${baseClassName} ${className}`}>{children}</div>;
};

export default PortfolioTooltip;
