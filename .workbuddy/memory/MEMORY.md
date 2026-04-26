# Directix 项目长期记忆

## 项目概述
**Directix** 是一个全面、易用、高性能的 Vue 自定义指令库，支持 Vue 2 和 Vue 3。

## 版本历史
- **v2.0.0** (2026-04-26): Web Components 支持，保留 Vue 2 兼容性
- **v1.11.0** (2026-05-13): 企业级功能、性能优化、迁移工具
- **v1.0.0** (2026-03-27): 核心指令、基础文档

## 核心架构
```
directix/
├── packages/
│   ├── core/           # 核心适配层（Vue 2/3）
│   ├── shared/         # 共享工具库
│   └── i18n/          # 国际化
├── src/
│   ├── directives/     # 57+ 指令实现
│   ├── composables/    # 41+ 组合式 API
│   └── web-components.ts  # Web Components 支持
└── docs/              # VitePress 文档站点
```

## 关键技术决策

### Vue 2/3 兼容性
- **保留双版本支持**：v2.0.0 不移除 Vue 2 代码
- **适配器模式**：`packages/core/src/adapter/vue2.ts` 和 `vue3.ts`
- **运行时检测**：`isVue2()`, `isVue3()`, `setVueVersion()`

### Web Components 支持（v2.0.0 新增）
- **框架无关**：指令可用于自定义元素
- **零开销**：未使用时不影响包体积
- **API 设计**：
  - `defineCustomElementDirective()` - 定义自定义元素
  - `registerDirectiveElements()` - 批量注册
  - `applyDirectiveToCustomElement()` - 应用到现有元素

### 性能优化策略
- **Vue 3 条件优化**：markRaw, shallowReactive（仅 Vue 3）
- **Tree-shaking**：按需引入，单指令 < 2KB gzip
- **包体积**：v2.0.0 比 v1.11.0 减小 10-15%

## 开发规范
- **语言**：TypeScript 5.x
- **构建**：Vite + tsdown
- **测试**：Vitest + Playwright
- **文档**：VitePress（中英双语）
- **包管理**：pnpm
- **提交规范**：Conventional Commits

## 重要文件位置
- 开发计划：`internal/development-plan.md`
- 变更日志：`CHANGELOG.md`
- 迁移指南：`docs/migration/v2-migration-guide.md`
- Web Components：`src/web-components.ts`
- Vue 2 适配器：`packages/core/src/adapter/vue2.ts`
- Vue 3 适配器：`packages/core/src/adapter/vue3.ts`

## 发布流程
1. 更新 `package.json` 版本号
2. 更新 `CHANGELOG.md`
3. 运行 `pnpm build` 构建产物
4. 运行 `pnpm test` 确保测试通过
5. 运行 `pnpm pub` 发布到 npm

## 注意事项
- **不要删除 Vue 2 适配器**：v2.0.0 继续支持 Vue 2
- **保持向后兼容**：所有 v1.x API 必须继续工作
- **Web Components 可选**：不强制使用，保持零开销
