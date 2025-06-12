import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_NEIS_API_KEY;
const NEIS_REGION_CODE = import.meta.env.VITE_NEIS_REGION_CODE;
const SCHOOL_CODE = import.meta.env.VITE_NEIS_SCHOOL_CODE;

export function useMealData(date: string, mealCode: number) {
  const [meals, setMeals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    setIsLoading(true);
    setError(null);
    setMeals([]);

    const fetchMeal = () => {
      fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${NEIS_REGION_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${date}&MMEAL_SC_CODE=${mealCode}`)
        .then(res => res.json())
        .then(data => {
          if (cancelled) return;
          const dishes = data?.mealServiceDietInfo?.[1]?.row?.[0]?.DDISH_NM?.split("<br/>") ?? [];
          for (let i = 0; i < dishes.length; i++) {
            dishes[i] = dishes[i].replace(/\([^)]*\)/g, "").trim();
          }
          setMeals(dishes);
          setIsLoading(false);
          setError(null);
        })
        .catch((err) => {
          if (cancelled) return;
          attempts++;
          if (attempts < 12) {
            setTimeout(fetchMeal, 10000);
          } else {
            setIsLoading(false);
            setError("불러오기 실패");
          }
        });
    };
    fetchMeal();
    return () => { cancelled = true; };
  }, [date, mealCode]);

  return { meals, isLoading, error };
}