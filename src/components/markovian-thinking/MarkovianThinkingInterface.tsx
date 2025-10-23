'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Zap, 
  MemoryStick, 
  Clock, 
  Target, 
  ChevronRight, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { MarkovianThinkingRequest, MarkovianThinkingResponse, MarkovianState } from '@/lib/markovian-thinking'

interface MarkovianThinkingInterfaceProps {
  className?: string
}

export function MarkovianThinkingInterface({ className }: MarkovianThinkingInterfaceProps) {
  const [problem, setProblem] = useState('')
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium')
  const [maxSteps, setMaxSteps] = useState(50)
  const [context, setContext] = useState('')
  const [response, setResponse] = useState<MarkovianThinkingResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!problem.trim()) {
      setError('Please enter a problem to analyze')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResponse(null)

    try {
      const request: MarkovianThinkingRequest = {
        problem: problem.trim(),
        complexity,
        maxSteps,
        context: context.trim()
      }

      const apiResponse = await fetch('/api/v1/markovian-thinking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!apiResponse.ok) {
        throw new Error('Failed to analyze problem')
      }

      const data: MarkovianThinkingResponse = await apiResponse.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEfficiencyColor = (value: number) => {
    if (value >= 0.7) return 'text-green-600'
    if (value >= 0.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Markovian Thinking Analysis</span>
          </CardTitle>
          <CardDescription>
            Enter a complex problem and let our AI solve it using efficient Markovian Thinking principles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Problem Statement *</label>
            <Textarea
              placeholder="Describe the problem you want to solve..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Complexity</label>
              <Select value={complexity} onValueChange={(value: any) => setComplexity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Steps</label>
              <Select value={maxSteps.toString()} onValueChange={(value) => setMaxSteps(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 steps</SelectItem>
                  <SelectItem value="50">50 steps</SelectItem>
                  <SelectItem value="100">100 steps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confidence Threshold</label>
              <Select defaultValue="0.8">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.6">60%</SelectItem>
                  <SelectItem value="0.8">80%</SelectItem>
                  <SelectItem value="0.9">90%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Context (Optional)</label>
            <Textarea
              placeholder="Provide any additional context or constraints..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-between items-center">
            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !problem.trim()}
              className="ml-auto"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Analyze with Markovian Thinking
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Analysis Complete</span>
            </CardTitle>
            <CardDescription>
              Problem solved using Markovian Thinking with {response.reasoningPath.length} reasoning steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="solution" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="solution">Solution</TabsTrigger>
                <TabsTrigger value="reasoning">Reasoning Path</TabsTrigger>
                <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>

              <TabsContent value="solution" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Solution</h3>
                  <p className="text-sm leading-relaxed">{response.solution}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Confidence:</span>
                    <Badge variant={response.confidence >= 0.8 ? 'default' : 'secondary'}>
                      {(response.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reasoning" className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Reasoning Path</h3>
                  {response.reasoningPath.map((state, index) => (
                    <div key={state.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{state.step}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium">{state.content}</span>
                          <Badge variant="outline" className="text-xs">
                            {(state.probability * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        {state.action && (
                          <p className="text-xs text-muted-foreground">Action: {state.action}</p>
                        )}
                        {state.essentialInfo && (
                          <p className="text-xs text-muted-foreground">Essential: {state.essentialInfo}</p>
                        )}
                      </div>
                      {index < response.reasoningPath.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="efficiency" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MemoryStick className="w-4 h-4" />
                        <span className="text-sm font-medium">Memory Saved</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {(response.efficiency.memorySaved * 100).toFixed(1)}%
                      </div>
                      <Progress value={response.efficiency.memorySaved * 100} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">Steps Reduced</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {(response.efficiency.stepsReduced * 100).toFixed(1)}%
                      </div>
                      <Progress value={response.efficiency.stepsReduced * 100} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Time Saved</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {(response.efficiency.timeSaved * 100).toFixed(1)}%
                      </div>
                      <Progress value={response.efficiency.timeSaved * 100} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Efficiency Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Markovian Thinking achieved significant efficiency improvements by focusing on essential 
                    information and optimal reasoning paths, reducing computational overhead while maintaining 
                    solution quality.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Steps</span>
                        <Badge variant="outline">{response.metadata.totalSteps}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Convergence Step</span>
                        <Badge variant="outline">{response.metadata.convergenceStep}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Algorithm</span>
                        <Badge variant="outline">{response.metadata.algorithm}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Quality Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Confidence</span>
                        <Badge variant={response.confidence >= 0.8 ? 'default' : 'secondary'}>
                          {(response.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Path Efficiency</span>
                        <Badge variant="outline">
                          {((response.metadata.convergenceStep / response.metadata.totalSteps) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Optimization</span>
                        <Badge variant="outline">High</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Algorithm Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Algorithm:</strong> {response.metadata.algorithm}</p>
                    <p><strong>Convergence:</strong> Achieved at step {response.metadata.convergenceStep}</p>
                    <p><strong>Efficiency:</strong> {response.efficiency.memorySaved * 100 > 70 ? 'Excellent' : response.efficiency.memorySaved * 100 > 50 ? 'Good' : 'Moderate'}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}