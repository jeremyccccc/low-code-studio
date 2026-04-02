import type { CSSProperties } from 'react';
import { createId } from '../core/create-id';
import type { EditorPlugin, RendererProps } from '../core/types';

function HeroBannerRenderer({ node }: RendererProps) {
  const style: CSSProperties = {
    padding: '28px',
    borderRadius: 24,
    background: `linear-gradient(135deg, ${String(node.props.backgroundFrom ?? '#0f172a')}, ${String(node.props.backgroundTo ?? '#1d4ed8')})`,
    color: '#ffffff',
  };

  return (
    <section style={style}>
      <p style={{ margin: 0, opacity: 0.78 }}>{String(node.props.eyebrow ?? '业务场景')}</p>
      <h3 style={{ margin: '10px 0 8px', fontSize: 28 }}>{String(node.props.title ?? '新的区块')}</h3>
      <p style={{ margin: 0, maxWidth: 520, opacity: 0.9 }}>{String(node.props.description ?? '')}</p>
    </section>
  );
}

export const marketingPlugin: EditorPlugin = {
  name: 'marketing-plugin',
  materials: [
    {
      type: 'hero-banner',
      title: '横幅区块',
      description: '适合首页头图、营销区块和活动 Banner',
      icon: 'Sparkles',
      allowsChildren: false,
      createDefaultNode: () => ({
        id: createId(),
        type: 'hero-banner',
        name: '横幅区块',
        props: {
          eyebrow: '新物料插件',
          title: '通过插件机制扩展你的低代码平台',
          description: '这个物料来自独立插件文件，后续你可以按业务线拆出更多物料包。',
          backgroundFrom: '#0f172a',
          backgroundTo: '#2563eb',
        },
        children: [],
      }),
      setterSchema: [
        {
          type: 'text',
          label: '眉标题',
          path: 'eyebrow',
          placeholder: '请输入眉标题',
        },
        {
          type: 'text',
          label: '主标题',
          path: 'title',
          placeholder: '请输入主标题',
        },
        {
          type: 'textarea',
          label: '说明',
          path: 'description',
          placeholder: '请输入说明',
        },
        {
          type: 'text',
          label: '起始色',
          path: 'backgroundFrom',
          placeholder: '#0f172a',
        },
        {
          type: 'text',
          label: '结束色',
          path: 'backgroundTo',
          placeholder: '#2563eb',
        },
      ],
      component: HeroBannerRenderer,
    },
  ],
};
