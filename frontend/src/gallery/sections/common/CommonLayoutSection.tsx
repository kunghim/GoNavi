import React from 'react';
import {
  Affix, Badge, Button, Col, Divider, Flex, Input, Layout, Menu, Row, Space,
  Splitter, Tag, Tooltip, Typography,
} from 'antd';
import {
  AimOutlined, ApiOutlined, AppstoreOutlined, ArrowDownOutlined, ArrowLeftOutlined,
  ArrowRightOutlined, ArrowUpOutlined, BarChartOutlined, BellOutlined, BranchesOutlined,
  BulbOutlined, BuildOutlined, CalendarOutlined, CaretRightOutlined,
  CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, CloseCircleOutlined, CloseOutlined,
  CloudOutlined, CodeOutlined, CommentOutlined, CopyOutlined, CrownOutlined, DashboardOutlined,
  DatabaseOutlined, DeleteOutlined, DeploymentUnitOutlined, DownloadOutlined, EditOutlined,
  ExclamationCircleOutlined, ExpandOutlined, ExportOutlined, EyeInvisibleOutlined,
  EyeOutlined, FileOutlined, FileSearchOutlined, FileTextOutlined, FilterOutlined,
  FlagOutlined, FolderOpenOutlined, FolderOutlined, GiftOutlined, HeartOutlined,
  HistoryOutlined, HomeOutlined, ImportOutlined, InfoCircleOutlined, KeyOutlined,
  LineChartOutlined, LinkOutlined, LockOutlined, MailOutlined, MenuFoldOutlined,
  MenuOutlined, MenuUnfoldOutlined, MinusOutlined, MoreOutlined, NodeIndexOutlined,
  NotificationOutlined, PaperClipOutlined, PartitionOutlined, PhoneOutlined,
  PieChartOutlined, PlayCircleOutlined, PlusOutlined, PrinterOutlined, ProfileOutlined,
  PushpinOutlined, QrcodeOutlined, ReadOutlined, ReloadOutlined, RocketOutlined,
  SafetyOutlined, SaveOutlined, ScanOutlined, SearchOutlined, SettingOutlined,
  ShareAltOutlined, ShrinkOutlined, StarOutlined, TableOutlined, TagOutlined,
  TeamOutlined, ThunderboltOutlined, ToolOutlined, UploadOutlined, UnlockOutlined,
  UserOutlined, WarningOutlined,
} from '@ant-design/icons';
import { useI18n } from '../../../i18n/provider';
import { useSampleText } from '../../sampleText';
import type { GallerySectionDef } from '../../galleryRegistry';

// 通用布局分区：antd 5 的布局排版控件 + 常用图标集。
// 只做控件实景对照，不承载业务逻辑。

const GridCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      padding: '8px 12px',
      border: '1px solid var(--gn-br-2)',
      borderRadius: 6,
      background: 'var(--gn-bg-panel-2)',
    }}
  >
    {children}
  </div>
);

const LayoutDemo: React.FC = () => {
  const s = useSampleText();
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <Layout style={{ height: 260, borderRadius: 8, overflow: 'hidden' }}>
      <Layout.Header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <span>{s.layoutTitle}</span>
        <Badge status="success" text={s.layoutBadge} />
      </Layout.Header>
      <Layout hasSider>
        <Layout.Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={168}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['overview']}
            items={[
              { key: 'overview', label: s.layoutMenuOverview },
              { key: 'reports', label: s.layoutMenuReports },
              { type: 'divider' },
              { key: 'tables', label: s.tables },
              { key: 'options', label: s.options },
            ]}
          />
        </Layout.Sider>
        <Layout.Content style={{ padding: 12 }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>{s.layoutSubtitle}</Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 0 }}>{s.layoutParagraph}</Typography.Paragraph>
        </Layout.Content>
      </Layout>
      <Layout.Footer style={{ padding: '8px 16px' }}>{s.layoutFooter}</Layout.Footer>
    </Layout>
  );
};

const FlexDemo: React.FC = () => {
  const s = useSampleText();
  const { t } = useI18n();
  return (
    <div className="gonavi-component-gallery-stack">
      <span className="gonavi-component-gallery-label">Flex justify="space-between" align="center" wrap</span>
      <Flex justify="space-between" align="center" gap="middle" wrap>
        <Button type="primary">{s.option}</Button>
        <Button>{t('gallery.sample.text.option_index', { index: 2 })}</Button>
        <Button type="dashed">{s.subOption}</Button>
        <Button disabled>{s.noData}</Button>
      </Flex>
      <span className="gonavi-component-gallery-label">Flex vertical gap="small"</span>
      <Flex vertical gap="small" align="flex-start">
        <Space size="small" wrap>
          <Tag color="blue">{s.table}</Tag>
          <Tag color="green">{s.json}</Tag>
          <Tag>{s.text}</Tag>
        </Space>
        <Space size="small" wrap>
          <Badge status="processing" text={s.running} />
          <Badge status="success" text={s.connected} />
        </Space>
      </Flex>
      <span className="gonavi-component-gallery-label">Space size="middle"</span>
      <Space size="middle" wrap>
        <Button size="small">{s.cardTitle}</Button>
        <Button size="small">{s.cardBody}</Button>
      </Space>
    </div>
  );
};

