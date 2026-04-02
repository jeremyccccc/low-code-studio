import type { CSSProperties } from 'react';
import { Button, Card, DatePicker, Flex, Radio, Select, Typography } from 'antd';
import { createId } from './create-id';
import type { MaterialDefinition, MaterialPlugin, RendererProps } from './types';

function ContainerRenderer({ node, children }: RendererProps) {
  const style: CSSProperties = {
    background: String(node.props.background ?? '#ffffff'),
    minHeight: 80,
  };

  return (
    <Card
      styles={{
        body: {
          padding: Number(node.props.padding ?? 16),
        },
      }}
      style={style}
      bordered
    >
      <Flex
        vertical={String(node.props.direction ?? 'column') !== 'row'}
        gap={Number(node.props.gap ?? 12)}
      >
        {children}
      </Flex>
    </Card>
  );
}

function TextRenderer({ node }: RendererProps) {
  const style: CSSProperties = {
    color: String(node.props.color ?? '#1f2937'),
    fontSize: Number(node.props.fontSize ?? 16),
    fontWeight: String(node.props.weight ?? '400') as CSSProperties['fontWeight'],
    lineHeight: 1.5,
  };

  return (
    <Typography.Paragraph style={style}>
      {String(node.props.text ?? '')}
    </Typography.Paragraph>
  );
}

function ButtonRenderer({ node }: RendererProps) {
  const variant = String(node.props.variant ?? 'primary');
  return (
    <Button
      type={variant === 'primary' ? 'primary' : 'default'}
      size="large"
      style={{ alignSelf: 'flex-start' }}
    >
      {String(node.props.text ?? '按钮')}
    </Button>
  );
}

function SelectRenderer({ node }: RendererProps) {
  const options = parseChoiceOptions(node.props.options);
  return (
    <Select
      style={{ minWidth: 220, alignSelf: 'flex-start' }}
      placeholder={String(node.props.placeholder ?? '请选择')}
      defaultValue={String(node.props.value ?? '') || undefined}
      options={options}
    />
  );
}

function DatePickerRenderer({ node }: RendererProps) {
  return (
    <DatePicker
      style={{ minWidth: 220, alignSelf: 'flex-start' }}
      placeholder={String(node.props.placeholder ?? '请选择日期')}
    />
  );
}

function RadioRenderer({ node }: RendererProps) {
  const options = parseChoiceOptions(node.props.options);
  return (
    <Radio.Group
      style={{ alignSelf: 'flex-start' }}
      defaultValue={String(node.props.value ?? '') || undefined}
      options={options}
      optionType="default"
    />
  );
}

