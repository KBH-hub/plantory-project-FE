import { useRef } from "react";
import { Link } from "react-router-dom";
import { usePaginator } from "@/global/hooks/usePaginator";
import { timeAgo } from "@/global/utils/date";
import { useQuestionList } from "../hooks/useQuestionList";

function QuestionList() {
   const pagerRef = useRef<HTMLUListElement | null>(null);

  const {
    list,
    page,
    size,
    totalCount,
    keyword,
    setKeyword,
    setPage,
  } = useQuestionList();

    usePaginator({
    containerRef: pagerRef,
    current: page,
    totalItems: totalCount,
    pageSize: size,
    onChange: (p) => setPage(p),
  });

  return (
    <div className="bg-light" style={{ overflowX: "auto" }}>
      <div className="mx-auto" style={{ width: "1470px", padding: "16px" }}>
        <div className="container-fluid px-4">
          <h5 className="mb-0 fw-bold">질문 커뮤니티</h5>

          <div className="row align-items-center g-2 mt-1">
            <div className="col-md-10">
              <div className="input-group">
                <input
                  className="form-control border-end-0"
                  placeholder="궁금한 내용을 검색하세요"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button className="input-group-text" onClick={() => setPage(1)}><i className="bi bi-search"></i></button>
              </div>
            </div>

            <div className="col-md-2 text-md-end mt-2 mt-md-0">
              <Link to="/quesiton" className="btn btn-success fw-semibold px-3">글쓰기</Link>
            </div>
          </div>
        </div>

        <div className="mt-3">
          {list.length === 0 && (
            <div className="text-center text-muted py-4">게시글이 없습니다.</div>
          )}

          {list.map((item) => {
            const isEdited = item.updatedAt && item.updatedAt !== item.createdAt;
            const displayTime = timeAgo(isEdited ? item.updatedAt! : item.createdAt);

            return (
              <Link
                key={item.questionId}
                to={`/question/${item.questionId}`}
                className="row mb-3 p-3 bg-white border rounded text-decoration-none text-dark"
              >
                <div className="col-1 d-flex justify-content-center">
                  {/* <ProfileImage memberId={item.memberId} /> */}
                </div>

                <div className="col-9">
                  <p className="fw-bold mb-1">{item.title}</p>
                  <small className="text-muted">
                    {item.nickname} · {displayTime}
                    {isEdited && <span className="ms-1">(수정됨)</span>}
                  </small>
                </div>

                <div className="col-2 d-flex flex-column align-items-end justify-content-center">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      className="border rounded mb-1"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  )}
                  <span className="text-muted small">
                    <i className="bi bi-chat-left-text"></i> {item.answerCount}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="d-flex justify-content-center py-3">
          <nav aria-label="질문 커뮤니티 페이지">
            <ul ref={pagerRef} className="pagination pagination-sm mb-0" />
          </nav>
        </div>
      </div>
    </div>
  );
}

export default QuestionList;
