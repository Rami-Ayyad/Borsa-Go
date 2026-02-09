import { Link } from "react-router-dom";

function BorsaGoLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-primary"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      <span className="text-xl font-bold tracking-tight">Borsa Go</span>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex w-full shrink-0 justify-center self-stretch border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <BorsaGoLogo />
        </Link>
        <nav className="flex gap-2">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Calculator
          </Link>
          <Link
            to="/saved"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Saved Calculations
          </Link>
        </nav>
      </div>
    </header>
  );
}
