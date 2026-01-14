import { Link } from "react-router-dom";
import useLogout from "@/global/hooks/useLogout";
import logo from "@/assets/images/plantory_logo.png"

export default function AdminHeader() {
    const handleLogout = useLogout();

    return (
        <header className="bg-white shadow-sm sticky-top">
            <nav className="container d-flex align-items-center justify-content-between" style={{ height: 80 }}>
                <Link to="/admin/memberManagement" className="fw-bold fs-4 text-decoration-none text-dark">
                    <img src={logo} alt="Plantory Logo" className="ph-logo-img" />
                </Link>

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

                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    로그아웃
                </button>
            </nav>
        </header>
    );
}
