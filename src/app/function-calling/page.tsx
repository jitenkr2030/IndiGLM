'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Code, 
  Settings, 
  Zap, 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Trash2, 
  Copy,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  GitBranch,
  Database,
  Globe,
  Calculator,
  FileText
} from 'lucide-react'

interface FunctionParameter {
  name: string
  type: string
  required: boolean
  description: string
  value?: string
}

interface FunctionDefinition {
  id: string
  name: string
  description: string
  category: string
  parameters: FunctionParameter[]
  code: string
  icon: any
}

interface FunctionCall {
  id: string
  functionId: string
  parameters: Record<string, any>
  result?: any
  status: 'idle' | 'running' | 'completed' | 'error'
  executionTime?: number
}

interface FunctionChain {
  id: string
  name: string
  calls: FunctionCall[]
  status: 'idle' | 'running' | 'completed' | 'error'
}

export default function FunctionCallingPage() {
  const [selectedFunction, setSelectedFunction] = useState<FunctionDefinition | null>(null)
  const [functionCalls, setFunctionCalls] = useState<FunctionCall[]>([])
  const [chains, setChains] = useState<FunctionChain[]>([])
  const [activeChain, setActiveChain] = useState<FunctionChain | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResults, setExecutionResults] = useState<string>('')

  const functionLibrary: FunctionDefinition[] = [
    {
      id: 'web_search',
      name: 'Web Search',
      description: 'Search the web for information using AI-powered search',
      category: 'Web',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Search query' },
        { name: 'num_results', type: 'number', required: false, description: 'Number of results (default: 10)' }
      ],
      code: `// Web Search Function
async function webSearch(query, num_results = 10) {
  const zai = await ZAI.create();
  const results = await zai.functions.invoke("web_search", {
    query: query,
    num: num_results
  });
  return results;
}`,
      icon: Globe
    },
    {
      id: 'data_analysis',
      name: 'Data Analysis',
      description: 'Analyze data and generate insights',
      category: 'Data',
      parameters: [
        { name: 'data', type: 'object', required: true, description: 'Data to analyze' },
        { name: 'analysis_type', type: 'string', required: false, description: 'Type of analysis' }
      ],
      code: `// Data Analysis Function
async function dataAnalysis(data, analysis_type = 'basic') {
  // Analyze data and return insights
  const insights = {
    summary: 'Data analysis complete',
    patterns: [],
    recommendations: []
  };
  return insights;
}`,
      icon: Database
    },
    {
      id: 'text_processing',
      name: 'Text Processing',
      description: 'Process and analyze text content',
      category: 'Text',
      parameters: [
        { name: 'text', type: 'string', required: true, description: 'Text to process' },
        { name: 'operation', type: 'string', required: false, description: 'Processing operation' }
      ],
      code: `// Text Processing Function
async function textProcessing(text, operation = 'summarize') {
  const zai = await ZAI.create();
  const result = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: \`You are a text processing assistant. Please \${operation} the following text.\`
      },
      {
        role: 'user',
        content: text
      }
    ]
  });
  return result.choices[0].message.content;
}`,
      icon: FileText
    },
    {
      id: 'math_calculator',
      name: 'Math Calculator',
      description: 'Perform mathematical calculations',
      category: 'Math',
      parameters: [
        { name: 'expression', type: 'string', required: true, description: 'Mathematical expression' },
        { name: 'precision', type: 'number', required: false, description: 'Decimal precision' }
      ],
      code: `// Math Calculator Function
async function mathCalculator(expression, precision = 2) {
  try {
    const result = eval(expression);
    return Number(result.toFixed(precision));
  } catch (error) {
    throw new Error('Invalid mathematical expression');
  }
}`,
      icon: Calculator
    }
  ]

  const categories = ['Web', 'Data', 'Text', 'Math', 'Custom']

  const handleFunctionSelect = (func: FunctionDefinition) => {
    setSelectedFunction(func)
    const newCall: FunctionCall = {
      id: Math.random().toString(36).substr(2, 9),
      functionId: func.id,
      parameters: {},
      status: 'idle'
    }
    setFunctionCalls(prev => [...prev, newCall])
  }

  const handleParameterChange = (callId: string, paramName: string, value: string) => {
    setFunctionCalls(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, parameters: { ...call.parameters, [paramName]: value } }
        : call
    ))
  }

  const executeFunction = async (callId: string) => {
    setIsExecuting(true)
    setFunctionCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, status: 'running' } : call
    ))

    // Simulate function execution
    await new Promise(resolve => setTimeout(resolve, 2000))

    const call = functionCalls.find(c => c.id === callId)
    const func = functionLibrary.find(f => f.id === call?.functionId)

    if (func && call) {
      const mockResult = {
        success: true,
        data: `Mock result for ${func.name} with parameters: ${JSON.stringify(call.parameters)}`,
        timestamp: new Date().toISOString()
      }

      setFunctionCalls(prev => prev.map(c => 
        c.id === callId 
          ? { 
              ...c, 
              result: mockResult, 
              status: 'completed',
              executionTime: 2000
            }
          : c
      ))

      setExecutionResults(JSON.stringify(mockResult, null, 2))
    }

    setIsExecuting(false)
  }

  const createChain = () => {
    const newChain: FunctionChain = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Chain ${chains.length + 1}`,
      calls: [],
      status: 'idle'
    }
    setChains(prev => [...prev, newChain])
    setActiveChain(newChain)
  }

  const addToChain = (callId: string) => {
    if (!activeChain) return

    const call = functionCalls.find(c => c.id === callId)
    if (call) {
      const chainCall: FunctionCall = { ...call }
      setChains(prev => prev.map(chain => 
        chain.id === activeChain.id 
          ? { ...chain, calls: [...chain.calls, chainCall] }
          : chain
      ))
    }
  }

  const executeChain = async (chainId: string) => {
    setIsExecuting(true)
    setChains(prev => prev.map(chain => 
      chain.id === chainId ? { ...chain, status: 'running' } : chain
    ))

    const chain = chains.find(c => c.id === chainId)
    if (chain) {
      for (const call of chain.calls) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        // Simulate execution
        setChains(prev => prev.map(c => 
          c.id === chainId 
            ? { 
                ...c, 
                calls: c.calls.map(cc => 
                  cc.id === call.id 
                    ? { ...cc, status: 'completed', executionTime: 1500 }
                    : cc
                )
              }
            : c
        ))
      }
    }

    setChains(prev => prev.map(chain => 
      chain.id === chainId ? { ...chain, status: 'completed' } : chain
    ))
    setIsExecuting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Pause className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Function Calling
            </h1>
            <p className="text-xl text-muted-foreground">
              Interactive AI function testing and chaining capabilities
            </p>
          </div>

          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="library">Function Library</TabsTrigger>
              <TabsTrigger value="testing">Interactive Testing</TabsTrigger>
              <TabsTrigger value="chaining">Function Chaining</TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Categories</CardTitle>
                      <CardDescription>Filter functions by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <Button
                            key={category}
                            variant="outline"
                            className="w-full justify-start"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Functions</CardTitle>
                      <CardDescription>Built-in functions ready to use</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {functionLibrary.map(func => (
                          <Card 
                            key={func.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleFunctionSelect(func)}
                          >
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <func.icon className="w-5 h-5" />
                                {func.name}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {func.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary">{func.category}</Badge>
                                <Badge variant="outline">
                                  {func.parameters.length} params
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Function Configuration</CardTitle>
                    <CardDescription>Configure and test functions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedFunction ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <selectedFunction.icon className="w-8 h-8" />
                          <div>
                            <h3 className="font-medium">{selectedFunction.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedFunction.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Parameters</h4>
                          {selectedFunction.parameters.map(param => (
                            <div key={param.name} className="space-y-2">
                              <Label htmlFor={param.name}>
                                {param.name} ({param.type})
                                {param.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              <Input
                                id={param.name}
                                placeholder={param.description}
                                onChange={(e) => {
                                  const call = functionCalls.find(c => c.functionId === selectedFunction.id)
                                  if (call) {
                                    handleParameterChange(call.id, param.name, e.target.value)
                                  }
                                }}
                              />
                              <p className="text-xs text-muted-foreground">
                                {param.description}
                              </p>
                            </div>
                          ))}
                        </div>

                        <Button 
                          onClick={() => {
                            const call = functionCalls.find(c => c.functionId === selectedFunction.id)
                            if (call) executeFunction(call.id)
                          }}
                          disabled={isExecuting}
                          className="w-full"
                        >
                          {isExecuting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          Execute Function
                        </Button>
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Select a function from the library to test
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Execution Results</CardTitle>
                    <CardDescription>View function execution output</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {executionResults ? (
                      <Textarea
                        value={executionResults}
                        readOnly
                        className="min-h-[300px] font-mono text-sm"
                      />
                    ) : (
                      <div className="text-center py-12">
                        <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          Execute a function to see results here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Function Calls</CardTitle>
                  <CardDescription>History of executed functions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {functionCalls.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No function calls yet
                      </p>
                    ) : (
                      functionCalls.map(call => {
                        const func = functionLibrary.find(f => f.id === call.functionId)
                        return (
                          <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {func && <func.icon className="w-5 h-5" />}
                              <div>
                                <p className="font-medium">{func?.name || 'Unknown'}</p>
                                <p className="text-sm text-muted-foreground">
                                  {call.executionTime ? `${call.executionTime}ms` : 'Not executed'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(call.status)}
                              <Badge variant={
                                call.status === 'completed' ? 'default' :
                                call.status === 'error' ? 'destructive' : 'secondary'
                              }>
                                {call.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => executeFunction(call.id)}
                                disabled={isExecuting}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chaining" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Function Chains</CardTitle>
                      <CardDescription>Manage function chains</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button onClick={createChain} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          New Chain
                        </Button>
                        
                        {chains.length === 0 ? (
                          <p className="text-center text-muted-foreground py-4">
                            No chains created
                          </p>
                        ) : (
                          chains.map(chain => (
                            <Card 
                              key={chain.id} 
                              className={`cursor-pointer transition-colors ${
                                activeChain?.id === chain.id ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => setActiveChain(chain)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{chain.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {chain.calls.length} functions
                                    </p>
                                  </div>
                                  {getStatusIcon(chain.status)}
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chain Builder</CardTitle>
                      <CardDescription>Build and execute function chains</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activeChain ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{activeChain.name}</h3>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => executeChain(activeChain.id)}
                                disabled={isExecuting}
                              >
                                {isExecuting ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <Play className="w-4 h-4 mr-2" />
                                )}
                                Execute Chain
                              </Button>
                              <Button variant="outline" size="sm">
                                <Save className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">Chain Flow</h4>
                            <div className="space-y-2">
                              {activeChain.calls.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                  Add functions to build your chain
                                </p>
                              ) : (
                                activeChain.calls.map((call, index) => {
                                  const func = functionLibrary.find(f => f.id === call.functionId)
                                  return (
                                    <div key={call.id} className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline">{index + 1}</Badge>
                                        {func && <func.icon className="w-4 h-4" />}
                                        <span className="font-medium">{func?.name}</span>
                                      </div>
                                      {index < activeChain.calls.length - 1 && (
                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                      )}
                                      <div className="ml-auto">
                                        {getStatusIcon(call.status)}
                                      </div>
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">Available Functions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {functionLibrary.map(func => (
                                <Button
                                  key={func.id}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newCall: FunctionCall = {
                                      id: Math.random().toString(36).substr(2, 9),
                                      functionId: func.id,
                                      parameters: {},
                                      status: 'idle'
                                    }
                                    setChains(prev => prev.map(chain => 
                                      chain.id === activeChain.id 
                                        ? { ...chain, calls: [...chain.calls, newCall] }
                                        : chain
                                    ))
                                  }}
                                  className="justify-start"
                                >
                                  <func.icon className="w-4 h-4 mr-2" />
                                  {func.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <GitBranch className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">No Chain Selected</h3>
                          <p className="text-muted-foreground mb-4">
                            Create a new chain to start building function workflows
                          </p>
                          <Button onClick={createChain}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Chain
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}