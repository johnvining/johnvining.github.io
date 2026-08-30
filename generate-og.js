const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const matter = require('gray-matter');

const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#d1fff8';
const TEXT_COLOR = '#032e2c';
const SITE_COLOR = '#032e2c';

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Rough character-count-based line wrapping
function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

function buildSvg(title, subtitle) {
  const titleFontSize = 52;
  const subtitleFontSize = 28;
  const siteFontSize = 20;
  const lineHeight = titleFontSize * 1.25;
  const subtitleLineHeight = subtitleFontSize * 1.35;
  const padding = 80;
  const maxTitleChars = Math.floor((WIDTH - padding * 2) / (titleFontSize * 0.55));
  const maxSubtitleChars = Math.floor((WIDTH - padding * 2) / (subtitleFontSize * 0.55));

  const titleLines = wrapText(title, maxTitleChars);
  const subtitleLines = subtitle ? wrapText(subtitle, maxSubtitleChars) : [];

  const totalTitleHeight = titleLines.length * lineHeight;
  const totalSubtitleHeight = subtitleLines.length * subtitleLineHeight;
  const gap = subtitle ? 32 : 0;
  const totalTextHeight = totalTitleHeight + gap + totalSubtitleHeight;
  const startY = (HEIGHT - totalTextHeight) / 2;

  const titleElements = titleLines.map((line, i) => {
    const y = startY + i * lineHeight + titleFontSize;
    return `<text x="${WIDTH / 2}" y="${y}" text-anchor="middle" font-family="'Courier New', Courier, monospace" font-size="${titleFontSize}" fill="${escapeXml(TEXT_COLOR)}">${escapeXml(line)}</text>`;
  }).join('\n    ');

  const subtitleElements = subtitleLines.map((line, i) => {
    const y = startY + totalTitleHeight + gap + i * subtitleLineHeight + subtitleFontSize;
    return `<text x="${WIDTH / 2}" y="${y}" text-anchor="middle" font-family="'Courier New', Courier, monospace" font-size="${subtitleFontSize}" fill="${escapeXml(TEXT_COLOR)}" opacity="0.7">${escapeXml(line)}</text>`;
  }).join('\n    ');

  const siteY = HEIGHT - 36;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  ${titleElements}
  ${subtitleElements}
  <text x="${WIDTH / 2}" y="${siteY}" text-anchor="middle" font-family="'Courier New', Courier, monospace" font-size="${siteFontSize}" fill="${escapeXml(SITE_COLOR)}" opacity="0.5">jvining.com</text>
</svg>`;
}

async function generateImage(slug, title, subtitle, outDir) {
  const svg = buildSvg(title, subtitle);
  const outPath = path.join(outDir, `${slug}.png`);
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`  ${slug}.png`);
}

// Pull the book titles out of a reading entry's "### Author, *Title*." headings,
// dropping any subtitle after a colon to match the index page's book-titles list,
// e.g. "Reading: June, 2025" -> "Essentialism, The House of Morgan, Tinker, Tailor, Soldier, Spy"
function extractBookTitles(content) {
  const titles = [];
  const headingRe = /^#{2,6}\s+.*$/gm;
  let match;
  while ((match = headingRe.exec(content)) !== null) {
    const heading = match[0];
    const italic = heading.match(/\*([^*]+)\*/);
    if (italic) titles.push(italic[1].split(':')[0].trim());
  }
  return titles.join(', ');
}

async function processDir(srcDir, outDir, { booksAsSubtitle = false } = {}) {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(srcDir, file), 'utf8');
    const { data, content } = matter(raw);
    if (!data.title) continue;
    const slug = path.basename(file, '.md');
    const subtitle = data.subtitle || (booksAsSubtitle ? extractBookTitles(content) : null) || null;
    await generateImage(slug, data.title, subtitle, outDir);
  }
}

async function main() {
  const outDir = path.join(__dirname, 'docs', 'og');
  fs.mkdirSync(outDir, { recursive: true });

  console.log('Generating OG images...');
  await processDir(path.join(__dirname, '_notes'), outDir);
  await processDir(path.join(__dirname, '_reading'), outDir, { booksAsSubtitle: true });
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
