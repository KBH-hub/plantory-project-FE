import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard";
import { DashboardResponse } from "../types/dashboard";

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}