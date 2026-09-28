# servidor.ps1 - Servidor HTTP local para o APAVAN SST
# Compatível com Windows PowerShell 5.1 e PowerShell 7+

param(
  [int]$Port = 8080
)

$root = $PSScriptRoot

$mimes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.woff' = 'font/woff'
  '.woff2'= 'font/woff2'
  '.webp' = 'image/webp'
  '.map'  = 'application/json'
}

try {
  $listener = New-Object System.Net.HttpListener
  $listener.Prefixes.Add("http://localhost:$Port/")
  $listener.Start()
} catch {
  Write-Host "ERRO: nao foi possivel iniciar o servidor na porta $Port." -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host "Tente outra porta: .\servidor.ps1 -Port 8081" -ForegroundColor Yellow
  exit 1
}

Write-Host ""
Write-Host "  APAVAN SST - Servidor local" -ForegroundColor Cyan
Write-Host "  ----------------------------------" -ForegroundColor DarkGray
Write-Host "  Pasta: $root"
Write-Host "  URL:   http://localhost:$Port/" -ForegroundColor Green
Write-Host ""
Write-Host "  Pressione Ctrl+C para parar." -ForegroundColor DarkGray
Write-Host ""

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $path = $req.Url.LocalPath
    if ($path -eq '/' -or $path -eq '') { $path = '/index.html' }

    $rel = $path.TrimStart('/')
    $rel = $rel -replace '/', '\'
    $file = Join-Path $root $rel

    if (Test-Path -LiteralPath $file -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      if ($mimes.ContainsKey($ext)) {
        $res.ContentType = $mimes[$ext]
      } else {
        $res.ContentType = 'application/octet-stream'
      }
      $res.ContentLength64 = $bytes.Length
      $res.Headers.Add('Cache-Control', 'no-cache')
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      Write-Host "  200  $path" -ForegroundColor DarkGray
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Nao encontrado: $path")
      $res.ContentType = 'text/plain; charset=utf-8'
      $res.ContentLength64 = $msg.Length
      $res.OutputStream.Write($msg, 0, $msg.Length)
      Write-Host "  404  $path" -ForegroundColor DarkYellow
    }
    $res.Close()
  } catch {
    # ignora erros de conexao interrompida
  }
}