'use client'

import { FiltersDropdowns } from "@/app/ui/courses/RegisterCoursesFilter";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { API_BASE_URL } from "@/lib/constants";



// Dummy course data
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
    const [selectedCourses, setSelectedCourses] = useState<typeof allCourses>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [userId, setUserID] = useState('');
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    const setFilterForFetchingCourses = (
        fcFaculty: string | null,
        fcLevel: number | null,
        dept: string | null
    ): void => {
        setFaculty(fcFaculty);
        setLevel(fcLevel);
        setDepartment(dept);
    }
    useEffect(() => {
        setIsClient(true);
        // Filter courses
        const filtered = allCourses.filter(course => {
            return (
                (!faculty || course.faculty === faculty) &&
                (!level || course.level === level) &&
                (!department || course.department === department)
            );
        });
        setFilteredCourses(filtered);
        setSelectedCourses([]); // Reset selected when filters change

        const user = localStorage.getItem('user');
        console.log(user);
        if (user) {
            const storedUserId = JSON.parse(user).id;
            console.log(storedUserId);
            setUserID(storedUserId);
        }


    }, [faculty, level, department]);

    const toggleCourseSelection = (courseCode: string) => {
        setSelectedCourses(prev => {
            const alreadySelected = prev.find(c => c.course_code === courseCode);
            if (alreadySelected) {
                return prev.filter(c => c.course_code !== courseCode);
            } else {
                const courseToAdd = filteredCourses.find(c => c.course_code === courseCode);
                return courseToAdd ? [...prev, courseToAdd] : prev;
            }
        });
    };

    const handleSubmit = async () => {

        //TODO: fetch from cache already registered courses so user can't register course more than once
        const courseCodes = selectedCourses.map(course => course.course_code)
        try {
            const response = await fetch(`${API_BASE_URL}/users/students/${userId}/course_registrations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ course_codes: courseCodes }),
            });

            if (!(response.status === 202)) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            router.push("/dashboard/courses");
        } catch (error) {
            console.error("Registration failed:", error);
        }
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
                                className="border rounded-xl p-4 shadow-sm  flex items-center justify-between"
                            >
                                <div>
                                    <p><strong>{course.course_code}</strong> - {course.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Faculty: {course.faculty}, Dept: {course.department}, Level: {course.level}
                                    </p>
                                </div>
                                <Checkbox
                                    checked={selectedCourses.some(c => c.course_code === course.course_code)}
                                    onCheckedChange={() => toggleCourseSelection(course.course_code)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedCourses.length > 0 && (
                <div className="mt-6">
                    <Button onClick={() => setShowConfirmation(true)}>Submit Selected Courses</Button>

                </div>
            )}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Confirm Your Selection</h3>
                        <ul className="mb-4 max-h-64 overflow-y-auto">
                            {selectedCourses.map((course) => (
                                <li key={course.course_code} className="border-b py-2 text-sm">
                                    <strong>{course.course_code}</strong> - {course.name}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end space-x-4">
                            <Button variant="ghost" onClick={() => setShowConfirmation(false)}>Cancel</Button>
                            <Button onClick={async () => {
                                await handleSubmit();
                                setShowConfirmation(false);
                            }}>Confirm</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
