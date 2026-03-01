#!/bin/bash
# Build script for Cloudflare Pages Functions

set -e

# Clean and recreate functions build directory
rm -rf dist/functions
mkdir -p dist/functions

# Copy all function files
cp -r functions/* dist/functions/

# Find all .ts files in functions and transpile them
find dist/functions -name "*.ts" -type f | while read file; do
    # Get the directory and filename
    dir=$(dirname "$file")
    basename=$(basename "$file" .ts)
    
    # Use esbuild to transpile (keeping TS syntax but making it compatible)
    # We'll use a simple approach: just change .ts to .js for the exports
    npx esbuild "$file" --format=esm --outfile="$dir/$basename.mjs" --external:"*" --target=es2022
    
    # Remove the original .ts file
    rm "$file"
done

echo "Functions built successfully!"
