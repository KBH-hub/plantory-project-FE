import { useEffect, useState } from "react";
import { searchPlants, getGardenDetail, getDryDetail } from "@/community/sharing/services/readSharingApi";
import { DictionarySearchItem, DictionaryPlantDetail } from "@/community/sharing/types/readSharing";

interface Props {
  onSelect: (data: DictionaryPlantDetail) => void;
}

function PlantSearchModal({ onSelect }: Props) {
  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState<DictionarySearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const word = keyword.trim();
    if (!word) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const data = await searchPlants(word);
      setList(data);
    } catch (e) {
      console.error(e);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSelect = async (item: DictionarySearchItem) => {
    try {
      const data =
        item.type === "garden"
          ? await getGardenDetail(item.id)
          : await getDryDetail(item.id);

      onSelect(data);

      const modalEl = document.getElementById("plantSearchModal");
      if (modalEl) {
        const bootstrap = (window as any).bootstrap;
        const modal =
          bootstrap.Modal.getInstance(modalEl) ??
          new bootstrap.Modal(modalEl);
        modal.hide();
      }
    } catch (e) {
      console.error(e);
      alert("식물 정보를 불러오지 못했습니다.");
    }
  };


  useEffect(() => {
    const modalEl = document.getElementById("plantSearchModal");
    if (!modalEl) return;

    modalEl.addEventListener("shown.bs.modal", () => {
      setKeyword("");
      setList([]);
    });

    return () => {
      modalEl.removeEventListener("shown.bs.modal", () => {});
    };
  }, []);

  return (
    <div
      className="modal fade"
      id="plantSearchModal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
       
          <div className="modal-header py-2">
            <h6 className="modal-title fw-bold mb-0">식물 검색</h6>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body">

            <div className="mb-3">
              <label className="form-label small mb-1">식물명</label>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="식물 이름을 입력하세요."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="input-group-text"
                  type="button"
                  onClick={handleSearch}
                >
                  <i className="bi bi-search" />
                </button>
              </div>
            </div>

            <div id="plantSearchResultList" className="vstack gap-2">
              {loading && (
                <div className="text-center text-muted small py-2">
                  검색 중...
                </div>
              )}

              {!loading && list.length === 0 && keyword && (
                <div className="text-center text-muted small py-2">
                  검색 결과가 없습니다.
                </div>
              )}

              {list.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="border rounded d-flex align-items-center p-2"
                >
                  {item.fileUrl && (
                    <img
                      src={item.fileUrl}
                      className="me-2"
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="flex-grow-1 small">
                    {item.plantName}
                  </div>

                  <button
                    type="button"
                    className="btn btn-success btn-sm px-3 text-nowrap"
                    onClick={() => handleSelect(item)}
                  >
                    선택
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer py-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              data-bs-dismiss="modal"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantSearchModal;
