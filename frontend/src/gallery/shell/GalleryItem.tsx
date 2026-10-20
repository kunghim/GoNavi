import React from 'react';
import { Tooltip } from 'antd';
import type { GalleryItemDef } from '../galleryRegistry';

type GalleryItemProps = {
  item: GalleryItemDef;
};

// 单个条目卡片：展示组件实景 + 技术名 + 源码位置。
// 卡片本身不带业务逻辑，纯展示。
const GalleryItem = ({ item }: GalleryItemProps) => (
  <article
    className={`gonavi-component-gallery-item${item.wide ? ' gonavi-component-gallery-item-wide' : ''}`}
    data-component-gallery-item={item.id}
  >
    <header className="gonavi-component-gallery-item-header">
      <strong className="gonavi-component-gallery-item-name">{item.name}</strong>
      {item.source ? (
        <Tooltip title={item.source} placement="topLeft">
          <code className="gonavi-component-gallery-item-source">{item.source}</code>
        </Tooltip>
      ) : null}
    </header>
    <div className="gonavi-component-gallery-item-stage">
      {item.render()}
    </div>
  </article>
);

export default React.memo(GalleryItem);
