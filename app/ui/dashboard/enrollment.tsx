"use client"

import { z } from "zod"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"


export default function CreateUser() {
    const formSchema = z.object(
        {
            email: z.string().email({ message: "sample: user@sample.com" }),
            fullname: z.string().min(2, { message: "sample John Doe" }),
            schID: z.string().min(2, { message: "sample U19-EEE-110" }),
        }
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            fullname: "",
            schID: "",
        },
    })
    const router = useRouter()
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const result = await submitFormToCreateUser(data)
        if (!result.success) {
            form.setError('email', { type: 'server', message: result.message })
            form.setError('fullname', { type: 'server', message: result.message })
            form.setError('schID', { type: 'server', message: result.message })
            return
        }
        // router.push('/dashboard/role-assignments')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="enter user's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="enter email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="schID"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User School ID</FormLabel>
                            <FormControl>
                                <Input placeholder="student ID" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Create User</Button>
            </form>
        </Form>

    )
}

async function submitFormToCreateUser(data: { fullname: string, email: string, schID: string }) {
    const dataToSend = {
        fullname: data.fullname,
        email: data.email,
        sch_id: data.schID,
    }
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error
            return { success: false, message: errorData.message }
        }

        const resData = await response.json()
        console.log(resData)
        alert("User created successfully! Please proceed to assign user roles and biometrics.");

        return { success: true }

    } catch (error) {
        console.error("Error submitting form:", error)
        throw error;
    }
}

// Working on enrollment for users