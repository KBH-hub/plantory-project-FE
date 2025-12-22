import { ProfileSharingHistoryResponse } from "@/profile/types/sharingHistory";
import { SharingCardListResponse } from "@/community/sharing/types/sharingList";

export function mapToSharingCard( item: ProfileSharingHistoryResponse
): SharingCardListResponse {
  return {
    sharingId: item.sharingId,
    title: item.title,
    status: item.status,
    interestNum: item.interestNum,
    commentCount: item.commentCount,
    createdAt: item.createdAt,
    updatedAt: item.createdAt, 
    fileUrl: item.thumbnail || "/image/default.png",
  };
}
