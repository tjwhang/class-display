// import { useState, type MouseEventHandler } from "react";

interface Props {
  items: string[];
  heading: string;
  //   onclick: MouseEventHandler;
}

function ListGroup(props: Props) {
  //   const [selecedIndex, setSelectedIndex] = useState(-1);

  const noItemMessage = props.items.length == 0 && <p>항목이 없습니다.</p>;
  const list = (
    <>
      <h1>{props.heading}</h1>
      {noItemMessage}
      <ul className="list-ul">
        {props.items.map((item) => (
          <li
            className={"list-item"}
            key={item}
            // onClick={() => {
            //   setSelectedIndex(index);
            // }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
  return list;
}

export default ListGroup;
