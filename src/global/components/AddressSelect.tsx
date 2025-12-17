import { useState } from 'react';
import koreaData from '@/data/korea.json';

type Props = {
  onChange: (address: string) => void;
};


const AddressSelect = ({ onChange }: Props) => {
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');

  const sigunguList: string[] = sido ? koreaData[sido as keyof typeof koreaData] : [];

  const handleSidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSido(value);
    setSigungu('');
    onChange('');
  };

  const handleSigunguChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSigungu(value);
    onChange(`${sido} ${value}`);
  };

  return (
    <div className="row g-2">
      <div className="col-6">
        <select className="form-select" value={sido} onChange={handleSidoChange}>
          <option value="">시/도</option>
          {Object.keys(koreaData).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <div className="col-6">
        <select
          className="form-select"
          value={sigungu}
          onChange={handleSigunguChange}
          disabled={!sido}
        >
          <option value="">시/군/구</option>
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