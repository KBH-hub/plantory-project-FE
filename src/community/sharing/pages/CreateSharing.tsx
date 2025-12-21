import { useParams } from "react-router-dom";
import CreateCommunityLayout from "@/community/layouts/CreateCommunityLayout";
import PlantSearchModal from "@/community/sharing/components/PlantSearchModal";
import { useSharingWrite } from "@/community/sharing/hooks/useCreateSharing";
import { getManageDemandLabel, getManageLevelLabel } from "@/community/sharing/enum/manageTypes";

import "@/styles/createSharing.css";

function CreateSharing() {
  const { sharingId } = useParams<{ sharingId?: string }>();
  const numericSharingId = sharingId ? Number(sharingId) : undefined;

  const { form, setForm, images, addImages, removeImage, submit, isEdit, isSubmitting } =
    useSharingWrite(numericSharingId);
  
  const cancelLink = isEdit ? `/sharing/${sharingId}` : `/sharingList`;

  return (
    <>
      <CreateCommunityLayout
        title={isEdit ? "나눔글 수정" : "나눔글 등록"}
        isEdit={isEdit}
        isSubmitting={isSubmitting}
        images={images}
        addImages={addImages}
        removeImage={removeImage}
        formTitle={form.title}
        formContent={form.content}
        onTitleChange={(v) => setForm({ ...form, title: v })}
        onContentChange={(v) => setForm({ ...form, content: v })}
        cancelLink={cancelLink}
        onSubmit={submit}
        extraFields={
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label fw-semibold small">식물 종류 <span className="text-danger">*</span></label>
            <div className="col-sm-10">
              <div className="row g-2 align-items-end flex-nowrap">
                <div className="col" style={{ maxWidth: 560 }}>
                  <div className="input-group input-group-sm">
                    <input className="form-control"  placeholder="식물 종류를 입력해주세요" value={form.plantType} onChange={(e) => setForm({ ...form, plantType: e.target.value })} />
                    <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#plantSearchModal">식물검색</button>
                  </div>
                </div>

                <div className="col-auto">
                  <label className="form-label small fw-semibold mb-1 d-block">관리 수준</label>
                  <input className="form-control form-control-sm" style={{ width: 180 }} value={getManageLevelLabel(form.managementLevel)} disabled />
                </div>

                <div className="col-auto">
                  <label className="form-label small fw-semibold mb-1 d-block">관리 요구도</label>
                  <input className="form-control form-control-sm" style={{ width: 200 }} value={getManageDemandLabel(form.managementDemand)} disabled />
                </div>
              </div>
            </div>
          </div>
        }
      />

      <PlantSearchModal
        onSelect={(data) =>
          setForm((prev) => ({
            ...prev,
            plantType: data.plantName,
            managementLevel: data.manageLevel,
            managementDemand: data.manageDemand,
          }))
        }
      />
    </>
  );
}

export default CreateSharing;


