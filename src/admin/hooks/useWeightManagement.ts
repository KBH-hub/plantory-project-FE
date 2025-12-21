import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePaginator } from "@/global/hooks/usePaginator";

import type {
  CareCountsResponse,
  DateRange,
  RateConfig,
  WeightListItemUI,
  WeightWeightsLatest,
} from "@/admin/types/weightManagementTypes";

import {
  getCareCounts,
  getLatestWeights,
  getRateConfig,
  getWeightList,
  saveRateConfig,
  saveWeights,
} from "../weightManagementService";

import { showModal } from "@/global/utils/showModal";

const clampNumberInput = (value: string) => {
  if (value.trim() === "") return "";
  const n = Number(value);
  return Number.isFinite(n) ? value : "";
};

export function useWeightManagement() {

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);

  const [range, setRange] = useState<DateRange>("30D");

  const [items, setItems] = useState<WeightListItemUI[]>([]);
  const [total, setTotal] = useState(0);

  const [latest, setLatest] = useState<WeightWeightsLatest | null>(null);

  const [searchWeightInput, setSearchWeightInput] = useState<string>("");
  const [questionWeightInput, setQuestionWeightInput] = useState<string>("");

  const [rate, setRate] = useState<RateConfig>({
    initialSkillRate: 0,
    skillRateGrade1: 0,
    skillRateGrade2: 0,
    skillRateGrade3: 0,
    skillRateGrade4: 0,
    initialManagementRate: 0,
    managementRateGrade1: 0,
    managementRateGrade2: 0,
    managementRateGrade3: 0,
  });

  const pagerRef = useRef<HTMLUListElement | null>(null);
  const current = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

  const validateRates = useCallback(
    (r: RateConfig) => {
      const {
        initialSkillRate,
        skillRateGrade1: s1,
        skillRateGrade2: s2,
        skillRateGrade3: s3,
        skillRateGrade4: s4,
        initialManagementRate,
        managementRateGrade1: m1,
        managementRateGrade2: m2,
        managementRateGrade3: m3,
      } = r;

      const all = [
        initialSkillRate,
        s1,
        s2,
        s3,
        s4,
        initialManagementRate,
        m1,
        m2,
        m3,
      ];

      if (all.some((v) => Number.isNaN(v))) {
        showModal.alert("모든 값은 숫자여야 합니다.");
        return false;
      }

      if (!(s1 <= s2 && s2 <= s3 && s3 <= s4)) {
        showModal.alert("숙련도는 S1 ≤ S2 ≤ S3 ≤ S4 여야 합니다.");
        return false;
      }

      if (initialSkillRate < s1 || initialSkillRate > s4) {
        showModal.alert("숙련도 초기값은 S1 이상 S4 이하여야 합니다.");
        return false;
      }

      if (!(m1 <= m2 && m2 <= m3)) {
        showModal.alert("요구관리도는 M1 ≤ M2 ≤ M3 여야 합니다.");
        return false;
      }

      if (initialManagementRate < m1 || initialManagementRate > m3) {
        showModal.alert("요구관리도 초기값은 M1 이상 M3 이하여야 합니다.");
        return false;
      }

      return true;
    },
    []
  );

  const refresh = useCallback(async () => {
    try {
      const { items: listItems, total: totalCount } = await getWeightList({
        keyword,
        range,
        offset,
        limit,
      });

      const careCounts: CareCountsResponse = await getCareCounts();

      const merged: WeightListItemUI[] = listItems.map((m) => ({
        ...m,
        plantsNeedingAttention: careCounts[m.memberId] ?? 0,
      }));

      setItems(merged);
      setTotal(totalCount);
    } catch (e) {
      console.error(e);
    }
  }, [keyword, range, offset, limit]);

  const onPageChange = useCallback(
    (page: number) => {
      if (page < 1) return;
      const max = Math.max(1, Math.ceil(total / limit));
      if (page > max) return;
      setOffset((page - 1) * limit);
    },
    [total, limit]
  );

  usePaginator({
    containerRef: pagerRef,
    current,
    totalItems: total,
    pageSize: limit,
    onChange: onPageChange,
  });

  const onSearch = useCallback(() => {
    setKeyword(searchInput);
    setOffset(0);
  }, [searchInput]);

  const onChangeRange = useCallback((next: DateRange) => {
    setRange(next);
    setOffset(0);
  }, []);

  const onSaveWeights = useCallback(async () => {
    const sw = Number(searchWeightInput);
    const qw = Number(questionWeightInput);

    if (!Number.isFinite(sw) || !Number.isFinite(qw)) {
      showModal.alert("검색어/질문수 비중은 숫자여야 합니다.");
      return;
    }

    if (sw + qw !== 10) {
      showModal.alert("검색어 수 + 질문 수 합이 10이 되어야합니다.");
      return;
    }

    try {
      await saveWeights({
        searchWeight: sw / 10,
        questionWeight: qw / 10,
      });

      showModal.alert("숙련도 산정 비중이 저장되었습니다.");
      await refresh();
    } catch (e) {
      console.error(e);
      showModal.alert("저장 실패");
    }
  }, [searchWeightInput, questionWeightInput, refresh]);

  const onSaveRate = useCallback(async () => {
    const nextRate: RateConfig = {
      initialSkillRate: Number(rate.initialSkillRate),
      skillRateGrade1: Number(rate.skillRateGrade1),
      skillRateGrade2: Number(rate.skillRateGrade2),
      skillRateGrade3: Number(rate.skillRateGrade3),
      skillRateGrade4: Number(rate.skillRateGrade4),
      initialManagementRate: Number(rate.initialManagementRate),
      managementRateGrade1: Number(rate.managementRateGrade1),
      managementRateGrade2: Number(rate.managementRateGrade2),
      managementRateGrade3: Number(rate.managementRateGrade3),
    };

    if (!validateRates(nextRate)) return;

    try {
      await saveRateConfig(nextRate);
      showModal.alert("숙련도/요구관리도 구간이 저장되었습니다.");
    } catch (e) {
      console.error(e);
      showModal.alert("저장 중 오류가 발생했습니다.");
    }
  }, [rate, validateRates]);

  useEffect(() => {
    (async () => {
      try {
        const [latestRes, rateRes] = await Promise.all([
          getLatestWeights(),
          getRateConfig(),
        ]);

        setLatest(latestRes ?? null);

        if (latestRes) {
          setSearchWeightInput(String(Math.round(latestRes.searchWeight * 10)));
          setQuestionWeightInput(String(Math.round(latestRes.questionWeight * 10)));
        }

        if (rateRes) setRate(rateRes);
      } catch (e) {
        console.error("초기 로딩 실패", e);
      }
    })();
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    searchInput,
    setSearchInput,
    onSearch,

    range,
    onChangeRange,

    searchWeightInput,
    setSearchWeightInput: (v: string) => setSearchWeightInput(clampNumberInput(v)),
    questionWeightInput,
    setQuestionWeightInput: (v: string) => setQuestionWeightInput(clampNumberInput(v)),
    onSaveWeights,

    rate,
    setRate,
    onSaveRate,

    items,
    latest,

    pagerRef,
  };
}
