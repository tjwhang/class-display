import { useState, type MouseEventHandler } from "react";

interface Props {
  items: string[];
  heading: string;
  //   onclick: MouseEventHandler;
}

function ListGroup(props: Props) {
  //   const [selecedIndex, setSelectedIndex] = useState(-1);

  const noItemMessage = props.items.length == 0 && <p>No items found.</p>;
  const list = (
    <>
      <h1>{props.heading}</h1>
      {noItemMessage}
      <ul className="list-group">
        {props.items.map((item, index) => (
          <li
            className={
              //   selecedIndex == index
              //     ? "list-group-item active"
              //     : "list-group-item"
              "list-group-item"
            }
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
