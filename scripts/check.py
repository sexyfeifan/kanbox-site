#!/usr/bin/env python3
"""Check publish output for missing assets, broken local links, and metadata."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys
ROOT = Path(__file__).resolve().parents[1] / '_site'
errors = []
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(); self.path=path; self.ids=set(); self.links=[]; self.h1=0; self.title=False; self.viewport=False; self.lang=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids: errors.append(f'{self.path.name}: duplicate id {a["id"]}')
            self.ids.add(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='title': self.title=True
        if tag=='html': self.lang=bool(a.get('lang'))
        if tag=='meta' and a.get('name')=='viewport': self.viewport=True
        if tag=='img' and not a.get('alt'): errors.append(f'{self.path.name}: image without alt')
        if tag=='a' and a.get('target')=='_blank' and 'noopener' not in a.get('rel',''): errors.append(f'{self.path.name}: new-tab link without noopener')
        for attribute in ('href','src'):
            if a.get(attribute): self.links.append(a[attribute])
if not ROOT.is_dir(): sys.exit('Build the site first: python3 scripts/build.py')
pages={}
for file in ROOT.glob('*.html'):
    content=file.read_text(encoding='utf-8')
    if '{{' in content: errors.append(f'{file.name}: unresolved template')
    page=Page(file); page.feed(content); pages[file.resolve()]=page
    if page.h1!=1 or not page.title or not page.viewport or not page.lang: errors.append(f'{file.name}: missing page semantics')
for page in pages.values():
    for link in page.links:
        url=urlsplit(link)
        if url.scheme or url.netloc: continue
        target=(page.path.parent / unquote(url.path)).resolve() if url.path else page.path.resolve()
        if target.is_dir(): target=target/'index.html'
        if not target.exists(): errors.append(f'{page.path.name}: missing {link}'); continue
        if url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids: errors.append(f'{page.path.name}: missing anchor {link}')
if errors: sys.exit('\n'.join(errors))
print(f'OK: {len(pages)} HTML pages, local links, image references, metadata and IDs verified.')
