#!/bin/bash

echo "🇮🇳 IndiGLM Files Access Script"
echo "================================"

echo ""
echo "📁 Main IndiGLM Files:"
echo "1. Core Library: src/lib/indiglm.ts"
echo "2. Chat Component: src/components/indiglm/IndiGLMChat.tsx"
echo "3. Logo Files: public/indiglm-logo.svg, public/indiglm-logo-new.svg"

echo ""
echo "🔍 File Contents:"
echo "------------------"

echo ""
echo "📄 Core Library (src/lib/indiglm.ts):"
echo "====================================="
head -20 src/lib/indiglm.ts

echo ""
echo "📄 Chat Component (src/components/indiglm/IndiGLMChat.tsx):"
echo "========================================================"
head -20 src/components/indiglm/IndiGLMChat.tsx

echo ""
echo "📂 Directory Structure:"
echo "====================="
find . -name "*indiglm*" -o -name "*IndiGLM*" | sort

echo ""
echo "💡 To view full file contents, use:"
echo "cat src/lib/indiglm.ts"
echo "cat src/components/indiglm/IndiGLMChat.tsx"