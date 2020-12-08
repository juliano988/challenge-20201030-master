@echo off
ECHO LIMPANDO DIRETORIO ANTES DO DOWNLOAD
DEL "off_arquivos\temp"\*.* /s /f /q
DEL "off_arquivos\arquivos_db"\*.* /s /f /q

ECHO FAZENDO O DOWNLOAD
"off_arquivos\GnuWin32\bin\wget.exe" --no-check-certificate -c -P "off_arquivos\temp" https://static.openfoodfacts.org/data/delta/index.txt

setLocal EnableDelayedExpansion
for /f "tokens=* delims= " %%a in (off_arquivos\temp\index.txt) do (
set N+=1
echo ^"off_arquivos\GnuWin32\bin\wget.exe^" --no-check-certificate -c -P ^"off_arquivos\arquivos_db^" https://static.openfoodfacts.org/data/delta/%%a^ >>off_arquivos\temp\links.txt
)

SETLOCAL ENABLEDELAYEDEXPANSION
SET LINENO=1
FOR /F "delims=" %%l IN (off_arquivos\temp\links.txt) DO (
    ECHO %%l >> off_arquivos\temp\file!LINENO!.bat
    SET /A LINENO=LINENO+1
)

for %%a in (off_arquivos\temp\*.bat) do call "%%a"

DEL "off_arquivos\temp"\*.bat /s /f /q

for /R "off_arquivos\arquivos_db" %%I in ("*.gz") do (
  "off_arquivos\7-Zip\7z.exe" x -y -o"%%~dpI" "%%~fI" 
)

setLocal EnableDelayedExpansion
for /f "tokens=* delims= " %%a in (off_arquivos\temp\index.txt) do (
set N+=1
echo .\off_arquivos\mongoimport.exe --uri mongodb+srv://julio123:julio123@cluster0.ab00a.mongodb.net/Nata_House_Desafio --collection alimentos --type json --file off_arquivos\arquivos_db\%%a >>off_arquivos\temp\update_db.txt
)

@echo off & setlocal enabledelayedexpansion
for /f "delims=" %%a in (off_arquivos\temp\update_db.txt) do (
    set line=%%a
    set line=!line:.gz=!
    if "!line:~-1!"=="." set line=!line:~0,-1!
    >> off_arquivos\temp\update_db_final.txt echo !line!
)

SETLOCAL ENABLEDELAYEDEXPANSION
SET LINENO=1
FOR /F "delims=" %%l IN (off_arquivos\temp\update_db_final.txt) DO (
    ECHO %%l >> off_arquivos\temp\file!LINENO!.bat
    SET /A LINENO=LINENO+1
)

for %%a in (off_arquivos\temp\*.bat) do call "%%a"
