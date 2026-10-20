import { useMemo } from 'react';
import { useI18n } from '../i18n/provider';

// 画廊样例文案表。
// 这些字符串会出现在组件内部（Alert 的 message、Tag 的文本、Descriptions 的 label 等），
// 对用户可见，因此统一走 i18n，避免画廊里出现未翻译的界面文案。
// 键的划分口径：
// - 状态词、控件名、导航词、弹层词属于界面文案，走本表；
// - 品牌名、SQL 关键字、列名、快捷键、数据标识符属于技术字面量，不翻译，保持原样。
// 已有产品词条能直接复用的（common.success / common.error 等）也列进来，
// 让画廊预览到的就是产品真实用词。
export const GALLERY_SAMPLE_TEXT_KEYS = {
  // 状态与结果
  success: 'common.success',
  error: 'common.error',
  warning: 'common.warning',
  loading: 'common.loading',
  ok: 'common.ok',
  disabled: 'gallery.sample.disabled',
  processing: 'gallery.sample.text.processing',
  info: 'gallery.sample.text.info',
  running: 'gallery.sample.text.running',
  failed: 'gallery.sample.text.failed',
  connected: 'gallery.sample.text.connected',
  pending: 'gallery.sample.text.pending',
  default: 'gallery.sample.text.default',
  saved: 'gallery.sample.text.saved',
  noData: 'gallery.sample.text.no_data',
  done: 'gallery.sample.text.done',
  operationDone: 'gallery.sample.text.operation_done',
  plain: 'gallery.sample.text.plain',
  left: 'gallery.sample.text.left',

  // 表单控件
  input: 'gallery.sample.text.input',
  password: 'gallery.sample.text.password',
  textArea: 'gallery.sample.text.text_area',
  inputNumber: 'gallery.sample.text.input_number',
  autoComplete: 'gallery.sample.text.auto_complete',
  treeSelect: 'gallery.sample.text.tree_select',
  cascader: 'gallery.sample.text.cascader',
  checkbox: 'gallery.sample.text.checkbox',
  indeterminate: 'gallery.sample.text.indeterminate',
  radio: 'gallery.sample.text.radio',

  // 导航结构
  tables: 'gallery.sample.text.tables',
  views: 'gallery.sample.text.views',
  procedures: 'gallery.sample.text.procedures',
  table: 'gallery.sample.text.table',
  json: 'gallery.sample.text.json',
  text: 'gallery.sample.text.text',
  home: 'gallery.sample.text.home',
  library: 'gallery.sample.text.library',
  data: 'gallery.sample.text.data',
  option: 'gallery.sample.text.option',
  subOption: 'gallery.sample.text.sub_option',
  connection: 'gallery.sample.text.connection',
  hostCredentials: 'gallery.sample.text.host_credentials',
  options: 'gallery.sample.text.options',
  advanced: 'gallery.sample.text.advanced',
  host: 'gallery.sample.text.host',
  port: 'gallery.sample.text.port',
  user: 'gallery.sample.text.user',
  database: 'gallery.sample.text.database',
  panelHeader: 'gallery.sample.text.panel_header',
  panelBody: 'gallery.sample.text.panel_body',
  secondPanel: 'gallery.sample.text.second_panel',
  secondBody: 'gallery.sample.text.second_body',
  cardTitle: 'gallery.sample.text.card_title',
  cardBody: 'gallery.sample.text.card_body',
  day: 'gallery.sample.text.day',
  week: 'gallery.sample.text.week',
  month: 'gallery.sample.text.month',

  // 弹层
  modalBody: 'gallery.sample.text.modal_body',
  dragHint: 'gallery.sample.text.drag_hint',
  drawerBody: 'gallery.sample.text.drawer_body',
  tooltipText: 'gallery.sample.text.tooltip_text',
  popoverTitle: 'gallery.sample.text.popover_title',
  popoverContent: 'gallery.sample.text.popover_content',
  confirmQuestion: 'gallery.sample.text.confirm_question',
  yes: 'gallery.sample.text.yes',
  no: 'gallery.sample.text.no',
  action: 'gallery.sample.text.action',
  dangerAction: 'gallery.sample.text.danger_action',

  // 数据录入
  primaryKey: 'gallery.sample.text.primary_key',
  partitionKey: 'gallery.sample.text.partition_key',
  dailyOrderCount: 'gallery.sample.text.daily_order_count',
  revenueAmount: 'gallery.sample.text.revenue_amount',

  // AI
  draftSample: 'gallery.sample.text.draft_sample',
  thinkingSample: 'gallery.sample.text.thinking_sample',

  // 编辑器
  markdownSample: 'gallery.sample.text.markdown_sample',

  // 布局与排版
  layoutTitle: 'gallery.sample.text.layout_title',
  layoutSubtitle: 'gallery.sample.text.layout_subtitle',
  layoutParagraph: 'gallery.sample.text.layout_paragraph',
  layoutFooter: 'gallery.sample.text.layout_footer',
  layoutBadge: 'gallery.sample.text.layout_badge',
  layoutMenuOverview: 'gallery.sample.text.layout_menu_overview',
  layoutMenuReports: 'gallery.sample.text.layout_menu_reports',

  // 表单
  formUsername: 'gallery.sample.text.form_username',
  formEmail: 'gallery.sample.text.form_email',
  formPassword: 'gallery.sample.text.form_password',
  formConfirm: 'gallery.sample.text.form_confirm',
  formNote: 'gallery.sample.text.form_note',
  formSubmit: 'gallery.sample.text.form_submit',
  formReset: 'gallery.sample.text.form_reset',
  formAddItem: 'gallery.sample.text.form_add_item',
  formRemoveItem: 'gallery.sample.text.form_remove_item',
  formUsernamePlaceholder: 'gallery.sample.text.form_username_placeholder',
  formEmailPlaceholder: 'gallery.sample.text.form_email_placeholder',
  formPasswordPlaceholder: 'gallery.sample.text.form_password_placeholder',
  formNotePlaceholder: 'gallery.sample.text.form_note_placeholder',
  formMentionPlaceholder: 'gallery.sample.text.form_mention_placeholder',
  formUploadHint: 'gallery.sample.text.form_upload_hint',
  formUploadLimit: 'gallery.sample.text.form_upload_limit',
  formRequiredError: 'gallery.sample.text.form_required_error',
  formEmailError: 'gallery.sample.text.form_email_error',
  formPasswordError: 'gallery.sample.text.form_password_error',
  formMismatchError: 'gallery.sample.text.form_mismatch_error',

  // 数据展示
  listTitle: 'gallery.sample.text.list_title',
  listDesc: 'gallery.sample.text.list_desc',
  statisticTotal: 'gallery.sample.text.statistic_total',
  statisticVisits: 'gallery.sample.text.statistic_visits',
  statisticGrowth: 'gallery.sample.text.statistic_growth',
  statisticConversion: 'gallery.sample.text.statistic_conversion',
  timelineConnect: 'gallery.sample.text.timeline_connect',
  timelineExecute: 'gallery.sample.text.timeline_execute',
  timelineReturn: 'gallery.sample.text.timeline_return',
  transferAvailable: 'gallery.sample.text.transfer_available',
  transferSelected: 'gallery.sample.text.transfer_selected',
  tableSummary: 'gallery.sample.text.table_summary',
  tableExpand: 'gallery.sample.text.table_expand',
  tableFilterRegion: 'gallery.sample.text.table_filter_region',

  // 媒体与浮层
  mediaCaption: 'gallery.sample.text.media_caption',
  mediaSlideSubtitle: 'gallery.sample.text.media_slide_subtitle',
  mediaWatermark: 'gallery.sample.text.media_watermark',
  mediaTourTitle: 'gallery.sample.text.media_tour_title',
  mediaTourDesc: 'gallery.sample.text.media_tour_desc',
  mediaFloatHint: 'gallery.sample.text.media_float_hint',

  // 图表
  chartOrders: 'gallery.sample.text.chart_orders',
  chartRevenue: 'gallery.sample.text.chart_revenue',
  chartConversion: 'gallery.sample.text.chart_conversion',
  chartShare: 'gallery.sample.text.chart_share',

  // 图与拖拽
  graphScan: 'gallery.sample.text.graph_scan',
  graphFilter: 'gallery.sample.text.graph_filter',
  graphAggregate: 'gallery.sample.text.graph_aggregate',
  graphSort: 'gallery.sample.text.graph_sort',
  graphSortHint: 'gallery.sample.text.graph_sort_hint',
  graphColumn: 'gallery.sample.text.graph_column',
  graphContainer: 'gallery.sample.text.graph_container',

  // 富文本与工具
  richMarkdown: 'gallery.sample.text.rich_markdown',
  richCode: 'gallery.sample.text.rich_code',
  richMermaid: 'gallery.sample.text.rich_mermaid',
  richZip: 'gallery.sample.text.rich_zip',
  richSanitized: 'gallery.sample.text.rich_sanitized',
  richSql: 'gallery.sample.text.rich_sql',
} as const;

export type GallerySampleTextKey = keyof typeof GALLERY_SAMPLE_TEXT_KEYS;

export type GallerySampleText = Record<GallerySampleTextKey, string>;

// 一次性拿到全部样例文案。集中在一个 hook 里，分区文件只关心用哪几个词，
// 不用各自去拼 i18n 键名。
export const useSampleText = (): GallerySampleText => {
  const { t } = useI18n();
  return useMemo(() => {
    const result = {} as Record<GallerySampleTextKey, string>;
    for (const key of Object.keys(GALLERY_SAMPLE_TEXT_KEYS) as GallerySampleTextKey[]) {
      result[key] = t(GALLERY_SAMPLE_TEXT_KEYS[key]);
    }
    return result;
  }, [t]);
};
