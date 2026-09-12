@echo off
rem 为本项目单独启用 Node.js 环境（不写入系统环境变量，仅当前 cmd 会话有效）
rem 用法：在项目根目录执行  node_env.bat

set "SCRIPT_DIR=%~dp0"
set "NODE_DIR=%SCRIPT_DIR%.node-v24.19.0-win-x64"
set "GLOBAL_DIR=%SCRIPT_DIR%.node-global"
set "CACHE_DIR=%SCRIPT_DIR%.npm-cache"

if not exist "%NODE_DIR%\node.exe" (
    echo [WARN] 未找到 %NODE_DIR%\node.exe，请先下载免安装版 Node.js 解压到该目录
)

rem 1) PATH：把项目下的 node 与全局 bin 放到最前（仅本会话）
set "PATH=%NODE_DIR%;%GLOBAL_DIR%;%PATH%"

rem 2) npm 全局模块目录：装到项目下，不污染系统
set "NPM_CONFIG_PREFIX=%GLOBAL_DIR%"

rem 3) npm 缓存目录：装到项目下（临时文件也自动落在缓存内）
set "NPM_CONFIG_CACHE=%CACHE_DIR%"

rem 4) 用户级配置文件指到项目，防止读取 %%USERPROFILE%%\.npmrc
set "NPM_CONFIG_USERCONFIG=%SCRIPT_DIR%.npmrc"

rem 5) corepack 缓存（yarn/pnpm 的下载缓存）圈到项目下
set "COREPACK_HOME=%SCRIPT_DIR%.node-corepack"

rem 6) 其它 CLI 工具（npx 等）的缓存目录，一并圈到项目下
set "XDG_CACHE_HOME=%SCRIPT_DIR%.xdg-cache"

rem 7) 二进制镜像（环境变量；不要写进 .npmrc，避免 npm 11+ Unknown user config 告警）
set "ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/"
set "ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/"

echo Node 环境已就绪（项目级）:
node -v
npm -v
echo 缓存目录: %CACHE_DIR%
echo Electron 镜像: %ELECTRON_MIRROR%
