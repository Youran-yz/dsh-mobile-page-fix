/**
 * dsh-mobile-page-fix — client half.
 *
 * Injects a small stylesheet into the web profile page. Everything is scoped
 * behind `@media (max-width: 900px)` so desktop widths are untouched.
 *
 * Two fixes:
 *   1. Settings — the host renders it as a floating dialog (`VOzbGW_overlay` +
 *      `VOzbGW_mask` + a fixed-size `VOzbGW_panel`). On a 360px viewport that
 *      leaves ~48px of dead space around the panel and overflows the bottom.
 *      Here it becomes an opaque full-viewport page: no mask, no blur, no
 *      radius, no shadow.
 *   2. Plugin market — `.nUhMVa_tabs` is a non-wrapping flex row with no
 *      overflow handling, so "发现 / 主题 / 收藏 / 已安装 / 高级 / 任务" runs off
 *      the right edge. It scrolls horizontally here, and cards drop to a
 *      single column.
 *
 * Class names are hashed CSS-module identifiers from the host and the market.
 * If a host rebuild renames them, the matching rule degrades to a no-op and
 * everything else keeps working.
 */
window.__ModuleLoader__.load({
  id: "dsh-mobile-page-fix",
  factory: () => {
    var PLUGIN_ID = "dsh-mobile-page-fix";
    var STYLE_ID = PLUGIN_ID + "-style";

    var CSS = [
      "/* ============================================================",
      " * dsh-mobile-page-fix — mobile page fixes",
      " * Baseline: 360x688 viewport, dpr=3",
      " * ============================================================ */",
      "@media (max-width: 900px) {",

      "  /* ----------------------------------------------------------",
      "   * 1. Settings — a full page, not a floating dialog",
      "   * Before: VOzbGW_panel [312x714] hovering on a 360x688",
      "   *         viewport (48px dead space, 26px bottom overflow)",
      "   * After:  panel [360x688], opaque, no mask/blur/radius/shadow",
      "   * ---------------------------------------------------------- */",
      "  .VOzbGW_overlay {",
      "    position: fixed !important;",
      "    inset: 0 !important;",
      "    background: var(--dsw-alias-bg-layer-2) !important;",
      "    backdrop-filter: none !important;",
      "    -webkit-backdrop-filter: none !important;",
      "    justify-content: flex-start !important;",
      "    align-items: stretch !important;",
      "  }",

      "  /* No scrim: a standalone page has nothing to float above. */",
      "  .VOzbGW_mask {",
      "    display: none !important;",
      "  }",

      "  .VOzbGW_panel {",
      "    width: 100% !important;",
      "    max-width: 100% !important;",
      "    height: 100% !important;",
      "    max-height: 100% !important;",
      "    border-radius: 0 !important;",
      "    box-shadow: none !important;",
      "  }",

      "  /* Let the content column take the remaining width. */",
      "  .VOzbGW_content {",
      "    flex: 1 1 auto !important;",
      "    min-width: 0 !important;",
      "  }",

      "  .VOzbGW_content > * {",
      "    max-width: 100% !important;",
      "  }",

      "  .VOzbGW_options {",
      "    padding: 0 12px 16px !important;",
      "  }",

      "  /* ----------------------------------------------------------",
      "   * 2. Plugin market — horizontally scrollable tab strip",
      "   * The market ships its own @container breakpoints (420/460/",
      "   * 680/900); only the tab strip was left unhandled.",
      "   * ---------------------------------------------------------- */",
      "  .nUhMVa_tabs,",
      "  .nUhMVa_subTabs {",
      "    overflow-x: auto !important;",
      "    flex-wrap: nowrap !important;",
      "    -webkit-overflow-scrolling: touch !important;",
      "    scrollbar-width: none !important;",
      "  }",

      "  .nUhMVa_tabs::-webkit-scrollbar,",
      "  .nUhMVa_subTabs::-webkit-scrollbar {",
      "    display: none !important;",
      "  }",

      "  .nUhMVa_tab {",
      "    flex: none !important;",
      "  }",

      "  /* One card per row on a phone. */",
      "  .nUhMVa_grid {",
      "    grid-template-columns: minmax(0, 1fr) !important;",
      "  }",

      "  /* Category chips wrap instead of running off the edge. */",
      "  .nUhMVa_catsWrap {",
      "    flex-wrap: wrap !important;",
      "  }",
      "}"
    ].join("\n");

    /**
     * Inject the stylesheet once. Idempotent: a second apply is a no-op, so
     * reconnects and hot reloads cannot stack duplicate style elements.
     */
    function apply() {
      if (typeof document === "undefined") return;
      if (document.getElementById(STYLE_ID)) return;
      var style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    return { name: PLUGIN_ID, inject: [], apply: apply };
  }
});
