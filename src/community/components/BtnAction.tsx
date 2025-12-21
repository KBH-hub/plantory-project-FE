import { Link } from "react-router-dom";

interface Props {
  onDelete?: () => void;
  editLink?: string;
  children?: React.ReactNode;
}

function BtnAction({ editLink, onDelete, children }: Props) {
  return (
    <div className="d-flex justify-content-end gap-2">
      {editLink && (
        <Link to={editLink} className="btn btn-primary px-4">
          수정
        </Link>
      )}

      {onDelete && (
        <button className="btn btn-danger px-4" onClick={onDelete}>
          삭제
        </button>
      )}

      {children}
    </div>
  );
}

export default BtnAction;
