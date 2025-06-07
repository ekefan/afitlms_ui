'use client';

import { API_BASE_URL } from '@/lib/constants';
import { useEffect, useState } from 'react';

type CourseEligibility = {
    course_id: string;
    course_code: string;
    course_name: string;
    eligibility: number;
};

export default function StudentCourses({ userId }: { userId: string | null }) {
    const [courses, setCourses] = useState<CourseEligibility[]>([]);
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
        const fetchCourses = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`${API_BASE_URL}/users/students/${userId}/eligibility`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch courses');
                }

                const data = await res.json();
                setCourses(data.courses);
            } catch (err: any) {
                console.log(err)
            }
        };

        fetchCourses();
        console.log(courses)
    }, [userId]);

    if (!isClient) return null
    return (
        <div className="">
            <h1 className="text-xl font-semibold mb-6">Registered Courses</h1>

            {courses.length === 0 ? (
                <p>No courses found.</p>
            ) : (
                <div className="space-y-4">
                    {courses.map(course => (
                        <div
                            key={crypto.randomUUID()}
                            className="flex items-center justify-between border rounded-lg shadow-sm p-4"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {course.course_code} - {course.course_name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Eligibility:{" "}
                                    <span
                                        className={course.eligibility > 0.75 ? "text-green-600" : "text-red-600"}
                                    >
                                        {course.eligibility > 0.75 ? `${course.eligibility * 100}% Eligible` : `${course.eligibility * 100}% Not Eligible`}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
