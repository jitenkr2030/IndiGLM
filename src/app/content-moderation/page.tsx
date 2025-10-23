'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Upload, 
  FileText, 
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  Flag,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Globe,
  Heart,
  Zap,
  Target,
  Filter
} from 'lucide-react'

interface ModerationResult {
  id: string
  type: 'text' | 'image' | 'video'
  content: string
  status: 'approved' | 'flagged' | 'rejected' | 'pending'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  categories: string[]
  culturalContext: string[]
  timestamp: string
  reviewedBy?: string
}

interface ModerationStats {
  totalContent: number
  approved: number
  flagged: number
  rejected: number
  pending: number
  accuracy: number
  avgProcessingTime: number
}

interface CulturalSensitivity {
  language: string
  region: string
  sensitivity: number
  concerns: string[]
  recommendations: string[]
}

export default function ContentModerationPage() {
  const [selectedTab, setSelectedTab] = useState('text')
  const [textInput, setTextInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [moderationResults, setModerationResults] = useState<ModerationResult[]>([])
  const [selectedResult, setSelectedResult] = useState<ModerationResult | null>(null)
  const [culturalAnalysis, setCulturalAnalysis] = useState<CulturalSensitivity | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('hi')

  const moderationStats: ModerationStats = {
    totalContent: 15420,
    approved: 12850,
    flagged: 1890,
    rejected: 420,
    pending: 260,
    accuracy: 94.7,
    avgProcessingTime: 1.2
  }

  const riskCategories = [
    { name: 'Hate Speech', count: 342, trend: 'up' },
    { name: 'Inappropriate Content', count: 289, trend: 'down' },
    { name: 'Spam', count: 1567, trend: 'stable' },
    { name: 'Harassment', count: 198, trend: 'up' },
    { name: 'Misinformation', count: 234, trend: 'up' },
    { name: 'Copyright Violation', count: 89, trend: 'down' }
  ]

  const indianLanguages = [
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'en', name: 'English', nativeName: 'English' }
  ]

  const analyzeContent = async () => {
    if (!textInput.trim()) return

    setIsAnalyzing(true)

    // Simulate AI content analysis
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockResult: ModerationResult = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      content: textInput,
      status: 'flagged',
      riskLevel: 'medium',
      confidence: 0.87,
      categories: ['Potentially Offensive', 'Cultural Sensitivity'],
      culturalContext: ['Regional dialect detected', 'Cultural reference analysis'],
      timestamp: new Date().toISOString()
    }

    setModerationResults(prev => [mockResult, ...prev])
    setSelectedResult(mockResult)

    // Generate cultural analysis
    const mockCulturalAnalysis: CulturalSensitivity = {
      language: selectedLanguage,
      region: 'North India',
      sensitivity: 0.65,
      concerns: ['Regional dialect usage', 'Cultural reference context'],
      recommendations: [
        'Consider rephrasing for broader audience',
        'Add cultural context explanation',
        'Review for regional sensitivity'
      ]
    }
    setCulturalAnalysis(mockCulturalAnalysis)

    setIsAnalyzing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'flagged':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-red-500" />
      case 'down':
        return <TrendingUp className="w-3 h-3 text-green-500 rotate-180" />
      default:
        return <Target className="w-3 h-3 text-gray-500" />
    }
  }

  const moderateContent = (resultId: string, action: 'approve' | 'reject') => {
    setModerationResults(prev => prev.map(result => 
      result.id === resultId 
        ? { 
            ...result, 
            status: action === 'approve' ? 'approved' : 'rejected',
            reviewedBy: 'AI Moderator',
            timestamp: new Date().toISOString()
          }
        : result
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Content Moderation
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-powered content moderation with cultural context awareness
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moderationStats.totalContent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Processed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{moderationStats.approved.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{((moderationStats.approved / moderationStats.totalContent) * 100).toFixed(1)}% rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{moderationStats.flagged.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{((moderationStats.flagged / moderationStats.totalContent) * 100).toFixed(1)}% rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{moderationStats.accuracy}%</div>
                <p className="text-xs text-muted-foreground">AI accuracy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{moderationStats.avgProcessingTime}s</div>
                <p className="text-xs text-muted-foreground">Processing time</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="text-moderation" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="text-moderation">Text Analysis</TabsTrigger>
              <TabsTrigger value="image-moderation">Image Analysis</TabsTrigger>
              <TabsTrigger value="cultural-sensitivity">Cultural Context</TabsTrigger>
              <TabsTrigger value="dashboard">Moderation Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="text-moderation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Text Content Analysis
                    </CardTitle>
                    <CardDescription>
                      Analyze text content for safety and appropriateness
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="language">Content Language</Label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {indianLanguages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.nativeName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="text-input">Content to Analyze</Label>
                      <Textarea
                        id="text-input"
                        placeholder="Enter text content to analyze for moderation..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[150px] mt-2"
                      />
                    </div>

                    <Button 
                      onClick={analyzeContent}
                      disabled={isAnalyzing || !textInput.trim()}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Analyze Content
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>
                      AI-powered content moderation results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedResult ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(selectedResult.status)}>
                            {selectedResult.status.toUpperCase()}
                          </Badge>
                          <Badge className={getRiskColor(selectedResult.riskLevel)}>
                            {selectedResult.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>

                        <div>
                          <Label>Confidence Score</Label>
                          <div className="mt-2">
                            <Progress value={selectedResult.confidence * 100} className="w-full" />
                            <p className="text-sm text-muted-foreground mt-1">
                              {(selectedResult.confidence * 100).toFixed(1)}% confidence
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label>Detected Categories</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedResult.categories.map((category, index) => (
                              <Badge key={index} variant="outline">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Cultural Context</Label>
                          <div className="mt-2 space-y-1">
                            {selectedResult.culturalContext.map((context, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                • {context}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => moderateContent(selectedResult.id, 'approve')}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => moderateContent(selectedResult.id, 'reject')}
                          >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          Analyze content to see results here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="image-moderation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Image Content Analysis
                  </CardTitle>
                  <CardDescription>
                    Upload and analyze images for content moderation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Upload Image for Analysis</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports JPG, PNG, WebP formats up to 10MB
                    </p>
                    <Button>Choose Image</Button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Object Detection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Identify and classify objects within images
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Content Classification</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Categorize image content and detect inappropriate material
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Visual Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Analyze visual elements and cultural context
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cultural-sensitivity" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Cultural Sensitivity Analysis
                    </CardTitle>
                    <CardDescription>
                      Analyze content for cultural context and regional sensitivity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {culturalAnalysis ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Language</Label>
                            <p className="font-medium mt-1">
                              {indianLanguages.find(l => l.code === culturalAnalysis.language)?.name}
                            </p>
                          </div>
                          <div>
                            <Label>Region</Label>
                            <p className="font-medium mt-1">{culturalAnalysis.region}</p>
                          </div>
                        </div>

                        <div>
                          <Label>Sensitivity Level</Label>
                          <div className="mt-2">
                            <Progress value={culturalAnalysis.sensitivity * 100} className="w-full" />
                            <p className="text-sm text-muted-foreground mt-1">
                              {(culturalAnalysis.sensitivity * 100).toFixed(0)}% sensitivity
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label>Cultural Concerns</Label>
                          <div className="mt-2 space-y-1">
                            {culturalAnalysis.concerns.map((concern, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm">{concern}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Recommendations</Label>
                          <div className="mt-2 space-y-1">
                            {culturalAnalysis.recommendations.map((recommendation, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{recommendation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          Analyze content to see cultural sensitivity analysis
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Guidelines</CardTitle>
                    <CardDescription>
                      Cultural moderation guidelines for Indian regions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">North India</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Hindi-speaking regions with diverse cultural practices
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline">Hindi</Badge>
                          <Badge variant="outline">Punjabi</Badge>
                          <Badge variant="outline">Haryanvi</Badge>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">South India</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Dravidian language speakers with rich cultural heritage
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline">Tamil</Badge>
                          <Badge variant="outline">Telugu</Badge>
                          <Badge variant="outline">Kannada</Badge>
                          <Badge variant="outline">Malayalam</Badge>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">East India</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Bengali and other Eastern languages with unique traditions
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline">Bengali</Badge>
                          <Badge variant="outline">Odia</Badge>
                          <Badge variant="outline">Assamese</Badge>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">West India</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Gujarati, Marathi, and other Western regional languages
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline">Gujarati</Badge>
                          <Badge variant="outline">Marathi</Badge>
                          <Badge variant="outline">Konkani</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Risk Categories
                    </CardTitle>
                    <CardDescription>
                      Content risk distribution and trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {riskCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Flag className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {category.count} incidents
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(category.trend)}
                            <Badge variant="outline">{category.trend}</Badge>
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
                      Recent Moderation Activity
                    </CardTitle>
                    <CardDescription>
                      Latest content moderation decisions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {moderationResults.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No moderation activity yet
                        </p>
                      ) : (
                        moderationResults.slice(0, 5).map((result) => (
                          <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(result.status)}
                              <div>
                                <p className="font-medium capitalize">{result.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(result.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getRiskColor(result.riskLevel)}>
                                {result.riskLevel}
                              </Badge>
                              <Badge className={getStatusColor(result.status)}>
                                {result.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    Real-time moderation system performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94.7%</div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1.2s</div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">15,420</div>
                      <div className="text-sm text-muted-foreground">Daily Processed</div>
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

// Loader2 component
const Loader2 = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)