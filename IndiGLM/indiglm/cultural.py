"""
IndiGLM Cultural Module
======================

Cultural context understanding and awareness for Indian traditions,
festivals, customs, and values.
"""

from enum import Enum
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta


class Region(Enum):
    """Indian regions for cultural context."""
    NORTH = "north"
    SOUTH = "south"
    EAST = "east"
    WEST = "west"
    NORTHEAST = "northeast"
    CENTRAL = "central"


class Festival(Enum):
    """Major Indian festivals."""
    DIWALI = "diwali"
    HOLI = "holi"
    EID = "eid"
    CHRISTMAS = "christmas"
    PONGAL = "pongal"
    ONAM = "onam"
    DUSSEHRA = "dussehra"
    NAVRATRI = "navratri"
    GANESH_CHATURTHI = "ganesh_chaturthi"
    RAKSHA_BANDHAN = "raksha_bandhan"
    JANMASHTAMI = "janmashtami"
    MAKAR_SANKRANTI = "makar_sankranti"
    UGADI = "ugadi"
    BIHU = "bihu"
    GUDI_PADWA = "gudi_padwa"
    BAISAKHI = "baisakhi"
    CHRISTMAS = "christmas"
    EASTER = "easter"


class Custom(Enum):
    """Indian customs and traditions."""
    NAMASTE = "namaste"
    PRANAM = "pranam"
    TOUCHING_FEET = "touching_feet"
    BINDI = "bindi"
    MEHENDI = "mehendi"
    TILAK = "tilak"
    ARATI = "arati"
    PRASAD = "prasadam"
    GARLAND = "garland"
    KOLAM = "kolam"
    RANGOLI = "rangoli"


class Value(Enum):
    """Indian cultural values and philosophies."""
    ATITHI_DEVO_BHAVA = "atithi_devo_bhava"  # Guest is God
    VASUDHAIVA_KUTUMBAKAM = "vasudhaiva_kutumbakam"  # World is one family
    AHIMSA = "ahimsa"  # Non-violence
    SATYA = "satya"  # Truth
    DHARMA = "dharma"  # Duty/righteousness
    KARMA = "karma"  # Action and consequence
    MOKSHA = "moksha"  # Liberation
    SEVA = "seva"  # Selfless service
    SHRADDHA = "shraddha"  # Faith/reverence
    SANTOSHA = "santosha"  # Contentment


@dataclass
class FestivalInfo:
    """Information about Indian festivals."""
    name: str
    native_name: str
    religion: str
    month: str
    duration: int
    significance: str
    customs: List[str]
    regional_names: Dict[str, str]
    foods: List[str]
    
    def to_dict(self):
        return asdict(self)


@dataclass
class CustomInfo:
    """Information about Indian customs."""
    name: str
    description: str
    regions: List[str]
    occasions: List[str]
    significance: str
    how_to_perform: str
    
    def to_dict(self):
        return asdict(self)


@dataclass
class ValueInfo:
    """Information about Indian cultural values."""
    name: str
    sanskrit_name: str
    meaning: str
    importance: str
    modern_relevance: str
    examples: List[str]
    
    def to_dict(self):
        return asdict(self)


