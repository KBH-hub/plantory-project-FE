export interface SharingCard {
  sharingId: number;
  title: string;
  interestNum: number;
  status: string;
  createdAt: string;   
  updatedAt: string;  
  commentCount: number;
  fileUrl?: string;    
}

export interface SharingSearchParams {
  userAddress?: string;
  keyword?: string;
  limit?: number;
  offset?: number;
}


