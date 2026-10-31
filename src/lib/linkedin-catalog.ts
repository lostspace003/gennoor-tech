// What the LinkedIn hub offers, in one place shared by the server (validation, limits) and the browser (forms).
// Tool names and arguments mirror stickerdaniel/linkedin-mcp-server. It cannot create posts; publishing stays on the
// official LinkedIn API in the Social studio.
export type Field = { name: string; label: string; type?: 'text' | 'number' | 'select' | 'bool' | 'textarea'; options?: { v: string; l: string }[]; placeholder?: string; required?: boolean; def?: string | number | boolean }
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

const recency = [{ v: '', l: 'Any time' }, { v: 'past-24h', l: 'Past 24 hours' }, { v: 'past-week', l: 'Past week' }, { v: 'past-month', l: 'Past month' }]

export const TOOLS: ToolDef[] = [
  { name: 'get_feed', label: 'Home feed', group: 'feed', kind: 'read', help: 'Recent posts from your home feed.', fields: [{ name: 'num_posts', label: 'How many posts', type: 'number', def: 10 }] },
  { name: 'search_posts', label: 'Search posts', group: 'feed', kind: 'read', help: 'Posts matching a keyword.', fields: [{ name: 'keywords', label: 'Keywords', required: true, placeholder: 'e.g. agentic AI' }, { name: 'date_posted', label: 'Posted', type: 'select', options: recency }, { name: 'max_pages', label: 'Pages', type: 'number', def: 2 }] },
  { name: 'search_people', label: 'Search people', group: 'people', kind: 'read', help: 'Find people by keyword, place and company.', fields: [{ name: 'keywords', label: 'Keywords', required: true, placeholder: 'e.g. CIO banking' }, { name: 'location', label: 'Location' }, { name: 'current_company', label: 'Current company' }] },
  { name: 'get_person_profile', label: 'Read a profile', group: 'people', kind: 'read', help: 'A person\'s profile: experience, education, skills, posts.', fields: [{ name: 'linkedin_username', label: 'LinkedIn username', required: true, placeholder: 'the part after /in/' }, { name: 'sections', label: 'Sections', placeholder: 'e.g. experience,education,posts' }] },
  { name: 'connect_with_person', label: 'Connect', group: 'people', kind: 'action', cap: 15, help: 'Sends a connection request, or accepts an incoming one.', fields: [{ name: 'linkedin_username', label: 'LinkedIn username', required: true }, { name: 'note', label: 'Note (optional)', type: 'textarea', placeholder: 'A short, specific reason to connect' }] },
  { name: 'get_sidebar_profiles', label: 'People you may know', group: 'people', kind: 'read', help: 'Recommended profiles shown beside a profile.', fields: [{ name: 'linkedin_username', label: 'LinkedIn username', required: true }] },
  { name: 'get_inbox', label: 'Inbox', group: 'inbox', kind: 'read', help: 'Your recent conversations.', fields: [{ name: 'limit', label: 'How many', type: 'number', def: 20 }] },
  { name: 'get_conversation', label: 'Read a conversation', group: 'inbox', kind: 'read', help: 'The messages in one conversation.', fields: [{ name: 'thread_id', label: 'Thread ID' }, { name: 'linkedin_username', label: 'or LinkedIn username' }] },
  { name: 'search_conversations', label: 'Search messages', group: 'inbox', kind: 'read', help: 'Find conversations by keyword.', fields: [{ name: 'keywords', label: 'Keywords', required: true }, { name: 'limit', label: 'How many', type: 'number', def: 20 }] },
  { name: 'send_message', label: 'Send a message', group: 'inbox', kind: 'action', cap: 25, help: 'Sends a message to a person.', fields: [{ name: 'linkedin_username', label: 'LinkedIn username', required: true }, { name: 'message', label: 'Message', type: 'textarea', required: true }] },
  { name: 'archive_conversation', label: 'Archive a conversation', group: 'inbox', kind: 'action', cap: 40, help: 'Moves a conversation to the archive.', fields: [{ name: 'thread_id', label: 'Thread ID', required: true }] },
  { name: 'search_companies', label: 'Search companies', group: 'companies', kind: 'read', help: 'Find companies by keyword.', fields: [{ name: 'keywords', label: 'Keywords', required: true }] },
  { name: 'get_company_profile', label: 'Company profile', group: 'companies', kind: 'read', help: 'About a company, optionally with posts and open jobs.', fields: [{ name: 'company_name', label: 'Company (as in its LinkedIn URL)', required: true, placeholder: 'e.g. microsoft' }, { name: 'sections', label: 'Sections', placeholder: 'e.g. posts,jobs' }] },
  { name: 'get_company_posts', label: 'Company posts', group: 'companies', kind: 'read', help: 'Recent posts from a company page.', fields: [{ name: 'company_name', label: 'Company', required: true }] },
  { name: 'get_company_employees', label: 'Company people', group: 'companies', kind: 'read', help: 'People who work there, optionally filtered.', fields: [{ name: 'company_name', label: 'Company', required: true }, { name: 'keywords', label: 'Name, title or skill' }] },
  { name: 'search_jobs', label: 'Search jobs', group: 'jobs', kind: 'read', help: 'Job postings by keyword and place.', fields: [{ name: 'keywords', label: 'Keywords', required: true }, { name: 'location', label: 'Location' }, { name: 'date_posted', label: 'Posted', type: 'select', options: recency }, { name: 'easy_apply', label: 'Easy Apply only', type: 'bool' }, { name: 'max_pages', label: 'Pages', type: 'number', def: 2 }] },
  { name: 'get_job_details', label: 'Job details', group: 'jobs', kind: 'read', help: 'The description and requirements of a posting.', fields: [{ name: 'job_id', label: 'Job ID', required: true }] },
  { name: 'get_job_apply_url', label: 'How to apply', group: 'jobs', kind: 'read', help: 'Whether a job uses Easy Apply or an employer site.', fields: [{ name: 'job_id', label: 'Job ID', required: true }] },
  { name: 'get_saved_jobs', label: 'Saved jobs', group: 'jobs', kind: 'read', help: 'Jobs you saved.', fields: [{ name: 'max_pages', label: 'Pages', type: 'number', def: 2 }] },
  { name: 'dismiss_job', label: 'Dismiss a job', group: 'jobs', kind: 'action', cap: 40, help: 'Hides a job from future searches. Cannot be undone.', fields: [{ name: 'job_id', label: 'Job ID', required: true }] },
  { name: 'get_my_profile', label: 'My profile', group: 'me', kind: 'read', help: 'Your own profile.', fields: [{ name: 'sections', label: 'Sections', placeholder: 'e.g. experience,posts' }] },
]

export const toolByName = (n: string) => TOOLS.find(t => t.name === n)
/** Reads are capped too: heavy scraping is what gets accounts flagged. */
export const DAILY_READ_CAP = Number(process.env.NEXT_PUBLIC_LI_DAILY_READ_CAP || 200)
