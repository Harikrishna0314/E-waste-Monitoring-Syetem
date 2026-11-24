# CirculAI Deployment Guide

CirculAI runs without a database or authentication service. Deploy one Flask API and one static React frontend, or use Docker Compose.

## Docker Compose (recommended)

Requirements: Docker Engine and Docker Compose.

1. Place compatible e-waste YOLO weights in `ai/models/yolov11n.pt`, or configure `YOLO_MODEL_PATH`.
2. From the `ewaste-system` directory run:
```bash
docker compose up --build -d
```
3. Open `http://localhost:3000`.

Nginx serves the SPA and reverse-proxies `/api/` to the Flask container. Flask is not published directly to the host by Compose.

## Deploy backend separately

Deploy the `backend` directory using Python 3.11. Install `requirements.txt` and start with:
```bash
gunicorn --workers 2 --timeout 180 --bind 0.0.0.0:$PORT app:app
```

Environment:
- `FLASK_ENV=production`
- `YOLO_MODEL_PATH=/absolute/path/to/your/ewaste-model.pt`
- `CORS_ORIGINS=https://your-frontend.example` (comma-separated origins supported)
- `PORT` is normally supplied by the host.

The YOLO weights must exist on the deployed backend filesystem. A path on a developer laptop is not accessible to the cloud service.

## Deploy frontend separately

Deploy `frontend` as a Vite static site. Build command: `npm ci && npm run build`; output directory: `dist`.

Set the build-time variable `VITE_API_URL` to the backend API base, e.g. `https://your-backend.example/api`. Do not add a trailing slash. Set backend `CORS_ORIGINS` to the exact frontend origin.

## Model and upload notes
- Repository does not include model weights.
- Upload formats: JPG, PNG, WEBP.
- Image size: up to 10 MB.
- Camera capture requires HTTPS (or localhost) and user permission.
- Temporary uploads are deleted after inference.

## Verify deployment
1. Open `/api/health` and confirm `status` is `healthy`.
2. Open `/api/ai/model-info` and confirm `weights_available` is true.
3. Upload a representative image on the AI Detection page and confirm a real inference response.
4. Confirm the browser header reports API online.

## Data and feature limitations
There is no database, account system, saved prediction history, pickup booking, personal tracking, or live analytics. The analytics page contains illustrative sample visualizations. Facility searches open third-party map listings; verify authorization and accepted items directly.