#!/bin/bash

echo "Enter the GitHub repository name you want to create:"
read repo_name

echo "Enter a description for the GitHub repository:"
read repo_description

# Check if we're inside a folder (not just ~ or /)
if [ "$PWD" == "$HOME" ] || [ "$PWD" == "/" ]; then
  echo "❌ Please run this script inside a project folder, not in the home or root directory."
  read -p "Press Enter to exit..."
  exit 1
fi

# Initialize git if not already initialized
if [ ! -d .git ]; then
  git init || {
    echo "❌ Git initialization failed."
    read -p "Press Enter to exit..."
    exit 1
  }
fi

# Add all files, excluding nested git repos (like 3kstBackend/)
git add . || {
  echo "⚠️ Warning: git add failed."
  read -p "Press Enter to exit..."
  exit 1
}

# Commit files
git commit -m "Initial commit" || {
  echo "⚠️ Nothing to commit or commit failed."
  read -p "Press Enter to exit..."
  exit 1
}

# Create GitHub repo and link remote
gh repo create "$repo_name" \
  --public \
  --description "$repo_description" \
  --source=. \
  --remote=origin || {
    echo "❌ Failed to create GitHub repo."
    read -p "Press Enter to exit..."
    exit 1
}

sleep 2

# Push main/master branch
git push -u origin master || {
  echo "❌ Failed to push 'master' branch."
  read -p "Press Enter to exit..."
  exit 1
}

# Create and push 'dev' branch
git checkout -b dev
git push -u origin dev || {
  echo "❌ Failed to push 'dev' branch."
  read -p "Press Enter to exit..."
  exit 1
}

# Create and push 'tijani' branch
git checkout -b tijani
git push -u origin tijani || {
  echo "❌ Failed to push 'tijani' branch."
  read -p "Press Enter to exit..."
  exit 1
}

echo "✅ Repo '$repo_name' created successfully and branches 'master', 'dev' & 'tijani' pushed."

read -p "Press Enter to exit..."
