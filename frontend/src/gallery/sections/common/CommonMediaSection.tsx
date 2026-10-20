import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  BackTop,
  Button,
  Carousel,
  FloatButton,
  Image,
  QRCode,
  Space,
  Tooltip,
  Tour,
  Typography,
  Watermark,
} from 'antd';
import { MessageOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { useI18n } from '../../../i18n/provider';
import { useSampleText } from '../../sampleText';
import type { GallerySectionDef } from '../../galleryRegistry';

// 转义 XML 特殊字符，避免占位图内的文案破坏 SVG 结构。
const escapeXml = (text: string): string => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

// 生成内联 SVG 占位图并编码成 data URI，画廊离线也能稳定渲染，不依赖远程图片地址。
const placeholderDataUri = (label: string, background: string, foreground: string): string => {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="150" viewBox="0 0 240 150">',
    `<rect width="240" height="150" rx="8" fill="${background}"/>`,
    `<circle cx="120" cy="52" r="18" fill="${foreground}" opacity="0.3"/>`,
    `<text x="120" y="110" font-family="Segoe UI, Arial, sans-serif" font-size="15" fill="${foreground}" text-anchor="middle">${escapeXml(label)}</text>`,
    '</svg>',
  ].join('');
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const ImageDemo: React.FC = () => {
  const s = useSampleText();
  const sources = useMemo(() => [
    placeholderDataUri(s.mediaCaption, '#e6f4ff', '#0958d9'),
    placeholderDataUri(s.mediaSlideSubtitle, '#f6ffed', '#237804'),
    placeholderDataUri(s.mediaTourTitle, '#fff7e6', '#ad4e00'),
  ], [s.mediaCaption, s.mediaSlideSubtitle, s.mediaTourTitle]);
  return (
    <div className="gonavi-component-gallery-stack">
      <div className="gonavi-component-gallery-row">
        <Image.PreviewGroup>
          {sources.map((src) => (
            <Image key={src} src={src} alt={s.mediaCaption} width={150} preview />
          ))}
        </Image.PreviewGroup>
      </div>
      <div className="gonavi-component-gallery-row">
        <Image
          src={sources[0]}
          alt={s.mediaCaption}
          width={150}
          placeholder={(
            <div style={{ width: 150, height: 94, borderRadius: 8, background: 'var(--gn-bg-panel-2)' }} />
          )}
        />
        <span className="gonavi-component-gallery-label">Image / placeholder</span>
      </div>
    </div>
  );
};

const CarouselDemo: React.FC = () => {
  const s = useSampleText();
  const { t } = useI18n();
  const slides = [
    { title: s.mediaCaption, subtitle: s.mediaSlideSubtitle },
    { title: s.mediaSlideSubtitle, subtitle: s.option },
    { title: t('gallery.sample.text.option_index', { index: 3 }), subtitle: s.subOption },
  ];
  return (
    <Carousel autoplay arrows dotPosition="bottom" style={{ width: '100%', maxWidth: 420, height: 180 }}>
      {slides.map((slide) => (
        <div key={slide.title}>
          <div
            style={{
              height: 180,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'var(--gn-bg-panel-2)',
              borderRadius: 8,
            }}
          >
            <Typography.Text strong>{slide.title}</Typography.Text>
            <Typography.Text type="secondary">{slide.subtitle}</Typography.Text>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

const QRCodeDemo: React.FC = () => {
  const value = 'https://example.com/gonavi/connection';
  const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  };
  return (
    <Space size={24} align="start">
      <div style={columnStyle}>
        <QRCode value={value} bordered={false} size={120} />
        <span className="gonavi-component-gallery-label">bordered=false</span>
      </div>
      <div style={columnStyle}>
        <QRCode value={value} size={160} />
        <span className="gonavi-component-gallery-label">size=160</span>
      </div>
    </Space>
  );
};

const WatermarkDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <Watermark content={s.mediaWatermark}>
      <div
        style={{
          padding: 16,
          border: '1px dashed var(--gn-br-3)',
          borderRadius: 8,
          background: 'var(--gn-bg-panel-2)',
        }}
      >
        <Typography.Paragraph style={{ marginBottom: 4 }}>{s.mediaCaption}</Typography.Paragraph>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {s.mediaSlideSubtitle}
        </Typography.Paragraph>
      </div>
    </Watermark>
  );
};

const FloatButtonDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <div
      style={{
        position: 'relative',
        height: 180,
        padding: 12,
        border: '1px dashed var(--gn-br-3)',
        borderRadius: 8,
      }}
    >
      <Typography.Text type="secondary">{s.mediaFloatHint}</Typography.Text>
      <FloatButton.Group
        placement="top"
        trigger="click"
        icon={<PlusOutlined />}
        style={{ position: 'absolute', right: 16, bottom: 16 }}
      >
        <FloatButton icon={<MessageOutlined />} />
        <Tooltip title={s.mediaFloatHint} placement="left">
          <FloatButton icon={<SettingOutlined />} />
        </Tooltip>
      </FloatButton.Group>
    </div>
  );
};

const TourDemo: React.FC = () => {
  const s = useSampleText();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [firstTarget, setFirstTarget] = useState<HTMLElement | null>(null);
  const [secondTarget, setSecondTarget] = useState<HTMLElement | null>(null);
  const steps = [
    { title: s.mediaTourTitle, description: s.mediaTourDesc, target: firstTarget },
    { title: t('gallery.sample.text.option_index', { index: 2 }), description: s.mediaTourDesc, target: secondTarget },
    { title: t('gallery.sample.text.option_index', { index: 3 }), description: s.mediaSlideSubtitle, target: firstTarget },
  ];
  return (
    <div className="gonavi-component-gallery-stack">
      <div>
        <Button type="primary" onClick={() => setOpen(true)}>{s.mediaTourTitle}</Button>
      </div>
      <div
        ref={setFirstTarget}
        style={{ padding: 12, border: '1px dashed var(--gn-br-3)', borderRadius: 8 }}
      >
        <Typography.Text>{s.mediaCaption}</Typography.Text>
      </div>
      <div>
        <Button ref={setSecondTarget} onClick={() => setOpen(true)}>{s.option}</Button>
      </div>
      <Tour
        open={open}
        steps={steps}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  );
};

const BackTopDemo: React.FC = () => {
  const s = useSampleText();
  const scrollRef = useRef<HTMLDivElement>(null);
  const target = useCallback(() => scrollRef.current ?? document, []);
  return (
    <div style={{ position: 'relative', border: '1px solid var(--gn-br-2)', borderRadius: 8 }}>
      <div ref={scrollRef} style={{ height: 160, overflow: 'auto', padding: 12 }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <p key={index} style={{ margin: '0 0 8px' }}>
            {s.mediaCaption} · {index + 1}
          </p>
        ))}
      </div>
      <BackTop
        target={target}
        visibilityHeight={40}
        style={{ position: 'absolute', right: 12, bottom: 12 }}
      />
    </div>
  );
};

export const commonMediaSection: GallerySectionDef = {
  id: 'common-media',
  group: 'common',
  titleKey: 'gallery.section.common-media.title',
  descKey: 'gallery.section.common-media.desc',
  items: [
    {
      id: 'common-media-image',
      name: 'Image / Image.PreviewGroup',
      source: 'antd 5',
      render: () => <ImageDemo />,
    },
    {
      id: 'common-media-carousel',
      name: 'Carousel',
      source: 'antd 5',
      render: () => <CarouselDemo />,
    },
    {
      id: 'common-media-qrcode',
      name: 'QRCode',
      source: 'antd 5',
      render: () => <QRCodeDemo />,
    },
    {
      id: 'common-media-watermark',
      name: 'Watermark',
      source: 'antd 5',
      render: () => <WatermarkDemo />,
    },
    {
      id: 'common-media-float-button',
      name: 'FloatButton',
      source: 'antd 5',
      render: () => <FloatButtonDemo />,
    },
    {
      id: 'common-media-tour',
      name: 'Tour',
      source: 'antd 5',
      render: () => <TourDemo />,
    },
    {
      id: 'common-media-back-top',
      name: 'BackTop',
      source: 'antd 5',
      render: () => <BackTopDemo />,
    },
  ],
};
