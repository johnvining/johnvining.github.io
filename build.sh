#!/bin/bash
set -e

env -i \
  HOME="$HOME" \
  PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/bin:/usr/bin:/bin" \
  /opt/homebrew/opt/ruby/bin/bundle exec jekyll build

# Copy built files to canonical paths so git diff shows changes inline
cp docs/index.html index.html
cp docs/projects.html projects.html
cp docs/contact.html contact.html
cp docs/feed.xml feed.xml

for f in docs/notes/*.html; do
  [ -f "$f" ] && cp "$f" "notes/$(basename "$f")"
done

for f in docs/reading/*.html; do
  [ -f "$f" ] && cp "$f" "reading/$(basename "$f")"
done

echo "Built and copied to notes/, reading/, index.html, feed.xml"
