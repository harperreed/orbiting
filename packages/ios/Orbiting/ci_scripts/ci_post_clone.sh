#!/bin/sh

# ABOUTME: Xcode Cloud post-clone script for monorepo setup
# ABOUTME: Runs after the repository is cloned to prepare the build environment

set -e

echo "=========================================="
echo "📦 Xcode Cloud Post-Clone Script"
echo "=========================================="

# Print current directory for debugging
echo "Current directory: $(pwd)"
echo "Git root: $(git rev-parse --show-toplevel)"

# Verify we're in the right location
cd "$(git rev-parse --show-toplevel)/packages/ios/Orbiting"
echo "Changed to project directory: $(pwd)"

# List files to verify structure
echo "Project structure:"
ls -la

# If you had any dependencies to install, you'd do it here
# For example: bundle install, pod install, etc.

echo "=========================================="
echo "✅ Post-clone setup complete"
echo "=========================================="
