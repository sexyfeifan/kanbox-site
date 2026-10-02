#!/usr/bin/env python3
"""Build a portable static site; Pages metadata supplies the canonical origin."""
import argparse
from html import escape
from pathlib import Path
import shutil
from urllib.parse import urlsplit
ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='https://sexyfeifan.github.io/kanbox-site')
args = parser.parse_args()
base = args.base_url.rstrip('/')
url = urlsplit(base)
if url.scheme not in ('http', 'https') or not url.netloc or url.query or url.fragment:
    parser.error('--base-url must be an absolute HTTP(S) site URL without query or fragment')
output = ROOT / '_site'
if output.exists(): shutil.rmtree(output)
shutil.copytree(ROOT / 'site', output)
for path in output.glob('*.html'):
    path.write_text(path.read_text(encoding='utf-8').replace('{{SITE_URL}}', escape(base, quote=True)), encoding='utf-8')
(output / '.nojekyll').write_text('')
(output / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: ' + base + '/sitemap.xml\n')
(output / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>' + escape(base + route) + '</loc></url>' for route in ('/', '/privacy.html', '/pricing.html')) + '</urlset>\n')
print('Built', output, 'for', base)
