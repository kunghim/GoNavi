import React from 'react';
import { Alert, Badge, Button, Divider, Empty, Progress, Space, Tag, Tooltip } from 'antd';
import { getDbIcon } from '../../components/DatabaseIcons';
import {
  GnAddRowIcon,
  GnBoltIcon,
  GnChevronDownIcon,
  GnClockIcon,
  GnCloseIcon,
  GnCopyIcon,
  GnDatabaseIcon,
  GnErDiagramIcon,
  GnExportIcon,
  GnFieldsIcon,
  GnFilterIcon,
  GnFolderIcon,
  GnHistoryIcon,
  GnImportIcon,
  GnIndexIcon,
  GnLinkIcon,
  GnLocateIcon,
  GnMoreIcon,
  GnNewConnectionIcon,
  GnNewQueryIcon,
  GnPackageIcon,
  GnPencilIcon,
  GnRefreshIcon,
  GnRollbackIcon,
  GnSaveIcon,
  GnScrollTopIcon,
  GnSearchIcon,
  GnSendIcon,
  GnSettingsIcon,
  GnSlidersIcon,
  GnSqlDocIcon,
  GnStopIcon,
  GnTableDesignIcon,
  GnTableIcon,
  GnTrashIcon,
  GnUndoIcon,
  GnViewIcon,
} from '../../components/icons/gnIcons';
import { V2TableContextMenuItem } from '../../components/v2ContextMenu/v2ContextMenuPrimitives';
import { useI18n } from '../../i18n/provider';
import { useSampleText } from '../sampleText';
import type { GallerySectionDef } from '../galleryRegistry';

const GnIconGrid: React.FC = () => {
  const icons = [
    GnSearchIcon, GnLocateIcon, GnScrollTopIcon, GnRefreshIcon, GnFilterIcon,
    GnTableIcon, GnViewIcon, GnFieldsIcon, GnIndexIcon, GnLinkIcon,
    GnFolderIcon, GnPackageIcon, GnBoltIcon, GnDatabaseIcon, GnSqlDocIcon,
    GnNewConnectionIcon, GnNewQueryIcon, GnTableDesignIcon, GnErDiagramIcon,
    GnAddRowIcon, GnCopyIcon, GnPencilIcon, GnTrashIcon, GnUndoIcon,
    GnRollbackIcon, GnSaveIcon, GnImportIcon, GnExportIcon, GnSlidersIcon,
    GnHistoryIcon, GnClockIcon, GnSettingsIcon, GnSendIcon, GnStopIcon,
    GnMoreIcon, GnChevronDownIcon, GnCloseIcon,
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

const DbIconRow: React.FC = () => {
  const types = ['mysql', 'postgres', 'redis', 'mongodb', 'oracle', 'sqlite', 'duckdb'];
  return (
    <div className="gonavi-component-gallery-row">
      {types.map((type) => (
        <span key={type} className="gonavi-component-gallery-icon-cell">
          {getDbIcon(type)}
        </span>
      ))}
    </div>
  );
};

const ToolbarKbdRow: React.FC = () => {
  const { t } = useI18n();
  return (
    <Space size={8} wrap>
      <Button className="gn-v2-query-transaction-commit-button" type="primary" size="small">
        {t('gallery.sample.run')}
        <span className="gn-v2-toolbar-kbd">F5</span>
      </Button>
      <Button size="small">
        {t('gallery.sample.save')}
        <span className="gn-v2-toolbar-kbd">Ctrl+S</span>
      </Button>
      <span className="gn-v2-toolbar-kbd">Ctrl+Shift+D</span>
    </Space>
  );
};

const ContextMenuRow: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="gonavi-component-gallery-context-menu">
      <V2TableContextMenuItem
        item={{
          action: 'open',
          icon: <GnViewIcon />,
          title: t('gallery.sample.open'),
          featured: true,
        }}
      />
      <V2TableContextMenuItem
        item={{
          action: 'design',
          icon: <GnTableDesignIcon />,
          title: t('gallery.sample.design'),
          kbd: 'Ctrl+D',
        }}
      />
      <V2TableContextMenuItem
        item={{
          action: 'ai',
          icon: <GnSendIcon />,
          title: t('gallery.sample.ai'),
          tone: 'ai',
        }}
      />
      <V2TableContextMenuItem
        item={{
          action: 'drop',
          icon: <GnTrashIcon />,
          title: t('gallery.sample.drop'),
          tone: 'danger',
        }}
      />
      <V2TableContextMenuItem
        item={{
          action: 'disabled',
          icon: <GnCopyIcon />,
          title: t('gallery.sample.disabled'),
          disabled: true,
        }}
      />
    </div>
  );
};

