import { Link } from "react-router-dom";

interface Props {
  title: string;
  isEdit: boolean;
  isSubmitting: boolean;

  images: { previewUrl: string }[];
  addImages: (files: FileList) => void;
  removeImage: (index: number) => void;

  formTitle: string;
  formContent: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;

  extraFields?: React.ReactNode;

  onSubmit: () => void;
  cancelLink: string;
}

function CreateCommunityLayout({
  title,
  isEdit,
  isSubmitting,
  images,
  addImages,
  removeImage,
  formTitle,
  formContent,
  onTitleChange,
  onContentChange,
  extraFields,
  onSubmit,
  cancelLink,
}: Props) {
  return (
    <div className="bg-light">
      <main className="container-fluid px-4 py-4" style={{ width: "1470px", padding: "16px" }}>
        <h5 className="fw-bold mb-3">{title}</h5>
        <hr className="mt-1 mb-4" />

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="row mb-4">
            <label className="col-sm-2 col-form-label fw-semibold small">이미지</label>
            <div className="col-sm-10">
              <div className="d-flex flex-wrap gap-2 align-items-start">
                {images.map((img, index) => (
                  <div key={index} className="position-relative" style={{ width: 120, height: 120 }}>
                    <img src={img.previewUrl} className="rounded border" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" onClick={() => removeImage(index)}>✕</button>
                  </div>
                ))}

                <label className="border bg-light-subtle d-flex flex-column align-items-center justify-content-center" style={{ width: 120, height: 120, cursor: "pointer" }}>
                  <i className="bi bi-camera fs-3 mb-2"></i>
                  <span className="small text-muted">{images.length}/5</span>
                  <input type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) { addImages(e.target.files); e.target.value = ""; } }} />
                </label>
              </div>
              <div className="small text-muted mt-2">최대 5장까지 업로드 가능합니다.</div>
            </div>
          </div>

          {extraFields}

          <div className="row mb-3">
            <label className="col-sm-2 col-form-label fw-semibold small">제목 <span className="text-danger">*</span></label>
            <div className="col-sm-10">
              <input className="form-control form-control-sm" placeholder="제목을 입력해 주세요." value={formTitle} onChange={(e) => onTitleChange(e.target.value)} />
            </div>
          </div>

          <div className="row mb-4">
            <label className="col-sm-2 col-form-label fw-semibold small">설명 <span className="text-danger">*</span></label>
            <div className="col-sm-10">
              <textarea className="form-control" placeholder="식물에 대한 간단한 소개를 적어주세요." rows={5} value={formContent} onChange={(e) => onContentChange(e.target.value)} />
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 pt-2">
            <Link to={cancelLink} className="btn btn-secondary px-5">취소</Link>
            <button type="submit" className="btn btn-success px-5" disabled={isSubmitting}>{isEdit ? "수정" : "등록"}</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateCommunityLayout;
