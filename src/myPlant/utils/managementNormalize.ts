import type { PlantVm } from "@/myPlant/types/myPlantManagement";
import { addDays, daysBetween } from "./managementDate";

export function normalizePlant(r: any): PlantVm {
    const createdAt = r.createdAt ?? null;
    const startAt = r.startAt ?? null;
    const endDate = r.endDate ?? null;

    const interval = Number(r.interval) || 0;
    const baseForNext = endDate || startAt;
    const nextWaterAtDate = interval > 0 ? addDays(baseForNext, interval) : null;

    return {
        id: Number(r.myplantId ?? r.id ?? 0),
        name: String(r.name ?? ""),
        type: String(r.type ?? ""),
        soil: String(r.soil ?? ""),
        temperature: String(r.temperature ?? ""),
        img: String(r.imageUrl ?? r.img ?? ""),
        fileId: r.imageId == null ? null : Number(r.imageId),
        createdAt,
        startAt,
        endDate,
        interval,
        daysSinceCreated: daysBetween(createdAt),
        daysSinceLastWater: daysBetween(endDate),
        nextWaterAt: nextWaterAtDate ? nextWaterAtDate.toISOString() : null,
        totalCount: r.totalCount == null ? undefined : Number(r.totalCount),
    };
}
