# CirculAI — E-Waste Monitoring & Circular AI System

A public, database-free e-waste monitoring demonstrator. CirculAI combines a React interface with a Flask API and YOLO-based image inference to identify supported electronic waste classes and present basic handling guidance.

## Implemented features
- Public guest access: no login, registration, authentication, or logout.
- AI detection: JPG, PNG, and WEBP upload, drag-and-drop, camera capture, confidence scores, bounding boxes, hazard levels, recommendations, and JSON result export.
- Environmental analytics: interactive category chart, illustrative trend chart, hazardous-material matrix, and browser print / Save as PDF.
- Disposal guide: category filters, four-step disposal protocol, map-based facility search by city, and expandable safety FAQs.
- Project architecture: interactive walkthrough of the frontend, Flask API, YOLO inference, and response flow.
- API Docs page with endpoint descriptions and a copyable cURL example.
- Docker Compose for local split-service testing and a single-container Docker image for simple cloud deployment.

## Important limitations
- There is no database, saved prediction history, personal tracking, pickup booking, or live user analytics.
- Analytics are illustrative demo data, not live telemetry.
- Facility search opens third-party map results. Verify facility authorization and accepted materials before visiting.
- The cloud Docker image automatically downloads the lightweight YOLO11n pretrained starter model at build time. It can detect a subset of relevant electronics represented in COCO (laptop, cell phone, keyboard, mouse, and TV/monitor); it is not fine-tuned for every e-waste category.
- For full ten-class e-waste detection, provide custom trained weights with supported class names and set `YOLO_MODEL_PATH`.
- Weight and recovery-value outputs are heuristics, not certified valuations. AI output is not a safety assessment.

## Requirements
- Node.js 22.13+ for Vite 8.
- Python 3.11.
- Optional: Docker Engine and Docker Compose.

## Local setup
1. Start Flask: `cd backend`, create/activate a virtual environment, run `pip install -r requirements.txt`, then `python app.py`.
2. Start the frontend in another terminal: `cd frontend`, run `npm install`, then `npm run dev`.
3. Open `http://localhost:5173`. Vite proxies `/api` to Flask on port 5000. Set `VITE_DEV_API_TARGET` if Flask runs elsewhere. Direct local Flask inference uses the custom model path in `YOLO_MODEL_PATH`; the Docker image predownloads the starter model.

## One-container cloud deployment

Use `Dockerfile.fullstack` with repository root build context `ewaste-system`. It builds the React frontend, installs the Flask API, downloads YOLO11n weights, and serves the frontend and API from the same HTTPS origin. No database, separate frontend service, VITE_API_URL, CORS setup, or uploaded model file is needed for the starter deployment.

Render setup:
- Repository: this GitHub repository, branch `main`.
- Runtime: Docker.
- Dockerfile path: `ewaste-system/Dockerfile.fullstack`.
- Docker context: `ewaste-system`.
- Region: Singapore.
- Compute: 1 CPU / 2 GB RAM (`1c-2g`) recommended starting size for CPU PyTorch inference.
- Auto-deploy: enabled.
- The application listens on Render's `PORT` and serves its health endpoint at `/api/health`.

Check current prices before choosing a paid plan. The Render free web plan has 512 MB RAM and is not recommended for the PyTorch inference backend.

## Local Docker Compose
From the `ewaste-system` directory:
```bash
docker compose up --build -d
```
Open `http://localhost:3000`. Nginx serves the SPA and proxies `/api` to the backend. The backend Docker build downloads YOLO11n automatically.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API status and model configuration status |
| GET | `/api/ai/model-info` | Model weights availability and supported labels |
| POST | `/api/ai/predict` | Image inference; multipart field must be named `file` |
| GET | `/api/analytics/environmental` | Empty analytics metadata in database-free mode |

## Troubleshooting
- API offline: verify the Render service is live and the `/api/health` endpoint responds.
- Model unavailable: check that the image build completed the YOLO11n download or set `YOLO_MODEL_PATH` to a compatible local path.
- Camera unavailable: browser camera requires HTTPS or localhost and permission.
- Image rejected: upload JPG, PNG, or WEBP no larger than 10 MB.

## Privacy
Images are stored temporarily during inference and deleted after the request. The app does not persist user records, predictions, pickup requests, or analytics. Avoid uploading confidential images.
