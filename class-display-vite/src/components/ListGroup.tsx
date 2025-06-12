// import { useState, type MouseEventHandler } from "react";

interface Props {
  items: string[];
  heading: string;
  isLoading?: boolean;
  error?: string | null;
}

function ListGroup(props: Props) {
  const { items, heading, isLoading, error } = props;
  let content;
  if (isLoading) {
    content = <li className="list-item loading">불러오는 중...</li>;
  } else if (error) {
    content = <li className="list-item error">{error}</li>;
  } else if (items.length === 0) {
    content = <li className="list-item">항목이 없습니다.</li>;
  } else {
    content = items.map((item) => (
      <li className="list-item" key={item}>
        {item}
      </li>
    ));
  }
  return (
    <>
      <div className="meal-heading">{heading}</div>
      <ul className="list-ul">{content}</ul>
    </>
  );
}

export default ListGroup;
