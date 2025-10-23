'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Users, 
  Activity, 
  Zap,
  Database,
  Globe,
  Clock,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  Filter,
  Eye,
  MousePointer,
  Server,
  Code
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: number
  icon: any
  description: string
}

interface UsageData {
  date: string
  users: number
  api_calls: number
  processing_time: number
}

interface UserBehavior {
  action: string
  count: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

interface APIMetric {
  endpoint: string
  calls: number
  avg_response: number
  error_rate: number
  status: 'healthy' | 'warning' | 'error'
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

  const metricCards: MetricCard[] = [
    {
      title: 'Active Users',
      value: '12,847',
      change: 12.5,
      icon: Users,
      description: 'Users in the last 24 hours'
    },
    {
      title: 'API Calls',
      value: '2.4M',
      change: 8.3,
      icon: Zap,
      description: 'Total API requests today'
    },
    {
      title: 'Processing Time',
      value: '1.2s',
      change: -15.2,
      icon: Clock,
      description: 'Average response time'
    },
    {
      title: 'Success Rate',
      value: '99.7%',
      change: 0.3,
      icon: Activity,
      description: 'Successful operations'
    }
  ]

  const usageData: UsageData[] = [
    { date: '2024-01-01', users: 8500, api_calls: 1800000, processing_time: 1.8 },
    { date: '2024-01-02', users: 9200, api_calls: 1950000, processing_time: 1.6 },
    { date: '2024-01-03', users: 10100, api_calls: 2100000, processing_time: 1.4 },
    { date: '2024-01-04', users: 11500, api_calls: 2250000, processing_time: 1.3 },
    { date: '2024-01-05', users: 12800, api_calls: 2400000, processing_time: 1.2 },
    { date: '2024-01-06', users: 13200, api_calls: 2450000, processing_time: 1.1 },
    { date: '2024-01-07', users: 12847, api_calls: 2400000, processing_time: 1.2 }
  ]

  const userBehavior: UserBehavior[] = [
    { action: 'File Processing', count: 45600, percentage: 35, trend: 'up' },
    { action: 'Code Generation', count: 32400, percentage: 25, trend: 'up' },
    { action: 'Function Calling', count: 28600, percentage: 22, trend: 'stable' },
    { action: 'Web Search', count: 18200, percentage: 14, trend: 'down' },
    { action: 'Translation', count: 5200, percentage: 4, trend: 'up' }
  ]

  const apiMetrics: APIMetric[] = [
    {
      endpoint: '/api/chat',
      calls: 850000,
      avg_response: 0.8,
      error_rate: 0.1,
      status: 'healthy'
    },
    {
      endpoint: '/api/image-generation',
      calls: 420000,
      avg_response: 2.1,
      error_rate: 0.3,
      status: 'healthy'
    },
    {
      endpoint: '/api/web-search',
      calls: 380000,
      avg_response: 1.2,
      error_rate: 0.2,
      status: 'healthy'
    },
    {
      endpoint: '/api/translation',
      calls: 210000,
      avg_response: 1.5,
      error_rate: 0.8,
      status: 'warning'
    },
    {
      endpoint: '/api/file-processing',
      calls: 180000,
      avg_response: 3.2,
      error_rate: 1.2,
      status: 'warning'
    }
  ]

  const languageUsage = [
    { language: 'Hindi', percentage: 28, users: 3597 },
    { language: 'English', percentage: 24, users: 3083 },
    { language: 'Bengali', percentage: 12, users: 1542 },
    { language: 'Telugu', percentage: 10, users: 1285 },
    { language: 'Marathi', percentage: 8, users: 1028 },
    { language: 'Tamil', percentage: 7, users: 899 },
    { language: 'Others', percentage: 11, users: 1413 }
  ]

