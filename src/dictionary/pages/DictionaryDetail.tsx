import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGardenDictionaryDetail } from "@/dictionary/services/dictionaryApi";
import type { GardenDetailItem, GardenFileItem } from "@/dictionary/types/dictionaryType";
import GardenDetailView from "@/dictionary/components/GardenDetailView";

function pickUrl(f: GardenFileItem) {
  return f.rtnFileUrl || f.rtnThumbFileUrl || "";
}

export default function DictionaryDetail() {
  const navigate = useNavigate();
  const { cntntsNo } = useParams<{ cntntsNo: string }>();

  const [files, setFiles] = useState<GardenFileItem[]>([]);
  const [detail, setDetail] = useState<GardenDetailItem | null>(null);
  const [selectedImg, setSelectedImg] = useState<string>("https://via.placeholder.com/300");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!cntntsNo) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const { files: f, detail: d } = await getGardenDictionaryDetail(cntntsNo);
        if (!alive) return;

        setFiles(f);
        setDetail(d);

        const first = f[0] ? pickUrl(f[0]) : "";
        if (first) setSelectedImg(first);
      } catch (e: any) {
        if (!alive) return;
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
  }, [cntntsNo]);

  return (
    <div className="mx-auto" style={{ width: 1470, padding: 16 }}>
      <h4 className="fw-bold mb-4">실내 정원용 식물</h4>

      <div className="bg-white border rounded p-4">
        {loading && <div className="text-secondary">불러오는 중...</div>}
        {!!error && !loading && <div className="alert alert-danger mb-4">{error}</div>}

        {!loading && !error && (
          <>
            <GardenDetailView
              files={files}
              detail={detail}
              selectedImg={selectedImg}
              onSelectImg={setSelectedImg}
            />

            <div className="text-end mt-3">
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/plantDictionary")}>
                뒤로가기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
