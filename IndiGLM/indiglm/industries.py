"""
IndiGLM Industries Module
========================

Industry-specific applications and configurations for various Indian sectors.
"""

from enum import Enum
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from decimal import Decimal


class IndustryType(Enum):
    """Supported industry types for IndiGLM."""
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    AGRICULTURE = "agriculture"
    FINANCE = "finance"
    ECOMMERCE = "ecommerce"
    GOVERNANCE = "governance"
    LEGAL = "legal"
    TOURISM = "tourism"


class HealthcareSpecialty(Enum):
    """Healthcare specialties and departments."""
    GENERAL_MEDICINE = "general_medicine"
    PEDIATRICS = "pediatrics"
    CARDIOLOGY = "cardiology"
    ORTHOPEDICS = "orthopedics"
    GYNECOLOGY = "gynecology"
    DERMATOLOGY = "dermatology"
    PSYCHIATRY = "psychiatry"
    AYURVEDA = "ayurveda"
    HOMEOPATHY = "homeopathy"
    DENTISTRY = "dentistry"


class EducationLevel(Enum):
    """Education levels and systems."""
    PRIMARY = "primary"
    SECONDARY = "secondary"
    HIGHER_SECONDARY = "higher_secondary"
    UNDERGRADUATE = "undergraduate"
    POSTGRADUATE = "postgraduate"
    DOCTORAL = "doctoral"
    VOCATIONAL = "vocational"


class CropType(Enum):
    """Major crop types in Indian agriculture."""
    CEREALS = "cereals"
    PULSES = "pulses"
    OILSEEDS = "oilseeds"
    FRUITS = "fruits"
    VEGETABLES = "vegetables"
    SPICES = "spices"
    COMMERCIAL = "commercial"
    MEDICINAL = "medicinal"


class FinancialService(Enum):
    """Financial services and products."""
    BANKING = "banking"
    INSURANCE = "insurance"
    INVESTMENT = "investment"
    LOANS = "loans"
    PAYMENTS = "payments"
    TAXATION = "taxation"
    PENSION = "pension"
    MICROFINANCE = "microfinance"


class GovernanceService(Enum):
    """Government and public services."""
    CITIZEN_SERVICES = "citizen_services"
    TAX_SERVICES = "tax_services"
    LEGAL_SERVICES = "legal_services"
    EDUCATION_SERVICES = "education_services"
    HEALTH_SERVICES = "health_services"
    AGRICULTURE_SERVICES = "agriculture_services"
    SOCIAL_WELFARE = "social_welfare"
    INFRASTRUCTURE = "infrastructure"


@dataclass
class IndustryMarketData:
    """Market data for Indian industries."""
    market_size: Decimal  # In INR crores
    growth_rate: float  # Percentage
    employment: int  # Number of people employed
    key_players: List[str]
    market_trends: List[str]
    challenges: List[str]
    opportunities: List[str]
    
    def to_dict(self):
        return asdict(self)


@dataclass
class IndustryConfig:
    """Configuration for industry-specific IndiGLM interactions."""
    industry_type: IndustryType
    specialty: Optional[Enum] = None
    region_focus: Optional[str] = None
    language_preference: Optional[str] = None
    compliance_requirements: List[str] = None
    technical_terms: List[str] = None
    industry_standards: List[str] = None
    
    def __init__(self, industry_type: IndustryType, **kwargs):
        self.industry_type = industry_type
        self.specialty = kwargs.get('specialty')
        self.region_focus = kwargs.get('region_focus')
        self.language_preference = kwargs.get('language_preference')
        self.compliance_requirements = kwargs.get('compliance_requirements', [])
        self.technical_terms = kwargs.get('technical_terms', [])
        self.industry_standards = kwargs.get('industry_standards', [])
    
    def to_dict(self):
        result = {
            "industry_type": self.industry_type.value,
            "specialty": self.specialty.value if self.specialty else None,
            "region_focus": self.region_focus,
            "language_preference": self.language_preference,
            "compliance_requirements": self.compliance_requirements,
            "technical_terms": self.technical_terms,
            "industry_standards": self.industry_standards
        }
        return {k: v for k, v in result.items() if v is not None}


