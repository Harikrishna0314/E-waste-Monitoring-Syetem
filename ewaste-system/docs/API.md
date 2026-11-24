# CirculAI Public API

Base URL for local development: `http://localhost:5000`.

All endpoints are public. There is no authentication, JWT, user profile, database, or persistent prediction history.

## Endpoints

### GET /api/health
Returns backend status and whether model weights are present.

Example response:
```json
{ "status": "healthy", "database": "disabled", "ai_model_configured": false }
```

### GET /api/ai/model-info
Returns configured model filename, whether the weight file exists, supported class labels, upload limit, and inference endpoint.

### POST /api/ai/predict
Submit an image using `multipart/form-data` with the file field named `file`. Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`. Maximum image size: 10 MB.

Example:
```bash
curl -X POST http://localhost:5000/api/ai/predict -F 'file=@ewaste-image.jpg'
```

Successful response fields:
- `detected_objects`: supported class names.
- `bounding_boxes`: pixel coordinates (`x1`, `y1`, `x2`, `y2`).
- `confidence_scores`: confidence per detection, from 0 to 1.
- `estimated_weights` and `estimated_values`: heuristic estimates, not certified valuations.
- `hazard_levels` and `recommendations`: informational handling guidance.
- `total_items`, `total_weight`, `total_value`, `accuracy`, `processing_time`, `model_version`.

Uploads are written to a temporary path and removed after inference. Results are returned directly and are not persisted.

### GET /api/analytics/environmental
Returns an empty analytics collection and a database-free mode message. Frontend charts use clearly labeled illustrative values.

## Error responses
- `400`: missing file, empty file, or unreadable image.
- `413`: request exceeds the upload limit.
- `415`: unsupported image format.
- `503`: configured e-waste model weights are unavailable.
- `500`: unexpected inference error.

## Model configuration
Provide compatible e-waste-trained YOLO weights at `ai/models/yolov11n.pt`, or set `YOLO_MODEL_PATH` to an absolute path on the backend host. Supported labels are laptop, mobile, battery, keyboard, mouse, monitor, CPU, printer, cable, and router (including aliases defined by the inference service). Generic model weights that do not contain supported labels are rejected.

AI outputs are informational estimates and are not a certified safety assessment.