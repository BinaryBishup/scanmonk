"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Search,
  Star,
  ShoppingBag,
  TrendingUp,
  Clock,
  Building2,
  Plane,
  Car,
  Laptop,
  ShirtIcon,
  Home,
  Dumbbell,
  Sparkles,
  ChevronRight,
  TrendingDown,
} from "lucide-react"

// Mock data
const categories = [
  { name: "Bank", icon: Building2, count: 1234 },
  { name: "Travel Insurance", icon: Plane, count: 856 },
  { name: "Car Dealer", icon: Car, count: 743 },
  { name: "Furniture Store", icon: Home, count: 1102 },
  { name: "Jewelry Store", icon: Sparkles, count: 623 },
  { name: "Clothing Store", icon: ShirtIcon, count: 2341 },
  { name: "Electronics", icon: Laptop, count: 1876 },
  { name: "Fitness & Nutrition", icon: Dumbbell, count: 934 },
]

const hotRightNow = [
  { name: "Amazon", url: "amazon.com", rating: 4.8, reviews: 124125, trend: "up", category: "E-commerce" },
  { name: "Apple Store", url: "apple.com", rating: 4.9, reviews: 89320, trend: "up", category: "Electronics" },
  { name: "Nike", url: "nike.com", rating: 4.6, reviews: 67890, trend: "down", category: "Clothing" },
  { name: "Walmart", url: "walmart.com", rating: 4.3, reviews: 156234, trend: "up", category: "Retail" },
  { name: "Best Buy", url: "bestbuy.com", rating: 4.5, reviews: 45670, trend: "up", category: "Electronics" },
  { name: "Target", url: "target.com", rating: 4.4, reviews: 98234, trend: "down", category: "Retail" },
]

const recentSearches = [
  { name: "Zabaan", url: "zabaan.com", rating: 0, reviews: 0 },
  { name: "GoDaddy", url: "godaddy.com", rating: 4.6, reviews: 124125 },
  { name: "Shopify", url: "shopify.com", rating: 4.7, reviews: 89320 },
  { name: "Etsy", url: "etsy.com", rating: 4.5, reviews: 234567 },
]

const trustedBrands = [
  { name: "Amazonprime", url: "amazonprime.com", rating: 1.4, reviews: 4500, category: "E-commerce" },
  { name: "AAA", url: "aaa.com", rating: 1.5, reviews: 3700, category: "Insurance" },
  { name: "Amazon", url: "www.amazon.com", rating: 1.7, reviews: 40000, category: "E-commerce" },
  { name: "Amart Furniture", url: "www.amartfurniture.com.au", rating: 4.5, reviews: 25000, category: "Furniture" },
  { name: "Amac | Apple Premium Reseller", url: "www.amac.nl", rating: 4.3, reviews: 30000, category: "Electronics" },
]

const searchSuggestions = [
  { 
    type: "company",
    items: [
      { name: "Amazonprime", url: "amazonprime.com", reviews: "4.5K reviews", rating: 1.4 },
      { name: "AAA", url: "aaa.com", reviews: "3.7K reviews", rating: 1.5 },
      { name: "Amazon", url: "www.amazon.com", reviews: "40K reviews", rating: 1.7 },
      { name: "Amart Furniture", url: "www.amartfurniture.com.au", reviews: "25K reviews", rating: 4.5 },
      { name: "Amac | Apple Premium Reseller", url: "www.amac.nl", reviews: "30K reviews", rating: 4.3 },
    ]
  },
  {
    type: "category",
    items: [
      { name: "Amateur Theater", description: "The best companies in the category 'Amateur Theater'" },
      { name: "e-Commerce Service", description: "The best companies in the category 'e-Commerce Service'" },
      { name: "e-Commerce Solution Provider", description: "The best companies in the category 'e-Commerce Solution Provider'" },
    ]
  }
]

const MotionCard = motion(Card)

