# CirculAI Quick Start

This is a public guest-mode application. There are no demo credentials, login screens, database setup steps, pickup bookings, or saved user histories.

## Option 1: Docker Compose (recommended)

1. Place your trained e-waste YOLO weights at `ai/models/yolov11n.pt` (or configure `YOLO_MODEL_PATH`).
2. From this directory, run:

```bash
docker compose up --build -d
```

3. Open `http://localhost:3000`.

Nginx serves the React app and forwards `/api` calls to Flask. The API is also available internally on port 5000.

## Option 2: Run locally

### Backend

```bash
cd backend
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
python app.py
```

### Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to `http://127.0.0.1:5000`. Set `VITE_DEV_API_TARGET` if the backend uses another address.

## Try the features

1. **Dashboard:** open the public dashboard and explore the system modules.
2. **AI Detection:** upload, drag-and-drop, or capture an image. Run inference, inspect bounding boxes and confidence, then export the current result as JSON.
3. **Analytics:** explore the sample category and trend charts. Use **Export Report (PDF)** and choose Save as PDF in the browser print dialog.
4. **Disposal & Centers:** filter accepted device categories, enter a city, and open map searches. Verify each facility's authorization directly.
5. **About Project:** step through the frontend-to-model processing pipeline.
6. **API Docs:** review the endpoints and copy the cURL example.

## API endpoints

- `GET /api/health`
- `GET /api/ai/model-info`
- `POST /api/ai/predict` (multipart field: `file`)
- `GET /api/analytics/environmental`

## AI model requirement

The repository does not include trained model weights. Live inference works only after you provide compatible e-waste-trained YOLO weights. Default path: `ai/models/yolov11n.pt`. Alternatively set `YOLO_MODEL_PATH` to an absolute path on the backend host. The model must expose supported e-waste labels such as laptop, mobile, battery, keyboard, mouse, monitor, CPU, printer, cable, or router.

If weights are absent, `/api/ai/model-info` reports that they are unavailable and the inference endpoint returns a configuration error. No fake prediction is generated.

## Deployment notes

- For a separate frontend deployment, set build-time `VITE_API_URL` to the backend API base (for example `https://your-api.example/api`).
- Set backend `CORS_ORIGINS` to the exact frontend origin.
- Camera capture requires HTTPS or localhost and browser permission.
- Upload limit: 10 MB; accepted formats: JPG, PNG, WEBP.

## Privacy and limitations

Uploads are temporary and removed after inference. There is no database, authentication, personal pickup tracking, or persistent analytics. Charts are illustrative. Facility searches are third-party map results, not a verified directory. AI output and recovery estimates are informational, not certified safety assessments.
