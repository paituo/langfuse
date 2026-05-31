# Langfuse 国际化（i18n）实施指南

## 📋 概述

本项目已成功集成 **next-intl** 国际化库，支持中文（简体）和英文双语切换。

## 🏗️ 项目结构

```
web/
├── messages/                    # 语言包目录
│   ├── en.json                 # 英文语言包
│   └── zh-CN.json              # 中文（简体）语言包
├── src/
│   ├── i18n/                   # 国际化配置
│   │   ├── request.ts          # 服务端请求配置
│   │   ├── config.ts           # 语言配置（locales, defaultLocale）
│   │   ├── formatting.ts       # 日期/数字格式化工具
│   │   ├── useFormatting.ts    # React Hook（客户端格式化）
│   │   └── index.ts            # 统一导出
│   ├── middleware.ts            # 中间件（路由 locale 前缀）
│   └── components/
│       └── LanguageSwitcher.tsx # 语言切换组件
└── next.config.mjs             # 已配置 next-intl 插件
```

## ✅ 已完成的工作

### 1. **安装依赖**
- ✅ 安装 `next-intl@^4.12.0`
- ✅ 配置 Next.js 插件系统

### 2. **核心配置**
- ✅ 创建 i18n/request.ts（服务端消息加载）
- ✅ 创建 i18n/config.ts（支持 en, zh-CN）
- ✅ 更新 middleware.ts（自动添加 locale 路由前缀）
- ✅ 更新 next.config.mjs（移除旧 i18n 配置，使用插件）

### 3. **语言包**
- ✅ 创建 messages/en.json（完整英文翻译，覆盖主要模块）
- ✅ 创建 messages/zh-CN.json（完整中文翻译，覆盖主要模块）

**已翻译的模块包括：**
- common - 通用文案（按钮、状态、操作等）
- nav - 导航菜单
- auth - 认证相关
- traces - 追踪功能
- traceDetail - 追踪详情
- prompts - 提示词管理
- datasets - 数据集管理
- experiments - 实验管理
- evaluations - 评估功能
- dashboard - 仪表盘
- settings - 设置页面
- language - 语言切换

### 4. **组件和工具**
- ✅ 创建 LanguageSwitcher 组件（带地球图标的选择器）
- ✅ 实现完整的本地化格式化工具：
  - `formatDate()` - 日期格式化
  - `formatRelativeTime()` - 相对时间（如"3分钟前"）
  - `formatNumber()` - 数字格式化（千分位等）
  - `formatCurrency()` - 货币格式化
  - `formatPercentage()` - 百分比格式化
  - `formatTokens()` - Token 数量格式化（K/M单位）
  - `formatDuration()` - 时间持续时间格式化

### 5. **应用集成**
- ✅ 更新 _app.tsx（包裹 NextIntlClientProvider）
- ✅ 创建 [locale]/layout.tsx（App Router 支持）

## 📖 使用指南

### 1. **在组件中使用翻译**

#### 基础用法
```tsx
import { useTranslations } from "next-intl";

function MyComponent() {
  const t = useTranslations("common");

  return (
    <div>
      <button>{t("save")}</button>  {/* 显示 "保存" 或 "Save" */}
      <span>{t("loading")}</span>  {/* 显示 "加载中..." 或 "Loading..." */}
    </div>
  );
}
```

#### 带参数的翻译
```tsx
// 在 JSON 中定义：
// "welcome": "欢迎 {name}，您有 {count} 条新消息"
// "welcome": "Welcome {name}, you have {count} new messages"

function Welcome() {
  const t = useTranslations("common");
  return <p>{t("welcome", { name: "张三", count: 5 })}</p>;
}
```

#### 复数形式
```tsx
// 在 JSON 中定义：
// "itemCount": "{count, plural, =0 {没有项目} one {# 个项目} other {# 个项目}}"

function ItemList({ count }: { count: number }) {
  const t = useTranslations("common");
  return <span>{t("itemCount", { count })}</span>;
}
```

### 2. **使用本地化格式化**

```tsx
import { useFormatting } from "@/src/i18n";

function TraceInfo({ trace }: { trace: TraceType }) {
  const { formatDate, formatDuration, formatTokens } = useFormatting();

  return (
    <div>
      <p>时间: {formatDate(trace.timestamp)}</p>
      <p>耗时: {formatDuration(trace.duration)}</p>
      <p>Token: {formatTokens(trace.totalTokens)}</p>
    </div>
  );
}
```

### 3. **服务端组件中使用**

```tsx
import { getTranslations } from "next-intl/server";

async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations("traces");

  return (
    <h1>{t("title")}</h1>  // 显示 "追踪" 或 "Traces"
  );
}
```

### 4. **语言切换组件**

```tsx
import { LanguageSwitcher } from "@/src/components/LanguageSwitcher";

function Header() {
  return (
    <header>
      <nav>...</nav>
      <LanguageSwitcher />
    </header>
  );
}
```

## 🔧 迁移现有组件示例

### ❌ **迁移前（硬编码英文）**
```tsx
// web/src/components/NoDataOrLoading.tsx (原始版本)
const NoData = ({
  noDataText = "No data",  // 硬编码英文
  children,
  className,
}: NoDataProps) => {
  return (
    <div className={cn(...)}>
      <p className="text-muted-foreground">{noDataText}</p>
      {children}
    </div>
  );
};

export function NoDataOrLoading({
  isLoading,
  description,
  href,
  className,
}: NoDataOrLoadingProps) {
  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <NoData noDataText="No data" className={className}>  // 再次硬编码
      {description && <DocPopup description={description} href={href} />}
    </NoData>
  );
}
```

