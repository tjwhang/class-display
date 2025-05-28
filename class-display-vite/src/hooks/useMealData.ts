import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_NEIS_API_KEY;
const NEIS_REGION_CODE = import.meta.env.VITE_NEIS_REGION_CODE;
const SCHOOL_CODE = import.meta.env.VITE_NEIS_SCHOOL_CODE;

export function useMealData(date: string, mealCode: number) {
  const [meals, setMeals] = useState<string[]>([]);
  useEffect(() => {
    fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${NEIS_REGION_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${date}&MMEAL_SC_CODE=2`)
      .then(res => res.json())
      .then(data => {
        const dishes = data?.mealServiceDietInfo?.[1]?.row?.[0]?.DDISH_NM?.split("<br/>") ?? [];
        setMeals(dishes);
      });
  }, [date]);
  return meals;
}