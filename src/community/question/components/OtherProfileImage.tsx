import { useEffect, useState } from "react";
import { profileApi } from "@/profile/services/profileApi";
import ProfileImage from "@/global/components/ProfileImage";

type Props = {
  memberId: number;
  size?: number;
};

function OtherProfileImage({ memberId, size = 36 }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) return;

    profileApi
      .getPicture(memberId)
      .then((res) => setSrc(res?.imageUrl ?? null))
      .catch(() => setSrc(null));
  }, [memberId]);

  return <ProfileImage src={src} size={size} disabled />;
}

export default OtherProfileImage;
