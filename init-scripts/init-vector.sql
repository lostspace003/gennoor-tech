-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create leads table with all fields
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    industry VARCHAR(255),
    location VARCHAR(255),
    website VARCHAR(500),
    linkedin VARCHAR(500),
    source VARCHAR(100) DEFAULT 'manual',
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    tags JSONB DEFAULT '[]',
    notes TEXT,
    assigned_to VARCHAR(255),
    score INTEGER DEFAULT 50,
    company_size VARCHAR(50),
    revenue VARCHAR(50),
    last_contact TIMESTAMP,
    next_follow_up TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    sheet_name VARCHAR(255),

    -- Research data stored as JSONB
    research_data JSONB,

    -- Embedding vector for semantic search (384 dimensions for all-MiniLM-L6-v2)
    embedding vector(384),

    -- Full text search
    search_vector tsvector
);

-- Create indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_company ON leads(company);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_embedding ON leads USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_leads_search ON leads USING GIN (search_vector);
CREATE INDEX idx_leads_tags ON leads USING GIN (tags);
CREATE INDEX idx_leads_research ON leads USING GIN (research_data);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.company, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.designation, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.industry, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.notes, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector
CREATE TRIGGER update_leads_search_vector
    BEFORE INSERT OR UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- email, call, meeting, note
    direction VARCHAR(20), -- inbound, outbound
    subject VARCHAR(500),
    content TEXT,
    attachments JSONB DEFAULT '[]',
    from_email VARCHAR(255),
    to_emails JSONB DEFAULT '[]',
    cc_emails JSONB DEFAULT '[]',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

CREATE INDEX idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp DESC);

-- AI Interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255),
    message TEXT,
    response TEXT,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    tokens_used INTEGER,
    model VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_email);
CREATE INDEX idx_ai_interactions_lead ON ai_interactions(lead_id);
CREATE INDEX idx_ai_interactions_created ON ai_interactions(created_at DESC);

-- Email campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT,
    attachments JSONB DEFAULT '[]',
    recipients JSONB DEFAULT '[]', -- Array of lead IDs
    status VARCHAR(50) DEFAULT 'draft',
    sent_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    replied_count INTEGER DEFAULT 0,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    scheduled_at TIMESTAMP
);

CREATE INDEX idx_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_campaigns_created_at ON email_campaigns(created_at DESC);

-- Email tracking table
CREATE TABLE IF NOT EXISTS email_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    email_address VARCHAR(255),
    status VARCHAR(50), -- sent, opened, clicked, replied, bounced
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    replied_at TIMESTAMP,
    bounce_reason TEXT
);

CREATE INDEX idx_tracking_campaign ON email_tracking(campaign_id);
CREATE INDEX idx_tracking_lead ON email_tracking(lead_id);
CREATE INDEX idx_tracking_status ON email_tracking(status);

-- Embeddings metadata table
CREATE TABLE IF NOT EXISTS embeddings_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50), -- lead, document, email
    entity_id UUID,
    content TEXT,
    embedding_model VARCHAR(100),
    embedding_dimensions INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    indexed_at TIMESTAMP
);

CREATE INDEX idx_embeddings_entity ON embeddings_metadata(entity_type, entity_id);
CREATE INDEX idx_embeddings_indexed ON embeddings_metadata(indexed_at);

-- Documents table for storing uploaded files
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(500),
    content_type VARCHAR(100),
    size_bytes BIGINT,
    storage_path VARCHAR(1000), -- Azure Blob Storage path
    content TEXT, -- Extracted text content
    metadata JSONB,
    embedding vector(384),
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_created ON documents(created_at DESC);
CREATE INDEX idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops);

-- Scheduled tasks table
CREATE TABLE IF NOT EXISTS scheduled_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_type VARCHAR(50), -- index, email_campaign, follow_up
    schedule VARCHAR(100), -- Cron expression
    config JSONB,
    last_run TIMESTAMP,
    next_run TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON scheduled_tasks(status);
CREATE INDEX idx_tasks_next_run ON scheduled_tasks(next_run);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255)
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
    ('embedding_model', '"BAAI/bge-small-en-v1.5"'),
    ('chunk_size', '512'),
    ('chunk_overlap', '50'),
    ('index_schedule', '"0 7 * * 6"'),
    ('azure_storage_enabled', 'true'),
    ('bing_search_enabled', 'true'),
    ('gpt_model', '"gpt-4-turbo-preview"'),
    ('max_tokens', '1500')
ON CONFLICT (key) DO NOTHING;

-- Function to find similar leads using embeddings
CREATE OR REPLACE FUNCTION find_similar_leads(
    query_embedding vector(384),
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    lead_id UUID,
    name VARCHAR,
    company VARCHAR,
    email VARCHAR,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        id as lead_id,
        leads.name,
        leads.company,
        leads.email,
        1 - (embedding <=> query_embedding) as similarity
    FROM leads
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> query_embedding
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search leads using full text search
CREATE OR REPLACE FUNCTION search_leads(
    search_query TEXT,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    lead_id UUID,
    name VARCHAR,
    company VARCHAR,
    email VARCHAR,
    rank FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        id as lead_id,
        leads.name,
        leads.company,
        leads.email,
        ts_rank(search_vector, plainto_tsquery('english', search_query)) as rank
    FROM leads
    WHERE search_vector @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create view for lead analytics
CREATE OR REPLACE VIEW lead_analytics AS
SELECT
    status,
    priority,
    assigned_to,
    COUNT(*) as count,
    AVG(score) as avg_score,
    DATE(created_at) as date
FROM leads
GROUP BY status, priority, assigned_to, DATE(created_at);

-- Create view for conversation analytics
CREATE OR REPLACE VIEW conversation_analytics AS
SELECT
    l.company,
    l.status,
    COUNT(c.id) as conversation_count,
    MAX(c.timestamp) as last_conversation,
    STRING_AGG(DISTINCT c.type, ', ') as conversation_types
FROM leads l
LEFT JOIN conversations c ON l.id = c.lead_id
GROUP BY l.id, l.company, l.status;

-- Create role if it doesn't exist and grant permissions
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'gennoor') THEN
        CREATE ROLE gennoor WITH LOGIN PASSWORD 'gennoor2024';
    END IF;
END
$$;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gennoor;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gennoor;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO gennoor;