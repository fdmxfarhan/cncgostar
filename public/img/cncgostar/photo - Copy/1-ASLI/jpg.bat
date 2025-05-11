@echo off
setlocal enabledelayedexpansion

echo Renaming .JPG to .jpg...
for %%f in (*.JPG) do (
    set "filename=%%~nf"
    ren "%%f" "!filename!.jpg"
)
for %%f in (*.JPEG) do (
    set "filename=%%~nf"
    ren "%%f" "!filename!.jpg"
)

echo Done.
pause