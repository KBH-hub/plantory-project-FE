import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import Login from "@/domain/dashboard/pages/Login";
import Dashboard from "@/domain/dashboard/pages/Dashboard";
import MessageList from "@/domain/message/pages/MessageList";
import MessageDetail from "@/domain/message/pages/MessageDetail";
import PrivateRoute from "./routes/PrivateRoute";
import SignUp from "@/domain/dashboard/pages/SignUp";
import AuthInitializer from "@/routes/AuthInitializer";
import SharingList from "@/domain/dashboard/pages/SharingList";

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