import type { PlantGridProps } from "@/myPlant/types/myPlantManagement";
import PlantCard from "@/myPlant/components/PlantCard";

export default function PlantGrid({ loading, items, onOpenDetail }: PlantGridProps) {
    return (
        <div className="row g-3" id="plant-list">
            {loading ? (
                <div className="col-12">
                    <div className="text-center text-muted py-5">로딩 중...</div>
                </div>
            ) : items.length === 0 ? (
                <div className="col-12">
                    <div className="text-center text-muted py-5">
                        <i className="bi bi-box" /> 표시할 식물이 없습니다.
                    </div>
                </div>
            ) : (
                items.map((p) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
                        <PlantCard plant={p} onClick={() => onOpenDetail(p)} />
                    </div>
                ))
            )}
        </div>
    );
}
