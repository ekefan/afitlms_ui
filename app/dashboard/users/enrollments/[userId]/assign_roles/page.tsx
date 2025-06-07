'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AssignRolesPage() {
    const params = useParams<{ userId: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();

    const userId = params.userId;
    const name = searchParams.get('name');
    const schId = searchParams.get('schId');

    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isClient, setIsClient] = useState(false);

    const availableRoles = ['Student', 'Lecturer', 'Admin', 'Course_Admin'];

    const toggleRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, [])
    const validateRoles = () => {
        if (selectedRoles.length === 0) {
            return 'Please select at least one role.';
        }

        if (selectedRoles.includes('Admin') && selectedRoles.includes('Student')) {
            return 'A user cannot be both an Admin and a Student.';
        }

        if (selectedRoles.includes('Lecturer') && selectedRoles.includes('Course_Admin')) {
            return 'A user cannot be a Lecturer and a Course_Admin'
        }

        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateRoles();
        if (validationError) {
            setSubmitMessage(validationError);
            return;
        }
        setIsSubmitting(true);
        setSubmitMessage('Assigning role(s)...');

        try {
            const encodedRoles = encodeURIComponent(selectedRoles.join(','));
            router.push(`/dashboard/users/enrollments/${userId}/enroll_fingerprint?name=${name}&schId=${schId}&roles=${encodedRoles}`);
        } catch (error) {
            console.error('Error assigning roles:', error);
            setSubmitMessage('Failed to assign roles. Please try again');
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false)
        }
    };
    if (!isClient) {
        return
    }

    if (!userId || !name || !schId) {
        console.error('Missing userId, name, or schId in search params');
        return <div className="p-4">Missing user info. Please go back and try again.</div>;
    }


    return (
        <div className="">
            <h1 className="text-xl font-semibold mb-4">3. Assign Role(s) to User</h1>

            <div className="mb-4">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>School ID:</strong> {schId}</p>
            </div>

            <div className="mb-4">
                <p className="font-medium mb-2">Select Roles:</p>
                {availableRoles.map((role) => (
                    <label key={role} className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            value={role}
                            checked={selectedRoles.includes(role)}
                            onChange={() => toggleRole(role)}
                            disabled={isSubmitting}
                        />
                        <span>{role}</span>
                    </label>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {isSubmitting ? 'Submitting...' : 'Assign Role(s)'}
            </button>

            {submitMessage && <p className="mt-4 text-sm text-gray-600">{submitMessage}</p>}
        </div>
    );
}
