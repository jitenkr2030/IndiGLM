"""
IndiGLM Web Search Module
========================

Advanced web search capabilities with Indian context and regional focus.
Based on Z.ai-style web search functionality.
"""

import os
import json
import time
import asyncio
import aiohttp
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from enum import Enum
from datetime import datetime, timedelta
from urllib.parse import quote, urlparse
import re

import requests
from bs4 import BeautifulSoup


class SearchType(Enum):
    """Types of web search."""
    GENERAL = "general"
    NEWS = "news"
    ACADEMIC = "academic"
    BUSINESS = "business"
    GOVERNMENT = "government"
    EDUCATION = "education"
    HEALTH = "health"
    TECHNOLOGY = "technology"
    ENTERTAINMENT = "entertainment"
    SPORTS = "sports"


class IndianRegion(Enum):
    """Indian regions for localized search."""
    ALL = "all"
    NORTH = "north"
    SOUTH = "south"
    EAST = "east"
    WEST = "west"
    NORTHEAST = "northeast"
    CENTRAL = "central"
    ANDHRA_PRADESH = "andhra_pradesh"
    KARNATAKA = "karnataka"
    TAMIL_NADU = "tamil_nadu"
    MAHARASHTRA = "maharashtra"
    UTTAR_PRADESH = "uttar_pradesh"
    BIHAR = "bihar"
    WEST_BENGAL = "west_bengal"
    GUJARAT = "gujarat"
    RAJASTHAN = "rajasthan"
    PUNJAB = "punjab"
    HARYANA = "haryana"
    DELHI = "delhi"
    KERALA = "kerala"
    ODISHA = "odisha"
    MADHYA_PRADESH = "madhya_pradesh"
    ASSAM = "assam"


@dataclass
class SearchResultItem:
    """Individual search result item."""
    url: str
    name: str
    snippet: str
    host_name: str
    rank: int
    date: str
    favicon: Optional[str] = None
    indian_relevance: Optional[float] = None
    region_specific: Optional[bool] = None
    language: Optional[str] = None


@dataclass
class WebSearchRequest:
    """Request for web search."""
    query: str
    num: int = 10
    region: str = "in"
    indian_focus: bool = True
    search_type: str = "general"
    language: Optional[str] = None
    time_range: Optional[str] = None  # "day", "week", "month", "year"
    safe_search: bool = True
    include_sites: Optional[List[str]] = None
    exclude_sites: Optional[List[str]] = None


@dataclass
class WebSearchResponse:
    """Response from web search."""
    query: str
    enhanced_query: Optional[str]
    results: List[SearchResultItem]
    search_metadata: Dict[str, Any]
    indian_context: Optional[Dict[str, Any]] = None
    related_searches: Optional[List[str]] = None


