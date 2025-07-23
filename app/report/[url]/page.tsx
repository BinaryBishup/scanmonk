"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Star,
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2,
  Globe,
  Zap,
  ArrowLeft,
  ExternalLink,
  Share2,
  Download,
  Flag,
  Clock,
  MessageSquare,
  AlertTriangle,
  Lock,
  Award,
  Activity,
  RefreshCw,
  MoreVertical,
  XCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const MotionCard = motion(Card)

interface WebsiteReport {
  url: string
  name: string
  category: string
  trustScore: number
  totalReviews: number
  verifiedCompany: boolean
  claimedProfile: boolean
  responseRate: number
  responseTime: string
  description: string
  founded: string
  headquarters: string
  industryRank: number
  monthlyVisitors: string
  bounceRate: number
  avgSessionDuration: string
  securityScore: number
  sslCertificate: boolean
  privacyPolicy: boolean
  termsOfService: boolean
}

const mockReviews = [
  {
    id: "1",
    author: "John Doe",
    rating: 5,
    date: "2024-01-15",
    title: "Excellent service",
    content: "Really impressed with the quality and speed of delivery. Would definitely recommend!",
    source: "trustpilot",
    verified: true,
  },
  {
    id: "2",
    author: "Jane Smith",
    rating: 4,
    date: "2024-01-10",
    title: "Good overall experience",
    content: "The website is easy to use and customer service was helpful when I had questions.",
    source: "google",
    verified: true,
  },
  {
    id: "3",
    author: "Mike Johnson",
    rating: 3,
    date: "2024-01-05",
    title: "Average experience",
    content: "Service was okay, nothing special but got the job done.",
    source: "trustpilot",
    verified: false,
  },
]

const generateMockReport = (url: string, name: string): WebsiteReport => {
  return {
    url,
    name,
    category: "E-commerce",
    trustScore: 4.5,
    totalReviews: 45320,
    verifiedCompany: true,
    claimedProfile: true,
    responseRate: 92,
    responseTime: "< 24 hours",
    description: `${name} is a leading platform in its industry, providing quality services to millions of customers worldwide.`,
    founded: "2010",
    headquarters: "San Francisco, CA",
    industryRank: 12,
    monthlyVisitors: "45M",
    bounceRate: 32,
    avgSessionDuration: "3:45",
    securityScore: 95,
    sslCertificate: true,
    privacyPolicy: true,
    termsOfService: true,
  }
}

const trustScoreData = [
  { month: "Jan", score: 4.2 },
  { month: "Feb", score: 4.3 },
  { month: "Mar", score: 4.5 },
  { month: "Apr", score: 4.4 },
  { month: "May", score: 4.6 },
  { month: "Jun", score: 4.5 },
]

const ratingDistribution = [
  { stars: 5, count: 60, percentage: 60 },
  { stars: 4, count: 25, percentage: 25 },
  { stars: 3, count: 10, percentage: 10 },
  { stars: 2, count: 3, percentage: 3 },
  { stars: 1, count: 2, percentage: 2 },
]

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const [report, setReport] = React.useState<WebsiteReport | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [selectedTab, setSelectedTab] = React.useState("overview")

  React.useEffect(() => {
    const url = decodeURIComponent(params.url as string)
    const websiteName = url.includes("http") 
      ? new URL(url).hostname.replace("www.", "").split(".")[0]
      : url.split(".")[0]
    
    setTimeout(() => {
      setReport(generateMockReport(url, websiteName.charAt(0).toUpperCase() + websiteName.slice(1)))
      setLoading(false)
    }, 1000)
  }, [params.url])

  if (loading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="container py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Report Not Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't generate a report for this website.
            </p>
            <Button onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const securityItems = [
    { label: "SSL Certificate", value: report.sslCertificate, icon: Lock },
    { label: "Privacy Policy", value: report.privacyPolicy, icon: Shield },
    { label: "Terms of Service", value: report.termsOfService, icon: Award },
    { label: "Data Protection", value: report.securityScore > 80, icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                  {report.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{report.name}</h1>
                  {report.verifiedCompany && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {report.claimedProfile && (
                    <Badge variant="outline">Claimed</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3">{report.url}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>{report.category}</Badge>
                  <Badge variant="outline">Founded {report.founded}</Badge>
                  <Badge variant="outline">{report.headquarters}</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Flag className="mr-2 h-4 w-4" />
                    Report Issue
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                Visit Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.trustScore}/5.0</div>
              <Progress value={report.trustScore * 20} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                +0.2 from last month
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.totalReviews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">
                From verified users
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.responseRate}%</div>
              <p className="text-xs text-muted-foreground mt-2">
                {report.responseTime}
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.securityScore}%</div>
              <Progress value={report.securityScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Excellent protection
              </p>
            </CardContent>
          </MotionCard>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Trust Score Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Trust Score Trend</CardTitle>
                  <CardDescription>
                    6-month trust score performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trustScoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Rating Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of all ratings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ratingDistribution.map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 min-w-[80px]">
                          <span className="text-sm font-medium">{rating.stars}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress value={rating.percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground min-w-[50px] text-right">
                          {rating.count}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Website Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Website Analytics</CardTitle>
                <CardDescription>
                  Key performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Monthly Visitors</p>
                    <p className="text-2xl font-bold">{report.monthlyVisitors}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                    <p className="text-2xl font-bold">{report.bounceRate}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                    <p className="text-2xl font-bold">{report.avgSessionDuration}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Industry Rank</p>
                    <p className="text-2xl font-bold">#{report.industryRank}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>
                    Latest reviews from verified users
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{review.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{review.author}</p>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{review.date}</span>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {review.source}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold">{review.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {review.content}
                          </p>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Direct", value: 40 },
                          { name: "Organic", value: 30 },
                          { name: "Social", value: 20 },
                          { name: "Referral", value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ratingDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { month: "Jan", visitors: 30000 },
                        { month: "Feb", visitors: 35000 },
                        { month: "Mar", visitors: 42000 },
                        { month: "Apr", visitors: 38000 },
                        { month: "May", visitors: 45000 },
                        { month: "Jun", visitors: 48000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visitors" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Assessment</CardTitle>
                <CardDescription>
                  Comprehensive security analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {securityItems.map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border",
                        item.value ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          item.value ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                        )}>
                          <item.icon className={cn(
                            "h-4 w-4",
                            item.value ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          )} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.value ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Additional Security Details</h4>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SSL Certificate Type</span>
                      <span className="font-medium">Extended Validation (EV)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Security Audit</span>
                      <span className="font-medium">2 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PCI Compliance</span>
                      <span className="font-medium text-green-600">Compliant</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Encryption</span>
                      <span className="font-medium">AES-256</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}