import React, { useMemo } from 'react';
import { useI18n } from '../../i18n/provider';
import type { GalleryGroupId, GallerySectionDef } from '../galleryRegistry';

type GalleryNavProps = {
  sections: readonly GallerySectionDef[];
  activeSectionId: string;
  onSelect: (sectionId: string) => void;
  itemCount: number;
};

// 左侧分类导航。点击后滚动到对应分区。
// 分区按归组（GoNavi 自有组件 / 通用组件）分段展示，组标题只做视觉分隔，不可点击。
const GalleryNav = ({ sections, activeSectionId, onSelect, itemCount }: GalleryNavProps) => {
  const { t } = useI18n();
  const groups = useMemo(() => {
    const order: GalleryGroupId[] = ['project', 'common'];
    const buckets = new Map<GalleryGroupId, GallerySectionDef[]>();
    for (const section of sections) {
      const bucket = buckets.get(section.group) ?? [];
      bucket.push(section);
      buckets.set(section.group, bucket);
    }
    return order
      .filter((groupId) => (buckets.get(groupId)?.length ?? 0) > 0)
      .map((groupId) => ({ groupId, sections: buckets.get(groupId) ?? [] }));
  }, [sections]);

  return (
    <nav className="gonavi-component-gallery-nav" aria-label={t('gallery.nav.title')}>
      <div className="gonavi-component-gallery-nav-heading">
        <span className="gonavi-component-gallery-nav-title">{t('gallery.nav.title')}</span>
        <span className="gonavi-component-gallery-nav-count">{itemCount}</span>
      </div>
      {groups.map((group) => (
        <div key={group.groupId} className="gonavi-component-gallery-nav-group">
          <div className="gonavi-component-gallery-nav-group-title">
            {t(`gallery.group.${group.groupId}.title`)}
          </div>
          <ul className="gonavi-component-gallery-nav-list">
            {group.sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={`gonavi-component-gallery-nav-item${section.id === activeSectionId ? ' is-active' : ''}`}
                  onClick={() => onSelect(section.id)}
                >
                  {t(section.titleKey)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default React.memo(GalleryNav);
