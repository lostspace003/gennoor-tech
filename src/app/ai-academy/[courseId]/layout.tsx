import { verifyLearnerSession } from '@/lib/learner-auth'
import SignInGate from '@/components/academy/SignInGate'

// Every Learning Studio course opens for signed-in learners only.
export default async function CourseGateLayout({ children }: { children: React.ReactNode }) {
  const learner = await verifyLearnerSession()
  if (!learner) return <SignInGate />
  return <>{children}</>
}
