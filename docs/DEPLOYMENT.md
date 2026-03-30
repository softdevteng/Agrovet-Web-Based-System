# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database backups scheduled
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Monitoring setup
- [ ] Rollback plan established
- [ ] Team notified of deployment

## Environment Setup

### Production Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/sk_agrovet_prod
DB_HOST=prod-db.example.com
DB_NAME=sk_agrovet_prod
DB_USER=agrovet_user
DB_PASSWORD=strong_password_here

# Backend
NODE_ENV=production
BACKEND_PORT=5000
BACKEND_URL=https://api.skagrovet.com
JWT_SECRET=very_long_random_secret_key_change_me
JWT_EXPIRE=7d

# Frontend
REACT_APP_API_URL=https://api.skagrovet.com/api
REACT_APP_ENV=production

# Security
CORS_ORIGIN=https://app.skagrovet.com
ALLOWED_HOSTS=app.skagrovet.com,www.skagrovet.com

# External Services
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxx
SMTP_FROM=noreply@skagrovet.com

# SMS Service
SMS_PROVIDER=africastalking
AFRICASTALKING_API_KEY=xxx
AFRICASTALKING_USERNAME=xxx

# M-Pesa
MPESA_CONSUMER_KEY=xxx
MPESA_CONSUMER_SECRET=xxx
MPESA_SHORTCODE=123456
MPESA_PASSKEY=xxx
```

## AWS Deployment (Recommended)

### Infrastructure Setup

1. **RDS PostgreSQL**
   - Multi-AZ deployment
   - Automatic backups with 30-day retention
   - Read replicas for scaling
   - Enhanced monitoring

2. **ECS Fargate**
   - Container orchestration
   - Auto-scaling
   - Load balancing
   - CloudWatch logging

3. **CloudFront**
   - CDN for static assets
   - Cache optimization
   - DDoS protection

4. **ALB (Application Load Balancer)**
   - SSL/TLS termination
   - Path-based routing
   - Health checks
   - Sticky sessions for API

### Deployment Steps

1. **Build Docker Images**
```bash
docker build -t 123456789.dkr.ecr.us-east-1.amazonaws.com/sk-agrovet-api:latest ./backend
docker build -t 123456789.dkr.ecr.us-east-1.amazonaws.com/sk-agrovet-ui:latest ./frontend

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/sk-agrovet-api:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/sk-agrovet-ui:latest
```

2. **Update ECS Task Definitions**
   - Point to latest images
   - Set environment variables
   - Configure logging

3. **Deploy to ECS**
```bash
aws ecs update-service \
  --cluster sk-agrovet-prod \
  --service sk-agrovet-api \
  --force-new-deployment
```

4. **Run Database Migrations**
```bash
aws ecs run-task \
  --cluster sk-agrovet-prod \
  --task-definition sk-agrovet-migration \
  --launch-type FARGATE
```

## Docker Deployment

### Production Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    restart: always
    volumes:
      - /data/postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    image: sk-agrovet-api:${VERSION}
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    ports:
      - "5000:5000"

  ui:
    image: sk-agrovet-ui:${VERSION}
    environment:
      REACT_APP_API_URL: https://api.skagrovet.com/api
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

### Deployment Command
```bash
VERSION=1.0.0 docker-compose -f docker-compose.prod.yml up -d
```

## Manual Server Deployment

### Prerequisites
- Ubuntu 20.04+ or similar Linux
- Node.js 18+
- PostgreSQL 12+
- Nginx
- SSL certificate (Let's Encrypt)

### System Setup

1. **Install Dependencies**
```bash
sudo apt update
sudo apt install -y nodejs npm postgresql nginx git curl

# Install Node Version Manager (asdf or nvm)
curl https://asdf-vm.com/install.sh | bash
```

2. **Create Application User**
```bash
sudo useradd -m -s /bin/bash agrovet
sudo su - agrovet
```

3. **Clone Repository**
```bash
cd ~
git clone https://github.com/skagrovet/app.git
cd app
```

4. **Setup Environment**
```bash
cp .env.example .env
nano .env
# Edit with production values
```

5. **Install Dependencies**
```bash
cd backend
npm ci
npm run build

