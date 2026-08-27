# AI-Powered Smart E-Waste Monitoring System

A comprehensive, enterprise-grade web application for monitoring, classifying, collecting, and recycling electronic waste using Artificial Intelligence (YOLOv11 object detection).

## 🌍 Project Overview

The E-Waste Monitoring System is designed to address the growing environmental challenge of electronic waste. It provides a complete platform for:

- **Users**: Report e-waste, book pickups, track recycling status, and view environmental impact
- **Collection Centers**: Manage inventory, track assigned pickups, and optimize collection routes
- **Administrators**: Monitor system-wide metrics, manage users, and generate reports
- **Developers**: Train and evaluate AI models, manage datasets, and monitor system performance

## 🏗️ Architecture

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Glassmorphism design
- **State Management**: React Hooks & Axios
- **UI Components**: Lucide Icons, Recharts for visualizations
- **Animations**: Framer Motion for smooth transitions

### Backend
- **Framework**: Flask (Python)
- **Database**: MySQL/TiDB
- **Authentication**: JWT with bcrypt password hashing
- **API**: RESTful APIs with proper error handling
- **AI Integration**: YOLOv11 for e-waste detection

### Database
- **Engine**: MySQL
- **ORM**: SQLAlchemy
- **Schema**: Multi-table relational design with proper indexing

### AI/ML
- **Model**: YOLOv11 (You Only Look Once v11)
- **Framework**: Ultralytics
- **Vision Processing**: OpenCV
- **Supported Classes**: Laptop, Mobile, Battery, Keyboard, Mouse, Monitor, CPU, Printer, Cable, Router

## 📁 Project Structure

```
ewaste-system/
├── frontend/                    # React TypeScript application
│   ├── src/
│   │   ├── pages/              # Page components (dashboards, auth)
│   │   ├── components/         # Reusable UI components
│   │   ├── App.tsx             # Main routing component
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles with Glassmorphism
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                     # Flask Python application
│   ├── app.py                  # Main Flask application
│   ├── config.py               # Configuration management
│   ├── models.py               # SQLAlchemy database models
│   ├── auth.py                 # Authentication utilities
│   ├── ai_service.py           # YOLO detection service
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment variables template
│
├── database/
│   ├── schema.sql              # Complete database schema
│   └── migrations/             # Database migrations
│
├── ai/
│   ├── models/                 # Pre-trained YOLO models
│   ├── datasets/               # Training datasets
│   └── training_logs/          # Model training logs
│
├── uploads/                     # User uploaded files
├── reports/                     # Generated reports (PDF, Excel, CSV)
├── logs/                        # Application logs
└── docs/                        # Documentation

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- MySQL 8.0+ (for database)
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend API will be available at `http://localhost:5000/api`

### Database Setup

```bash
mysql -u root -p < database/schema.sql
```

Update the `DATABASE_URL` in `backend/.env` with your MySQL credentials.

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

- **Registration**: `/api/auth/register` (POST)
- **Login**: `/api/auth/login` (POST)
- **Get Current User**: `/api/auth/me` (GET, requires token)

All protected endpoints require an `Authorization: Bearer <token>` header.

## 👥 User Roles

### 1. User
- Report e-waste items
- Upload images for AI detection
- Book pickup requests
- Track pickup status
- View environmental impact
- Earn recycling points

### 2. Collection Center
- View assigned pickups
- Update pickup status
- Manage inventory
- View collection routes on map

### 3. Administrator
- Manage all users
- Manage collection centers
- View system-wide analytics
- Generate reports
- Monitor environmental impact
- System configuration

### 4. Developer
- Train YOLO models
- Manage datasets
- Monitor model performance
- View AI prediction logs
- API management

## 🤖 AI E-Waste Detection

