import { Outlet } from "react-router-dom";
import Header from "@/layouts/Header/Header";
import Footer from "@/layouts/Footer/Footer";

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
