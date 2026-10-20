import React, { useState } from 'react';
import {
  Anchor,
  Breadcrumb,
  Card,
  Collapse,
  Descriptions,
  Menu,
  Pagination,
  Segmented,
  Space,
  Steps,
  Tabs,
  Tree,
  type TreeDataNode,
} from 'antd';
import { useI18n } from '../../i18n/provider';
import { useSampleText } from '../sampleText';
import type { GallerySectionDef } from '../galleryRegistry';

const ExplorerTree: React.FC = () => {
  const s = useSampleText();
  // analytics / events / sessions 是示例数据标识符，属于技术字面量，不翻译。
  const treeData: TreeDataNode[] = [
    {
      title: 'analytics',
      key: 'analytics',
      children: [
        {
          title: s.tables,
          key: 'analytics-tables',
          children: [
            { title: 'events', key: 'events' },
            { title: 'sessions', key: 'sessions' },
          ],
        },
        { title: s.views, key: 'analytics-views' },
      ],
    },
    {
      title: 'orders',
      key: 'orders',
      children: [
        { title: s.tables, key: 'orders-tables' },
        { title: s.procedures, key: 'orders-procedures' },
      ],
    },
  ];
  return (
    <div className="gn-v2-explorer-tree-shell" style={{ width: 260, height: 260, overflow: 'auto' }}>
      <Tree
        defaultExpandAll
        treeData={treeData}
        blockNode
      />
    </div>
  );
};

const TabRow: React.FC = () => {
  const { t } = useI18n();
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <Tabs
        defaultActiveKey="1"
        items={[
          { key: '1', label: t('gallery.section.navigation.title'), children: <p>{t('gallery.section.navigation.desc')}</p> },
          { key: '2', label: t('gallery.sample.design'), children: <p>{t('gallery.sample.open')}</p> },
          { key: '3', label: t('gallery.sample.disabled'), disabled: true },
        ]}
      />
      <Segmented
        defaultValue="table"
        options={[
          { value: 'table', label: s.table },
          { value: 'json', label: s.json },
          { value: 'text', label: s.text },
        ]}
      />
      <Breadcrumb
        items={[
          { title: s.home },
          { title: s.library },
          { title: s.data },
        ]}
      />
    </div>
  );
};

const MenuRow: React.FC = () => {
  const { t } = useI18n();
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['1']}
      style={{ width: 200 }}
      items={[
        { key: '1', label: t('gallery.sample.text.option_index', { index: 1 }) },
        { key: '2', label: t('gallery.sample.text.option_index', { index: 2 }) },
        { key: '3', label: t('gallery.sample.text.option_index', { index: 3 }), disabled: true },
        { type: 'divider' },
        { key: '4', label: t('gallery.sample.text.option_index', { index: 4 }), children: [
          { key: '4-1', label: t('gallery.sample.text.sub_option_index', { index: 1 }) },
          { key: '4-2', label: t('gallery.sample.text.sub_option_index', { index: 2 }) },
        ] },
      ]}
    />
  );
};

const StepRow: React.FC = () => {
  const { t } = useI18n();
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <Steps
        current={1}
        size="small"
        items={[
          { title: s.connection, description: s.hostCredentials },
          { title: s.options, description: s.advanced },
          { title: s.done },
        ]}
      />
      <Pagination defaultCurrent={2} pageSize={20} total={320} showSizeChanger size="small" />
      <Anchor
        items={[
          { key: '1', href: '#component-gallery-section-basics', title: t('gallery.section.basics.title') },
          { key: '2', href: '#component-gallery-section-forms', title: t('gallery.section.forms.title') },
        ]}
      />
    </div>
  );
};

const CardRow: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <Descriptions
        size="small"
        column={2}
        items={[
          { key: 'host', label: s.host, children: '10.20.30.41' },
          { key: 'port', label: s.port, children: '3306' },
          { key: 'user', label: s.user, children: 'analyst' },
          { key: 'db', label: s.database, children: 'analytics' },
        ]}
      />
      <Collapse
        ghost
        items={[
          { key: '1', label: s.panelHeader, children: <p>{s.panelBody}</p> },
          { key: '2', label: s.secondPanel, children: <p>{s.secondBody}</p> },
        ]}
      />
      <Card size="small" title={s.cardTitle} style={{ width: 280 }}>
        {s.cardBody}
      </Card>
      <Space size={8} wrap>
        <Segmented options={[s.day, s.week, s.month]} />
      </Space>
    </div>
  );
};

export const navigationSection: GallerySectionDef = {
  id: 'navigation',
  group: 'project',
  titleKey: 'gallery.section.navigation.title',
  descKey: 'gallery.section.navigation.desc',
  items: [
    {
      id: 'navigation-explorer-tree',
      name: 'Explorer Tree',
      source: 'styles/v2Theme/v2-theme-07-the-explorer-tree.css',
      render: () => <ExplorerTree />,
    },
    {
      id: 'navigation-tabs',
      name: 'Tabs / Segmented / Breadcrumb',
      source: 'antd 5',
      render: () => <TabRow />,
    },
    {
      id: 'navigation-menu',
      name: 'Menu',
      source: 'antd 5',
      render: () => <MenuRow />,
    },
    {
      id: 'navigation-steps',
      name: 'Steps / Pagination / Anchor',
      source: 'antd 5',
      render: () => <StepRow />,
    },
    {
      id: 'navigation-card',
      name: 'Descriptions / Collapse / Card',
      source: 'antd 5',
      render: () => <CardRow />,
    },
  ],
};