### Supported E-Waste Categories
1. **Laptop** - High hazard (contains mercury, lead)
2. **Mobile Phone** - Medium hazard (rare earth elements)
3. **Battery** - High hazard (must be recycled separately)
4. **Keyboard** - Low hazard (can be refurbished)
5. **Mouse** - Low hazard (can be refurbished)
6. **Monitor** - High hazard (contains mercury)
7. **CPU** - High hazard (valuable metals)
8. **Printer** - Medium hazard (contains toner)
9. **Cable** - Low hazard (copper recovery)
10. **Router** - Medium hazard (circuit boards)

### Detection Process

```
User uploads image
        ↓
Image preprocessing (resize, normalize)
        ↓
YOLOv11 inference
        ↓
Bounding box generation
        ↓
Confidence scoring
        ↓
Hazard level classification
        ↓
Recycling recommendation
        ↓
Store prediction in database
```

## 📊 Environmental Analytics

The system tracks and calculates:

- **CO₂ Saved** (kg) - Based on items recycled
- **Energy Saved** (kWh) - Estimated from material recovery
- **Water Saved** (liters) - From manufacturing offset
- **Trees Saved** - Equivalent to paper saved
- **Materials Recovered**:
  - Plastic (kg)
  - Copper (kg)
  - Aluminium (kg)

## 📈 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - List all users
- `GET /api/admin/collection-centers` - List collection centers

### AI Prediction
- `POST /api/ai/predict` - Predict e-waste from image
- `GET /api/ai/predictions` - Get prediction history

### Pickups
- `POST /api/pickups` - Create pickup request
- `GET /api/pickups/<id>` - Get pickup details
- `PUT /api/pickups/<id>` - Update pickup status

### Analytics
- `GET /api/analytics/environmental` - Environmental metrics

### Health
- `GET /api/health` - Health check

## 🎨 Design System

### Glassmorphism
The UI uses a modern Glassmorphism design with:
- Semi-transparent backgrounds with blur effects
- Soft gradients (Emerald, Blue, Purple)
- Smooth animations and transitions
- Responsive layout (mobile-first)

### Color Palette
- **Primary**: Emerald Green (#10b981)
- **Secondary**: Blue (#3b82f6)
- **Accent**: Purple (#a855f7)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana
- **Heading Weight**: Bold (700)
- **Body Weight**: Regular (400)
- **Line Height**: 1.6

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with 10 rounds
- **SQL Injection Protection**: SQLAlchemy parameterized queries
- **CSRF Protection**: CORS configuration
- **XSS Protection**: React's built-in XSS prevention
- **Rate Limiting**: API rate limiting (to be implemented)
- **Audit Logs**: Track all user actions
- **Role-Based Access Control**: Granular permission management

## 📝 Database Schema

### Key Tables
- **users**: User accounts with roles
- **collection_centers**: Physical e-waste collection points
- **ewaste_items**: Reported e-waste items
- **pickup_requests**: Scheduled pickups
- **ai_predictions**: YOLO detection results
- **environmental_analytics**: Daily environmental metrics
- **reports**: Generated system reports
- **notifications**: User notifications
- **audit_logs**: System activity logs

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/AWS/DigitalOcean)
```bash
cd backend
pip freeze > requirements.txt
# Deploy with Procfile
```

### Database
- Use managed MySQL service (AWS RDS, DigitalOcean, etc.)
- Run migrations on deployment
- Set up automated backups

## 📚 Documentation

- **API Documentation**: See `docs/API.md`
- **Database Schema**: See `database/schema.sql`
- **Deployment Guide**: See `docs/DEPLOYMENT.md`
- **Contributing**: See `CONTRIBUTING.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see `LICENSE` file for details.

## 🙏 Acknowledgments

- YOLOv11 by Ultralytics
- React community
- Flask community
- Tailwind CSS
- All contributors and supporters

## 📞 Support

For support, email support@ewastemonitor.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] IoT sensor integration
- [ ] Blockchain for waste tracking
- [ ] Machine learning recommendations
- [ ] Multi-language support
- [ ] Advanced reporting (PDF, Excel export)

---

**Last Updated**: July 2026  
**Version**: 1.0.0  
**Status**: Production Ready
