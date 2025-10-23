# Resources Directory

This directory contains visual assets and resources for the IndiGLM project.

## Files

- `indiglm-logo.svg` - Main IndiGLM logo
- `indiglm-logo-new.svg` - Alternative IndiGLM logo design

## Usage

These resources are automatically included when you install the IndiGLM package and can be accessed programmatically:

```python
import indiglm
from pathlib import Path

# Get path to resources
resource_path = Path(indiglm.__file__).parent / "resources"
logo_path = resource_path / "indiglm-logo.svg"

print(f"Logo path: {logo_path}")
```

## File Formats

- **SVG**: Scalable Vector Graphics format for high-quality display at any size
- **PNG**: Raster format for web and application use (coming soon)

## Brand Guidelines

### Colors
- Primary: #FF6B35 (Orange)
- Secondary: #004E89 (Blue)
- Accent: #FFD23F (Yellow)
- Text: #2C3E50 (Dark Blue)

### Logo Usage
- Use the SVG format for digital applications
- Maintain minimum size requirements
- Don't stretch or distort the logo
- Ensure adequate contrast with background

### Typography
- Primary: Inter (Modern, clean sans-serif)
- Secondary: Noto Sans (Excellent for Indian languages)

## Adding New Resources

To add new resources to the package:

1. Place files in this directory
2. Update `package_data` in `setup.py` if needed
3. Reinstall the package: `pip install -e .`

## License

All resources in this directory are licensed under the MIT License and can be used freely in both commercial and non-commercial projects.