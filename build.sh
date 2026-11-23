#!/bin/bash
set -e

CLEAN_ENV="env -i HOME=\"$HOME\" PATH=\"/opt/homebrew/opt/ruby/bin:/opt/homebrew/bin:/usr/bin:/bin\""

# Offline fallback: some Homebrew gems have broken native extensions on this
# machine (json, bigdecimal, http_parser.rb) and eventmachine 1.2.7 no longer
# compiles, with no network to reinstall. Install working copies from the
# local gem cache into /tmp/jgems plus a no-op eventmachine stub (never
# touched by `jekyll build`, only by serve/watch), then build without bundler.
offline_build() {
  echo "bundler build failed, using offline fallback..."
  mkdir -p /tmp/jgems /tmp/emstub/lib
  for g in json-2.19.3 bigdecimal-4.1.1 http_parser.rb-0.8.1; do
    if [ ! -d "/tmp/jgems/gems/${g%.gem}" ] && [ ! -d "/tmp/jgems/gems/$g" ]; then
      $CLEAN_ENV /opt/homebrew/opt/ruby/bin/gem install --local --install-dir /tmp/jgems \
        "/opt/homebrew/lib/ruby/gems/4.0.0/cache/$g.gem" > /dev/null
    fi
  done
  if [ ! -d /tmp/jgems/gems/eventmachine-1.2.7 ]; then
    cat > /tmp/emstub/eventmachine.gemspec <<'EOF'
Gem::Specification.new do |s|
  s.name = 'eventmachine'
  s.version = '1.2.7'
  s.summary = 'Offline stub for jekyll build only (serve/watch unsupported)'
  s.authors = ['local']
  s.files = ['lib/eventmachine.rb']
end
EOF
    cat > /tmp/emstub/lib/eventmachine.rb <<'EOF'
module EventMachine
  VERSION = '1.2.7'
  module Deferrable; end
  class Connection; end
  def self.method_missing(name, *args)
    raise "eventmachine stub: EM.#{name} is not supported (jekyll serve/watch unavailable offline)"
  end
end
EM = EventMachine
EOF
    (cd /tmp/emstub && $CLEAN_ENV /opt/homebrew/opt/ruby/bin/gem build eventmachine.gemspec > /dev/null)
    $CLEAN_ENV /opt/homebrew/opt/ruby/bin/gem install --local --install-dir /tmp/jgems \
      /tmp/emstub/eventmachine-1.2.7.gem > /dev/null
  fi
  $CLEAN_ENV GEM_HOME=/tmp/jgems GEM_PATH=/tmp/jgems:/opt/homebrew/lib/ruby/gems/4.0.0 \
    /opt/homebrew/opt/ruby/bin/ruby /opt/homebrew/lib/ruby/gems/4.0.0/bin/jekyll build
}

if ! $CLEAN_ENV /opt/homebrew/opt/ruby/bin/bundle exec jekyll build; then
  offline_build
fi

node generate-og.js

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

mkdir -p og
cp docs/og/*.png og/

echo "Built and copied to notes/, reading/, index.html, feed.xml, og/"
