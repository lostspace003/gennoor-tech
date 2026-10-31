// What the LinkedIn hub offers, in one place shared by the server (validation, limits) and the browser (forms).
// Tool names and arguments mirror stickerdaniel/linkedin-mcp-server. It cannot create posts; publishing stays on the
// official LinkedIn API in the Social studio.
export type Field = { name: string; label: string; type?: 'text' | 'number' | 'select' | 'multi' | 'bool' | 'textarea'; options?: { v: string; l: string }[]; placeholder?: string; required?: boolean; def?: string | number | boolean }
export interface ToolDef { name: string; label: string; group: GroupKey; kind: 'read' | 'action'; help: string; fields: Field[]; cap?: number }
export type GroupKey = 'feed' | 'people' | 'inbox' | 'companies' | 'jobs' | 'me'

export const GROUPS: { key: GroupKey; label: string; blurb: string }[] = [
  { key: 'feed', label: 'Feed & posts', blurb: 'Read your home feed and search what people are posting.' },
  { key: 'people', label: 'People', blurb: 'Find people, read profiles and send connection requests.' },
  { key: 'inbox', label: 'Inbox', blurb: 'Read, search and reply to your LinkedIn messages.' },
  { key: 'companies', label: 'Companies', blurb: 'Research companies, their posts and their people.' },
  { key: 'jobs', label: 'Jobs', blurb: 'Search jobs and read postings and saved jobs.' },
  { key: 'me', label: 'My profile', blurb: 'Read your own profile as LinkedIn shows it.' },
]

// Countries with their LinkedIn geo ids (people search needs the id; the form hides it). Jobs search takes the plain name.
const PLACES: { id: string; name: string; hint: string }[] = [
  { id: '104305776', name: 'United Arab Emirates', hint: 'Dubai, Abu Dhabi, Sharjah' },
  { id: '100459316', name: 'Saudi Arabia', hint: 'Riyadh, Jeddah' },
  { id: '104170880', name: 'Qatar', hint: 'Doha' },
  { id: '102713980', name: 'India', hint: 'Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai' },
  { id: '103644278', name: 'United States', hint: 'New York, San Francisco, Seattle' },
  { id: '101165590', name: 'United Kingdom', hint: 'London, Manchester' },
  { id: '101174742', name: 'Canada', hint: 'Toronto, Vancouver' },
  { id: '101282230', name: 'Germany', hint: 'Berlin, Munich' },
  { id: '105015875', name: 'France', hint: 'Paris' },
  { id: '102890719', name: 'Netherlands', hint: 'Amsterdam' },
  { id: '104738515', name: 'Ireland', hint: 'Dublin' },
  { id: '101452733', name: 'Australia', hint: 'Sydney, Melbourne' },
  { id: '102454443', name: 'Singapore', hint: 'Singapore' },
  // Africa
  { id: '104035573', name: 'South Africa', hint: 'Johannesburg, Cape Town, Durban' },
  { id: '105365761', name: 'Nigeria', hint: 'Lagos, Abuja' },
  { id: '100710459', name: 'Kenya', hint: 'Nairobi, Mombasa' },
  { id: '106155005', name: 'Egypt', hint: 'Cairo, Alexandria' },
  { id: '102787409', name: 'Morocco', hint: 'Casablanca, Rabat' },
  { id: '102134353', name: 'Tunisia', hint: 'Tunis' },
]
const peoplePlaces = PLACES.map(p => ({ v: p.id, l: `${p.name} (${p.hint})` }))
const jobPlaces = PLACES.map(p => ({ v: p.name, l: `${p.name} (${p.hint})` }))
const profileSections = [{ v: 'experience', l: 'Experience (roles and companies)' }, { v: 'education', l: 'Education (schools and degrees)' }, { v: 'posts', l: 'Posts (recent activity)' }, { v: 'interests', l: 'Interests (people and topics followed)' }, { v: 'honors', l: 'Honors (awards and certifications)' }, { v: 'languages', l: 'Languages' }, { v: 'contact_info', l: 'Contact info (email, links)' }]

const recency = [{ v: '', l: 'Any time' }, { v: 'past-24h', l: 'Past 24 hours' }, { v: 'past-week', l: 'Past week' }, { v: 'past-month', l: 'Past month' }]

