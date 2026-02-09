import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  onWheel,
  ...props
}: React.ComponentProps<"input">) {
  const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    if (type === "number") {
      // Prevent changing the value with the mouse wheel when focused
      event.preventDefault();
      event.currentTarget.blur();
    }

    if (onWheel) {
      onWheel(event);
    }
  };

  return (
    <input
      type={type}
      data-slot="input"
      onWheel={handleWheel}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-11 w-full min-w-0 rounded-lg border bg-white/5 px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "placeholder:text-muted-foreground/70",
        "hover:border-white/20 hover:bg-white/[0.07]",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:bg-white/[0.08]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
