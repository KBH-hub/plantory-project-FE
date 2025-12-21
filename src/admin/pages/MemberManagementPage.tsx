import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/global/services/api/axiosInstance";

type MemberRow = {
    memberId: number;
    membername: string;
    nickname: string | null;
    phone: string | null;
    address: string | null;
    skillRate: number | null;
    managementRate: number | null;
    sharingRate: number | null;
    stopDay: string | null;
    createdAt: string | null;

    // 서버가 totalCount를 각 row에 싣는 구조라면 대응
    totalCount?: number;
};

function getRemainDays(stopDay: string | null) {
    if (!stopDay) return "-";
    const target = new Date(String(stopDay).replace(" ", "T"));
    const diffDays = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays}일` : "-";
}

function formatCreatedAt(createdAt: string | null) {
    if (!createdAt) return "";
    return String(createdAt).replace("T", " ").substring(0, 16);
}

export default function MemberManagementPage() {
    const navigate = useNavigate();

    const apiBase = "/api/memberManagement/members";
    const limit = 10;

    const [keywordInput, setKeywordInput] = useState("");
    const [keyword, setKeyword] = useState("");

    const [offset, setOffset] = useState(0);
    const [items, setItems] = useState<MemberRow[]>([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

    const fetchData = async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const res = await axiosInstance.get<MemberRow[]>(apiBase, {
                params: { keyword, offset, limit },
            });

            const list = Array.isArray(res.data) ? res.data : [];
            const totalCount = list[0]?.totalCount ?? 0;

            setItems(list);
            setTotal(totalCount);
        } catch (e) {
            console.error(e);
            setItems([]);
            setTotal(0);
            setErrorMsg("회원 데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword, offset]);

    const onSearch = () => {
        setKeyword(keywordInput.trim());
        setOffset(0);
    };

    const goPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setOffset((page - 1) * limit);
    };

    const paginationWindow = useMemo(() => {
        if (totalPages <= 1) return [];

        const windowSize = 5;
        const start = Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
        const end = Math.min(start + windowSize - 1, totalPages);

        const pages: number[] = [];
        for (let p = start; p <= end; p++) pages.push(p);
        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className="container mt-4">
            <h3 className="fw-bold mb-4">회원관리</h3>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">회원 리스트</h5>

                <div className="input-group" style={{ width: 320 }}>
                    <input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onSearch();
                            }
                        }}
                        type="text"
                        className="form-control px-3"
                        placeholder="아이디로 검색"
                        aria-label="아이디로 검색"
                    />
                    <button className="btn btn-dark px-3" onClick={onSearch} disabled={loading}>
                        <i className="bi bi-search" />
                    </button>
                </div>
            </div>

            {errorMsg && (
                <div className="alert alert-danger" role="alert">
                    {errorMsg}
                </div>
            )}

            <div className="table-container bg-light">
                <table className="table table-hover mb-0 text-center align-middle">
                    <thead className="table-secondary small">
                    <tr>
                        <th>일련번호</th>
                        <th>아이디</th>
                        <th>닉네임</th>
                        <th>전화번호</th>
                        <th>주소</th>
                        <th>숙련지수</th>
                        <th>요구관리 지수</th>
                        <th>나눔 지수</th>
                        <th>남은 제재 기간</th>
                        <th>가입 일시</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={10} className="text-muted py-4">
                                불러오는 중...
                            </td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="text-muted py-4">
                                표시할 회원이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        items.map((m) => (
                            <tr
                                key={m.memberId}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/admin/profile/${m.memberId}`)}
                            >
                                <td>{m.memberId ?? ""}</td>
                                <td>{m.membername ?? ""}</td>
                                <td>{m.nickname ?? ""}</td>
                                <td>{m.phone ?? ""}</td>
                                <td>{m.address ?? ""}</td>
                                <td>{(m.skillRate ?? 0) + "%"}</td>
                                <td>{(m.managementRate ?? 0) + "%"}</td>
                                <td>{(m.sharingRate ?? 0) + "%"}</td>
                                <td>{getRemainDays(m.stopDay)}</td>
                                <td>{formatCreatedAt(m.createdAt)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => goPage(1)} type="button">
                                «
                            </button>
                        </li>
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => goPage(currentPage - 1)} type="button">
                                ‹
                            </button>
                        </li>

                        {paginationWindow.map((p) => (
                            <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                                <button className="page-link" onClick={() => goPage(p)} type="button">
                                    {p}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => goPage(currentPage + 1)} type="button">
                                ›
                            </button>
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => goPage(totalPages)} type="button">
                                »
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
