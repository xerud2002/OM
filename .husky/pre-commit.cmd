@echo off
REM Windows-compatible husky pre-commit wrapper
REM Runs lint-staged via npx (no install) and returns non-zero on failure
npx --no-install lint-staged || exit /b 1