cd ../frontend
npm ci
npm run build
```

6. **Database Setup**
```bash
cd ../backend
npm run db:migrate
npm run db:seed
```

7. **Configure Nginx**
```nginx
upstream api {
    server localhost:5000;
}

server {
    listen 443 ssl http2;
    server_name api.skagrovet.com;

    ssl_certificate /etc/letsencrypt/live/api.skagrovet.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.skagrovet.com/privkey.pem;

    location /api {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name app.skagrovet.com;

    ssl_certificate /etc/letsencrypt/live/app.skagrovet.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.skagrovet.com/privkey.pem;

    root /home/agrovet/app/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
    }
}

server {
    listen 80;
    server_name api.skagrovet.com app.skagrovet.com;
    return 301 https://$server_name$request_uri;
}
```

8. **Setup PM2**
```bash
npm install -g pm2

# Ecosystem config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'sk-agrovet-api',
    script: './dist/index.js',
    cwd: '/home/agrovet/app/backend',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## Monitoring & Logging

### Setup CloudWatch (AWS)
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### Setup Local Logging
```bash
# Logs location
tail -f /var/log/app/api.log
tail -f /var/log/app/error.log
```

### Key Metrics to Monitor
- CPU usage
- Memory usage
- Disk space
- Database connections
- API response time
- Error rate
- Transaction volume

## Backup Strategy

### Database Backups
```bash
# Daily automated backups
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/sk_agrovet_$(date +\%Y\%m\%d).sql.gz

# Keep for 30 days
find /backups -name "sk_agrovet_*.sql.gz" -mtime +30 -delete
```

### Restore from Backup
```bash
gunzip -c /backups/sk_agrovet_20261001.sql.gz | psql $DATABASE_URL
```

## SSL/TLS Certificate

### Install Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d api.skagrovet.com -d app.skagrovet.com

# Auto-renew
sudo systemctl enable certbot.timer
```

## Performance Tuning

### Database Optimization
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM ai_services WHERE service_date > NOW() - INTERVAL '30 days';

-- Vacuum regular maintenance
VACUUM ANALYZE;

-- Set connection pool size
max_connections = 200
```

### API Performance
- Enable HTTP compression (gzip)
- Use caching headers
- Implement rate limiting
- Use CDN for static assets
- Enable database query cache

## Rollback Procedure

1. **Identify Issue**
   - Check logs
   - Monitor metrics
   - Review recent changes

2. **Stop Deployment**
   ```bash
   pm2 stop sk-agrovet-api
   ```

3. **Revert to Previous Version**
   ```bash
   git checkout previous-branch
   cd backend && npm run build && npm run db:migrate
   pm2 start sk-agrovet-api
   ```

4. **Verify**
   - Check API health: `/api/health`
   - Monitor error logs
   - Verify database state

## Disaster Recovery

### RTO/RPO Targets
- RTO: 4 hours
- RPO: 1 hour

### Recovery Steps
1. Restore database from latest backup
2. Rebuild application containers
3. Restore file uploads from S3
4. Run migrations
5. Verify system functionality
6. Update DNS if needed

## Post-Deployment

1. **Verify Deployment**
   - Check API health endpoint
   - Test critical workflows
   - Monitor error logs
   - Verify database connectivity

2. **Performance Baseline**
   - Record response times
   - Document throughput
   - Note resource usage

3. **Notify Stakeholders**
   - Confirm deployment success
   - Share release notes
   - Document known issues

## Support & Troubleshooting

### Common Issues

**API not responding**
- Check PM2 logs: `pm2 logs sk-agrovet-api`
- Verify database connection
- Check network connectivity
- Review recent changes

**High memory usage**
- Check for memory leaks
- Review active connections
- Restart services if necessary
- Scale up resources

**Database locked**
- Check for long-running queries
- Review active connections
- Analyze lock contention
- Consider upgrading hardware

**SSL Certificate Issues**
- Verify certificate validity
- Check renewal logs
- Update Nginx configuration
- Restart Nginx service
