import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MessageList from "./pages/MessageList";
import SharingList from "./pages/SharingList";
import SignUp from "@/pages/SignUp";

import PrivateRoute from "./routes/PrivateRoute";
import AuthInitializer from "@/routes/AuthInitializer";

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
                        <Route path="/messageList" element={<MessageList />} />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            )}
        </AuthInitializer>
    );
}