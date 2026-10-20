import React from 'react';
import { useI18n } from '../../i18n/provider';
import type { GallerySectionDef } from '../galleryRegistry';
import GalleryItem from './GalleryItem';

type GallerySectionProps = {
  section: GallerySectionDef;
};

// 分区容器：标题 + 说明 + 条目网格。
// 网格为自适应列，条目宽度固定，避免长组件撑破布局。
const GallerySection = ({ section }: GallerySectionProps) => {
  const { t } = useI18n();
  return (
    <section className="gonavi-component-gallery-section" id={`component-gallery-section-${section.id}`}>
      <header className="gonavi-component-component-gallery-section-header">
        <h2>{t(section.titleKey)}</h2>
        <p>{t(section.descKey)}</p>
      </header>
      <div className="gonavi-component-gallery-grid">
        {section.items.map((item) => (
          <GalleryItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default React.memo(GallerySection);
