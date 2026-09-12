# 为本项目单独启用 Node.js 环境（不写入系统环境变量，仅当前终端会话有效）
# 用法：PowerShell 中执行  . .\node_env.ps1
$nodeDir   = Join-Path $PSScriptRoot '.node-v24.19.0-win-x64'
$globalDir = Join-Path $PSScriptRoot '.node-global'
$cacheDir  = Join-Path $PSScriptRoot '.npm-cache'

if (-not (Test-Path (Join-Path $nodeDir 'node.exe'))) {
    Write-Warning "未找到 $nodeDir\node.exe，请先下载免安装版 Node.js 解压到 $nodeDir"
}

# 1) PATH：把项目下的 node 与全局 bin 放到最前（仅本会话）
$env:PATH = "$nodeDir;$globalDir;" + $env:PATH

# 2) npm 全局模块目录：装到项目下，不污染系统
$env:NPM_CONFIG_PREFIX  = $globalDir

# 3) npm 缓存目录：装到项目下（临时文件也自动落在缓存内）
$env:NPM_CONFIG_CACHE   = $cacheDir

# 4) 用户级配置文件指到项目，防止读取 ~/.npmrc
$env:NPM_CONFIG_USERCONFIG = Join-Path $PSScriptRoot '.npmrc'

# 5) corepack 缓存（yarn/pnpm 的下载缓存）圈到项目下
$env:COREPACK_HOME = Join-Path $PSScriptRoot '.node-corepack'

# 6) 其它 CLI 工具（npx 等）的缓存目录，一并圈到项目下
$env:XDG_CACHE_HOME = Join-Path $PSScriptRoot '.xdg-cache'

# 7) 二进制镜像（走环境变量；不要写进 .npmrc，避免 npm 11+ Unknown user config 告警）
$env:ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
$env:ELECTRON_BUILDER_BINARIES_MIRROR = 'https://npmmirror.com/mirrors/electron-builder-binaries/'

Write-Host "Node 环境已就绪（项目级）:"
node -v
npm -v
Write-Host "缓存目录: $cacheDir"
Write-Host "Electron 镜像: $env:ELECTRON_MIRROR"
