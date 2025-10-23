'use client'

import { useState } from 'react'
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { MobileLayout } from "@/components/ui/mobile-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  Heart,
  Search,
  Briefcase,
  Building,
  Award,
  Target,
  Check,
  ArrowRight
} from "lucide-react"

export default function CareersPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout, loading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  const handleAuthClick = () => {
    if (user) {
      logout()
    } else {
      setIsAuthModalOpen(true)
    }
  }

  const jobOpenings = [
    {
      id: 1,
      title: "Senior AI Research Scientist",
      department: "Research",
      location: "Bangalore",
      type: "Full-time",
      experience: "5+ years",
      salary: "₹25L - ₹40L",
      description: "Lead research initiatives in multilingual AI and cultural context understanding. Work on cutting-edge projects that push the boundaries of AI technology.",
      requirements: [
        "PhD in Computer Science, AI, or related field",
        "5+ years of experience in AI research",
        "Strong publication record in top AI conferences",
        "Experience with large language models",
        "Knowledge of Indian languages is a plus"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible work arrangements",
        "Professional development budget",
        "Health insurance for family",
        "Paid time off and holidays"
      ],
      featured: true
    },
    {
      id: 2,
      title: "Machine Learning Engineer",
      department: "Engineering",
      location: "Bangalore",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹18L - ₹30L",
      description: "Build and deploy scalable ML systems that power our AI platform. Work on production-level systems serving millions of users.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "3+ years of experience in ML engineering",
        "Strong programming skills in Python",
        "Experience with cloud platforms (AWS/GCP)",
        "Knowledge of MLOps practices"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible work arrangements",
        "Professional development budget",
        "Health insurance for family",
        "Paid time off and holidays"
      ]
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Bangalore",
      type: "Full-time",
      experience: "4+ years",
      salary: "₹20L - ₹35L",
      description: "Drive product strategy and roadmap for our AI platform. Work closely with engineering, design, and business teams to deliver exceptional products.",
      requirements: [
        "Bachelor's degree in Business, Engineering, or related field",
        "4+ years of product management experience",
        "Experience with AI/ML products",
        "Strong analytical and communication skills",
        "MBA or equivalent is a plus"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible work arrangements",
        "Professional development budget",
        "Health insurance for family",
        "Paid time off and holidays"
      ]
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Bangalore",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹15L - ₹25L",
      description: "Design intuitive and beautiful user interfaces for our AI products. Focus on creating experiences that work seamlessly across Indian languages and cultural contexts.",
      requirements: [
        "Bachelor's degree in Design or related field",
        "3+ years of UX/UI design experience",
        "Strong portfolio showcasing design work",
        "Experience with design tools (Figma, Sketch, etc.)",
        "Understanding of Indian user preferences"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible work arrangements",
        "Professional development budget",
        "Health insurance for family",
        "Paid time off and holidays"
      ]
    },
    {
      id: 5,
      title: "Data Scientist",
      department: "Data Science",
      location: "Bangalore",
      type: "Full-time",
      experience: "2+ years",
      salary: "₹12L - ₹20L",
      description: "Analyze large datasets to derive insights and improve our AI models. Work on projects that have real impact on millions of users.",
      requirements: [
        "Bachelor's degree in Statistics, Mathematics, or related field",
        "2+ years of data science experience",
        "Strong programming skills in Python/R",
        "Experience with statistical analysis and ML",
        "Knowledge of data visualization tools"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible work arrangements",
        "Professional development budget",
        "Health insurance for family",
        "Paid time off and holidays"
      ]
    },
    {
      id: 6,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Bangalore",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹16L - ₹28L",
      description: "Build and maintain scalable infrastructure for our AI platform. Ensure high availability and performance of our systems.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "3+ years of DevOps experience",
        "Experience with cloud platforms (AWS/GCP)",
        "Knowledge of containerization and orchestration",
        "Experience with CI/CD pipelines"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible work arrangements",
        "Professional development budget",
        "Health insurance for family",
        "Paid time off and holidays"
      ]
    }
  ]

  const departments = ["All", "Engineering", "Research", "Product", "Design", "Data Science"]

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || job.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance for you and your family, including mental health support."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Professional Growth",
      description: "Annual learning budget, conference attendance, and regular training programs."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Flexible Work",
      description: "Remote work options, flexible hours, and generous paid time off."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Financial Security",
      description: "Competitive salaries, equity options, and retirement planning assistance."
    }
  ]

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Navigation */}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="/indiglm-logo.svg"
                  alt="IndiGLM Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold text-foreground">IndiGLM</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Home
                </a>
                <a href="/features" className="text-sm font-medium hover:text-primary transition-colors">
                  Features
                </a>
                <a href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </a>
                <a href="/api" className="text-sm font-medium hover:text-primary transition-colors">
                  API
                </a>
                <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
                  Documentation
                </a>
                <a href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                  Pricing
                </a>
              </div>
              
              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center space-x-4">
                {loading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : user ? (
                  <>
                    <a
                      href="/dashboard"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={handleAuthClick}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Sign In
                  </button>
                )}
                <a
                  href={user ? "/dashboard" : "/dashboard"}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {user ? "Dashboard" : "Get Started"}
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4">
                <Star className="w-3 h-3 mr-1" />
                Join Our Team
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Build the Future of AI
                <span className="block text-primary mt-2">With Us</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Join a team of passionate individuals working to democratize AI for India. 
                We're looking for talented people who share our vision and want to make a real impact.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  View Open Positions
                </Button>
                <Button size="lg" variant="outline">
                  Learn About Our Culture
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Join IndiGLM?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We offer more than just a job - we offer a chance to make a difference in the future of AI in India.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <div className="text-primary">{benefit.icon}</div>
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search positions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {departments.map((department) => (
                  <Button
                    key={department}
                    variant={selectedDepartment === department ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDepartment(department)}
                    className="text-xs"
                  >
                    {department}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
              <p className="text-muted-foreground">
                {filteredJobs.length} positions available
              </p>
            </div>
            
            {filteredJobs.length > 0 ? (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            {job.featured && (
                              <Badge className="bg-primary text-primary-foreground">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              <span>{job.department}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{job.experience}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                          <CardDescription className="text-base">
                            {job.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Requirements:</h4>
                          <ul className="space-y-1">
                            {job.requirements.slice(0, 3).map((req, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{req}</span>
                              </li>
                            ))}
                            {job.requirements.length > 3 && (
                              <li className="text-sm text-muted-foreground">
                                +{job.requirements.length - 3} more requirements
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {job.benefits.slice(0, 2).map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                          <Button>
                            Apply Now <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No positions found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or check back later for new opportunities
                </p>
                <Button onClick={() => { setSearchTerm(""); setSelectedDepartment("All") }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Culture</h2>
                <p className="text-lg text-muted-foreground">
                  We foster an environment of innovation, collaboration, and continuous learning.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Innovation First</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We encourage creative thinking and innovative solutions to complex problems.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Collaborative Spirit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We believe in the power of teamwork and diverse perspectives.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Impact Driven</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We're focused on creating technology that makes a real difference in people's lives.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Don't see the perfect role? We're always looking for talented individuals. 
                Send us your resume and let's start a conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  Apply for a Position
                </Button>
                <Button size="lg" variant="outline" onClick={() => window.location.href = '/contact'}>
                  Contact Our Team
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <img
                    src="/indiglm-logo.svg"
                    alt="IndiGLM Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold text-foreground">IndiGLM</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  India&apos;s most advanced AI platform, offering cutting-edge language models with deep understanding of Indian languages, culture, and context.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="/features" className="text-sm text-muted-foreground hover:text-primary">Features</a></li>
                  <li><a href="/api" className="text-sm text-muted-foreground hover:text-primary">API</a></li>
                  <li><a href="/docs" className="text-sm text-muted-foreground hover:text-primary">Documentation</a></li>
                  <li><a href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-sm text-muted-foreground hover:text-primary">About</a></li>
                  <li><a href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
                  <li><a href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</a></li>
                  <li><a href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-muted-foreground text-center">
                © 2024 IndiGLM. All rights reserved. Built with pride in India 🇮🇳
              </p>
            </div>
          </div>
        </footer>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    </MobileLayout>
  )
}