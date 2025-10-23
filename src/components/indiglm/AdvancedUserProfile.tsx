'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Brain, 
  Globe, 
  MapPin, 
  Sparkles, 
  Heart,
  Star,
  Target,
  BookOpen,
  Calendar,
  Settings,
  TrendingUp,
  Zap,
  Users,
  Plus,
  X,
  Save
} from 'lucide-react';

interface UserProfile {
  user_id: string;
  language: string;
  cultural_background: {
    region: string;
    preferences: Record<string, string[]>;
  };
  personality_traits: Record<string, number>;
  communication_style: string;
  interests: string[];
  learning_history: Array<{
    date: string;
    interaction_type: string;
    adaptation: string;
    success: boolean;
  }>;
  personalization_score: number;
  created_at: string;
  last_updated: string;
}

interface AdvancedUserProfileProps {
  userId: string;
  onProfileUpdate?: (profile: UserProfile) => void;
  editable?: boolean;
}

export function AdvancedUserProfile({ userId, onProfileUpdate, editable = true }: AdvancedUserProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [newPreference, setNewPreference] = useState({ category: '', value: '' });

  // Mock profile data - in real app, this would come from API
  const mockProfile: UserProfile = {
    user_id: userId,
    language: 'hi',
    cultural_background: {
      region: 'north',
      preferences: {
        festivals: ['diwali', 'holi', 'raksha-bandhan', 'eid'],
        cuisine: ['north-indian', 'mughlai', 'street-food', 'punjabi'],
        traditions: ['family-gatherings', 'religious-ceremonies', 'wedding-rituals'],
        entertainment: ['bollywood', 'classical-music', 'cricket', 'folk-dance'],
        values: ['family-first', 'respect-elders', 'education', 'spirituality']
      }
    },
    personality_traits: {
      openness: 0.8,
      conscientiousness: 0.7,
      extraversion: 0.6,
      agreeableness: 0.9,
      neuroticism: 0.3
    },
    communication_style: 'warm-friendly',
    interests: ['technology', 'indian-culture', 'education', 'spirituality', 'yoga', 'ayurveda'],
    learning_history: [
      { date: '2024-01-15', interaction_type: 'chat', adaptation: 'language-preference', success: true },
      { date: '2024-01-16', interaction_type: 'translation', adaptation: 'cultural-context', success: true },
      { date: '2024-01-17', interaction_type: 'chat', adaptation: 'communication-style', success: true },
      { date: '2024-01-18', interaction_type: 'multimodal', adaptation: 'visual-preference', success: false },
      { date: '2024-01-19', interaction_type: 'chat', adaptation: 'tone-adjustment', success: true }
    ],
    personalization_score: 0.85,
    created_at: '2024-01-01',
    last_updated: '2024-01-19'
  };

  useEffect(() => {
    // Simulate API call to fetch profile
    setProfile(mockProfile);
  }, [userId]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedProfile = {
        ...profile,
        last_updated: new Date().toISOString().split('T')[0]
      };
      setProfile(updatedProfile);
      setIsEditing(false);
      setIsLoading(false);
      onProfileUpdate?.(updatedProfile);
    }, 1000);
  };

  const addInterest = () => {
    if (!profile || !newInterest.trim()) return;
    
    setProfile({
      ...profile,
      interests: [...profile.interests, newInterest.trim()]
    });
    setNewInterest('');
  };

  const removeInterest = (index: number) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      interests: profile.interests.filter((_, i) => i !== index)
    });
  };

  const addPreference = () => {
    if (!profile || !newPreference.category.trim() || !newPreference.value.trim()) return;
    
    setProfile({
      ...profile,
      cultural_background: {
        ...profile.cultural_background,
        preferences: {
          ...profile.cultural_background.preferences,
          [newPreference.category]: [
            ...(profile.cultural_background.preferences[newPreference.category] || []),
            newPreference.value.trim()
          ]
        }
      }
    });
    setNewPreference({ category: '', value: '' });
  };

  const updatePersonalityTrait = (trait: string, value: number) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      personality_traits: {
        ...profile.personality_traits,
        [trait]: Math.max(0, Math.min(1, value))
      }
    });
  };

  const getTraitColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Loading user profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  User Profile
                  <Badge variant="secondary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {Math.round(profile.personalization_score * 100)}% Personalized
                  </Badge>
                </CardTitle>
                <CardDescription>
                  ID: {profile.user_id} • Last updated: {profile.last_updated}
                </CardDescription>
              </div>
            </div>
            {editable && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="cultural">Cultural</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language & Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Primary Language</label>
                  {isEditing ? (
                    <Select 
                      value={profile.language} 
                      onValueChange={(value) => setProfile({...profile, language: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                        <SelectItem value="bn">বাংলা</SelectItem>
                        <SelectItem value="te">తెలుగు</SelectItem>
                        <SelectItem value="mr">मराठी</SelectItem>
                        <SelectItem value="ta">தமிழ்</SelectItem>
                        <SelectItem value="gu">ગુજરાતી</SelectItem>
                        <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                        <SelectItem value="ml">മലയാളം</SelectItem>
                        <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge variant="outline">
                        <Globe className="h-3 w-3 mr-1" />
                        {profile.language === 'hi' ? 'हिन्दी' : profile.language}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Communication Style</label>
                  {isEditing ? (
                    <Select 
                      value={profile.communication_style} 
                      onValueChange={(value) => setProfile({...profile, communication_style: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="warm-friendly">Warm & Friendly</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {profile.communication_style}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Personalization Score</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={profile.personalization_score * 100} className="flex-1" />
                    <span className="text-sm font-medium">{Math.round(profile.personalization_score * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="relative">
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => removeInterest(index)}
                          className="ml-2 text-xs hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add new interest..."
                      className="flex-1"
                    />
                    <Button onClick={addInterest} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cultural" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Cultural Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Region</label>
                {isEditing ? (
                  <Select 
                    value={profile.cultural_background.region} 
                    onValueChange={(value) => setProfile({
                      ...profile,
                      cultural_background: {
                        ...profile.cultural_background,
                        region: value
                      }
                    })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">North India</SelectItem>
                      <SelectItem value="south">South India</SelectItem>
                      <SelectItem value="east">East India</SelectItem>
                      <SelectItem value="west">West India</SelectItem>
                      <SelectItem value="northeast">Northeast India</SelectItem>
                      <SelectItem value="central">Central India</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      {profile.cultural_background.region}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Cultural Preferences</label>
                <div className="space-y-4 mt-2">
                  {Object.entries(profile.cultural_background.preferences).map(([category, preferences]) => (
                    <div key={category}>
                      <div className="text-sm font-medium capitalize mb-2">{category}</div>
                      <div className="flex flex-wrap gap-2">
                        {preferences.map((pref, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">Add New Preference</div>
                  <div className="flex gap-2">
                    <Input
                      value={newPreference.category}
                      onChange={(e) => setNewPreference({...newPreference, category: e.target.value})}
                      placeholder="Category (e.g., festivals)"
                      className="flex-1"
                    />
                    <Input
                      value={newPreference.value}
                      onChange={(e) => setNewPreference({...newPreference, value: e.target.value})}
                      placeholder="Value (e.g., diwali)"
                      className="flex-1"
                    />
                    <Button onClick={addPreference} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Personality Traits
              </CardTitle>
              <CardDescription>
                Big Five personality traits that influence personalization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(profile.personality_traits).map(([trait, score]) => (
                <div key={trait}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize">{trait}</span>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={score}
                          onChange={(e) => updatePersonalityTrait(trait, parseFloat(e.target.value))}
                          className="w-16 text-xs"
                        />
                      ) : (
                        <span className={`text-sm font-medium ${getTraitColor(score)}`}>
                          {Math.round(score * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning History
              </CardTitle>
              <CardDescription>
                Track how the AI has adapted to your preferences over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.learning_history.map((learning, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${learning.success ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <div className="text-sm font-medium">{learning.adaptation}</div>
                        <div className="text-xs text-muted-foreground">
                          {learning.interaction_type} • {learning.date}
                        </div>
                      </div>
                    </div>
                    <Badge variant={learning.success ? 'default' : 'destructive'} className="text-xs">
                      {learning.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Profile created: {profile.created_at} • 
                  Total interactions: {profile.learning_history.length} • 
                  Success rate: {Math.round((profile.learning_history.filter(l => l.success).length / profile.learning_history.length) * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}