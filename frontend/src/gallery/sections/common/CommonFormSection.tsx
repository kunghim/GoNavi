import React, { useEffect, useState } from 'react';
import {
  Button,
  Calendar,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  Space,
  Upload,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { useI18n } from '../../../i18n/provider';
import { useSampleText } from '../../sampleText';
import type { GallerySectionDef } from '../../galleryRegistry';

// 通用表单分区：antd 5 的表单控件面（Form / Form.List / Mentions / Upload / Calendar）。
// 用户可见文案统一走 sampleText，组件名与区域码属于技术字面量，保持英文原样。

// apac / emea / amer 是示例数据的区域标识符，属于技术字面量，不翻译。
const REGION_OPTIONS = [
  { value: 'apac', label: 'apac' },
  { value: 'emea', label: 'emea' },
  { value: 'amer', label: 'amer' },
];

const BasicFormDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <Form layout="vertical" style={{ width: '100%', maxWidth: 420 }}>
      <Form.Item
        label={s.formUsername}
        required
        help={s.formRequiredError}
        extra={s.formNotePlaceholder}
      >
        <Input placeholder={s.formUsernamePlaceholder} />
      </Form.Item>
      <Form.Item label={s.formEmail}>
        <Input placeholder={s.formEmailPlaceholder} />
      </Form.Item>
      <Form.Item label={s.formNote}>
        <Input.TextArea rows={2} placeholder={s.formNotePlaceholder} />
      </Form.Item>
      <Form.Item label={s.option}>
        <Space wrap>
          <Select style={{ width: 150 }} options={REGION_OPTIONS} />
          <InputNumber style={{ width: 130 }} defaultValue={128} />
        </Space>
      </Form.Item>
    </Form>
  );
};

const ValidationFormDemo: React.FC = () => {
  const s = useSampleText();
  const [form] = Form.useForm();

  // 默认直接铺出错误态，让画廊一眼看到校验反馈样式；字段改动后仍走 rules 重新校验。
  useEffect(() => {
    form.setFields([
      { name: 'username', errors: [s.formRequiredError] },
      { name: 'email', errors: [s.formEmailError] },
      { name: 'password', errors: [s.formPasswordError] },
      { name: 'confirm', errors: [s.formMismatchError] },
    ]);
  }, [form, s]);

  return (
    <Form
      form={form}
      name="gallery-validation"
      layout="vertical"
      style={{ width: '100%', maxWidth: 420 }}
    >
      <Form.Item
        label={s.formUsername}
        name="username"
        rules={[{ required: true, message: s.formRequiredError }]}
      >
        <Input placeholder={s.formUsernamePlaceholder} />
      </Form.Item>
      <Form.Item
        label={s.formEmail}
        name="email"
        rules={[
          { required: true, message: s.formRequiredError },
          { type: 'email', message: s.formEmailError },
        ]}
      >
        <Input placeholder={s.formEmailPlaceholder} />
      </Form.Item>
      <Form.Item
        label={s.formPassword}
        name="password"
        rules={[
          { required: true, message: s.formRequiredError },
          { min: 6, message: s.formPasswordError },
        ]}
      >
        <Input.Password placeholder={s.formPasswordPlaceholder} />
      </Form.Item>
      <Form.Item
        label={s.formConfirm}
        name="confirm"
        dependencies={['password']}
        rules={[
          { required: true, message: s.formRequiredError },
          ({ getFieldValue }) => ({
            validator: (_rule, value) =>
              !value || getFieldValue('password') === value
                ? Promise.resolve()
                : Promise.reject(new Error(s.formMismatchError)),
          }),
        ]}
      >
        <Input.Password placeholder={s.formPasswordPlaceholder} />
      </Form.Item>
    </Form>
  );
};

const FormListDemo: React.FC = () => {
  const { t } = useI18n();
  const s = useSampleText();
  return (
    <Form
      name="gallery-form-list"
      layout="vertical"
      initialValues={{ rows: [{}] }}
      style={{ width: '100%', maxWidth: 640 }}
    >
      <Form.List name="rows">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...rest }) => (
              <Space key={key} align="start" wrap>
                <Form.Item {...rest} name={[name, 'note']} style={{ marginBottom: 8 }}>
                  <Input style={{ width: 220 }} placeholder={s.formNotePlaceholder} />
                </Form.Item>
                <Form.Item {...rest} name={[name, 'option']} style={{ marginBottom: 8 }}>
                  <Select
                    style={{ width: 160 }}
                    options={[
                      { value: '1', label: t('gallery.sample.text.option_index', { index: 1 }) },
                      { value: '2', label: t('gallery.sample.text.option_index', { index: 2 }) },
                      { value: '3', label: t('gallery.sample.text.option_index', { index: 3 }) },
                    ]}
                  />
                </Form.Item>
                <Button onClick={() => remove(name)}>{s.formRemoveItem}</Button>
              </Space>
            ))}
            <Button onClick={() => add()}>{s.formAddItem}</Button>
          </>
        )}
      </Form.List>
    </Form>
  );
};

const LayoutFormDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <div className="gonavi-component-gallery-row" style={{ alignItems: 'flex-start', gap: 24 }}>
        <Form layout="horizontal" labelCol={{ span: 7 }} style={{ flex: '1 1 240px' }}>
          <Form.Item label={s.formUsername}>
            <Input placeholder={s.formUsernamePlaceholder} />
          </Form.Item>
          <Form.Item label={s.formEmail}>
            <Input placeholder={s.formEmailPlaceholder} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">{s.formSubmit}</Button>
          </Form.Item>
        </Form>
        <Form layout="vertical" style={{ flex: '1 1 240px' }}>
          <Form.Item label={s.formUsername}>
            <Input placeholder={s.formUsernamePlaceholder} />
          </Form.Item>
          <Form.Item label={s.formEmail}>
            <Input placeholder={s.formEmailPlaceholder} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">{s.formSubmit}</Button>
          </Form.Item>
        </Form>
        <Form layout="inline" style={{ flex: '1 1 240px' }}>
          <Form.Item label={s.formUsername}>
            <Input placeholder={s.formUsernamePlaceholder} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">{s.formSubmit}</Button>
          </Form.Item>
        </Form>
      </div>
      <div className="gonavi-component-gallery-row" style={{ alignItems: 'flex-start', gap: 24 }}>
        <Form layout="vertical" size="large" style={{ flex: '1 1 240px' }}>
          <Form.Item label={s.formUsername}>
            <Input placeholder={s.formUsernamePlaceholder} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">{s.formSubmit}</Button>
          </Form.Item>
        </Form>
        <Form layout="vertical" size="small" style={{ flex: '1 1 240px' }}>
          <Form.Item label={s.formUsername}>
            <Input placeholder={s.formUsernamePlaceholder} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">{s.formSubmit}</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const MentionsDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack" style={{ maxWidth: 420 }}>
      <Mentions
        options={[
          { value: 'analyst', label: 'analyst' },
          { value: 'dba', label: 'dba' },
          { value: 'owner', label: 'owner' },
        ]}
        placeholder={s.formMentionPlaceholder}
        prefix="@"
        autoSize={{ minRows: 2, maxRows: 5 }}
      />
    </div>
  );
};

const UploadDemo: React.FC = () => {
  const s = useSampleText();
  const [fileList, setFileList] = useState<UploadFile[]>([
    { uid: 'orders-csv', name: 'orders.csv', status: 'done', size: 2048 },
    { uid: 'region-png', name: 'region.png', status: 'done', size: 4096 },
  ]);
  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
  };

  // beforeUpload 恒返回 false，action 只是占位，永远不会真的发起上传请求。
  const beforeUpload = () => false;

  return (
    <div className="gonavi-component-gallery-row" style={{ alignItems: 'flex-start', gap: 24 }}>
      <Upload.Dragger
        name="file"
        multiple
        action="#"
        beforeUpload={beforeUpload}
        fileList={fileList}
        onChange={handleChange}
        style={{ width: 360 }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{s.formUploadHint}</p>
        <p className="ant-upload-hint">{s.formUploadLimit}</p>
      </Upload.Dragger>
      <Upload
        listType="picture-card"
        action="#"
        beforeUpload={beforeUpload}
        fileList={fileList}
        onChange={handleChange}
      >
        <div style={{ padding: 8 }}>
          <PlusOutlined />
        </div>
      </Upload>
    </div>
  );
};

const CalendarDemo: React.FC = () => {
  const s = useSampleText();
  return (
    <div className="gonavi-component-gallery-stack">
      <div className="gonavi-component-gallery-row" style={{ alignItems: 'flex-start', gap: 24 }}>
        <div style={{ width: 320 }}>
          <span className="gonavi-component-gallery-label">{s.default}</span>
          <div style={{ maxHeight: 280, overflow: 'auto' }}>
            <Calendar />
          </div>
        </div>
        <div style={{ width: 320 }}>
          <span className="gonavi-component-gallery-label">cellRender</span>
          <div style={{ maxHeight: 280, overflow: 'auto' }}>
            <Calendar
              cellRender={(current, info) => {
                if (info.type !== 'date') return info.originNode;
                const weekend = current.day() === 0 || current.day() === 6;
                return (
                  <div
                    style={{
                      color: weekend ? 'var(--gn-danger)' : undefined,
                      fontWeight: weekend ? 600 : 400,
                    }}
                  >
                    {current.date()}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const commonFormSection: GallerySectionDef = {
  id: 'common-form',
  group: 'common',
  titleKey: 'gallery.section.common-form.title',
  descKey: 'gallery.section.common-form.desc',
  items: [
    {
      id: 'common-form-basic',
      name: 'Form / Form.Item',
      source: 'antd 5',
      render: () => <BasicFormDemo />,
    },
    {
      id: 'common-form-validation',
      name: 'Form Validation',
      source: 'antd 5',
      render: () => <ValidationFormDemo />,
    },
    {
      id: 'common-form-list',
      name: 'Form.List',
      source: 'antd 5',
      wide: true,
      render: () => <FormListDemo />,
    },
    {
      id: 'common-form-layout',
      name: 'Form Layout & Size',
      source: 'antd 5',
      wide: true,
      render: () => <LayoutFormDemo />,
    },
    {
      id: 'common-form-mentions',
      name: 'Mentions',
      source: 'antd 5',
      render: () => <MentionsDemo />,
    },
    {
      id: 'common-form-upload',
      name: 'Upload',
      source: 'antd 5',
      wide: true,
      render: () => <UploadDemo />,
    },
    {
      id: 'common-form-calendar',
      name: 'Calendar',
      source: 'antd 5',
      wide: true,
      render: () => <CalendarDemo />,
    },
  ],
};
