import { useMemo } from "react";
import type { GardenDetailItem, GardenFileItem } from "@/dictionary/types/dictionaryType";

function safeText(v: unknown) {
  const s = v == null ? "" : String(v).trim();
  return s || "-";
}

function pickUrl(f: GardenFileItem) {
  return f.rtnFileUrl || f.rtnThumbFileUrl || "";
}

type Props = {
  files: GardenFileItem[];
  detail: GardenDetailItem | null;
  selectedImg: string;
  onSelectImg: (url: string) => void;
};

export default function GardenDetailView({ files, detail, selectedImg, onSelectImg }: Props) {
  const wateringLines = useMemo(() => {
    const w = {
      봄: detail?.watercycleSprngCodeNm,
      여름: detail?.watercycleSummerCodeNm,
      가을: detail?.watercycleAutumnCodeNm,
      겨울: detail?.watercycleWinterCodeNm,
    };
    const order: Array<keyof typeof w> = ["봄", "여름", "가을", "겨울"];
    return order.map((season) => ({ season, value: safeText(w[season]) }));
  }, [detail]);

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <img
            src={selectedImg}
            alt="식물 이미지"
            className="border rounded"
            style={{
              width: "100%",
              maxWidth: 430,
              height: 430,
              objectFit: "cover",
              background: "#f5f5f5",
              display: "block",
            }}
          />

          {files.length > 0 && (
            <div className="mt-2 d-flex flex-wrap gap-2">
              {files.map((f, idx) => {
                const thumb = f.rtnThumbFileUrl || f.rtnFileUrl || "";
                const full = pickUrl(f) || thumb;
                if (!thumb) return null;

                return (
                  <a
                    key={`${thumb}-${idx}`}
                    href={full}
                    target="_blank"
                    rel="noopener"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectImg(full);
                    }}
                  >
                    <img
                      src={thumb}
                      alt={safeText(f.rtnImageDc)}
                      style={{ width: 64, height: 64, objectFit: "cover" }}
                      className="border rounded"
                    />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="col-md-8">
          <h4 className="fw-bold mb-3">{safeText(detail?.distbNm)}</h4>

          <div className="row mt-2">
            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">관리요구도</h6>
              <p className="mb-0">{safeText(detail?.managelevelCodeNm)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">병해충</h6>
              <p className="mb-0">{safeText(detail?.dlthtsCodeNm)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">생장 속도</h6>
              <p className="mb-0">{safeText(detail?.grwtveCodeNm)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">냄새</h6>
              <p className="mb-0">{safeText(detail?.smellCodeNm)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">생육 온도</h6>
              <p className="mb-0">{safeText(detail?.grwhTpCodeNm)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">겨울 최소 온도</h6>
              <p className="mb-0">{safeText(detail?.winterLwetTpCodeNm)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">습도</h6>
              <p className="mb-0">{safeText(detail?.hdCodeNm)}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold">물주기</h6>
              <div>
                {wateringLines.map((x) => (
                  <div key={x.season}>
                    {x.season}: {x.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="row">
        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">과(분류)명</h6>
          <p className="mb-0">{safeText(detail?.fmlCodeNm)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">원산지</h6>
          <p className="mb-0">{safeText(detail?.orgplceInfo)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">형태분류</h6>
          <p className="mb-0">{safeText(detail?.clCodeNm || detail?.grwhstleCodeNm)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">꽃</h6>
          <p className="mb-0">{safeText(detail?.flclrCodeNm)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">엽색/엽형</h6>
          <p className="mb-0">{safeText(detail?.lefcolrCodeNm)}</p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold">생장형태</h6>
          <p className="mb-0">{safeText(detail?.grwhstleCodeNm || detail?.eclgyCodeNm)}</p>
        </div>

        <div className="col-md-12 mb-3">
          <h6 className="fw-bold">특성</h6>
          <p className="mb-0">{safeText(detail?.fncltyInfo)}</p>
        </div>

        <div className="col-md-12 mb-3">
          <h6 className="fw-bold">Tip</h6>
          <p className="mb-0">{safeText(detail?.adviseInfo)}</p>
        </div>
      </div>
    </>
  );
}
