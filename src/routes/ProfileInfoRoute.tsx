import { Routes, Route } from "react-router-dom";
import ProfileInfoPage from "@/profile/pages/ProfileInfoPage";

export default function AppRoutes() {
    return (
        <Routes>
            {/* 내 프로필 */}
            <Route path="/profile" element={<ProfileInfoPage />} />

            {/* 공개 프로필 */}
            <Route path="/profile/:profileId" element={<ProfileInfoPage />} />
        </Routes>
    );
}