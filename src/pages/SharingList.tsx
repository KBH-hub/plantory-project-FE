import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecommendedList from "../components/RecommendedList";
import {getSharingList,getPopularSharingList,getInterestCount,} from "../services/sharingList";
import { timeAgo } from "../utils/date";
import AddressSelect from "@/components/AddressSelect";

export default function SharingList() {
  const [list, setList] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [interestCount, setInterestCount] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [userAddress, setUserAddress] = useState<string>("");

  const [offset, setOffset] = useState(0);
  const limit = 12;
  const [isLastPage, setIsLastPage] = useState(false);

  const loadSharing = (append = false) => {
    getSharingList({
      keyword,
      userAddress: userAddress || undefined,
      limit,
      offset,
    }).then((data) => {
      setList((prev) => (append ? [...prev, ...data] : data));
      setIsLastPage(data.length < limit);
    });
  };

  const loadPopular = () => {
    getPopularSharingList({
      userAddress: userAddress || undefined,
    }).then(setPopular);
  };

  const loadInterest = () => {
    getInterestCount().then(setInterestCount);
  };

  useEffect(() => {
    loadSharing(false);
    loadPopular();
    loadInterest();
  }, []);

  return (
    <div className="mx-auto" style={{ width: 1470 }}>
      <main className="py-4">

        <div className="container-fluid px-4">
          <div className="col-md-3 col-12">
            <h5 className="mb-0 fw-bold">나눔 커뮤니티</h5>
          </div>

          <div className="row align-items-center g-2 mt-1">
            <div className="col-md-10">
              <div className="input-group">
                <input
                  className="form-control border-end-0"
                  placeholder="키우고 싶은 식물 검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setOffset(0);
                      loadSharing(false);
                      loadPopular();
                    }
                  }}
                />
                <button
                  className="input-group-text"
                  onClick={() => {
                    setOffset(0);
                    loadSharing(false);
                    loadPopular();
                  }}
                >
                  <i className="bi bi-search" />
                </button>
              </div>
            </div>

            <div className="col-md-2 text-md-end mt-2 mt-md-0">
              <Link
                to="/createSharing"
                className="btn btn-success fw-semibold px-3"
              >
                글쓰기
              </Link>
            </div>
          </div>
        </div>

        <div className="container-fluid px-4 mt-3">
          <AddressSelect
            onChange={(address) => {
              setUserAddress(address);
              setOffset(0);
              loadSharing(false);
              loadPopular();
            }}
          />
        </div>

        <div className="container-fluid px-4 mt-3">
          <h5 className="fw-bold">주목할 만한 나눔</h5>
          <RecommendedList items={popular} />
          <hr className="mt-3" />
        </div>

        <div className="container-fluid px-4 mt-2">
          <div className="row">

            <div className="col-lg-9">
              <div className="row g-3">
                {list.map((item) => {
                  const isEdited =
                    item.updatedAt && item.updatedAt !== item.createdAt;
                  const displayTime = isEdited
                    ? item.updatedAt
                    : item.createdAt;

                  return (
                    <div
                      className="col-12 col-sm-6 col-md-4"
                      key={item.sharingId}
                    >
                      <Link
                        to={`/readSharing/${item.sharingId}`}
                        className="card border-1 rounded-1 text-decoration-none text-reset"
                      >
                        <img
                          src={item.fileUrl}
                          className="card-img-top object-fit-cover"
                          style={{ height: 350 }}
                        />

                        <div className="card-body px-2 py-2">
                          <span
                            className={`badge ${
                              item.status === "true"
                                ? "bg-secondary"
                                : "bg-success"
                            } small`}
                          >
                            {item.status === "true"
                              ? "나눔완료"
                              : "나눔 중"}
                          </span>

                          <div className="mt-1 mb-1 text-truncate small">
                            {item.title}
                          </div>

                          <div className="d-flex justify-content-between small text-muted">
                            <span>
                              {timeAgo(displayTime)}
                              {isEdited && " (수정됨)"}
                            </span>
                            <span>
                              <i className="bi bi-chat" /> {item.commentCount}
                              <i className="bi bi-heart ms-2" />{" "}
                              {item.interestNum}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {!isLastPage && (
                <div className="text-center mt-3">
                  <button
                    className="btn btn-outline-secondary px-4"
                    onClick={() => {
                      const next = offset + limit;
                      setOffset(next);
                      loadSharing(true);
                    }}
                  >
                    더보기
                  </button>
                </div>
              )}
            </div>

            <div className="col-lg-3 mt-4 mt-lg-0">
              <Link
                to="/profileInsert"
                className="text-decoration-none text-reset"
              >
                <div className="bg-white border p-3 mb-3 small">
                  <div className="fw-semibold">나의 관심 나눔 식물</div>
                  <p className="text-muted mb-0 mt-2 text-center">
                    <i className="bi bi-heart" /> {interestCount}
                  </p>
                </div>
              </Link>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
