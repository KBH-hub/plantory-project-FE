import { Routes, Route } from "react-router-dom";
import ProfileInfo from "@/profile/pages/ProfileInfo";

export default function AppRoutes() {
    return (
        <Routes>
            {/* 내 프로필 */}
            <Route path="/profile" element={<ProfileInfo />} />

            {/* 공개 프로필 */}
            <Route path="/profile/:profileId" element={<ProfileInfo />} />
        </Routes>
    );
}