import { axiosInstance } from "@/global/services/jjwt/axiosInstance"

export const createQuestion = async (formData: FormData): Promise<number> => {
  const res = await axiosInstance.post<number>("/api/questions",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};


export const updateQuestion = async ( questionId: number, formData: FormData): Promise<boolean> => {
  const res = await axiosInstance.put<boolean>(`/api/questions/${questionId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};


export const deleteQuestion = async (questionId: number): Promise<boolean> => {
  return (await axiosInstance.delete<boolean>(`/api/questions/${questionId}`)).data;
};
