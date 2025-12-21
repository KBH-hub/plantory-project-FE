import React, {useEffect, useMemo, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePaginator } from "@/global/hooks/usePaginator";
import { useDebouncedValue } from "@/global/hooks/useDebouncedValue";
import { profileApi } from "@/profile/services/profileService";
import type { CategoryKey, ProfileInfo, ProfileWrittenItem, TabKey } from "@/profile/types/profileType";
import { showModal } from "@/global/utils/showModal";
import { useAuthStore } from "@/global/stores/useAuthStore";
const rowsPerPage = 10;

const categoryMap: Record<string, string> = {
    SHARING: "나눔",
    QUESTION: "질문",
    COMMENT: "나눔댓글",
    ANSWER: "질문답글",
};

function fmtKST(iso?: string | null) {
    if (!iso) return "";
    return new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    })
        .format(new Date(iso))
        .replace(/\./g, "-")
        .replace(/-\s/g, "-")
        .replace(/\s/g, " ");
}

function toRateText(sharingRate?: number | string | null) {
    if (typeof sharingRate === "number") return `${sharingRate.toFixed(2)}%`;
    if (typeof sharingRate === "string" && sharingRate.trim() !== "") {
        const n = Number(sharingRate);
        if (!Number.isNaN(n)) return `${n.toFixed(2)}%`;
    }
    return "0.00%";
}

