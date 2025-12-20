import React from "react";

type Props = {
    monthLabel: string;
    onPrev: () => void;
    onNext: () => void;
};

export default function CalendarHeader({ monthLabel, onPrev, onNext }: Props) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onPrev}>
                <i className="fa-solid fa-chevron-left" />
            </button>
            <h5 className="mb-0 fs-2">{monthLabel}</h5>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onNext}>
                <i className="fa-solid fa-chevron-right" />
            </button>
        </div>
    );
}
