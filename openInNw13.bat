@echo off
echo ��������
set NW_DEBUG=1
set N_SCD_DIR=
:hello
"H:\roof\nwjs-sdk-v0.14.5-win-ia32\nw.exe" "."
echo 1�������nw.
node -e "setTimeout(function(){process.exit();},2000);" 
goto hello