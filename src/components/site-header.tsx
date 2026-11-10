"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react"

import { cn } from "@/lib/utils"
import { nav } from "@/lib/site"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

function Logo({ overlay }: { overlay: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Image
        src="/images/logo.png"
        alt=""
        width={27}
        height={30}
        priority
        className="h-7 w-auto"
      />
      <span
        className={cn(
          "text-[0.95rem] font-semibold tracking-tight transition-colors duration-300",
          overlay && "text-white"
        )}
      >
        Walk Wilmington
      </span>
    </Link>
  )
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  // On the Home page the header sits on top of the photo until you scroll past it
  const [pastHero, setPastHero] = useState(false)
  useMotionValueEvent(scrollY, "change", (y) =>
    setPastHero(y > window.innerHeight - 80)
  )
  const overlay = pathname === "/" && !pastHero
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,color] duration-300",
        overlay
          ? "border-transparent bg-transparent text-white"
          : "border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
      )}
    >
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Logo overlay={overlay} />

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-md px-2.5 py-1.5 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      overlay
                        ? "text-white/75 hover:text-white"
                        : "text-muted-foreground hover:text-foreground",
                      active && (overlay ? "text-white" : "text-foreground")
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className={cn(
                          "absolute inset-x-2.5 -bottom-[13px] h-px",
                          overlay ? "bg-white" : "bg-foreground"
                        )}
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div
          className={cn(
            "flex items-center gap-1",
            overlay && "[&_button]:hover:bg-white/15 [&_button]:hover:text-white"
          )}
        >
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,85vw)]">
              <SheetHeader>
                <SheetTitle className="field-label">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="px-4">
                <ul className="flex flex-col">
                  {nav.map((item, i) => {
                    const active = isActive(pathname, item.href)
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-baseline gap-3 border-b border-border py-3.5 text-lg tracking-tight",
                            active ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          <span className="font-mono text-xs text-muted-foreground">
                            0{i + 1}
                          </span>
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Scroll progress bar */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-foreground"
        style={{ scaleX: progress }}
      />
    </header>
  )
}