class IndustryManager:
    """
    Manager for industry-specific configurations and data.
    """
    
    def __init__(self):
        """Initialize industry manager with market data and configurations."""
        self.market_data = self._initialize_market_data()
        self.industry_configs = self._initialize_industry_configs()
        self.technical_databases = self._initialize_technical_databases()
    
    def _initialize_market_data(self) -> Dict[IndustryType, IndustryMarketData]:
        """Initialize market data for all industries."""
        return {
            IndustryType.HEALTHCARE: IndustryMarketData(
                market_size=Decimal("860000"),  # ₹8.6 lakh crore
                growth_rate=12.5,
                employment=4500000,
                key_players=["Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "AIIMS"],
                market_trends=["Telemedicine", "AI diagnostics", "Health insurance expansion"],
                challenges=["Rural healthcare access", "Cost of treatment", "Infrastructure gaps"],
                opportunities=["Digital health", "Medical tourism", "Ayurveda integration"]
            ),
            IndustryType.EDUCATION: IndustryMarketData(
                market_size=Decimal("320000"),  # ₹3.2 lakh crore
                growth_rate=8.3,
                employment=8500000,
                key_players=["Byju's", "Unacademy", "Vedantu", "Coursera"],
                market_trends=["EdTech", "Online learning", "Skill development"],
                challenges=["Quality disparity", "Access in rural areas", "Teacher training"],
                opportunities ["Digital classrooms", "Vocational training", "International collaborations"]
            ),
            IndustryType.AGRICULTURE: IndustryMarketData(
                market_size=Decimal("2530000"),  # ₹25.3 lakh crore
                growth_rate=3.8,
                employment=263000000,
                key_players=["ITC", "Mahindra Agri", "Nuziveedu Seeds", "Coromandel"],
                market_trends=["Organic farming", "Precision agriculture", "Agri-tech"],
                challenges ["Climate change", "Water scarcity", "Small land holdings"],
                opportunities=["Agri-startups", "Export potential", "Value addition"]
            ),
            IndustryType.FINANCE: IndustryMarketData(
                market_size=Decimal("1960000"),  # ₹19.6 lakh crore
                growth_rate=11.2,
                employment=4500000,
                key_players=["SBI", "HDFC Bank", "ICICI Bank", "Paytm"],
                market_trends=["Digital payments", "Fintech", "Financial inclusion"],
                challenges=["NPAs", "Regulatory compliance", "Cybersecurity"],
                opportunities=["UPI expansion", "Insurance penetration", "Wealth management"]
            ),
            IndustryType.ECOMMERCE: IndustryMarketData(
                market_size=Decimal("870000"),  # ₹8.7 lakh crore
                growth_rate=25.4,
                employment=12000000,
                key_players=["Amazon India", "Flipkart", "Myntra", "Nykaa"],
                market_trends ["Social commerce", "Quick commerce", "D2C brands"],
                challenges=["Logistics", "Customer retention", "Profitability"],
                opportunities=["Tier 2/3 cities", "Grocery delivery", "International expansion"]
            ),
            IndustryType.GOVERNANCE: IndustryMarketData(
                market_size=Decimal("1240000"),  # ₹12.4 lakh crore
                growth_rate=6.7,
                employment=18000000,
                key_players ["NIC", "CSC", "UIDAI", "MeitY"],
                market_trends=["Digital India", "E-governance", "Citizen services"],
                challenges=["Bureaucracy", "Digital divide", "Implementation gaps"],
                opportunities=["Smart cities", "Digital literacy", "Public-private partnerships"]
            ),
            IndustryType.LEGAL: IndustryMarketData(
                market_size=Decimal("380000"),  # ₹3.8 lakh crore
                growth_rate=9.1,
                employment=2000000,
                key_players ["Amarchand Mangaldas", "AZB & Partners", "Trilegal", "Khaitan & Co"],
                market_trends ["Legal tech", "Alternative dispute resolution", "Compliance"],
                challenges ["Case backlog", "Access to justice", "Cost of legal services"],
                opportunities ["Legal process outsourcing", "Online dispute resolution", "Corporate law"]
            ),
            IndustryType.TOURISM: IndustryMarketData(
                market_size=Decimal("1520000"),  # ₹15.2 lakh crore
                growth_rate=15.8,
                employment=87000000,
                key_players ["MakeMyTrip", "IRCTC", "OYO", "Thomas Cook"],
                market_trends ["Domestic tourism", "Medical tourism", "Adventure tourism"],
                challenges ["Infrastructure", "Seasonality", "Safety concerns"],
                opportunities ["Religious tourism", "Eco-tourism", "MICE tourism"]
            )
        }
    
    def _initialize_industry_configs(self) -> Dict[IndustryType, Dict[str, Any]]:
        """Initialize industry-specific configurations."""
        return {
            IndustryType.HEALTHCARE: {
                "specialties": [s.value for s in HealthcareSpecialty],
                "compliance": ["HIPAA", "GDPR", "Indian Medical Council"],
                "technical_terms": ["Diagnosis", "Prognosis", "Treatment", "Symptoms", "Pharmacy"],
                "standards": ["ISO 13485", "NABH", "JCI"]
            },
            IndustryType.EDUCATION: {
                "levels": [l.value for l in EducationLevel],
                "compliance": ["UGC", "AICTE", "NCERT"],
                "technical_terms": ["Curriculum", "Pedagogy", "Assessment", "Learning outcomes"],
                "standards": ["NAAC", "NBA", "ISO 21001"]
            },
            IndustryType.AGRICULTURE: {
                "crop_types": [c.value for c in CropType],
                "compliance": ["FSSAI", "APEDA", "MPEDA"],
                "technical_terms": ["Irrigation", "Fertilizer", "Pesticide", "Harvesting", "Yield"],
                "standards": ["Organic certification", "Good Agricultural Practices"]
            },
            IndustryType.FINANCE: {
                "services": [s.value for s in FinancialService],
                "compliance": ["RBI", "SEBI", "IRDA", "PMLA"],
                "technical_terms": ["Interest rate", "EMI", "SIP", "Mutual fund", "Insurance"],
                "standards": ["Basel III", "IFRS", "Indian Accounting Standards"]
            },
            IndustryType.ECOMMERCE: {
                "compliance": ["GST", "Consumer Protection Act", "FDI Policy"],
                "technical_terms": ["Inventory", "Logistics", "Payment gateway", "Customer acquisition"],
                "standards": ["PCI DSS", "ISO 27001", "Data protection"]
            },
            IndustryType.GOVERNANCE: {
                "services": [s.value for s in GovernanceService],
                "compliance": ["RTI Act", "Digital India", "e-KYC"],
                "technical_terms": ["Citizen charter", "Public service", "Governance", "Compliance"],
                "standards": ["e-Governance standards", "Digital infrastructure"]
            },
            IndustryType.LEGAL: {
                "compliance": ["Bar Council of India", "Supreme Court rules"],
                "technical_terms": ["Jurisdiction", "Litigation", "Arbitration", "Contract", "Statute"],
                "standards": ["Legal practice standards", "Ethical guidelines"]
            },
            IndustryType.TOURISM: {
                "compliance": ["Ministry of Tourism", "State tourism boards"],
                "technical_terms": ["Hospitality", "Itinerary", "Accommodation", "Transportation"],
                "standards": ["ISO 21401", "Tourism quality certification"]
            }
        }
    
    def _initialize_technical_databases(self) -> Dict[IndustryType, Dict[str, List[str]]]:
        """Initialize technical term databases for each industry."""
        return {
            IndustryType.HEALTHCARE: {
                "symptoms": ["Fever", "Cough", "Headache", "Nausea", "Fatigue"],
                "treatments": ["Medication", "Surgery", "Therapy", "Rehabilitation"],
                "departments": ["Emergency", "ICU", "OPD", "Pharmacy", "Laboratory"]
            },
            IndustryType.EDUCATION: {
                "subjects": ["Mathematics", "Science", "Languages", "Social Studies"],
                "methodologies": ["Lecture", "Discussion", "Demonstration", "Project-based"],
                "assessments": ["Examination", "Assignment", "Presentation", "Practical"]
            },
            IndustryType.AGRICULTURE: {
                "crops": ["Wheat", "Rice", "Cotton", "Sugarcane", "Pulses"],
                "practices": ["Crop rotation", "Irrigation", "Fertilization", "Pest control"],
                "equipment": ["Tractor", "Thresher", "Irrigation pump", "Harvester"]
            },
            IndustryType.FINANCE: {
                "products": ["Savings account", "Fixed deposit", "Loan", "Insurance", "Mutual fund"],
                "services": ["Fund transfer", "Bill payment", "Investment", "Tax filing"],
                "regulations": ["KYC", "AML", "Risk management", "Compliance"]
            },
            IndustryType.ECOMMERCE: {
                "operations": ["Inventory management", "Order processing", "Shipping", "Returns"],
                "marketing": ["SEO", "Social media", "Email marketing", "Content marketing"],
                "technology": ["Payment gateway", "CRM", "Analytics", "Mobile app"]
            },
            IndustryType.GOVERNANCE: {
                "services": ["Birth certificate", "Passport", "Voter ID", "PAN card"],
                "schemes": ["PMAY", "PM-KISAN", "Ayushman Bharat", "Digital India"],
                "processes": ["Application", "Verification", "Approval", "Delivery"]
            },
            IndustryType.LEGAL: {
                "areas": ["Civil law", "Criminal law", "Corporate law", "Family law"],
                "processes": ["Filing", "Hearing", "Judgment", "Appeal"],
                "documents": ["Contract", "Agreement", "Petition", "Affidavit"]
            },
            IndustryType.TOURISM: {
                "services": ["Accommodation", "Transportation", "Guided tours", "Activities"],
                "destinations": ["Historical sites", "Natural attractions", "Religious places", "Cities"],
                "operations": ["Booking", "Check-in", "Tour management", "Customer service"]
            }
        }
    
    def get_market_data(self, industry_type: IndustryType) -> Optional[IndustryMarketData]:
        """Get market data for a specific industry."""
        return self.market_data.get(industry_type)
    
    def get_industry_config(self, industry_type: IndustryType) -> Optional[Dict[str, Any]]:
        """Get configuration for a specific industry."""
        return self.industry_configs.get(industry_type)
    
    def get_technical_terms(self, industry_type: IndustryType, category: str) -> List[str]:
        """Get technical terms for a specific industry and category."""
        if industry_type in self.technical_databases:
            return self.technical_databases[industry_type].get(category, [])
        return []
    
    def create_industry_config(self, industry_type: IndustryType, **kwargs) -> IndustryConfig:
        """Create a custom industry configuration."""
        config = IndustryConfig(industry_type, **kwargs)
        
        # Add default technical terms based on industry
        if industry_type in self.technical_databases:
            default_terms = []
            for category_terms in self.technical_databases[industry_type].values():
                default_terms.extend(category_terms[:5])  # Add top 5 terms from each category
            config.technical_terms.extend(default_terms)
        
        return config
    
    def get_industry_insights(self, industry_type: IndustryType) -> Dict[str, Any]:
        """Get comprehensive insights for an industry."""
        market_data = self.get_market_data(industry_type)
        industry_config = self.get_industry_config(industry_type)
        
        if not market_data or not industry_config:
            return {}
        
        return {
            "market_overview": {
                "market_size": f"₹{market_data.market_size:,.0f} crore",
                "growth_rate": f"{market_data.growth_rate}%",
                "employment": f"{market_data.employment:,} people",
                "key_players": market_data.key_players
            },
            "trends_and_opportunities": {
                "market_trends": market_data.market_trends,
                "opportunities": market_data.opportunities,
                "challenges": market_data.challenges
            },
            "technical_aspects": {
                "specialties": industry_config.get("specialties", []),
                "compliance_requirements": industry_config.get("compliance", []),
                "industry_standards": industry_config.get("standards", [])
            },
            "regional_focus": {
                "recommended_regions": self._get_recommended_regions(industry_type),
                "language_preferences": self._get_language_preferences(industry_type)
            }
        }
    
    def _get_recommended_regions(self, industry_type: IndustryType) -> List[str]:
        """Get recommended regions for an industry."""
        regional_mapping = {
            IndustryType.HEALTHCARE: ["Delhi NCR", "Mumbai", "Bangalore", "Chennai", "Hyderabad"],
            IndustryType.EDUCATION: ["Delhi", "Bangalore", "Pune", "Chennai", "Kolkata"],
            IndustryType.AGRICULTURE: ["Punjab", "Haryana", "Uttar Pradesh", "Maharashtra", "Karnataka"],
            IndustryType.FINANCE: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
            IndustryType.ECOMMERCE: ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune"],
            IndustryType.GOVERNANCE: ["Delhi", "State capitals", "Tier 1 cities"],
            IndustryType.LEGAL: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"],
            IndustryType.TOURISM: ["Goa", "Kerala", "Rajasthan", "Himachal Pradesh", "Tamil Nadu"]
        }
        
        return regional_mapping.get(industry_type, ["Pan India"])
    
    def _get_language_preferences(self, industry_type: IndustryType) -> List[str]:
        """Get language preferences for an industry."""
        language_mapping = {
            IndustryType.HEALTHCARE: ["English", "Hindi", "Regional languages"],
            IndustryType.EDUCATION: ["English", "Hindi", "Regional languages"],
            IndustryType.AGRICULTURE: ["Regional languages", "Hindi"],
            IndustryType.FINANCE: ["English", "Hindi"],
            IndustryType.ECOMMERCE: ["English", "Hindi", "Regional languages"],
            IndustryType.GOVERNANCE: ["Hindi", "English", "Regional languages"],
            IndustryType.LEGAL: ["English", "Hindi"],
            IndustryType.TOURISM: ["English", "Hindi", "Regional languages"]
        }
        
        return language_mapping.get(industry_type, ["English", "Hindi"])
    
    def get_all_industries(self) -> List[Dict[str, str]]:
        """Get list of all supported industries with basic info."""
        return [
            {
                "code": industry.value,
                "name": industry.name.replace("_", " ").title(),
                "market_size": f"₹{data.market_size:,.0f} crore",
                "growth_rate": f"{data.growth_rate}%"
            }
            for industry, data in self.market_data.items()
        ]
    
    def get_industry_recommendations(self, user_needs: Dict[str, Any]) -> List[IndustryType]:
        """Get industry recommendations based on user needs."""
        recommendations = []
        
        # Simple recommendation logic based on keywords
        keywords_mapping = {
            "health": [IndustryType.HEALTHCARE],
            "education": [IndustryType.EDUCATION],
            "farm": [IndustryType.AGRICULTURE],
            "money": [IndustryType.FINANCE],
            "shop": [IndustryType.ECOMMERCE],
            "government": [IndustryType.GOVERNANCE],
            "law": [IndustryType.LEGAL],
            "travel": [IndustryType.TOURISM]
        }
        
        needs_text = " ".join(user_needs.values()).lower()
        
        for keyword, industries in keywords_mapping.items():
            if keyword in needs_text:
                recommendations.extend(industries)
        
        return list(set(recommendations))  # Remove duplicates