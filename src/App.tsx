import { useState, useRef } from "react";

const initialState = [
  {
    type: "paragraph",
    value: "Test paragraph",
		id: Date.now()
  },
];

const renderNode = ({ type, value }: any, onKeyPress: any, refFunc: any) => {
  switch (type) {
    case "paragraph": {
      return (
        <p ref={refFunc} onKeyPress={onKeyPress} contentEditable="true">
          {value}
        </p>
      );
    }
  }
};

function App() {
  const [nodes, setNodes] = useState(initialState);
	const nodeIdToFocusRef = useRef<any>(null)
	const nodesRef = useRef<any>({})

	const onKeyPress = (event: any) => {
		if(event.key === "Enter"){
			const id = Date.now()
			nodeIdToFocusRef.current = id;
			setNodes(oldNodes => [...oldNodes, {type: "paragraph", value: "", id}])
		}
	}

	const onRef = (nodeId: any) => (el: any) => {
		nodesRef.current[nodeId] = el
		if(nodeId === nodeIdToFocusRef.current) {
			el.focus()
			nodeIdToFocusRef.current = null;
		}
	}

  return (
    <>
      {nodes.map((node) => {
        return renderNode(node, onKeyPress, onRef(node.id));
      })}
    </>
  );
}

export default App;
