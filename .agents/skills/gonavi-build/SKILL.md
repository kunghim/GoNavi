---
name: gonavi-build
description: Build and launch the local GoNavi Wails application for manual verification. Use when working in the GoNavi repository and asked to run the final local build, reopen the freshly built executable, close a running GoNavi instance before rebuilding, or verify that a clean Wails build still succeeds after code changes.
---

# GoNavi Build

Run the project-level PowerShell script in scripts/build-and-run.ps1 from the repository root.

## Workflow

1. Confirm the current branch and worktree status before building when that context matters to the task.
2. Run:

~~~powershell
& .\.agents\skills\gonavi-build\scripts\build-and-run.ps1
~~~

3. Use -NoLaunch when the user only wants a build result and does not want the app opened.
4. Use -KeepExisting when the user explicitly does not want the script to close a running build\bin\GoNavi.exe.
5. After the script finishes, report:
   - whether wails build -clean succeeded,
   - the built executable path,
   - whether the app was launched,
   - any remaining worktree changes.

## Expectations

- Let the script close the existing built GoNavi.exe by default before rebuilding.
- Keep the built executable running for the user's manual verification unless they asked for -NoLaunch.
- Restore the known Wails-generated binding and checksum files when they were clean before the build and were only dirtied by the build itself.
- Do not restore files that were already dirty before the build started.
- If the build fails, do not launch the old executable.

## Resources

### scripts/

- build-and-run.ps1: performs the clean Wails build, restores known build-only generated files when safe, and launches the new executable.
