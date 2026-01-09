# ☁️ Cloud Deployment Guide - Multi-Tenant LMS

This guide provides detailed instructions for deploying your Multi-Tenant LMS to major cloud platforms.

---

## Table of Contents
1. [AWS (Amazon Web Services)](#aws-deployment)
2. [Azure (Microsoft Azure)](#azure-deployment)
3. [GCP (Google Cloud Platform)](#gcp-deployment)
4. [Heroku](#heroku-deployment)
5. [DigitalOcean](#digitalocean-deployment)

---

## AWS Deployment

### Architecture Overview
- **ECS/EKS**: Container orchestration
- **RDS MySQL**: Managed database
- **Application Load Balancer**: Traffic distribution
- **S3 + CloudFront**: Frontend hosting
- **ECR**: Container registry
- **Route 53**: DNS management
- **Certificate Manager**: SSL/TLS

### Prerequisites
```powershell
# Install AWS CLI
choco install awscli

# Configure AWS credentials
aws configure
```

### Step 1: Setup RDS MySQL Database

```powershell
# Create RDS MySQL instance
aws rds create-db-instance `
    --db-instance-identifier lms-production-db `
    --db-instance-class db.t3.medium `
    --engine mysql `
    --engine-version 8.0 `
    --master-username admin `
    --master-user-password "YourSecurePassword123!" `
    --allocated-storage 100 `
    --storage-type gp3 `
    --vpc-security-group-ids sg-xxxxxxxxx `
    --db-subnet-group-name your-subnet-group `
    --backup-retention-period 7 `
    --multi-az `
    --publicly-accessible false
```

### Step 2: Create ECR Repositories

```powershell
# Create repositories for each service
$services = @(
    "discovery-server",
    "api-gateway",
    "user-service",
    "course-service",
    "assessment-service",
    "notification-service",
    "attendance-service",
    "leave-service",
    "frontend"
)

foreach ($service in $services) {
    aws ecr create-repository --repository-name multi-tenant-lms/$service
}
```

### Step 3: Build and Push Docker Images

```powershell
# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push each service
$accountId = "<your-account-id>"
$region = "us-east-1"

foreach ($service in $services) {
    Write-Host "Building $service..."
    
    if ($service -eq "frontend") {
        docker build -t multi-tenant-lms/$service ./frontend-react
    } else {
        docker build -t multi-tenant-lms/$service ./$service
    }
    
    docker tag multi-tenant-lms/$service:latest "$accountId.dkr.ecr.$region.amazonaws.com/multi-tenant-lms/$service:latest"
    docker push "$accountId.dkr.ecr.$region.amazonaws.com/multi-tenant-lms/$service:latest"
}
```

### Step 4: Create ECS Cluster

```powershell
# Create ECS cluster
aws ecs create-cluster --cluster-name lms-production-cluster

# Or use EKS for Kubernetes
eksctl create cluster `
    --name lms-cluster `
    --region us-east-1 `
    --nodegroup-name standard-workers `
    --node-type t3.medium `
    --nodes 3 `
    --nodes-min 2 `
    --nodes-max 5 `
    --managed
```

### Step 5: Deploy with ECS (Task Definitions)

Create task definitions for each service. Example for user-service:

```json
{
  "family": "user-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "user-service",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/multi-tenant-lms/user-service:latest",
      "portMappings": [
        {
          "containerPort": 8081,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "prod"
        },
        {
          "name": "SPRING_DATASOURCE_URL",
          "value": "jdbc:mysql://your-rds-endpoint:3306/lms_user_db"
        },
        {
          "name": "EUREKA_CLIENT_SERVICEURL_DEFAULTZONE",
          "value": "http://discovery-server.local:8761/eureka/"
        }
      ],
      "secrets": [
        {
          "name": "SPRING_DATASOURCE_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account-id:secret:db-password"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account-id:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/user-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 6: Deploy Frontend to S3 + CloudFront

```powershell
# Build frontend
cd frontend-react
npm install
npm run build

# Create S3 bucket
aws s3 mb s3://your-lms-frontend

# Enable static website hosting
aws s3 website s3://your-lms-frontend --index-document index.html --error-document index.html

# Upload build files
aws s3 sync ./dist s3://your-lms-frontend --delete

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json

# Invalidate cache after updates
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Step 7: Setup Application Load Balancer

```powershell
# Create ALB
aws elbv2 create-load-balancer `
    --name lms-alb `
    --subnets subnet-xxxxxxxx subnet-yyyyyyyy `
    --security-groups sg-xxxxxxxx `
    --scheme internet-facing

# Create target groups for each service
aws elbv2 create-target-group `
    --name api-gateway-tg `
    --protocol HTTP `
    --port 8080 `
    --vpc-id vpc-xxxxxxxx `
    --health-check-path /actuator/health

# Create listener
aws elbv2 create-listener `
    --load-balancer-arn arn:aws:elasticloadbalancing:... `
    --protocol HTTPS `
    --port 443 `
    --certificates CertificateArn=arn:aws:acm:... `
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

### Estimated AWS Monthly Cost
- **ECS Fargate**: ~$150-300 (8 services)
- **RDS MySQL (db.t3.medium)**: ~$60
- **Application Load Balancer**: ~$25
- **S3 + CloudFront**: ~$10-30
- **ECR**: ~$1
- **Total**: ~$250-420/month

---

## Azure Deployment

### Architecture Overview
- **AKS**: Azure Kubernetes Service
- **Azure Database for MySQL**: Managed database
- **Application Gateway**: Load balancer
- **Azure Container Registry**: Container registry
- **Azure Blob Storage**: Frontend hosting
- **Azure CDN**: Content delivery

### Prerequisites
```powershell
# Install Azure CLI
choco install azure-cli

# Login to Azure
az login
```

### Step 1: Create Resource Group

```powershell
az group create `
    --name lms-production `
    --location eastus
```

### Step 2: Create Azure Database for MySQL

```powershell
az mysql flexible-server create `
    --resource-group lms-production `
    --name lms-mysql-server `
    --location eastus `
    --admin-user myadmin `
    --admin-password "YourPassword123!" `
    --sku-name Standard_B2s `
    --tier Burstable `
    --version 8.0.21 `
    --storage-size 128 `
    --backup-retention 7 `
    --high-availability Enabled

# Create databases
$databases = @("lms_user_db", "lms_course_db", "lms_assessment_db", "lms_notification_db", "lms_attendance_db", "lms_leave_db")

foreach ($db in $databases) {
    az mysql flexible-server db create `
        --resource-group lms-production `
        --server-name lms-mysql-server `
        --database-name $db
}
```

### Step 3: Create Azure Container Registry

```powershell
az acr create `
    --resource-group lms-production `
    --name lmsregistry `
    --sku Standard

# Login to ACR
az acr login --name lmsregistry
```

### Step 4: Build and Push Images

```powershell
$services = @("discovery-server", "api-gateway", "user-service", "course-service", "assessment-service", "notification-service", "attendance-service", "leave-service", "frontend")

foreach ($service in $services) {
    Write-Host "Building and pushing $service..."
    
    if ($service -eq "frontend") {
        az acr build --registry lmsregistry --image multi-tenant-lms/$service:latest ./frontend-react
    } else {
        az acr build --registry lmsregistry --image multi-tenant-lms/$service:latest ./$service
    }
}
```

### Step 5: Create AKS Cluster

```powershell
az aks create `
    --resource-group lms-production `
    --name lms-aks-cluster `
    --node-count 3 `
    --vm-set-type VirtualMachineScaleSets `
    --node-vm-size Standard_DS2_v2 `
    --enable-cluster-autoscaler `
    --min-count 2 `
    --max-count 5 `
    --attach-acr lmsregistry `
    --enable-addons monitoring

# Get credentials
az aks get-credentials `
    --resource-group lms-production `
    --name lms-aks-cluster
```

### Step 6: Deploy to AKS

Update image references in k8s-manifests-complete.yml:
```yaml
image: lmsregistry.azurecr.io/multi-tenant-lms/user-service:latest
```

```powershell
kubectl apply -f k8s-manifests-complete.yml

# Get external IP
kubectl get service api-gateway -n lms-namespace
```

### Step 7: Setup Azure Blob Storage for Frontend

```powershell
# Create storage account
az storage account create `
    --name lmsfrontendstorage `
    --resource-group lms-production `
    --location eastus `
    --sku Standard_LRS `
    --kind StorageV2

# Enable static website hosting
az storage blob service-properties update `
    --account-name lmsfrontendstorage `
    --static-website `
    --index-document index.html `
    --error-document-404-path index.html

# Upload files
cd frontend-react
npm run build
az storage blob upload-batch `
    --account-name lmsfrontendstorage `
    --source ./dist `
    --destination '$web'

# Get website URL
az storage account show `
    --name lmsfrontendstorage `
    --query "primaryEndpoints.web" `
    --output tsv
```

### Estimated Azure Monthly Cost
- **AKS (3 nodes, Standard_DS2_v2)**: ~$220
- **Azure Database for MySQL**: ~$80
- **Application Gateway**: ~$20
- **Azure Container Registry**: ~$5
- **Blob Storage + CDN**: ~$10
- **Total**: ~$335/month

---

## GCP Deployment

### Architecture Overview
- **GKE**: Google Kubernetes Engine
- **Cloud SQL**: MySQL database
- **Cloud Load Balancing**: Traffic distribution
- **Container Registry**: Container images
- **Cloud Storage + CDN**: Frontend hosting

### Prerequisites
```powershell
# Install Google Cloud SDK
choco install gcloudsdk

# Initialize and login
gcloud init
```

### Step 1: Create GKE Cluster

```powershell
gcloud container clusters create lms-cluster `
    --num-nodes=3 `
    --machine-type=n1-standard-2 `
    --zone=us-central1-a `
    --enable-autoscaling `
    --min-nodes=2 `
    --max-nodes=5 `
    --enable-stackdriver-kubernetes
```

### Step 2: Create Cloud SQL Instance

```powershell
gcloud sql instances create lms-mysql `
    --tier=db-n1-standard-2 `
    --region=us-central1 `
    --database-version=MYSQL_8_0 `
    --storage-size=100GB `
    --storage-type=SSD `
    --backup `
    --availability-type=regional

# Set root password
gcloud sql users set-password root `
    --host=% `
    --instance=lms-mysql `
    --password="YourSecurePassword123!"

# Create databases
$databases = @("lms_user_db", "lms_course_db", "lms_assessment_db", "lms_notification_db", "lms_attendance_db", "lms_leave_db")

foreach ($db in $databases) {
    gcloud sql databases create $db --instance=lms-mysql
}
```

### Step 3: Build and Push to Container Registry

```powershell
# Configure Docker for GCR
gcloud auth configure-docker

$projectId = "your-project-id"
$services = @("discovery-server", "api-gateway", "user-service", "course-service", "assessment-service", "notification-service", "attendance-service", "leave-service", "frontend")

foreach ($service in $services) {
    Write-Host "Building and pushing $service..."
    
    if ($service -eq "frontend") {
        docker build -t gcr.io/$projectId/multi-tenant-lms-$service ./frontend-react
    } else {
        docker build -t gcr.io/$projectId/multi-tenant-lms-$service ./$service
    }
    
    docker push gcr.io/$projectId/multi-tenant-lms-$service
}
```

### Step 4: Deploy to GKE

Update image references in k8s-manifests-complete.yml:
```yaml
image: gcr.io/your-project-id/multi-tenant-lms-user-service:latest
```

```powershell
# Get cluster credentials
gcloud container clusters get-credentials lms-cluster --zone=us-central1-a

# Deploy
kubectl apply -f k8s-manifests-complete.yml

# Get external IP
kubectl get service api-gateway -n lms-namespace --watch
```

### Step 5: Deploy Frontend to Cloud Storage

```powershell
# Create bucket
gsutil mb gs://your-lms-frontend

# Build frontend
cd frontend-react
npm run build

# Upload files
gsutil -m rsync -r -d ./dist gs://your-lms-frontend

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://your-lms-frontend

# Enable website configuration
gsutil web set -m index.html -e index.html gs://your-lms-frontend
```

### Estimated GCP Monthly Cost
- **GKE (3 nodes, n1-standard-2)**: ~$225
- **Cloud SQL (db-n1-standard-2)**: ~$115
- **Cloud Load Balancer**: ~$20
- **Container Registry**: ~$2
- **Cloud Storage + CDN**: ~$10
- **Total**: ~$372/month

---

## Heroku Deployment

### Quick Deployment (Best for Small-Medium Scale)

### Prerequisites
```powershell
# Install Heroku CLI
choco install heroku-cli

# Login
heroku login
```

### Deploy Each Service

```powershell
# User Service
cd user-service
heroku create lms-user-service
heroku addons:create cleardb:ignite
git init
git add .
git commit -m "Initial commit"
git push heroku master

# Repeat for each service
```

### Estimated Heroku Monthly Cost
- **8 Standard Dynos**: ~$200
- **ClearDB MySQL (Ignite)**: ~$10
- **Total**: ~$210/month

---

## DigitalOcean Deployment

### Using Kubernetes Service

```powershell
# Install doctl
choco install doctl

# Authenticate
doctl auth init

# Create Kubernetes cluster
doctl kubernetes cluster create lms-cluster `
    --region nyc1 `
    --node-pool "name=worker-pool;size=s-2vcpu-4gb;count=3;auto-scale=true;min-nodes=2;max-nodes=5"

# Get kubeconfig
doctl kubernetes cluster kubeconfig save lms-cluster

# Deploy
kubectl apply -f k8s-manifests-complete.yml
```

### Estimated DigitalOcean Monthly Cost
- **Kubernetes (3 nodes, 2vCPU/4GB)**: ~$72
- **Managed MySQL**: ~$15
- **Load Balancer**: ~$12
- **Spaces (CDN)**: ~$5
- **Total**: ~$104/month

---

## Comparison Table

| Platform | Ease of Use | Cost/Month | Scalability | Best For |
|----------|-------------|------------|-------------|----------|
| **AWS** | ⭐⭐⭐ | $250-420 | ⭐⭐⭐⭐⭐ | Enterprise |
| **Azure** | ⭐⭐⭐⭐ | $335 | ⭐⭐⭐⭐⭐ | Enterprise |
| **GCP** | ⭐⭐⭐ | $372 | ⭐⭐⭐⭐⭐ | Enterprise |
| **Heroku** | ⭐⭐⭐⭐⭐ | $210 | ⭐⭐⭐ | Startups |
| **DigitalOcean** | ⭐⭐⭐⭐ | $104 | ⭐⭐⭐⭐ | Small-Medium |

---

## Post-Deployment Checklist

- [ ] SSL/TLS certificates configured
- [ ] Domain name configured
- [ ] Database backups enabled
- [ ] Monitoring and alerting setup
- [ ] Auto-scaling configured
- [ ] Security groups/firewall rules set
- [ ] Environment variables configured
- [ ] Health checks enabled
- [ ] Logging configured
- [ ] CDN enabled for frontend
- [ ] Regular security updates scheduled

---

**Choose the platform that best fits your needs and budget!** 🚀
