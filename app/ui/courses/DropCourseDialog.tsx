'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/constants"

export default function DropCourseDialog({
    courseCode,
    userId,
    onCourseDropped,
}: {
    courseCode: string | null;
    userId: string | null;
    onCourseDropped?: () => void;
}) {
    const [loading, setLoading] = useState(false)

    const handleDropCourse = async () => {
        try {
            setLoading(true)

            const res = await fetch(`${API_BASE_URL}/users/students/${userId}/course_registrations/${courseCode}`, {
                method: "DELETE", // or "POST" depending on your backend
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })

            if (!res.ok) throw new Error("Failed to drop course")

            if (onCourseDropped) {
                onCourseDropped();
            }
        } catch (err) {
            console.error(err)
            alert("Failed to drop course. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="grow w-1/6 border-l-2 p-3 font-semibold items-center flex cursor-pointer hover:bg-red-200 hover:rounded-r-lg">
                    Drop Course
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will unregister you from this course. You can re-register if eligible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDropCourse} disabled={loading}>
                        {loading ? "Dropping..." : "Confirm Drop"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