export const TOOLS: ToolDef[] = [
  { name: 'get_feed', label: 'Home feed', group: 'feed', kind: 'read', help: 'Recent posts from your home feed.', fields: [{ name: 'num_posts', label: 'How many posts', type: 'number', def: 10 }] },
  { name: 'search_posts', label: 'Search posts', group: 'feed', kind: 'read', help: 'Posts matching a keyword.', fields: [{ name: 'keywords', label: 'Keywords', required: true, placeholder: 'e.g. agentic AI' }, { name: 'date_posted', label: 'Posted', type: 'select', options: recency }, { name: 'max_pages', label: 'Pages', type: 'number', def: 2 }] },
  { name: 'search_people', label: 'Search people', group: 'people', kind: 'read', help: 'Find people by keyword, place and company.', fields: [{ name: 'keywords', label: 'Keywords', required: true, placeholder: 'e.g. CIO banking' }, { name: 'location', label: 'Location', type: 'multi', options: peoplePlaces, placeholder: 'Any location' }, { name: 'current_company', label: 'Current company' }] },
  { name: 'get_person_profile', label: 'Read a profile', group: 'people', kind: 'read', help: 'A person\'s profile: experience, education, skills, posts.', fields: [{ name: 'linkedin_username', label: 'LinkedIn username', required: true, placeholder: 'the part after /in/' }, { name: 'sections', label: 'Sections', type: 'multi', options: profileSections, placeholder: 'Overview only' }] },
  { name: 'connect_with_person', label: 'Connect', group: 'people', kind: 'action', cap: 15, help: 'Sends a connection request, or accepts an incoming one.', fields: [{ name: 'linkedin_username', label: 'LinkedIn username', required: true }, { name: 'note', label: 'Note (optional)', type: 'textarea', placeholder: 'A short, specific reason to connect' }] },
  { name: 'get_sidebar_profiles', label: 'People you may know', group: 'people', kind: 'read', help: 'Recommended profiles shown beside a profile.', fields: [{ name: 'linkedin_username', label: 'LinkedIn username', required: true }] },
  { name: 'get_inbox', label: 'Inbox', group: 'inbox', kind: 'read', help: 'Your recent conversations.', fields: [{ name: 'limit', label: 'How many', type: 'number', def: 20 }] },
  { name: 'get_conversation', label: 'Read a conversation', group: 'inbox', kind: 'read', help: 'The messages in one conversation.', fields: [{ name: 'thread_id', label: 'Thread ID' }, { name: 'linkedin_username', label: 'or LinkedIn username' }] },
  { name: 'search_conversations', label: 'Search messages', group: 'inbox', kind: 'read', help: 'Find conversations by keyword.', fields: [{ name: 'keywords', label: 'Keywords', required: true }, { name: 'limit', label: 'How many', type: 'number', def: 20 }] },
  { name: 'send_message', label: 'Send a message', group: 'inbox', kind: 'action', cap: 25, help: 'Sends a message to a person.', fields: [{ name: 'linkedin_username', label: 'LinkedIn username', required: true }, { name: 'message', label: 'Message', type: 'textarea', required: true }] },
  { name: 'archive_conversation', label: 'Archive a conversation', group: 'inbox', kind: 'action', cap: 40, help: 'Moves a conversation to the archive.', fields: [{ name: 'thread_id', label: 'Thread ID', required: true }] },
  { name: 'search_companies', label: 'Search companies', group: 'companies', kind: 'read', help: 'Find companies by keyword.', fields: [{ name: 'keywords', label: 'Keywords', required: true }] },
  { name: 'get_company_profile', label: 'Company profile', group: 'companies', kind: 'read', help: 'About a company, optionally with posts and open jobs.', fields: [{ name: 'company_name', label: 'Company (as in its LinkedIn URL)', required: true, placeholder: 'e.g. microsoft' }, { name: 'sections', label: 'Sections', type: 'multi', options: [{ v: 'posts', l: 'Posts (recent updates)' }, { v: 'jobs', l: 'Jobs (open roles)' }], placeholder: 'Overview only' }] },
  { name: 'get_company_posts', label: 'Company posts', group: 'companies', kind: 'read', help: 'Recent posts from a company page.', fields: [{ name: 'company_name', label: 'Company', required: true }] },
  { name: 'get_company_employees', label: 'Company people', group: 'companies', kind: 'read', help: 'People who work there, optionally filtered.', fields: [{ name: 'company_name', label: 'Company', required: true }, { name: 'keywords', label: 'Name, title or skill' }] },
  { name: 'search_jobs', label: 'Search jobs', group: 'jobs', kind: 'read', help: 'Job postings by keyword and place.', fields: [{ name: 'keywords', label: 'Keywords', required: true }, { name: 'location', label: 'Location', type: 'multi', options: jobPlaces, placeholder: 'Any location' }, { name: 'date_posted', label: 'Posted', type: 'select', options: recency }, { name: 'easy_apply', label: 'Easy Apply only', type: 'bool' }, { name: 'max_pages', label: 'Pages', type: 'number', def: 2 }] },
  { name: 'get_job_details', label: 'Job details', group: 'jobs', kind: 'read', help: 'The description and requirements of a posting.', fields: [{ name: 'job_id', label: 'Job ID', required: true }] },
  { name: 'get_job_apply_url', label: 'How to apply', group: 'jobs', kind: 'read', help: 'Whether a job uses Easy Apply or an employer site.', fields: [{ name: 'job_id', label: 'Job ID', required: true }] },
  { name: 'get_saved_jobs', label: 'Saved jobs', group: 'jobs', kind: 'read', help: 'Jobs you saved.', fields: [{ name: 'max_pages', label: 'Pages', type: 'number', def: 2 }] },
  { name: 'dismiss_job', label: 'Dismiss a job', group: 'jobs', kind: 'action', cap: 40, help: 'Hides a job from future searches. Cannot be undone.', fields: [{ name: 'job_id', label: 'Job ID', required: true }] },
  { name: 'get_my_profile', label: 'My profile', group: 'me', kind: 'read', help: 'Your own profile.', fields: [{ name: 'sections', label: 'Sections', type: 'multi', options: profileSections, placeholder: 'Overview only' }] },
]

