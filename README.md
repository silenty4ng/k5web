# K5Web

- 世界业余无线电日 K5Web 正式开源，添加开源许可协议。
- 感谢所有 HAM 。

## 简介

K5Web 用于对兼容业余无线电台 UV-K5 写频、更新固件、写入星历等。

## Discussion
- QQ 群：957225277  （K5Web相关）
- QQ 群：201308015  （固件相关）
- Telegram Group: https://t.me/losehu

## 功能列表

- 固件版本检测
- EEPROM 大小检测
- 信道管理
- 启动画面文字管理
- MDC 本地侧音控制（仅支持我的 LTS 固件）
- 备份/还原 EEPROM
- 固件升级
- 开机图片（LOSEHU 固件）
- 字库写入（LOSEHU 固件）
- 星历写入（LOSEHU 固件）
- DTMF ID 设置
- 收音机频道管理
- MDC 联系人管理（LOSEHU 固件）

## 开发
### 安装依赖
```
yarn
```
### 开发
```
yarn dev
```
### 编译
```
yarn build
```

## 关联项目
### 星历计算接口：
    https://github.com/silenty4ng/k5sat

### 我的固件：
    https://github.com/silenty4ng/uv-k5-firmware-chinese-lts 

## 感谢项目
- https://github.com/whosmatt/uvmod
- https://github.com/egzumer/uvtools
- https://github.com/losehu/uv-k5-firmware-custom
- https://github.com/selevo/WebUsbSerialTerminal
- https://github.com/fagci/uvk5-manager
- https://github.com/hank9999/K5_Tools
- https://github.com/kk7ds/chirp

## 开源协议

```
Copyright (c) 2024 Silent YANG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```