# CirculAI Deployment Guide

CirculAI is a database-free public web app. The most automatic cloud setup is one Docker web service: it builds the React frontend, starts the Flask API, and includes a lightweight pretrained YOLO starter model. The frontend and API share one HTTPS origin, so there is no separate frontend service, CORS configuration, or frontend API URL to coordinate.

## One-service cloud deployment (recommended for easiest setup)

Use Render's Docker web service with:
- Repository: `https://github.com/Harikrishna0314/E-waste-Monitoring-Syetem`
- Branch: `main`
- Runtime: Docker
- Docker context: `ewaste-system`
- Dockerfile path: `ewaste-system/Dockerfile.fullstack`
- Region: Singapore
- Compute: 1 CPU / 2 GB RAM (`1c-2g`) recommended starting plan
- Auto-deploy: enabled
- Health endpoint: `/api/health`

The Docker image builds the frontend, installs backend dependencies, and downloads YOLO11n weights at image-build time. It serves the website and API from the same URL. No database, model upload, domain purchase, environment secrets, or separate CORS setup is required for the starter deployment.

Render's free web service has 512 MB RAM and spins down after idle periods, so it is not recommended for this PyTorch backend. A static website can run free, but the single-service setup uses a paid web-service plan. Check current Render pricing before applying.

## What the starter AI model detects

The automatically bundled YOLO11n model is pretrained on COCO, not fine-tuned for all e-waste. Its relevant classes include laptops, cell phones, keyboards, computer mice, and TVs/monitors. It does not natively detect all ten app categories. To enable full e-waste-specific class coverage, place compatible e-waste-trained weights in the backend container and set `YOLO_MODEL_PATH` to that file. The app's weight and recovery-value outputs remain heuristic estimates.

## Automatic deployment from GitHub

After the first Render service is created and connected to this repository, automatic deployment is enabled. Each new commit to `main` triggers a rebuild and deploy. The Dockerfile and app configuration are version-controlled in the repository.

## Local Docker Compose

Requirements: Docker Engine and Docker Compose.

From the `ewaste-system` directory:
```bash
docker compose up --build -d
```
Open `http://localhost:3000`. Nginx serves the React SPA and proxies `/api/` to Flask. The backend Docker build downloads YOLO11n automatically.

## Separate frontend/backend deployment (optional)

For a larger production deployment, use a separate Docker API service and static frontend:
- Backend Dockerfile: `ewaste-system/Dockerfile.backend`, context `ewaste-system`.
- Frontend build: `cd ewaste-system/frontend && npm install --no-audit --no-fund && npm run build`.
- Frontend publish directory: `ewaste-system/frontend/dist`.
- Build-time `VITE_API_URL`: `https://<backend-host>/api`.
- Backend `CORS_ORIGINS`: exact frontend origin.

## Verify deployment

1. Open `https://<service-host>/api/health` and confirm `status` is `healthy`.
2. Open `https://<service-host>/api/ai/model-info` and confirm model weights are available.
3. Upload an image containing a supported electronic device on the AI Detection page and verify an actual inference response.
4. Test camera capture, JSON export, analytics print, navigation, disposal guide filters, and API Docs.

## Data and feature limitations

There is no database, account system, saved prediction history, pickup booking, personal tracking, or live analytics. The analytics page contains illustrative sample visualizations. Facility searches open third-party map listings; verify authorization and accepted items directly. Uploaded images are temporarily processed and deleted after inference.
