import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDryDictionaryDetail } from "@/dictionary/services/dictionaryServices";
import type { DryDetailItem } from "@/dictionary/types/dictionary";
import DryDetailView from "@/dictionary/components/DryDetailView";

function clean(v: unknown) {
  return v == null ? "" : String(v).trim();
}

export default function DryDictionaryDetail() {
  const navigate = useNavigate();
  const { cntntsNo } = useParams<{ cntntsNo: string }>();

  const id = useMemo(() => {
    const byParam = clean(cntntsNo);
    if (byParam) return byParam;
    return clean(new URLSearchParams(window.location.search).get("cntntsNo"));
  }, [cntntsNo]);

  const [detail, setDetail] = useState<DryDetailItem | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>("https://via.placeholder.com/300");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!id) {
        setLoading(false);
        setDetail(null);
        setImages([]);
        setSelectedImg("https://via.placeholder.com/300");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const { detail: item } = await getDryDictionaryDetail(id);
        if (!alive) return;

        setDetail(item);

        const imgs = [
          clean(item?.mainImgUrl1),
          clean(item?.mainImgUrl2),
          clean(item?.lightImgUrl1),
          clean(item?.lightImgUrl2),
          clean(item?.lightImgUrl3),
        ].filter((x) => x !== "");

        setImages(imgs);
        setSelectedImg(imgs[0] || "https://via.placeholder.com/300");
      } catch (e: any) {
        if (!alive) return;
        setDetail(null);
        setImages([]);
        setSelectedImg("https://via.placeholder.com/300");
        setError(e?.message ? String(e.message) : "상세 정보를 불러오지 못했습니다.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <div className="mx-auto" style={{ width: 1470, padding: 16 }}>
      <h4 className="fw-bold mb-4">건조에 강한 실내 식물</h4>

      <div className="bg-white border rounded p-4">
        {loading && <div className="text-secondary">불러오는 중...</div>}
        {!!error && !loading && <div className="alert alert-danger mb-4">{error}</div>}

        {!loading && !error && (
          <>
            <DryDetailView
              detail={detail}
              images={images}
              selectedImg={selectedImg}
              onSelectImg={setSelectedImg}
            />

            <div className="text-end mt-3">
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/dryPlantDictionary")}>
                뒤로가기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
