import type { BlogPost } from '../index'

export const post: BlogPost = {
    slug: 'dataverse-mcp-server-ai-agents',
    title: 'Building a Dataverse MCP Server: Give Your AI Agents Enterprise Data Access',
    excerpt: 'Connect any AI agent to Microsoft Dataverse through MCP. Query tables, create records, and navigate relationships — all through a standardized protocol.',
    tldr: 'An MCP server for Dataverse gives any AI agent — Claude, GPT, Copilot, or open-source models — the ability to query tables, create records, and navigate relationships in your business data through a standardized protocol.',
    content: `
<p>Dataverse is the data backbone of Power Platform, Dynamics 365, and countless enterprise apps. Now imagine giving any AI agent — regardless of provider — secure, structured access to all of it. This comprehensive guide will show you exactly how to build a production-ready Dataverse MCP server that connects AI agents to your enterprise data.</p>

<h2>How a Dataverse MCP Server Works</h2>
<ul>
<li><strong>Authentication</strong> — The server uses OAuth 2.0 with a service principal to connect to Dataverse securely, eliminating the need for user credentials in automated scenarios.</li>
<li><strong>Tool exposure</strong> — It advertises tools like <code>query_table</code>, <code>get_record</code>, <code>create_record</code>, <code>list_tables</code>, and <code>describe_table</code> that AI agents can discover and invoke.</li>
<li><strong>Schema awareness</strong> — The agent can discover what tables and columns exist, understand data types and relationships, then formulate appropriate queries without hardcoded knowledge.</li>
<li><strong>Relationship traversal</strong> — Navigate from Customer to Orders to Products through Dataverse relationships, following foreign keys and lookups automatically.</li>
</ul>

<h2>Architecture Diagram Explained</h2>
<p>The Dataverse MCP server architecture consists of four layers:</p>

<h3>Client Layer</h3>
<p>AI agents (Claude, GPT, custom agents) act as MCP clients. They connect to the server via stdio or HTTP transport and call exposed tools.</p>

<h3>Server Layer</h3>
<p>The MCP server exposes standardized tools and handles tool execution. It translates generic tool calls into Dataverse-specific operations.</p>

<h3>Authentication Layer</h3>
<p>OAuth 2.0 service principal authenticates to Azure AD and obtains access tokens for Dataverse. Tokens are cached and refreshed automatically.</p>

<h3>Dataverse Layer</h3>
<p>The Dataverse Web API executes queries, creates records, and returns results. Row-level security is enforced based on the service principal's permissions.</p>

<div class="blog-diagram">
<svg viewBox="0 0 600 100" xmlns="http://www.w3.org/2000/svg">
<rect x="10" y="25" width="120" height="50" rx="8" fill="#2563eb" /><text x="70" y="48" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">AI Agents</text><text x="70" y="63" text-anchor="middle" fill="#fff" font-size="9">(Claude, GPT, Custom)</text>
<rect x="170" y="25" width="120" height="50" rx="8" fill="#0d9488" /><text x="230" y="48" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">MCP Server</text><text x="230" y="63" text-anchor="middle" fill="#fff" font-size="9">(Tools &amp; Schema)</text>
<rect x="330" y="25" width="120" height="50" rx="8" fill="#475569" /><text x="390" y="48" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">OAuth 2.0</text><text x="390" y="63" text-anchor="middle" fill="#fff" font-size="9">(Azure AD)</text>
<rect x="490" y="25" width="100" height="50" rx="8" fill="#1e293b" /><text x="540" y="48" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">Dataverse</text><text x="540" y="63" text-anchor="middle" fill="#fff" font-size="9">(Web API)</text>
<line x1="130" y1="50" x2="165" y2="50" stroke="#94a3b8" stroke-width="2" /><line x1="290" y1="50" x2="325" y2="50" stroke="#94a3b8" stroke-width="2" /><line x1="450" y1="50" x2="485" y2="50" stroke="#94a3b8" stroke-width="2" />
</svg>
<figcaption>Dataverse MCP server: four layers from AI agent to enterprise data</figcaption>
</div>

<h2>OAuth 2.0 Service Principal Setup Walkthrough</h2>
<p>Before building the server, configure Azure AD authentication:</p>

<h3>Step 1: Create an App Registration</h3>
<p>In Azure Portal, navigate to Azure Active Directory > App registrations > New registration. Name it "Dataverse MCP Server" and leave redirect URI blank (we'll use client credentials flow).</p>

<h3>Step 2: Create a Client Secret</h3>
<p>In your app registration, go to Certificates & secrets > New client secret. Set expiration to 24 months and save the secret value — you won't see it again. Store it in Azure Key Vault or your secret management system.</p>

<h3>Step 3: Grant Dataverse Permissions</h3>
<p>Go to API permissions > Add a permission > Dynamics CRM > Delegated permissions. Add <code>user_impersonation</code>. Click "Grant admin consent" to approve the permission.</p>

<h3>Step 4: Create a Dataverse Application User</h3>
<p>In Power Platform admin center, select your environment > Settings > Users + permissions > Application users. Create a new application user linked to your app registration. Assign appropriate security roles (System Administrator for development, custom roles for production).</p>

<h3>Step 5: Test Authentication</h3>
<p>Use curl to verify you can obtain an access token:</p>
<code>curl -X POST https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token \<br>  -d "client_id={client-id}" \<br>  -d "client_secret={client-secret}" \<br>  -d "grant_type=client_credentials" \<br>  -d "scope=https://{org}.crm.dynamics.com/.default"</code>

<p>If successful, you'll receive an access token. This proves your service principal can authenticate to Dataverse.</p>

<h2>Implementing Each Tool</h2>
<p>Now let's build the MCP server tools one by one:</p>

<h3>Tool 1: list_tables</h3>
<p>Returns all tables in the Dataverse environment:</p>
<code>async function listTables() {<br>  const response = await axios.get(<br>    \`\${dataverseUrl}/api/data/v9.2/EntityDefinitions?$select=LogicalName,DisplayName&$filter=IsCustomizable/Value eq true\`,<br>    { headers: { Authorization: \`Bearer \${accessToken}\` } }<br>  );<br>  return response.data.value.map(entity => ({<br>    name: entity.LogicalName,<br>    displayName: entity.DisplayName?.UserLocalizedLabel?.Label<br>  }));<br>}</code>

<p>This tool enables schema discovery. AI agents can ask "What tables are available?" and get a comprehensive list.</p>

<h3>Tool 2: describe_table</h3>
<p>Returns schema details for a specific table:</p>
<code>async function describeTable(tableName) {<br>  const response = await axios.get(<br>    \`\${dataverseUrl}/api/data/v9.2/EntityDefinitions(LogicalName='\${tableName}')?$expand=Attributes($select=LogicalName,DisplayName,AttributeType,IsValidForCreate,IsValidForUpdate)\`,<br>    { headers: { Authorization: \`Bearer \${accessToken}\` } }<br>  );<br>  return {<br>    name: response.data.LogicalName,<br>    displayName: response.data.DisplayName?.UserLocalizedLabel?.Label,<br>    primaryKey: response.data.PrimaryIdAttribute,<br>    attributes: response.data.Attributes.map(attr => ({<br>      name: attr.LogicalName,<br>      displayName: attr.DisplayName?.UserLocalizedLabel?.Label,<br>      type: attr.AttributeType,<br>      createable: attr.IsValidForCreate,<br>      updateable: attr.IsValidForUpdate<br>    }))<br>  };<br>}</code>

<p>With this tool, agents understand table structure and can generate valid queries and create operations.</p>

<h3>Tool 3: query_table</h3>
<p>Executes queries using OData syntax:</p>
<code>async function queryTable(tableName, filter, select, orderBy, top) {<br>  let url = \`\${dataverseUrl}/api/data/v9.2/\${tableName}?\`;<br>  if (filter) url += \`$filter=\${encodeURIComponent(filter)}&\`;<br>  if (select) url += \`$select=\${select}&\`;<br>  if (orderBy) url += \`$orderby=\${orderBy}&\`;<br>  if (top) url += \`$top=\${top}&\`;<br>  <br>  const response = await axios.get(url, {<br>    headers: { Authorization: \`Bearer \${accessToken}\` }<br>  });<br>  return response.data.value;<br>}</code>

<p>This is the most frequently used tool. AI agents query data to answer questions, validate information, or find records to update.</p>

<h3>Tool 4: get_record</h3>
<p>Retrieves a specific record by ID:</p>
<code>async function getRecord(tableName, recordId, select) {<br>  let url = \`\${dataverseUrl}/api/data/v9.2/\${tableName}(\${recordId})\`;<br>  if (select) url += \`?$select=\${select}\`;<br>  <br>  const response = await axios.get(url, {<br>    headers: { Authorization: \`Bearer \${accessToken}\` }<br>  });<br>  return response.data;<br>}</code>

<p>Use this when you know the exact record ID and need to fetch details efficiently.</p>

<h3>Tool 5: create_record</h3>
<p>Creates a new record:</p>
<code>async function createRecord(tableName, data) {<br>  const response = await axios.post(<br>    \`\${dataverseUrl}/api/data/v9.2/\${tableName}\`,<br>    data,<br>    {<br>      headers: {<br>        Authorization: \`Bearer \${accessToken}\`,<br>        'Content-Type': 'application/json',<br>        'OData-MaxVersion': '4.0',<br>        'OData-Version': '4.0'<br>      }<br>    }<br>  );<br>  const recordId = response.headers['odata-entityid'].split('(')[1].split(')')[0];<br>  return { id: recordId, url: response.headers['odata-entityid'] };<br>}</code>

<p>This enables AI agents to take action: create support cases, log activities, add contacts.</p>

<h3>Tool 6: update_record</h3>
<p>Updates an existing record:</p>
<code>async function updateRecord(tableName, recordId, data) {<br>  await axios.patch(<br>    \`\${dataverseUrl}/api/data/v9.2/\${tableName}(\${recordId})\`,<br>    data,<br>    {<br>      headers: {<br>        Authorization: \`Bearer \${accessToken}\`,<br>        'Content-Type': 'application/json'<br>      }<br>    }<br>  );<br>  return { success: true, id: recordId };<br>}</code>

<h3>Tool 7: delete_record</h3>
<p>Deletes a record (use with caution):</p>
<code>async function deleteRecord(tableName, recordId) {<br>  await axios.delete(<br>    \`\${dataverseUrl}/api/data/v9.2/\${tableName}(\${recordId})\`,<br>    { headers: { Authorization: \`Bearer \${accessToken}\` } }<br>  );<br>  return { success: true, id: recordId };<br>}</code>

<p>Implement strict authorization checks before exposing this tool in production.</p>

<h2>FetchXML vs OData Query Patterns</h2>
<p>Dataverse supports two query languages:</p>

<h3>OData</h3>
<p>OData is RESTful and URL-based. Advantages:</p>
<ul>
<li>Easier to construct programmatically</li>
<li>Standard HTTP semantics (GET for queries, POST for creates)</li>
<li>Better for simple queries and single-table operations</li>
</ul>

<p>Example: <code>accounts?$filter=revenue gt 1000000&$select=name,revenue&$orderby=revenue desc</code></p>

<h3>FetchXML</h3>
<p>FetchXML is XML-based and more powerful. Advantages:</p>
<ul>
<li>Supports complex joins across multiple tables</li>
<li>Aggregate functions (SUM, AVG, COUNT)</li>
<li>Grouping and linked entities</li>
<li>Better performance for complex queries</li>
</ul>

<p>Example FetchXML query:</p>
<code>&lt;fetch&gt;<br>  &lt;entity name="account"&gt;<br>    &lt;attribute name="name"/&gt;<br>    &lt;attribute name="revenue"/&gt;<br>    &lt;link-entity name="contact" from="parentcustomerid" to="accountid"&gt;<br>      &lt;attribute name="fullname"/&gt;<br>    &lt;/link-entity&gt;<br>  &lt;/entity&gt;<br>&lt;/fetch&gt;</code>

<p>For MCP servers, start with OData for simplicity. Add a FetchXML tool later for advanced scenarios.</p>

<h2>Handling Dataverse Relationships and Lookups</h2>
<p>Dataverse relationships are critical for enterprise data models:</p>

<h3>One-to-Many Relationships</h3>
<p>An Account has many Contacts. Query contacts for an account:</p>
<code>contacts?$filter=_parentcustomerid_value eq {account-id}</code>

<p>The <code>_parentcustomerid_value</code> is the lookup field navigation property.</p>

<h3>Many-to-One Relationships</h3>
<p>A Contact belongs to an Account. Expand the relationship in a query:</p>
<code>contacts({contact-id})?$select=fullname&$expand=parentcustomerid_account($select=name,revenue)</code>

<p>This returns the contact with their parent account details inline.</p>

<h3>Many-to-Many Relationships</h3>
<p>A Contact can have multiple Marketing Lists, and a Marketing List has multiple Contacts. Query through the relationship:</p>
<code>contacts({contact-id})/listmember_association?$select=listname</code>

<h3>Best Practice: Relationship Tool</h3>
<p>Consider adding a dedicated <code>describe_relationships</code> tool that returns relationship metadata. This helps AI agents understand how tables connect.</p>

<h2>Row-Level Security Enforcement</h2>
<p>Dataverse security is enforced at multiple levels:</p>

<h3>Business Unit Security</h3>
<p>Records are owned by business units. The service principal's security roles determine which business units it can access.</p>

<h3>Record-Based Security</h3>
<p>Security roles define create, read, write, delete, append, and append-to privileges at the record level. Configure your application user with appropriate roles.</p>

<h3>Field-Level Security</h3>
<p>Sensitive fields (SSN, salary) can have field-level security. Even if the service principal can read the record, secured fields may be hidden.</p>

<h3>Hierarchical Security</h3>
<p>Managers can access their direct reports' records. Configure hierarchical security if your agents need manager visibility.</p>

<h3>MCP Server Enforcement</h3>
<p>The MCP server inherits all Dataverse security. You don't need to re-implement security logic — Dataverse APIs enforce it automatically. However, add application-level logging to track what each agent accesses for audit purposes.</p>

<h2>Caching Strategies</h2>
<p>Reduce load on Dataverse with strategic caching:</p>

<h3>Metadata Caching</h3>
<p>Table schemas change rarely. Cache <code>list_tables</code> and <code>describe_table</code> results for 1 hour. Refresh on startup and periodically in the background.</p>

<h3>Data Caching</h3>
<p>Cache read-only reference data (product catalogs, price lists, territory mappings). Use Redis or in-memory caching with TTLs appropriate to data volatility.</p>

<h3>Negative Caching</h3>
<p>Cache "not found" responses to prevent repeated queries for non-existent records. Use a short TTL (5 minutes) to handle cases where records are created shortly after being queried.</p>

<h3>Cache Invalidation</h3>
<p>Subscribe to Dataverse webhooks or use Azure Service Bus to receive notifications when data changes. Invalidate relevant cache entries proactively.</p>

<h2>Error Handling and Retry Logic</h2>
<p>Dataverse APIs can fail for various reasons. Implement robust error handling:</p>

<h3>Authentication Failures</h3>
<p>If the access token expires mid-operation, catch 401 errors, refresh the token, and retry the operation automatically.</p>

<h3>Throttling</h3>
<p>Dataverse enforces API rate limits (6,000 requests per 5 minutes per user). When throttled, you'll receive a 429 status with a retry-after header. Implement exponential backoff and respect the retry-after value.</p>

<h3>Transient Failures</h3>
<p>Network glitches and temporary service issues happen. Retry failed requests up to 3 times with exponential backoff (1s, 2s, 4s).</p>

<h3>Validation Errors</h3>
<p>If create/update operations fail validation (missing required fields, invalid data types), return clear error messages to the AI agent. Include the field names and constraints that were violated.</p>

<h3>Permission Errors</h3>
<p>403 Forbidden means the service principal lacks permission. Log these for security monitoring and return user-friendly messages.</p>

<h2>Pagination for Large Datasets</h2>
<p>Dataverse returns up to 5,000 records per request. Implement pagination for larger result sets:</p>

<h3>OData Pagination</h3>
<p>Use <code>$top</code> and <code>$skip</code> for offset-based pagination:</p>
<code>accounts?$select=name&$top=100&$skip=0</code>

<p>For page 2: <code>$skip=100</code>. For page 3: <code>$skip=200</code>.</p>

<h3>Cursor-Based Pagination</h3>
<p>Dataverse response includes an <code>@odata.nextLink</code> when more results exist:</p>
<code>{<br>  "value": [...100 records...],<br>  "@odata.nextLink": "https://org.crm.dynamics.com/api/data/v9.2/accounts?$skiptoken=..."<br>}</code>

<p>Follow the next link to retrieve subsequent pages. This is more efficient than skip-based pagination for large datasets.</p>

<h3>MCP Tool Design</h3>
<p>For query tools, include a <code>maxResults</code> parameter (default 100, max 1000). If more results exist, return a cursor token the agent can use to fetch the next page:</p>
<code>{<br>  "results": [...],<br>  "nextCursor": "encoded-continuation-token"<br>}</code>

<h2>Real-World Implementation Patterns</h2>

<h3>Claims Processing</h3>
<p>An insurance company processes claims using an AI agent connected to Dataverse via MCP:</p>
<ol>
<li>Customer submits claim via email</li>
<li>Email parsing agent extracts claim details</li>
<li>Agent calls <code>query_table</code> to find the policy in Dataverse</li>
<li>Agent validates coverage using <code>get_record</code> to fetch policy details</li>
<li>Agent calls <code>create_record</code> to log a new claim</li>
<li>Agent updates claim status through workflow as adjudication progresses</li>
</ol>

<p>Result: Claims processing time reduced from 48 hours to 2 hours. Human adjusters focus on complex cases while the agent handles routine claims automatically.</p>

<h3>Sales Intelligence</h3>
<p>A sales team uses an AI assistant to prepare for customer meetings:</p>
<ol>
<li>Sales rep asks "Give me a briefing on Contoso"</li>
<li>AI calls <code>query_table</code> to find the account</li>
<li>AI calls <code>query_table</code> with relationship filter to get all opportunities</li>
<li>AI calls <code>query_table</code> to fetch recent activities</li>
<li>AI analyzes data and generates a briefing with opportunity risks and next best actions</li>
</ol>

<p>Result: Meeting prep time reduced from 30 minutes to 2 minutes. Sales reps enter meetings better informed and more confident.</p>

<h3>Customer Service Automation</h3>
<p>A support agent uses AI to resolve customer inquiries:</p>
<ol>
<li>Customer messages "I need to update my address"</li>
<li>AI calls <code>query_table</code> to find the customer by email or phone</li>
<li>AI extracts new address from the message using NLP</li>
<li>AI calls <code>update_record</code> to update the customer's address</li>
<li>AI calls <code>create_record</code> to log the interaction as a case activity</li>
<li>AI responds to customer confirming the update</li>
</ol>

<p>Result: 60% of address change requests handled without human intervention. Support agents focus on complex issues requiring empathy and judgment.</p>

<div class="blog-stats">
<div class="stat"><span class="stat-value">48h → 2h</span><span class="stat-label">Claims Processing Time</span></div>
<div class="stat"><span class="stat-value">30m → 2m</span><span class="stat-label">Sales Meeting Prep</span></div>
<div class="stat"><span class="stat-value">60%</span><span class="stat-label">Address Changes Automated</span></div>
</div>

<h2>Performance Optimization</h2>

<h3>Minimize Round Trips</h3>
<p>Use <code>$expand</code> to fetch related records in a single query instead of multiple sequential queries:</p>
<code>accounts({id})?$expand=contact_customer_accounts($select=fullname,emailaddress)</code>

<p>This retrieves the account and all related contacts in one HTTP request.</p>

<h3>Select Only Needed Fields</h3>
<p>Always use <code>$select</code> to fetch only the columns you need:</p>
<code>accounts?$select=name,revenue,industrycode</code>

<p>This reduces payload size and improves query performance, especially for tables with many columns.</p>

<h3>Use Batch Requests</h3>
<p>Dataverse supports OData batch requests to execute multiple operations in a single HTTP request. Use this when creating multiple related records or executing independent queries.</p>

<h3>Connection Pooling</h3>
<p>Reuse HTTP connections to Dataverse rather than creating new connections for each request. Most HTTP libraries (axios, fetch) handle this automatically, but verify your configuration.</p>

<h3>Monitor API Usage</h3>
<p>Track API call counts and response times. Identify which tools consume the most resources and optimize accordingly. Use Azure Application Insights or similar monitoring tools.</p>

<h2>Testing Strategies</h2>

<h3>Unit Testing</h3>
<p>Mock Dataverse API responses to test tool logic in isolation:</p>
<code>jest.mock('axios');<br>axios.get.mockResolvedValue({ data: { value: [{ name: 'Contoso' }] } });<br>const results = await queryTable('accounts', "name eq 'Contoso'");<br>expect(results).toHaveLength(1);</code>

<h3>Integration Testing</h3>
<p>Test against a dedicated Dataverse developer environment with known test data. Verify:</p>
<ul>
<li>Authentication succeeds with service principal</li>
<li>Schema discovery returns expected tables and columns</li>
<li>Queries return correct results</li>
<li>Create/update/delete operations work as expected</li>
<li>Error handling triggers on invalid operations</li>
</ul>

<h3>MCP Client Testing</h3>
<p>Use the MCP inspector tool to manually test each tool from a client perspective. Verify tool schemas are correct and results are formatted properly.</p>

<h3>Load Testing</h3>
<p>Simulate multiple concurrent agents calling tools simultaneously. Verify:</p>
<ul>
<li>Token caching prevents authentication bottlenecks</li>
<li>Connection pooling handles concurrent requests</li>
<li>Rate limiting doesn't cause failures</li>
<li>Memory usage remains stable under load</li>
</ul>

<h2>Deployment and Monitoring</h2>

<h3>Deployment Options</h3>
<ul>
<li><strong>Azure Container Instances</strong> — Simple containerized deployment for HTTP-based MCP servers</li>
<li><strong>Azure App Service</strong> — Fully managed platform with auto-scaling and easy deployment</li>
<li><strong>Azure Kubernetes Service</strong> — For large-scale deployments with complex orchestration needs</li>
<li><strong>On-premises servers</strong> — Run stdio-based MCP servers on local machines for development or air-gapped environments</li>
</ul>

<h3>Monitoring</h3>
<p>Instrument your MCP server with comprehensive logging:</p>
<ul>
<li>Log every tool call with client identity, tool name, parameters, and execution time</li>
<li>Log authentication events (token acquisition, refresh, expiration)</li>
<li>Log errors with full stack traces and context</li>
<li>Export logs to Azure Application Insights or Log Analytics for analysis</li>
</ul>

<h3>Alerting</h3>
<p>Set up alerts for:</p>
<ul>
<li>Error rate exceeds 5% over 5 minutes</li>
<li>Average response time exceeds 2 seconds</li>
<li>Authentication failures indicate token expiration</li>
<li>Rate limiting triggers suggest capacity issues</li>
</ul>

<h3>Health Checks</h3>
<p>Implement a health check endpoint that verifies:</p>
<ul>
<li>The server is running</li>
<li>Dataverse API is reachable</li>
<li>Authentication is working</li>
<li>Critical dependencies (cache, database) are healthy</li>
</ul>

<h2>Integration with Copilot Studio and Other AI Frameworks</h2>

<h3>Copilot Studio Integration</h3>
<p>Copilot Studio doesn't directly support MCP (yet), but you can bridge through Power Automate:</p>
<ol>
<li>Create a Power Automate flow that calls your MCP server's HTTP endpoint</li>
<li>Expose the flow as a Power Platform connector</li>
<li>Use the connector in your Copilot Studio agent</li>
</ol>

<p>This adds latency but enables Copilot Studio agents to access Dataverse through your MCP server's tools.</p>

<h3>LangChain Integration</h3>
<p>LangChain supports MCP through custom tool implementations. Wrap your MCP client in a LangChain tool and add it to your agent's toolkit.</p>

<h3>Semantic Kernel Integration</h3>
<p>Semantic Kernel can invoke MCP servers through HTTP transport. Register your server as a plugin and expose tools as semantic functions.</p>

<h3>Direct API Integration</h3>
<p>Any AI framework that supports function calling can use your MCP server. Implement a thin adapter layer that translates MCP tool calls to your framework's function calling format.</p>

<h2>Getting Started Today</h2>
<p>Building a Dataverse MCP server is a weekend project that unlocks massive value:</p>
<ol>
<li>Set up service principal authentication (2 hours)</li>
<li>Implement <code>list_tables</code> and <code>describe_table</code> tools (2 hours)</li>
<li>Add <code>query_table</code> tool with OData support (3 hours)</li>
<li>Test with MCP inspector and refine (2 hours)</li>
<li>Deploy to Azure and connect your first AI agent (1 hour)</li>
</ol>

<p>Start with read-only tools to minimize risk. Once you've proven value, add write operations with proper authorization and audit logging.</p>

<p>For step-by-step implementation guidance, explore our <a href="/services/training">AI integration workshops</a> or dive into more technical deep dives on our <a href="/resources/blog">blog</a> covering enterprise AI patterns, Microsoft Power Platform, and agentic architectures.</p>
`,
    author: 'Gennoor Tech',
    date: '2026-03-08',
    readTime: '12 min read',
    category: 'Microsoft AI',
    tags: ['Dataverse', 'MCP', 'Power Platform', 'AI Agents'],
    hashtags: ['#Dataverse', '#MCP', '#PowerPlatform', '#AIAgents', '#MicrosoftAI'],
    coverColor: '#1A5276',
    icon: '🗄️',
  }
