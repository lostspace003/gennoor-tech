# Gennoor Lead Management System - Complete Documentation

## 🚀 Overview

The Gennoor Lead Management System is a state-of-the-art AI-powered CRM designed specifically for enterprise B2B lead management, featuring Microsoft Copilot-style AI assistance, advanced semantic search, and automated outreach capabilities.

## 🎯 Key Features

### 1. **AI-Powered Lead Intelligence**
- **GPT-4 Integration**: Advanced conversational AI for lead research and insights
- **Bing Search API**: Real-time web research for company information
- **Foundry Agent**: Custom AI agent for specialized research tasks
- **Semantic Search**: Vector embeddings for intelligent lead discovery
- **Auto-Research**: One-click comprehensive company and contact research

### 2. **Smart Data Management**
- **Flexible Schema**: Accepts Excel files with any column structure
- **Missing Data Handling**: Automatically fills NA for missing fields
- **Multi-Sheet Support**: Pivot view for Excel files with multiple sheets
- **Column Management**: Show/hide columns dynamically
- **Advanced Filtering**: Multi-dimensional filtering with quick presets

### 3. **Email Campaign Automation**
- **AI-Drafted Emails**: GPT-4 powered personalized email generation
- **Template Library**: Pre-built templates for different scenarios
- **Auto CC**: Always CC admin@gennoor.com
- **Tracking**: Open rates, click rates, and reply tracking
- **One-Pager Attachment**: Auto-attach capability documents

### 4. **User Access Control**
- **Microsoft Entra ID**: Enterprise SSO integration
- **Authorized Users**:
  - admin@gennoor.com
  - yusufchaudhary@gennoor.com
  - jalalkhan@gennoor.com
- **Role-Based Permissions**: Different access levels for different users

### 5. **Advanced Features**
- **Weekly Indexing**: Automated Saturday 7 AM IST data indexing
- **Azure Storage**: Secure cloud storage for all documents
- **Redis Caching**: High-performance caching for instant responses
- **Vector Database**: Qdrant/pgvector for semantic search
- **Real-time Updates**: Live synchronization across all users

## 📦 System Architecture

### Microservices Architecture

```yaml
Services:
  1. Main Application (Next.js)
     - Admin Panel UI
     - API Routes
     - Authentication
  
  2. Embedding Service
     - Model: BAAI/bge-small-en-v1.5
     - Chunking: Adaptive strategy
     - Caching: Redis
  
  3. RAG API Service
     - GPT-4 Integration
     - Bing Search
     - Foundry Agent
  
  4. Indexer Service
     - Weekly Schedule
     - Full-text indexing
     - Vector embeddings
  
  5. Database (PostgreSQL + pgvector)
     - Lead storage
     - Vector search
     - Full-text search
  
  6. Vector Database (Qdrant)
     - High-performance similarity search
     - Distributed architecture
  
  7. Cache (Redis)
     - Session management
     - Query caching
  
  8. Storage (Azure Blob)
     - Document storage
     - Excel file archives
```

## 🚀 Deployment Instructions

### Prerequisites

1. **Azure Account** with:
   - App Service
   - Container Registry
   - Storage Account
   - PostgreSQL Database

2. **GitHub Secrets** (Required):
   ```
   AZURE_CREDENTIALS
   AZURE_ACR_USERNAME
   AZURE_ACR_PASSWORD
   AZURE_STORAGE_CONNECTION_STRING
   OPENAI_API_KEY
   BING_API_KEY
   POSTGRES_PASSWORD
   JWT_SECRET
   MICROSOFT_ENTRA_CLIENT_ID
   MICROSOFT_ENTRA_CLIENT_SECRET
   MICROSOFT_ENTRA_TENANT_ID
   ```

### Local Development

