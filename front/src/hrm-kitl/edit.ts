import {
	BetaNodeData,
	LambdaNodeData,
	NodeData,
	NodeType,
	PiNodeData,
	parseNodeData,
} from "@/common";

// Edit node data

export const makeEditedNodeData = (
	oldData: NodeData,
	newDataString: string,
): NodeData => {
	if (oldData.type === NodeType.Delta) {
		// In this case, string is just the delta data
		return {
			...oldData,
			comment: newDataString,
		};
	}
	// Otherwise, parse the string
	const newData = parseNodeData(newDataString);
	// Transfer some arguments
	if (oldData.type === newData.type) {
		switch (newData.type) {
			case NodeType.Beta:
				return {
					...newData,
					args: (oldData as BetaNodeData).args,
				};
			case NodeType.Pi:
				return {
					...newData,
					pat: (oldData as PiNodeData).pat,
				};
			case NodeType.Lambda:
				return {
					...newData,
					fallback: (oldData as LambdaNodeData).fallback,
					ret: (oldData as LambdaNodeData).ret,
				};
		}
	}
	return newData;
};
