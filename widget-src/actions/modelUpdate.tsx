import { TokenSetType } from '../../enums';
import { DesignSystemModel, TokenSet } from '../../types';
import { findBaseWidget, findWidget } from '../utils';
import { triggerBaseRefresh } from './baseActions';

export default function modelUpdate(designSystemModel: DesignSystemModel) {
  const baseWidget = findBaseWidget();
  if (baseWidget) {
    baseWidget.setWidgetSyncedState({
      ...baseWidget.widgetSyncedState,
      designSystemModel,
    });
    triggerBaseRefresh();
  }
}

export function changeTokenSetType(
  newTokenSetType: TokenSetType,
  nodeId: string,
  fromUI: boolean = false,
  setDesignSystemModel?: (newValue: DesignSystemModel | ((currValue: DesignSystemModel) => DesignSystemModel)) => void
) {
  const theBase = findBaseWidget();
  if (!theBase) return;

  const newDesignSystemModel = {
    ...theBase.widgetSyncedState.designSystemModel
  };
  const newTokensets = newDesignSystemModel.tokensets.map(
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
  newDesignSystemModel.tokensets = newTokensets;

  // setting local state first avoids error:
  // "Error: Scene has diverged from the expected state. figma" 
  if (setDesignSystemModel) {
    setDesignSystemModel(newDesignSystemModel);
  }
  
  // centralize change
  modelUpdate(newDesignSystemModel);

  // refresh the UI if there is one...
  if (fromUI) {
    figma.ui.postMessage({
      nodeId,
      designSystemModel: newDesignSystemModel
    });
  }
}