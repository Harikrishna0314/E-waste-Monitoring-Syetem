# CirculAI — E-Waste Monitoring & Circular AI System

A public, database-free e-waste monitoring demonstrator. CirculAI combines a React interface with a Flask API and YOLO-based image inference to identify supported electronic waste classes and present basic handling guidance.

## Implemented features
- Public guest access: no login, registration, authentication, or logout.
- AI detection: JPG, PNG, and WEBP upload, drag-and-drop, camera capture, confidence scores, bounding boxes, hazard levels, recommendations, and JSON result export.
- Environmental analytics: interactive category chart, illustrative trend chart, hazardous-material matrix, and browser print / Save as PDF.
- Disposal guide: category filters, four-step disposal protocol, map-based facility search by city, and expandable safety FAQs.
- Project architecture: interactive walkthrough of the frontend, Flask API, YOLO inference, and response flow.
- API Docs page with endpoint descriptions and a copyable cURL example.
- Docker Compose: Nginx serves the frontend and proxies API requests to Flask.

## Important limitations
- There is no database, saved prediction history, personal tracking, pickup booking, or live user analytics.
- Analytics are illustrative demo data, not live telemetry.
- Facility search opens third-party map results. Verify facility authorization and accepted materials before visiting.
- Live AI inference requires compatible e-waste-trained YOLO weights. Model weights are not included in this repository.
- Weight and recovery-value outputs are heuristics, not certified valuations. AI output is not a safety assessment.

## Requirements
- Node.js 22.13+ for Vite 8.
- Python 3.11.
- Compatible YOLO weights mapped to supported classes: laptop, mobile, battery, keyboard, mouse, monitor, CPU, printer, cable, router.
- Optional: Docker Engine and Docker Compose.

## Local setup
1. Place trained weights at `ai/models/yolov11n.pt`, or set `YOLO_MODEL_PATH` to the weights path.
2. Start Flask: `cd backend`, create/activate a virtual environment, run `pip install -r requirements.txt`, then `python app.py`.
3. Start the frontend in another terminal: `cd frontend`, run `npm ci`, then `npm run dev`.
4. Open `http://localhost:5173`. Vite proxies `/api` to Flask on port 5000. Set `VITE_DEV_API_TARGET` if Flask runs elsewhere.

## Docker Compose
From the `ewaste-system` directory run:
```bash
docker compose up --build -d
```
Open `http://localhost:3000`. Nginx proxies `/api` to the backend. Mount or place weights in `ai/models/` before starting.

## Separate frontend/backend deployment
Backend: deploy the `backend` directory with Python 3.11 and start with `gunicorn --workers 2 --timeout 180 --bind 0.0.0.0:$PORT app:app`. Set `FLASK_ENV=production`, `YOLO_MODEL_PATH` to a path on the backend host, and `CORS_ORIGINS` to the frontend origin.

Frontend: deploy `frontend` as a Vite static site with build command `npm install && npm run build` and output directory `dist`. Set build-time `VITE_API_URL` to the backend API base, for example `https://your-backend.example/api` (no trailing slash).

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API status and model configuration status |
| GET | `/api/ai/model-info` | Model weights availability and supported labels |
| POST | `/api/ai/predict` | Image inference; multipart field must be named `file` |
| GET | `/api/analytics/environmental` | Empty analytics metadata in database-free mode |

## Troubleshooting
- API offline: verify Flask and the configured API base URL / proxy.
- Model unavailable: put trained weights on the backend host and set `YOLO_MODEL_PATH`.
- CORS errors on separate hosting: set `CORS_ORIGINS` to the exact frontend origin.
- Camera unavailable: browser camera requires HTTPS or localhost and permission.
- Image rejected: upload JPG, PNG, or WEBP no larger than 10 MB.

## Privacy
Images are stored temporarily during inference and deleted after the request. The app does not persist user records, predictions, pickup requests, or analytics. Avoid uploading confidential images.
