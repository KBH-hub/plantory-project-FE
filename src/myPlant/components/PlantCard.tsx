import type { PlantCardProps } from "@/myPlant/types/myPlantManagementType";

export default function PlantCard({ plant: p, onClick }: PlantCardProps) {
    return (
        <div className="card plant-card shadow-sm h-100" role="button" onClick={onClick}>
            {p.img ? (
                <img src={p.img} className="card-img-top rounded-top" alt="plant" style={{ height: 260 }} />
            ) : (
                <div className="bg-white shadow-sm d-flex justify-content-center align-items-center" style={{ height: 260 }}>
                    <i className="bi bi-image fs-1 text-muted" />
                </div>
            )}

            <div className="card-body text-center">
                <h6 className="fw-bold mb-1">{p.name}</h6>
                <p className="text-muted small mb-0">함께한지 +{p.daysSinceCreated}일</p>
            </div>
        </div>
    );
}
