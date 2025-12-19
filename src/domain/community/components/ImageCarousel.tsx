import { useState } from "react";

interface Props {
  images: { fileUrl: string }[];
  height?: number;
  carouselId?: string;
}

function ImageCarousel({
  images,
  height = 450,
  carouselId = "communityCarousel",
}: Props) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-muted text-center py-5">
        등록된 이미지가 없습니다.
      </div>
    );
  }

  return (
    <>
      <div
        id={carouselId}
        className="carousel slide"
        data-bs-ride="false"
      >
        <div className="carousel-inner">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`carousel-item ${idx === 0 ? "active" : ""}`}
            >
              <img
                src={img.fileUrl}
                className="d-block w-100 object-fit-cover"
                style={{ height, cursor: "pointer"}}
                onClick={() => setZoomImage(img.fileUrl)}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" />
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" />
            </button>

            <div className="carousel-indicators m-0">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  data-bs-target={`#${carouselId}`}
                  data-bs-slide-to={idx}
                  className={idx === 0 ? "active" : ""}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {zoomImage && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setZoomImage(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-transparent border-0 shadow-none">
              <img
                src={zoomImage}
                className="w-100 rounded"
                style={{ maxHeight: "90vh", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageCarousel;
