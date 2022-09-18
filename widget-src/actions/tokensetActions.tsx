import { DesignTokensModel } from "../../shared/types/types";

export function findWidgetTokenset(
  nodeId: string,
  designTokensModel: DesignTokensModel
) {
  if (!designTokensModel) return;

  if (!designTokensModel.tokensets) {
    designTokensModel.tokensets = [];
  }
  const tokenset = designTokensModel.tokensets.find(tokenset => {
    return tokenset.nodeId === nodeId;
  })
  return tokenset;
}