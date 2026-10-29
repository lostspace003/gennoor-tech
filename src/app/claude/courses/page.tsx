import { redirect } from 'next/navigation'

// The breadcrumb "Courses" step: there is no separate list page, the courses are on /claude.
export default function CoursesIndex() {
  redirect('/claude#courses')
}
