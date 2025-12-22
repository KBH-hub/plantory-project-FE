import type { DryDetailItem } from "@/dictionary/types/dictionaryType";

function clean(v: unknown) {
  return v == null ? "" : String(v).trim();
}

function stripBrToSpace(v: unknown) {
  const s = clean(v);
  return s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function safeText(v: unknown) {
  const s = stripBrToSpace(v);
  return s || "-";
}

type Props = {
  detail: DryDetailItem | null;
  images: string[];
  selectedImg: string;
  onSelectImg: (src: string) => void;
};

export default function DryDetailView({ detail, images, selectedImg, onSelectImg }: Props) {
  const displayName = safeText(detail?.cntntsSj || detail?.distbNm);

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <img
            src={selectedImg}
            alt={displayName === "-" ? "" : displayName}
            className="img-fluid border rounded"
            style={{
              width: "100%",
              maxWidth: 430,
              height: 430,
              objectFit: "cover",
              background: "#f5f5f5",
              display: "block",
            }}
          />

          {!!images.length && (
            <div className="mt-2 d-flex flex-wrap gap-2">
              {images.map((src) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noopener"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectImg(src);
                  }}
                >
                  <img
                    src={src}
                    alt={displayName === "-" ? "" : displayName}
                    loading="lazy"
                    className="border rounded"
                    style={{ width: 64, height: 64, objectFit: "cover" }}
                  />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="col-md-8">
          <h4 className="fw-bold mb-1">{safeText(detail?.cntntsSj || detail?.distbNm)}</h4>
          <div className="text-muted fst-italic mb-3">{safeText(detail?.scnm)}</div>

          <div className="row mt-2">
            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">관리요구도</h6>
              <p className="mb-0">{safeText(detail?.manageLevelNm)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">병해충</h6>
              <p className="mb-0">{safeText(detail?.dlthtsInfo)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">생장 속도</h6>
              <p className="mb-0">{safeText(detail?.grwtseVeNm)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">생육 온도</h6>
              <p className="mb-0">{safeText(detail?.grwhTpInfo || detail?.grwtInfo)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">겨울 최소 온도</h6>
              <p className="mb-0">{safeText(detail?.pswntrTpInfo)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">습도</h6>
              <p className="mb-0">{safeText(detail?.hgtmMhmrInfo)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">물주기</h6>
              <p className="mb-0">{safeText(detail?.waterCycleInfo)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">채광</h6>
              <p className="mb-0">{safeText(detail?.lighttInfo)}</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="row">
        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">과(분류)명</h6>
          <p className="mb-0">{safeText(detail?.clNm)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">원산지</h6>
          <p className="mb-0">{safeText(detail?.orgplce)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">꽃</h6>
          <p className="mb-0">{safeText(detail?.flwrInfo)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">엽색/엽형</h6>
          <p className="mb-0">{safeText(detail?.lfclChngeInfo)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">생장형태</h6>
          <p className="mb-0">{safeText(detail?.stleSeNm)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">뿌리형</h6>
          <p className="mb-0">{safeText(detail?.rdxStleNm)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">비료</h6>
          <p className="mb-0">{safeText(detail?.frtlzrInfo)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">번식</h6>
          <p className="mb-0">{safeText(detail?.prpgtInfo)}</p>
        </div>

        <div className="col-md-12 mb-3">
          <h6 className="fw-bold">특성</h6>
          <p className="mb-0">{safeText(detail?.chartrInfo || detail?.lfclChngeInfo)}</p>
        </div>

        <div className="col-md-12 mb-3">
          <h6 className="fw-bold">Tip</h6>
          <p className="mb-0">{safeText(detail?.tipInfo || detail?.batchPlaceInfo)}</p>
        </div>
      </div>
    </>
  );
}
