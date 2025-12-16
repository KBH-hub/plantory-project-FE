import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import TermsOfService from "./pages/TermsOfService";
import Dashboard from "./pages/Dashboard";
import MessageList from "./pages/MessageList"
import PrivateRoute from "./routes/PrivateRoute";
import SignUp from "@/pages/SignUp";
// import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                {/*<Route path="/terms-of-service" element={<TermsOfService />} />*/}
            </Route>

            <Route
                element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/messageList" element={<MessageList />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
