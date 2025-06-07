'use client'

import { RoleContext } from '@/app/ui/courses/RoleContext'
import React, { useEffect, useState } from 'react'
import { RoleSwitcherDropdown } from '@/app/ui/courses/SwitchRoles'

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false)
    const [userRoles, setUserRoles] = useState<string[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [activeRole, setActiveRole] = useState<string>('student')

    useEffect(() => {
        setIsClient(true)

        try {
            const rawUser = localStorage.getItem('user')
            const user = rawUser ? JSON.parse(rawUser) : null

            if (!user) {
                alert("Couldn't read user from local storage")
                return
            }

            const roles: string[] = user.roles || []
            setUserRoles(roles)
            setUserId(user.id || null)

            const savedRole = localStorage.getItem('active_role')
            if (savedRole && roles.includes(savedRole.toLowerCase())) {
                setActiveRole(savedRole.toLowerCase())
            } else if (!savedRole) {
                const defaultRole = roles.includes("lecturer")
                    ? "lecturer"
                    : roles.includes("course_admin")
                        ? "course_admin"
                        : "student"
                setActiveRole(defaultRole)
                localStorage.setItem("active_role", defaultRole)
            }
        } catch (err) {
            console.error("Error parsing user roles:", err)
        }
    }, [])

    const switchRole = () => {
        const otherRoles = userRoles.filter(r => r.toLowerCase() !== activeRole.toLowerCase());
        if (otherRoles.length > 0) {
            setActiveRole(otherRoles[0]);
        }
    };

    if (!isClient) return null

    return (
        <RoleContext.Provider value={{ activeRole, switchRole, userId }}>
            <div className="p-6 space-y-6 xl:w-8/12">
                <div className=" space-y-6">
                    <h1 className="text-2xl font-semibold">Manage Your Courses</h1>
                    <div className="flex justify-end">
                        {userRoles.length >= 1 && (
                            <RoleSwitcherDropdown
                                roles={userRoles}
                                activeRole={activeRole}
                                onRoleChange={switchRole}
                            />
                        )}
                    </div>
                </div>

                {children}
            </div>
        </RoleContext.Provider>
    )
}