const ButtonRow: React.FC = () => {
  const { t } = useI18n();
  const label = t('gallery.sample.primary');
  return (
    <Space size={8} wrap>
      <Button type="primary">{label}</Button>
      <Button>{label}</Button>
      <Button type="dashed">{label}</Button>
      <Button type="text">{label}</Button>
      <Button type="link">{label}</Button>
      <Button danger>{label}</Button>
      <Button type="primary" danger>{label}</Button>
      <Button disabled>{label}</Button>
    </Space>
  );
};

const ButtonSizeRow: React.FC = () => {
  const { t } = useI18n();
  const label = t('gallery.sample.primary');
  return (
    <Space size={8} wrap align="center">
      <Button type="primary" size="large">{label}</Button>
      <Button type="primary">{label}</Button>
      <Button type="primary" size="small">{label}</Button>
    </Space>
  );
};

const TagBadgeRow: React.FC = () => {
  const s = useSampleText();
  return (
    <Space size={8} wrap>
      <Tag color="success">{s.success}</Tag>
      <Tag color="processing">{s.processing}</Tag>
      <Tag color="warning">{s.warning}</Tag>
      <Tag color="error">{s.error}</Tag>
      <Tag>{s.default}</Tag>
      <Badge count={5} />
      <Badge count={99} overflowCount={9} />
      <Badge status="success" text={s.connected} />
      <Badge status="processing" text={s.running} />
      <Badge status="error" text={s.failed} />
    </Space>
  );
};

const AlertRow: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <Alert type="info" showIcon message={s.info} />
      <Alert type="success" showIcon message={s.success} />
      <Alert type="warning" showIcon message={s.warning} />
      <Alert type="error" showIcon message={s.error} />
    </div>
  );
};

const EmptyRow: React.FC = () => {
  const s = useSampleText();
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={s.noData} />;
};

const DividerRow: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <Divider plain>{s.plain}</Divider>
      <Divider orientation="left">{s.left}</Divider>
      <Divider />
    </div>
  );
};

export const basicsSection: GallerySectionDef = {
  id: 'basics',
  group: 'project',
  titleKey: 'gallery.section.basics.title',
  descKey: 'gallery.section.basics.desc',
  items: [
    {
      id: 'basics-button',
      name: 'Button',
      source: 'antd 5',
      render: () => <ButtonRow />,
    },
    {
      id: 'basics-button-sizes',
      name: 'Button · Size',
      source: 'antd 5',
      render: () => <ButtonSizeRow />,
    },
    {
      id: 'basics-tag-badge',
      name: 'Tag / Badge',
      source: 'antd 5',
      render: () => <TagBadgeRow />,
    },
    {
      id: 'basics-progress',
      name: 'Progress',
      source: 'antd 5',
      render: () => (
        <div className="gonavi-component-gallery-stack">
          <Progress percent={45} />
          <Progress percent={72} status="active" />
          <Progress percent={100} status="success" />
          <Progress percent={30} status="exception" />
        </div>
      ),
    },
    {
      id: 'basics-alert',
      name: 'Alert',
      source: 'antd 5',
      render: () => <AlertRow />,
    },
    {
      id: 'basics-empty',
      name: 'Empty',
      source: 'antd 5',
      render: () => <EmptyRow />,
    },
    {
      id: 'basics-divider',
      name: 'Divider',
      source: 'antd 5',
      render: () => <DividerRow />,
    },
    {
      id: 'basics-gn-icons',
      name: 'GoNavi Icon Set',
      source: 'components/icons/gnIcons.tsx',
      render: () => <GnIconGrid />,
    },
    {
      id: 'basics-db-icons',
      name: 'Database Icons',
      source: 'components/DatabaseIcons.tsx',
      render: () => <DbIconRow />,
    },
    {
      id: 'basics-toolbar-kbd',
      name: 'Toolbar KBD Badge',
      source: 'styles/v2Theme/v2-theme-10-v2-datagrid.css',
      render: () => <ToolbarKbdRow />,
    },
    {
      id: 'basics-context-menu-item',
      name: 'Context Menu Item',
      source: 'components/v2ContextMenu/v2ContextMenuPrimitives.tsx',
      render: () => <ContextMenuRow />,
    },
  ],
};
