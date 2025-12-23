type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  disabled?: boolean;
};

export function MemberSearchBar({ value, onChange, onSearch, disabled }: Props) {
  return (
    <div className="input-group" style={{ width: 320 }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSearch();
          }
        }}
        type="text"
        className="form-control px-3"
        placeholder="아이디로 검색"
        aria-label="아이디로 검색"
      />
      <button className="btn btn-dark px-3" onClick={onSearch} disabled={disabled}>
        <i className="bi bi-search" />
      </button>
    </div>
  );
}
