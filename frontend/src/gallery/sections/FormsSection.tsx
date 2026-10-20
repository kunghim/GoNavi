import React, { useState } from 'react';
import {
  AutoComplete,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Space,
  Switch,
  TimePicker,
  TreeSelect,
} from 'antd';
import { ThemeSettingsSlider } from '../../appShell/ThemeSettingsSlider';
import { useI18n } from '../../i18n/provider';
import { useSampleText } from '../sampleText';
import type { GallerySectionDef } from '../galleryRegistry';

// 树里的 analytics / events / sessions 是示例数据标识符，属于技术字面量，不翻译。
const TREE_DATA = [
  {
    value: 'analytics',
    title: 'analytics',
    children: [
      { value: 'analytics.events', title: 'events' },
      { value: 'analytics.sessions', title: 'sessions' },
    ],
  },
  {
    value: 'orders',
    title: 'orders',
    children: [
      { value: 'orders.orders', title: 'orders' },
      { value: 'orders.refunds', title: 'refunds' },
    ],
  },
];

const TextInputRow: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <Input placeholder={s.input} />
      <Input.Password placeholder={s.password} />
      <Input.TextArea rows={3} placeholder={s.textArea} />
      <InputNumber style={{ width: 180 }} placeholder={s.inputNumber} />
      <AutoComplete options={[{ value: 'SELECT * FROM orders' }]} placeholder={s.autoComplete} />
    </div>
  );
};

const SelectRow: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <Select
        style={{ width: 220 }}
        defaultValue="mysql"
        options={[
          { value: 'mysql', label: 'MySQL' },
          { value: 'postgresql', label: 'PostgreSQL' },
          { value: 'redis', label: 'Redis' },
        ]}
      />
      <TreeSelect
        style={{ width: 220 }}
        treeData={TREE_DATA}
        placeholder={s.treeSelect}
      />
      <Cascader
        style={{ width: 220 }}
        options={[
          {
            value: 'analytics',
            label: 'analytics',
            children: [
              { value: 'events', label: 'events' },
              { value: 'sessions', label: 'sessions' },
            ],
          },
        ]}
        placeholder={s.cascader}
      />
    </div>
  );
};

const ChoiceRow: React.FC = () => {
  const s = useSampleText();
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  return (
    <div className="gonavi-component-gallery-stack">
      <Space size={16} wrap>
        <Checkbox defaultChecked>{s.checkbox}</Checkbox>
        <Checkbox indeterminate>{s.indeterminate}</Checkbox>
        <Checkbox disabled>{s.disabled}</Checkbox>
      </Space>
      <Space size={16} wrap>
        <Radio defaultChecked>{s.radio}</Radio>
        <Radio>{s.radio}</Radio>
        <Radio disabled>{s.disabled}</Radio>
      </Space>
      <Space size={16} wrap align="center">
        <Switch checked={switchOn} onChange={setSwitchOn} />
        <Switch checked={checked} onChange={setChecked} size="small" />
        <Switch disabled />
      </Space>
      <Rate />
    </div>
  );
};

const SliderRow: React.FC = () => {
  const [value, setValue] = useState(1);
  return (
    <div className="gonavi-component-gallery-stack">
      <Slider defaultValue={40} />
      <Slider range defaultValue={[20, 70]} />
      <div className="gonavi-component-gallery-row">
        <span className="gonavi-component-gallery-label">ThemeSettingsSlider</span>
        <div style={{ flex: 1, minWidth: 220 }}>
          <ThemeSettingsSlider
            min={0.8}
            max={1.25}
            step={0.05}
            value={value}
            unit="percent"
            onChange={setValue}
          />
        </div>
      </div>
    </div>
  );
};

const DateRow: React.FC = () => (
  <Space size={12} wrap>
    <DatePicker />
    <DatePicker.RangePicker />
    <TimePicker />
    <ColorPicker defaultValue="#15803d" />
  </Space>
);

const InputGrid: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="gonavi-component-gallery-row">
      <span className="gonavi-component-gallery-label">{t('gallery.sample.primary')}</span>
      <Input style={{ width: 180 }} defaultValue="orders" />
    </div>
  );
};

export const formsSection: GallerySectionDef = {
  id: 'forms',
  group: 'project',
  titleKey: 'gallery.section.forms.title',
  descKey: 'gallery.section.forms.desc',
  items: [
    {
      id: 'forms-text-input',
      name: 'Input / TextArea / InputNumber',
      source: 'antd 5',
      render: () => <TextInputRow />,
    },
    {
      id: 'forms-select',
      name: 'Select / TreeSelect / Cascader',
      source: 'antd 5',
      render: () => <SelectRow />,
    },
    {
      id: 'forms-choice',
      name: 'Checkbox / Radio / Switch / Rate',
      source: 'antd 5',
      render: () => <ChoiceRow />,
    },
    {
      id: 'forms-slider',
      name: 'Slider / ThemeSettingsSlider',
      source: 'appShell/ThemeSettingsSlider.tsx',
      render: () => <SliderRow />,
    },
    {
      id: 'forms-date',
      name: 'DatePicker / TimePicker / ColorPicker',
      source: 'antd 5',
      render: () => <DateRow />,
    },
    {
      id: 'forms-inline-field',
      name: 'Inline Field Row',
      source: 'appShell/settings/DataTableSettingsFields.tsx',
      render: () => <InputGrid />,
    },
  ],
};
