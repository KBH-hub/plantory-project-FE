import React from "react";
import { buildDetailUrl, splitPipes } from "@/dictionary/utils/dictionaryUtils";
import { DictionaryCardItem } from "@/dictionary/types/dictionaryType";

type Props = {
  item: DictionaryCardItem;
};

export default function DictionaryCard({ item }: Props) {
  const title = item.cntntsSj || item.distbNm || "(제목 없음)";

  const thumbs = splitPipes(item.rtnThumbFileUrl);
  const files = splitPipes(item.rtnFileUrl);

  const thumb = item.thumbUrl || thumbs[0] || "";
  const full = item.imageUrl || files[0] || "";
  const hasImg = Boolean(thumb);

  const detailUrl = buildDetailUrl(item.cntntsNo);

  return (
    <div className="row mb-3 p-3 bg-white border rounded align-items-center">
      <div className="col-auto pe-3">
        <div className="border rounded overflow-hidden" style={{ width: 120, height: 90 }}>
          {hasImg ? (
            <a href={full || thumb} target="_blank" rel="noreferrer">
              <img
                src={thumb}
                alt={title}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </a>
          ) : (
            <div className="bg-light d-flex align-items-center justify-content-center text-secondary" style={{ width: "100%", height: "100%" }}>
              🖼
            </div>
          )}
        </div>
      </div>

      <div className="col">
        <a href={detailUrl} className="fw-bold text-dark text-decoration-none">
          {title}
        </a>
      </div>
    </div>
  );
}
