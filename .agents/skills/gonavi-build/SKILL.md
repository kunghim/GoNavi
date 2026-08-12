---
name: gonavi-build
description: 在 GoNavi 仓库中执行完整 Wails 构建并启动本地应用，供人工运行验证。用于用户要求最终构建、重新打开最新构建产物、构建前关闭正在运行的 GoNavi，或在代码修改后确认干净构建仍然成功时。
---

# GoNavi 构建与启动

在仓库根目录运行项目级 PowerShell 脚本 scripts/build-and-run.ps1。

## 执行流程

1. 当任务需要关注 Git 上下文时，构建前确认当前分支和工作区状态。
2. 执行：

~~~powershell
& .\.agents\skills\gonavi-build\scripts\build-and-run.ps1
~~~

3. 用户只要求构建、不希望打开应用时，使用 -NoLaunch。
4. 用户明确要求不要关闭正在运行的 build\bin\GoNavi.exe 时，使用 -KeepExisting。
5. 脚本结束后报告：
   - wails build -clean 是否成功；
   - 构建产物路径；
   - 应用是否已经启动；
   - 工作区还剩哪些修改。

## 行为约束

- 默认允许脚本在重新构建前关闭已有的构建版 GoNavi.exe。
- 除非用户要求 -NoLaunch，否则保留新构建的应用继续运行，供用户人工验证。
- 对于构建前保持干净、仅因构建而变更的已知 Wails 绑定和校验文件，构建后自动恢复。
- 不得恢复构建开始前已经存在修改的文件。
- 构建失败时不得启动旧的可执行文件。

## 附带资源

### scripts/

- build-and-run.ps1：执行完整 Wails 构建，在安全情况下恢复仅由构建产生的已知生成文件，并启动新的可执行文件。
