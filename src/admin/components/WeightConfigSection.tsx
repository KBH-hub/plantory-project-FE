import type { RateConfig } from "@/admin/types/weightManagementType";

type Props = {
  searchWeightInput: string;
  questionWeightInput: string;
  onChangeSearchWeightInput: (v: string) => void;
  onChangeQuestionWeightInput: (v: string) => void;
  onSaveWeights: () => void;

  rate: RateConfig;
  onChangeRate: (patch: Partial<RateConfig>) => void;
  onSaveRate: () => void;
};

export default function WeightConfigSection({
  searchWeightInput,
  questionWeightInput,
  onChangeSearchWeightInput,
  onChangeQuestionWeightInput,
  onSaveWeights,
  rate,
  onChangeRate,
  onSaveRate,
}: Props) {
  return (
    <div className="mb-3 p-3 border rounded bg-white">
      <div className="row gy-2 align-items-center small">
        <div className="col-auto fw-bold">숙련도 산정 비중(Total=10)</div>

        <div className="col-auto">
          <label className="fw-semibold me-2">검색어</label>
          <input
            value={searchWeightInput}
            onChange={(e) => onChangeSearchWeightInput(e.target.value)}
            type="number"
            min={0}
            max={10}
            className="form-control form-control-sm d-inline-block text-center"
            style={{ width: 70 }}
          />
        </div>

        <div className="col-auto">
          <label className="fw-semibold me-2">질문수</label>
          <input
            value={questionWeightInput}
            onChange={(e) => onChangeQuestionWeightInput(e.target.value)}
            type="number"
            min={0}
            max={10}
            className="form-control form-control-sm d-inline-block text-center"
            style={{ width: 70 }}
          />
        </div>

        <div className="col-auto">
          <button onClick={onSaveWeights} className="btn btn-primary btn-sm" type="button">
            저장
          </button>
        </div>

        <div className="col-12" />

        <div className="row g-3 align-items-center m-0 p-0">
          <div className="col-auto">
            <label className="fw-semibold me-2">숙련도 초기값</label>
            <input
              value={String(rate.initialSkillRate ?? "")}
              onChange={(e) => onChangeRate({ initialSkillRate: Number(e.target.value) })}
              type="number"
              step={0.01}
              min={0}
              max={14}
              className="form-control form-control-sm d-inline-block text-center"
              style={{ width: 80 }}
            />
          </div>

          <div className="col-auto">
            <label className="fw-semibold me-2">S1</label>
            <input
              value={String(rate.skillRateGrade1 ?? "")}
              onChange={(e) => onChangeRate({ skillRateGrade1: Number(e.target.value) })}
              type="number"
              step={0.01}
              min={0}
              max={14}
              className="form-control form-control-sm d-inline-block text-center"
              style={{ width: 70 }}
            />
          </div>

          <div className="col-auto">
            <label className="fw-semibold me-2">S2</label>
            <input
              value={String(rate.skillRateGrade2 ?? "")}
              onChange={(e) => onChangeRate({ skillRateGrade2: Number(e.target.value) })}
              type="number"
              step={0.01}
              min={0}
              max={14}
              className="form-control form-control-sm d-inline-block text-center"
              style={{ width: 70 }}
            />
          </div>

          <div className="col-auto">
            <label className="fw-semibold me-2">S3</label>
            <input
              value={String(rate.skillRateGrade3 ?? "")}
              onChange={(e) => onChangeRate({ skillRateGrade3: Number(e.target.value) })}
              type="number"
              step={0.01}
              min={0}
              max={14}
              className="form-control form-control-sm d-inline-block text-center"
              style={{ width: 70 }}
            />
          </div>

          <div className="col-auto">
            <label className="fw-semibold me-2">S4</label>
            <input
              value={String(rate.skillRateGrade4 ?? "")}
              onChange={(e) => onChangeRate({ skillRateGrade4: Number(e.target.value) })}
              type="number"
              step={0.01}
              min={0}
              max={14}
              className="form-control form-control-sm d-inline-block text-center"
              style={{ width: 70 }}
            />
          </div>

          <div className="col-12 my-2" />

          <div className="col-auto">
            <label className="fw-semibold me-2">요구관리도 초기값</label>
            <input
              value={String(rate.initialManagementRate ?? "")}
              onChange={(e) => onChangeRate({ initialManagementRate: Number(e.target.value) })}
              type="number"
              step={0.01}
              min={0}
              max={14}
              className="form-control form-control-sm d-inline-block text-center"
              style={{ width: 80 }}
            />
          </div>

          <div className="col-auto">
            <label className="fw-semibold me-2">M1</label>
            <input
              value={String(rate.managementRateGrade1 ?? "")}
              onChange={(e) => onChangeRate({ managementRateGrade1: Number(e.target.value) })}
              type="number"
              step={0.01}
              min={0}
              max={14}
              className="form-control form-control-sm d-inline-block text-center"
              style={{ width: 70 }}
            />
          </div>

          <div className="col-auto">
            <label className="fw-semibold me-2">M2</label>
            <input
              value={String(rate.managementRateGrade2 ?? "")}
              onChange={(e) => onChangeRate({ managementRateGrade2: Number(e.target.value) })}
              type="number"
              step={0.01}
              min={0}
              max={14}
              className="form-control form-control-sm d-inline-block text-center"
              style={{ width: 70 }}
            />
          </div>

          <div className="col-auto">
            <label className="fw-semibold me-2">M3</label>
            <input
              value={String(rate.managementRateGrade3 ?? "")}
              onChange={(e) => onChangeRate({ managementRateGrade3: Number(e.target.value) })}
              type="number"
              step={0.01}
              min={0}
              max={14}
              className="form-control form-control-sm d-inline-block text-center"
              style={{ width: 70 }}
            />
          </div>

          <div className="col-auto">
            <button onClick={onSaveRate} className="btn btn-primary btn-sm" type="button">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
