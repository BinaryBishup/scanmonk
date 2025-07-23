"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  Play,
  Pause,
  Download,
  Upload,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  ShoppingBag,
  Clock,
  Activity,
  FileText,
  RefreshCw,
} from "lucide-react"

interface CrawlResult {
  domain: string
  businessName: string
  isShopify: boolean
  timestamp: string
  status: "success" | "error" | "pending"
}

export default function CrawlerPage() {
  const [isRunning, setIsRunning] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [totalDomains, setTotalDomains] = React.useState(0)
  const [processedDomains, setProcessedDomains] = React.useState(0)
  const [shopifyDomains, setShopifyDomains] = React.useState(0)
  const [crawlResults, setCrawlResults] = React.useState<CrawlResult[]>([])
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [domains, setDomains] = React.useState<string[]>([])
  const [batchSize, setBatchSize] = React.useState("10")
  const [currentBatch, setCurrentBatch] = React.useState(0)
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    
    try {
      const text = await file.text()
      let parsedDomains: string[] = []
      
      // Handle CSV format (rank,domain or just domain)
      const lines = text.split('\n').filter(line => line.trim())
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine) continue
        
        // Check if it's a CSV with rank,domain format
        if (trimmedLine.includes(',')) {
          const parts = trimmedLine.split(',')
          const domain = parts[parts.length - 1].trim()
          if (domain) parsedDomains.push(domain)
        } else {
          // Just a domain
          parsedDomains.push(trimmedLine)
        }
      }
      
      // Remove duplicates
      parsedDomains = [...new Set(parsedDomains)]
      
      setDomains(parsedDomains)
      setTotalDomains(parsedDomains.length)
      toast.success(`Loaded ${parsedDomains.length} domains from ${file.name}`)
    } catch (error) {
      toast.error("Failed to parse file. Please ensure it's a valid CSV or text file.")
      console.error("Error parsing file:", error)
    }
  }

  const processBatch = async (batchDomains: string[]) => {
    try {
      const response = await fetch('/api/crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          domains: batchDomains,
          batchSize: parseInt(batchSize)
        }),
      })
      
      if (!response.ok) throw new Error('Failed to process batch')
      
      const { results } = await response.json()
      return results as CrawlResult[]
    } catch (error) {
      console.error("Error processing batch:", error)
      // Return error results for the batch
      return batchDomains.map(domain => ({
        domain,
        businessName: '',
        isShopify: false,
        timestamp: new Date().toISOString(),
        status: 'error' as const,
      }))
    }
  }

  const startCrawl = async () => {
    if (domains.length === 0) {
      toast.error("Please upload a domain list first")
      return
    }

    setIsRunning(true)
    setIsPaused(false)
    setProgress(0)
    setProcessedDomains(0)
    setShopifyDomains(0)
    setCrawlResults([])
    setCurrentBatch(0)
    
    abortControllerRef.current = new AbortController()
    
    const batchSizeNum = parseInt(batchSize)
    const totalBatches = Math.ceil(domains.length / batchSizeNum)
    
    let i = 0
    while (i < domains.length && !abortControllerRef.current?.signal.aborted) {
      const batch = domains.slice(i, i + batchSizeNum)
      const batchNum = Math.floor(i / batchSizeNum) + 1
      
      setCurrentBatch(batchNum)
      
      // Process batch
      const results = await processBatch(batch)
      
      // Update results
      setCrawlResults(prev => [...results, ...prev])
      
      const newProcessed = Math.min(i + batchSizeNum, domains.length)
      setProcessedDomains(newProcessed)
      
      const shopifyCount = results.filter(r => r.isShopify).length
      setShopifyDomains(prev => prev + shopifyCount)
      
      setProgress((newProcessed / domains.length) * 100)
      
      i += batchSizeNum
      
      // Add delay between batches
      if (i < domains.length && !abortControllerRef.current?.signal.aborted) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    if (!abortControllerRef.current?.signal.aborted) {
      setIsRunning(false)
      toast.success("Crawling completed!")
    }
  }

  const stopCrawl = () => {
    abortControllerRef.current?.abort()
    setIsRunning(false)
    setIsPaused(false)
    toast.info("Crawling stopped")
  }

  const downloadResults = (type: "shopify" | "non-shopify" | "all") => {
    let dataToExport: any[] = []
    let filename = ""
    
    switch (type) {
      case "shopify":
        dataToExport = crawlResults
          .filter(r => r.isShopify)
          .map(r => ({
            domain: r.domain,
            business_name: r.businessName,
            timestamp: r.timestamp,
          }))
        filename = "shopify_compatible.csv"
        break
      case "non-shopify":
        dataToExport = crawlResults
          .filter(r => !r.isShopify)
          .map(r => ({
            domain: r.domain,
            timestamp: r.timestamp,
          }))
        filename = "shopify_non_compatible.csv"
        break
      case "all":
        dataToExport = crawlResults.map(r => ({
          domain: r.domain,
          business_name: r.businessName || "",
          is_shopify: r.isShopify,
          status: r.status,
          timestamp: r.timestamp,
        }))
        filename = "all_results.csv"
        break
    }
    
    if (dataToExport.length === 0) {
      toast.error("No data to export")
      return
    }
    
    // Convert to CSV
    const headers = Object.keys(dataToExport[0])
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row => 
        headers.map(header => {
          const value = row[header]
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        }).join(',')
      )
    ].join('\n')
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success(`Downloaded ${filename}`)
  }

  const successRate = processedDomains > 0 
    ? Math.round((crawlResults.filter(r => r.status === 'success').length / processedDomains) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Shopify Domain Crawler</h1>
            <p className="text-muted-foreground">
              Scan domains to identify Shopify-powered e-commerce stores in real-time
            </p>
          </div>

          {/* Configuration Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Crawler Configuration</CardTitle>
              <CardDescription>
                Upload domain list and configure crawler settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="domain-file">Domain List File (CSV or TXT)</Label>
                  <div className="flex gap-4">
                    <Input
                      id="domain-file"
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      disabled={isRunning}
                    />
                    <Button
                      variant="outline"
                      disabled={isRunning}
                      onClick={() => window.open("https://s3-us-west-1.amazonaws.com/umbrella-static/top-1m.csv.zip", "_blank")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Alexa 1M
                    </Button>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} ({totalDomains.toLocaleString()} domains)
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="batch-size">Batch Size</Label>
                    <Select value={batchSize} onValueChange={setBatchSize} disabled={isRunning}>
                      <SelectTrigger id="batch-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 domains</SelectItem>
                        <SelectItem value="10">10 domains</SelectItem>
                        <SelectItem value="20">20 domains</SelectItem>
                        <SelectItem value="50">50 domains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  {!isRunning ? (
                    <Button 
                      onClick={startCrawl} 
                      disabled={!selectedFile || domains.length === 0}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Crawling
                    </Button>
                  ) : (
                    <Button onClick={stopCrawl} variant="destructive">
                      <Pause className="mr-2 h-4 w-4" />
                      Stop Crawling
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress and Stats */}
          {(isRunning || progress > 0) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Crawl Progress</CardTitle>
                {isRunning && (
                  <CardDescription>
                    Processing batch {currentBatch} of {Math.ceil(domains.length / parseInt(batchSize))}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Total Domains</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{totalDomains.toLocaleString()}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Processed</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{processedDomains.toLocaleString()}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Shopify Stores</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{shopifyDomains.toLocaleString()}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">Success Rate</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{successRate}%</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Crawl Results ({crawlResults.length})</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => downloadResults("shopify")}
                    disabled={crawlResults.filter(r => r.isShopify).length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Shopify ({crawlResults.filter(r => r.isShopify).length})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => downloadResults("non-shopify")}
                    disabled={crawlResults.filter(r => !r.isShopify).length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Non-Shopify ({crawlResults.filter(r => !r.isShopify).length})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => downloadResults("all")}
                    disabled={crawlResults.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All Results ({crawlResults.length})
                  </TabsTrigger>
                  <TabsTrigger value="shopify">
                    Shopify Only ({crawlResults.filter(r => r.isShopify).length})
                  </TabsTrigger>
                  <TabsTrigger value="non-shopify">
                    Non-Shopify ({crawlResults.filter(r => !r.isShopify).length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Domain</TableHead>
                          <TableHead>Business Name</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {crawlResults.map((result, index) => (
                          <TableRow key={`${result.domain}-${index}`}>
                            <TableCell className="font-medium">{result.domain}</TableCell>
                            <TableCell>{result.businessName || "-"}</TableCell>
                            <TableCell>
                              {result.isShopify ? (
                                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                  <ShoppingBag className="mr-1 h-3 w-3" />
                                  Shopify
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Other</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {result.status === "success" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : result.status === "error" ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(result.timestamp).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="shopify">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Domain</TableHead>
                          <TableHead>Business Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {crawlResults
                          .filter((result) => result.isShopify)
                          .map((result, index) => (
                            <TableRow key={`shopify-${result.domain}-${index}`}>
                              <TableCell className="font-medium">{result.domain}</TableCell>
                              <TableCell>{result.businessName || "-"}</TableCell>
                              <TableCell>
                                {result.status === "success" ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(result.timestamp).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="non-shopify">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Domain</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {crawlResults
                          .filter((result) => !result.isShopify)
                          .map((result, index) => (
                            <TableRow key={`non-shopify-${result.domain}-${index}`}>
                              <TableCell className="font-medium">{result.domain}</TableCell>
                              <TableCell>
                                {result.status === "success" ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(result.timestamp).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> This crawler identifies Shopify stores by checking for specific headers 
              (x-shopify-stage, x-shopify-cache-status), HTML patterns (cdn.shopify.com, shopify-digital-wallet meta tag), 
              and JavaScript variables (window.Shopify). The crawler processes domains in batches to manage performance.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}