  const deviceStats = [
    { device: 'Desktop', percentage: 58, users: 7451 },
    { device: 'Mobile', percentage: 35, users: 4496 },
    { device: 'Tablet', percentage: 7, users: 900 }
  ]

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />
    if (change < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-3 h-3 text-green-500" />
      case 'down':
        return <ArrowDownRight className="w-3 h-3 text-red-500" />
      default:
        return <Minus className="w-3 h-3 text-gray-500" />
    }
  }

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const exportData = (format: string) => {
    // Mock export functionality
    console.log(`Exporting data in ${format} format`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                Analytics Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive insights and performance metrics for IndiGLM AI
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={refreshData} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
              <Button variant="outline" onClick={() => exportData('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricCards.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getChangeIcon(metric.change)}
                    <span className={getChangeColor(metric.change)}>
                      {Math.abs(metric.change)}%
                    </span>
                    <span>from last period</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="usage">Usage Statistics</TabsTrigger>
              <TabsTrigger value="behavior">User Behavior</TabsTrigger>
              <TabsTrigger value="api">API Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Language Usage
                    </CardTitle>
                    <CardDescription>
                      Distribution of languages used on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {languageUsage.map((lang, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{lang.language}</span>
                            <span className="text-sm text-muted-foreground">
                              {lang.percentage}% ({lang.users.toLocaleString()} users)
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${lang.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Device Statistics
                    </CardTitle>
                    <CardDescription>
                      User device distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {deviceStats.map((device, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{device.device}</span>
                            <span className="text-sm text-muted-foreground">
                              {device.percentage}% ({device.users.toLocaleString()} users)
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>
                    Key performance indicators over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-500">+12.5%</div>
                        <div className="text-sm text-muted-foreground">User Growth</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">-15.2%</div>
                        <div className="text-sm text-muted-foreground">Response Time</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">+8.3%</div>
                        <div className="text-sm text-muted-foreground">API Usage</div>
                      </div>
                    </div>
                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Interactive chart visualization</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Usage Statistics
                  </CardTitle>
                  <CardDescription>
                    Detailed usage metrics and analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">2.4M</div>
                        <div className="text-sm text-muted-foreground">Total API Calls</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">12,847</div>
                        <div className="text-sm text-muted-foreground">Active Users</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">1.2s</div>
                        <div className="text-sm text-muted-foreground">Avg Response Time</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">99.7%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                    </div>

                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Usage trends visualization</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Date</th>
                            <th className="text-left p-2">Users</th>
                            <th className="text-left p-2">API Calls</th>
                            <th className="text-left p-2">Processing Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usageData.map((data, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{data.date}</td>
                              <td className="p-2">{data.users.toLocaleString()}</td>
                              <td className="p-2">{data.api_calls.toLocaleString()}</td>
                              <td className="p-2">{data.processing_time}s</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="w-5 h-5" />
                    User Behavior Analysis
                  </CardTitle>
                  <CardDescription>
                    How users interact with the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-4">Most Used Features</h3>
                        <div className="space-y-3">
                          {userBehavior.map((behavior, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{behavior.action}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {behavior.count.toLocaleString()} uses
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getTrendIcon(behavior.trend)}
                                <Badge variant="outline">{behavior.percentage}%</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">User Engagement</h3>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Session Duration</span>
                              <span className="text-sm text-muted-foreground">8m 32s</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Average time users spend on the platform
                            </div>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Pages per Session</span>
                              <span className="text-sm text-muted-foreground">4.2</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Average number of pages visited per session
                            </div>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Bounce Rate</span>
                              <span className="text-sm text-muted-foreground">23%</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Percentage of single-page sessions
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">User behavior heat map</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    API Usage Monitoring
                  </CardTitle>
                  <CardDescription>
                    Real-time API performance and usage metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">2.4M</div>
                        <div className="text-sm text-muted-foreground">Total Requests</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">1.2s</div>
                        <div className="text-sm text-muted-foreground">Avg Response</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">0.5%</div>
                        <div className="text-sm text-muted-foreground">Error Rate</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">99.5%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Endpoint</th>
                            <th className="text-left p-2">Calls</th>
                            <th className="text-left p-2">Avg Response</th>
                            <th className="text-left p-2">Error Rate</th>
                            <th className="text-left p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {apiMetrics.map((metric, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2 font-mono text-sm">{metric.endpoint}</td>
                              <td className="p-2">{metric.calls.toLocaleString()}</td>
                              <td className="p-2">{metric.avg_response}s</td>
                              <td className="p-2">{metric.error_rate}%</td>
                              <td className="p-2">
                                <Badge className={getStatusColor(metric.status)}>
                                  {metric.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Real-time API monitoring dashboard</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}