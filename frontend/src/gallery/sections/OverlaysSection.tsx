import React, { useState } from 'react';
import {
  Button,
  Drawer,
  Dropdown,
  Modal,
  Popconfirm,
  Popover,
  Space,
  Tooltip,
  type MenuProps,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import ResizableDraggableModal from '../../components/common/ResizableDraggableModal';
import { showCountdownDangerConfirm } from '../../components/common/countdownDangerConfirm';
import { useI18n } from '../../i18n/provider';
import { useSampleText } from '../sampleText';
import type { GallerySectionDef } from '../galleryRegistry';

const ModalRow: React.FC = () => {
  const s = useSampleText();
  const [basicOpen, setBasicOpen] = useState(false);
  const [resizableOpen, setResizableOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <Space size={8} wrap>
      <Button onClick={() => setBasicOpen(true)}>Modal</Button>
      <Button onClick={() => setResizableOpen(true)}>ResizableDraggableModal</Button>
      <Button onClick={() => setDrawerOpen(true)}>Drawer</Button>
      <Modal
        open={basicOpen}
        title="Modal"
        onCancel={() => setBasicOpen(false)}
        onOk={() => setBasicOpen(false)}
      >
        {s.modalBody}
      </Modal>
      <ResizableDraggableModal
        open={resizableOpen}
        title="ResizableDraggableModal"
        draggable
        resizable
        width={520}
        onCancel={() => setResizableOpen(false)}
        onOk={() => setResizableOpen(false)}
      >
        {s.dragHint}
      </ResizableDraggableModal>
      <Drawer
        open={drawerOpen}
        title="Drawer"
        onClose={() => setDrawerOpen(false)}
      >
        {s.drawerBody}
      </Drawer>
    </Space>
  );
};

const PopoverRow: React.FC = () => {
  const { t } = useI18n();
  const s = useSampleText();
  return (
    <Space size={8} wrap>
      <Tooltip title={s.tooltipText}>
        <Button>Tooltip</Button>
      </Tooltip>
      <Popover title={s.popoverTitle} content={s.popoverContent}>
        <Button>Popover</Button>
      </Popover>
      <Popconfirm
        title={s.confirmQuestion}
        okText={s.yes}
        cancelText={s.no}
        onConfirm={() => undefined}
      >
        <Button>Popconfirm</Button>
      </Popconfirm>
      <Dropdown
        menu={{
          items: [
            { key: '1', label: t('gallery.sample.text.option_index', { index: 1 }) },
            { key: '2', label: t('gallery.sample.text.option_index', { index: 2 }) },
            { type: 'divider' },
            { key: '3', label: s.dangerAction, danger: true },
          ],
        }}
      >
        <Button>
          Dropdown <DownOutlined />
        </Button>
      </Dropdown>
    </Space>
  );
};

const DangerRow: React.FC = () => {
  const { t } = useI18n();
  const menuItems: MenuProps['items'] = [
    { key: '1', label: t('gallery.sample.open') },
    { key: '2', label: t('gallery.sample.drop'), danger: true },
  ];
  return (
    <Space size={8} wrap>
      <Button
        danger
        onClick={() => {
          showCountdownDangerConfirm({
            title: t('gallery.sample.drop'),
            content: t('gallery.section.feedback.desc'),
            onOk: () => undefined,
          });
        }}
      >
        countDownDangerConfirm
      </Button>
      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
        <Button>
          {t('gallery.sample.drop')} <DownOutlined />
        </Button>
      </Dropdown>
    </Space>
  );
};

export const overlaysSection: GallerySectionDef = {
  id: 'overlays',
  group: 'project',
  titleKey: 'gallery.section.overlays.title',
  descKey: 'gallery.section.overlays.desc',
  items: [
    {
      id: 'overlays-modal',
      name: 'Modal / ResizableDraggableModal / Drawer',
      source: 'components/common/ResizableDraggableModal.tsx',
      render: () => <ModalRow />,
    },
    {
      id: 'overlays-popover',
      name: 'Tooltip / Popover / Popconfirm / Dropdown',
      source: 'antd 5',
      render: () => <PopoverRow />,
    },
    {
      id: 'overlays-danger-confirm',
      name: 'Countdown Danger Confirm',
      source: 'components/common/countdownDangerConfirm.tsx',
      render: () => <DangerRow />,
    },
  ],
};
