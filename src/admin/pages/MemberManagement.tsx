import { useNavigate } from "react-router-dom";
import { useMemberManagement } from "@/admin/hooks/useMemberManagement";
import { MemberSearchBar } from "@/admin/components/MemberSearchBar";
import { MemberTable } from "@/admin/components/MemberTable";

export default function MemberManagementPage() {
    const navigate = useNavigate();
    const { keywordInput, setKeywordInput, items, total, loading, errorMsg, pagerRef, onSearch } =
        useMemberManagement();

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4">회원관리</h3>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">회원 리스트</h5>

                <MemberSearchBar
                    value={keywordInput}
                    onChange={setKeywordInput}
                    onSearch={onSearch}
                    disabled={loading}
                />
            </div>

            {errorMsg && (
                <div className="alert alert-danger" role="alert">
                    {errorMsg}
                </div>
            )}

            <MemberTable
                items={items}
                loading={loading}
                onRowClick={(id) => navigate(`/admin/profile/${id}`)}
            />

            {total > 0 && (
                <div className="d-flex justify-content-center mt-4">
                    <ul ref={pagerRef} className="pagination mb-0" />
                </div>
            )}
        </div>
    );
}
