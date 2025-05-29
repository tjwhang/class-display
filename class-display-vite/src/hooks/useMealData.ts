import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_NEIS_API_KEY;
const NEIS_REGION_CODE = import.meta.env.VITE_NEIS_REGION_CODE;
const SCHOOL_CODE = import.meta.env.VITE_NEIS_SCHOOL_CODE;

export function useMealData(date: string, mealCode: number) {
  const [meals, setMeals] = useState<string[]>([]);
  useEffect(() => {
    fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${NEIS_REGION_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${date}&MMEAL_SC_CODE=${mealCode}`)
      .then(res => res.json())
      .then(data => {
        const dishes = data?.mealServiceDietInfo?.[1]?.row?.[0]?.DDISH_NM?.split("<br/>") ?? [];
        // Remove allergy info in parentheses, e.g., (2.5.6.8.10.12.13.16.18)
        for (let i = 0; i < dishes.length; i++) {
          dishes[i] = dishes[i].replace(/\([^)]*\)/g, "").trim();
        }
        setMeals(dishes);
      });
  }, [date]);
  return meals;
}