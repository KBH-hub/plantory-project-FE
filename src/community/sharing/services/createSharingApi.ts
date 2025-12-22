import { axiosInstance } from "@/global/services/jjwt/axiosInstance";


export const createSharing = async ( formData: FormData ): Promise<number> => {
  const res = await axiosInstance.post<number>(
    "/api/sharings",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data; // sharingId
};


export const updateSharing = async ( sharingId: number, formData: FormData ): Promise<boolean> => {
  const res = await axiosInstance.put<boolean>(
    `/api/sharings/${sharingId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data; // true / false
};
