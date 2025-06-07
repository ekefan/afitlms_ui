'use client'

import CourseAdminCourses from '@/app/ui/courses/CourseAdminCoursesPage'
import LecturerCourses from '@/app/ui/courses/LecturerCoursesPage'
import StudentCourses from '@/app/ui/courses/StudentCoursesPage'
import { useRole } from '@/app/ui/courses/RoleContext'

export default function DashboardUsersPage() {
    const { activeRole, userId } = useRole()

    return (
        <div>
            {activeRole === 'lecturer' && <LecturerCourses userId={userId} />}
            {activeRole === 'student' && <StudentCourses userId={userId} />}
            {activeRole === 'course_admin' && <CourseAdminCourses userId={userId} />}
        </div>
    )
}