export default function ProfileInfoPage() {
    const navigate = useNavigate();
    const params = useParams<{ memberId?: string }>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const me = useAuthStore((s) => s.user);


    const paginationRef = useRef<HTMLUListElement | null>(null);

    usePaginator({
        containerRef: paginationRef,
        current: currentPage,
        totalItems: totalCount,
        pageSize: rowsPerPage,
        onChange: (p) => setCurrentPage(p),
    });
    // 라우팅: /profile (내프로필) , /profile/:memberId (공개프로필)
    const urlMemberId = params.memberId ? Number(params.memberId) : null;
    const isMyRoute = urlMemberId == null;

    const [profile, setProfile] = useState<ProfileInfo | null>(null);
    const isMe = profile && me?.memberId === profile.memberId;

    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    const [currentTab, setCurrentTab] = useState<TabKey>("profilePosts");

    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebouncedValue(keyword, 300);

    const [category, setCategory] = useState<CategoryKey>("ALL");

    const [content, setContent] = useState<ProfileWrittenItem[]>([]);

    const [interestCount, setInterestCount] = useState(0);
    const [sharingHistoryCount, setSharingHistoryCount] = useState(0);

    const isPostsTab = currentTab === "profilePosts";

    // 체크박스 선택(쓴 글 탭에서만)
    const [selectedMap, setSelectedMap] = useState<Record<number, { category: string }>>({});

    const categoryOptions = useMemo(() => {
        if (isPostsTab) {
            return [
                { value: "ALL" as const, label: "전체" },
                { value: "SHARING" as const, label: "나눔" },
                { value: "QUESTION" as const, label: "질문" },
            ];
        }
        return [
            { value: "COMMENT_ALL" as const, label: "전체댓글" },
            { value: "COMMENT" as const, label: "나눔댓글" },
            { value: "ANSWER" as const, label: "질문답글" },
        ];
    }, [isPostsTab]);

    // 탭 전환 시 초기화
    useEffect(() => {
        setCurrentPage(1);
        setSelectedMap({});
        setCategory(isPostsTab ? "ALL" : "COMMENT_ALL");
    }, [isPostsTab]);

    // (A) 프로필 정보/사진/카운트 로딩: 최초 1회(또는 urlMemberId 변경 시)
    useEffect(() => {
        (async () => {
            try {
                // 1) 프로필 정보
                const data = isMyRoute
                    ? await profileApi.getMyProfile()
                    : await profileApi.getPublicProfile(urlMemberId as number);

                setProfile(data);

                // 2) 사진
                console.log("로그인 사용자 memberId:", me?.memberId);
                console.log("프로필 memberId:", data.memberId);
                console.log("isMe:", me?.memberId === data.memberId);
                const pic = await profileApi.getPicture(data.memberId); // 백엔드가 memberId를 기대한다면 여길 data.memberId로 바꿔야 함
                setProfileImageUrl(pic?.imageUrl ?? null);

                // 3) 카운트
                const counts = await profileApi.getCounts();
                setInterestCount(counts.interestCount ?? 0);
                setSharingHistoryCount(counts.sharingCount ?? 0);
            } catch (e) {
                console.error(e);
                await showModal.alert("프로필 정보를 불러오지 못했습니다.");
            }
        })();
    }, [isMyRoute, me?.memberId, urlMemberId]);

    // (B) 목록 로딩: 프로필ID가 준비된 뒤, 탭/페이지/검색/카테고리 바뀔 때마다
    useEffect(() => {
        if (!profile?.memberId) return;

        (async () => {
            try {
                const res = await profileApi.getWritten(profile.memberId, {
                    keyword: debouncedKeyword.trim(),
                    category,
                    limit: rowsPerPage,
                    offset: (currentPage - 1) * rowsPerPage,
                });

                setContent(res.list ?? []);
                setTotalCount(res.total ?? 0);

                // 삭제 후 total이 줄어서 currentPage가 범위를 넘으면 보정
                const maxPage = Math.max(1, Math.ceil((res.total ?? 0) / rowsPerPage));
                if (currentPage > maxPage) setCurrentPage(maxPage);
            } catch (e) {
                console.error(e);
                await showModal.alert("목록을 불러오지 못했습니다.");
            }
        })();
    }, [profile?.memberId, currentTab, currentPage, debouncedKeyword, category]);

    const allChecked = useMemo(() => {
        if (!isPostsTab) return false;
        if (content.length === 0) return false;
        return content.every((it) => Boolean(selectedMap[it.id]));
    }, [content, isPostsTab, selectedMap]);

    function toggleAll(checked: boolean) {
        if (!isPostsTab) return;

        if (!checked) {
            setSelectedMap({});
            return;
        }
        const next: Record<number, { category: string }> = {};
        content.forEach((item) => {
            next[item.id] = { category: item.category };
        });
        setSelectedMap(next);
    }

    function toggleOne(id: number, itemCategory: string, checked: boolean) {
        setSelectedMap((prev) => {
            const next = { ...prev };
            if (checked) next[id] = { category: itemCategory };
            else delete next[id];
            return next;
        });
    }

    function handleRowClick(item: ProfileWrittenItem) {
        // 쓴 글 탭에서만 이동
        if (!isPostsTab) return;

        if (item.category === "SHARING") navigate(`/readSharing/${item.id}`);
        else if (item.category === "QUESTION") navigate(`/readSharing/${item.id}`); // 질문 상세가 따로면 여기 변경
    }

    async function handleDeleteWritten() {
        if (!isPostsTab) {
            await showModal.alert("댓글에서는 삭제할 수 없습니다.");
            return;
        }
        if (!profile?.memberId) return;

        const selectedIds = Object.keys(selectedMap).map((k) => Number(k));
        const sharingIds: number[] = [];
        const questionIds: number[] = [];

        selectedIds.forEach((id) => {
            const cat = selectedMap[id]?.category;
            if (cat === "SHARING") sharingIds.push(id);
            if (cat === "QUESTION") questionIds.push(id);
        });

        if (sharingIds.length === 0 && questionIds.length === 0) {
            await showModal.alert("삭제할 글이 없습니다.");
            return;
        }

        try {
            await profileApi.softDeleteWritten({
                memberId: profile.memberId,
                sharingIds,
                questionIds,
            });

            await showModal.alert("삭제되었습니다.");
            setSelectedMap({});
            // 재조회: currentPage를 그대로 재설정해서 useEffect를 강제로 트리거하려면 별도 state가 필요.
            // 가장 깔끔한 방식: reloadKey를 둔다.
            setReloadKey((k) => k + 1);
        } catch (e) {
            console.error(e);
            await showModal.alert("삭제에 실패했습니다.");
        }
    }

    // 삭제 후 재조회 트리거용
    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        // reloadKey가 바뀌면 목록 재조회
        if (!profile?.memberId) return;
        (async () => {
            try {
                const res = await profileApi.getWritten(profile.memberId, {
                    keyword: debouncedKeyword.trim(),
                    category,
                    limit: rowsPerPage,
                    offset: (currentPage - 1) * rowsPerPage,
                });
                setContent(res.list ?? []);
                setTotalCount(res.total ?? 0);
            } catch (e) {
                console.error(e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

    if (!profile) {
        return (
            <div className="container-xxl py-4">
                <h5 className="fw-bold mb-3">프로필</h5>
                <div className="card shadow-sm p-4">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="container-xxl py-4">
            <h5 className="fw-bold mb-3">프로필</h5>

            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <div className="row g-3 align-items-center">
                        <div className="col d-flex align-items-center gap-4">
                            <div className="text-center">
                                <span className="text-danger fw-semibold">나눔지수: {toRateText(profile.sharingRate)}</span>
                            </div>

                            <div className="text-center">
                                <div className="profile-img d-flex justify-content-center align-items-center position-relative" style={{ width: 150, height: 150 }}>
                                    {!profileImageUrl ? (
                                        <i className="bi bi-person fs-2 text-secondary" />
                                    ) : (
                                        <img
                                            src={profileImageUrl}
                                            className="rounded-circle position-absolute top-0 start-0"
                                            width={150}
                                            height={150}
                                            style={{ objectFit: "cover" }}
                                            alt="profile"
                                        />
                                    )}
                                </div>

                                <p className="fw-bold mb-0 mt-2">{profile.nickname ?? ""}</p>
                                <small className="text-muted">{profile.address ?? ""}</small>
                            </div>

                            {/* 내 프로필일 때만 */}
                            {isMe && (
                                <div className="d-flex flex-column align-items-start gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm w-100"
                                        onClick={() => navigate(`/profile/update/${profile.memberId}`)}
                                    >
                                        내 정보 변경
                                    </button>

                                    <button className="btn btn-outline-danger btn-sm w-100" onClick={handleDeleteWritten}>
                                        내가 쓴 글 삭제
                                    </button>
                                </div>
                            )}

                            <div className="text-center" style={{ cursor: "pointer" }} onClick={() => navigate(`/profileInsert`)}>
                                <p className="fw-bold m-0">관심 나눔글</p>
                                <span className="fw-bold">{interestCount}개</span>
                            </div>

                            <div className="text-center" style={{ cursor: "pointer" }} onClick={() => navigate(`/profileSharingHistory?memberId=${profile.memberId}`)}>
                                <p className="fw-bold m-0">나눔 내역</p>
                                <span className="fw-bold">{sharingHistoryCount}개</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-header bg-white border-bottom">
                    <div className="row g-2 align-items-center">
                        <div className="col d-flex align-items-center gap-3">
              <span
                  className={`${isPostsTab ? "tab-active fw-semibold text-dark" : "text-secondary"} cursor-pointer`}
                  onClick={() => setCurrentTab("profilePosts")}
              >
                쓴 글
              </span>
                            <span>|</span>
                            <span
                                className={`${!isPostsTab ? "tab-active fw-semibold text-dark" : "text-secondary"} cursor-pointer`}
                                onClick={() => setCurrentTab("profileComments")}
                            >
                댓글 단 글
              </span>
                        </div>

                        <div className="col-auto">
                            <div className="d-flex align-items-center gap-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="검색"
                                    style={{ width: 220 }}
                                    value={keyword}
                                    onChange={(e) => {
                                        setCurrentPage(1);
                                        setKeyword(e.target.value);
                                    }}
                                />

                                <select
                                    className="form-select form-select-sm w-auto"
                                    value={category}
                                    onChange={(e) => {
                                        setCurrentPage(1);
                                        setCategory(e.target.value as CategoryKey);
                                    }}
                                >
                                    {categoryOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 table-fixed">
                            <thead className="table-light small">
                            <tr>
                                <th className="text-center" style={{ width: 44 }}>
                                    {isPostsTab && (
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={allChecked}
                                            onChange={(e) => toggleAll(e.target.checked)}
                                        />
                                    )}
                                </th>
                                <th className="text-nowrap" style={{ width: 120 }}>작성자</th>
                                <th className="text-nowrap" style={{ width: 120 }}>카테고리</th>
                                <th style={{ width: 300 }}>제목</th>
                                <th className="text-nowrap" style={{ width: 170 }}>작성일</th>
                            </tr>
                            </thead>

                            <tbody>
                            {content.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="text-center text-muted py-5">
                                            <i className="bi bi-box fs-3" />
                                            <br />
                                            표시할 데이터가 없습니다.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                content.map((item) => (
                                    <tr
                                        key={`${item.category}-${item.id}`}
                                        style={{ cursor: isPostsTab ? "pointer" : "default" }}
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <td>
                                            {isPostsTab ? (
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={Boolean(selectedMap[item.id])}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => toggleOne(item.id, item.category, e.target.checked)}
                                                />
                                            ) : null}
                                        </td>
                                        <td>{item.nickname ?? ""}</td>
                                        <td>{categoryMap[item.category] ?? item.category}</td>
                                        <td>{item.title ?? ""}</td>
                                        <td>{fmtKST(item.createdAt)}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="d-flex justify-content-center py-3">
                    <nav aria-label="프로필 페이지">
                        <ul ref={paginationRef} className="pagination pagination-sm mb-0" />
                    </nav>
                </div>
            </div>
        </div>
    );
}