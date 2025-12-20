import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  onReset: () => void;
  placeholder?: string;
  label?: string;
};

export default function DictionarySearchBar({
  value,
  onChange,
  onSearch,
  onReset,
  placeholder = "식물명(표준·유통명)",
  label = "식물명",
}: Props) {
  return (
    <table className="table table-bordered bg-white">
      <tbody>
        <tr>
          <th className="w-25 align-middle">{label}</th>
          <td>
            <input
              type="text"
              className="form-control d-inline-block"
              style={{ width: "25%" }}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
            />
            <button className="btn btn-secondary ms-2" type="button" onClick={onSearch}>
              검색
            </button>
            <button className="btn btn-outline-secondary ms-2" type="button" onClick={onReset}>
              초기화
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
