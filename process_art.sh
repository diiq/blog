#!/bin/bash

# Script to process art images: generate thumbnails, move originals, and create markdown files

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
ART_DIR="_art"
IMAGES_DIR="assets/images/art"
THUMBS_DIR="assets/images/art/thumbs"

# Check for ImageMagick
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed.${NC}"
    echo "Please install ImageMagick: brew install imagemagick"
    exit 1
fi

# Create thumbs directory if it doesn't exist
if [ ! -d "$THUMBS_DIR" ]; then
    echo -e "${YELLOW}Creating thumbs directory: $THUMBS_DIR${NC}"
    mkdir -p "$THUMBS_DIR"
fi

# Get current date in ISO format
CURRENT_DATE=$(date +%Y-%m-%d)

# Counter for processed images
PROCESSED=0

# Find and process all image files in _art directory
shopt -s nullglob  # Return empty array if no matches
for img in "$ART_DIR"/*.{jpg,jpeg,JPG,JPEG,png,PNG,gif,GIF}; do
    # Check if file exists (nullglob protection)
    [ -f "$img" ] || continue

    # Extract filename with extension
    filename=$(basename "$img")
    # Extract filename without extension for markdown file
    name_no_ext="${filename%.*}"

    echo -e "${GREEN}Processing: $filename${NC}"

    # Generate thumbnail (300px on shortest side)
    echo "  - Generating thumbnail..."
    magick "$img" -thumbnail 300x300^ "$THUMBS_DIR/$filename"

    # Move original image to assets/images/art
    echo "  - Moving original to $IMAGES_DIR..."
    mv "$img" "$IMAGES_DIR/$filename"

    # Create markdown file
    markdown_file="$ART_DIR/${name_no_ext}.markdown"

    # Check if markdown file already exists
    if [ -f "$markdown_file" ]; then
        # Check if thumb line already exists
        if grep -q "^  thumb:" "$markdown_file"; then
            echo -e "  - Markdown file already has thumb field, skipping update"
        else
            echo "  - Adding thumb field to existing markdown file..."
            # Insert thumb line after the images line, maintaining indentation
            # Create temp file to avoid issues with in-place editing
            awk -v thumb="  thumb: thumbs/$filename" '
                /^  images:/ { print; print thumb; next }
                { print }
            ' "$markdown_file" > "${markdown_file}.tmp" && mv "${markdown_file}.tmp" "$markdown_file"
        fi
    else
        echo "  - Creating markdown file..."
        cat > "$markdown_file" << EOF
---
  layout: art
  title:  ""
  images: ["$filename"]
  thumb: thumbs/$filename
  date: $CURRENT_DATE
  notes:
---
EOF
    fi

    PROCESSED=$((PROCESSED + 1))
    echo ""
done

# Summary
if [ $PROCESSED -eq 0 ]; then
    echo -e "${YELLOW}No image files found in $ART_DIR${NC}"
    echo "Supported formats: jpg, jpeg, png, gif (case-insensitive)"
else
    echo -e "${GREEN}✓ Successfully processed $PROCESSED image(s)${NC}"
fi
