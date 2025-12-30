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

          {/* 구분선 */}
          <div className="col-12">
            <hr className="my-2" />
          </div>

          {/* ===== 숙련도 영역 ===== */}
          <div className="col-12">
            <div className="p-3 border rounded bg-light">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="fw-bold">
                  <span className="badge text-bg-secondary me-2">숙련도</span>
                  기준 값 설정
                </div>
                <button onClick={onSaveRate} className="btn btn-primary btn-sm" type="button">
                  저장
                </button>
              </div>

              {/* 초기값 그룹 */}
              <div className="row g-3 align-items-center m-0">
                <div className="col-auto">
                  <div className="fw-semibold text-muted mb-1">초기값</div>
                  <div className="d-flex align-items-center">
                    <label className="fw-semibold me-2 mb-0">숙련도 초기값</label>
                    <input
                        value={String(rate.initialSkillRate ?? "")}
                        onChange={(e) => onChangeRate({ initialSkillRate: Number(e.target.value) })}
                        type="number"
                        step={0.01}
                        min={0}
                        max={14}
                        className="form-control form-control-sm d-inline-block text-center"
                        style={{ width: 90 }}
                    />
                  </div>
                </div>

                {/* S등급 그룹 */}
                <div className="col-12" />

                <div className="col-12">
                  <div className="fw-semibold text-muted mb-1">등급 구간(S1~S4)</div>
                  <div className="d-flex flex-wrap gap-3 align-items-center">
                    <div className="d-flex align-items-center">
                      <label className="fw-semibold me-2 mb-0">S1</label>
                      <input
                          value={String(rate.skillRateGrade1 ?? "")}
                          onChange={(e) => onChangeRate({ skillRateGrade1: Number(e.target.value) })}
                          type="number"
                          step={0.01}
                          min={0}
                          max={14}
                          className="form-control form-control-sm d-inline-block text-center"
                          style={{ width: 80 }}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <label className="fw-semibold me-2 mb-0">S2</label>
                      <input
                          value={String(rate.skillRateGrade2 ?? "")}
                          onChange={(e) => onChangeRate({ skillRateGrade2: Number(e.target.value) })}
                          type="number"
                          step={0.01}
                          min={0}
                          max={14}
                          className="form-control form-control-sm d-inline-block text-center"
                          style={{ width: 80 }}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <label className="fw-semibold me-2 mb-0">S3</label>
                      <input
                          value={String(rate.skillRateGrade3 ?? "")}
                          onChange={(e) => onChangeRate({ skillRateGrade3: Number(e.target.value) })}
                          type="number"
                          step={0.01}
                          min={0}
                          max={14}
                          className="form-control form-control-sm d-inline-block text-center"
                          style={{ width: 80 }}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <label className="fw-semibold me-2 mb-0">S4</label>
                      <input
                          value={String(rate.skillRateGrade4 ?? "")}
                          onChange={(e) => onChangeRate({ skillRateGrade4: Number(e.target.value) })}
                          type="number"
                          step={0.01}
                          min={0}
                          max={14}
                          className="form-control form-control-sm d-inline-block text-center"
                          style={{ width: 80 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== 요구관리도 영역 ===== */}
          <div className="col-12 mt-3">
            <div className="p-3 border rounded bg-light">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="fw-bold">
                  <span className="badge text-bg-secondary me-2">요구관리도</span>
                  기준 값 설정
                </div>
                {/* 같은 저장 버튼을 쓰는 구조면 그대로 재사용 */}
                <button onClick={onSaveRate} className="btn btn-primary btn-sm" type="button">
                  저장
                </button>
              </div>

              <div className="row g-3 align-items-center m-0">
                {/* 초기값 그룹 */}
                <div className="col-auto">
                  <div className="fw-semibold text-muted mb-1">초기값</div>
                  <div className="d-flex align-items-center">
                    <label className="fw-semibold me-2 mb-0">요구관리도 초기값</label>
                    <input
                        value={String(rate.initialManagementRate ?? "")}
                        onChange={(e) =>
                            onChangeRate({ initialManagementRate: Number(e.target.value) })
                        }
                        type="number"
                        step={0.01}
                        min={0}
                        max={14}
                        className="form-control form-control-sm d-inline-block text-center"
                        style={{ width: 90 }}
                    />
                  </div>
                </div>

                {/* M등급 그룹 */}
                <div className="col-12" />

                <div className="col-12">
                  <div className="fw-semibold text-muted mb-1">등급 구간(M1~M3)</div>
                  <div className="d-flex flex-wrap gap-3 align-items-center">
                    <div className="d-flex align-items-center">
                      <label className="fw-semibold me-2 mb-0">M1</label>
                      <input
                          value={String(rate.managementRateGrade1 ?? "")}
                          onChange={(e) =>
                              onChangeRate({ managementRateGrade1: Number(e.target.value) })
                          }
                          type="number"
                          step={0.01}
                          min={0}
                          max={14}
                          className="form-control form-control-sm d-inline-block text-center"
                          style={{ width: 80 }}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <label className="fw-semibold me-2 mb-0">M2</label>
                      <input
                          value={String(rate.managementRateGrade2 ?? "")}
                          onChange={(e) =>
                              onChangeRate({ managementRateGrade2: Number(e.target.value) })
                          }
                          type="number"
                          step={0.01}
                          min={0}
                          max={14}
                          className="form-control form-control-sm d-inline-block text-center"
                          style={{ width: 80 }}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <label className="fw-semibold me-2 mb-0">M3</label>
                      <input
                          value={String(rate.managementRateGrade3 ?? "")}
                          onChange={(e) =>
                              onChangeRate({ managementRateGrade3: Number(e.target.value) })
                          }
                          type="number"
                          step={0.01}
                          min={0}
                          max={14}
                          className="form-control form-control-sm d-inline-block text-center"
                          style={{ width: 80 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
