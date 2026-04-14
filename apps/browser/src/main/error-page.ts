export function getErrorPageHTML(
  type: 'dns' | 'ssl' | 'timeout' | 'connection' | 'generic',
  url: string,
  details: string
): string {
  const titles: Record<string, string> = {
    dns: 'Server Not Found',
    ssl: 'Connection Not Secure',
    timeout: 'Connection Timed Out',
    connection: 'Connection Failed',
    generic: 'Page Failed to Load'
  }

  const descriptions: Record<string, string> = {
    dns: 'Portal OS cannot find the server at this address. Check the URL or your internet connection.',
    ssl: 'The connection to this site is not secure. The certificate may be invalid or expired.',
    timeout: 'The server took too long to respond. It might be overloaded or unreachable.',
    connection: 'Portal OS could not establish a connection to the server.',
    generic: 'Something went wrong while loading this page.'
  }

  const icons: Record<string, string> = {
    dns: '⬡',
    ssl: '⚠',
    timeout: '◷',
    connection: '⊘',
    generic: '◈'
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${titles[type]} — Portal OS</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #050505;
    color: rgba(255,255,255,0.85);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  .container {
    text-align: center;
    max-width: 420px;
    padding: 40px;
  }
  .icon {
    font-size: 48px;
    opacity: 0.12;
    margin-bottom: 24px;
  }
  .title {
    font-size: 20px;
    font-weight: 300;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
  }
  .desc {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    line-height: 1.7;
    margin-bottom: 8px;
  }
  .url {
    font-size: 11px;
    color: rgba(255,255,255,0.15);
    font-family: 'SF Mono', 'Fira Code', monospace;
    word-break: break-all;
    margin-bottom: 28px;
  }
  .detail {
    font-size: 10px;
    color: rgba(255,255,255,0.12);
    font-family: 'SF Mono', 'Fira Code', monospace;
    margin-bottom: 28px;
  }
  .retry {
    display: inline-block;
    padding: 10px 28px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    letter-spacing: 0.04em;
  }
  .retry:hover {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.85);
    border-color: rgba(255,255,255,0.2);
  }
  .brand {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.06);
    font-family: 'SF Mono', monospace;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="icon">${icons[type]}</div>
    <div class="title">${titles[type]}</div>
    <div class="desc">${descriptions[type]}</div>
    <div class="url">${url}</div>
    ${details ? `<div class="detail">${details}</div>` : ''}
    <a class="retry" href="${url}" onclick="location.reload(); return false;">↺ Retry</a>
  </div>
  <div class="brand">PORTAL OS</div>
</body>
</html>`
}

export function getErrorType(
  errorCode: number
): 'dns' | 'ssl' | 'timeout' | 'connection' | 'generic' {
  if (errorCode === -105 || errorCode === -137 || errorCode === -118) return 'dns'
  if (errorCode === -200 || errorCode === -201 || errorCode === -202 || errorCode === -203 || errorCode === -204) return 'ssl'
  if (errorCode === -7 || errorCode === -8) return 'timeout'
  if (errorCode === -2 || errorCode === -6 || errorCode === -100 || errorCode === -101 || errorCode === -102) return 'connection'
  return 'generic'
}
