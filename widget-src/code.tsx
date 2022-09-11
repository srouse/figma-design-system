import { 
  defaultDesignSystemModel
} from "../types";
import {
  MessageTypes
} from "../enums";
import designSystem from "./designSystem";
import modelUpdate, { changeTokenSetType } from "./actions/modelUpdate";
const { widget } = figma;
const { useEffect, useSyncedState } = widget;

function Widget() {

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      console.log("MESAGE", message);
      if (message.name === MessageTypes.modelUpdate) {
        modelUpdate(message.designSystemModel);
      }else if (message.name === MessageTypes.modelUpdateAndClose) {
        // setDesignSystemModel(message.designSystemModel);
        figma.closePlugin();
      }else if (message.name === MessageTypes.tokenSetTypeChange) {
        changeTokenSetType(
          message.newTokenSetType,
          message.nodeId,
          true,
        );
      }
    }
  })

  const [designSystemModel, setDesignSystemModel] = useSyncedState(
    'designSystemModel',
    defaultDesignSystemModel
  );

  return designSystem();
}
widget.register(Widget);
