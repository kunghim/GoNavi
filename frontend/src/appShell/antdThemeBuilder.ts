import { theme } from 'antd';
import { APP_OVERLAY_Z_INDEX_BASE } from '../utils/overlayZIndex';
import type { CustomThemeAntTokens } from '../utils/customTheme';

// Ant Design 主题配置的构建输入。
// 该结构刻意只保留「纯值」，不持有任何 App 状态引用：主应用与组件画廊
// （frontend/src/gallery）共用同一份构建逻辑，避免两处各写一套 token 映射后
// 随主题演进互相漂移。
export type AntdThemeBuildInput = {
  darkMode: boolean;
  customThemeAntTokens: CustomThemeAntTokens;
  effectiveOpacity: number;
  fontFamily: string;
  fontFamilyCode: string;
  fontSize: number;
  fontSizeSM: number;
  fontSizeLG: number;
  controlHeight: number;
  controlHeightSM: number;
  controlHeightLG: number;
  // 低配档位 / 减少动画时置 false，关闭 antd 全部过渡与动画。
  motionEnabled: boolean;
};

// 主色与主色浅底的解析口径。主应用除 ConfigProvider 外还有别处要读这两个值
// （例如按钮配色、遮罩背景），单独导出避免各写一份回退后互相漂移。
export const resolveAntdPrimaryColor = (
  customThemeAntTokens: CustomThemeAntTokens,
  darkMode: boolean,
): string => customThemeAntTokens.primary ?? (darkMode ? '#22c55e' : '#16a34a');

export const resolveAntdPrimaryBgColor = (
  customThemeAntTokens: CustomThemeAntTokens,
  darkMode: boolean,
): string => customThemeAntTokens.primaryBg ?? (darkMode ? 'rgba(34, 197, 94, 0.20)' : '#dcfce7');

