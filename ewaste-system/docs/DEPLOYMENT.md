# Deployment Guide - E-Waste Monitoring System

## Overview

This guide covers deploying the E-Waste Monitoring System to production environments.

## Prerequisites

- Docker & Docker Compose installed
- Git installed
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)
- Cloud provider account (AWS, DigitalOcean, Heroku, etc.)

---

## Option 1: Docker Deployment (Recommended)

### Local Docker Deployment

```bash
# Clone repository
git clone <repository-url>
cd ewaste-system

# Create .env file
cp backend/.env.example backend/.env
echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env.local

# Start all services
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
- Database: localhost:3306

### Stop Services
```bash
docker-compose down
```

---

## Option 2: Cloud Deployment

### AWS EC2 Deployment

#### 1. Launch EC2 Instance
```bash
# Create Ubuntu 22.04 instance
# Security Group: Allow ports 80, 443, 3306, 5000

# SSH into instance
ssh -i key.pem ubuntu@<instance-ip>

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Deploy Application
```bash
# Clone repository
git clone <repository-url>
cd ewaste-system

# Configure environment
nano backend/.env

# Start services
sudo docker-compose up -d

# Enable auto-restart
sudo systemctl enable docker
```

#### 3. Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx.conf with SSL paths
# Restart nginx
sudo docker-compose restart nginx
```

---

### DigitalOcean App Platform

#### 1. Prepare for Deployment
```bash
# Create app.yaml
cat > app.yaml << EOF
name: ewaste-system
services:
  - name: backend
    github:
      repo: your-repo/ewaste-system
      branch: main
    build_command: pip install -r backend/requirements.txt
    run_command: gunicorn -w 4 -b 0.0.0.0:5000 app:app
    envs:
      - key: DATABASE_URL
        value: ${db.connection_string}
      - key: FLASK_ENV
        value: production
    http_port: 5000

  - name: frontend
    github:
      repo: your-repo/ewaste-system
      branch: main
    build_command: cd frontend && npm install && npm run build
    run_command: npm run preview
    envs:
      - key: VITE_API_URL
        value: https://api.yourdomain.com

databases:
  - name: db
    engine: MYSQL
    version: "8"
EOF

# Push to GitHub
git add app.yaml
git commit -m "Add DigitalOcean deployment config"
git push origin main
```

#### 2. Deploy via DigitalOcean Console
1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Connect GitHub repository
4. Select `app.yaml`
5. Configure environment variables
6. Click "Deploy"

---

### Heroku Deployment

#### 1. Prepare for Heroku
```bash
# Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create Heroku app
heroku create ewaste-system

# Add MySQL addon
heroku addons:create cleardb:ignite

# Set environment variables
heroku config:set FLASK_ENV=production
heroku config:set JWT_SECRET_KEY=your-secret-key
```

#### 2. Create Procfile
```bash
cat > Procfile << EOF
web: cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:app
EOF
```

#### 3. Deploy
```bash
# Deploy to Heroku
git push heroku main

# View logs
heroku logs --tail

# Scale dynos
heroku ps:scale web=2
```

---

## Option 3: Kubernetes Deployment

### Prerequisites
- kubectl installed
- Kubernetes cluster (AWS EKS, DigitalOcean, etc.)

### 1. Create Kubernetes Manifests

#### backend-deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ewaste-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ewaste-backend
  template:
    metadata:
      labels:
        app: ewaste-backend
    spec:
      containers:
      - name: backend
        image: your-registry/ewaste-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ewaste-secrets
              key: database-url
        - name: FLASK_ENV
          value: production
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: ewaste-backend-service
spec:
  selector:
    app: ewaste-backend
  ports:
  - protocol: TCP
    port: 5000
    targetPort: 5000
  type: LoadBalancer
```

#### frontend-deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ewaste-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ewaste-frontend
  template:
    metadata:
      labels:
        app: ewaste-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/ewaste-frontend:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: ewaste-frontend-service
spec:
  selector:
    app: ewaste-frontend
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: LoadBalancer
```

### 2. Deploy to Kubernetes
```bash
# Create namespace
kubectl create namespace ewaste

# Create secrets
kubectl create secret generic ewaste-secrets \
  --from-literal=database-url=mysql+pymysql://... \
  -n ewaste

# Apply manifests
kubectl apply -f backend-deployment.yaml -n ewaste
kubectl apply -f frontend-deployment.yaml -n ewaste

# Check deployment
kubectl get deployments -n ewaste
kubectl get services -n ewaste

# View logs
kubectl logs -f deployment/ewaste-backend -n ewaste
```

---

## Database Backup & Recovery

### Automated Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="ewaste_backup_$DATE.sql"

# Backup database
docker-compose exec -T mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD ewaste_system > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Upload to S3 (optional)
aws s3 cp $BACKUP_FILE.gz s3://your-bucket/backups/

echo "Backup completed: $BACKUP_FILE.gz"
EOF

chmod +x backup.sh

# Schedule daily backup (crontab)
0 2 * * * /path/to/backup.sh
```

### Restore from Backup
```bash
# Restore database
docker-compose exec -T mysql mysql -u root -p$MYSQL_ROOT_PASSWORD ewaste_system < backup.sql
```

---

## Monitoring & Logging

### Docker Logs
```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Save logs to file
docker-compose logs > logs.txt
```

### Health Checks
```bash
# Check backend health
curl http://localhost:5000/api/health

# Check database connection
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SELECT 1;"

# Check frontend
curl http://localhost:3000
```

### Performance Monitoring
```bash
# Monitor resource usage
docker stats

# Check disk space
df -h

# Check memory usage
free -h
```

---

## Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Load balance with nginx
# Update nginx.conf with upstream backend servers
```

### Vertical Scaling
```bash
# Increase container resources in docker-compose.yml
# Restart services
docker-compose down
docker-compose up -d
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Enable database encryption
- [ ] Use environment variables for secrets
- [ ] Enable audit logging
- [ ] Set up monitoring alerts
- [ ] Regular security updates
- [ ] Use strong JWT secret

---

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild images
docker-compose up -d --build
```

### Database connection errors
```bash
# Check database status
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SELECT 1;"

# Verify connection string
echo $DATABASE_URL
```

### High memory usage
```bash
# Check container stats
docker stats

# Limit memory in docker-compose.yml
# Restart services
docker-compose restart
```

---

## Performance Optimization

### Database
- Enable query caching
- Add indexes for common queries
- Regular VACUUM and ANALYZE
- Connection pooling

### Backend
- Use gunicorn with multiple workers
- Enable caching
- Optimize API responses
- Use CDN for static files

### Frontend
- Minify and compress assets
- Enable gzip compression
- Use CDN for static files
- Lazy load components

---

## Rollback Procedure

```bash
# Tag current version
git tag v1.0.0

# Rollback to previous version
git checkout v0.9.0
docker-compose up -d --build

# Or use Docker image tags
docker pull your-registry/ewaste-backend:v0.9.0
docker-compose down
docker-compose up -d
```

---

## Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify configuration: Check .env files
3. Test connectivity: `curl` commands
4. Check documentation
5. Open GitHub issue

---

**Last Updated**: July 2026  
**Version**: 1.0.0
