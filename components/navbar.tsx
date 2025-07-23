"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { 
  Search, 
  Moon, 
  Sun, 
  Shield, 
  BarChart3, 
  Star,
  Menu,
  X,
  Sparkles
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 lg:px-8 flex h-16 items-center w-full">
        <div className="mr-8 flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-75"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ScanMonk
          </span>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <BarChart3 className="h-6 w-6 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Website Analytics
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Comprehensive analysis of website performance and trust metrics.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/analytics/trust-score" title="Trust Score">
                      Real-time trust score calculations based on multiple factors.
                    </ListItem>
                    <ListItem href="/analytics/security" title="Security Analysis">
                      Deep dive into website security protocols and certificates.
                    </ListItem>
                    <ListItem href="/analytics/reviews" title="Review Analytics">
                      Aggregated review analysis from multiple platforms.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Reviews</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {reviews.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/trending" className={navigationMenuTriggerStyle()}>
                  Trending
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/compare" className={navigationMenuTriggerStyle()}>
                  Compare
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/crawler" className={navigationMenuTriggerStyle()}>
                  Crawler
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <form className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Quick search..."
                className="pl-8 w-[200px] lg:w-[300px]"
              />
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm">
              Sign In
            </Button>

            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
              Get Started
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Guest User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      guest@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="container py-4 space-y-3">
            <Link href="/analytics" className="block py-2 text-sm">
              Analytics
            </Link>
            <Link href="/reviews" className="block py-2 text-sm">
              Reviews
            </Link>
            <Link href="/trending" className="block py-2 text-sm">
              Trending
            </Link>
            <Link href="/compare" className="block py-2 text-sm">
              Compare
            </Link>
            <div className="pt-3 space-y-2">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

const reviews = [
  {
    title: "All Reviews",
    href: "/reviews",
    description: "Browse all website reviews and ratings from verified users.",
  },
  {
    title: "Write Review",
    href: "/reviews/write",
    description: "Share your experience and help others make informed decisions.",
  },
  {
    title: "Top Rated",
    href: "/reviews/top",
    description: "Discover the highest-rated websites across all categories.",
  },
  {
    title: "Recent Reviews",
    href: "/reviews/recent",
    description: "See the latest reviews and ratings from our community.",
  },
]