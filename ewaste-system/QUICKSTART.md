# Quick Start Guide - E-Waste Monitoring System

## ⚡ 5-Minute Setup with Docker

### Option 1: Using Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd ewaste-system

# 2. Start all services
docker-compose up -d

# 3. Wait for services to start (30 seconds)
sleep 30

# 4. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api
# Database: localhost:3306
```

**That's it! Your application is running.** 🎉

### Demo Credentials

Use these credentials to log in:

| Role | Email | Password |
|------|-------|----------|
| **User** | user@example.com | password |
| **Admin** | admin@example.com | password |
| **Collection Center** | center1@example.com | password |
| **Developer** | dev@example.com | password |

---

## 🛑 Stop Services

```bash
docker-compose down
```

---

## 📋 Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+
- Python 3.8+
- MySQL 8.0+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access at: `http://localhost:5173`

### Backend Setup (New Terminal)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Access at: `http://localhost:5000/api`

### Database Setup (New Terminal)

```bash
# Create database
mysql -u root -p < database/schema.sql

# Load sample data (optional)
mysql -u root -p ewaste_system < database/sample_data.sql
```

---

## 🧪 Testing the Application

### 1. Test Login
1. Open http://localhost:3000 (or 5173 for manual setup)
2. Click "Sign In"
3. Enter: `user@example.com` / `password`
4. Click "Sign In"

### 2. Test AI Detection
1. Go to "AI Detection" page
2. Upload an image of electronic waste
3. Click "Detect"
4. View results with bounding boxes

### 3. Test Pickup Booking
1. Go to "Book Pickup"
2. Select an e-waste item
3. Choose date and time
4. Submit request

### 4. Test Admin Dashboard
1. Log out and log in as `admin@example.com` / `password`
2. View system statistics
3. Check charts and analytics

---

## 📊 API Testing with Postman

### 1. Import Collection
1. Open Postman
2. Click "Import"
3. Select `docs/Postman_Collection.json`

### 2. Set Variables
1. Click "Variables" tab
2. Set `base_url` = `http://localhost:5000/api`

### 3. Test Endpoints
1. Go to "Authentication" folder
2. Click "Login"
3. Send request
4. Copy token from response
5. Paste in `{{token}}` variable

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

### Database Connection Error

```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1;"

# Update DATABASE_URL in backend/.env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/ewaste_system
```

### Module Not Found

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && pip install -r requirements.txt
```

### Docker Issues

```bash
# Rebuild images
docker-compose up -d --build

# View logs
docker-compose logs -f

# Clean up
docker-compose down -v
```

---

## 📁 Project Structure

```
ewaste-system/
├── frontend/              # React app
├── backend/               # Flask API
├── database/              # MySQL schema
├── docs/                  # Documentation
├── docker-compose.yml     # Docker setup
└── README.md              # Full documentation
```

---

## 🚀 Next Steps

1. **Explore the UI** - Navigate through all dashboards
2. **Test API** - Use Postman collection
3. **Check Logs** - `docker-compose logs`
4. **Read Docs** - See README.md for full details
5. **Deploy** - See DEPLOYMENT.md for production setup

---

## 📞 Need Help?

- **Setup Issues**: See `SETUP.md`
- **API Questions**: See `docs/API.md`
- **Deployment**: See `docs/DEPLOYMENT.md`
- **Project Details**: See `README.md`

---

## ✨ Key Features to Try

1. **User Registration** - Create new account with different roles
2. **AI Detection** - Upload e-waste image for detection
3. **Pickup Booking** - Schedule waste collection
4. **Admin Dashboard** - View system analytics
5. **Environmental Impact** - See recycling statistics
6. **Reports** - Generate system reports

---

**Congratulations! Your E-Waste Monitoring System is running!** 🎉

**Status**: ✅ Ready to use  
**Version**: 1.0.0  
**Last Updated**: July 30, 2026
