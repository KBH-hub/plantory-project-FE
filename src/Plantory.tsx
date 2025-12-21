import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";

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
import UpdateReview from "@/community/sharing/pages/UpdateReview";
import QuestionList from "./community/question/pages/QuestionList";
import RoleRoute from "@/routes/RoleRoute";
import AdminLayout from "@/layouts/AdminLayout";
import RootRedirectRoute from "@/routes/RootRedirectRoute";
import AuthLayout from "@/layouts/AuthLayout";
import MemberManagementPage from "@/admin/pages/MemberManagementPage";
import CreateQuestion from "./community/question/pages/CreateQuestion";
import ProfileSharingHistory from "./member/pages/ProfileSharingHistory";
import WeightManagementPage from "./admin/pages/WeightManagementPage";
import ProfileInfoPage from "@/profile/pages/ProfileInfoPage";
import UpdateProfilePage from "@/profile/pages/UpdateProfilePage";

export default function App() {
    const initialized = useAuthStore((s) => s.initialized);

    return (
        <AuthInitializer>
            {!initialized ? (
                <div>로딩중...</div>
            ) : (
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/" element={<RootRedirectRoute />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/termsOfServicePage" element={<TermsOfServicePage />} />
                    </Route>
                    {/* USER */}
                    <Route
                        element={
                            <PrivateRoute>
                                <MainLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/sharingList" element={<SharingList />} />
                        <Route path="/sharing/:sharingId" element={<ReadSharing />} />
                        <Route path="/sharing/create" element={<CreateSharing />} />
                        <Route path="/sharing/:sharingId/edit" element={<CreateSharing />} />
                        <Route path="/questionList" element={<QuestionList />} />
                        <Route path="/sharing/:sharingId/review" element={<UpdateReview />} />
                        <Route path="/MessageList" element={<MessageList />} />
                        <Route path="/messageDetail/:messageId" element={<MessageDetail />} />
                        <Route path="/plantDictionary" element={<PlantDictionary />} />
                        <Route path="/dictionaryDetail/:cntntsNo" element={<DictionaryDetail />} />
                        <Route path="/dryPlantDictionary" element={<DryPlantDictionary />} />
                        <Route path="/dryDictionaryDetail/:cntntsNo" element={<DryDictionaryDetail />} />
                        <Route path="/plantCalendar" element={<PlantCalendar />} />
                        <Route path="/myPlantManagement" element={<MyPlantManagement />} />
                        <Route path="/profile" element={<ProfileInfoPage />} />
                        <Route path="/profile/update/:memberId" element={<UpdateProfilePage />} />
                    </Route>

                    {/* ADMIN */}
                    <Route
                        element={
                            <PrivateRoute>
                                <RoleRoute allow={["ADMIN"]}>
                                    <AdminLayout />
                                </RoleRoute>
                            </PrivateRoute>
                        }
                    >
                        <Route path="/admin/memberManagement" element={<MemberManagementPage />} />
                        {/*<Route path="/admin/reportManagement" element={<ReportManagement />} />*/}
                        <Route path="/admin/weightManagement" element={<WeightManagementPage />} />
                    </Route>
                </Routes>
            )}
        </AuthInitializer>
    );
}