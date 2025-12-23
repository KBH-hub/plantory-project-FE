import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImageManager } from "@/community/hooks/useImageManager";
import { getQuestionDetail} from "@/community/question/services/readQuestionApi";
import { createQuestion, updateQuestion } from "@/community/question/services/createQuestionApi";
import { showModal } from "@/global/utils/showModal";

interface CreateQuestionForm {
  title: string;
  content: string;
}

export function useQuestionWrite(questionId?: number) {
  const navigate = useNavigate();
  const isEdit = !!questionId;

  const [form, setForm] = useState<CreateQuestionForm>({
    title: "",
    content: "",
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

    if (!form.title.trim() || !form.content.trim()) {
      showModal.alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);

      if (deletedImageIds.length > 0) {
        formData.append("deletedImageIds", JSON.stringify(deletedImageIds));
      }

      images
        .filter((i) => i.status === "NEW" && i.file)
        .forEach((i) => formData.append("files", i.file!));

      if (isEdit && questionId) {
        await updateQuestion(questionId, formData);
        showModal.alert("수정되었습니다.", {
          callback: () => navigate(`/question/${questionId}`),
        });
      } else {
        const savedId = await createQuestion(formData);
        showModal.alert("등록되었습니다.", {
          callback: () => navigate(`/question/${savedId}`),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (!isEdit || !questionId) return;

    (async () => {
      const data = await getQuestionDetail(questionId);

      setForm({
        title: data.title,
        content: data.content,
      });

      setImages(
        data.images.map((img) => ({
          imageId: img.imageId,
          previewUrl: img.fileUrl,
          status: "EXISTING",
        }))
      );
    })();
  }, [isEdit, questionId]);

  return {
    form,
    setForm,
    images,
    addImages,
    removeImage,
    submit,
    isEdit,
    isSubmitting
  };
}