# E-Waste Monitoring System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All responses are in JSON format:

```json
{
  "data": {},
  "message": "Success message",
  "status": 200
}
```

## Error Responses

```json
{
  "error": "Error message",
  "status": 400
}
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "role": "user",
  "phone": "+1234567890",
  "city": "New York",
  "country": "USA"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**
- 400: Missing required fields
- 400: Email already exists
- 500: Server error

---

### Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**
- 400: Missing email or password
- 401: Invalid credentials
- 403: User account inactive
- 500: Server error

---

### Get Current User
**GET** `/auth/me`

Get information about the currently authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "is_active": true,
  "created_at": "2026-07-30T10:00:00",
  "updated_at": "2026-07-30T10:00:00"
}
```

**Errors:**
- 401: Missing or invalid token
- 404: User not found
- 500: Server error

---

## Admin Endpoints

### Get Admin Dashboard
**GET** `/admin/dashboard`

Get dashboard statistics for admin users.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "total_users": 2543,
  "total_centers": 48,
  "pending_requests": 156,
  "completed_requests": 1234
}
```

**Errors:**
- 401: Unauthorized
- 403: Insufficient permissions
- 500: Server error

---

### Get All Users
**GET** `/admin/users`

List all users with pagination.

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `per_page` (optional, default: 10): Items per page

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user",
      "is_active": true
    }
  ],
  "total": 2543,
  "pages": 255,
  "current_page": 1
}
```

---

### Get Collection Centers
**GET** `/admin/collection-centers`

List all collection centers.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "centers": [
    {
      "id": 1,
      "center_name": "Downtown Collection Center",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "capacity": 1000,
      "current_inventory": 450,
      "is_active": true
    }
  ]
}
```

---

## AI Prediction Endpoints

### Predict E-Waste
**POST** `/ai/predict`

Upload an image and get AI predictions for e-waste items.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
- `file` (required): Image file (PNG, JPG, JPEG, GIF, WEBP)

**Response (200):**
```json
{
  "prediction_id": 1,
  "detected_objects": ["laptop", "keyboard", "mouse"],
  "bounding_boxes": [
    {
      "x1": 100,
      "y1": 50,
      "x2": 300,
      "y2": 250,
      "width": 200,
      "height": 200
    }
  ],
  "confidence_scores": [0.95, 0.87, 0.92],
  "estimated_weights": [2.0, 0.5, 0.1],
  "estimated_values": [50, 5, 3],
  "hazard_levels": ["high", "low", "low"],
  "recommendations": [
    "Laptop contains valuable metals and hazardous materials. Send to certified e-waste recycler.",
    "Keyboard can be refurbished or recycled. Check for reuse potential first.",
    "Mouse can be refurbished or recycled. Check for reuse potential first."
  ],
  "total_items": 3,
  "total_weight": 2.6,
  "total_value": 58,
  "accuracy": 0.91,
  "processing_time": 1.23
}
```

**Errors:**
- 400: No file provided or invalid file
- 401: Unauthorized
- 500: Server error

---

## Pickup Request Endpoints

### Create Pickup Request
**POST** `/pickups`

Create a new pickup request for e-waste items.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "ewaste_item_id": 1,
  "pickup_date": "2026-08-05",
  "pickup_time": "14:30:00",
  "notes": "Please call before arriving"
}
```

**Response (201):**
```json
{
  "message": "Pickup request created",
  "pickup_id": 1
}
```

**Errors:**
- 400: Missing required fields
- 401: Unauthorized
- 500: Server error

---

### Get Pickup Request
**GET** `/pickups/<pickup_id>`

Get details of a specific pickup request.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "status": "pending",
  "pickup_date": "2026-08-05",
  "pickup_time": "14:30:00",
  "notes": "Please call before arriving"
}
```

**Errors:**
- 401: Unauthorized
- 404: Pickup request not found
- 500: Server error

---

## Environmental Analytics Endpoints

### Get Environmental Analytics
**GET** `/analytics/environmental`

Get environmental impact metrics.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `days` (optional, default: 30): Number of days to retrieve

**Response (200):**
```json
{
  "analytics": [
    {
      "date": "2026-07-30",
      "co2_saved": 45.23,
      "energy_saved": 124.5,
      "water_saved": 2345,
      "trees_saved": 5,
      "plastic_recovered": 23.4,
      "copper_recovered": 12.5,
      "aluminium_recovered": 8.3,
      "environmental_score": 87.5,
      "total_items_recycled": 45
    }
  ]
}
```

---

## Health Check

### Health Status
**GET** `/health`

Check if the API is running.

**Response (200):**
```json
{
  "status": "healthy"
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

Rate limiting is applied to prevent abuse:
- **Limit**: 100 requests per minute per IP
- **Header**: `X-RateLimit-Remaining`

---

## Pagination

Paginated endpoints support:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10, max: 100)

**Response includes:**
- `total`: Total number of items
- `pages`: Total number of pages
- `current_page`: Current page number

---

## Sorting & Filtering

Supported query parameters:
- `sort_by`: Field to sort by
- `sort_order`: `asc` or `desc`
- `search`: Search query
- `filter`: Filter criteria

---

## Examples

### cURL - Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "role": "user"
  }'
```

### cURL - Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### cURL - Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### cURL - Upload Image for Prediction
```bash
curl -X POST http://localhost:5000/api/ai/predict \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg"
```

### Python - Login and Get User
```python
import requests

BASE_URL = "http://localhost:5000/api"

# Login
response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "user@example.com",
    "password": "password123"
})

token = response.json()["token"]

# Get current user
response = requests.get(
    f"{BASE_URL}/auth/me",
    headers={"Authorization": f"Bearer {token}"}
)

print(response.json())
```

---

## Webhooks (Coming Soon)

- `pickup.created`: When a pickup is created
- `prediction.completed`: When AI prediction is completed
- `recycling.completed`: When recycling is completed

---

**Last Updated**: July 2026  
**Version**: 1.0.0  
**Status**: Production Ready
