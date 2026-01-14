import type { WateringFieldsProps } from "@/myPlant/types/myPlantManagementType";

export default function WateringFields({ form, onChange }: WateringFieldsProps) {
    return (
        <>
            <label className="fw-bold mt-2">물주기</label>
            <div className="row g-2 align-items-center">
                <div className="col-12 col-md-4">
                    <div className="form-floating">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="최초 물 준 일자"
                            value={form.startAt}
                            onChange={(e) => onChange({ ...form, startAt: e.target.value })}
                        />
                        <label>최초 물 준 일자</label>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="form-floating">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="간격(일)"
                            min={0}
                            step={1}
                            value={form.intervalDays}
                            onChange={(e) => onChange({ ...form, intervalDays: e.target.value })}
                        />
                        <label>간격(일)</label>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="form-floating">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="마지막 물주기 일자"
                            value={form.endDate}
                            onChange={(e) => onChange({ ...form, endDate: e.target.value })}
                        />
                        <label>마지막 물주기 일자</label>
                    </div>
                </div>
            </div>
        </>
    );
}
