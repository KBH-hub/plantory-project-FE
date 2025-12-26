import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePaginator } from "@/global/hooks/usePaginator";
import { useDebouncedValue } from "@/global/hooks/useDebouncedValue";
import { profileApi } from "@/profile/services/profileApi";
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
    const n =
        typeof sharingRate === "number"
            ? sharingRate
            : typeof sharingRate === "string"
                ? Number(sharingRate)
                : NaN;

    if (!Number.isFinite(n)) return "0ph";

    return `${parseFloat(n.toFixed(2))}ph`;
}


type PostCategory = "SHARING" | "QUESTION";
type CommentCategory = "COMMENT" | "ANSWER";

function isPostItem(item: ProfileWrittenItem): item is ProfileWrittenItem & { category: PostCategory } {
    return item.category === "SHARING" || item.category === "QUESTION";
}

function isCommentItem(
    item: ProfileWrittenItem
): item is ProfileWrittenItem & { category: CommentCategory; targetId: number } {
    return (item.category === "COMMENT" || item.category === "ANSWER") && typeof item.targetId === "number";
}


export default function ProfileInfo() {
    const navigate = useNavigate();
    const params = useParams<{ memberId?: string }>();

    const urlMemberId: number | null = (() => {
        const raw = params.memberId;
        if (!raw) return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    })();

    const isPublicRoute = urlMemberId != null;
    const isValidMemberId = !isPublicRoute || Number.isFinite(urlMemberId);

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
    const [profile, setProfile] = useState<ProfileInfo | null>(null);
    const isMe = profile && me?.memberId === profile.memberId || me?.role === 'ADMIN';

    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    const [currentTab, setCurrentTab] = useState<TabKey>("profilePosts");

    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebouncedValue(keyword, 300);

    const [category, setCategory] = useState<CategoryKey>("ALL");

    const [content, setContent] = useState<ProfileWrittenItem[]>([]);

    const [interestCount, setInterestCount] = useState(0);
    const [sharingHistoryCount, setSharingHistoryCount] = useState(0);

    const isPostsTab = currentTab === "profilePosts";

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

    function switchTab(tab: TabKey) {
        setCurrentTab(tab);

        const nextIsPostsTab = tab === "profilePosts";

        setCurrentPage(1);
        setSelectedMap({});
        setCategory(nextIsPostsTab ? "ALL" : "COMMENT_ALL");
    }


    useEffect(() => {
        (async () => {
            try {
                if (!isValidMemberId) {
                    await showModal.alert("잘못된 프로필 경로입니다.");
                    navigate("/profile");
                    return;
                }

                const data = isPublicRoute
                    ? await profileApi.getPublicProfile(urlMemberId as number)
                    : await profileApi.getMyProfile();

                setProfile(data);

                const pic = await profileApi.getPicture(data.memberId);
                setProfileImageUrl(pic?.imageUrl ?? null);

                const counts = await profileApi.getCounts();
                setInterestCount(counts.interestCount ?? 0);
                setSharingHistoryCount(counts.sharingCount ?? 0);
            } catch (e) {
                console.error(e);
                await showModal.alert("프로필 정보를 불러오지 못했습니다.");
            }
        })();
    }, [isPublicRoute, isValidMemberId, urlMemberId, me?.memberId, navigate]);


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
        if (isPostsTab) {
            if (!isPostItem(item)) return;

            const base = item.category === "SHARING" ? "/sharing" : "/question";
            navigate(`${base}/${item.id}`);
            return;
        }

        if (!isCommentItem(item)) {
            console.log(item);
            showModal.alert("원글 정보를 찾을 수 없습니다. (댓글 데이터에 targetId가 필요합니다)");
            return;
        }

        const base =
            item.targetCategory === "QUESTION"
                ? "/question"
                : "/sharing";

        navigate(`${base}/${item.targetId}`);
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
            setReloadKey((k) => k + 1);
        } catch (e) {
            console.error(e);
            await showModal.alert("삭제에 실패했습니다.");
        }
    }

    const [reloadKey, setReloadKey] = useState(0);
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
            } catch (e) {
                console.error(e);
            }
        })();
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
                    <div className="row g-3 justify-content-center">
                        <div className="col-auto d-flex align-items-center gap-4">

                            <div className="text-center mx-auto">
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
                                <small className="text-muted">{profile.address ?? ""}</small><br />
                                <small className="text-center">
                                    <span className="text-success fw-semibold">나눔지수: {toRateText(profile.sharingRate)}</span>
                                </small>
                            </div>

                            {/* 내 프로필일 때만 */}
                            {isMe && (
                                <div className="d-flex flex-column align-items-start gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm w-100"
                                        onClick={() => navigate(`/profile/update`)}
                                    >
                                        내 정보 변경
                                    </button>

                                    <button className="btn btn-outline-danger btn-sm w-100" onClick={handleDeleteWritten}>
                                        내가 쓴 글 삭제
                                    </button>
                                </div>
                            )}
                            {isMe && (
                                <div className="col d-flex align-items-center gap-3">
                                    <div className="text-center" style={{ cursor: "pointer" }} onClick={() => navigate(`/profileInterest`)}>
                                        <p className="fw-bold m-0">관심 나눔</p>
                                        <span className="fw-bold">(관심 나눔글 수:{interestCount}개)</span>
                                    </div>
                                    <div className="text-center" style={{ cursor: "pointer" }} onClick={() => navigate(`/sharingHistory`)}>
                                        <p className="fw-bold m-0">나눔 내역</p>
                                        <span className="fw-bold">(나눔 완료 수: {sharingHistoryCount}개)</span>
                                    </div>
                                </div>
                            )}




                        </div>
                    </div>
                </div>

                <div className="card-header bg-white border-bottom">
                    <div className="row g-2 align-items-center">
                        <div className="col d-flex align-items-center gap-3">
                            <span
                                className={`${isPostsTab ? "tab-active fw-semibold text-dark" : "text-secondary"} cursor-pointer`}
                                onClick={() => switchTab("profilePosts")}
                            >
                                쓴 글
                            </span>
                            <span>|</span>
                            <span
                                className={`${!isPostsTab ? "tab-active fw-semibold text-dark" : "text-secondary"} cursor-pointer`}
                                onClick={() => switchTab("profileComments")}
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
                        <table className="table table-hover align-middle mb-0 table-fixed text-center">
                            <thead className="table-light small">
                                <tr>
                                    <th className="text-center" style={{ width: 40 }}>
                                        {isPostsTab && isMe && (
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
                                    <th style={{ width: 350 }}>제목</th>
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
                                                {isPostsTab && isMe ? (
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