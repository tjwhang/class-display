import { useEffect, useState } from "react";

interface Exam {
  name: string;
  date: string; // "YYYY-MM-DD"
}

export function useNextEvent() {
  const [nextExam, setNextExam] = useState<Exam | null>(null);

  useEffect(() => {
    fetch("/events.json")
      .then(res => res.json())
      .then((exams: Exam[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시/분/초 0으로 맞춤
        const upcoming = exams
          .map(e => ({ ...e, dateObj: new Date(e.date) }))
          .filter(e => e.dateObj >= today) // 오늘 포함
          .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        if (upcoming.length > 0) setNextExam(upcoming[0]);
      });
  }, []);

  return nextExam;
}