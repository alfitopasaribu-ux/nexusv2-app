@echo off
echo ============================================
echo NEXUS v3.0 - Deploy to GitHub & Vercel
echo ============================================
echo.

cd /d "%~dp0"

echo [1/4] Adding files to git...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo [2/4] Committing changes...
git commit -m "Add vercel config and deploy guide"
if errorlevel 1 (
    echo ERROR: Failed to commit
    pause
    exit /b 1
)

echo [3/4] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    pause
    exit /b 1
)

echo [4/4] Done!
echo.
echo ============================================
echo NEXT STEPS - Deploy to Vercel:
echo ============================================
echo 1. Open: https://vercel.com/dashboard
echo 2. Add New - Project
echo 3. Import: alfitopasaribu-ux/nexusv2-app
echo 4. Name: nexus-fito
echo 5. Deploy!
echo.
echo IMPORTANT - Add Environment Variable:
echo  - Settings - Environment Variables
echo  - Name: GROQ_API_KEY
echo  - Value: your_api_key_here
echo.
echo Your link will be: https://nexus-fito.vercel.app
echo.
pause
