#!/bin/bash

# Script to apply macOS Big Sur squircle shape to Queen Code icon
# Requires ImageMagick: brew install imagemagick

echo "🎨 Applying macOS squircle shape to Queen Code icon..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is required but not installed."
    echo "   Install it with: brew install imagemagick"
    exit 1
fi

# Paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ICONS_DIR="$PROJECT_ROOT/src-tauri/icons"
ORIGINAL_ICON="$ICONS_DIR/icon.png"
BACKUP_ICON="$ICONS_DIR/icon.original.png"

# Backup original if not already done
if [ ! -f "$BACKUP_ICON" ]; then
    echo "📦 Backing up original icon..."
    cp "$ORIGINAL_ICON" "$BACKUP_ICON"
fi

# Function to create squircle mask with continuous curve
create_squircle_mask() {
    local size=$1
    local output=$2
    local corner_radius=$3

    # Create a squircle mask using rounded rectangle
    # The corner radius is ~18% of the icon size for Big Sur style
    convert -size "${size}x${size}" xc:none \
        -fill white \
        -draw "roundrectangle 0,0 $((size-1)),$((size-1)) ${corner_radius},${corner_radius}" \
        "$output"
}

# Function to apply squircle to icon
apply_squircle() {
    local input=$1
    local output=$2
    local size=$3
    local corner_radius=$((size * 18 / 100))  # 18% radius for squircle effect

    # Create temporary mask
    MASK_FILE="/tmp/mask_${size}.png"
    create_squircle_mask "$size" "$MASK_FILE" "$corner_radius"

    # Resize input to target size and apply mask
    convert "$input" \
        -resize "${size}x${size}" \
        -background none \
        -gravity center \
        -extent "${size}x${size}" \
        "$MASK_FILE" \
        -compose DstIn \
        -composite \
        "$output"

    # Clean up
    rm -f "$MASK_FILE"

    echo "✅ Generated: $output (${size}x${size})"
}

echo "🔧 Processing icons..."

# Generate main icon with squircle
apply_squircle "$BACKUP_ICON" "$ICONS_DIR/icon.png" 1024

# Generate other sizes
apply_squircle "$BACKUP_ICON" "$ICONS_DIR/128x128@2x.png" 256
apply_squircle "$BACKUP_ICON" "$ICONS_DIR/128x128.png" 128
apply_squircle "$BACKUP_ICON" "$ICONS_DIR/32x32.png" 32
apply_squircle "$BACKUP_ICON" "$ICONS_DIR/64x64.png" 64

echo ""
echo "🎉 Icons updated with macOS squircle shape!"
echo ""
echo "Next steps:"
echo "1. Run: cd $PROJECT_ROOT && bun tauri icon src-tauri/icons/icon.png"
echo "2. This will regenerate the .icns file with proper rounded corners"
echo "3. Rebuild the app to see the new icon in the dock"
echo ""
echo "To restore original: cp $BACKUP_ICON $ORIGINAL_ICON"