class IndianSearchEnhancer:
    """Enhances web search with Indian context and regional focus."""
    
    def __init__(self):
        """Initialize the search enhancer."""
        self.indian_domains = [
            ".in", ".co.in", ".ac.in", ".edu.in", ".gov.in", ".nic.in",
            ".org.in", ".net.in", ".gen.in", ".firm.in"
        ]
        
        self.indian_sites = [
            "timesofindia.indiatimes.com", "thehindu.com", "indianexpress.com",
            "ndtv.com", "hindustantimes.com", "economictimes.indiatimes.com",
            "livemint.com", "business-standard.com", "firstpost.com",
            "news18.com", "indiatoday.com", "outlookindia.com"
        ]
        
        self.regional_keywords = {
            "north": ["delhi", "ncr", "up", "uttar pradesh", "haryana", "punjab", "himachal", "jammu", "kashmir"],
            "south": ["tamil", "nadu", "karnataka", "andhra", "telangana", "kerala", "chennai", "bangalore", "hyderabad"],
            "east": ["west bengal", "bihar", "jharkhand", "odisha", "assam", "kolkata"],
            "west": ["maharashtra", "gujarat", "goa", "rajasthan", "mumbai", "pune", "ahmedabad"],
            "northeast": ["assam", "meghalaya", "manipur", "tripura", "nagaland", "mizoram", "arunachal"],
            "central": ["madhya pradesh", "chhattisgarh"]
        }
        
        self.indian_context_keywords = [
            "india", "indian", "bharat", "desi", "hindustani", "swadeshi",
            "modi", "bjp", "congress", "government", "policy", "scheme",
            "rupee", "rs", "inr", "lakh", "crore", "budget", "gdp",
            "diwali", "holi", "eid", "christmas", "pongal", "onam",
            "cricket", "ipl", "sachin", "dhoni", "kohli", "bollywood"
        ]
    
    def enhance_query(self, query: str, region: Optional[str] = None, 
                     search_type: str = "general") -> str:
        """Enhance search query with Indian context."""
        enhanced_query = query
        
        # Add Indian context if not already present
        if not any(keyword.lower() in query.lower() for keyword in self.indian_context_keywords):
            enhanced_query += " India"
        
        # Add regional context
        if region and region.lower() in self.regional_keywords:
            region_keywords = self.regional_keywords[region.lower()]
            # Add the most relevant regional keyword
            enhanced_query += f" {region_keywords[0]}"
        
        # Add search type context
        search_type_context = {
            "news": "latest news updates",
            "business": "business economy market",
            "government": "government policy official",
            "education": "education schools colleges",
            "health": "health medical hospitals",
            "technology": "technology tech startup",
            "entertainment": "entertainment bollywood movies",
            "sports": "sports cricket matches"
        }
        
        if search_type in search_type_context:
            enhanced_query += f" {search_type_context[search_type]}"
        
        return enhanced_query
    
    def calculate_indian_relevance(self, url: str, title: str, snippet: str) -> float:
        """Calculate Indian relevance score for a search result."""
        score = 0.0
        
        # Check domain
        for domain in self.indian_domains:
            if domain in url.lower():
                score += 0.5
                break
        
        # Check known Indian sites
        for site in self.indian_sites:
            if site in url.lower():
                score += 0.7
                break
        
        # Check content for Indian keywords
        content = f"{title} {snippet}".lower()
        indian_keyword_count = sum(1 for keyword in self.indian_context_keywords if keyword.lower() in content)
        score += min(indian_keyword_count * 0.1, 0.3)
        
        return min(score, 1.0)
    
    def get_indian_context(self, region: Optional[str] = None, 
                          search_type: str = "general") -> Dict[str, Any]:
        """Get Indian context for the search."""
        context = {
            "region": region or "all",
            "search_type": search_type,
            "language_preference": "english",
            "cultural_relevance": True,
            "local_focus": region is not None
        }
        
        if region:
            context["regional_keywords"] = self.regional_keywords.get(region.lower(), [])
        
        return context


