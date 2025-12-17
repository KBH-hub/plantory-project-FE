import { Outlet } from "react-router-dom";
import Header from "@/global/components/Header";
import Footer from "@/global/components/Footer";

export default function MainLayout() {
    return (
        <>
            <Header />
            <main className="min-vh-100">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
