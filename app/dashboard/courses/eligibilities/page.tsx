'use client'

import { FiltersDropdowns } from "@/app/ui/courses/RegisterCoursesFilter";
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/constants";
import { useRole } from '@/app/ui/courses/RoleContext'
import { toast } from "sonner";
import { EligibilityModal } from "@/app/ui/courses/EligibilityModal"; // Import the new modal component

// Define the types for your data (can be in a shared types file)
type CourseData = {
    course_code: string;
    course_name: string;
    faculty: string;
    level: string; // Assuming level might come as a string from API
    department: string;
}

type StudentEligibility = {
    student_name: string;
    matric_number: string;
    eligibility: number;
}

type EligibilityList = {
    course_data: CourseData;
    student_eligibility: StudentEligibility[];
}

const allCourses = [
    {
        name: "Digital Systems",
        faculty: "FGCE",
        department: "EEE",
        level: 200,
        course_code: "EEE201"
    },
    {
        name: "Signals & Systems",
        faculty: "FGCE",
        department: "TEC",
        level: 300,
        course_code: "TEC301"
    },
    {
        name: "Soil Mechanics",
        faculty: "FGCE",
        department: "CEE",
        level: 300,
        course_code: "CEE301"
    },
    {
        name: "Electromagnetics",
        faculty: "FGCE",
        department: "EEE",
        level: 300,
        course_code: "EEE302"
    },
    {
        name: "Wireless Communication",
        faculty: "FGCE",
        department: "TEC",
        level: 400,
        course_code: "TEC401"
    }
];

export default function DashboardPage() {
    const [faculty, setFaculty] = useState<string | null>(null);
    const [level, setLevel] = useState<number | null>(null);
    const [department, setDepartment] = useState<string | null>(null);
    const [filteredCourses, setFilteredCourses] = useState<typeof allCourses>([]);
    const [eligibilityList, setEligibilityList] = useState<EligibilityList | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [showEligibilityModal, setShowEligibilityModal] = useState(false);
    const { activeRole, userId } = useRole();
    const router = useRouter();


    const setFilterForFetchingCourses = useCallback((
        fcFaculty: string | null,
        fcLevel: number | null,
        dept: string | null
    ): void => {
        setFaculty(fcFaculty);
        setLevel(fcLevel);
        setDepartment(dept);
        setShowEligibilityModal(false);
        setEligibilityList(null);
    }, []);

    useEffect(() => {
        setIsClient(true);
        if (activeRole === 'course_admin' || activeRole === 'student') router.push('/dashboard/courses/');

        // TODO: Fetch courses from API instead of using hardcoded data
        // for lecturers, fetch courses based on their department and level and the course they teach
        // for admins, fetch all courses
        const filtered = allCourses.filter(course => {
            return (
                (!faculty || course.faculty === faculty) &&
                (!level || course.level === level) &&
                (!department || course.department === department)
            );
        });
        setFilteredCourses(filtered);
    }, [faculty, level, department]);


    const handleGetEligibilityList = async (courseCode: string) => {
        if (!userId) {
            toast.error("Error", {
                description: "User ID not found. Please log in.",
            });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/eligibility?course_code=${courseCode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data: EligibilityList = await response.json();


            setEligibilityList(data);
            console.log("Eligibility List:", data);
            setShowEligibilityModal(true);

            toast.success("Success", {
                description: `Eligibility list for ${courseCode} fetched successfully.`,
            });
        } catch (error: any) {
            console.error("Failed to fetch eligibility list:", error);
            toast.error("Error", {
                description: `Failed to fetch eligibility list: ${error.message}`,
            });
            setEligibilityList(null); // Clear eligibility list on error
            setShowEligibilityModal(false); // Ensure modal is closed on error
        }
    };

    const handleCloseModal = () => {
        setShowEligibilityModal(false);
        setEligibilityList(null);
    };


    if (!isClient) return null;

    return (
        <div className="p-6">
            <FiltersDropdowns onFilterCourses={setFilterForFetchingCourses} />

            <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">All Courses</h2>
                {filteredCourses.length === 0 ? (
                    <p>No courses match the selected filters.</p>
                ) : (
                    <ul className="space-y-4">
                        {filteredCourses.map((course, index) => (
                            <li
                                key={index}
                                className="border rounded-lg shadow-sm flex justify-between"
                            >
                                <div className="grow w-full p-3">
                                    <p><strong>{course.course_code}</strong> - {course.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Faculty: {course.faculty}, Dept: {course.department}, Level: {course.level}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleGetEligibilityList(course.course_code)}
                                    className="border-l hover:bg-green-200 hover:rounded-r-lg text-sm w-2/6 text-semi-bold"
                                >
                                    Get Eligibility List
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {showEligibilityModal && eligibilityList && (
                <EligibilityModal
                    eligibilityList={eligibilityList}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}