class WebSearchEngine:
    """Main web search engine class."""
    
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        """Initialize the web search engine."""
        self.api_key = api_key or os.getenv("INDIGLM_API_KEY")
        self.base_url = (base_url or os.getenv("INDIGLM_BASE_URL", "https://api.indiglm.ai/v1")).rstrip('/')
        self.enhancer = IndianSearchEnhancer()
        
        if not self.api_key:
            raise ValueError("API key is required. Set INDIGLM_API_KEY environment variable or pass api_key parameter.")
        
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": f"IndiGLM-WebSearch/1.0.0"
        })
    
    def search(self, request: WebSearchRequest) -> WebSearchResponse:
        """Perform web search."""
        # Enhance query with Indian context
        enhanced_query = self.enhancer.enhance_query(
            request.query,
            request.region if request.region != "in" else None,
            request.search_type
        )
        
        # Prepare request data
        data = {
            "query": enhanced_query,
            "num": request.num,
            "region": request.region,
            "search_type": request.search_type,
            "safe_search": request.safe_search,
            "indian_focus": request.indian_focus
        }
        
        if request.language:
            data["language"] = request.language
        
        if request.time_range:
            data["time_range"] = request.time_range
        
        if request.include_sites:
            data["include_sites"] = request.include_sites
        
        if request.exclude_sites:
            data["exclude_sites"] = request.exclude_sites
        
        # Make API request
        try:
            response = self.session.post(
                f"{self.base_url}/web/search",
                json=data,
                timeout=30
            )
            response.raise_for_status()
            response_data = response.json()
            
            # Parse response
            results = []
            for result_data in response_data.get("results", []):
                result = SearchResultItem(
                    url=result_data.get("url", ""),
                    name=result_data.get("name", ""),
                    snippet=result_data.get("snippet", ""),
                    host_name=result_data.get("host_name", ""),
                    rank=result_data.get("rank", 0),
                    date=result_data.get("date", ""),
                    favicon=result_data.get("favicon"),
                    indian_relevance=result_data.get("indian_relevance"),
                    region_specific=result_data.get("region_specific"),
                    language=result_data.get("language")
                )
                results.append(result)
            
            # Get Indian context
            indian_context = self.enhancer.get_indian_context(
                request.region if request.region != "in" else None,
                request.search_type
            )
            
            return WebSearchResponse(
                query=request.query,
                enhanced_query=enhanced_query,
                results=results,
                search_metadata=response_data.get("search_metadata", {}),
                indian_context=indian_context,
                related_searches=response_data.get("related_searches")
            )
            
        except requests.exceptions.RequestException as e:
            # Fallback to mock search for demo purposes
            return self._perform_mock_search(request, enhanced_query)
    
    def _perform_mock_search(self, request: WebSearchRequest, enhanced_query: str) -> WebSearchResponse:
        """Perform mock search for demo purposes."""
        # Generate mock search results
        mock_results = []
        
        # Create mock results based on search type
        if request.search_type == "news":
            mock_results = self._generate_mock_news_results(enhanced_query, request.num)
        elif request.search_type == "business":
            mock_results = self._generate_mock_business_results(enhanced_query, request.num)
        else:
            mock_results = self._generate_mock_general_results(enhanced_query, request.num)
        
        # Calculate Indian relevance for each result
        for result in mock_results:
            result.indian_relevance = self.enhancer.calculate_indian_relevance(
                result.url, result.name, result.snippet
            )
        
        # Get Indian context
        indian_context = self.enhancer.get_indian_context(
            request.region if request.region != "in" else None,
            request.search_type
        )
        
        return WebSearchResponse(
            query=request.query,
            enhanced_query=enhanced_query,
            results=mock_results,
            search_metadata={
                "total_results": len(mock_results),
                "search_time": 0.5,
                "region": request.region,
                "search_type": request.search_type,
                "indian_focus": request.indian_focus,
                "mock": True
            },
            indian_context=indian_context,
            related_searches=self._generate_related_searches(enhanced_query)
        )
    
    def _generate_mock_general_results(self, query: str, num: int) -> List[SearchResultItem]:
        """Generate mock general search results."""
        mock_sites = [
            ("wikipedia.org", "Wikipedia"),
            ("timesofindia.indiatimes.com", "Times of India"),
            ("thehindu.com", "The Hindu"),
            ("indianexpress.com", "Indian Express"),
            ("ndtv.com", "NDTV"),
            ("gov.in", "Government of India"),
            ("edu.in", "Educational Institution"),
            ("org.in", "Organization")
        ]
        
        results = []
        for i in range(min(num, len(mock_sites))):
            domain, site_name = mock_sites[i]
            result = SearchResultItem(
                url=f"https://{domain}/{query.replace(' ', '-').lower()}",
                name=f"{query} - {site_name}",
                snippet=f"This is a comprehensive article about {query} in the Indian context. It covers various aspects including cultural significance, current trends, and future prospects.",
                host_name=domain,
                rank=i + 1,
                date=datetime.now().strftime("%Y-%m-%d"),
                favicon=f"https://{domain}/favicon.ico"
            )
            results.append(result)
        
        return results
    
    def _generate_mock_news_results(self, query: str, num: int) -> List[SearchResultItem]:
        """Generate mock news search results."""
        news_sites = [
            ("timesofindia.indiatimes.com", "Times of India"),
            ("thehindu.com", "The Hindu"),
            ("indianexpress.com", "Indian Express"),
            ("ndtv.com", "NDTV"),
            ("hindustantimes.com", "Hindustan Times"),
            ("economictimes.indiatimes.com", "Economic Times"),
            ("livemint.com", "Livemint"),
            ("firstpost.com", "Firstpost")
        ]
        
        results = []
        for i in range(min(num, len(news_sites))):
            domain, site_name = news_sites[i]
            result = SearchResultItem(
                url=f"https://{domain}/city/news/{query.replace(' ', '-').lower()}-articleshow/{int(time.time()) + i}.cms",
                name=f"Breaking: {query} - Latest Updates | {site_name}",
                snippet=f"Latest news updates on {query}. Stay informed with the most recent developments and expert analysis from across India.",
                host_name=domain,
                rank=i + 1,
                date=datetime.now().strftime("%Y-%m-%d"),
                favicon=f"https://{domain}/favicon.ico"
            )
            results.append(result)
        
        return results
    
    def _generate_mock_business_results(self, query: str, num: int) -> List[SearchResultItem]:
        """Generate mock business search results."""
        business_sites = [
            ("economictimes.indiatimes.com", "Economic Times"),
            ("livemint.com", "Livemint"),
            ("business-standard.com", "Business Standard"),
            ("moneycontrol.com", "Moneycontrol"),
            ("ndtvprofit.com", "NDTV Profit"),
            ("financial-express.com", "Financial Express"),
            ("businesstoday.in", "Business Today"),
            ("outlookbusiness.com", "Outlook Business")
        ]
        
        results = []
        for i in range(min(num, len(business_sites))):
            domain, site_name = business_sites[i]
            result = SearchResultItem(
                url=f"https://{domain}/industry/{query.replace(' ', '-').lower()}/article/{int(time.time()) + i}.cms",
                name=f"{query} Market Analysis | {site_name}",
                snippet=f"In-depth analysis of {query} market trends, business opportunities, and economic impact in India. Expert insights and market projections.",
                host_name=domain,
                rank=i + 1,
                date=datetime.now().strftime("%Y-%m-%d"),
                favicon=f"https://{domain}/favicon.ico"
            )
            results.append(result)
        
        return results
    
    def _generate_related_searches(self, query: str) -> List[str]:
        """Generate related search suggestions."""
        related_terms = [
            f"{query} in India",
            f"latest {query} news",
            f"{query} guide",
            f"how to {query}",
            f"{query} benefits",
            f"{query} examples",
            f"{query} tips",
            f"{query} tutorial"
        ]
        
        return related_terms[:5]
    
    def search_news(self, query: str, num: int = 10, region: str = "in") -> WebSearchResponse:
        """Search for news articles."""
        request = WebSearchRequest(
            query=query,
            num=num,
            region=region,
            indian_focus=True,
            search_type="news"
        )
        return self.search(request)
    
    def search_business(self, query: str, num: int = 10, region: str = "in") -> WebSearchResponse:
        """Search for business information."""
        request = WebSearchRequest(
            query=query,
            num=num,
            region=region,
            indian_focus=True,
            search_type="business"
        )
        return self.search(request)
    
    def search_government(self, query: str, num: int = 10) -> WebSearchResponse:
        """Search for government information."""
        request = WebSearchRequest(
            query=query,
            num=num,
            region="in",
            indian_focus=True,
            search_type="government",
            include_sites=["gov.in", "nic.in"]
        )
        return self.search(request)
    
    def search_education(self, query: str, num: int = 10, region: str = "in") -> WebSearchResponse:
        """Search for educational content."""
        request = WebSearchRequest(
            query=query,
            num=num,
            region=region,
            indian_focus=True,
            search_type="education"
        )
        return self.search(request)


# Convenience functions
def create_web_search_engine(api_key: Optional[str] = None, base_url: Optional[str] = None) -> WebSearchEngine:
    """Create a web search engine instance."""
    return WebSearchEngine(api_key, base_url)


def web_search(
    query: str,
    num: int = 10,
    region: str = "in",
    indian_focus: bool = True,
    search_type: str = "general",
    api_key: Optional[str] = None,
    **kwargs
) -> WebSearchResponse:
    """Perform web search with convenience function."""
    engine = create_web_search_engine(api_key)
    request = WebSearchRequest(
        query=query,
        num=num,
        region=region,
        indian_focus=indian_focus,
        search_type=search_type,
        **kwargs
    )
    return engine.search(request)


def search_news(query: str, num: int = 10, region: str = "in", api_key: Optional[str] = None) -> WebSearchResponse:
    """Search news articles."""
    engine = create_web_search_engine(api_key)
    return engine.search_news(query, num, region)


def search_business(query: str, num: int = 10, region: str = "in", api_key: Optional[str] = None) -> WebSearchResponse:
    """Search business information."""
    engine = create_web_search_engine(api_key)
    return engine.search_business(query, num, region)