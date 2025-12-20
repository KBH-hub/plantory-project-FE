import { useRef, useState } from "react";
import type { PlantVm } from "@/myPlant/types/myPlantManagement";

import ManagementHeader from "@/myPlant/components/ManagementHeader";
import PlantGrid from "@/myPlant/components/PlantGrid";
import AddPlantModal from "@/myPlant/components/modals/AddPlantModal";
import DetailPlantModal from "@/myPlant/components/modals/DetailPlantModal";

import { useMyPlantList } from "@/myPlant/hooks/useMyPlantList";
import { useAddPlant } from "@/myPlant/hooks/useAddPlant";
import { useDetailPlant } from "@/myPlant/hooks/useDetailPlant";

export default function MyPlantManagement() {
    const [keyword, setKeyword] = useState("");
    const [limit] = useState(8);

    const pagerRef = useRef<HTMLUListElement | null>(null);

    const list = useMyPlantList({ keyword, limit, pagerRef });

    const add = useAddPlant({
        onRefresh: () => list.refreshByOffset(0),
    });

    const detail = useDetailPlant({
        onRefresh: () => list.refreshByOffset(0),
    });

    const onOpenDetail = (p: PlantVm) => {
        detail.open(p);
    };

    return (
        <div className="bg-light" style={{ minHeight: "95vh" }}>
            <div className="container-xxl py-4 bg-light plant-page">
                <h3 className="fw-bold m-0">나의 식물 관리</h3>

                <ManagementHeader
                    keyword={keyword}
                    onKeywordChange={setKeyword}
                    onSearch={() => list.refreshByOffset(0)}
                    onOpenAdd={add.open}
                />

                <div className="plant-management-container rounded">
                    <PlantGrid loading={list.loading} items={list.items} onOpenDetail={onOpenDetail} />
                </div>

                {list.totalCount > 0 ? (
                    <nav className="mt-3">
                        <ul className="pagination pagination-sm justify-content-center" id="myplant-pagination" ref={pagerRef} />
                    </nav>
                ) : null}
            </div>

            <AddPlantModal
                open={add.opened}
                onClose={add.close}
                form={add.form}
                preview={add.preview}
                onChangeForm={add.setForm}
                onChangeFile={add.onFileChange}
                onSubmit={add.submit}
            />

            <DetailPlantModal
                open={detail.opened}
                onClose={detail.close}
                currentVM={detail.currentVM}
                deletePhoto={detail.deletePhoto}
                preview={detail.preview}
                file={detail.file}
                form={detail.form}
                hasWatering={detail.hasWatering}
                deletingWatering={detail.deletingWatering}
                onChangeForm={detail.setForm}
                onChangeFile={detail.onFileChange}
                onClickPhotoDelete={detail.onClickPhotoDelete}
                onSubmitEdit={detail.submitEdit}
                onDeletePlant={detail.deletePlant}
                onDeleteWatering={detail.deleteWatering}
            />
        </div>
    );
}
