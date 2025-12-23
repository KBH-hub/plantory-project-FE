import { Link } from "react-router-dom";
import { SharingCardListResponse } from "@/community/sharing/types/sharingListType";
type SharingSidebarProps = { interestCount: number; popular: SharingCardListResponse[];};

function SharingSidebar({ interestCount, popular }: SharingSidebarProps) {
  return (
    <div id="sharingSidebar" style={{ position: "sticky", top: 150 }}>
      <Link
        to="/profileInterest"
        className="text-reset text-decoration-none"
      >
        <div className="bg-white border p-3 mb-3">
          <div className="fw-semibold">
            나의 관심 나눔 식물
          </div>
          <p className="mt-2 mb-0 text-center">
            <i className="bi bi-heart-fill text-danger" /> {interestCount}
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
            to={`/sharing/${item.sharingId}`}
            className="d-flex justify-content-between py-2 text-reset text-decoration-none border-bottom"
          >
            <span className="text-truncate">
              <br/>
              {item.title}
            </span>
            <span>
              <br />
              <i className="bi bi-heart" /> {item.interestNum}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SharingSidebar;