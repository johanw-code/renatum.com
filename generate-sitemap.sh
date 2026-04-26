#!/bin/bash
# Run from /tmp/renatum/ to regenerate sitemap.xml
# Usage: bash generate-sitemap.sh
# After running: docker cp sitemap.xml <container>:/usr/share/nginx/html/sitemap.xml

DOMAIN="https://renatum.com"
BASE="/sv"
DATE=$(date +%Y-%m-%d)
OUT="sitemap.xml"

# Priority map — add new pages here
declare -A PRIORITY
PRIORITY["index"]="1.0"
PRIORITY["priser"]="0.9"
PRIORITY["klimatkompensera"]="0.9"
PRIORITY["om-oss"]="0.8"
PRIORITY["case"]="0.8"
PRIORITY["co2"]="0.8"
PRIORITY["faq"]="0.7"
PRIORITY["prisvardhet"]="0.7"
PRIORITY["avkastning"]="0.7"
PRIORITY["vardering"]="0.7"
PRIORITY["bonitet"]="0.6"
PRIORITY["markagare"]="0.6"
PRIORITY["integritetspolicy"]="0.3"

declare -A CHANGEFREQ
CHANGEFREQ["index"]="weekly"
CHANGEFREQ["integritetspolicy"]="yearly"

{
echo '<?xml version="1.0" encoding="UTF-8"?>'
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

for f in sv/*.html; do
  page=$(basename "${f%.html}")

  # Skip any draft/template files
  [[ "$page" == _* ]] && continue

  if [ "$page" = "index" ]; then
    loc="${DOMAIN}${BASE}/"
  else
    loc="${DOMAIN}${BASE}/${page}"
  fi

  prio="${PRIORITY[$page]:-0.6}"
  freq="${CHANGEFREQ[$page]:-monthly}"

  echo "  <url>"
  echo "    <loc>${loc}</loc>"
  echo "    <lastmod>${DATE}</lastmod>"
  echo "    <changefreq>${freq}</changefreq>"
  echo "    <priority>${prio}</priority>"
  echo "  </url>"
done

echo '</urlset>'
} > "$OUT"

COUNT=$(grep -c '<url>' "$OUT")
echo "✓ ${OUT} regenerated — ${COUNT} URLs, lastmod ${DATE}"
echo ""
echo "Deploy with:"
echo "  docker cp sitemap.xml <container>:/usr/share/nginx/html/sitemap.xml"
