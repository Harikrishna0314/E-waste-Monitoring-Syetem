# Setup Guide - E-Waste Monitoring System

## Quick Start (5 minutes)

### 1. Clone Repository
```bash
git clone <repository-url>
cd ewaste-system
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access at: `http://localhost:5173`

### 3. Backend Setup (New Terminal)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
Access at: `http://localhost:5000`

### 4. Database Setup (New Terminal)
```bash
# Create database
mysql -u root -p < database/schema.sql

# Or using MySQL CLI
mysql -u root -p
> CREATE DATABASE ewaste_system;
> USE ewaste_system;
> SOURCE database/schema.sql;
```

## Detailed Setup Instructions

### Prerequisites

#### Windows
1. Install Python 3.8+ from python.org
2. Install Node.js 18+ from nodejs.org
3. Install MySQL 8.0+ from mysql.com
4. Install Git from git-scm.com

#### macOS
```bash
# Using Homebrew
brew install python node mysql git
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip nodejs npm mysql-server git
```

### Environment Configuration

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
FLASK_ENV=development
FLASK_APP=app.py
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/ewaste_system
JWT_SECRET_KEY=your-super-secret-key-change-this
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Frontend (.env)
Create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

### Database Configuration

#### MySQL Connection
```bash
# Test connection
mysql -u root -p -h localhost

# Create database
mysql -u root -p -e "CREATE DATABASE ewaste_system;"

# Import schema
mysql -u root -p ewaste_system < database/schema.sql

# Verify tables
mysql -u root -p ewaste_system -e "SHOW TABLES;"
```

#### Create Demo Users
```sql
USE ewaste_system;

-- User account
INSERT INTO users (email, password_hash, full_name, role, is_active)
VALUES ('user@example.com', '$2b$10$...', 'John Doe', 'user', 1);

-- Admin account
INSERT INTO users (email, password_hash, full_name, role, is_active)
VALUES ('admin@example.com', '$2b$10$...', 'Admin User', 'admin', 1);

-- Collection Center
INSERT INTO users (email, password_hash, full_name, role, is_active)
VALUES ('center@example.com', '$2b$10$...', 'Collection Center', 'collection_center', 1);

-- Developer
INSERT INTO users (email, password_hash, full_name, role, is_active)
VALUES ('dev@example.com', '$2b$10$...', 'Developer', 'developer', 1);
```

### Frontend Installation

```bash
cd frontend

# Install dependencies
npm install

# Install additional packages if needed
npm install react-router-dom framer-motion recharts lucide-react @tanstack/react-query axios

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Installation

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download YOLO model (first time only)
python3 -c "from ultralytics import YOLO; YOLO('yolov11n.pt')"

# Run development server
python app.py

# Run with production server (gunicorn)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Project Structure Setup

```
ewaste-system/
├── frontend/
│   ├── node_modules/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── venv/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── auth.py
│   ├── ai_service.py
│   ├── requirements.txt
│   └── .env
│
├── database/
│   └── schema.sql
│
└── README.md
```

## Troubleshooting

### Frontend Issues

**Port 5173 already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or use different port
npm run dev -- --port 3000
```

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tailwind CSS not working**
```bash
# Rebuild Tailwind
npm run build:css
```

### Backend Issues

**Port 5000 already in use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or use different port
python app.py --port 5001
```

**Database connection error**
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1;"

# Verify DATABASE_URL in .env
# Format: mysql+pymysql://username:password@host:port/database
```

**Module import errors**
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
```

**YOLO model not found**
```bash
# Download model manually
python3 -c "from ultralytics import YOLO; YOLO('yolov11n.pt')"
```

### Database Issues

**Can't connect to MySQL**
```bash
# Check MySQL service
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Test connection
mysql -u root -p
```

**Database schema import failed**
```bash
# Check for syntax errors
mysql -u root -p ewaste_system < database/schema.sql

# Or import line by line
mysql -u root -p ewaste_system < database/schema.sql 2>&1 | head -20
```

**Permission denied errors**
```bash
# Grant permissions
mysql -u root -p -e "GRANT ALL PRIVILEGES ON ewaste_system.* TO 'root'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

## Development Workflow

### 1. Start Services
```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && source venv/bin/activate && python app.py

# Terminal 3: Database (if needed)
mysql -u root -p
```

### 2. Make Changes
- Frontend: Edit files in `frontend/src/`
- Backend: Edit files in `backend/`
- Database: Modify `database/schema.sql` and run migrations

### 3. Test Changes
- Frontend: Check `http://localhost:5173`
- Backend: Check `http://localhost:5000/api/health`
- Database: Run queries in MySQL CLI

### 4. Commit Changes
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

## Production Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Backend (Heroku)
```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create ewaste-system

# Deploy
git push heroku main
```

### Database (AWS RDS)
1. Create RDS MySQL instance
2. Update DATABASE_URL in backend .env
3. Run migrations on RDS

## Performance Optimization

### Frontend
```bash
# Build optimization
npm run build

# Analyze bundle size
npm install -g webpack-bundle-analyzer
```

### Backend
```bash
# Use production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Enable caching
pip install flask-caching
```

### Database
```sql
-- Add indexes for common queries
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_ewaste_items_status ON ewaste_items(status);
CREATE INDEX idx_pickup_requests_status ON pickup_requests(status);
```

## Monitoring & Logging

### Backend Logs
```bash
# View logs
tail -f backend.log

# Enable debug logging
export FLASK_ENV=development
export FLASK_DEBUG=1
```

### Database Logs
```bash
# MySQL logs
tail -f /var/log/mysql/error.log
```

## Security Checklist

- [ ] Change JWT_SECRET_KEY in production
- [ ] Use HTTPS in production
- [ ] Enable CORS only for trusted domains
- [ ] Set strong database passwords
- [ ] Enable database backups
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up SSL certificates
- [ ] Enable audit logging
- [ ] Regular security updates

## Support

For issues, check:
1. README.md
2. API documentation
3. GitHub Issues
4. Stack Overflow (tag: ewaste-system)

---

**Last Updated**: July 2026  
**Version**: 1.0.0