const builtinMaterials: MaterialDefinition[] = [
  {
    type: 'container',
    title: '容器',
    description: '承载其他组件的布局容器',
    icon: 'Layout',
    allowsChildren: true,
    createDefaultNode: () => ({
      id: createId(),
      type: 'container',
      name: '容器',
      props: {
        direction: 'column',
        gap: 12,
        padding: 16,
        background: '#ffffff',
      },
      children: [],
    }),
    setterSchema: [
      {
        type: 'select',
        label: '排列方向',
        path: 'direction',
        options: [
          { label: '纵向', value: 'column' },
          { label: '横向', value: 'row' },
        ],
      },
      {
        type: 'number',
        label: '间距',
        path: 'gap',
        min: 0,
        max: 80,
        step: 4,
      },
      {
        type: 'number',
        label: '内边距',
        path: 'padding',
        min: 0,
        max: 120,
        step: 4,
      },
      {
        type: 'text',
        label: '背景色',
        path: 'background',
        placeholder: '#ffffff',
      },
    ],
    component: ContainerRenderer,
  },
  {
    type: 'text',
    title: '文本',
    description: '标题、说明、标签都可以复用这一类',
    icon: 'Type',
    allowsChildren: false,
    createDefaultNode: () => ({
      id: createId(),
      type: 'text',
      name: '文本',
      props: {
        text: '新的文本内容',
        fontSize: 16,
        color: '#1f2937',
        weight: '400',
      },
      children: [],
    }),
    setterSchema: [
      {
        type: 'textarea',
        label: '内容',
        path: 'text',
        placeholder: '请输入文本',
      },
      {
        type: 'number',
        label: '字号',
        path: 'fontSize',
        min: 12,
        max: 72,
        step: 1,
      },
      {
        type: 'text',
        label: '颜色',
        path: 'color',
        placeholder: '#1f2937',
      },
      {
        type: 'select',
        label: '字重',
        path: 'weight',
        options: [
          { label: '常规', value: '400' },
          { label: '中等', value: '500' },
          { label: '加粗', value: '700' },
        ],
      },
    ],
    component: TextRenderer,
  },
  {
    type: 'button',
    title: '按钮',
    description: '预留动作系统入口，后续可接事件编排',
    icon: 'Pointer',
    allowsChildren: false,
    createDefaultNode: () => ({
      id: createId(),
      type: 'button',
      name: '按钮',
      props: {
        text: '点击按钮',
        variant: 'primary',
      },
      children: [],
    }),
    setterSchema: [
      {
        type: 'text',
        label: '按钮文案',
        path: 'text',
        placeholder: '请输入按钮文案',
      },
      {
        type: 'select',
        label: '样式',
        path: 'variant',
        options: [
          { label: '主按钮', value: 'primary' },
          { label: '次按钮', value: 'secondary' },
        ],
      },
    ],
    component: ButtonRenderer,
  },
  {
    type: 'select',
    title: '下拉框',
    description: '基于 antd Select 的选择器',
    icon: 'Select',
    allowsChildren: false,
    createDefaultNode: () => ({
      id: createId(),
      type: 'select',
      name: '下拉框',
      props: {
        placeholder: '请选择城市',
        value: 'beijing',
        options: '北京:beijing,上海:shanghai,深圳:shenzhen',
      },
      children: [],
    }),
    setterSchema: [
      {
        type: 'text',
        label: '占位文本',
        path: 'placeholder',
        placeholder: '请输入占位文本',
      },
      {
        type: 'text',
        label: '默认值',
        path: 'value',
        placeholder: '请输入默认值',
      },
      {
        type: 'textarea',
        label: '选项',
        path: 'options',
        placeholder: '格式: 北京:beijing,上海:shanghai',
      },
    ],
    component: SelectRenderer,
  },
  {
    type: 'date-picker',
    title: '日历',
    description: '基于 antd DatePicker 的日期选择器',
    icon: 'Calendar',
    allowsChildren: false,
    createDefaultNode: () => ({
      id: createId(),
      type: 'date-picker',
      name: '日历',
      props: {
        placeholder: '请选择日期',
      },
      children: [],
    }),
    setterSchema: [
      {
        type: 'text',
        label: '占位文本',
        path: 'placeholder',
        placeholder: '请输入占位文本',
      },
    ],
    component: DatePickerRenderer,
  },
  {
    type: 'radio',
    title: '单选框',
    description: '基于 antd Radio.Group 的单选组件',
    icon: 'Radio',
    allowsChildren: false,
    createDefaultNode: () => ({
      id: createId(),
      type: 'radio',
      name: '单选框',
      props: {
        value: 'a',
        options: '选项A:a,选项B:b,选项C:c',
      },
      children: [],
    }),
    setterSchema: [
      {
        type: 'text',
        label: '默认值',
        path: 'value',
        placeholder: '请输入默认值',
      },
      {
        type: 'textarea',
        label: '选项',
        path: 'options',
        placeholder: '格式: 选项A:a,选项B:b',
      },
    ],
    component: RadioRenderer,
  },
];

export const builtinMaterialPlugin: MaterialPlugin = {
  name: 'builtin-materials',
  materials: builtinMaterials,
};

function parseChoiceOptions(raw: unknown) {
  const source = String(raw ?? '').trim();
  if (!source) {
    return [];
  }

  return source
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, value] = item.split(':').map((segment) => segment.trim());
      return {
        label: label || value || item,
        value: value || label || item,
      };
    });
}
