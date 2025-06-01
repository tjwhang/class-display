import React, { useEffect, useState } from "react";

interface StudentSelectorProps {
  onSelect: (classId: string, studentId: string) => void;
  onlyClass?: string;
}

export default function StudentSelector({
  onSelect,
  onlyClass,
}: StudentSelectorProps) {
  const [classOptions, setClassOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedClass, setSelectedClass] = useState(onlyClass || "");
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);

  // 반 목록 불러오기
  useEffect(() => {
    // always show all classes, ignore onlyClass for dropdown
    fetch("/api/students/all")
      .then((res) => res.json())
      .then((data) => {
        const options = Object.keys(data).map((classId) => ({
          value: classId,
          label: classId + "반",
        }));
        setClassOptions(options);
        // If onlyClass is set, default to it, else first class
        if (onlyClass) setSelectedClass(onlyClass);
      });
  }, [onlyClass]);

  // 학생 목록 불러오기
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    fetch(`/api/students/${selectedClass}`)
      .then((res) => res.json())
      .then((data) => {
        // 학번 오름차순 정렬
        const arr = Object.entries(data)
          .map(([id, name]) => ({ id, name: String(name) }))
          .sort((a, b) => Number(a.id) - Number(b.id));
        setStudents(arr);
      });
  }, [selectedClass]);

  return (
    <div className="student-selector">
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        aria-label="반 선택"
        // disabled={!!onlyClass} // allow all classes
      >
        <option value="">반 선택</option>
        {classOptions.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <div className="student-list-panel">
        <ul>
          {students.length === 0 && <li className="no-student">학생 없음</li>}
          {students.map((s) => (
            <li key={s.id} onClick={() => onSelect(selectedClass, s.id)}>
              {`${s.id} ${s.name}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
