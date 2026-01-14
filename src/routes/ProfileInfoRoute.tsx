import { Routes, Route } from "react-router-dom";
import ProfileInfo from "@/profile/pages/ProfileInfo";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/profile" element={<ProfileInfo />} />

            <Route path="/profile/:profileId" element={<ProfileInfo />} />
        </Routes>
    );
}