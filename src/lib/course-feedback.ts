import { TableClient, RestError } from '@azure/data-tables'

const TABLE_NAME = 'CourseFeedback'

export type CourseFeedback = {
  courseId: string
  /** Cert ID of the completing learner — also the row key. */
  certId: string
  learnerEmail: string
  learnerName?: string
  /** 1–5. */
  rating: number
  /** Optional free-text. */
  comments?: string
  /** ISO timestamp. */
  createdAt: string
}

function getConnectionString() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return conn
}

function getTable() {
  return TableClient.fromConnectionString(getConnectionString(), TABLE_NAME)
}

async function ensureTable() {
  try {
    await getTable().createTable()
  } catch (err: unknown) {
    if (err instanceof RestError && err.statusCode !== 409) throw err
  }
}

/**
 * Save a course-completion feedback entry. Idempotent on (courseId, certId) —
 * resubmission overwrites the prior entry so a learner can refine their rating.
 */
export async function saveCourseFeedback(input: {
  courseId: string
  certId: string
  learnerEmail: string
  learnerName?: string
  rating: number
  comments?: string
}): Promise<CourseFeedback> {
  await ensureTable()
  const client = getTable()
  const now = new Date().toISOString()
  const entity = {
    partitionKey: input.courseId,
    rowKey: input.certId,
    courseId: input.courseId,
    certId: input.certId,
    learnerEmail: input.learnerEmail,
    learnerName: input.learnerName ?? '',
    rating: input.rating,
    comments: input.comments ?? '',
    createdAt: now,
  }
  await client.upsertEntity(entity, 'Replace')
  return entity as unknown as CourseFeedback
}

/**
 * Look up an existing feedback row for a given learner's cert. Used to
 * pre-populate the feedback form if they come back to the completion screen.
 */
export async function getCourseFeedback(
  courseId: string,
  certId: string,
): Promise<CourseFeedback | null> {
  try {
    await ensureTable()
    const client = getTable()
    const entity = await client.getEntity<CourseFeedback>(courseId, certId)
    return entity as unknown as CourseFeedback
  } catch (err: unknown) {
    if (err instanceof RestError && err.statusCode === 404) return null
    throw err
  }
}
