'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Globe, 
  Target, 
  TrendingUp, 
  Star,
  Zap,
  Users,
  BarChart3,
  Lightbulb,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface PersonalizationInsights {
  cultural_adaptation_score: number;
  linguistic_adaptation_score: number;
  personality_matching_score: number;
  learning_progress: number;
  overall_effectiveness: number;
  preferred_languages: Array<{
    language: string;
    usage_count: number;
    proficiency: number;
    confidence: number;
  }>;
  cultural_preferences: Array<{
    category: string;
    preference: string;
    strength: number;
    accuracy: number;
  }>;
  interaction_patterns: Array<{
    pattern: string;
    frequency: number;
    effectiveness: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  recommendations: Array<{
    type: 'language' | 'cultural' | 'personality' | 'communication';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    icon: string;
  }>;
  recent_improvements: Array<{
    area: string;
    before: number;
    after: number;
    change: number;
    date: string;
  }>;
}

interface PersonalizationInsightsProps {
  userId: string;
  timeRange?: '7d' | '30d' | '90d';
}

export function PersonalizationInsights({ userId, timeRange = '30d' }: PersonalizationInsightsProps) {
  const [insights, setInsights] = useState<PersonalizationInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock insights data
  const mockInsights: PersonalizationInsights = {
    cultural_adaptation_score: 0.92,
    linguistic_adaptation_score: 0.88,
    personality_matching_score: 0.85,
    learning_progress: 0.78,
    overall_effectiveness: 0.86,
    preferred_languages: [
      { language: 'हिन्दी', usage_count: 45, proficiency: 0.9, confidence: 0.95 },
      { language: 'English', usage_count: 32, proficiency: 0.8, confidence: 0.88 },
      { language: 'ਪੰਜਾਬੀ', usage_count: 18, proficiency: 0.6, confidence: 0.72 }
    ],
    cultural_preferences: [
      { category: 'festivals', preference: 'diwali', strength: 0.95, accuracy: 0.98 },
      { category: 'cuisine', preference: 'north-indian', strength: 0.88, accuracy: 0.91 },
      { category: 'music', preference: 'bollywood', strength: 0.82, accuracy: 0.85 },
      { category: 'traditions', preference: 'family-gatherings', strength: 0.90, accuracy: 0.93 }
    ],
    interaction_patterns: [
      { pattern: 'formal-inquiries', frequency: 0.3, effectiveness: 0.85, trend: 'stable' },
      { pattern: 'casual-conversation', frequency: 0.5, effectiveness: 0.92, trend: 'up' },
      { pattern: 'cultural-questions', frequency: 0.2, effectiveness: 0.95, trend: 'up' }
    ],
    recommendations: [
      {
        type: 'language',
        priority: 'high',
        title: 'Expand Punjabi Vocabulary',
        description: 'Your Punjabi interactions show room for improvement in specialized vocabulary.',
        impact: 'Could improve cultural context understanding by 15%'
      },
      {
        type: 'cultural',
        priority: 'medium',
        title: 'Explore South Indian Festivals',
        description: 'Your profile shows strong North Indian cultural knowledge. Consider exploring South Indian traditions.',
        impact: 'Would enhance cross-cultural understanding and personalization range'
      },
      {
        type: 'personality',
        priority: 'low',
        title: 'Adjust Communication Style',
        description: 'Your agreeableness trait suggests a preference for harmonious communication.',
        impact: 'Minor improvement in conversation flow and user satisfaction'
      }
    ],
    achievements: [
      {
        title: 'Cultural Expert',
        description: 'Achieved 90%+ accuracy in cultural context understanding',
        date: '2024-01-15',
        icon: '🏆'
      },
      {
        title: 'Multilingual Learner',
        description: 'Successfully learned 3 Indian languages',
        date: '2024-01-10',
        icon: '🌍'
      },
      {
        title: 'Personality Match',
        description: '85% personality trait matching accuracy',
        date: '2024-01-05',
        icon: '🎯'
      }
    ],
    recent_improvements: [
      {
        area: 'Cultural Adaptation',
        before: 0.85,
        after: 0.92,
        change: 0.07,
        date: '2024-01-18'
      },
      {
        area: 'Language Proficiency',
        before: 0.75,
        after: 0.88,
        change: 0.13,
        date: '2024-01-15'
      },
      {
        area: 'Response Quality',
        before: 0.80,
        after: 0.86,
        change: 0.06,
        date: '2024-01-12'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setInsights(mockInsights);
  }, [userId, timeRange]);

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'stable': return <Target className="h-4 w-4 text-gray-600" />;
      default: return null;
    }
  };

  if (!insights) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Loading personalization insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Personalization Effectiveness
          </CardTitle>
          <CardDescription>
            Overall performance of AI personalization for your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(insights.overall_effectiveness * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Overall</div>
              <Progress value={insights.overall_effectiveness * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(insights.cultural_adaptation_score)}`}>
                {Math.round(insights.cultural_adaptation_score * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Cultural</div>
              <Progress value={insights.cultural_adaptation_score * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(insights.linguistic_adaptation_score)}`}>
                {Math.round(insights.linguistic_adaptation_score * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Linguistic</div>
              <Progress value={insights.linguistic_adaptation_score * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(insights.personality_matching_score)}`}>
                {Math.round(insights.personality_matching_score * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Personality</div>
              <Progress value={insights.personality_matching_score * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(insights.learning_progress)}`}>
                {Math.round(insights.learning_progress * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Learning</div>
              <Progress value={insights.learning_progress * 100} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Language Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.preferred_languages.map((lang, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{lang.language}</span>
                          <Badge variant="outline" className="text-xs">
                            {lang.usage_count} uses
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getScoreBgColor(lang.confidence)}`} />
                          <span className="text-xs">{Math.round(lang.confidence * 100)}% confidence</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Proficiency:</span>
                        <Progress value={lang.proficiency * 100} className="flex-1 h-2" />
                        <span className="text-xs">{Math.round(lang.proficiency * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cultural Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Cultural Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.cultural_preferences.map((pref, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium capitalize">{pref.category}</div>
                          <div className="text-xs text-muted-foreground">{pref.preference}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getScoreBgColor(pref.accuracy)}`} />
                          <span className="text-xs">{Math.round(pref.accuracy * 100)}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Strength:</span>
                        <Progress value={pref.strength * 100} className="flex-1 h-2" />
                        <span className="text-xs">{Math.round(pref.strength * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interaction Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Interaction Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.interaction_patterns.map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium capitalize">{pattern.pattern}</div>
                        <div className="text-xs text-muted-foreground">
                          Frequency: {Math.round(pattern.frequency * 100)}%
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(pattern.trend)}
                        <div className="text-right">
                          <div className="text-xs font-medium">{Math.round(pattern.effectiveness * 100)}%</div>
                          <div className="text-xs text-muted-foreground">effective</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Interactions</span>
                    <Badge variant="secondary">
                      {insights.preferred_languages.reduce((sum, lang) => sum + lang.usage_count, 0)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Languages Used</span>
                    <Badge variant="secondary">
                      {insights.preferred_languages.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cultural Categories</span>
                    <Badge variant="secondary">
                      {insights.cultural_preferences.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg. Response Time</span>
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      450ms
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.recommendations.map((rec, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      {rec.title}
                    </CardTitle>
                    <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Impact:</strong> {rec.impact}
                  </div>
                  <div className="mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {rec.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.achievements.map((achievement, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.date}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Improvements
              </CardTitle>
              <CardDescription>
                Track your personalization progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.recent_improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{improvement.area}</div>
                        <div className="text-sm text-muted-foreground">{improvement.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        +{Math.round(improvement.change * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(improvement.before * 100)}% → {Math.round(improvement.after * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}