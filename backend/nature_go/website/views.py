import os
from django.views.static import serve


def serve_pwa(request, path=''):
  pwa_root = '/var/www/nature-go/pwa'

  if not path or path.endswith('/'):
    path = path.rstrip('/') + '/index.html' if path else 'index.html'

  full_path = os.path.join(pwa_root, path)

  if os.path.exists(full_path) and os.path.isfile(full_path):
    return serve(request, path, document_root=pwa_root)

  if '.' not in os.path.basename(path):
    html_path = path + '.html'
    if os.path.exists(os.path.join(pwa_root, html_path)):
      return serve(request, html_path, document_root=pwa_root)

  return serve(request, 'index.html', document_root=pwa_root)
