import {
  defaultTokenGroup,
  MessageRequest,
} from "../../../shared/index";
import { MessageName } from "../../../shared/index";
import { colors, typography } from "../../../shared/styles";
import header from "../../components/header";
import refreshLayout from "./layout/refreshLayout";
import { sizing } from "../../../shared/styles";
import addIcon from "./newIcon/addIcon";
import {
  pullTokensFromIconComponentSet
} from "./iconComponentUtils";
import bounceBack from "../../utils/postMessagePromise";
import addSvgAsIcon from "./newIcon/addSvgAsIcon";

const { widget } = figma;
const {
  AutoLayout,
  useSyncedState,
  Text,
  useWidgetId,
  useEffect,
  waitForTask,
} = widget;

export default function iconsSatellite() {

  const nodeId = useWidgetId();

  const [tokenGroup, setTokenGroup ] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [compSetHeight, setCompSetHeight] = useSyncedState(
    'compSetHeight',
    sizing.iconDisplaySize
  );

  const [, setWidgetWidth] = useSyncedState(
    'widgetWidth',
    sizing.defaultWidgetWidth
  );

  const [iconsInitialized, setIconsInitialized] = useSyncedState(
    'iconsInitialized',
    false
  );

  useEffect(() => {
    const logSelection = () => {
      console.log('figma.currentPage.selection', figma.currentPage.selection);
    }
    figma.on('selectionchange', logSelection)
    return () => figma.off('selectionchange', logSelection)
  })

  useEffect(() => {
    if (!iconsInitialized) {
      setIconsInitialized(true);
      waitForTask(
        pullTokensFromIconComponentSet(
          tokenGroup, setTokenGroup, nodeId
        )
      );
    }
  });

  useEffect(() => {
    const onMessageHandler = (message: any) => {
      switch (message.name) {
        case MessageName.promiseBounce :
            switch (message.request) {
              case MessageRequest.createIconFromSVG :
                (async () => {
                  const result = await addSvgAsIcon(
                    message.svg,
                    message.fileName,
                    nodeId,
                  );
                  refreshLayout(
                    nodeId,
                    tokenGroup,
                    setCompSetHeight,
                    setWidgetWidth
                  );
                  bounceBack(message, result);
                })();
            }
      }
    };
    figma.ui.on('message', onMessageHandler);
    return () => figma.ui.off('message', onMessageHandler);
  });

  if (tokenGroup.name) {
    return (
      <AutoLayout 
        name="base-page"
        width="fill-parent"
        height={
          sizing.headerHeight + 
          (sizing.iconSpacing*2) +
          compSetHeight - 15 // some slop from somewhere?
        }
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="start"
        overflow="visible">
        {header(
          async () => {
            const start = new Date();
            refreshLayout(
              nodeId,
              tokenGroup,
              setCompSetHeight,
              setWidgetWidth
            );
            await pullTokensFromIconComponentSet(
              tokenGroup, setTokenGroup, nodeId
            );
            const end = new Date();
            console.log(
              end.getTime() - start.getTime(),
            );
          },
          undefined,
          async () => {
            await addIcon(nodeId);
            refreshLayout(
              nodeId,
              tokenGroup,
              setCompSetHeight,
              setWidgetWidth
            );
          }
        )}
        <AutoLayout 
            height="hug-contents"
            direction="vertical"
            width="fill-parent"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            overflow="visible">
          </AutoLayout>
      </AutoLayout>
    );
  }else{
    return (
      <AutoLayout 
        name="base-page"
        width="fill-parent"
        height={
          sizing.headerHeight + 
          (sizing.iconSpacing*2) + 
          sizing.iconDisplaySize
        }
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="start"
        spacing={16}
        overflow="visible">
        {header()}
        <AutoLayout 
            height="hug-contents"
            direction="vertical"
            width="fill-parent"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            spacing={0}
            padding={{
              top: 20, bottom: 20,
              left: 20, right: 20
            }}
            overflow="visible">
            <Text
              fontFamily={typography.primaryFont}
              fontWeight="light"
              fontSize={18}
              width="hug-contents"
              horizontalAlignText="center"
              fill={colors.textColorLightest}>
              Icon Tokens Not Found
            </Text>
          </AutoLayout>
      </AutoLayout>
    );
  }
}