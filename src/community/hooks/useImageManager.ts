import { useState } from "react";
import { showModal } from "@/global/utils/showModal";

export type ManagedImage = {
  file?: File;
  previewUrl: string;
  status: "NEW" | "EXISTING";
  imageId?: number;
};

const MAX_IMAGES = 5;

export function useImageManager(initialImages: ManagedImage[] = []) {
  const [images, setImages] = useState<ManagedImage[]>(initialImages);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const addImages = (files: FileList) => {
    if (images.length + files.length > MAX_IMAGES) {
      showModal.alert("최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    const newImages: ManagedImage[] = Array.from(files).map((file) => ({
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

  return {
    images,
    setImages,          
    deletedImageIds,
    addImages,
    removeImage,
  };
}
