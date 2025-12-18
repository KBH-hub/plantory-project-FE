import { SharingCardListResponse } from "@/domain/sharing/types/sharingList";
import SharingCard from "@/global/components/SharingCard";

function RecommendedList({items,}: { items: SharingCardListResponse[];}) {
   return (
    <div className="d-flex flex-nowrap gap-3">
      {items.map((item) => (
        <SharingCard key={item.sharingId} item={item} variant="recommended" />
      ))}
    </div>
  );
}

export default RecommendedList;