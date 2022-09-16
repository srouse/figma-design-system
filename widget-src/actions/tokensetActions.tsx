import { DesignSystemModel } from "../../shared/types/types";

export function findWidgetTokenset(
  nodeId: string,
  designSystemModel: DesignSystemModel
) {
  if (!designSystemModel) return;

  if (!designSystemModel.tokensets) {
    designSystemModel.tokensets = [];
  }
  const tokenset = designSystemModel.tokensets.find(tokenset => {
    return tokenset.nodeId === nodeId;
  })
  return tokenset;
}