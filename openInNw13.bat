@echo off
echo 测试启动
set NW_DEBUG=1
set N_SCD_DIR=
:hello
"E:\自建测试的项目\前端类\nwjs-sdk-v0.14.5-win-ia32\nw.exe" "."
echo 1秒后重启nw.
node -e "setTimeout(function(){process.exit();},2000);" 
goto hello