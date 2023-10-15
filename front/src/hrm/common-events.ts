import { HandleID, NodeID } from "@/common";
import { State } from "./state";

export const releasePointerCapture = (e: any) => {
	e.target?.releasePointerCapture(e.pointerId);
};

export const addConnectionPointerEvents = (
	g: State,
	ref: any,
	nodeID: NodeID,
	handleID?: HandleID,
) => {
	ref.addEventListener("pointerenter", () => {
		const e = g.connectingEdge[0]();
		if (handleID === undefined && !e.isSource) return;
		g.setTempConnectingEnd(nodeID, ref, handleID);
	});
	ref.addEventListener("pointerdown", releasePointerCapture);
	ref.addEventListener("pointerleave", () => g.unsetTempConnectingEnd(ref));
	ref.addEventListener("pointerup", (e: any) => {
		g.finConnecting(nodeID, handleID);
		e.stopPropagation();
	});
};
