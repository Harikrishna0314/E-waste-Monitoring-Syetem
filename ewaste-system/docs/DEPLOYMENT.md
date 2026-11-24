# CirculAI Deployment Guide

CirculAI runs without a database or authentication service. The easiest cloud setup is a Render static frontend plus a Docker-based Flask API in Singapore.

## Automatic cloud deployment (Render)

The backend Docker image downloads and bundles the lightweight official YOLO11n pretrained model during its image build. No manual model upload is needed for the starter experience. This COCO model recognizes a subset of relevant electronics (laptops, cell phones, keyboards, computer mice, and TVs/monitors); it is not a model trained specifically on all e-waste categories. For full ten-class e-waste detection, provide your own compatible e-waste-trained weights and set `YOLO_MODEL_PATH`.

Recommended Render setup:
- Backend: Docker web service using `ewaste-system/Dockerfile.backend`, Docker context `ewaste-system`, Singapore region, 1 CPU / 2 GB RAM (`1c-2g` plan).
- Frontend: static site built from `ewaste-system/frontend`, with `VITE_API_URL` set to the backend's `https://<backend-host>/api` URL.
- Backend environment: `FLASK_ENV=production`, `CORS_ORIGINS=https://<frontend-host>`, and `YOLO_MODEL_PATH=/app/yolo11n.pt`.
- The static site is hosted free; the API plan is paid. Check current pricing before applying.

Render's free web service has only 512 MB RAM and sleeps after idle periods, so it is not recommended for the PyTorch inference backend. The static frontend can use the free static-site plan.

## Local Docker Compose

Requirements: Docker Engine and Docker Compose.

From the `ewaste-system` directory run:
```bash
docker compose up --build -d
```
Open `http://localhost:3000`. Nginx serves the SPA and reverse-proxies `/api/` to Flask. The backend Docker build downloads the starter YOLO11n model automatically.

## Deploy backend separately

Use the Docker backend rather than a free native Python instance. The Docker build installs Python dependencies and predownloads the starter YOLO11n model. For a custom model, set `YOLO_MODEL_PATH` to its path inside the backend container.

Backend runtime:
```bash
gunicorn --workers 1 --threads 2 --timeout 180 --bind 0.0.0.0:$PORT app:app
```

Environment:
- `FLASK_ENV=production`
- `YOLO_MODEL_PATH=/app/yolo11n.pt` (starter model) or the path to your own trained weights
- `CORS_ORIGINS=https://your-frontend.example` (comma-separated origins supported)
- `PORT` is supplied by the host.

## Deploy frontend separately

Deploy `frontend` as a Vite static site. Build command:
```bash
cd ewaste-system/frontend && npm install --no-audit --no-fund && npm run build
``
Publish directory: `ewaste-system/frontend/dist`.

Set the build-time variable `VITE_API_URL` to the backend API base, e.g. `https://your-backend.example/api` (no trailing slash). Set backend `CORS_ORIGINS` to the exact frontend origin.

## Model and upload notes

- The bundled starter model is YOLO11n pretrained on COCO, not fine-tuned for all e-waste categories.
- Supported starter classes include laptop, mobile phone, keyboard, mouse, and TV/monitor. Other classes require an e-waste-trained model with compatible class names.
- Custom weights are not included in this repository; set `YOLO_MODEL_PATH` to your own model to replace the starter weights.
- Upload formats: JPG, PNG, WEBP; maximum size 10 MB.
- Camera capture requires HTTPS (or localhost) and user permission.
- Temporary uploads are deleted after inference.

## Verify deployment

1. Open `https://<backend-host>/api/health` and confirm `status` is `healthy`.
2. Open `https://<backend-host>/api/ai/model-info` and confirm model weights are available.
3. Upload an image containing a supported electronic device on the AI Detection page and confirm a real inference response.
4. Confirm the browser header reports API online.

## Data and feature limitations

There is no database, account system, saved prediction history, pickup booking, personal tracking, or live analytics. The analytics page contains illustrative sample visualizations. Facility searches open third-party map listings; verify authorization and accepted items directly.
