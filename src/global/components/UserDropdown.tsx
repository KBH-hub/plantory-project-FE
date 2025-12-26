import { Link } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";
import useLogout from "@/global/hooks/useLogout";

export default function UserDropdown() {
    const user = useAuthStore((s) => s.user);
    const handleLogout = useLogout();

    if (!user) {
        return (
            <Link to="/login" className="text-dark text-decoration-none">
                로그인
            </Link>
        );
    }
    return (
        <div className="dropdown ph-profile">
            <button
                type="button"
                className="d-flex align-items-center text-dark text-decoration-none ph-profile-btn btn btn-link p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt="profile"
                        className="rounded-circle"
                        style={{ width: 32, height: 32, objectFit: "cover" }}
                    />
                ) : (
                    <i className="bi bi-person-circle fs-3" />
                )}
                <span className="ms-2">{user.nickname}</span> 님
            </button>

            <ul className="dropdown-menu dropdown-menu-end ph-profile-menu">
                <li>
                    <Link className="dropdown-item" to="/profile">
                        내 프로필
                    </Link>
                </li>
                <li>
                    <button
                        type="button"
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                    >
                        로그아웃
                    </button>
                </li>
            </ul>
        </div>
    );
}