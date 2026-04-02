import { createId } from './create-id';
import type { PageSchema } from './types';

export const SCHEMA_VERSION = '1.0.0';

export function createInitialSchema(): PageSchema {
  return {
    version: SCHEMA_VERSION,
    root: {
      id: createId('page'),
      type: 'container',
      name: '页面',
      props: {
        direction: 'column',
        gap: 16,
        padding: 24,
        background: '#ffffff',
      },
      children: [
        {
          id: createId(),
          type: 'text',
          name: '页面标题',
          props: {
            text: '欢迎来到低代码画布',
            fontSize: 30,
            color: '#18212f',
            weight: '700',
          },
          children: [],
        },
        {
          id: createId(),
          type: 'text',
          name: '页面说明',
          props: {
            text: '你可以拖动物料到画布中，继续搭建自己的页面。',
            fontSize: 16,
            color: '#526071',
            weight: '400',
          },
          children: [],
        },
        {
          id: createId(),
          type: 'container',
          name: '表单区域',
          props: {
            direction: 'row',
            gap: 12,
            padding: 16,
            background: '#f8fbff',
          },
          children: [
            {
              id: createId(),
              type: 'select',
              name: '下拉框',
              props: {
                placeholder: '请选择城市',
                value: 'beijing',
                options: '北京:beijing,上海:shanghai,深圳:shenzhen',
              },
              children: [],
            },
            {
              id: createId(),
              type: 'date-picker',
              name: '日历',
              props: {
                placeholder: '请选择日期',
              },
              children: [],
            },
            {
              id: createId(),
              type: 'radio',
              name: '单选框',
              props: {
                value: 'a',
                options: '选项A:a,选项B:b',
              },
              children: [],
            },
          ],
        },
        {
          id: createId(),
          type: 'button',
          name: '提交按钮',
          props: {
            text: '立即开始',
            variant: 'primary',
          },
          children: [],
        },
      ],
    },
  };
}
