# STI-Launcher.ps1
# Launcher profesional para Nuevo Siglo - Soporte Técnico Interactivo

try {
    $user = whoami
    $hostName = hostname
    $status = "Identificado"
} catch {
    $user = "Acceso denegado"
    $hostName = "No disponible"
    $status = "Sin permisos"
}

$metadataContent = @"
// Archivo generado automáticamente por el lanzador
window.NS_METADATA = {
    user: '$user',
    hostname: '$hostName',
    status: '$status',
    timestamp: '$(Get-Date -Format "yyyy-MM-dd HH:mm:ss")'
};
"@

$metadataContent | Out-File -FilePath "metadata.js" -Encoding utf8

# Abrir el diagnóstico en el navegador predeterminado
Start-Process "index.html"
