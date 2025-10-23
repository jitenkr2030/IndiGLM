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
import { 
  Code, 
  Terminal, 
  GitBranch, 
  Play, 
  Copy, 
  Download, 
  Upload,
  RefreshCw,
  Lightbulb,
  Zap,
  Languages,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Database,
  Smartphone,
  Globe
} from 'lucide-react'

interface CodeSnippet {
  id: string
  language: string
  code: string
  description: string
  timestamp: string
}

interface OptimizationSuggestion {
  type: 'performance' | 'readability' | 'security' | 'best_practice'
  description: string
  suggestion: string
  impact: 'low' | 'medium' | 'high'
}

export default function CodeToolsPage() {
  const [inputCode, setInputCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [explanation, setExplanation] = useState('')
  const [optimizedCode, setOptimizedCode] = useState('')
  const [translatedCode, setTranslatedCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [targetLanguage, setTargetLanguage] = useState('python')
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [optimizations, setOptimizations] = useState<OptimizationSuggestion[]>([])
  const [codeHistory, setCodeHistory] = useState<CodeSnippet[]>([])

  const programmingLanguages = [
    { value: 'javascript', name: 'JavaScript', icon: Globe },
    { value: 'python', name: 'Python', icon: Terminal },
    { value: 'java', name: 'Java', icon: Coffee },
    { value: 'cpp', name: 'C++', icon: Zap },
    { value: 'csharp', name: 'C#', icon: Database },
    { value: 'typescript', name: 'TypeScript', icon: Code },
    { value: 'php', name: 'PHP', icon: Globe },
    { value: 'ruby', name: 'Ruby', icon: Smartphone },
    { value: 'go', name: 'Go', icon: Zap },
    { value: 'rust', name: 'Rust', icon: Terminal }
  ]

  const codeTemplates = [
    {
      name: 'REST API Handler',
      language: 'javascript',
      template: `// REST API Handler
async function handleRequest(req, res) {
  try {
    const { method, url, body } = req;
    
    if (method === 'GET' && url === '/api/users') {
      const users = await getUsers();
      res.json(users);
    } else if (method === 'POST' && url === '/api/users') {
      const newUser = await createUser(body);
      res.status(201).json(newUser);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}`
    },
    {
      name: 'Data Processing Pipeline',
      language: 'python',
      template: `# Data Processing Pipeline
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def process_data(data_path):
    # Load data
    df = pd.read_csv(data_path)
    
    # Clean data
    df = df.dropna()
    df = df.drop_duplicates()
    
    # Feature engineering
    df['new_feature'] = df['feature1'] * df['feature2']
    
    # Scale features
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(df.select_dtypes(include=[np.number]))
    
    return scaled_features`
    },
    {
      name: 'React Component',
      language: 'typescript',
      template: `import React, { useState, useEffect } from 'react';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

export default UserProfile;`
    }
  ]

  const generateCode = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)
    
    // Simulate AI code generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockGeneratedCode = `// Generated code for: ${prompt}
function ${prompt.toLowerCase().replace(/\s+/g, '_')}() {
  // AI-generated implementation
  console.log('Executing: ${prompt}');
  
  // Main logic
  const result = processRequest();
  
  return result;
}

// Helper functions
function processRequest() {
  return {
    success: true,
    data: 'Processed successfully',
    timestamp: new Date().toISOString()
  };
}

// Export for use
module.exports = { ${prompt.toLowerCase().replace(/\s+/g, '_')} };`

    setGeneratedCode(mockGeneratedCode)
    
    // Add to history
    const newSnippet: CodeSnippet = {
      id: Math.random().toString(36).substr(2, 9),
      language: selectedLanguage,
      code: mockGeneratedCode,
      description: prompt,
      timestamp: new Date().toISOString()
    }
    setCodeHistory(prev => [newSnippet, ...prev])
    
    setIsProcessing(false)
  }

  const explainCode = async () => {
    if (!inputCode.trim()) return

    setIsProcessing(true)
    
    // Simulate AI code explanation
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockExplanation = `## Code Explanation

This code implements a ${selectedLanguage} function that performs the following operations:

### Overview
The code defines a main function that handles request processing and includes helper functions for data manipulation.

### Key Components

1. **Main Function**: 
   - Handles the primary logic flow
   - Returns structured results
   - Includes error handling

2. **Helper Functions**:
   - \`processRequest()\`: Core business logic
   - Returns standardized response format

### Code Structure
- **Input Validation**: Implicit in function design
- **Processing**: Centralized in helper function
- **Output**: Consistent response format with success status and data

### Best Practices Applied
- Modular design with separate concerns
- Consistent error handling
- Clear function naming
- Proper code organization

### Usage Example
\`\`\`javascript
const result = ${prompt.toLowerCase().replace(/\s+/g, '_')}();
console.log(result);
// Output: { success: true, data: 'Processed successfully', timestamp: '...' }
\`\`\``

    setExplanation(mockExplanation)
    setIsProcessing(false)
  }

  const optimizeCode = async () => {
    if (!inputCode.trim()) return

    setIsProcessing(true)
    
    // Simulate AI code optimization
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockOptimizedCode = `// Optimized version of the input code
async function optimizedFunction() {
  try {
    // Use async/await for better readability
    const result = await processRequestOptimized();
    
    // Early return for better performance
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    // Destructure for cleaner code
    const { data, timestamp } = result;
    
    return {
      success: true,
      data: data.toUpperCase(), // Example optimization
      timestamp,
      processed: true
    };
  } catch (error) {
    // Better error handling
    console.error('Optimization failed:', error);
    return { success: false, error: error.message };
  }
}

// Optimized helper function
async function processRequestOptimized() {
  // Cache results for better performance
  const cacheKey = 'request_cache';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const result = {
    success: true,
    data: 'Processed successfully (optimized)',
    timestamp: new Date().toISOString()
  };
  
  // Cache for future use
  cache.set(cacheKey, result, 30000); // 30 second cache
  
  return result;
}`

    setOptimizedCode(mockOptimizedCode)

    const mockOptimizations: OptimizationSuggestion[] = [
      {
        type: 'performance',
        description: 'Added async/await for better performance',
        suggestion: 'Use async/await instead of callbacks for non-blocking operations',
        impact: 'high'
      },
      {
        type: 'readability',
        description: 'Improved code structure and organization',
        suggestion: 'Add proper error handling and early returns',
        impact: 'medium'
      },
      {
        type: 'best_practice',
        description: 'Added caching mechanism',
        suggestion: 'Implement caching to reduce redundant processing',
        impact: 'medium'
      }
    ]

    setOptimizations(mockOptimizations)
    setIsProcessing(false)
  }

  const translateCode = async () => {
    if (!inputCode.trim()) return

    setIsProcessing(true)
    
    // Simulate AI code translation
    await new Promise(resolve => setTimeout(resolve, 2500))

    const mockTranslatedCode = `# Translated to Python
import asyncio
from datetime import datetime
from typing import Dict, Any, Optional

async def optimized_function() -> Dict[str, Any]:
    """
    Optimized version of the input code translated to Python
    
    Returns:
        Dict containing success status, data, and metadata
    """
    try:
        # Use async/await for better performance
        result = await process_request_optimized()
        
        # Early return for better performance
        if not result.get('success', False):
            return {'success': False, 'error': result.get('error')}
        
        # Unpack for cleaner code
        data = result.get('data')
        timestamp = result.get('timestamp')
        
        return {
            'success': True,
            'data': data.upper(),  # Example optimization
            'timestamp': timestamp,
            'processed': True
        }
    except Exception as error:
        # Better error handling
        print(f'Optimization failed: {error}')
        return {'success': False, 'error': str(error)}

# Optimized helper function
async def process_request_optimized() -> Dict[str, Any]:
    """
    Process request with caching for better performance
    
    Returns:
        Dict containing processed data and metadata
    """
    # Cache results for better performance
    cache_key = 'request_cache'
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    result = {
        'success': True,
        'data': 'Processed successfully (optimized)',
        'timestamp': datetime.now().isoformat()
    }
    
    # Cache for future use
    cache.set(cache_key, result, 30)  # 30 second cache
    
    return result`

    setTranslatedCode(mockTranslatedCode)
    setIsProcessing(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const getOptimizationIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <Zap className="w-4 h-4" />
      case 'readability':
        return <FileText className="w-4 h-4" />
      case 'security':
        return <AlertCircle className="w-4 h-4" />
      case 'best_practice':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Code Tools
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-powered development tools for modern software engineering
            </p>
          </div>

          <Tabs defaultValue="generation" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generation">Code Generation</TabsTrigger>
              <TabsTrigger value="explanation">Code Explanation</TabsTrigger>
              <TabsTrigger value="optimization">Code Optimization</TabsTrigger>
              <TabsTrigger value="translation">Code Translation</TabsTrigger>
            </TabsList>

            <TabsContent value="generation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Generate Code
                    </CardTitle>
                    <CardDescription>
                      Describe what you want to create and AI will generate the code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="prompt">What do you want to create?</Label>
                      <Textarea
                        id="prompt"
                        placeholder="e.g., Create a REST API endpoint for user authentication"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px] mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="language">Programming Language</Label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {programmingLanguages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={generateCode}
                      disabled={isProcessing || !prompt.trim()}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Generate Code
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Generated Code</CardTitle>
                    <CardDescription>
                      AI-generated code based on your description
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedCode ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{selectedLanguage}</Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(generatedCode)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadCode(generatedCode, 'generated_code.txt')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          value={generatedCode}
                          readOnly
                          className="min-h-[300px] font-mono text-sm"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          Generated code will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Code Templates</CardTitle>
                  <CardDescription>
                    Quick-start templates for common programming tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {codeTemplates.map(template => (
                      <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {template.language}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setGeneratedCode(template.template)
                              setSelectedLanguage(template.language)
                            }}
                            className="w-full"
                          >
                            Use Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="explanation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Input Code
                    </CardTitle>
                    <CardDescription>
                      Paste code you want explained
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="input-code">Code to Explain</Label>
                      <Textarea
                        id="input-code"
                        placeholder="Paste your code here..."
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="min-h-[200px] mt-2 font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="explain-language">Language</Label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {programmingLanguages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={explainCode}
                      disabled={isProcessing || !inputCode.trim()}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Lightbulb className="w-4 h-4 mr-2" />
                      )}
                      Explain Code
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Code Explanation</CardTitle>
                    <CardDescription>
                      AI-generated explanation of your code
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {explanation ? (
                      <div className="prose prose-sm max-w-none">
                        <div 
                          dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br>') }}
                          className="whitespace-pre-wrap"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          Code explanation will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Code to Optimize
                    </CardTitle>
                    <CardDescription>
                      Paste code you want to optimize
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="optimize-code">Code to Optimize</Label>
                      <Textarea
                        id="optimize-code"
                        placeholder="Paste your code here..."
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="min-h-[200px] mt-2 font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="optimize-language">Language</Label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {programmingLanguages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={optimizeCode}
                      disabled={isProcessing || !inputCode.trim()}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Optimize Code
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Optimized Code</CardTitle>
                    <CardDescription>
                      AI-optimized version of your code
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {optimizedCode ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Optimized</Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(optimizedCode)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadCode(optimizedCode, 'optimized_code.txt')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          value={optimizedCode}
                          readOnly
                          className="min-h-[300px] font-mono text-sm"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          Optimized code will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {optimizations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Suggestions</CardTitle>
                    <CardDescription>
                      AI recommendations for improving your code
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {optimizations.map((opt, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            {getOptimizationIcon(opt.type)}
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                {opt.type.replace('_', ' ')}
                              </Badge>
                              <Badge className={getImpactColor(opt.impact)}>
                                {opt.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <p className="font-medium mb-1">{opt.description}</p>
                          <p className="text-sm text-muted-foreground">{opt.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="translation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Code Translation
                    </CardTitle>
                    <CardDescription>
                      Translate code between programming languages
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="translate-code">Code to Translate</Label>
                      <Textarea
                        id="translate-code"
                        placeholder="Paste your code here..."
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="min-h-[150px] mt-2 font-mono text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="from-language">From</Label>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {programmingLanguages.map(lang => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="to-language">To</Label>
                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {programmingLanguages.map(lang => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      onClick={translateCode}
                      disabled={isProcessing || !inputCode.trim()}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Languages className="w-4 h-4 mr-2" />
                      )}
                      Translate Code
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Translated Code</CardTitle>
                    <CardDescription>
                      AI-translated code in target language
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {translatedCode ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {programmingLanguages.find(l => l.value === targetLanguage)?.name}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(translatedCode)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadCode(translatedCode, 'translated_code.txt')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          value={translatedCode}
                          readOnly
                          className="min-h-[300px] font-mono text-sm"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Languages className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          Translated code will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Coffee icon component
const Coffee = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
)