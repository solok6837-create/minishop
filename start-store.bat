@echo off
title MiniShop
cd /d "E:\cluade\ecommerce-store"
echo ==========================================
echo    Starting MiniShop
echo ==========================================
echo.
echo MongoDB runs automatically in the background
echo (Windows starts it for you at every boot).
echo.
echo Your store will be at:   http://localhost:3000
echo Keep this window open while using the store.
echo Press Ctrl+C here to stop the server.
echo.
"C:\Program Files\nodejs\node.exe" server.js
pause
