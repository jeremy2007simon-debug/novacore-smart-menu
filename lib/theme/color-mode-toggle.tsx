"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ColorMode = "light" | "dark" | null;

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-color-mode"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): ColorMode {
  const attr = document.documentElement.getAttribute("data-color-mode");
  return attr === "light" || attr === "dark" ? attr : null;
}

// En servidor no hay atributo que leer: coincide con lo que pintará el
// cliente antes de que ColorModeScript (ver app/layout.tsx) actúe.
function getServerSnapshot(): ColorMode {
  return null;
}

/**
 * El propio ThemeProvider ya deja la página en el modo correcto sin JS
 * (media query); esto solo permite anular esa preferencia y recordarla.
 * `useSyncExternalStore` en vez de useState+useEffect: el atributo del
 * `<html>` es el estado real, este componente solo lo refleja.
 */
export function ColorModeToggle({ className }: { className?: string }) {
  const explicitMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentlyDark = explicitMode ? explicitMode === "dark" : systemPrefersDark;
    const next: "light" | "dark" = currentlyDark ? "light" : "dark";

    document.documentElement.setAttribute("data-color-mode", next);
    window.localStorage.setItem("nova-color-mode", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar entre modo claro y oscuro"
      className={cn(
        "nova-transition inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-surface-raised hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--nova-color-focus-ring)] focus-visible:ring-offset-background",
        className,
      )}
    >
      {explicitMode === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
