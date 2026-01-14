import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";

import MainLayout from "./layouts/MainLayout";

import Login from "@/member/pages/Login";
import Dashboard from "@/dashboard/pages/Dashboard";
import MessageList from "@/message/pages/MessageList";
import MessageDetail from "@/message/pages/MessageDetail";
import PrivateRoute from "./routes/PrivateRoute";
import SignUp from "@/member/pages/SignUp";
import AuthInitializerRoute from "@/routes/AuthInitializerRoute";
import SharingList from "@/community/sharing/pages/SharingList";
import TermsOfService from "@/member/pages/TermsOfService";
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
import MemberManagement from "@/admin/pages/MemberManagement";
import CreateQuestion from "./community/question/pages/CreateQuestion";
import ProfileSharingHistory from "./profile/pages/ProfileSharingHistory";
import WeightManagement from "./admin/pages/WeightManagement";
import ProfileInfo from "@/profile/pages/ProfileInfo";
import ReadQuestion from "./community/question/pages/ReadQuestion";
import ProfileInterest from "./profile/pages/ProfileInterest";
import UpdateProfile from "@/profile/pages/UpdateProfile";
import ReportManagement from "./admin/pages/ReportManagement";

export default function App() {
    const initialized = useAuthStore((s) => s.initialized);

    return (
        <AuthInitializerRoute>
            {!initialized ? (
                <div>로딩중...</div>
            ) : (
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/" element={<RootRedirectRoute />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/termsOfServicePage" element={<TermsOfService />} />
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
                        <Route path="/sharing/:sharingId" element={<ReadSharing />} />
                        <Route path="/sharing/create" element={<CreateSharing />} />
                        <Route path="/sharing/:sharingId/edit" element={<CreateSharing />} />
                        <Route path="/sharing/:sharingId/review" element={<UpdateReview />} />
                        <Route path="/question/:questionId" element={<ReadQuestion />} />
                        <Route path="/question/create" element={<CreateQuestion />} />
                        <Route path="/question/:questionId/edit" element={<CreateQuestion />} />
                        <Route path="/questionList" element={<QuestionList />} />
                        <Route path="/sharingHistory" element={<ProfileSharingHistory />} />
                        <Route path="/profileInterest" element={<ProfileInterest />} />
                        <Route path="/MessageList" element={<MessageList />} />
                        <Route path="/messageDetail/:messageId" element={<MessageDetail />} />
                        <Route path="/plantDictionary" element={<PlantDictionary />} />
                        <Route path="/dictionaryDetail/:cntntsNo" element={<DictionaryDetail />} />
                        <Route path="/dryPlantDictionary" element={<DryPlantDictionary />} />
                        <Route path="/dryDictionaryDetail/:cntntsNo" element={<DryDictionaryDetail />} />
                        <Route path="/plantCalendar" element={<PlantCalendar />} />
                        <Route path="/myPlantManagement" element={<MyPlantManagement />} />
                        <Route path="/profile" element={<ProfileInfo />} />
                        <Route path="/publicProfile/:memberId" element={<ProfileInfo />} />
                        <Route path="/profile/update" element={<UpdateProfile />} />
                        <Route path="/sharing/:id" element={<ReadSharing />} />
                    </Route>

                    <Route
                        element={
                            <PrivateRoute>
                                <RoleRoute allow={["ADMIN"]}>
                                    <AdminLayout />
                                </RoleRoute>
                            </PrivateRoute>
                        }
                    >
                        <Route path="/admin/memberManagement" element={<MemberManagement />} />
                        <Route path="/admin/reportManagement" element={<ReportManagement />} />
                        <Route path="/admin/profile/:memberId" element={<ProfileInfo />} />
                        <Route path="/admin/weightManagement" element={<WeightManagement />} />
                    </Route>
                </Routes>
            )}
        </AuthInitializerRoute>
    );
}