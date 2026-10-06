# Student Performance Project

A React/Vite dashboard with a Flask backend for exploring student-performance data and running the project experiments.

## Windows quick start

### 1. Install prerequisites

Install these two applications once:

- **Python 3.10 or newer:** https://www.python.org/downloads/
  - During installation, enable **Add Python to PATH**.
- **Node.js LTS:** https://nodejs.org/

Git is also required to clone or pull the repository.

### 2. Download the project

Open PowerShell and run:

```powershell
git clone <REPOSITORY-URL>
cd student-performance-project
```

If the project is already downloaded, update it with:

```powershell
git pull
```

### 3. Install dependencies once

Double-click **`setup.bat`** in the project folder.

The script creates a local Python virtual environment, installs the packages from `requirements.txt`, and installs the frontend packages from `frontend/package-lock.json`. It is safe to run again if setup has already been completed.

### 4. Start the application

Double-click **`run.bat`**.

Two command windows will open:

- Flask backend: http://localhost:5000
- React frontend: http://localhost:5173

Open **http://localhost:5173** in a browser. Keep both command windows open while using the application. Close them when finished.

## Manual commands

If Windows blocks double-clicking a script, run these commands from the project folder:

```powershell
.\setup.bat
.\run.bat
```

To start the backend manually:

```powershell
.\.venv\Scripts\python.exe backend\app.py
```

To start the frontend manually in a second terminal:

```powershell
cd frontend
npm run dev
```

## Updating the project

Stop the running application, then pull the latest version:

```powershell
git pull
```

Run `setup.bat` again if `requirements.txt`, `frontend\package.json`, or `frontend\package-lock.json` changed. Otherwise, run `run.bat` directly.

## Troubleshooting

- **`python` or `py` is not recognized:** reinstall Python and enable **Add Python to PATH**, then reopen PowerShell.
- **`npm` or `node` is not recognized:** install the Node.js LTS version, then reopen PowerShell.
- **Port 5000 or 5173 is already in use:** close the other application using that port, then run `run.bat` again.
- **The page loads but API requests fail:** make sure the Flask command window is still open and that http://localhost:5000/api/health responds with `{"status":"healthy"}`.
- **PowerShell says scripts are disabled:** use the `.bat` files; they do not require PowerShell script execution permissions.

## Project structure

```text
backend/       Flask API, preprocessing, models, and experiment modules
frontend/      React/Vite dashboard
dataset/       Source dataset
notebooks/     Analysis notebook
requirements.txt
setup.bat      One-time Windows dependency setup
run.bat        Windows application launcher
```

## Git contribution workflow

`origin` is normally the name of the GitHub remote, not a branch. Use a descriptive branch name, then commit and push it:

```powershell
git switch -c project-setup
git add .
git commit -m "Add Windows setup instructions"
git push -u origin project-setup
```

After the branch is merged or updated by your team, classmates can run `git pull` and use `setup.bat` or `run.bat`.