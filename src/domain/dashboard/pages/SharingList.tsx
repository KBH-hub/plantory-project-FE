import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecommendedList from "@/global/components/RecommendedList";
import {getSharingList,getPopularSharingList,getInterestCount,} from "@/domain/services/sharingList";
import { timeAgo } from "@/global/utils/date";
import AddressSelect from "@/global/components/AddressSelect";

export default function SharingList() {
  const [list, setList] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [interestCount, setInterestCount] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [userAddress, setUserAddress] = useState("");

  const [offset, setOffset] = useState(0);
  const limit = 12;
  const [isLastPage, setIsLastPage] = useState(false);

  const loadSharing = (append = false, customOffset?: number) => {
    const realOffset = customOffset ?? offset;

    getSharingList({
      keyword,
      userAddress: userAddress || undefined,
      limit,
      offset: realOffset,
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
    loadInterest();
  }, []);

  useEffect(() => {
    loadSharing(false, 0);
    loadPopular();
  }, [keyword, userAddress]);

  return (
    <div className="mx-auto" style={{ width: 1470 }}>
      <main className="py-4">

        <div className="container-fluid px-4">
          <h5 className="fw-bold">나눔 커뮤니티</h5>

          <div className="row g-2 mt-2">
            <div className="col-md-10">
              <div className="input-group">
                <input
                  className="form-control border-end-0"
                  placeholder="키우고 싶은 식물 검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button
                  className="input-group-text"
                  onClick={() => setKeyword(keyword.trim())}
                >
                  <i className="bi bi-search" />
                </button>
              </div>
            </div>

            <div className="col-md-2 text-end">
              <Link to="/createSharing" className="btn btn-success">
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
            }}
          />
        </div>

        <div className="container-fluid px-4 mt-3">
          <h5 className="fw-bold">주목할 만한 나눔</h5>
          <RecommendedList items={popular} />
          <hr />
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
                        className="card text-reset text-decoration-none"
                      >
                        <img
                          src={item.fileUrl}
                          className="card-img-top"
                          style={{ height: 350, objectFit: "cover" }}
                        />

                        <div className="card-body">
                          <span
                            className={`badge ${
                              item.status === "true"
                                ? "bg-secondary"
                                : "bg-success"
                            }`}
                          >
                            {item.status === "true"
                              ? "나눔완료"
                              : "나눔 중"}
                          </span>

                          <div className="mt-1 text-truncate">
                            {item.title}
                          </div>

                          <div className="d-flex justify-content-between small text-muted mt-1">
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
                <div className="text-center my-4">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      const next = offset + limit;
                      setOffset(next);
                      loadSharing(true, next);
                    }}
                  >
                    더보기
                  </button>
                </div>
              )}
            </div>

            <div className="col-lg-3 mt-4 mt-lg-0" id="sharingSidebar">
              <Link
                to="/profileInsert"
                className="text-reset text-decoration-none"
              >
                <div className="bg-white border p-3 mb-3 text-center">
                  <div className="fw-semibold">나의 관심 나눔 식물</div>
                  <p className="mt-2 mb-0">
                    <i className="bi bi-heart" /> {interestCount}
                  </p>
                </div>
              </Link>

              <div className="bg-white border p-3">
                <div className="fw-semibold mb-2">
                  인기 관심 나눔 식물
                </div>

                {popular.map((item) => (
                  <Link
                    key={item.sharingId}
                    to={`/readSharing/${item.sharingId}`}
                    className="d-flex justify-content-between py-2 text-reset text-decoration-none border-bottom"
                  >
                    <span className="text-truncate">
                      {item.title}
                    </span>
                    <span>
                      <i className="bi bi-heart" /> {item.interestNum}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
