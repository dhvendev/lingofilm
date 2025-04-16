@echo off
start cmd /k "cd /d %CD% && npx next dev --turbopack -p 3000"
timeout /t 2
start cmd /k "cd /d %CD% && npx local-ssl-proxy --source 3001 --target 3000 --cert .ssl/cert.pem --key .ssl/key.pem"