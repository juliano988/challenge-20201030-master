@REM ISERIR URI DE ACESSO AO BANCO DE DADOS E DEMAIS INFORMAÇÕES NA ETAPA 8

@REM INSERIR NA LINHA ABAIXO "cd" E O DIRETÓRIO ONDE O PROJETO FOI SALVO
cd << DIRETÓRIO DO PROJETO >>
cls

@echo off
ECHO 1 - LIMPANDO DIRETORIO ANTES DO DOWNLOAD========================================================
DEL "off_arquivos\temp"\*.* /s /f /q
DEL "off_arquivos\arquivos_db"\*.* /s /f /q
cls

ECHO 2 - FAZENDO O DOWNLOAD DOS NOMES DOS ARQUIVOS===================================================
"off_arquivos\GnuWin32\bin\wget.exe" --no-check-certificate -c -P "off_arquivos\temp" https://static.openfoodfacts.org/data/delta/index.txt
cls

ECHO 3 - GERANDO OS COMANDOS PARA DOWNLOAD DO BANCO DE DADOS ORIGINNAL===============================
setLocal EnableDelayedExpansion
for /f "tokens=* delims= " %%a in (off_arquivos\temp\index.txt) do (
set N+=1
echo ^"off_arquivos\GnuWin32\bin\wget.exe^" --no-check-certificate -c -P ^"off_arquivos\arquivos_db^" https://static.openfoodfacts.org/data/delta/%%a^ >>off_arquivos\temp\links.txt
)
cls

ECHO 4 - GERANDO .BAT PARA DOWNLOAD DO BANCO DE DADOS ORIGINAL========================================
SETLOCAL ENABLEDELAYEDEXPANSION
SET LINENO=1
FOR /F "delims=" %%l IN (off_arquivos\temp\links.txt) DO (
    ECHO %%l >> off_arquivos\temp\file!LINENO!.bat
    SET /A LINENO=LINENO+1
)
cls

ECHO 5 - FAZENDO O DOWNLOAD DO BANCO DE DADOS ORIGINAL=================================================
for %%a in (off_arquivos\temp\*.bat) do call "%%a"
cls

ECHO 6 - LIMPANDO ARQUIVOS .BAT NÃO MAIS NECESSÁRIOS===================================================
DEL "off_arquivos\temp"\*.bat /s /f /q
cls

ECHO 7 - DESCOMPACTANDO ARQUIVOS DO BANCO DE DADOS ORIGINAL============================================
for /R "off_arquivos\arquivos_db" %%I in ("*.gz") do (
  "off_arquivos\7-Zip\7z.exe" x -y -o"%%~dpI" "%%~fI" 
)
cls

@REM ALTERAR A URI ABAIXO

ECHO 8 - GERANDO COMANDOS PARA IMPORTAÇÃO DOS DADOS DO BANCO ORIGINAL PARA O DA API=====================
setLocal EnableDelayedExpansion
for /f "tokens=* delims= " %%a in (off_arquivos\temp\index.txt) do (
set N+=1
echo .\off_arquivos\mongoimport.exe --uri << URI DE ACESSO AO BANCO DE DADOS >> --collection << INSERIR COLEÇÃO >> --type json --file off_arquivos\arquivos_db\%%a >>off_arquivos\temp\update_db.txt
)
cls

ECHO 9 - ALTERANDO OS COMANDOS EXCLUINDO A EXTENÇÃO .gz DE CADA LINHA===================================
@echo off & setlocal enabledelayedexpansion
for /f "delims=" %%a in (off_arquivos\temp\update_db.txt) do (
    set line=%%a
    set line=!line:.gz=!
    if "!line:~-1!"=="." set line=!line:~0,-1!
    >> off_arquivos\temp\update_db_final.txt echo !line!
)
cls

ECHO 10 - GERANDO .BAT PARA IMPORTAÇÃO DO BANCO DE DADOS ORIGINAL PARA O BANCO DE DADOS DA API============
SETLOCAL ENABLEDELAYEDEXPANSION
SET LINENO=1
FOR /F "delims=" %%l IN (off_arquivos\temp\update_db_final.txt) DO (
    ECHO %%l >> off_arquivos\temp\file!LINENO!.bat
    SET /A LINENO=LINENO+1
)
cls

ECHO 11 - IMPORTANDO DADOS DO BANCO DE DADOS ORIGINAL PARA O DA API========================================
for %%a in (off_arquivos\temp\*.bat) do call "%%a"
cls

ECHO 12 - LIMPANDO DIRETORIO DEPOIS DO DOWNLOAD============================================================
DEL "off_arquivos\temp"\*.* /s /f /q
DEL "off_arquivos\arquivos_db"\*.* /s /f /q