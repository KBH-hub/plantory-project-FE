import { Link } from "react-router-dom";
import RecommendedList from "@/global/components/RecommendedList";
import AddressSelect from "@/global/components/AddressSelect";
import { useSharingList } from "@/community/sharing/hooks/useSharingList";
import SharingSidebar from "@/community/sharing/components/SideBar";
import SharingCard from "@/global/components/SharingCard";

function SharingList() {
  const {
    list,
    popular,
    interestCount,
    keyword,
    setKeyword,
    setUserAddress,
    isLastPage,
    loadMore,
  } = useSharingList();

  return (
    <div className="bg-light">
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
          <AddressSelect onChange={(address) => { setUserAddress(address);}}/>
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
                {list.map((item) => (
                <SharingCard key={item.sharingId} item={item}/>
              ))}
              </div>

              {!isLastPage && (
                <div className="text-center my-4">
                  <button className="btn btn-outline-secondary" onClick={loadMore}>
                    더보기
                  </button>
                </div>
              )}
            </div>
            <div className="col-lg-3">
             <SharingSidebar interestCount={interestCount} popular={popular}/>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
  );
}

export default SharingList;