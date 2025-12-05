# Nginx SSL Setup

## Tạo Self-Signed Certificate (Cho testing)

```bash
cd nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/C=VN/ST=HCM/L=HCM/O=DataCore/OU=IT/CN=localhost"
```

## Sử dụng Let's Encrypt (Cho production thật)

### 1. Cài đặt Certbot
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

### 2. Tạo SSL certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. Auto-renewal
Certbot tự động setup cron job, kiểm tra:
```bash
sudo certbot renew --dry-run
```

## Kiểm tra config
```bash
docker exec vicc-nginx-prod nginx -t
```

## Reload nginx
```bash
docker exec vicc-nginx-prod nginx -s reload
```
