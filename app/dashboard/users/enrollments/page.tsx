import CreateUser from "@/app/ui/dashboard/enrollment";

export default function EnrollUsersPage() {
    return (
        <div className="p-6 space-y-6 ">
            <h1 className="text-2xl font-semibold mb-4">
                Create New User
            </h1>
            <div className="p-8 rounded-lg w-full max-w-6xl border-2">
                <CreateUser />
            </div>
        </div >
    );
}