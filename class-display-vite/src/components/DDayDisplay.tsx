import { useNextEvent } from "../hooks/useNextEvent";

function getDDay(targetDate: string) {
  const today = new Date();
  const examDate = new Date(targetDate);
  const diff = Math.ceil(
    (examDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return diff - 1;
}

function DDayDisplay() {
  const exam = useNextEvent();

  const dateObj = new Date();
  const dateString = `${dateObj.getFullYear()}년 ${
    dateObj.getMonth() + 1
  }월 ${dateObj.getDate()}일`;
  const dateText = <p className="event-text">{dateString}</p>;

  let eventString;
  if (exam) {
    eventString = exam.name;
  } else {
    eventString = "예정된 행사 없음";
  }

  let dcounter: number;
  if (exam) {
    dcounter = getDDay(exam.date);
  } else {
    dcounter = 0;
  }

  const eventText = <p className="event-text">{eventString}</p>;

  let counterText = <p className="d-counter">{"D-" + dcounter}</p>;
  if (dcounter == 0) {
    counterText = <p className="d-counter">D-DAY</p>;
  }
  return (
    <>
      {dateText}
      {eventText}
      {counterText}
    </>
  );
}

export default DDayDisplay;
