import { 
  MessageTypes,
} from "../shared/types/types";
import designSystem from "./designTokens";
import modelUpdate from "./actions/modelUpdate";
const { widget } = figma;
const { useEffect } = widget;

function Widget() {

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      if (message.name === MessageTypes.modelUpdate) {
        modelUpdate(
          message.designTokensModel,
          message.tokenset
        );
      }else if (message.name === MessageTypes.modelUpdateAndClose) {
        // setDesignTokensModel(message.designTokensModel);
        figma.closePlugin();
      }
    }
  })

  return designSystem();
}
widget.register(Widget);