### ✅ **迁移后（国际化版本）**
```tsx
// web/src/components/NoDataOrLoading.tsx (国际化后)
"use client";  // 客户端组件需要此标记

import React from "react";
import { cn } from "@/src/utils/tailwind";
import DocPopup from "@/src/components/layouts/doc-popup";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useTranslations } from "next-intl";  // 引入 hook

interface NoDataOrLoadingProps {
  isLoading: boolean;
  description?: string;
  href?: string;
  className?: string;
}

interface NoDataProps {
  noDataText?: string;  // 保留自定义能力
  children?: React.ReactNode;
  className?: string;
}

const NoData = ({
  noDataText,
  children,
  className,
}: NoDataProps) => {
  const t = useTranslations("common");  // 使用翻译

  // 如果有传入自定义文本则使用，否则使用翻译文本
  const displayText = noDataText || t("noData");

  return (
    <div
      className={cn(
        "flex h-3/4 min-h-36 w-full items-center justify-center rounded-md border border-dashed",
        className,
      )}
    >
      <p className="text-muted-foreground">{displayText}</p>
      {children}
    </div>
  );
};

export function NoDataOrLoading({
  isLoading,
  description,
  href,
  className,
}: NoDataOrLoadingProps) {
  const t = useTranslations("common");  // 在每个组件中使用

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex h-3/4 min-h-36 w-full items-center justify-center rounded-md",
          className,
        )}
      >
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <NoData className={className}>
      {/* 使用翻译后的文本 */}
      <span className="text-muted-foreground mr-2">{t("noData")}</span>
      {description && <DocPopup description={description} href={href} />}
    </NoData>
  );
}
```

## 🎯 下一步工作建议

### 优先级 P0 - 核心页面（立即开始）

1. **导航栏和侧边栏**
   - [ ] `web/src/components/layouts/header.tsx`
   - [ ] 所有导航菜单项

2. **认证流程**
   - [ ] `web/src/pages/auth/sign-in.tsx`
   - [ ] `web/src/pages/auth/sign-up.tsx`
   - [ ] 错误提示信息

3. **仪表盘首页**
   - [ ] `web/src/pages/project/[projectId]/index.tsx`
   - [ ] 统计卡片、图表标题

### 优先级 P1 - 主要功能模块

4. **追踪列表页**
   - [ ] 表头、筛选器、按钮文本
   - [ ] 状态标签、空状态提示

5. **追踪详情页**
   - [ ] Tab 标签、元数据字段名
   - [ ] 工具提示、操作按钮

6. **提示词管理**
   - [ ] 列表、创建/编辑表单
   - [ ] 版本历史界面

### 优先级 P2 - 辅助功能

7. **设置页面**
   - [ ] 表单标签、按钮、验证消息
   - [ ] 危险区域警告文本

8. **数据集和实验**
   - [ ] 数据项编辑界面
   - [ ] 实验对比视图

## 🛠️ 开发工作流

### 添加新的翻译键

1. **更新语言包**
   ```bash
   # 编辑 messages/en.json 和 messages/zh-CN.json
   ```

2. **在组件中使用**
   ```tsx
   import { useTranslations } from "next-intl";
   const t = useTranslations("moduleName");
   <span>{t("newKey")}</span>
   ```

### 提取硬编码文本的正则表达式

使用以下正则在代码库中查找需要国际化的硬编码字符串：

```regex
(>|\"|'|\{)([A-Z][a-z]+[\w\s]*[a-z])(<|\"|'|})
```

或者更精确地查找 JSX 文本内容：

```regex
>[A-Z][\w\s]{2,}<
```

### 测试翻译效果

```bash
# 启动开发服务器
cd web && pnpm dev

# 访问不同语言版本
http://localhost:3000/en     # 英文版
http://localhost:3000/zh-CN  # 中文版
```

## ⚠️ 注意事项

1. **不要翻译的内容：**
   - API 密钥、ID、技术标识符
   - URL 路径参数
   - 代码片段和日志
   - 模型名称（如 gpt-4, claude-3）

2. **特殊场景处理：**
   - 长文本考虑换行
   - 数字/日期必须使用格式化工具
   - 复数形式使用 ICU MessageFormat 语法

3. **性能优化：**
   - 服务端组件使用 `getTranslations()`
   - 客户端组件使用 `useTranslations()`
   - 避免在循环中重复调用翻译函数

## 📊 当前进度统计

- **总翻译条目**: ~200+ 条核心文案
- **覆盖模块**: 12 个主要功能模块
- **支持语言**: 中文（简体）、英文
- **代码文件变更**: 10+ 个新增/修改文件

## 🚀 快速开始迁移

选择一个简单组件开始练习：

```bash
# 1. 找一个包含硬编码英文的组件
grep -r "No data" web/src/components/

# 2. 添加翻译到语言包
# 编辑 messages/en.json 和 messages/zh-CN.json

# 3. 修改组件引入 useTranslations

# 4. 测试两种语言显示效果
```

---

**预计完成完整国际化需要：**
- 核心页面：2-3 天
- 全部 UI 组件：1-2 周
- 测试和优化：3-5 天

**总计预估：2-3 周完成完整的中文本地化。**
