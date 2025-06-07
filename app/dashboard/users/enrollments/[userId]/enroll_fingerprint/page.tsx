'use client';

import { API_BASE_URL } from "@/lib/constants";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EnrollFingerPrintsPage() {
    const [isClient, setIsClient] = useState(false);
    const [isEnrolledText, setIsEnrolledText] = useState("Enrolling...");
    const params = useParams<{ userId: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();

    const userID = params.userId;
    const name = searchParams.get('name');
    const schId = searchParams.get('schId');
    const rolesParam = searchParams.get('roles')
    const roles = decodeURIComponent(rolesParam || '')
        .split(',')
        .map(role => role.trim().toLowerCase())
        .filter(role => role !== '');

    useEffect(() => {
        setIsClient(true);
        if (roles.length === 0) {
            setIsEnrolledText("No roles assigned. Please assign roles before enrolling.");
            return;
        }
        const enrollUser = async () => {
            setIsEnrolledText(`User is being enrolled with fingerprint. Please place your finger on the sensor...`);

            try {
                //TODO: post request to enroll will be sent to webhook for enrollment,
                // Edge device sends confirmation back to the server and the server responds here
                /*
                🔌 Option 2: WebSocket (Best UX)
                        Frontend initiates enrollment via POST.

                        Backend notifies the edge device.

                        Edge device enrolls and sends callback to server.

                        Backend then broadcasts via WebSocket to the frontend that the user is enrolled.

                        This gives instant feedback and eliminates polling.

                        You'll need:
                        A WebSocket server (can use Socket.IO, ws, or native WebSocket).

                        Client that listens for messages:

                        ts
                        Copy
                        Edit
                        const socket = new WebSocket('ws://localhost:8080/ws');

                        socket.onmessage = (event) => {
                            const data = JSON.parse(event.data);
                            if (data.userId === userID && data.status === 'done') {
                                setIsEnrolledText('User has been successfully enrolled.');
                            }
                        };
*/
                await new Promise(resolve => setTimeout(resolve, 5000));
                const response = await fetch(`${API_BASE_URL}/users/${userID}/enrollments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roles: roles, // You can update this dynamically if needed
                        biometric_template: '' // Optional or mock placeholder for now
                    }),
                });

                // Replace with actual API call as needed
                setIsEnrolledText(`User has been successfully enrolled.`);
            } catch (error) {
                setIsEnrolledText("Enrollment failed. Please try again.");
                console.error("Enrollment error:", error);
            }
        };

        enrollUser();
    }, [userID, router]);

    if (!isClient) return null;

    return (
        <div className="">
            <h1 className="text-lg font-semibold mb-4">2. Enroll Fingerprint</h1>

            <div className="mb-4">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>School ID:</strong> {schId}</p>
            </div>

            <p className="mb-4">{isEnrolledText}</p>

            {isEnrolledText === "User has been successfully enrolled." && (
                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={() => router.push('/dashboard/users/enrollments/')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Create New User
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}
