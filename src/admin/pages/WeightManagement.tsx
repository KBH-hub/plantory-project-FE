import { useWeightManagement } from "../hooks/useWeightManagement";

import ListControlPanel from "../components/ListControlPanel";
import WeightConfigSection from "../components/WeightConfigSection";
import WeightListSection from "../components/WeightListSection";

export default function WeightManagement() {
  const vm = useWeightManagement();

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h3 className="fw-bold mb-4">추천관리</h3>
      </div>

      <ListControlPanel
        title="추천 리스트"
        searchInput={vm.searchInput}
        onChangeSearchInput={vm.setSearchInput}
        onSearch={vm.onSearch}
        range={vm.range}
        onChangeRange={vm.onChangeRange}
      />

      <WeightConfigSection
        searchWeightInput={vm.searchWeightInput}
        questionWeightInput={vm.questionWeightInput}
        onChangeSearchWeightInput={vm.setSearchWeightInput}
        onChangeQuestionWeightInput={vm.setQuestionWeightInput}
        onSaveWeights={vm.onSaveWeights}
        rate={vm.rate}
        onChangeRate={(patch) => vm.setRate((prev) => ({ ...prev, ...patch }))}
        onSaveRate={vm.onSaveRate}
      />

      <WeightListSection items={vm.items} pagerRef={vm.pagerRef} latest={vm.latest} />
    </div>
  );
}
