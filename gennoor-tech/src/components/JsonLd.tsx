export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gennoor Tech',
    url: 'https://gennoor.com',
    logo: 'https://gennoor.com/media/logos/gennoor-tech-icon-white_180x180_apple-touch-icon.png',
    description: 'Enterprise AI Training & Solutions. Expert-led training from strategy to implementation, drawing from 14+ years working with Fortune 500 companies across 6 countries.',
    founder: {
      '@type': 'Person',
      name: 'Jalal Ahmed Khan',
      jobTitle: 'Microsoft Certified Trainer & Enterprise AI Consultant',
      url: 'https://gennoor.com/about/journey',
      sameAs: [
        'https://www.linkedin.com/in/lostspace003/',
        'https://github.com/lostspace003',
        'https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab',
      ],
    },
    sameAs: [
      'https://www.linkedin.com/in/lostspace003/',
      'https://github.com/lostspace003',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'jalalkhan@gennoor.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi', 'Urdu'],
    },
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'United States' },
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Microsoft Azure AI',
      'Microsoft Copilot Studio',
      'Enterprise AI Strategy',
      'Agentic AI',
      'Power Platform',
      'AI Training',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function PersonJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jalal Ahmed Khan',
    jobTitle: 'Microsoft Certified Trainer & Enterprise AI Consultant',
    url: 'https://gennoor.com/about/journey',
    worksFor: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      url: 'https://gennoor.com',
    },
    description: '14+ years of experience in enterprise AI transformation. Microsoft Certified Trainer with 16 active certifications. Trained 50+ C-suite leaders across 6 countries including at Fortune 500 companies like Boeing, Saudi Aramco, HDFC Bank, and Siemens.',
    knowsAbout: [
      'Azure AI',
      'Microsoft Copilot Studio',
      'Agentic AI',
      'Enterprise AI Strategy',
      'Power Platform',
      'LangChain',
      'CrewAI',
    ],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', name: 'Microsoft Certified Trainer (MCT)' },
      { '@type': 'EducationalOccupationalCredential', name: 'Microsoft Certified: Azure AI Engineer Associate' },
      { '@type': 'EducationalOccupationalCredential', name: 'Microsoft Certified: Power BI Data Analyst Associate' },
    ],
    sameAs: [
      'https://www.linkedin.com/in/lostspace003/',
      'https://github.com/lostspace003',
      'https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gennoor Tech',
    url: 'https://gennoor.com',
    description: 'Enterprise AI Training & Solutions',
    publisher: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ServiceJsonLd({ name, description, url }: { name: string; description: string; url: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      url: 'https://gennoor.com',
    },
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    serviceType: 'AI Training and Consulting',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function CourseJsonLd({
  title,
  description,
  url,
  courseCode,
  duration,
  level,
  audience,
  image,
}: {
  title: string
  description: string
  url: string
  courseCode?: string
  duration?: string
  level?: string
  audience?: string
  image?: string
}) {
  // Schema.org Course — eligible for Google's Course Info rich-result snippet.
  // ISO-8601 duration: "~36 min" → "PT36M". Best-effort parse.
  const isoDuration = (() => {
    if (!duration) return undefined
    const m = duration.match(/(\d+)\s*min/i)
    if (m) return `PT${m[1]}M`
    const h = duration.match(/(\d+)\s*hour/i)
    if (h) return `PT${h[1]}H`
    return undefined
  })()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    url,
    courseCode,
    provider: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      sameAs: 'https://gennoor.com',
      url: 'https://gennoor.com',
    },
    inLanguage: 'en',
    isAccessibleForFree: true,
    educationalLevel: level,
    audience: audience ? { '@type': 'EducationalAudience', educationalRole: audience } : undefined,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: isoDuration,
      url,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      category: 'free',
      availability: 'https://schema.org/InStock',
      url,
    },
    ...(image && { image }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  image,
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  authorName: string
  image?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://gennoor.com/about/journey',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      url: 'https://gennoor.com',
    },
    ...(image && { image }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
