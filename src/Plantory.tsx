import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import LoginPage from "@/member/pages/LoginPage";
import Dashboard from "@/dashboard/pages/Dashboard";
import MessageList from "@/message/pages/MessageList";
import MessageDetail from "@/message/pages/MessageDetail";
import PrivateRoute from "./routes/PrivateRoute";
import SignUpPage from "@/member/pages/SignUpPage";
import AuthInitializer from "@/routes/AuthInitializer";
import SharingList from "@/community/sharing/pages/SharingList";
import TermsOfServicePage from "@/member/pages/TermsOfServicePage";
import ReadSharing from "./community/sharing/pages/ReadSharing";
import PlantDictionary from "@/dictionary/pages/PlantDictionary";
import DictionaryDetail from "@/dictionary/pages/DictionaryDetail";
import DryPlantDictionary from "./dictionary/pages/DryPlantDictionary";
import DryDictionaryDetail from "./dictionary/pages/DryDictionaryDetail";
import CreateSharing from "@/community/sharing/pages/CreateSharing";
import PlantCalendar from "@/myPlant/pages/PlantCalendar";
import MyPlantManagement from "@/myPlant/pages/MyPlantManagement";

export default function App() {
    const initialized = useAuthStore((s) => s.initialized);

    return (
        <AuthInitializer>
            {!initialized ? (
                <div>로딩중...</div>
            ) : (
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/termsOfServicePage" element={<TermsOfServicePage />} />
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
                        <Route path="/readSharing/:sharingId" element={<ReadSharing />} />
                        <Route path="/createSharing" element={<CreateSharing />} />
                        <Route path="/MessageList" element={<MessageList />} />
                        <Route path="/messageDetail/:messageId" element={<MessageDetail />} />
                        <Route path="/plantDictionary" element={<PlantDictionary />} />
                        <Route path="/dictionaryDetail/:cntntsNo" element={<DictionaryDetail />} />
                        <Route path="/dryPlantDictionary" element={<DryPlantDictionary />} />
                        <Route path="/dryDictionaryDetail/:cntntsNo" element={<DryDictionaryDetail />} />
                        <Route path="/plantCalendar" element={<PlantCalendar />} />
                        <Route path="/myPlantManagement" element={<MyPlantManagement />} />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            )}
        </AuthInitializer>
    );
}