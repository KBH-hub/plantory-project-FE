// src/myPlant/hooks/useMyPlantList.ts
import { useEffect, useState } from "react";
import type { PlantVm, UseMyPlantListParams } from "@/myPlant/types/myPlantManagementType";
import { getMyPlantList } from "@/myPlant/services/myPlantManagementApi";
import { usePaginator } from "@/global/hooks/usePaginator";
import { normalizePlant } from "@/myPlant/utils/managementNormalize";

export function useMyPlantList({ keyword, limit, pagerRef }: UseMyPlantListParams) {
    const [totalCount, setTotalCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [items, setItems] = useState<PlantVm[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshByOffset = async (nextOffset: number) => {
        setLoading(true);
        try {
            const res = await getMyPlantList({ name: keyword.trim(), limit, offset: nextOffset });
            const rows = Array.isArray(res) ? res : [];
            const tc = Number(rows?.[0]?.totalCount ?? 0);

            setTotalCount(Number.isFinite(tc) ? tc : 0);
            setItems(rows.map(normalizePlant));
            setOffset(nextOffset);
        } catch {
            setTotalCount(0);
            setItems([]);
            setOffset(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshByOffset(0);
    }, []);

    usePaginator({
        containerRef: pagerRef,
        current: Math.floor(offset / limit) + 1,
        totalItems: Math.max(totalCount, 1),
        pageSize: limit,
        onChange: (page) => {
            const nextOffset = (page - 1) * limit;
            refreshByOffset(nextOffset);
        },
    });

    return { totalCount, offset, items, loading, refreshByOffset };
}
