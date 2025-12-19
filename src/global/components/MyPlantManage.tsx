import type { TodayWatering, TodayDiary } from "@/dashboard/types/dashboard";
type Props = {waterings: TodayWatering[]; diaries: TodayDiary[]};

function MyPlantManage({ waterings, diaries }: Props) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-dark text-white py-2">
        <h6 className="m-0 fw-bold">오늘의 식물 관리</h6>
      </div>

      <div className="card-body p-2" style={{ minHeight: "560px" }}>
        <div className="card mb-2">
          <div className="card-header bg-primary text-white py-2 d-flex align-items-center">
            <i className="bi bi-droplet me-2" />
            <span className="fw-semibold small">물주기</span>
          </div>

          <div className="card-body p-2" style={{ minHeight: "225px" }}>
            {waterings.length === 0 ? (
              <div className="text-center text-muted small mt-4">
                오늘 물주기 일정이 없습니다
              </div>
            ) : (
              waterings.map((item) => (
                <div
                  key={`${item.name}-${item.interval}`}
                  className="border rounded p-2 mb-2 small"
                >
                  <div className="fw-semibold">{item.name}</div>
                  <div className="text-muted">{item.interval}일마다</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-warning py-2 d-flex align-items-center">
            <i className="bi bi-journal-text me-2" />
            <span className="fw-semibold small">관찰일지</span>
          </div>

          <div className="card-body p-2" style={{ minHeight: "225px" }}>
            {diaries.length === 0 ? (
              <div className="text-center text-muted small mt-4">
                오늘 작성한 관찰일지가 없습니다
              </div>
            ) : (
              diaries.map((item) => (
                <div
                  key={item.diaryId}
                  className="d-flex border rounded p-2 mb-2 small"
                >
                  {item.fileUrl && (
                    <img
                      src={item.fileUrl}
                      alt=""
                      className="me-2 rounded"
                      style={{ width: 60, height: 60 }}
                    />
                  )}
                  <div>
                    <div className="fw-semibold">{item.myplantName}</div>
                    <div className="text-muted">
                      {item.activity} · {item.state}
                    </div>
                    <div className="text-muted">{item.memo}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPlantManage;