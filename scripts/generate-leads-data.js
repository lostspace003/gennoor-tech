const XLSX = require('xlsx');
const fs = require('fs');

// Generate 166 realistic leads for Gennoor
const generateLeads = () => {
  const leads = [];

  // Arrays for realistic data generation
  const firstNames = ['Rajesh', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Suresh', 'Kavita', 'Arjun', 'Pooja',
                      'Manish', 'Shreya', 'Rohit', 'Deepika', 'Arun', 'Swati', 'Karan', 'Nisha', 'Sanjay', 'Ritu',
                      'John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Jennifer', 'Robert', 'Maria'];

  const lastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Gupta', 'Mehta', 'Agarwal', 'Jain', 'Verma', 'Reddy',
                     'Nair', 'Iyer', 'Rao', 'Shah', 'Kapoor', 'Malhotra', 'Chopra', 'Bansal', 'Mittal', 'Goyal',
                     'Anderson', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Moore', 'Taylor'];

  const companies = [
    'Infosys', 'TCS', 'Wipro', 'HCL Technologies', 'Tech Mahindra', 'Mindtree', 'L&T Infotech', 'Mphasis',
    'Reliance Industries', 'Tata Motors', 'Mahindra & Mahindra', 'Bajaj Auto', 'Hero MotoCorp', 'Maruti Suzuki',
    'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'State Bank of India', 'Kotak Mahindra Bank', 'Yes Bank',
    'Hindustan Unilever', 'ITC Limited', 'Nestle India', 'Britannia Industries', 'Godrej Consumer',
    'Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Narayana Health', 'Manipal Hospitals',
    'Larsen & Toubro', 'Ultratech Cement', 'Ambuja Cements', 'ACC Limited', 'Shree Cement',
    'Bharti Airtel', 'Vodafone Idea', 'Jio Platforms', 'BSNL', 'Tata Communications',
    'Flipkart', 'Amazon India', 'Paytm', 'Zomato', 'Swiggy', 'Ola', 'Uber India', 'MakeMyTrip',
    'Asian Paints', 'Berger Paints', 'Kansai Nerolac', 'Pidilite Industries', 'JSW Steel',
    'Microsoft India', 'Google India', 'IBM India', 'Oracle India', 'SAP India', 'Adobe India',
    'Accenture India', 'Capgemini India', 'Cognizant', 'Deloitte India', 'PwC India', 'EY India',
    'KPMG India', 'McKinsey India', 'Boston Consulting Group', 'Bain & Company India'
  ];

  const designations = [
    'CEO', 'CTO', 'CFO', 'COO', 'CIO', 'CHRO', 'CMO',
    'Vice President', 'Director', 'Senior Manager', 'Manager',
    'Head of IT', 'Head of Digital', 'Head of Innovation', 'Head of Operations',
    'IT Director', 'Technology Lead', 'Digital Transformation Head', 'AI/ML Lead',
    'General Manager', 'Assistant Vice President', 'Deputy General Manager'
  ];

  const industries = [
    'Information Technology', 'Banking & Financial Services', 'Healthcare', 'Manufacturing',
    'Retail', 'E-commerce', 'Telecommunications', 'Automotive', 'Pharmaceuticals',
    'FMCG', 'Construction', 'Real Estate', 'Education', 'Hospitality', 'Media & Entertainment',
    'Logistics', 'Energy', 'Consulting', 'Insurance', 'Travel & Tourism'
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
    'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam',
    'Patna', 'Vadodara', 'Ludhiana', 'Coimbatore', 'Kochi', 'Nashik', 'Agra', 'Faridabad',
    'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad',
    'Ranchi', 'Gwalior', 'Jabalpur', 'Vijayawada', 'Madurai', 'Guwahati', 'Chandigarh', 'Noida', 'Gurgaon'
  ];

  const sources = ['LinkedIn', 'Website', 'Referral', 'Conference', 'Webinar', 'Cold Call', 'Email Campaign', 'Partner', 'Event', 'Social Media'];
  const statuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost', 'On Hold'];
  const priorities = ['High', 'Medium', 'Low'];

  // Generate 166 unique leads
  for (let i = 1; i <= 166; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[i % companies.length];
    const designation = designations[Math.floor(Math.random() * designations.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];

    const lead = {
      'Lead ID': `LEAD-${String(i).padStart(4, '0')}`,
      'Name': `${firstName} ${lastName}`,
      'Email': `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      'Phone': `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      'Company': company,
      'Designation': designation,
      'Industry': industry,
      'Location': city,
      'LinkedIn': `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 999999)}`,
      'Website': `https://www.${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      'Source': sources[Math.floor(Math.random() * sources.length)],
      'Status': statuses[Math.floor(Math.random() * statuses.length)],
      'Priority': priorities[Math.floor(Math.random() * priorities.length)],
      'Deal Value (INR)': Math.floor(Math.random() * 50 + 5) * 100000, // 5L to 50L
      'Score': Math.floor(Math.random() * 40 + 60), // 60 to 100
      'Notes': 'Initial contact to be made. Potential for AI/Digital transformation services.',
      'Next Action': ['Send Email', 'Schedule Call', 'Send Proposal', 'Follow Up', 'Demo'][Math.floor(Math.random() * 5)],
      'Assigned To': ['Admin', 'Jalal Khan', 'Yusuf Chaudhary', 'Contact Team'][Math.floor(Math.random() * 4)],
      'Created Date': new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      'Last Contact': new Date(2024, 11, Math.floor(Math.random() * 24) + 1).toISOString().split('T')[0]
    };

    leads.push(lead);
  }

  return leads;
};

// Create workbook with multiple sheets
const createWorkbook = () => {
  const wb = XLSX.utils.book_new();

  // Main leads sheet
  const allLeads = generateLeads();
  const wsAll = XLSX.utils.json_to_sheet(allLeads);
  XLSX.utils.book_append_sheet(wb, wsAll, 'All Leads');

  // High Priority leads sheet
  const highPriority = allLeads.filter(lead => lead.Priority === 'High');
  const wsHigh = XLSX.utils.json_to_sheet(highPriority);
  XLSX.utils.book_append_sheet(wb, wsHigh, 'High Priority');

  // Qualified leads sheet
  const qualified = allLeads.filter(lead => lead.Status === 'Qualified' || lead.Status === 'Proposal');
  const wsQualified = XLSX.utils.json_to_sheet(qualified);
  XLSX.utils.book_append_sheet(wb, wsQualified, 'Qualified Leads');

  // By Industry pivot
  const industries = {};
  allLeads.forEach(lead => {
    if (!industries[lead.Industry]) {
      industries[lead.Industry] = [];
    }
    industries[lead.Industry].push(lead);
  });

  // Create industry summary sheet
  const industrySummary = Object.keys(industries).map(industry => ({
    'Industry': industry,
    'Total Leads': industries[industry].length,
    'High Priority': industries[industry].filter(l => l.Priority === 'High').length,
    'Total Value (INR)': industries[industry].reduce((sum, l) => sum + l['Deal Value (INR)'], 0),
    'Average Score': Math.round(industries[industry].reduce((sum, l) => sum + l.Score, 0) / industries[industry].length)
  }));

  const wsSummary = XLSX.utils.json_to_sheet(industrySummary);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Industry Summary');

  // Statistics sheet
  const stats = [{
    'Metric': 'Total Leads',
    'Value': allLeads.length
  }, {
    'Metric': 'High Priority',
    'Value': allLeads.filter(l => l.Priority === 'High').length
  }, {
    'Metric': 'Medium Priority',
    'Value': allLeads.filter(l => l.Priority === 'Medium').length
  }, {
    'Metric': 'Low Priority',
    'Value': allLeads.filter(l => l.Priority === 'Low').length
  }, {
    'Metric': 'Total Pipeline Value',
    'Value': `₹${(allLeads.reduce((sum, l) => sum + l['Deal Value (INR)'], 0) / 10000000).toFixed(2)} Cr`
  }, {
    'Metric': 'Average Deal Size',
    'Value': `₹${(allLeads.reduce((sum, l) => sum + l['Deal Value (INR)'], 0) / allLeads.length / 100000).toFixed(2)} L`
  }, {
    'Metric': 'Qualified Leads',
    'Value': qualified.length
  }, {
    'Metric': 'Cities Covered',
    'Value': new Set(allLeads.map(l => l.Location)).size
  }];

  const wsStats = XLSX.utils.json_to_sheet(stats);
  XLSX.utils.book_append_sheet(wb, wsStats, 'Statistics');

  return wb;
};

// Generate and save the file
const wb = createWorkbook();
const outputPath = 'C:\\Users\\losts\\Desktop\\gennoor-tech\\data\\Gennoor_Master_Leads_166.xlsx';

// Create data directory if it doesn't exist
if (!fs.existsSync('C:\\Users\\losts\\Desktop\\gennoor-tech\\data')) {
  fs.mkdirSync('C:\\Users\\losts\\Desktop\\gennoor-tech\\data', { recursive: true });
}

// Write the file
XLSX.writeFile(wb, outputPath);

console.log(`✅ Excel file created successfully!`);
console.log(`📍 Location: ${outputPath}`);
console.log(`📊 Contents:`);
console.log(`   - All Leads: 166 leads`);
console.log(`   - High Priority: Filtered view`);
console.log(`   - Qualified Leads: Filtered view`);
console.log(`   - Industry Summary: Pivot by industry`);
console.log(`   - Statistics: Overall metrics`);