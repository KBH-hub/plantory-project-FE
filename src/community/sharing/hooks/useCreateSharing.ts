import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateSharingForm, CreateSharingImage } from "@/community/sharing/types/writeSharing";
import { createSharing, updateSharing } from "@/community/sharing/services/writeSharingApi";
import { getSharingDetail } from "@/community/sharing/services/readSharingApi";
import { showModal } from "@/global/utils/showModal";

const MAX_IMAGES = 5;

export function useSharingWrite(sharingId?: number) {
  const navigate = useNavigate();
  const isEdit = !!sharingId;


  const [form, setForm] = useState<CreateSharingForm>({
    title: "",
    content: "",
    plantType: "",
    managementLevel: undefined,
    managementNeeds: undefined,
  });

  const [images, setImages] = useState<CreateSharingImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addImages = (files: FileList) => {
    const fileArray = Array.from(files);

    if (images.length + fileArray.length > MAX_IMAGES) {
      showModal.alert("최대 5장까지만 업로드할 수 있습니다.");
      return;
    }

    const newImages: CreateSharingImage[] = fileArray.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      status: "NEW",
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];

      if (target.status === "EXISTING" && target.imageId) {
        setDeletedImageIds((ids) => [...ids, target.imageId!]);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const submit = async () => {
    if (isSubmitting) return;

    if (!form.title.trim()) {
      showModal.alert("제목을 입력하세요.");
      return;
    }

    if (!form.content.trim()) {
      showModal.alert("내용을 입력하세요.");
      return;
    }

    if (!form.plantType.trim()) {
      showModal.alert("식물 종류를 선택하세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("plantType", form.plantType);

      if (form.managementLevel) {
        formData.append("managementLevel", form.managementLevel);
      }

      if (form.managementNeeds) {
        formData.append("managementNeeds", form.managementNeeds);
      }

      if (deletedImageIds.length > 0) {
        formData.append(
          "deletedImageIds",
          JSON.stringify(deletedImageIds)
        );
      }

      images
        .filter((img) => img.status === "NEW" && img.file)
        .forEach((img) => {
          formData.append("files", img.file!);
        });

      // API 호출
      if (isEdit && sharingId) {
        await updateSharing(sharingId, formData);
        showModal.alert("수정 완료되었습니다.", {
          callback: () => navigate(`/readSharing/${sharingId}`),
        });
      } else {
        const savedId = await createSharing(formData);
        showModal.alert("등록 완료되었습니다.", {
          callback: () => navigate(`/readSharing/${savedId}`),
        });
      }
    } catch (e) {
      console.error(e);
      showModal.alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (!isEdit || !sharingId) return;

    const load = async () => {
      const data = await getSharingDetail(sharingId);

      setForm({
        title: data.title,
        content: data.content,
        plantType: data.plantType,
        managementLevel: data.managementLevel,
        managementNeeds: data.managementNeeds,
      });

      const existingImages: CreateSharingImage[] = data.images.map(
        (img) => ({
          imageId: img.imageId,
          previewUrl: img.fileUrl,
          status: "EXISTING",
        })
      );

      setImages(existingImages);
    };

    load();
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
