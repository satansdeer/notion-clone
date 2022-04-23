import { useState } from "react"


export const CommandPanel = ({selectItem}: any) => {
	const [ selectedItem, setSelectedItem ] = useState(null)

	return <div className="command-panel">
		<div className="command-panel-title">Blocks</div>
		<ul>
			<li onClick={selectItem}>Text</li>
			<li>List</li>
			<li>Heading 1</li>
			<li>Image</li>
			<li>Emoji</li>
			<li>Page</li>
		</ul>
	</div>
}
