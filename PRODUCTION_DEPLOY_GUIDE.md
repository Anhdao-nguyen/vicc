# 🚀 Hướng Dẫn Deploy Production - VICC QC System

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
3. [Cấu Trúc Production](#cấu-trúc-production)
4. [Chuẩn Bị Deploy](#chuẩn-bị-deploy)
5. [Deploy Lần Đầu](#deploy-lần-đầu)
6. [Cập Nhật Production](#cập-nhật-production)
7. [Quản Lý Database](#quản-lý-database)
8. [Monitoring & Logging](#monitoring--logging)
9. [Troubleshooting](#troubleshooting)
10. [Security Checklist](#security-checklist)

---

## 🎯 Tổng Quan

Hệ thống VICC QC được deploy sử dụng **Docker** và **Docker Compose** với các components:

- **Frontend**: React + Vite (served by Nginx)
- **Backend**: Node.js + Express API
- **Database**: MySQL 8.0
- **Reverse Proxy**: Nginx (optional, cho HTTPS)

### Kiến Trúc Production

```
                    ┌─────────────────┐
                    │   Nginx Proxy   │ (Port 443 HTTPS)
                    │   (Optional)    │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
        ┌───────────▼──────┐  ┌──────▼────────┐
        │    Frontend      │  │    Backend    │
        │  (Nginx:80)      │  │  (Node:5000)  │
        └──────────────────┘  └───────┬───────┘
                                      │
                              ┌───────▼────────┐
                              │  MySQL DB      │
                              │  (Port 3306)   │
                              └────────────────┘
```

---

## 💻 Yêu Cầu Hệ Thống

### Server Requirements

- **OS**: Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB+)
- **CPU**: 2 cores trở lên
- **Disk**: 20GB+ SSD
- **Network**: Public IP hoặc domain name

### Software Requirements

```bash
# Docker
Docker version 20.10+
Docker Compose version 2.0+

# Git
Git version 2.0+

# (Optional) Nginx nếu không dùng Docker Nginx
Nginx 1.18+
```

### Cài Đặt Docker

#### Ubuntu/Debian

```bash
# Remove old versions
sudo apt-get remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

#### Kiểm Tra Cài Đặt

```bash
docker --version
docker compose version
```

---

## 📁 Cấu Trúc Production

```
vicc/
├── backend/
│   ├── src/
│   ├── Dockerfile              # ✨ Build backend image
│   ├── .dockerignore
│   ├── .env.production         # ⚠️ Backend production config
│   └── package.json
├── datacore-factory/
│   ├── src/
│   ├── Dockerfile              # ✨ Build frontend image
│   ├── nginx.conf              # ✨ Nginx config cho frontend
│   ├── .dockerignore
│   ├── .env.production         # ⚠️ Frontend production config
│   └── package.json
├── nginx/
│   ├── nginx.conf              # ✨ Reverse proxy config
│   ├── ssl/                    # SSL certificates
│   └── README.md
├── docker-compose.production.yml  # ✨ Production orchestration
├── .env.production             # ⚠️ Docker Compose env vars
├── .env.production.example
├── deploy.sh                   # ✨ Auto deploy script
├── rollback.sh                 # ✨ Rollback script
├── backup.sh                   # ✨ Database backup
├── restore.sh                  # ✨ Database restore
└── PRODUCTION_DEPLOY_GUIDE.md  # 📖 Tài liệu này
```

---

## 🔧 Chuẩn Bị Deploy

### 1. Clone Repository

```bash
# Clone code về server
git clone https://github.com/your-org/vicc.git
cd vicc

# Checkout branch production (nếu có)
git checkout production
```

### 2. Cấu Hình Environment Variables

#### a. Docker Compose Environment

```bash
cp .env.production.example .env.production
nano .env.production
```

Cấu hình:
```env
VITE_API_URL=https://your-domain.com/api  # Hoặc http://your-ip:5000/api

# MySQL (nếu dùng Docker MySQL)
DB_ROOT_PASSWORD=your_very_strong_root_password
DB_DATABASE=vicc_production
DB_USER=vicc_user
DB_PASSWORD=your_very_strong_user_password
```

#### b. Backend Environment

```bash
nano backend/.env.production
```

Cấu hình:
```env
PORT=5000
NODE_ENV=production

# Database
DB_HOST=db                          # Nếu dùng Docker MySQL
# DB_HOST=vnicc-lxwb001vh.isrk.local  # Nếu dùng external DB
DB_PORT=3306
DB_DATABASE=vicc_production
DB_USER=vicc_user
DB_PASSWORD=your_very_strong_user_password

# JWT - BẮT BUỘC THAY ĐỔI!
JWT_SECRET=$(openssl rand -base64 64)  # Tạo random secret
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://your-domain.com
```

**Tạo JWT Secret mạnh:**
```bash
openssl rand -base64 64
```

#### c. Frontend Environment

```bash
nano datacore-factory/.env.production
```

Cấu hình:
```env
VITE_API_URL=https://your-domain.com/api
# Hoặc: VITE_API_URL=http://your-ip:5000/api
```

### 3. Cấu Hình SSL (Optional - Khuyến nghị)

#### Option 1: Self-Signed Certificate (Cho testing)

```bash
cd nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/C=VN/ST=HCM/L=HCM/O=DataCore/OU=IT/CN=your-domain.com"
```

#### Option 2: Let's Encrypt (Khuyến nghị cho production)

```bash
# Cài đặt Certbot
sudo apt-get install certbot

# Tạo certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Copy certificates vào nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
```

#### Cập nhật domain trong nginx.conf

```bash
nano nginx/nginx.conf
```

Thay đổi:
```nginx
server_name your-domain.com;  # Đổi thành domain của bạn
```

---

## 🚀 Deploy Lần Đầu

### Option 1: Sử dụng Deploy Script (Khuyến nghị)

```bash
# Make script executable
chmod +x deploy.sh

# Run deploy
./deploy.sh
```

Script sẽ tự động:
1. Kiểm tra environment files
2. Build Docker images
3. Start containers
4. Run health checks

### Option 2: Manual Deploy

```bash
# 1. Build images
docker compose -f docker-compose.production.yml build

# 2. Start containers
docker compose -f docker-compose.production.yml up -d

# 3. Check status
docker compose -f docker-compose.production.yml ps

# 4. View logs
docker compose -f docker-compose.production.yml logs -f
```

### Kiểm Tra Deployment

```bash
# Check backend health
curl http://localhost:5000/health

# Check frontend
curl http://localhost/health

# Check MySQL
docker exec vicc-mysql-prod mysql -u root -p -e "SHOW DATABASES;"
```

### Truy Cập Ứng Dụng

- **Frontend**: http://your-domain.com (hoặc http://your-ip)
- **Backend API**: http://your-domain.com/api (hoặc http://your-ip:5000)

---

## 🔄 Cập Nhật Production

### Cập Nhật Code Mới

```bash
# 1. Pull latest code
git pull origin main

# 2. Run deploy script
./deploy.sh

# Hoặc manual:
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml build --no-cache
docker compose -f docker-compose.production.yml up -d
```

### Rollback Về Phiên Bản Trước

```bash
# Sử dụng rollback script
./rollback.sh

# Hoặc manual:
git log --oneline -n 5
git checkout <commit-hash>
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml up -d
```

### Zero-Downtime Deployment (Nâng cao)

```bash
# 1. Build new images
docker compose -f docker-compose.production.yml build

# 2. Start new containers (với scale)
docker compose -f docker-compose.production.yml up -d --scale backend=2

# 3. Stop old container
docker stop vicc-backend-prod-old

# 4. Scale back to 1
docker compose -f docker-compose.production.yml up -d --scale backend=1
```

---

## 💾 Quản Lý Database

### Backup Database

```bash
# Sử dụng backup script
./backup.sh

# Hoặc manual:
docker exec vicc-mysql-prod mysqldump \
  -u vicc_user \
  -p \
  vicc_production > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Sử dụng restore script
./restore.sh

# Hoặc manual:
docker exec -i vicc-mysql-prod mysql \
  -u vicc_user \
  -p \
  vicc_production < backup_20250105_120000.sql
```

### Auto Backup với Cron

```bash
# Edit crontab
crontab -e

# Thêm dòng sau (backup mỗi ngày lúc 2AM)
0 2 * * * /path/to/vicc/backup.sh >> /var/log/vicc-backup.log 2>&1
```

### Database Migration

```bash
# Nếu có migration scripts
docker exec vicc-backend-prod npm run migrate

# Hoặc chạy SQL scripts
docker exec -i vicc-mysql-prod mysql -u vicc_user -p vicc_production < migrations/001_add_approval.sql
```

---

## 📊 Monitoring & Logging

### Xem Logs

```bash
# All services
docker compose -f docker-compose.production.yml logs -f

# Specific service
docker compose -f docker-compose.production.yml logs -f backend
docker compose -f docker-compose.production.yml logs -f frontend

# Last 100 lines
docker compose -f docker-compose.production.yml logs --tail=100 backend
```

### Container Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats vicc-backend-prod vicc-frontend-prod
```

### Health Checks

```bash
# Backend
curl http://localhost:5000/health

# Frontend
curl http://localhost/health

# Database
docker exec vicc-mysql-prod mysqladmin ping -h localhost -u root -p
```

### Setup Monitoring với Prometheus + Grafana (Nâng cao)

Thêm vào `docker-compose.production.yml`:

```yaml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

---

## 🔍 Troubleshooting

### Container không start

```bash
# Check logs
docker compose -f docker-compose.production.yml logs backend

# Check container status
docker ps -a

# Inspect container
docker inspect vicc-backend-prod
```

### Database connection error

```bash
# Check database is running
docker ps | grep mysql

# Check database logs
docker logs vicc-mysql-prod

# Test connection
docker exec vicc-backend-prod node -e "console.log('Testing DB connection...')"
```

### Frontend không load được

```bash
# Check nginx logs
docker logs vicc-frontend-prod

# Check nginx config
docker exec vicc-frontend-prod nginx -t

# Reload nginx
docker exec vicc-frontend-prod nginx -s reload
```

### CORS Errors

Kiểm tra `backend/.env.production`:
```env
CORS_ORIGIN=https://your-domain.com
```

Và restart backend:
```bash
docker compose -f docker-compose.production.yml restart backend
```

### Out of Memory

```bash
# Check memory usage
docker stats

# Increase container memory limit trong docker-compose.yml:
services:
  backend:
    mem_limit: 1g
    mem_reservation: 512m
```

### Port conflicts

```bash
# Check what's using the port
sudo lsof -i :5000
sudo lsof -i :80

# Kill process or change port in docker-compose.yml
```

---

## 🔒 Security Checklist

### Before Going Live

- [ ] Đổi `JWT_SECRET` thành chuỗi random mạnh
- [ ] Đổi tất cả database passwords
- [ ] Cấu hình CORS chỉ cho phép domain production
- [ ] Enable HTTPS với SSL certificate
- [ ] Tắt debug mode (`NODE_ENV=production`)
- [ ] Cấu hình firewall:
  ```bash
  sudo ufw allow 22/tcp      # SSH
  sudo ufw allow 80/tcp      # HTTP
  sudo ufw allow 443/tcp     # HTTPS
  sudo ufw enable
  ```
- [ ] Giới hạn rate limiting
- [ ] Enable Docker logging
- [ ] Backup database định kỳ
- [ ] Không expose MySQL port ra ngoài (comment port trong docker-compose.yml)
- [ ] Sử dụng secrets management cho sensitive data
- [ ] Keep Docker và system packages updated

### Environment Files Security

```bash
# NEVER commit these files to Git:
echo "*.env.production" >> .gitignore
echo ".env.production" >> .gitignore

# Secure permissions
chmod 600 backend/.env.production
chmod 600 datacore-factory/.env.production
chmod 600 .env.production
```

### SSL/TLS Best Practices

- Sử dụng TLS 1.2 trở lên
- Strong cipher suites
- Enable HSTS
- Certificate pinning (optional)

---

## 📝 Maintenance Tasks

### Weekly

- [ ] Check logs for errors
- [ ] Review resource usage
- [ ] Check backup integrity

### Monthly

- [ ] Update Docker images
- [ ] Review security patches
- [ ] Database optimization
- [ ] Cleanup old Docker images: `docker system prune -a`

### Quarterly

- [ ] Full system backup
- [ ] Disaster recovery test
- [ ] Security audit

---

## 🆘 Support & Contact

### Useful Commands Reference

```bash
# Start services
docker compose -f docker-compose.production.yml up -d

# Stop services
docker compose -f docker-compose.production.yml down

# Restart service
docker compose -f docker-compose.production.yml restart backend

# View logs
docker compose -f docker-compose.production.yml logs -f

# Execute command in container
docker exec -it vicc-backend-prod sh

# Database backup
./backup.sh

# Database restore
./restore.sh

# Deploy update
./deploy.sh

# Rollback
./rollback.sh
```

### Emergency Contacts

- **DevOps Team**: devops@datacore.com
- **Database Admin**: dba@datacore.com
- **Security**: security@datacore.com

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Tác giả**: DataCore DevOps Team
**Ngày tạo**: 2025-01-05
**Phiên bản**: 1.0
**License**: Internal Use Only
