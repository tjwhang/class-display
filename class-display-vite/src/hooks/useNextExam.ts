import { useEffect, useState } from "react";

interface Exam {
  name: string;
  date: string; // "YYYY-MM-DD"
}

export function useNextExam() {
  const [nextExam, setNextExam] = useState<Exam | null>(null);

  useEffect(() => {
    fetch("/exams.json")
      .then(res => res.json())
      .then((exams: Exam[]) => {
        const today = new Date();
        const upcoming = exams
          .map(e => ({ ...e, dateObj: new Date(e.date) }))
          .filter(e => e.dateObj >= today)
          .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        if (upcoming.length > 0) setNextExam(upcoming[0]);
      });
  }, []);

  return nextExam;
}