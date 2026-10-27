// Plain-language explanations shown when hovering the "i" on admin dashboard cards and panels.
// Keyed by the card label / panel title. Write for someone who has never read analytics before.

export const ADMIN_GLOSSARY: Record<string, string> = {
  // Overview cards
  'Page Views': 'How many times pages on the website were opened. One person reading five pages counts as five.',
  'Sessions': 'One visit to the site. If someone leaves for 30 minutes and comes back, that counts as a new visit.',
  'Avg Duration': 'How long a typical visit lasts, in seconds. Visits where the person looked at only one page are not included, because we cannot tell how long they stayed.',
  'Pages / Session': 'How many pages a person opens during one visit. Higher means they are exploring more of the site.',
  'Bounce Rate': 'The share of visits where the person looked at one page and left. Lower is better. Guides and blog posts naturally bounce more.',
  'New Visitors': 'People who came for the very first time within the dates selected above.',
  'Returning': 'People who are active in the dates selected but had already visited before that period. A good sign that they remember you.',
  'Enquiries': 'Forms people sent: contact, training, certification and similar. This is the number that matters most for the business.',
  'Bookings': 'Expert call requests received in the selected dates.',
  // Overview panels
  'Daily Page Views': 'How many pages were opened each day. Spikes usually follow a post, an email or a campaign.',
  'Sessions Trend': 'How many visits happened each day. Shows whether interest is growing or fading.',
  'Conversion Funnel': 'The path from visiting to enquiring, counted in different people. Each step shows how many people got that far. The big drops show where people are lost.',
  'Acquisition Channels': 'Where each person came from the first time they found you: a campaign link, Google, another site, or typing the address directly. Each person is counted once.',
  'Engagement': 'What people do beyond opening pages. Guide readers shows how many reached 25, 50, 75 and 100 percent of a guide. Top CTAs are the most clicked action buttons. Form abandoned at shows the field where people stopped filling a form.',
  'Traffic by Hour (UTC)': 'Which hour of the day people visit. Times are in UTC (India is 5 hours 30 minutes ahead). Useful for choosing when to post.',
  'Top Pages': 'The pages opened most often.',
  'Page Performance': 'For the most visited pages, how many seconds people spend before moving on. Longer usually means they are actually reading.',
  'Top Landing Pages': 'The first page people see when they arrive. These are your front doors.',
  'Traffic Sources': 'Which other websites sent people to you, such as Google or LinkedIn. Missing means they typed the address or came from an app.',
  'Enquiry Breakdown': 'Enquiries split by type: training, certification, contact and so on.',
  // Traffic tab
  'Traffic Trend': 'Page views over time for the selected dates.',
  'Top Countries': 'Which countries your visitors are in, by page views.',
  'Top Cities': 'Which cities your visitors are in, by page views.',
  // Enquiries tab
  'Total Enquiries': 'Every form submission in the selected dates.',
  'Training': 'Training enquiries received.',
  'Certification': 'Certification enquiries received.',
  'Expert Calls': 'Expert call bookings received.',
  'Cowork Registrations': 'People who registered for the Claude Cowork session.',
  'Recent Enquiries': 'The latest forms people sent, newest first.',
  // Learners
  'Total Learners': 'Everyone who has created a Learning Studio account.',
  'Active Learners': 'Learners who have opened a lesson at least once.',
  'With Completions': 'Learners who have finished at least one chapter.',
  'New This Period': 'Learners who signed up in the selected dates.',
  // Emails
  'Total Sent': 'Emails that were delivered successfully.',
  'Failed': 'Emails that could not be delivered. Check the Failed Emails list for the reason.',
  'Unique Recipients': 'Different people who received at least one email.',
  'Total Emails': 'All emails the site tried to send.',
  // Bookings
  'Pending': 'Call requests waiting for your reply.',
  'Accepted': 'Call requests you have accepted.',
  'Rejected': 'Call requests you have declined.',
  'Change Requested': 'Requests where you asked the person for a different time.',
  // Storage
  'Total Files': 'Number of files stored in Azure (images, videos, documents).',
  'Total Size': 'Combined size of all stored files.',
  'Containers': 'Folders in Azure storage. Each one holds a type of file.',
  // Server health
  'Server Requests': 'How many times the website server was asked to do something. Includes page loads and background calls.',
  'Avg Response (ms)': 'How fast the server answers, in milliseconds. Under 500 is healthy; high numbers mean pages feel slow.',
  'Failed Requests': 'Requests the server could not complete. Should be close to zero.',
  'Availability %': 'The share of time the site was up and answering. Aim for 99.9 or more.',
  'Daily Unique Users': 'Different people who used the site each day, as Azure counts them.',
  'Response Time Trend': 'How the server speed changes over time. A climbing line means the site is slowing down.',
}