export default function HomePage() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const handleSelectWebsite = (url: string) => {
    setOpen(false)
    router.push(`/report/${encodeURIComponent(url)}`)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-500"
    if (rating >= 4.0) return "bg-green-400"
    if (rating >= 3.0) return "bg-yellow-500"
    if (rating >= 2.0) return "bg-orange-500"
    return "bg-red-500"
  }

  const getRatingBgColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    if (rating >= 4.0) return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    if (rating >= 3.0) return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    if (rating >= 2.0) return "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
    return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 pt-8 pb-12">
        <div className="px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Read reviews. Write reviews. Find companies.
            </h1>
            <p className="text-lg text-muted-foreground">
              Join millions of users discovering and reviewing e-commerce stores
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-start h-14 text-left font-normal bg-white dark:bg-gray-800 border-2"
                >
                  <Search className="mr-3 h-5 w-5 text-muted-foreground" />
                  {searchValue || "Search for a company..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start" sideOffset={5}>
                <Command className="rounded-lg border shadow-md">
                  <CommandInput
                    placeholder="Search companies..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    
                    {/* Companies Section */}
                    <CommandGroup heading="Companies">
                      {searchSuggestions[0].items.map((company) => (
                        <CommandItem
                          key={company.url}
                          value={company.name}
                          onSelect={() => handleSelectWebsite(company.url)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
                                  {company.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{company.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {company.url} • {company.reviews}
                                </p>
                              </div>
                            </div>
                            <Badge className={cn("ml-2", getRatingBgColor(company.rating))}>
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              {company.rating}
                            </Badge>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>

                    {/* Categories Section */}
                    <CommandGroup heading="Categories">
                      {searchSuggestions[1].items.map((category) => (
                        <CommandItem
                          key={category.name}
                          value={category.name}
                          className="cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <div className="p-2 border-t">
                    <Button variant="ghost" className="w-full justify-center text-blue-600">
                      Show all results
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">What are you looking for?</h2>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow min-w-[140px]"
                  onClick={() => router.push(`/category/${category.name.toLowerCase().replace(' ', '-')}`)}
                >
                  <CardContent className="p-6 text-center">
                    <category.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <p className="font-medium text-sm">{category.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{category.count} stores</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex justify-center mt-4">
          <Button variant="link" className="text-blue-600">
            See more
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Advertisement Banner */}
      <section className="px-4 lg:px-8 py-4">
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-0">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">ADVERTISEMENT</p>
            <h3 className="text-2xl font-bold mb-2">Boost Your Store's Visibility</h3>
            <p className="text-muted-foreground mb-4">Get featured on ScanMonk and reach millions of potential customers</p>
            <Button>Learn More</Button>
          </CardContent>
        </Card>
      </section>

      {/* Hot Right Now Section */}
      <section className="px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-red-500" />
            Hot Right Now
          </h2>
          <Button variant="link" className="text-blue-600">
            View all trending
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotRightNow.map((store, index) => (
            <MotionCard
              key={store.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectWebsite(store.url)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {store.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{store.name}</h3>
                      <p className="text-sm text-muted-foreground">{store.url}</p>
                    </div>
                  </div>
                  {store.trend === "up" ? (
                    <Badge variant="outline" className="text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Declining
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(store.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{store.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {store.reviews.toLocaleString()} reviews
                  </p>
                </div>
                <Badge variant="secondary" className="mt-3">
                  {store.category}
                </Badge>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </section>

      {/* Recent Searches / Pick up where you left off */}
      <section className="px-4 lg:px-8 py-8 bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6">Pick up where you left off</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentSearches.map((store, index) => (
            <MotionCard
              key={store.url}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectWebsite(store.url)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarFallback className="text-lg">
                      {store.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">{store.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{store.url}</p>
                  <div className="flex items-center gap-1">
                    {store.rating > 0 ? (
                      <>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < Math.floor(store.rating)
                                  ? "fill-green-500 text-green-500"
                                  : "fill-gray-200 text-gray-200"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium ml-1">
                          {store.rating} ({store.reviews.toLocaleString()})
                        </span>
                      </>
                    ) : (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-gray-200 text-gray-200" />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">0 (0)</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </section>

      {/* ScanMonk Trusted Section */}
      <section className="px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            ScanMonk Trusted
          </h2>
          <Button variant="link" className="text-blue-600">
            View all trusted stores
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trustedBrands.map((store, index) => (
            <MotionCard
              key={store.url}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-100"
              onClick={() => handleSelectWebsite(store.url)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 shrink-0">
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-sm font-semibold">
                      {store.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{store.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{store.url}</p>
                    <Badge variant="secondary" className="mb-3">{store.category}</Badge>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {store.reviews.toLocaleString()} reviews
                      </p>
                      <Badge className={cn("ml-2", getRatingBgColor(store.rating))}>
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {store.rating}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </section>

      {/* Bottom Advertisement */}
      <section className="px-4 lg:px-8 py-8">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <p className="text-sm opacity-80 mb-2">ADVERTISEMENT</p>
            <h3 className="text-3xl font-bold mb-4">Join 500,000+ businesses on ScanMonk</h3>
            <p className="text-lg mb-6 opacity-90">Claim your profile and start managing your online reputation today</p>
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}