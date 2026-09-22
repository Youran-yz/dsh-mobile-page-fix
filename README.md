# dsh-mobile-page-fix

[English](#english) | **简体中文**

面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）web profile 的手机端**页面级**修复，纯客户端插件、无构建步骤。

> Mobile page-level fixes for the dsh web profile: the settings dialog becomes
> a real full page, and the plugin-market tab strip stops running off screen.
> Client-only, no build step, zero effect on desktop widths.

## 修了什么

### 1. 设置页 —— 独立整页，不再悬浮

宿主把设置渲染成一个居中浮层：`VOzbGW_overlay` + `VOzbGW_mask` + 固定尺寸的 `VOzbGW_panel`。

在 360×688 的手机视口上实测：

| | 改前 | 改后 |
|---|---|---|
| panel | 312×714 | **360×688** |
| overlay | 360×688 | 360×688 |
| mask | 有 | **none** |
| options | 312×580 | 360×554 |

问题：四周空 48px、**底部还溢出 26px**（714 > 688），并且遮罩+模糊让它看起来是「浮在主界面上的一层」。

改成：铺满视口、去掉遮罩、去掉模糊、去掉圆角与阴影——视觉上就是一个独立页面。

### 2. 插件市场 —— 标签行可横滑

市场自己带了 `@container` 断点（420 / 460 / 544 / 680 / 900），大部分布局已经自适应。
**只有标签行漏了**：`.nUhMVa_tabs` 是 `display:flex`，既不换行也不滚动。

```
发现 / 主题 / 收藏 / 已安装 (4) / 高级 / 任务
                                  ↑ 超出 360px，被切掉
```

改后：

```
tabs client=328  scroll=342  overflowX=auto  wrap=nowrap
lastTab right=308  (viewport=360)
```

另外补两条：卡片在手机上单列、分类筛选行允许换行。

## 安装

```sh
dsh plugin --profile web add dsh-mobile-page-fix
```

重启 `dsh web`，然后在手机上打开 web profile。

> **注意**：如果你的 `DSH_HOME` 不是默认的 `~/.dsh`，必须先导出它，
> 否则插件会被装到另一个 profile 去：
>
> ```sh
> export DSH_HOME=/path/to/your/dsh-home
> dsh plugin --profile web add dsh-mobile-page-fix
> ```

## 生效范围

所有规则都包在 `@media (max-width: 900px)` 里，**桌面宽度完全不受影响**。

## 与 dsh-mobile-upgrade 的关系

本插件与 [dsh-mobile-upgrade](https://github.com/langyo/dsh-mobile-ui-fix) 互补，不冲突：

- `dsh-mobile-upgrade` 负责交互层（抽屉侧栏、手势、回车换行、插话按钮……）
- 本插件负责页面层（设置整页化、市场标签行）

两个都装没问题。

## 已知限制

- 类名是宿主与市场的**哈希 CSS-module 标识符**。宿主重建若重命名它们，
  对应规则会降级成空操作，其余功能不受影响。
- 纯 CSS 实现，不监听 DOM、不发请求、不存状态。
- 没有逐功能开关——想关掉某条，直接改 `client/client.js` 里的 `CSS` 数组。

## 实现

`client/client.js` 通过 `window.__ModuleLoader__.load()` 注册，在 `apply()` 里
往 `<head>` 插一个 `<style id="dsh-mobile-page-fix-style">`，注入是幂等的。

`lib/index.js` 是宿主半边，故意留空——只为让 bundle patch 有东西可挂载。

## 许可

MIT
