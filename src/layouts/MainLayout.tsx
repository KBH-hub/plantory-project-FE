import { Outlet } from "react-router-dom";
import UserHeader from "@/layouts/Header/UserHeader";
import Footer from "@/layouts/Footer/Footer";

export default function MainLayout() {
    return (
        <>
            <UserHeader />
            <main className="min-vh-100">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
