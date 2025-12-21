import { useParams } from "react-router-dom";
import CreateCommunityLayout from "@/community/layouts/CreateCommunityLayout";
import { useQuestionWrite } from "@/community/question/hooks/useCreateQuestion";


function CreateQuestion() {
  const { questionId } = useParams<{ questionId?: string }>();
  const numericQuestionId = questionId ? Number(questionId) : undefined;

  const {
    form,
    setForm,
    images,
    addImages,
    removeImage,
    submit,
    isEdit,
    isSubmitting,
  } = useQuestionWrite(numericQuestionId);

  const cancelLink = isEdit ? `/question/${numericQuestionId}` : `/questionList`;

  return (
    <CreateCommunityLayout
      title={isEdit ? "질문글 수정" : "질문글 등록"}
      isEdit={isEdit}
      isSubmitting={isSubmitting}

      images={images}
      addImages={addImages}
      removeImage={removeImage}

      formTitle={form.title}
      formContent={form.content}
      onTitleChange={(v) => setForm({ ...form, title: v })}
      onContentChange={(v) => setForm({ ...form, content: v })}

      onSubmit={submit}
      cancelLink={cancelLink}
    />
  );
}

export default CreateQuestion;