// buildAntdTheme 把「主题态」翻译成 antd 的 ConfigProvider 配置。
// 返回类型刻意不写死成 antd 的 ThemeConfig：antd 5 的组件级 token 结构较宽，
// 写死后主应用侧的既有推导会被迫跟着变窄。保持推导即可。
export const buildAntdTheme = ({
  darkMode,
  customThemeAntTokens,
  effectiveOpacity,
  fontFamily,
  fontFamilyCode,
  fontSize,
  fontSizeSM,
  fontSizeLG,
  controlHeight,
  controlHeightSM,
  controlHeightLG,
  motionEnabled,
}: AntdThemeBuildInput) => {
  const v2AntPrimaryColor = resolveAntdPrimaryColor(customThemeAntTokens, darkMode);
  const v2AntPrimaryContrastColor = customThemeAntTokens.primaryContrast ?? '#ffffff';
  const v2AntPrimaryHoverColor = customThemeAntTokens.primaryHover ?? (darkMode ? '#4ade80' : '#15803d');
  const v2AntPrimaryActiveColor = customThemeAntTokens.primaryActive ?? (darkMode ? '#16a34a' : '#166534');
  const v2AntPrimaryBgColor = resolveAntdPrimaryBgColor(customThemeAntTokens, darkMode);
  const v2AntPrimaryBgHoverColor = customThemeAntTokens.primaryBgHover ?? (darkMode ? 'rgba(34, 197, 94, 0.28)' : '#bbf7d0');
  const v2AntPrimaryBorderColor = customThemeAntTokens.primaryBorder ?? (darkMode ? 'rgba(34, 197, 94, 0.42)' : '#86efac');
  const v2AntPrimaryBorderHoverColor = customThemeAntTokens.primaryBorderHover ?? (darkMode ? 'rgba(74, 222, 128, 0.58)' : '#4ade80');
  const v2AntControlActiveBg = customThemeAntTokens.controlActiveBg ?? (darkMode ? 'rgba(34, 197, 94, 0.16)' : 'rgba(34, 197, 94, 0.10)');
  const v2AntControlActiveHoverBg = customThemeAntTokens.controlActiveHoverBg ?? (darkMode ? 'rgba(34, 197, 94, 0.24)' : 'rgba(34, 197, 94, 0.16)');
  const v2AntControlOutline = customThemeAntTokens.controlOutline ?? (darkMode ? 'rgba(34, 197, 94, 0.42)' : 'rgba(22, 163, 74, 0.22)');
  const v2AntBgContainer = customThemeAntTokens.bgContainer;
  const v2AntBgElevated = customThemeAntTokens.bgElevated;
  const v2AntFillAlter = customThemeAntTokens.fillAlter;
  const v2AntTextPrimary = customThemeAntTokens.textPrimary;
  const v2AntTextSecondary = customThemeAntTokens.textSecondary;
  const v2AntBorder = customThemeAntTokens.border;
  const v2AntRowHoverBg = customThemeAntTokens.rowHoverBg;
  const v2AntInfoColor = customThemeAntTokens.info ?? v2AntPrimaryColor;

  return {
    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      fontSize,
      fontSizeSM,
      fontSizeLG,
      fontFamily,
      fontFamilyCode,
      zIndexPopupBase: APP_OVERLAY_Z_INDEX_BASE,
      controlHeight,
      controlHeightSM,
      controlHeightLG,
      colorBgLayout: 'transparent',
      colorBgContainer: v2AntBgContainer ?? (darkMode
        ? `rgba(29, 29, 29, ${effectiveOpacity})`
        : `rgba(255, 255, 255, ${effectiveOpacity})`),
      colorBgElevated: v2AntBgElevated ?? (darkMode
        ? '#1f1f1f'
        : '#ffffff'),
      colorFillAlter: v2AntFillAlter ?? (darkMode
        ? `rgba(38, 38, 38, ${effectiveOpacity})`
        : `rgba(250, 250, 250, ${effectiveOpacity})`),
      ...(v2AntTextPrimary ? { colorText: v2AntTextPrimary } : {}),
      ...(v2AntTextSecondary ? { colorTextSecondary: v2AntTextSecondary } : {}),
      ...(v2AntBorder ? {
        colorBorder: v2AntBorder,
        colorBorderSecondary: v2AntBorder,
      } : {}),
      colorPrimary: v2AntPrimaryColor,
      colorTextLightSolid: v2AntPrimaryContrastColor,
      colorPrimaryHover: v2AntPrimaryHoverColor,
      colorPrimaryActive: v2AntPrimaryActiveColor,
      colorInfo: v2AntInfoColor,
      colorLink: v2AntPrimaryColor,
      colorLinkHover: v2AntPrimaryHoverColor,
      colorLinkActive: v2AntPrimaryActiveColor,
      motion: motionEnabled,
      colorPrimaryBg: v2AntPrimaryBgColor,
      colorPrimaryBgHover: v2AntPrimaryBgHoverColor,
      colorPrimaryBorder: v2AntPrimaryBorderColor,
      colorPrimaryBorderHover: v2AntPrimaryBorderHoverColor,
      controlItemBgActive: v2AntControlActiveBg,
      controlItemBgActiveHover: v2AntControlActiveHoverBg,
      controlOutline: v2AntControlOutline,
    },
    components: {
      Layout: {
        bodyBg: 'transparent',
        headerBg: 'transparent',
        siderBg: 'transparent',
        triggerBg: 'transparent',
      },
      Table: {
        headerBg: 'transparent',
        rowHoverBg: v2AntRowHoverBg
          ?? (darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.02)'),
      },
      Tabs: {
        cardBg: 'transparent',
        itemActiveColor: v2AntPrimaryHoverColor,
        itemHoverColor: v2AntPrimaryHoverColor,
        itemSelectedColor: v2AntPrimaryColor,
        inkBarColor: v2AntPrimaryColor,
      },
    },
  };
};
