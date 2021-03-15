

export function getExpandRange (shorter, longer, key) {
	const shorterStartIndex = shorter.findIndex(({ data }) => data.key === key)
	const shorterEndNode = shorter[shorterStartIndex + 1]
	const longerStartIndex = longer.findIndex(({ data }) => data.key === key)

	if (shorterEndNode) {
		const longerEndIndex = longer.findIndex(({ data }) => data.key === shorterEndNode.data.key)
		return longer.slice(longerStartIndex + 1, longerEndIndex)
	}
	return longer.slice(longerStartIndex + 1)
}
