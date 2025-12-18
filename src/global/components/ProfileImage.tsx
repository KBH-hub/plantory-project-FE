import { useEffect, useState } from "react";
import { axiosInstance } from "@/global/services/api/axiosInstance";

interface Props {
  memberId: number;
  size?: number;
}

function ProfileImage({ memberId, size = 48 }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) return;

    const loadProfileImage = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/profile/picture`,
          { params: { memberId } }
        );
        setImageUrl(res.data.imageUrl ?? null);
      } catch (e) {
        console.error("프로필 이미지 조회 실패", e);
        setImageUrl(null);
      }
    };

    loadProfileImage();
  }, [memberId]);

  return imageUrl ? (
    <img
      src={imageUrl}
      alt="profile"
      className="rounded-circle"
      style={{ width: size, height: size, objectFit: "cover" }}
    />
  ) : (
    <div
      className="bg-secondary rounded-circle"
      style={{ width: size, height: size }}
    />
  );
}

export default ProfileImage;
