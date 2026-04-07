@echo off
set "mvn_path="
for /f "delims=" %%I in ('where mvn 2^>nul') do set "mvn_path=%%I"

if "%mvn_path%"=="" (
    echo Maven NOT found
) else (
    echo Maven found at %mvn_path%
)

set "npm_path="
for /f "delims=" %%I in ('where npm 2^>nul') do set "npm_path=%%I"

if "%npm_path%"=="" (
    echo npm NOT found
) else (
    echo npm found at %npm_path%
)
