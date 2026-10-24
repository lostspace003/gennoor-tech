export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gennoor Tech',
    url: 'https://gennoor.com',
    logo: 'https://gennoor.com/media/logos/gennoor-tech-icon-white_180x180_apple-touch-icon.png',
    description: 'Gennoor Tech trains organizations to work with AI and Claude, and builds the automations they use. Certified in the Claude Partner Network. Based in Mumbai, India.',
    address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
    founder: {
      '@type': 'Person',
      name: 'Jalal Ahmed Khan',
      jobTitle: 'Microsoft Certified Trainer',
      url: 'https://gennoor.com/about',
      sameAs: [
        'https://www.linkedin.com/in/lostspace003/',
        'https://github.com/lostspace003',
        'https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab',
      ],
    },
    sameAs: [
      'https://www.linkedin.com/company/gennoor-tech-private-limited/',
      'https://github.com/lostspace003',
      'https://www.youtube.com/@GennoorTech',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'jalalkhan@gennoor.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi', 'Urdu'],
    },
    knowsAbout: [
      'AI training',
      'AI automation',
      'Claude',
      'Microsoft Azure AI',
      'Learning platforms',
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
    jobTitle: 'Microsoft Certified Trainer',
    url: 'https://gennoor.com/about',
    worksFor: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      url: 'https://gennoor.com',
    },
    description: 'Jalal Ahmed Khan runs Gennoor Tech in Mumbai, India: AI training for organizations, AI automation, and the Learning Studio courses.',
    knowsAbout: [
      'AI training',
      'AI automation',
      'Claude',
      'Azure AI',
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
    description: 'AI training and automation, with Claude. Mumbai, India.',
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
    serviceType: 'AI training and automation',
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
      url: 'https://gennoor.com/about/founder',
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

export interface CourseSeo {
  slug: string
  code: string
  title: string
  description: string
  level: string
  vendor: string
  hours: number
  outcomes: string[]
  imageUrl: string
  hasPromo: boolean
  uploadDate: string
  rating?: { average: number; count: number }
}

/** Course (+ preview video) structured data for a Learning Studio course page. Real data only. */
export function LmsCourseJsonLd({ c }: { c: CourseSeo }) {
  const url = `https://gennoor.com/studio/${c.slug}`
  const provider = { '@type': 'Organization', name: 'Gennoor Tech', url: 'https://gennoor.com' }
  const workload = c.hours > 0 ? `PT${Math.max(1, Math.round(c.hours))}H` : undefined
  const course: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${url}#course`,
    name: c.title,
    description: c.description,
    url,
    courseCode: c.code,
    inLanguage: 'en',
    educationalLevel: c.level,
    image: c.imageUrl,
    provider,
    author: { '@type': 'Person', name: 'Jalal Ahmed Khan', url: 'https://gennoor.com/about/founder' },
    teaches: c.outcomes.slice(0, 12),
    offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', url },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: workload,
      instructor: { '@type': 'Person', name: 'Jalal Ahmed Khan' },
    },
  }
  if (workload) course.timeRequired = workload
  if (c.rating && c.rating.count > 0) {
    course.aggregateRating = { '@type': 'AggregateRating', ratingValue: c.rating.average.toFixed(1), ratingCount: c.rating.count, bestRating: 5, worstRating: 1 }
  }
  const graph: Record<string, unknown>[] = [course]
  if (c.hasPromo) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: `${c.title}: course preview`,
      description: c.description,
      thumbnailUrl: [c.imageUrl],
      uploadDate: c.uploadDate,
      isAccessibleForFree: true,
      publisher: provider,
    })
  }
  return (
    <>
      {graph.map((g, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(g) }} />
      ))}
    </>
  )
}
