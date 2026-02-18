"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/sidebar/AppSidebar";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function PublicLayout({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const onThemeToggle = () => {
    const newTheme = !dark;
    setDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isDark = () => dark;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar/>

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card/95 backdrop-blur-md flex items-center px-4 gap-4 sticky top-0 z-9">
            <SidebarTrigger />
            <div className="flex-1" />

            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              className="rounded-full"
            >
              {isDark() ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
