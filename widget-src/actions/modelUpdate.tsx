
/*
export function changeTokenSetType(
  newTokenGroupType: DSysGroupType,
  nodeId: string,
  fromUI: boolean = false,
  setDesignTokensModel?: 
    (
      newValue: DesignTokensModel |
      ((currValue: DesignTokensModel) => DesignTokensModel)
    ) => void
) {
  const theBase = findBaseWidget();
  if (!theBase) return;

  const newDesignTokensModel = {
    ...theBase.widgetSyncedState.designTokensModel
  };
  const newTokensets = newDesignTokensModel.tokensets.map(
    (tokenset : TokenSet) => {
      if (tokenset.nodeId === nodeId) {
        const newTokenset = {...tokenset};
        newTokenset.type = newTokenSetType;
        return newTokenset;
      }else{
        return tokenset;
      }
    }
  );
  newDesignTokensModel.tokensets = newTokensets;

  // setting local state first avoids error:
  // "Error: Scene has diverged from the expected state. figma" 
  if (setDesignTokensModel) {
    setDesignTokensModel(newDesignTokensModel);
  }
  
  // centralize change
  modelUpdate(newDesignTokensModel);

  // refresh the UI if there is one...
  if (fromUI) {
    figma.ui.postMessage({
      nodeId,
      designTokensModel: newDesignTokensModel
    });
  }
}
*/