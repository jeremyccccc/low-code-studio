# React Low Code Studio

一个基于 React + TypeScript + Schema 驱动的低代码平台骨架，重点放在可扩展性和后续维护成本。

## 启动

```bash
npm install
npm run dev
```

本地预览生产包：

```bash
npm run build
npm run preview
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

## 部署到公网

这个项目已经补好了 `Vercel` 部署配置，默认可以直接发布为静态站点。

### 方式一：通过 Vercel 控制台

1. 登录 Vercel 并绑定 GitHub
2. 导入仓库 `jeremyccccc/low-code-studio`
3. 保持默认识别为 `Vite`
4. 构建命令使用 `npm run build`
5. 输出目录使用 `dist`
6. 点击 Deploy

部署完成后，Vercel 会生成一个公网访问地址。后续每次推送到 GitHub，都可以自动触发重新部署。

### 方式二：通过 Vercel CLI

先安装 CLI：

```bash
npm install -g vercel
```

然后在项目根目录执行：

```bash
vercel
```

首次部署完成后，如果要发正式地址：

```bash
vercel --prod
```

### 说明

- 当前项目是单页应用，`vercel.json` 已经包含 SPA rewrite，直接刷新子路径不会 404
- 当前项目没有必须的环境变量，可以直接部署
- 如果只是想先在本机确认生产效果，可以使用 `npm run build && npm run preview`
