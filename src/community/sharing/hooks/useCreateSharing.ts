import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateSharingForm  } from "@/community/sharing/types/createSharing";
import { createSharing, updateSharing } from "@/community/sharing/services/createSharingApi";
import { getSharingDetail } from "@/community/sharing/services/readSharingApi";
import { showModal } from "@/global/utils/showModal";
import { useImageManager } from "@/community/hooks/useImageManager";

export function useSharingWrite(sharingId?: number) {
  const navigate = useNavigate();
  const isEdit = !!sharingId;

  const [form, setForm] = useState<CreateSharingForm>({
    title: "",
    content: "",
    plantType: "",
    managementLevel: undefined,
    managementDemand: undefined,
  });

  const {
    images,
    setImages,
    deletedImageIds,
    addImages,
    removeImage,
  } = useImageManager();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (isSubmitting) return;

    if (!form.title.trim()) return showModal.alert("제목을 입력하세요.");
    if (!form.content.trim()) return showModal.alert("내용을 입력하세요.");
    if (!form.plantType.trim()) return showModal.alert("식물 종류를 선택하세요.");

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("plantType", form.plantType);

      if (form.managementLevel)
        formData.append("managementLevel", form.managementLevel);

      if (form.managementDemand)
        formData.append("managementNeeds", form.managementDemand);

      if (deletedImageIds.length > 0)
        formData.append("deletedImageIds", JSON.stringify(deletedImageIds));

      images
        .filter((img) => img.status === "NEW" && img.file)
        .forEach((img) => formData.append("files", img.file!));

      if (isEdit && sharingId) {
        await updateSharing(sharingId, formData);
        showModal.alert("수정 완료되었습니다.", {
          callback: () => navigate(`/sharing/${sharingId}`),
        });
      } else {
        const savedId = await createSharing(formData);
        showModal.alert("등록 완료되었습니다.", {
          callback: () => navigate(`/sharing/${savedId}`),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isEdit || !sharingId) return;

    (async () => {
      const data = await getSharingDetail(sharingId);

      setForm({
        title: data.title,
        content: data.content,
        plantType: data.plantType,
        managementLevel: data.managementLevel,
        managementDemand: data.managementNeeds,
      });

      setImages(
        data.images.map((img) => ({
          imageId: img.imageId,
          previewUrl: img.fileUrl,
          status: "EXISTING",
        }))
      );
    })();
  }, [isEdit, sharingId]);

  return {
    form,
    setForm,
    images,
    addImages,
    removeImage,
    submit,
    isEdit,
    isSubmitting,
  };
}