class CulturalContext:
    """
    Cultural context configuration for IndiGLM interactions.
    """
    
    def __init__(
        self,
        region: Region = Region.NORTH,
        festival_aware: bool = True,
        traditional_values: bool = True,
        regional_customs: bool = True,
        modern_context: bool = True,
        current_festivals: Optional[List[Festival]] = None,
        current_season: Optional[str] = None
    ):
        """
        Initialize cultural context.
        
        Args:
            region: Indian region for context
            festival_aware: Enable festival awareness
            traditional_values: Enable traditional values
            regional_customs: Enable regional customs
            modern_context: Enable modern context
            current_festivals: List of current festivals
            current_season: Current season
        """
        self.region = region
        self.festival_aware = festival_aware
        self.traditional_values = traditional_values
        self.regional_customs = regional_customs
        self.modern_context = modern_context
        self.current_festivals = current_festivals or []
        self.current_season = current_season or self._get_current_season()
        
        # Initialize cultural databases
        self.festival_database = self._initialize_festival_database()
        self.custom_database = self._initialize_custom_database()
        self.value_database = self._initialize_value_database()
    
    def _get_current_season(self) -> str:
        """Get current season based on month."""
        month = datetime.now().month
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        else:
            return "monsoon"
    
    def _initialize_festival_database(self) -> Dict[Festival, FestivalInfo]:
        """Initialize festival information database."""
        return {
            Festival.DIWALI: FestivalInfo(
                name="Diwali",
                native_name="दीपावली",
                religion="Hinduism",
                month="October-November",
                duration=5,
                significance="Festival of lights, victory of good over evil",
                customs=["Lighting diyas", "Bursting crackers", "Worship of Lakshmi", "Exchange of gifts"],
                regional_names={
                    "south": "Deepavali",
                    "north": "Diwali",
                    "east": "Deepabali",
                    "west": "Diwali"
                },
                foods=["Laddu", "Jalebi", "Kaju katli", "Samosa"]
            ),
            Festival.HOLI: FestivalInfo(
                name="Holi",
                native_name="होली",
                religion="Hinduism",
                month="March",
                duration=2,
                significance="Festival of colors, arrival of spring",
                customs=["Playing with colors", "Holika bonfire", "Drinking bhang"],
                regional_names={
                    "north": "Holi",
                    "south": "Kaman Pandigai",
                    "east": "Dol Jatra",
                    "west": "Holi"
                },
                foods=["Gujiya", "Thandai", "Puran poli", "Malpua"]
            ),
            Festival.EID: FestivalInfo(
                name="Eid",
                native_name="ईद",
                religion="Islam",
                month="Varies",
                duration=1,
                significance="Festival of breaking the fast",
                customs=["Prayer at mosque", "Wearing new clothes", "Giving Zakat"],
                regional_names={
                    "north": "Eid-ul-Fitr",
                    "south": "Eid",
                    "east": "Eid",
                    "west": "Eid"
                },
                foods=["Biryani", "Sheer khurma", "Seviyan", "Kebabs"]
            ),
            Festival.PONGAL: FestivalInfo(
                name="Pongal",
                native_name="பொங்கல்",
                religion="Hinduism",
                month="January",
                duration=4,
                significance="Harvest festival, thanksgiving to nature",
                customs=["Cooking Pongal", "Decorating cattle", "Kolam designs"],
                regional_names={
                    "south": "Pongal",
                    "north": "Makar Sankranti",
                    "east": "Bihu",
                    "west": "Uttarayan"
                },
                foods=["Pongal", "Sakkarai Pongal", "Ven Pongal", "Coconut chutney"]
            ),
            Festival.CHRISTMAS: FestivalInfo(
                name="Christmas",
                native_name="क्रिसमस",
                religion="Christianity",
                month="December",
                duration=1,
                significance="Birth of Jesus Christ",
                customs=["Christmas tree", "Gift giving", "Midnight mass"],
                regional_names={
                    "north": "Christmas",
                    "south": "Christmas",
                    "east": "Bada Din",
                    "west": "Christmas"
                },
                foods=["Cake", "Kulkuls", "Bebinca", "Christmas pudding"]
            )
        }
    
    def _initialize_custom_database(self) -> Dict[Custom, CustomInfo]:
        """Initialize custom information database."""
        return {
            Custom.NAMASTE: CustomInfo(
                name="Namaste",
                description="Traditional Indian greeting with folded hands",
                regions=["All India"],
                occasions=["Meetings", "Greetings", "Respect"],
                significance="Shows respect and acknowledges the divine in others",
                how_to_perform="Join palms together in front of chest, slight bow, say 'Namaste'"
            ),
            Custom.TOUCHING_FEET: CustomInfo(
                name="Touching Feet",
                description="Touching elders' feet as a sign of respect",
                regions=["North", "West", "Central"],
                occasions=["Meeting elders", "Seeking blessings", "Festivals"],
                significance="Shows respect and seeks blessings from elders",
                how_to_perform="Bend down, touch the feet of the elder, they bless you by placing hand on head"
            ),
            Custom.BINDI: CustomInfo(
                name="Bindi",
                description="Decorative dot worn on forehead by women",
                regions=["All India"],
                occasions=["Daily wear", "Festivals", "Religious ceremonies"],
                significance="Represents the third eye, marital status, and cultural identity",
                how_to_perform="Apply red or colored dot between eyebrows using finger or sticker"
            ),
            Custom.RANGOLI: CustomInfo(
                name="Rangoli",
                description="Colorful patterns drawn at entrance of homes",
                regions=["West", "South", "Central"],
                occasions=["Diwali", "Pongal", "Onam", "Daily mornings"],
                significance="Welcome to guests, brings good luck, artistic expression",
                how_to_perform="Draw patterns using colored powders, rice flour, or flowers"
            )
        }
    
    def _initialize_value_database(self) -> Dict[Value, ValueInfo]:
        """Initialize value information database."""
        return {
            Value.ATITHI_DEVO_BHAVA: ValueInfo(
                name="Atithi Devo Bhava",
                sanskrit_name="अतिथि देवो भवः",
                meaning="The guest is equivalent to God",
                importance="Foundation of Indian hospitality",
                modern_relevance="Important for tourism, business, and social relationships",
                examples=["Offering water to guests", "Serving best food to guests", "Respecting guest preferences"]
            ),
            Value.VASUDHAIVA_KUTUMBAKAM: ValueInfo(
                name="Vasudhaiva Kutumbakam",
                sanskrit_name="वसुधैव कुटुम्बकम्",
                meaning="The world is one family",
                importance="Promotes universal brotherhood and peace",
                modern_relevance="Global cooperation, environmental protection, unity in diversity",
                examples=["Helping neighbors", "Respecting all religions", "Environmental conservation"]
            ),
            Value.AHIMSA: ValueInfo(
                name="Ahimsa",
                sanskrit_name="अहिंसा",
                meaning="Non-violence",
                importance="Core principle of Indian philosophy",
                modern_relevance="Peace movements, conflict resolution, animal rights",
                examples=["Vegetarianism", "Peaceful protests", "Kindness to all living beings"]
            )
        }
    
    def get_festival_info(self, festival: Festival) -> Optional[FestivalInfo]:
        """Get information about a specific festival."""
        return self.festival_database.get(festival)
    
    def get_custom_info(self, custom: Custom) -> Optional[CustomInfo]:
        """Get information about a specific custom."""
        return self.custom_database.get(custom)
    
    def get_value_info(self, value: Value) -> Optional[ValueInfo]:
        """Get information about a specific value."""
        return self.value_database.get(value)
    
    def get_current_festivals(self) -> List[Festival]:
        """Get festivals that are currently relevant."""
        current_month = datetime.now().month
        current_festivals = []
        
        festival_months = {
            Festival.DIWALI: [10, 11],
            Festival.HOLI: [3],
            Festival.EID: [4, 5, 6],  # Varies based on lunar calendar
            Festival.PONGAL: [1],
            Festival.CHRISTMAS: [12]
        }
        
        for festival, months in festival_months.items():
            if current_month in months:
                current_festivals.append(festival)
        
        return current_festivals
    
    def get_regional_festivals(self) -> List[Festival]:
        """Get festivals specific to the configured region."""
        regional_festivals = {
            Region.NORTH: [Festival.DIWALI, Festival.HOLI, Festival.RAKSHA_BANDHAN],
            Region.SOUTH: [Festival.PONGAL, Festival.ONAM, Festival.UGADI],
            Region.EAST: [Festival.DURGA_POOJA, Festival.BIHU, Festival.RATHA_YATRA],
            Region.WEST: [Festival.NAVRATRI, Festival.GANESH_CHATURTHI, Festival.MAKAR_SANKRANTI],
            Region.NORTHEAST: [Festival.BIHU, Festival.WANGALA],
            Region.CENTRAL: [Festival.DIWALI, Festival.HOLI, Festival.GANESH_CHATURTHI]
        }
        
        return regional_festivals.get(self.region, [])
    
    def get_seasonal_context(self) -> Dict[str, Any]:
        """Get seasonal cultural context."""
        seasonal_info = {
            "winter": {
                "festivals": [Festival.CHRISTMAS, Festival.MAKAR_SANKRANTI],
                "activities": ["Bonfires", "Warm clothing", "Seasonal foods"],
                "foods": ["Sarson ka saag", "Makki roti", "Gajar ka halwa"]
            },
            "spring": {
                "festivals": [Festival.HOLI, Festival.UGADI, Festival.GUDI_PADWA],
                "activities": ["Flower festivals", "New year celebrations"],
                "foods": ["Puran poli", "Holi special sweets", "Seasonal fruits"]
            },
            "summer": {
                "festivals": [Festival.RATHA_YATRA, Festival.TEEJ],
                "activities": ["Water festivals", "Indoor activities"],
                "foods": ["Aamras", "Mango dishes", "Cool drinks"]
            },
            "monsoon": {
                "festivals": [Festival.RAKSHA_BANDHAN, Festival.JANMASHTAMI, Festival.GANESH_CHATURTHI],
                "activities": ["Indoor celebrations", "Kite flying"],
                "foods": ["Pakoras", "Chai", "Monsoon special dishes"]
            }
        }
        
        return seasonal_info.get(self.current_season, {})
    
    def get_greeting_context(self) -> Dict[str, str]:
        """Get appropriate greetings based on context."""
        greetings = {
            Region.NORTH: {
                "morning": "सुप्रभात (Suprabhat)",
                "afternoon": "नमस्ते (Namaste)",
                "evening": "शुभ संध्या (Shubh Sandhya)",
                "festival": "त्योहार की शुभकामनाएं (Tyohar ki shubhkamnaen)"
            },
            Region.SOUTH: {
                "morning": "காலை வணக்கம் (Kaalai vanakkam)",
                "afternoon": "வணக்கம் (Vanakkam)",
                "evening": "மாலை வணக்கம் (Maalai vanakkam)",
                "festival": "திருவிழா வாழ்த்துக்கள் (Thiruvizha vaazhthukkal)"
            },
            Region.EAST: {
                "morning": "সুপ্রভাত (Suprabhat)",
                "afternoon": "নমস্কার (Nomoskar)",
                "evening": "সুসন্ধ্যা (Susandhya)",
                "festival": "উৎসবের শুভেচ্ছা (Utsaber shubhechcha)"
            },
            Region.WEST: {
                "morning": "સુપ્રભાત (Suprabhat)",
                "afternoon": "નમસ્તે (Namaste)",
                "evening": "શુભ સાંઝ (Shubh sanj)",
                "festival": "તહેવારની શુભકામના (Tehvarni shubhkamna)"
            }
        }
        
        return greetings.get(self.region, greetings[Region.NORTH])
    
    def get_food_context(self) -> Dict[str, Any]:
        """Get regional food context."""
        food_context = {
            Region.NORTH: {
                "staple": "Wheat",
                "famous_dishes": ["Butter chicken", "Dal makhani", "Naan", "Sarson ka saag"],
                "sweets": ["Jalebi", "Laddu", "Barfi", "Peda"],
                "beverages": ["Lassi", "Chai", "Thandai"]
            },
            Region.SOUTH: {
                "staple": "Rice",
                "famous_dishes": ["Dosa", "Idli", "Sambar", "Rasam"],
                "sweets": ["Mysore pak", "Payasam", "Laddu", "Halwa"],
                "beverages": ["Filter coffee", "Buttermilk", "Coconut water"]
            },
            Region.EAST: {
                "staple": "Rice",
                "famous_dishes": ["Macher jhol", "Rosogolla", "Samosa", "Chhena poda"],
                "sweets": ["Rosogolla", "Sandesh", "Mishti doi", "Pantua"],
                "beverages": ["Chaai", "Coconut water", "Bel sherbet"]
            },
            Region.WEST: {
                "staple": "Wheat/Rice",
                "famous_dishes": ["Dhokla", "Khandvi", "Thepla", "Undhiyu"],
                "sweets": ["Basundi", "Shrikhand", "Modak", "Puran poli"],
                "beverages": ["Chaas", "Masala chai", "Solkadhi"]
            }
        }
        
        return food_context.get(self.region, food_context[Region.NORTH])
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert cultural context to dictionary."""
        return {
            "region": self.region.value,
            "festival_aware": self.festival_aware,
            "traditional_values": self.traditional_values,
            "regional_customs": self.regional_customs,
            "modern_context": self.modern_context,
            "current_festivals": [f.value for f in self.current_festivals],
            "current_season": self.current_season,
            "current_relevant_festivals": [f.value for f in self.get_current_festivals()],
            "regional_festivals": [f.value for f in self.get_regional_festivals()],
            "seasonal_context": self.get_seasonal_context(),
            "greeting_context": self.get_greeting_context(),
            "food_context": self.get_food_context()
        }
    
    def update_context(self, **kwargs):
        """Update cultural context parameters."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        
        # Update derived values
        if 'current_season' in kwargs:
            self.current_season = kwargs['current_season']
        elif 'current_festivals' in kwargs:
            self.current_festivals = kwargs['current_festivals']