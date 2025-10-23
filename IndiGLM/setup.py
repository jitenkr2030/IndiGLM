"""
IndiGLM Setup Configuration
==========================

Setup script for the IndiGLM Python package.
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read README file
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding='utf-8')

# Read requirements
requirements = []
with open('requirements.txt', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            # Remove version specifiers for basic requirements
            package = line.split('>=')[0].split('==')[0].split('[')[0]
            requirements.append(package)

# Core requirements (minimal)
core_requirements = [
    'requests>=2.31.0',
    'pydantic>=2.0.0',
    'typing-extensions>=4.5.0',
    'click>=8.1.0',
    'python-dotenv>=1.0.0',
    'regex>=2023.6.3'
]

setup(
    name="indiglm",
    version="1.0.0",
    author="IndiGLM Team",
    author_email="support@indiglm.ai",
    description="Indian Language Model with cultural context awareness",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/indiglm/indiglm",
    project_urls={
        "Bug Tracker": "https://github.com/indiglm/indiglm/issues",
        "Documentation": "https://docs.indiglm.ai",
        "Source Code": "https://github.com/indiglm/indiglm",
        "API Reference": "https://api.indiglm.ai"
    },
    packages=find_packages(),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Text Processing :: Linguistic",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Natural Language :: Hindi",
        "Natural Language :: Bengali",
        "Natural Language :: Telugu",
        "Natural Language :: Marathi",
        "Natural Language :: Tamil",
        "Natural Language :: Gujarati",
        "Natural Language :: Urdu",
        "Natural Language :: Kannada",
        "Natural Language :: Odia",
        "Natural Language :: Malayalam",
        "Natural Language :: Punjabi",
        "Natural Language :: Assamese",
        "Natural Language :: Maithili",
        "Natural Language :: Sanskrit",
        "Natural Language :: English"
    ],
    python_requires=">=3.8",
    install_requires=core_requirements,
    extras_require={
        "server": [
            "fastapi>=0.100.0",
            "uvicorn[standard]>=0.23.0",
            "python-multipart>=0.0.6",
            "python-jose[cryptography]>=3.3.0",
            "passlib[bcrypt]>=1.7.4",
            "slowapi>=0.1.8"
        ],
        "dev": [
            "pytest>=7.0.0",
            "pytest-asyncio>=0.21.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
            "pre-commit>=3.0.0",
            "isort>=5.12.0",
            "bandit>=1.7.0"
        ],
        "full": requirements,
        "image": ["Pillow>=9.0.0"],
        "search": [
            "beautifulsoup4>=4.12.0",
            "lxml>=4.9.0"
        ],
        "database": [
            "sqlalchemy>=2.0.0",
            "alembic>=1.11.0"
        ],
        "monitoring": [
            "structlog>=23.0.0",
            "prometheus-client>=0.17.0"
        ],
        "docs": [
            "mkdocs>=1.4.0",
            "mkdocs-material>=9.0.0"
        ]
    },
    entry_points={
        "console_scripts": [
            "indiglm=indiglm.cli:main",
            "indiglm-chat=indiglm.chat:main",
            "indiglm-serve=indiglm.serve:run_server"
        ],
    },
    include_package_data=True,
    package_data={
        "indiglm": [
            "resources/*.svg",
            "resources/*.png",
            "resources/*.json",
            "*.json"
        ]
    },
    keywords="india ai language model nlp chatbot cultural-context multilingual",
    zip_safe=False,
)