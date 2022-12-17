import {
  defaultTokenGroup,
  DSysComponentToken,
  MessageName,
  MessageRequest,
  SelectDropDown,
} from "../../../shared/index";
import {sizing} from "../../../shared/styles";
import header from "../../components/header";
import bounceBack from "../../utils/postMessagePromise";
import { getSvg } from "../icons/iconComponentUtils";
import focusOnComponent from "./actions/focusOnComponent";
import updateComponentName from "./actions/updateComponentName";
import noComponent from "./noComponent";

const { widget } = figma;
const {
  AutoLayout,
  useSyncedState,
  useEffect,
  SVG,
  useWidgetId,
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

  const [componentImage, setComponentImage] = useSyncedState(
    'componentImage',
    ''
  );

  const [, setWidgetWidth] = useSyncedState(
    'widgetWidth', sizing.defaultWidgetWidth
  );

  useEffect(() => {
    if (!componentInitialized) {
      setComponentInitialized(true);

      // first run
      if (tokenGroup && tokenGroup.tokensets.length > 0) {
        (async () => {
          const tokenset = tokenGroup.tokensets[0];
          const componentInfo = tokenset.component as DSysComponentToken;
          let node = figma.getNodeById(componentInfo.$value)as
            ComponentNode | ComponentSetNode;
          if (node) {
            const errorLog: string[] = [];
            if (
              node.type === 'COMPONENT_SET' &&
              ( node.width > 1000 || node.height > 1000 ) &&
              node.children && node.children.length > 0
            ) {
              node = node.children[0] as ComponentNode;
            }
            const svg = await getSvg(node, errorLog);
            if (svg) {
              setComponentImage(svg);
              const nodeWidthWithPadding = node.width + 40;
              if (nodeWidthWithPadding > sizing.defaultWidgetWidth) {
                setWidgetWidth(nodeWidthWithPadding);
              }else{
                setWidgetWidth(sizing.defaultWidgetWidth);
              }
            }else{
              setComponentImage('');
              setWidgetWidth(sizing.defaultWidgetWidth);
            }

            if (tokenGroup.name !== node.name) {
              updateComponentName(
                tokenGroup,
                node.name,
                setTokenGroup,
              )
            }
          }
        })();
      }
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
                  const optSet: SelectDropDown = {
                    name: page.name,
                    value: page.id,
                    children: [],
                  }
                  components.push(optSet);
                  pageComponentNodes.map(node => {
                    if (
                      node.type === 'COMPONENT' &&
                      node.parent &&
                      node.parent.type === 'COMPONENT_SET') {
                      return
                    }
                    optSet.children?.push({
                      name: node.name,
                      value: node.id,
                    });
                  })
                });
                figma.skipInvisibleInstanceChildren = false;
                bounceBack(message, {components});
                break;
              case MessageRequest.refreshTokensFromStyles :
                setComponentInitialized(false);
                bounceBack(message, {});
                break;
              case MessageRequest.focusOnComponent :
                focusOnComponent(tokenGroup);
                bounceBack(message, {});
                break;
              case MessageRequest.focusOnComponentToken :
                let node = figma.getNodeById(nodeId);
                if (node) {
                  let page = node.parent;
                  while (page && (page.type !== 'PAGE')) {
                    page = page.parent;
                  }
                  if (page) figma.currentPage = page;
                  figma.viewport.scrollAndZoomIntoView([node]);
                }
                bounceBack(message, {});
                break;
                
            }
      }
    };
    figma.ui.on('message', onMessageHandler);
    return () => figma.ui.off('message', onMessageHandler);
  });

  if (tokenGroup && tokenGroup.tokensets.length > 0) {
    return (
      <AutoLayout 
        name="base-page"
        height="hug-contents"
        width="fill-parent"
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
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
            top: 20, bottom: 20,
            left: 40, right: 40
          }}
          overflow="visible"
          onClick={() => {
            focusOnComponent(tokenGroup);
          }}>
          {componentImage ? (
            <SVG src={componentImage} />
          ) : null}
        </AutoLayout>
      </AutoLayout>
    );
  }
  
  return (
    noComponent(setComponentInitialized)
  );
}

