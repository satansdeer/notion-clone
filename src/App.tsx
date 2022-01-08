import { useState } from "react";

const initialState = [
  {
    type: "paragraph",
    value: "Test paragraph",
  },
];

const renderNode = ({ type, value }: any, onKeyPress: any) => {
  switch (type) {
    case "paragraph": {
      return (
        <p onKeyPress={onKeyPress} contentEditable="true">
          {value}
        </p>
      );
    }
  }
};

function App() {
  const [nodes, setNodes] = useState(initialState);

	const onKeyPress = (event: any) => {
		if(event.key === "Enter"){
			setNodes(oldNodes => [...oldNodes, {type: "paragraph", value: ""}])
		}
	}

  return (
    <>
      {nodes.map((node) => {
        return renderNode(node, onKeyPress);
      })}
    </>
  );
}

export default App;
