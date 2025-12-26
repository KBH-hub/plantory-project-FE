import koreaData from "@/data/korea.json";
import {ChangeEvent} from "react";

type Props = {
    value?: string;
    onChange: (address: string) => void;
};

const AddressSelect = ({ value = "", onChange }: Props) => {
    const parts = value.split(" ");
    const sido = parts[0] ?? "";
    const sigungu = parts[1] ?? "";

    const sigunguList: string[] = sido ? koreaData[sido as keyof typeof koreaData] : [];

    const handleSidoChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextSido = e.target.value;

        if (!nextSido) {
            onChange("");
            return;
        }

        const nextSigunguList = koreaData[nextSido as keyof typeof koreaData];
        const firstSigungu = nextSigunguList?.[0] ?? "";

        onChange(firstSigungu ? `${nextSido} ${firstSigungu}` : nextSido);
    };


    const handleSigunguChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextSigungu = e.target.value;
        if (!sido) return onChange("");
        onChange(`${sido} ${nextSigungu}`);
    };

    return (
        <div className="row g-2">
            <div className="col-6">
                <select className="form-select" value={sido} onChange={handleSidoChange}>
                    <option value="" >시/도</option>
                    {Object.keys(koreaData).map((key) => (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-6">
                <select className="form-select" value={sigungu} onChange={handleSigunguChange} disabled={!sido}>
                    <option disabled value="">시/군/구</option>
                    {sigunguList.map((sg) => (
                        <option key={sg} value={sg}>
                            {sg}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default AddressSelect;
