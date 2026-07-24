# Gennoor CRM Implementation Plan

## ✅ Authentication Fix (COMPLETED)
- Fixed login issue for all authorized users
- Removed Azure AD dependency
- Simple credentials-based authentication
- Authorized users can now access: https://gennoor-tech.azurewebsites.net/admin/crm-complete

## 📋 Complete CRM Workflow Implementation

### 1. **5-Stage Sales Pipeline**
```
1. DIAGNOSE → 2. TRAIN → 3. POC → 4. DEVELOPMENT → 5. SUSTAIN
```

### 2. **Lead Research & Intelligence**
- **Company Profile Analysis**: What they want vs what we sell
- **Tech/Non-Tech Classification**: Auto-categorize leads
- **Common Ground Finder**: Identify sales opportunities
- **LinkedIn Integration**: Show clean profile links for connection

### 3. **Document Management**
- **2-Page PDF Deck**: Attached with first email (tech & non-tech versions)
- **Webinar Materials**: Upload poster + details → Generate HTML content
- **Training Materials**: 1-day training content generation
- **YouTube Content**: Share enterprise AI channel with formatted HTML

### 4. **Email Workflow**
```
Draft → AI Finalize → Review → Send
```
- **First Follow-up**: 2-hour webinar (with poster attachment)
- **Second Follow-up**: 1-day free training
- **Context-based Drafting**: AI generates based on conversation
- **Always CC**: admin@gennoor.com

### 5. **Lead Management Features**
- **Start/Stop Process**: Control lead nurturing at any stage
- **Bulk Operations**: Multi-select start/stop
- **Conversation Tracking**: All interactions logged
- **AI Chat Integration**: Finalize content based on discussions

### 6. **Sustain Phase**
- 3-6 months complementary hand-holding
- Project-specific support tracking
- Progress monitoring

## 🚀 Next Implementation Steps

### Phase 1: Core Pipeline (Week 1)
- [ ] Add 5-stage status to lead model
- [ ] Create stage-specific UI components
- [ ] Implement stage transitions

### Phase 2: Document System (Week 2)
- [ ] PDF generation for 2-page decks
- [ ] Webinar poster upload & HTML generation
- [ ] YouTube content formatter
- [ ] Email attachment system

### Phase 3: AI Integration (Week 3)
- [ ] Company research module
- [ ] Tech/Non-tech classifier
- [ ] Email draft AI finalization
- [ ] Chat-to-email converter

### Phase 4: Process Control (Week 4)
- [ ] Start/Stop lead processing
- [ ] Bulk operations
- [ ] Follow-up scheduler
- [ ] Sustain phase tracking

## 📝 Database Schema Updates Needed

```typescript
interface Lead {
  // Existing fields...
  
  // New fields
  stage: 'diagnose' | 'train' | 'poc' | 'development' | 'sustain'
  profileType: 'technical' | 'non-technical' | 'unknown'
  processStatus: 'active' | 'paused' | 'completed'
  
  documents: {
    introDeck?: string // PDF URL
    webinarPoster?: string // PDF URL
    webinarDetails?: string // HTML content
    trainingMaterials?: string // PDF URL
    youtubeContent?: string // HTML with links
  }
  
  followUps: {
    first: {
      scheduled: Date
      completed: boolean
      webinarLink?: string
    }
    second: {
      scheduled: Date
      completed: boolean
      trainingLink?: string
    }
  }
  
  conversations: {
    date: Date
    type: 'email' | 'chat' | 'call'
    content: string
    aiSummary?: string
  }[]
  
  sustainPhase?: {
    startDate: Date
    endDate: Date
    projectDetails: string
    supportProvided: string[]
  }
}
```

## 🎯 Key Features Summary

1. **No WhatsApp/LinkedIn messaging** - Only show LinkedIn profile links
2. **No Botim/Imo integration**
3. **PDF attachments** with first email
4. **Upload → Generate → Review → Send** workflow
5. **Tech/Non-tech** separate materials
6. **AI-powered** draft finalization
7. **Start/Stop** process control
8. **Bulk operations** support
9. **3-6 months** sustain phase

## 🔧 Technical Stack
- Next.js 14 (App Router)
- TypeScript
- NextAuth (Credentials)
- Tailwind CSS
- AI Integration (OpenAI/Claude API)
- PDF Generation (jsPDF/PDFKit)
- Azure App Service deployment

## 📅 Timeline
- **Week 1**: Core pipeline implementation
- **Week 2**: Document management system
- **Week 3**: AI features integration
- **Week 4**: Process control & testing
- **Week 5**: Production deployment & training

## 💡 Success Metrics
- All authorized users can login ✅
- 5-stage pipeline fully functional
- AI research working for all leads
- Email workflow with attachments
- Follow-up automation active
- Sustain phase tracking operational