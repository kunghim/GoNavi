import React from 'react';
import {
  Alert,
  App,
  Badge,
  Button,
  Empty,
  Progress,
  Result,
  Skeleton,
  Space,
  Spin,
  Tag,
} from 'antd';
import { useI18n } from '../../i18n/provider';
import { useSampleText } from '../sampleText';
import type { GallerySectionDef } from '../galleryRegistry';

const MessageRow: React.FC = () => {
  const { message, notification } = App.useApp();
  const s = useSampleText();
  return (
    <Space size={8} wrap>
      <Button onClick={() => { message.success(s.saved); }}>message.success</Button>
      <Button onClick={() => { message.error(s.failed); }}>message.error</Button>
      <Button onClick={() => { message.info(s.info); }}>message.info</Button>
      <Button onClick={() => { message.warning(s.warning); }}>message.warning</Button>
      <Button onClick={() => { message.loading(s.loading, 1.5); }}>message.loading</Button>
      <Button onClick={() => {
        notification.open({
          message: s.info,
          description: s.panelBody,
          placement: 'bottomRight',
        });
      }}>
        notification
      </Button>
    </Space>
  );
};

const StateRow: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <Space size={16} wrap align="center">
        <Spin size="small" />
        <Spin />
        <Badge status="success" text={s.connected} />
        <Badge status="warning" text={s.pending} />
        <Badge status="error" text={s.failed} />
        <Tag color="success">{s.success}</Tag>
        <Tag color="processing">{s.processing}</Tag>
        <Tag color="error">{s.error}</Tag>
      </Space>
      <Skeleton active paragraph={{ rows: 2 }} />
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={s.noData} />
    </div>
  );
};

const ResultRow: React.FC = () => {
  const s = useSampleText();
  return (
    <Result
      status="success"
      title={s.success}
      subTitle={s.operationDone}
      extra={<Button type="primary">{s.ok}</Button>}
    />
  );
};

const AlertRow: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="gonavi-component-gallery-stack">
      <Alert type="info" showIcon message={t('gallery.section.feedback.title')} description={t('gallery.section.feedback.desc')} />
      <Alert type="warning" showIcon message={t('gallery.sample.run')} />
      <Alert type="error" showIcon message={t('gallery.sample.drop')} />
    </div>
  );
};

const ProgressRow: React.FC = () => (
  <div className="gonavi-component-gallery-stack">
    <Progress percent={45} />
    <Progress percent={80} status="active" />
    <Progress percent={100} status="success" />
    <Progress percent={20} status="exception" />
    <Progress percent={60} showInfo={false} />
  </div>
);

export const feedbackSection: GallerySectionDef = {
  id: 'feedback',
  group: 'project',
  titleKey: 'gallery.section.feedback.title',
  descKey: 'gallery.section.feedback.desc',
  items: [
    {
      id: 'feedback-message',
      name: 'message / notification',
      source: 'antd 5 App.useApp',
      render: () => <MessageRow />,
    },
    {
      id: 'feedback-alert',
      name: 'Alert',
      source: 'antd 5',
      render: () => <AlertRow />,
    },
    {
      id: 'feedback-state',
      name: 'Spin / Badge / Tag / Skeleton / Empty',
      source: 'antd 5',
      render: () => <StateRow />,
    },
    {
      id: 'feedback-progress',
      name: 'Progress',
      source: 'antd 5',
      render: () => <ProgressRow />,
    },
    {
      id: 'feedback-result',
      name: 'Result',
      source: 'antd 5',
      render: () => <ResultRow />,
    },
  ],
};
