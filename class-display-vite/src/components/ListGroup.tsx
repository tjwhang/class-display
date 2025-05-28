import { useState } from "react";

interface ListGroupProps {
	items: string[];
	heading: string;
}

function ListGroup(props: ListGroupProps) {
	const [selecedIndex, setSelectedIndex] = useState(-1);

	const noItemMessage = props.items.length == 0 && <p>No items found.</p>;
	const list = (
		<>
			<h1>급식표</h1>
			{noItemMessage}
			<ul className="list-group">
				{props.items.map((item, index) => (
					<li
						className={
							selecedIndex == index
								? "list-group-item active"
								: "list-group-item"
						}
						key={item}
						onClick={() => {
							setSelectedIndex(index);
						}}
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
