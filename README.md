# React Low Code Studio

一个基于 React + TypeScript + Schema 驱动的低代码平台骨架，重点放在可扩展性和后续维护成本。

## 启动

```bash
npm install
npm run dev
```

## 当前能力

- 左侧物料区，支持按注册表新增组件
- 中间画布，基于 schema 实时渲染
- 右侧属性面板，基于 `setterSchema` 自动生成配置表单
- 撤销、重做、schema 复制、本地持久化
- 插件机制，支持按业务拆分物料包

## 目录说明

- `src/core`：低代码核心模型、树操作、物料注册、插件运行时
- `src/store`：编辑器状态和 schema 历史
- `src/components`：编辑器 UI
- `src/plugins`：业务插件示例

## 怎么扩展

1. 在 `src/plugins` 下新增一个插件文件，导出 `EditorPlugin`
2. 注册新的 `materials`
3. 为每个物料提供：
   - `createDefaultNode`
   - `component`
   - `setterSchema`
4. 在 `src/App.tsx` 中把插件传给 `createPluginRuntime`

## 下一步建议

- 接入拖拽排序和节点移动
- 增加事件系统与动作编排
- 增加数据源面板、接口绑定和变量系统
- 增加 schema 校验与版本迁移策略
- 拆出 renderer 包与 editor 包，支持运行时独立部署