const GridDemo: React.FC = () => {
  const s = useSampleText();
  const { t } = useI18n();
  return (
    <div className="gonavi-component-gallery-stack">
      <span className="gonavi-component-gallery-label">Row gutter={[16, 16]} · Col span={8}</span>
      <Row gutter={[16, 16]}>
        <Col span={8}><GridCell>{s.option}</GridCell></Col>
        <Col span={8}><GridCell>{s.subOption}</GridCell></Col>
        <Col span={8}><GridCell>{t('gallery.sample.text.option_index', { index: 3 })}</GridCell></Col>
      </Row>
      <span className="gonavi-component-gallery-label">Row gutter={16} · Col span={12}</span>
      <Row gutter={16}>
        <Col span={12}><GridCell>{s.table}</GridCell></Col>
        <Col span={12}><GridCell>{s.json}</GridCell></Col>
      </Row>
      <span className="gonavi-component-gallery-label">Col span={6} / span={12} / span={18}</span>
      <Row gutter={[16, 16]}>
        <Col span={6}><GridCell>{s.text}</GridCell></Col>
        <Col span={12}><GridCell>{s.day}</GridCell></Col>
        <Col span={18}><GridCell>{s.week}</GridCell></Col>
      </Row>
    </div>
  );
};

const TypographyDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <Typography.Title level={1}>{s.layoutTitle}</Typography.Title>
      <Typography.Title level={2}>{s.layoutTitle}</Typography.Title>
      <Typography.Title level={3}>{s.layoutSubtitle}</Typography.Title>
      <Typography.Title level={4}>{s.layoutSubtitle}</Typography.Title>
      <Typography.Paragraph>
        <Typography.Text strong>{s.option}</Typography.Text>
        <Typography.Text italic> {s.subOption}</Typography.Text>
        <Typography.Text underline> {s.table}</Typography.Text>
        <Typography.Text delete> {s.json}</Typography.Text>
        <Typography.Text disabled> {s.noData}</Typography.Text>
        <Typography.Text mark> {s.text}</Typography.Text>
        <Typography.Text code> orders</Typography.Text>
      </Typography.Paragraph>
      <Typography.Paragraph ellipsis={{ rows: 2 }}>{s.layoutParagraph}</Typography.Paragraph>
      <Typography.Paragraph>
        <Typography.Text copyable>{s.layoutParagraph}</Typography.Text>
      </Typography.Paragraph>
    </div>
  );
};

const SpaceDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <span className="gonavi-component-gallery-label">Space size="small" | "middle" | "large"</span>
      <Space size="small"><Button size="small">{s.option}</Button><Button size="small">{s.subOption}</Button></Space>
      <Space size="middle"><Button size="small">{s.option}</Button><Button size="small">{s.subOption}</Button></Space>
      <Space size="large"><Button size="small">{s.option}</Button><Button size="small">{s.subOption}</Button></Space>
      <span className="gonavi-component-gallery-label">Space wrap | Space direction="vertical"</span>
      <Space wrap>
        <Button size="small">{s.day}</Button>
        <Button size="small">{s.week}</Button>
        <Button size="small">{s.month}</Button>
        <Button size="small">{s.table}</Button>
        <Button size="small">{s.json}</Button>
      </Space>
      <Space direction="vertical">
        <Badge status="success" text={s.connected} />
        <Badge status="error" text={s.failed} />
      </Space>
      <span className="gonavi-component-gallery-label">Space.Compact</span>
      <Space.Compact>
        <Input defaultValue="orders" style={{ width: 160 }} />
        <Button type="primary">{s.action}</Button>
      </Space.Compact>
      <span className="gonavi-component-gallery-label">Divider</span>
      <Space>
        <span>{s.option}</span>
        <Divider type="vertical" />
        <span>{s.subOption}</span>
        <Divider type="vertical" />
        <span>{s.table}</span>
      </Space>
      <Divider orientation="left">{s.left}</Divider>
      <Divider orientation="right">{s.plain}</Divider>
    </div>
  );
};

const SplitterDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <span className="gonavi-component-gallery-label">Splitter layout="horizontal"</span>
      <Splitter style={{ height: 150 }}>
        <Splitter.Panel defaultSize="50%">
          <div style={{ padding: 12 }}>{s.cardTitle}</div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ padding: 12 }}>{s.cardBody}</div>
        </Splitter.Panel>
      </Splitter>
      <span className="gonavi-component-gallery-label">Splitter layout="vertical"</span>
      <Splitter layout="vertical" style={{ height: 190 }}>
        <Splitter.Panel defaultSize="50%">
          <div style={{ padding: 12 }}>{s.panelHeader}</div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ padding: 12 }}>{s.panelBody}</div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

const AffixDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <span className="gonavi-component-gallery-label">Affix offsetTop={8}</span>
      <div style={{ position: 'relative', height: 150, padding: 12, border: '1px solid var(--gn-br-2)', borderRadius: 6 }}>
        <Affix offsetTop={8}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 10px', border: '1px solid var(--gn-br-2)', borderRadius: 6 }}>
            <span>{s.layoutTitle}</span>
            <Badge status="processing" text={s.running} />
          </div>
        </Affix>
        <Typography.Paragraph style={{ marginTop: 40, marginBottom: 0 }}>{s.layoutParagraph}</Typography.Paragraph>
      </div>
    </div>
  );
};

const AntDesignIconGrid: React.FC = () => {
  const icons = [
    SearchOutlined, SettingOutlined, UserOutlined, TeamOutlined, FileOutlined,
    FileTextOutlined, FileSearchOutlined, FolderOutlined, FolderOpenOutlined, EditOutlined,
    DeleteOutlined, SaveOutlined, DownloadOutlined, UploadOutlined, ImportOutlined,
    ExportOutlined, PlusOutlined, MinusOutlined, CheckOutlined, CloseOutlined,
    EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, KeyOutlined,
    BellOutlined, CalendarOutlined, ClockCircleOutlined, HistoryOutlined, InfoCircleOutlined,
    ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined,
    MenuOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoreOutlined, HomeOutlined,
    DashboardOutlined, AppstoreOutlined, TableOutlined, ProfileOutlined, DatabaseOutlined,
    CloudOutlined, PartitionOutlined, NodeIndexOutlined, BranchesOutlined, DeploymentUnitOutlined,
    ApiOutlined, CodeOutlined, MailOutlined, PhoneOutlined, StarOutlined,
    HeartOutlined, CopyOutlined, LinkOutlined, ShareAltOutlined, PaperClipOutlined,
    PushpinOutlined, FilterOutlined, ReloadOutlined, ExpandOutlined, ShrinkOutlined,
    ArrowRightOutlined, ArrowLeftOutlined, ArrowUpOutlined, ArrowDownOutlined, CaretRightOutlined,
    PieChartOutlined, BarChartOutlined, LineChartOutlined, ThunderboltOutlined, RocketOutlined,
    BulbOutlined, BuildOutlined, ToolOutlined, SafetyOutlined, TagOutlined,
    NotificationOutlined, CommentOutlined, PrinterOutlined, ScanOutlined, QrcodeOutlined,
    GiftOutlined, CrownOutlined, FlagOutlined, ReadOutlined, PlayCircleOutlined,
    AimOutlined,
  ];
  return (
    <div className="gonavi-component-gallery-icon-grid">
      {icons.map((Icon, index) => (
        <Tooltip key={index} title={Icon.displayName}>
          <span className="gonavi-component-gallery-icon-cell">
            <Icon />
          </span>
        </Tooltip>
      ))}
    </div>
  );
};

export const commonLayoutSection: GallerySectionDef = {
  id: 'common-layout',
  group: 'common',
  titleKey: 'gallery.section.common-layout.title',
  descKey: 'gallery.section.common-layout.desc',
  items: [
    {
      id: 'common-layout-layout',
      name: 'Layout',
      source: 'antd 5',
      wide: true,
      render: () => <LayoutDemo />,
    },
    {
      id: 'common-layout-flex',
      name: 'Flex',
      source: 'antd 5',
      render: () => <FlexDemo />,
    },
    {
      id: 'common-layout-grid',
      name: 'Row / Col',
      source: 'antd 5',
      wide: true,
      render: () => <GridDemo />,
    },
    {
      id: 'common-layout-typography',
      name: 'Typography',
      source: 'antd 5',
      render: () => <TypographyDemo />,
    },
    {
      id: 'common-layout-space',
      name: 'Space / Space.Compact / Divider',
      source: 'antd 5',
      render: () => <SpaceDemo />,
    },
    {
      id: 'common-layout-splitter',
      name: 'Splitter',
      source: 'antd 5',
      wide: true,
      render: () => <SplitterDemo />,
    },
    {
      id: 'common-layout-affix',
      name: 'Affix',
      source: 'antd 5',
      render: () => <AffixDemo />,
    },
    {
      id: 'common-layout-icons',
      name: 'Ant Design Icons',
      source: '@ant-design/icons 5',
      wide: true,
      render: () => <AntDesignIconGrid />,
    },
  ],
};
