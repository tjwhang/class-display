import { useNextExam } from "../hooks/useNextExam";

function getDDay(targetDate: string) {
  const today = new Date();
  const examDate = new Date(targetDate);
  const diff = Math.ceil(
    (examDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

function DDayDisplay() {
  const exam = useNextExam();

  if (!exam) return <p>예정된 고사가 없습니다.</p>;

  let eventString;
  if (exam) {
    eventString = exam.name;
  } else {
    eventString = "예정된 고사 없음";
  }

  let dcounter;
  if (exam) {
    dcounter = `D - ${getDDay(exam.date)}`;
  } else {
    dcounter = "D - -1";
  }

  const eventText = <p className="event-text">{eventString}</p>;
  const counterText = <p className="d-counter">{"D - " + dcounter}</p>;
  return (
    <>
      {eventText}
      {counterText}
    </>
  );
}

export default DDayDisplay;
