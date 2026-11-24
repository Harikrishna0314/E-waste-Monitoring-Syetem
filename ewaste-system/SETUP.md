# CirculAI Setup Guide

See `QUICKSTART.md` for the shortest setup path and `README.md` for complete deployment instructions.

## Requirements
- Node.js 22.13+
- Python 3.11
- Compatible e-waste-trained YOLO weights (not included)
- Optional Docker Engine + Compose

## Local setup

Backend terminal:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Frontend terminal:
```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. The Vite development server proxies `/api` to Flask at port 5000.

## Model weights
Place compatible YOLO weights at `ai/models/yolov11n.pt` or set `YOLO_MODEL_PATH` to the absolute model path. Restart the backend after configuring weights. The model must expose supported e-waste class names.

## Docker
From the project directory, run `docker compose up --build -d` and open `http://localhost:3000`.

## No database setup
Authentication and database features were removed. Do not run SQL schema files or configure database credentials. The application operates in public guest mode; predictions are not stored.

## Common checks
- API: `http://localhost:5000/api/health`
- Model configuration: `http://localhost:5000/api/ai/model-info`
- API documentation: use the API Docs / Schema item in the app sidebar.