import { Outlet } from "react-router-dom";
import AdminHeader from "@/layouts/Header/AdminHeader";

export default function AdminLayout() {
    return (
        <>
            <AdminHeader />
            <main className="min-vh-100 bg-light">
                <Outlet />
            </main>
        </>
    );
}
