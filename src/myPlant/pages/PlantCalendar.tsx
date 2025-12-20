import React from "react";
import { usePlantCalendar } from "@/myPlant/hooks/usePlantCalendar";
import CalendarHeader from "@/myPlant/components/CalendarHeader";
import CalendarGrid from "@/myPlant/components/CalendarGrid";
import DaySidePanel from "@/myPlant/components/DaySidePanel";
import PlantCalendarModalHost from "@/myPlant/components/PlantCalendarModalHost";
import { MODAL_STATE } from "@/myPlant/enums/plantCalendarEnums";

export default function PlantCalendar() {
    const { state, computed, actions } = usePlantCalendar();

    return (
        <div className="bg-light" style={{ minHeight: "100vh" }}>
            <div className="mx-auto" style={{ width: 1470 }}>
                <div className="container-fluid">
                    <div className="container-fluid py-4">
                        <h3 className="fw-bold m-0">식물 캘린더</h3>
                    </div>

                    <div className="row">
                        <div className="col-lg-8 order-lg-1">
                            <div className="card shadow-sm">
                                <div className="bg-dark py-3" />
                                <div className="card-body">
                                    <CalendarHeader monthLabel={computed.monthLabel} onPrev={actions.gotoPrevMonth} onNext={actions.gotoNextMonth} />

                                    <CalendarGrid
                                        cells={computed.calendarCells}
                                        selectedYmd={state.selectedYmd}
                                        monthDiaryCount={state.monthDiaryCount}
                                        monthWaterCount={state.monthWaterCount}
                                        onSelectDay={actions.setSelectedYmd}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 order-lg-2">
                            <DaySidePanel
                                selectedYmd={state.selectedYmd}
                                waters={state.waters}
                                diaries={state.diaries}
                                isToday={computed.isToday}
                                onToggleWatering={actions.onToggleWatering}
                                onOpenReg={actions.openDiaryRegModal}
                                onClickDiary={actions.onClickDiaryCard}
                                onDeleteDiary={actions.onDeleteDiary}
                            />
                        </div>
                    </div>
                </div>

                <PlantCalendarModalHost
                    modalState={state.modalState}
                    photoFiles={state.photoFiles}
                    myPlants={state.myPlants}
                    regMyplantId={state.regMyplantId}
                    regActivity={state.regActivity}
                    regState={state.regState}
                    regMemo={state.regMemo}
                    errors={state.errors}
                    saving={state.saving}
                    imageDraftFile={state.imageDraftFile}
                    imageDraftUrl={state.imageDraftUrl}
                    detail={state.detail}
                    onCloseAll={() => actions.setModalState(MODAL_STATE.NONE)}
                    onOpenImageAdd={actions.openImageAddModal}
                    onRemovePhotoAt={actions.removePhotoAt}
                    onChangeMyplantId={(v) => actions.setRegMyplantId(v)}
                    onChangeActivity={(v) => actions.setRegActivity(v)}
                    onChangeState={(v) => actions.setRegState(v)}
                    onChangeMemo={(v) => actions.setRegMemo(v)}
                    onClearError={(k) => actions.setErrors((prev) => ({ ...prev, [k]: undefined }))}
                    onSubmit={actions.submitDiary}
                    onBackToReg={() => actions.setModalState(MODAL_STATE.DIARY_REGIST)}
                    onPickDraftFile={(f, url) => {
                        actions.setImageDraftFile(f);
                        actions.setImageDraftUrl(url);
                    }}
                    onCommitDraft={actions.commitImageDraft}
                />
            </div>
        </div>
    );
}