1. **Clone Repository**:
   ```bash
   git clone https://github.com/gennoor/gennoor-tech.git
   cd gennoor-tech
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create `.env.local`:
   ```env
   # Database
   POSTGRES_URL="postgresql://user:pass@localhost:5432/leads_db"
   
   # Azure Storage
   AZURE_STORAGE_CONNECTION_STRING="..."
   
   # OpenAI
   OPENAI_API_KEY="sk-..."
   
   # Bing Search
   BING_API_KEY="..."
   
   # Authentication
   NEXTAUTH_SECRET="..."
   NEXTAUTH_URL="http://localhost:3000"
   
   # Microsoft Entra ID
   MICROSOFT_ENTRA_CLIENT_ID="..."
   MICROSOFT_ENTRA_CLIENT_SECRET="..."
   MICROSOFT_ENTRA_TENANT_ID="..."
   
   # Services URLs
   EMBEDDING_SERVICE_URL="http://localhost:8001"
   RAG_API_URL="http://localhost:8002"
   INDEXER_SERVICE_URL="http://localhost:8003"
   ```

4. **Start Services**:
   ```bash
   # Start all services with Docker Compose
   docker-compose -f docker-compose.leads.yml up -d
   
   # Start Next.js application
   npm run dev
   ```

### Production Deployment

1. **Deploy via GitHub Actions**:
   - Push to main branch
   - GitHub Actions automatically builds and deploys

2. **Manual Deployment**:
   ```bash
   # Build Docker images
   docker build -t gennoorcr.azurecr.io/embedding-service:latest ./services/embedding
   docker build -t gennoorcr.azurecr.io/rag-api:latest ./services/rag-api
   docker build -t gennoorcr.azurecr.io/indexer:latest ./services/indexer
   
   # Push to Azure Container Registry
   docker push gennoorcr.azurecr.io/embedding-service:latest
   docker push gennoorcr.azurecr.io/rag-api:latest
   docker push gennoorcr.azurecr.io/indexer:latest
   
   # Deploy to Azure
   az webapp deployment container config --name gennoor-ai-copilot --resource-group gennoor-tech-rg
   ```

## 📊 Database Schema

### Main Tables

1. **leads**: Core lead information
2. **conversations**: Email/call history
3. **ai_interactions**: AI chat history
4. **email_campaigns**: Campaign management
5. **documents**: Uploaded files
6. **embeddings_metadata**: Vector search metadata

## 🔧 API Endpoints

### Lead Management
- `GET /api/admin/leads` - List all leads with pagination
- `POST /api/admin/leads` - Create new lead
- `PUT /api/admin/leads` - Update lead
- `DELETE /api/admin/leads` - Delete lead

### Excel Processing
- `GET /api/admin/leads/load-excel` - Load existing Excel
- `POST /api/admin/leads/load-excel` - Upload new Excel

### AI Research
- `POST /api/admin/leads/foundry-research` - AI research and chat
- `POST /api/admin/leads/research` - Quick research
- `POST /api/admin/leads/chat` - Chat with AI assistant

### Email Campaigns
- `POST /api/admin/leads/send-email` - Send email campaign
- `GET /api/admin/leads/email-templates` - Get templates

## 🎨 UI Components

### Main Components
1. **LeadsTable**: Dynamic data table with sorting/filtering
2. **LeadsAIPanel**: AI chat interface with research capabilities
3. **LeadsFilters**: Advanced filtering interface
4. **LeadsStats**: Real-time statistics dashboard
5. **LeadsHeader**: Navigation and user info

## 🔐 Security Features

1. **Authentication**: Microsoft Entra ID SSO
2. **Authorization**: Email-based access control
3. **Data Encryption**: TLS for transit, AES for storage
4. **API Security**: JWT tokens with expiration
5. **Rate Limiting**: Prevents abuse
6. **Input Validation**: SQL injection prevention
7. **XSS Protection**: Content sanitization

## 📈 Performance Optimizations

1. **Lazy Loading**: Components loaded on demand
2. **Redis Caching**: 24-hour TTL for embeddings
3. **Database Indexing**: Optimized queries
4. **Vector Search**: IVFFlat indexing
5. **Batch Processing**: Efficient bulk operations
6. **CDN**: Static assets served from edge

## 🔄 Weekly Indexing

The system automatically indexes all lead data every Saturday at 7 AM IST:
- Creates fresh embeddings
- Updates search vectors
- Rebuilds indexes
- Clears stale cache

## 📱 Usage Guide

### For Users

1. **Login**: Use your authorized Gennoor email
2. **Upload Leads**: Click "Upload Excel" and select your file
3. **Research**: Click the sparkle icon to research any lead
4. **Chat with AI**: Use the AI panel for questions
5. **Send Campaigns**: Select leads and click "Compose Campaign"
6. **Track Progress**: Monitor status in the pipeline view

### For Administrators

1. **Monitor Usage**: Check AI interaction logs
2. **Manage Users**: Add/remove authorized emails
3. **Configure Settings**: Adjust AI models and parameters
4. **Review Analytics**: Track system performance

## 🚨 Troubleshooting

### Common Issues

1. **Excel Upload Fails**:
   - Check file format (must be .xlsx or .xls)
   - Ensure file size < 50MB
   - Verify column headers are in first row

2. **AI Not Responding**:
   - Check OpenAI API key
   - Verify service health
   - Check rate limits

3. **Search Not Working**:
   - Run manual indexing
   - Check PostgreSQL connection
   - Verify embedding service

## 📞 Support

For support, contact:
- Technical: jalalkhan@gennoor.com
- Business: admin@gennoor.com

## 🔄 Updates

System updates are deployed automatically via GitHub Actions. No downtime required.

---

**Version**: 2.0.0
**Last Updated**: July 2024
**Maintained by**: Gennoor Tech Team