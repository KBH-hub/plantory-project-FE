import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MessageList from "@/pages/MessageList";
import MessageDetail from "@/pages/MessageDetail";
import PrivateRoute from "./routes/PrivateRoute";
import SignUp from "@/pages/SignUp";
import AuthInitializer from "@/routes/AuthInitializer";
import SharingList from "./pages/SharingList";

export default function App() {
    const initialized = useAuthStore((s) => s.initialized);

    return (
        <AuthInitializer>
            {!initialized ? (
                <div>로딩중...</div>
            ) : (
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Route>

            <Route
                element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sharingList" element={<SharingList />} />
                <Route path="/MessageList" element={<MessageList />} />
                <Route path="/messageDetail/:messageId" element={<MessageDetail />} />
            </Route>

                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            )}
        </AuthInitializer>
    );
}