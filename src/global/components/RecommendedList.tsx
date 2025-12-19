import { SharingCardListResponse } from "@/community/sharing/types/sharingList";
import SharingCard from "@/global/components/SharingCard";

function RecommendedList({items,}: { items: SharingCardListResponse[];}) {
   return (
    <div style={{ overflowX: "auto" }}>
      <div className="d-flex flex-nowrap gap-3">
        {items.map((item) => (
          <SharingCard
            key={item.sharingId}
            item={item}
            variant="recommended"
          />
        ))}
      </div>
    </div>

  );
}

export default RecommendedList;