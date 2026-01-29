"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FolderOpen, FileEdit, Lightbulb, LayoutTemplate } from "lucide-react";
import { useUnsaved } from "@/lib/unsaved-context";

const NAV_ITEMS = [
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/drafts", label: "Drafts", icon: FileEdit },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDirty, setPendingHref } = useUnsaved();

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (isDirty) {
      e.preventDefault();
      setPendingHref(href);
    }
  };

  return (
    <aside className="w-56 border-r bg-card flex flex-col min-h-screen">
      <div className="p-4 border-b">
        <Link href="/" className="text-lg font-bold" onClick={(e) => handleClick(e, "/")}>App Planner</Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={(e) => handleClick(e, href)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
