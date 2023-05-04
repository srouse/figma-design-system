import { defaultGlobalData } from "../../../shared/index";
import { colors } from "../../../shared/styles";
import { triggerAllWidgetRefresh } from "../../actions/baseActions";
import uuid from "../../utils/uuid";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  Input,
  useSyncedState,
} = widget;

export default function baseFirstRun() {

  const [globalData, setGlobalData] = useSyncedState(
    'globalData',
    defaultGlobalData
  );

  const [localGlobalData, setLocalGlobalData] = useSyncedState(
    'localGlobalData',
    {
      prefix: '',
      fullName: '',
    }
  );

  return (
    <AutoLayout
      direction="vertical"
      width="fill-parent"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      stroke={colors.borderDark}
      spacing={20}
      padding={{
        top: 40, bottom: 50,
        left: 50, right: 50,
      }}>
      <Text
        fontSize={12}
        fontWeight={400}
        width="fill-parent"
        fill={colors.textColorLighter}>
        FIGMA DESIGN SYSTEM TOKENS
      </Text>
      <AutoLayout
        direction="vertical"
        width="fill-parent"
        height="hug-contents"
        spacing={6}>
        <Text
          fontSize={14}
          fontWeight={400}
          fill={colors.textColor}
          onClick={() => console.log('pp')}>
          What is the name of your design system?
        </Text>
        <Input
          value={localGlobalData.fullName}
          fill={colors.textColor}
          width="fill-parent"
          placeholder={"My Design System"}
          inputFrameProps={{
            fill: colors.white,
            stroke: colors.borderGrey,
            cornerRadius: 4,
            padding: {
              top: 10, bottom: 10,
              left: 16, right: 16
            },
          }}
          onTextEditEnd={(evt) => {
            setLocalGlobalData({
              ...localGlobalData,
              fullName: evt.characters,
            });
          }}></Input>
      </AutoLayout>
      <AutoLayout
        direction="vertical"
        width="fill-parent"
        height="hug-contents"
        spacing={6}>
        <Text
          fontSize={14}
          fill={colors.textColor}
          fontWeight={400}>
          What would be a good three letter abbreviation?
        </Text>
        <Input
          value={localGlobalData.prefix}
          fill={colors.textColor}
          placeholder={"DSY"}
          width="fill-parent"
          inputFrameProps={{
            fill: colors.white,
            stroke: colors.borderGrey,
            cornerRadius: 4,
            padding: {
              top: 10, bottom: 10,
              left: 16, right: 16
            },
          }}
          onTextEditEnd={(evt) => {
            setLocalGlobalData({
              ...localGlobalData,
              prefix: evt.characters,
            });
          }}></Input>
      </AutoLayout>
      <AutoLayout
        direction="horizontal"
        width="fill-parent"
        fill={colors.primary}
        cornerRadius={4}
        padding={{
          top: 14, bottom: 14,
          left: 16, right: 16
        }}
        onClick={() => {
          if (
            !localGlobalData.fullName ||
            !localGlobalData.prefix
          ) {
            figma.notify('Full name and prefix required.');
            return;
          }
          const localFullName = localGlobalData.fullName;
          const localPrefix = localGlobalData.prefix;
          // in case we come back..zero out local
          setLocalGlobalData({
            prefix: '',
            fullName: '',
          });
          setGlobalData({
            ...globalData,
            fullName: localFullName,
            prefix: localPrefix,
            // uuid: uuid(), // added 2023-03-30
          });
          triggerAllWidgetRefresh();
        }}>
        <Text
          fill={colors.white}
          width="fill-parent"
          horizontalAlignText="center">
          Create
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}