export const toolByName = (n: string) => TOOLS.find(t => t.name === n)
/** Reads are capped too: heavy scraping is what gets accounts flagged. */
export const DAILY_READ_CAP = Number(process.env.NEXT_PUBLIC_LI_DAILY_READ_CAP || 200)

/** One-line plain explanations for the "i" next to each field. Nothing here needs a special format: plain words work. */
export const FIELD_TIPS: Record<string, string> = {
  keywords: 'Just type what you would say out loud, like "agentic AI" or "CIO banking Mumbai". No quotes, operators or special format needed.',
  location: 'Tick one or more countries (the cities in brackets are covered). Several ticked means one search per country, shown one after another. Leave empty for anywhere.',
  current_company: 'A company name in plain words, for example "Infosys". Leave empty for any company.',
  linkedin_username: "Paste the person's LinkedIn profile link, or just their username (the part after linkedin.com/in/). Either works.",
  company_name: "Paste the company's LinkedIn link or just its name as it appears in the link, for example \"microsoft\".",
  sections: 'Optional. Leave empty for the main overview. Tick any extra parts you want included.',
  num_posts: 'How many posts to read. 10 is a good start; bigger numbers are slower and count more against your daily limit.',
  max_pages: 'How many pages of results to read. 1 is fastest; 2 is the usual choice. More pages use more of your daily limit.',
  limit: 'How many conversations to list.',
  date_posted: 'Only show results from this period.',
  thread_id: 'Paste the conversation link, or use Inbox first and press Open next to a conversation.',
  job_id: 'Paste the job link or its number. Easiest: run Search jobs and press Details next to a result.',
  note: 'Optional. One or two sentences saying why you want to connect. Specific notes get accepted more often.',
  message: 'Write it as you would normally. It is sent exactly as typed.',
  easy_apply: 'Tick to see only jobs you can apply to inside LinkedIn.',
}

/** Click-to-fill examples per tool, so there is always an easy way to start. */
export const STARTERS: Record<string, { label: string; args: Record<string, string | number> }[]> = {
  search_posts: [{ label: 'Agentic AI this week', args: { keywords: 'agentic AI', date_posted: 'past-week' } }, { label: 'Azure AI Foundry', args: { keywords: 'Azure AI Foundry', date_posted: 'past-month' } }, { label: 'MCP servers', args: { keywords: 'MCP server enterprise', date_posted: 'past-week' } }],
  get_feed: [{ label: 'Latest 10 posts', args: { num_posts: 10 } }],
  search_people: [{ label: 'CIOs in banking', args: { keywords: 'CIO banking' } }, { label: 'Heads of AI in Dubai', args: { keywords: 'head of AI', location: '104305776' } }, { label: 'L&D leaders at Infosys', args: { keywords: 'learning and development', current_company: 'Infosys' } }],
  search_companies: [{ label: 'AI consulting firms', args: { keywords: 'AI consulting' } }, { label: 'IT training companies', args: { keywords: 'corporate IT training' } }],
  get_company_profile: [{ label: 'Microsoft', args: { company_name: 'microsoft' } }],
  search_jobs: [{ label: 'AI architect, India', args: { keywords: 'AI architect', location: 'India' } }, { label: 'Agent engineer, this week', args: { keywords: 'agent engineer', date_posted: 'past-week' } }],
  search_conversations: [{ label: 'Messages about training', args: { keywords: 'training' } }],
  get_inbox: [{ label: 'Latest 20 conversations', args: { limit: 20 } }],
  get_my_profile: [{ label: 'Overview', args: { sections: '' } }, { label: 'With my posts', args: { sections: 'posts' } }],
}
