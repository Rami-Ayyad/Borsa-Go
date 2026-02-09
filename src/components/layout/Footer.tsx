export function Footer() {
  return (
    <footer className="mt-auto flex w-full shrink-0 justify-center self-stretch border-t border-white/10 bg-background/60 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-center px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Borsa Go. Profit & percentage calculator.
        </p>
      </div>
    </footer>
  );
}
