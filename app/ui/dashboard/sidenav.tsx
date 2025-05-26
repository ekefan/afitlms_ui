import Link from 'next/link';
import NavLinks from './navlinks';


export default function SideNav() {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Link
                className="mb-2 flex h-20 items-end justify-start rounded-md border-2 p-4 md:h-40"
                href="/dashboard"
            >
                AFIT Lecture Monitoring System
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks />
                <div className="hidden h-auto w-full grow rounded-md border-2 md:block"></div>
                <form
                    action={async () => {
                        'use server';
                        // await signOut({ redirectTo: '/' });
                    }}
                >
                    <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md border-2 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    );
}