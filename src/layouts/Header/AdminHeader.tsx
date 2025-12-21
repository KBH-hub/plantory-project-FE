import { Link } from "react-router-dom";
import useLogout from "@/global/hooks/useLogout";

export default function AdminHeader() {
    const handleLogout = useLogout();

    return (
        <header className="bg-white shadow-sm sticky-top">
            <nav className="container d-flex align-items-center justify-content-between" style={{ height: 80 }}>
                {/* 로고 */}
                <Link to="/admin/memberManagement" className="fw-bold fs-4 text-decoration-none text-dark">
                    🌿 Plantory Admin
                </Link>

                {/* 관리자 메뉴 */}
                <ul className="d-flex gap-4 list-unstyled mb-0">
                    <li>
                        <Link to="/admin/memberManagement" className="text-decoration-none text-dark fw-bold">
                            회원관리
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/reportManagement" className="text-decoration-none text-dark fw-bold">
                            신고관리
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/weightManagement" className="text-decoration-none text-dark fw-bold">
                            추천관리
                        </Link>
                    </li>
                </ul>

                {/* 로그아웃 */}
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    로그아웃
                </button>
            </nav>
        </header>
    );
}
