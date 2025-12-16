import { useEffect, useState } from "react";
import { getDashboard, DashboardResponse } from "../services/dashboardService";
import RecommendedList from "../components/RecommendedList";

function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <div className="bg-light">
      {/* <Header /> */}

      <div className="mx-auto" style={{ width: '1470px', padding: '16px' }}>
        <div className="mb-3">
          <div
            id="plantBanner"
            className="carousel slide shadow-sm"
            data-bs-ride="carousel"
            style={{ height: '200px', borderRadius: '8px', overflow: 'hidden' }}
          >
            <div className="carousel-inner" style={{ height: '100%' }}>
              <div className="carousel-item active" style={{ height: '100%' }}>
                <img
                  src="/image/banner_1.png"
                  className="d-block w-100"
                  alt="싱그러운 몬스테라"
                  style={{ height: '100%', objectFit: 'cover' }}
                />
                <div className="carousel-caption d-none d-md-block text-start">
                  <h5 className="fw-bold mb-1">오늘의 인기 나눔</h5>
                  <p className="mb-2 small">가까운 동네에서 식물을 나눔받아보세요.</p>
                  <a href="/sharingList" className="btn btn-sm btn-light fw-semibold">
                    나눔 보러가기
                  </a>
                </div>
              </div>

              <div className="carousel-item" style={{ height: '100%' }}>
                <img
                  src="/image/banner_2.png"
                  className="d-block w-100"
                  alt="산세베리아"
                  style={{ height: '100%', objectFit: 'cover' }}
                />
                <div className="carousel-caption d-none d-md-block text-start">
                  <h5 className="fw-bold mb-1">관리 쉬운 식물 검색</h5>
                  <p className="mb-2 small">초보자에게 딱 맞는 식물을 찾아보세요.</p>
                  <a href="/plantDictionary" className="btn btn-sm btn-light fw-semibold">
                    식물 사전 보러가기
                  </a>
                </div>
              </div>

              <div className="carousel-item" style={{ height: '100%' }}>
                <img
                  src="/image/banner_3.png"
                  className="d-block w-100"
                  alt="허브 & 다육"
                  style={{ height: '100%', objectFit: 'cover' }}
                />
                <div className="carousel-caption d-none d-md-block text-start">
                  <h5 className="fw-bold mb-1">나의 식물 관리</h5>
                  <p className="mb-2 small">나의 식물 일정을 관리하세요.</p>
                  <a href="/plantCalendar" className="btn btn-sm btn-light fw-semibold">
                    식물 캘린더 보러가기
                  </a>
                </div>
              </div>
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#plantBanner"
              data-bs-slide="prev"
              style={{ width: '7%' }}
            >
              <span className="carousel-control-prev-icon" />
              <span className="visually-hidden">이전</span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#plantBanner"
              data-bs-slide="next"
              style={{ width: '7%' }}
            >
              <span className="carousel-control-next-icon" />
              <span className="visually-hidden">다음</span>
            </button>

            <div className="carousel-indicators" style={{ marginBottom: '6px' }}>
              <button type="button" data-bs-target="#plantBanner" data-bs-slide-to={0} className="active" />
              <button type="button" data-bs-target="#plantBanner" data-bs-slide-to={1} />
              <button type="button" data-bs-target="#plantBanner" data-bs-slide-to={2} />
            </div>
          </div>
        </div>

        {/* 메인 영역 */}
        <div className="d-flex flex-nowrap" style={{ gap: '20px' }}>
          <div style={{ width: '1000px' }}>
            <div className="d-flex flex-nowrap gap-3 mb-3">
              {[
                { title: '내 식물', img: '/image/dashboard_1.png', value: data.myPlantsCount },
                { title: '오늘 물 필요 식물', img: '/image/dashboard_2.png', value: data.todayWateringCount },
                { title: '관심 필요 식물', img: '/image/dashboard_3.png', value: data.careNeededCount }
              ].map((item, idx) => (
                <div key={idx} className="card shadow-sm" style={{ width: '340px' }}>
                  <div className="card-body d-flex align-items-center p-3">
                    <img src={item.img} width={40} height={40} alt={item.title} className="me-3" />
                    <div>
                      <div className="text-secondary small">{item.title}</div>
                      <div className="fw-semibold" style={{ fontSize: '32px', lineHeight: '32px' }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>

            {/* 주목할 만한 나눔 */}
            <h5 className="fw-bold">주목할 만한 나눔</h5>
            {data.recommendeds.length === 0 ? (
              <div className="text-muted small">추천 나눔이 없습니다.</div>
            ) : (
              <RecommendedList items={data.recommendeds} />
            )}
            </div>

            <div style={{ width: '420px' }}>
              <div className="card shadow-sm mb-3">
                <div className="card-header bg-dark text-white py-2">
                  <h6 className="m-0 fw-bold">오늘의 식물 관리</h6>
                </div>

                <div className="card-body p-2" style={{ minHeight: '560px' }}>
                  <div className="card mb-2">
                    <div className="card-header bg-primary text-white py-2 d-flex align-items-center">
                      <i className="bi bi-droplet me-2" />
                      <span className="fw-semibold small">물주기</span>
                    </div>

                    <div className="card-body p-2" style={{ minHeight: '225px' }}>
                      {data.waterings.length === 0 ? (
                        <div className="text-center text-muted small mt-4">
                          오늘 물주기 일정이 없습니다
                        </div>
                      ) : (
                        data.waterings.map((item, idx) => (
                          <div key={idx} className="border rounded p-2 mb-2 small">
                            <div className="fw-semibold">{item.name}</div>
                            <div className="text-muted">
                              물 주기 간격: {item.interval}일
                            </div>
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

                    <div className="card-body p-2" style={{ minHeight: '225px' }}>
                      {data.diaries.length === 0 ? (
                        <div className="text-center text-muted small mt-4">
                          오늘 작성한 관찰일지가 없습니다
                        </div>
                      ) : (
                        data.diaries.map(item => (
                          <div key={item.diaryId} className="d-flex border rounded p-2 mb-2 small">
                            {item.fileUrl && (
                              <img src={item.fileUrl} className="me-2 rounded" style={{ width: 60, height: 60 }} />
                            )}
                            <div>
                              <div className="fw-semibold">{item.myplantName}</div>
                              <div className="text-muted"> {item.activity} · {item.state} </div>
                              <div className="text-muted">{item.memo}</div>
                            </div>
                          </div>
                        ))
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>


        </div>
      </div>
    </div>
  )
}

export default Dashboard
