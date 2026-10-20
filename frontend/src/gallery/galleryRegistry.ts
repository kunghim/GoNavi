import type { ReactNode } from 'react';
import { aiSection } from './sections/AiSection';
import { basicsSection } from './sections/BasicsSection';
import { commonChartSection } from './sections/common/CommonChartSection';
import { commonDataSection } from './sections/common/CommonDataSection';
import { commonFormSection } from './sections/common/CommonFormSection';
import { commonGraphSection } from './sections/common/CommonGraphSection';
import { commonLayoutSection } from './sections/common/CommonLayoutSection';
import { commonMediaSection } from './sections/common/CommonMediaSection';
import { commonRichSection } from './sections/common/CommonRichSection';
import { dataSection } from './sections/DataSection';
import { editorSection } from './sections/EditorSection';
import { feedbackSection } from './sections/FeedbackSection';
import { formsSection } from './sections/FormsSection';
import { navigationSection } from './sections/NavigationSection';
import { overlaysSection } from './sections/OverlaysSection';
import { visualizationSection } from './sections/VisualizationSection';

// 画廊分区归组：
// - project：GoNavi 自有组件，体现产品实际形态。
// - common：通用组件（antd 5 控件面 + 栈内第三方库），作为通用参考手册。
export type GalleryGroupId = 'project' | 'common';

// 画廊条目：name 使用组件技术名（英文标识符），是设计系统文档的通用写法，
// 不属于需要翻译的界面文案；类目标题与说明走 i18n。
export type GalleryItemDef = {
  id: string;
  name: string;
  // 组件在仓库中的位置，便于对照源码。
  source?: string;
  // 画布类组件（图表、流程图、代码编辑器）需要整行宽度，预览时才不会被压缩。
  wide?: boolean;
  render: () => ReactNode;
};

export type GallerySectionDef = {
  id: string;
  group: GalleryGroupId;
  titleKey: string;
  descKey: string;
  items: GalleryItemDef[];
};

export const GALLERY_SECTIONS: readonly GallerySectionDef[] = [
  basicsSection,
  formsSection,
  feedbackSection,
  navigationSection,
  overlaysSection,
  dataSection,
  aiSection,
  visualizationSection,
  editorSection,
  commonLayoutSection,
  commonFormSection,
  commonDataSection,
  commonMediaSection,
  commonChartSection,
  commonGraphSection,
  commonRichSection,
];

export const findGallerySection = (id: string): GallerySectionDef | undefined => (
  GALLERY_SECTIONS.find((section) => section.id === id)
);
