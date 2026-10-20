import { describe, expect, it } from 'vitest';
import { catalogs } from '../i18n/catalog';
import type { SupportedLanguage } from '../i18n/types';
import { GALLERY_SECTIONS, findGallerySection } from './galleryRegistry';
import { GALLERY_SAMPLE_TEXT_KEYS } from './sampleText';

const LANGUAGES: SupportedLanguage[] = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'de-DE', 'ru-RU'];

// 画廊里所有 i18n 键的取值都必须落到 6 个语言文件里，
// 少一个语言就是漏翻译，画廊会出现原始键名。
describe('gallery registry', () => {
  it('分区与条目的 id 全局唯一', () => {
    const sectionIds = GALLERY_SECTIONS.map((section) => section.id);
    expect(new Set(sectionIds).size).toBe(sectionIds.length);

    const itemIds = GALLERY_SECTIONS.flatMap((section) => section.items.map((item) => item.id));
    expect(new Set(itemIds).size).toBe(itemIds.length);
  });

  it('每个分区都有标题、说明与至少一个条目', () => {
    for (const section of GALLERY_SECTIONS) {
      expect(section.id.length).toBeGreaterThan(0);
      expect(section.titleKey.length).toBeGreaterThan(0);
      expect(section.descKey.length).toBeGreaterThan(0);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it('每个条目都有技术名、渲染函数和源码位置', () => {
    for (const section of GALLERY_SECTIONS) {
      for (const item of section.items) {
        expect(item.name.length).toBeGreaterThan(0);
        expect(typeof item.render).toBe('function');
        expect(item.source && item.source.length).toBeTruthy();
      }
    }
  });

  it('分区标题与说明在 6 个语言里都有对应词条', () => {
    for (const section of GALLERY_SECTIONS) {
      for (const language of LANGUAGES) {
        expect(catalogs[language]?.[section.titleKey as keyof typeof catalogs['en-US']]).toBeTruthy();
        expect(catalogs[language]?.[section.descKey as keyof typeof catalogs['en-US']]).toBeTruthy();
      }
    }
  });

  it('样例文案表引用的键在 6 个语言里都有对应词条', () => {
    const keys = Object.values(GALLERY_SAMPLE_TEXT_KEYS);
    expect(new Set(keys).size).toBe(keys.length);
    for (const key of keys) {
      for (const language of LANGUAGES) {
        const value = catalogs[language]?.[key as keyof typeof catalogs['en-US']];
        expect(value, `${language} 缺少 ${key}`).toBeTruthy();
        expect(value, `${language} 的 ${key} 不应等于键名本身`).not.toBe(key);
      }
    }
  });

  it('6 个语言的 gallery.* 键集完全一致', () => {
    const keySets = LANGUAGES.map((language) => new Set(
      Object.keys(catalogs[language] ?? {}).filter((key) => key.startsWith('gallery.')),
    ));
    const reference = keySets[0];
    for (const language of LANGUAGES.slice(1)) {
      const current = keySets[LANGUAGES.indexOf(language)];
      expect(current.size, `${language} 的 gallery 键数量不一致`).toBe(reference.size);
      for (const key of reference) {
        expect(current.has(key), `${language} 缺少 ${key}`).toBe(true);
      }
    }
  });

  it('findGallerySection 按 id 命中分区，未知 id 返回 undefined', () => {
    const first = GALLERY_SECTIONS[0];
    expect(first).toBeDefined();
    expect(findGallerySection(first.id)).toBe(first);
    expect(findGallerySection('not-a-real-section')).toBeUndefined();
  });
});

const GALLERY_GROUP_IDS = ['project', 'common'] as const;

describe('gallery registry groups', () => {
  it('每个分区都归入已知的分组', () => {
    for (const section of GALLERY_SECTIONS) {
      expect(GALLERY_GROUP_IDS).toContain(section.group);
    }
  });

  it('GoNavi 自有组件与通用组件两个分组都有内容', () => {
    for (const groupId of GALLERY_GROUP_IDS) {
      const sections = GALLERY_SECTIONS.filter((section) => section.group === groupId);
      expect(sections.length, `${groupId} 分组没有分区`).toBeGreaterThan(0);
      const itemCount = sections.reduce((total, section) => total + section.items.length, 0);
      expect(itemCount, `${groupId} 分组没有条目`).toBeGreaterThan(0);
    }
  });

  it('分组标题在 6 个语言里都有对应词条', () => {
    for (const groupId of GALLERY_GROUP_IDS) {
      const key = `gallery.group.${groupId}.title`;
      for (const language of LANGUAGES) {
        const value = catalogs[language]?.[key as keyof typeof catalogs['en-US']];
        expect(value, `${language} 缺少 ${key}`).toBeTruthy();
        expect(value, `${language} 的 ${key} 不应等于键名本身`).not.toBe(key);
      }
    }
  });

  it('条目 id 以所属分区 id 为前缀', () => {
    for (const section of GALLERY_SECTIONS) {
      for (const item of section.items) {
        expect(
          item.id.startsWith(`${section.id}-`),
          `${item.id} 应以 ${section.id}- 开头`,
        ).toBe(true);
      }
    }
  });
});
