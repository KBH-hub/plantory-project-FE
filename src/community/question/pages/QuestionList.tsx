import { useRef } from "react";
import { Link } from "react-router-dom";
import { usePaginator } from "@/global/hooks/usePaginator";
import { timeAgo } from "@/global/utils/date";
import { useQuestionList } from "@/community/question/hooks/useQuestionList";
import OtherProfileImage from "@/community/question/components/OtherProfileImage"

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
    <div className="bg-light">
      <div className="mx-auto" style={{ width: "1470px" }}>
        <main className="py-4">
          <div className="container-fluid px-4">
            <h3 className="fw-bold">질문 커뮤니티</h3>

            <div className="row align-items-center g-2 mt-1">
              <div className="col-md-10">
                <div className="input-group">
                  <input
                    className="form-control border-end-0"
                    placeholder="궁금한 내용을 검색하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button className="input-group-text" onClick={() => setPage(1)}>
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>

              <div className="col-md-2 text-end">
                <Link to="/question/create" className="btn btn-success">
                  글쓰기
                </Link>
              </div>
            </div>

            <div className="mt-3">
              {list.length === 0 && (
                <div className="text-center text-muted py-4">
                  게시글이 없습니다.
                </div>
              )}

              {list.map((item) => {
                const isEdited =
                  item.updatedAt && item.updatedAt !== item.createdAt;
                const displayTime = timeAgo(
                  isEdited ? item.updatedAt! : item.createdAt
                );

                return (
                  <Link
                    key={item.questionId}
                    to={`/question/${item.questionId}`}
                    className="row mb-3 p-3 bg-white border rounded text-decoration-none text-dark align-items-center"
                  >
                    <div className="col-auto pe-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          className="rounded"
                          style={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="bg-light d-flex justify-content-center align-items-center rounded"
                          style={{ width: 120, height: 120 }}
                        >
                          <i className="bi bi-image text-muted fs-4" />
                        </div>
                      )}
                    </div>

                    <div className="col-6">
                      <p className="fw-bold mb-2">{item.title}</p>
                        <small className="text-muted">
                          {displayTime}
                          {isEdited && <span className="ms-1">(수정됨)</span>}
                        </small>
                    </div>

                    <div className="col-auto ms-auto d-flex flex-column align-items-end justify-content-center gap-1">
                      <div className="d-flex align-items-center gap-2">
                        <OtherProfileImage memberId={item.memberId} size={28}/>
                        <span className="text-muted small">
                          {item.nickname}
                        </span>
                      </div>

                      <span className="text-muted small">
                        <br />
                        <i className="bi bi-chat-left-text"></i>{" "}
                        {item.answerCount}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="d-flex justify-content-center py-3">
            <nav aria-label="질문 커뮤니티 페이지">
              <ul ref={pagerRef} className="pagination pagination-sm mb-0"/>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuestionList;