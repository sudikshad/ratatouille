"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

const navItems = [
  { href: "/recipes", label: "new recipes" },
  { href: "/saved", label: "saved" },
  { href: "/profile", label: "profile" },
];

export function NavBar() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            ratatouille
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/groceries"
            className={cn(
              "relative rounded-md p-2 transition-colors",
              pathname === "/groceries"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            sign out
          </Button>
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="flex border-t md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 py-3 text-center text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/groceries"
          className={cn(
            "flex flex-1 items-center justify-center gap-1 py-3 text-sm font-medium transition-colors",
            pathname === "/groceries"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground"
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          {count > 0 && <span>({count})</span>}
        </Link>
      </nav>
    </header>
  );
}
