import {
  defaultTokenGroup, MessageName, MessageRequest,
} from "../../../shared/index";
import { colors, typography } from "../../../shared/styles";
import header from "../../components/header";
import bounceBack from "../../utils/postMessagePromise";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useSyncedState,
  useWidgetId,
  useEffect,
  Rectangle
} = widget;

export default function componentsSatellite() {
  const nodeId = useWidgetId();

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [componentInitialized, setComponentInitialized] = useSyncedState(
    'componentInitialized',
    false
  );

  useEffect(() => {
    if (!componentInitialized) {
      setComponentInitialized(true);
      // first run ever
    }
  });

  useEffect(() => {
    const onMessageHandler = async (message: any) => {
      switch (message.name) {
        case MessageName.promiseBounce :
            switch (message.request) {
              case MessageRequest.getComponentList :
                let components: {name:string, value:string}[] = [];
                figma.skipInvisibleInstanceChildren = true;
                figma.root.children.map((page: PageNode) => {
                  const pageComponentNodes = page.findAllWithCriteria({
                    types: ['COMPONENT_SET', 'COMPONENT']
                  });
                  pageComponentNodes.map(node => {
                    if (
                      node.type === 'COMPONENT' &&
                      node.parent &&
                      node.parent.type === 'COMPONENT_SET') {
                      return
                    }
                    components.push({
                      name: node.name,
                      value: node.id,
                    })
                  })
                });
                bounceBack(message, {components});
                break;
            }
      }
    };
    figma.ui.on('message', onMessageHandler);
    return () => figma.ui.off('message', onMessageHandler);
  });

  return (
    <AutoLayout 
        name="base-page"
        height="hug-contents"
        width="fill-parent"
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        spacing={24}
        overflow="visible">
        {header(
          () => {
            setComponentInitialized(false);
          },
          () => {
            
          }
        )}
        <AutoLayout 
          height="hug-contents"
          direction="vertical"
          width="fill-parent"
          horizontalAlignItems="center"
          verticalAlignItems="center"
          spacing={0}
          padding={{
            top: 0, bottom: 20,
            left: 20, right: 20
          }}
          overflow="visible">
          <AutoLayout 
            height="hug-contents"
            direction="vertical"
            width="fill-parent"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            spacing={0}
            padding={{
              top: 10, bottom: 10,
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
              No Component Token
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
  );
}

