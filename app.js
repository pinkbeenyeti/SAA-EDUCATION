/**
 * AWS SAA-C03 Study Hub Pro - Main Application Logic
 * Pure Vanilla JavaScript Single Page Application
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // Application State
  // ==========================================================================
  const state = {
    currentTab: 'mindmap',
    currentLang: 'ko', // 'ko' | 'en'
    activeDomain: 'all',
    searchQuery: '',
    selectedConceptMeta: null,
    selectedCuratedService: null,
    selectedConceptQuestions: [],
    cqTab: 'tips',
    cqPractice: { index: 0, userAnswers: {}, revealed: {} },
    examSession: {
      active: false,
      mode: 'fixed', // 'fixed' | 'infinite'
      sourcePool: null, // infinite mode only: pool to keep drawing random questions from
      questions: [],
      currentIndex: 0,
      userAnswers: {}, // { [questionIdx]: selectedOptionIdx }
      flagged: {},     // { [questionIdx]: boolean }
      revealed: {},    // { [questionIdx]: boolean }
      timeRemaining: 0,
      totalTime: 0,
      elapsedSeconds: 0,
      timerInterval: null,
      isSubmitted: false
    },
    incorrectNotes: []
  };

  // ==========================================================================
  // DOM Elements Cache
  // ==========================================================================
  const el = {
    // Navigation
    navTabs: document.querySelectorAll('.nav-tab-btn'),
    tabViews: document.querySelectorAll('.tab-view'),
    btnGlobalLangToggle: document.getElementById('btnGlobalLangToggle'),
    currentLangDisplay: document.getElementById('currentLangDisplay'),
    incorrectBadgeCount: document.getElementById('incorrectBadgeCount'),
    navBrandLogo: document.getElementById('navBrandLogo'),

    // Local-only Dump Practice (hidden unless dump-answered.js is present)
    navTabLocalDump: document.getElementById('navTabLocalDump'),
    selectLocalDumpCount: document.getElementById('selectLocalDumpCount'),
    btnStartLocalDumpExam: document.getElementById('btnStartLocalDumpExam'),
    txtLocalDumpCount: document.getElementById('txtLocalDumpCount'),

    // Mindmap (concept tree) View
    mmSvg: document.getElementById('mmSvg'),
    mmViewport: document.getElementById('mmViewport'),
    mmNodes: document.getElementById('mmNodes'),
    mmCanvasWrapper: document.getElementById('mmCanvasWrapper'),
    mmPanel: document.getElementById('mmPanel'),
    mmHud: document.getElementById('mmHud'),
    btnMmSummary: document.getElementById('btnMmSummary'),
    btnMmExpandAll: document.getElementById('btnMmExpandAll'),
    btnMmCollapseAll: document.getElementById('btnMmCollapseAll'),
    btnMmFit: document.getElementById('btnMmFit'),
    domainFilterGroup: document.getElementById('domainFilterPills'),
    inputMindmapSearch: document.getElementById('inputMindmapSearch'),

    // Concept Question Modal
    modalConceptQuestions: document.getElementById('modalConceptQuestions'),
    btnCloseConceptQuestions: document.getElementById('btnCloseConceptQuestions'),
    btnCloseConceptQuestionsFooter: document.getElementById('btnCloseConceptQuestionsFooter'),
    btnCqModalLangToggle: document.getElementById('btnCqModalLangToggle'),
    cqModalLangDisplay: document.getElementById('cqModalLangDisplay'),
    cqModalIcon: document.getElementById('cqModalIcon'),
    cqModalTitle: document.getElementById('cqModalTitle'),
    cqModalBadge: document.getElementById('cqModalBadge'),
    cqModalTipsWrap: document.getElementById('cqModalTipsWrap'),
    cqModalTipsList: document.getElementById('cqModalTipsList'),
    cqTipsEmptyState: document.getElementById('cqTipsEmptyState'),
    btnCqTabTips: document.getElementById('btnCqTabTips'),
    btnCqTabPractice: document.getElementById('btnCqTabPractice'),
    cqTipsPanel: document.getElementById('cqTipsPanel'),
    cqPracticePanel: document.getElementById('cqPracticePanel'),
    cqNumStrip: document.getElementById('cqNumStrip'),
    btnCqPrevQuestion: document.getElementById('btnCqPrevQuestion'),
    btnCqNextQuestion: document.getElementById('btnCqNextQuestion'),
    cqLblQuestionNumber: document.getElementById('cqLblQuestionNumber'),
    cqLblQuestionScenario: document.getElementById('cqLblQuestionScenario'),
    cqOptionsContainer: document.getElementById('cqOptionsContainer'),
    cqExplanationBox: document.getElementById('cqExplanationBox'),
    cqLblExplanationText: document.getElementById('cqLblExplanationText'),

    // Exam View
    examSetupScreen: document.getElementById('examSetupScreen'),
    examInProgressScreen: document.getElementById('examInProgressScreen'),
    examResultScreen: document.getElementById('examResultScreen'),
    selectExamCount: document.getElementById('selectExamCount'),
    selectExamDomain: document.getElementById('selectExamDomain'),
    btnStartExam: document.getElementById('btnStartExam'),
    lblQuestionNumber: document.getElementById('lblQuestionNumber'),
    lblQuestionDomain: document.getElementById('lblQuestionDomain'),
    lblQuestionScenario: document.getElementById('lblQuestionScenario'),
    optionsContainer: document.getElementById('optionsContainer'),
    btnToggleFlag: document.getElementById('btnToggleFlag'),
    lblFlagText: document.getElementById('lblFlagText'),
    questionExplanationBox: document.getElementById('questionExplanationBox'),
    lblExplanationText: document.getElementById('lblExplanationText'),
    btnShowExplanation: document.getElementById('btnShowExplanation'),
    btnPrevQuestion: document.getElementById('btnPrevQuestion'),
    btnNextQuestion: document.getElementById('btnNextQuestion'),
    btnSubmitExam: document.getElementById('btnSubmitExam'),
    lblSubmitExamText: document.getElementById('lblSubmitExamText'),
    iconSubmitExam: document.getElementById('iconSubmitExam'),
    examTimerDisplay: document.getElementById('examTimerDisplay'),
    omrSheetCard: document.getElementById('omrSheetCard'),
    omrGridContainer: document.getElementById('omrGridContainer'),
    lblOmrProgress: document.getElementById('lblOmrProgress'),

    // Result View
    resultStatusBadge: document.getElementById('resultStatusBadge'),
    lblFinalScore: document.getElementById('lblFinalScore'),
    lblScoreMeta: document.getElementById('lblScoreMeta'),
    statCorrectCount: document.getElementById('statCorrectCount'),
    statIncorrectCount: document.getElementById('statIncorrectCount'),
    statTimeSpent: document.getElementById('statTimeSpent'),
    btnRestartExam: document.getElementById('btnRestartExam'),
    btnGoToIncorrectNotes: document.getElementById('btnGoToIncorrectNotes'),

    // Incorrect Notes View
    incorrectListContainer: document.getElementById('incorrectListContainer'),
    btnClearAllIncorrect: document.getElementById('btnClearAllIncorrect'),
    btnRetakeIncorrectExam: document.getElementById('btnRetakeIncorrectExam'),

  };

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    loadIncorrectNotes();
    renderKnowledgeGraph();
    bindEvents();
    updateLanguageUI();
    updateIncorrectBadge();

    // dump-answered.js is a local-only, gitignored build artifact -- only
    // developers who ran scripts/build_local_dump_bank.py will have it.
    if (typeof LOCAL_DUMP_BANK !== 'undefined' && LOCAL_DUMP_BANK.length > 0) {
      el.navTabLocalDump.style.display = '';
      el.txtLocalDumpCount.textContent = `로컬에 ${LOCAL_DUMP_BANK.length}문제 있음 (단일 정답 문제만, AI 검증 tier A/B)`;
    }

    window.addEventListener('resize', debounce(() => {
      if (state.currentTab === 'mindmap') mmFit();
    }, 120));
  }

  // ==========================================================================
  // Mindmap — a collapsible tree over the SAA-C03 concept bank
  //
  //   root ─ category ─ concept ─ exam point
  //
  // Structure comes from KG_CATEGORIES + KNOWLEDGE_GRAPH.nodes, and the leaves
  // are the `points[]` of CONCEPT_DETAIL. KNOWLEDGE_GRAPH.edges is no longer
  // drawn as a web; it feeds the "co-occurring concepts" cross-links in the
  // detail panel, which is where that data is actually useful.
  // ==========================================================================
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // per-depth node width; height is derived from wrapped text. Widened over the
  // bare-text sizes to pay for the colour dot and count badge (MM_DOT/MM_BADGE).
  const MM_W = [186, 230, 262, 336];
  const MM_COL_GAP = 62;
  const MM_ROW_GAP = 9;
  const MM_PAD_X = 14;
  const MM_PAD_Y = 9;
  const MM_LINE_H = 19;
  const MM_FONT = [15, 14, 13.5, 12.5];
  /** Summary view keeps only this many concepts per category, ranked by exam frequency. */
  const MM_SUMMARY_TOP = 4;

  const mm = {
    root: null,
    byId: Object.create(null),
    concepts: Object.create(null),
    adj: Object.create(null),
    flat: [],
    view: { x: 0, y: 0, k: 1 },
    size: { w: 0, h: 0 },
    selected: null,
    pan: null,
    ready: false,
    summary: false,
    revealed: Object.create(null)
  };

  const mmText = (n) => (state.currentLang === 'ko' ? n.label_ko : n.label_en);

  function mmCatMeta(cat) {
    const c = KG_CATEGORIES[cat] || { ko: cat, en: cat, color: '#8a8478' };
    return { label: state.currentLang === 'ko' ? c.ko : c.en, color: c.color };
  }

  // Chrome that eats into a node's text width: the colour dot plus its gap, and
  // the count badge plus its gap when one is present. Kept in sync with
  // .mm-node::before / .mm-node-badge in styles.css — if those change size the
  // layout will start wrapping more lines than it reserves height for.
  const MM_DOT = 7 + 8;
  const MM_BADGE = 34 + 8;

  /** Rough text measurement: CJK glyphs are ~1em wide, Latin ~0.55em. */
  function mmEstimateLines(text, boxWidth, fontPx) {
    const usable = boxWidth - MM_PAD_X * 2;
    let w = 0;
    for (const ch of String(text)) {
      w += /[ᄀ-ᇿ㄰-㆏가-힯　-〿一-鿿＀-￯]/.test(ch)
        ? fontPx : fontPx * 0.55;
    }
    return Math.max(1, Math.min(4, Math.ceil(w / usable)));
  }

  // ------------------------------------------------------------------ model
  function mmBuildModel() {
    mm.byId = Object.create(null);
    KNOWLEDGE_GRAPH.nodes.forEach(n => { mm.concepts[n.id] = n; });

    mm.adj = Object.create(null);
    KNOWLEDGE_GRAPH.nodes.forEach(n => { mm.adj[n.id] = []; });
    KNOWLEDGE_GRAPH.edges.forEach(e => {
      if (!mm.adj[e.s] || !mm.adj[e.t]) return;
      mm.adj[e.s].push({ id: e.t, w: e.w });
      mm.adj[e.t].push({ id: e.s, w: e.w });
    });
    Object.keys(mm.adj).forEach(k => mm.adj[k].sort((a, b) => b.w - a.w));

    const mk = (o) => {
      const node = Object.assign({
        children: [], parent: null, depth: 0, expanded: false,
        x: 0, y: 0, w: 0, h: 0, el: null
      }, o);
      mm.byId[node.id] = node;
      return node;
    };

    const root = mk({
      id: '__root', kind: 'root',
      label_ko: 'AWS SAA-C03', label_en: 'AWS SAA-C03',
      cat: null, expanded: true
    });

    const byCat = Object.create(null);
    KNOWLEDGE_GRAPH.nodes.forEach(n => (byCat[n.cat] = byCat[n.cat] || []).push(n));

    Object.keys(KG_CATEGORIES).forEach(cat => {
      const list = (byCat[cat] || []).slice().sort((a, b) => b.w - a.w);
      if (!list.length) return;
      const c = KG_CATEGORIES[cat];
      const catNode = mk({
        id: 'cat:' + cat, kind: 'cat', cat,
        label_ko: c.ko, label_en: c.en,
        weight: list.reduce((s, n) => s + n.w, 0),
        parent: root, depth: 1
      });
      root.children.push(catNode);

      list.forEach((n, rank) => {
        const detail = CONCEPT_DETAIL[n.id] || {};
        const cNode = mk({
          id: 'con:' + n.id, kind: 'concept', cat, conceptId: n.id,
          label_ko: n.label_ko, label_en: n.label,
          weight: n.w, rank, parent: catNode, depth: 2
        });
        catNode.children.push(cNode);

        (detail.points || []).forEach((p, i) => {
          cNode.children.push(mk({
            id: 'pt:' + n.id + ':' + i, kind: 'point', cat,
            conceptId: n.id, pointIndex: i,
            label_ko: p.ko, label_en: p.en,
            parent: cNode, depth: 3
          }));
        });
      });

      // Summary view collapses the long tail of a category into one "+N more" node.
      if (list.length > MM_SUMMARY_TOP) {
        catNode.children.push(mk({
          id: 'more:' + cat, kind: 'more', cat,
          label_ko: '', label_en: '',
          hidden: list.length - MM_SUMMARY_TOP,
          parent: catNode, depth: 2
        }));
      }
    });

    mm.root = root;
  }

  /** True when a concept is part of the long tail hidden by the summary view. */
  function mmInTail(n) {
    return mm.summary
        && n.kind === 'concept'
        && n.rank >= MM_SUMMARY_TOP
        && !mm.revealed[n.cat]
        && !n.matched;
  }

  function mmUpdateMoreLabels() {
    Object.values(mm.byId).forEach(n => {
      if (n.kind !== 'more') return;
      const tail = n.parent.children.filter(mmInTail).length;
      n.tail = tail;
      n.label_ko = '나머지 ' + tail + '개 개념 보기';
      n.label_en = 'Show ' + tail + ' more';
    });
  }

  // ----------------------------------------------------------------- layout
  function mmVisibleChildren(n) {
    if (!n.expanded) return [];
    if (state.activeDomain !== 'all' && n.kind === 'root') {
      return n.children.filter(c => c.cat === state.activeDomain);
    }
    return n.children.filter(c => {
      if (c.filteredOut) return false;
      if (c.kind === 'more') return !!c.tail;
      return !mmInTail(c);
    });
  }

  function mmLayout() {
    const colX = [];
    let acc = 0;
    for (let d = 0; d < MM_W.length; d++) { colX[d] = acc; acc += MM_W[d] + MM_COL_GAP; }

    let cursor = 0;
    let maxRight = 0;

    const walk = (n) => {
      n.w = MM_W[n.depth];
      const hasBadge = n.children.length > 0 || n.kind === 'concept';
      const textWidth = n.w - MM_DOT - (hasBadge ? MM_BADGE : 0);
      const lines = mmEstimateLines(mmText(n), textWidth, MM_FONT[n.depth]);
      n.h = MM_PAD_Y * 2 + lines * MM_LINE_H;
      n.x = colX[n.depth];
      maxRight = Math.max(maxRight, n.x + n.w);

      const kids = mmVisibleChildren(n);
      n.visibleKids = kids;
      if (!kids.length) {
        n.y = cursor + n.h / 2;
        cursor += n.h + MM_ROW_GAP;
      } else {
        const before = cursor;
        kids.forEach(walk);
        const centre = (kids[0].y + kids[kids.length - 1].y) / 2;
        n.y = centre;
        // a tall parent must not overlap the row above
        const needed = n.y - n.h / 2;
        if (needed < before) {
          const shift = before - needed;
          const shiftAll = (m) => { m.y += shift; (m.visibleKids || []).forEach(shiftAll); };
          kids.forEach(shiftAll);
          n.y += shift;
          cursor += shift;
        }
        cursor = Math.max(cursor, n.y + n.h / 2 + MM_ROW_GAP);
      }
    };

    walk(mm.root);

    mm.flat = [];
    const collect = (n) => { mm.flat.push(n); (n.visibleKids || []).forEach(collect); };
    collect(mm.root);

    mm.size = { w: maxRight + 40, h: cursor + 40 };
  }

  // ---------------------------------------------------------------- render
  function mmRender() {
    mmUpdateMoreLabels();
    mmLayout();

    el.mmSvg.setAttribute('width', mm.size.w);
    el.mmSvg.setAttribute('height', mm.size.h);
    el.mmSvg.setAttribute('viewBox', `0 0 ${mm.size.w} ${mm.size.h}`);
    el.mmNodes.style.width = mm.size.w + 'px';
    el.mmNodes.style.height = mm.size.h + 'px';

    // --- connectors
    el.mmSvg.textContent = '';
    mm.flat.forEach(n => {
      (n.visibleKids || []).forEach(k => {
        const x1 = n.x + n.w, y1 = n.y, x2 = k.x, y2 = k.y;
        const mid = x1 + (x2 - x1) / 2;
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`);
        path.setAttribute('class', 'mm-link');
        path.setAttribute('stroke', mmCatMeta(k.cat || n.cat).color);
        el.mmSvg.appendChild(path);
      });
    });

    // --- nodes
    el.mmNodes.textContent = '';
    mm.flat.forEach(n => {
      const meta = mmCatMeta(n.cat);
      const box = document.createElement('button');
      box.type = 'button';
      box.className = `mm-node mm-${n.kind}`;
      box.style.left = n.x + 'px';
      box.style.top = (n.y - n.h / 2) + 'px';
      box.style.width = n.w + 'px';
      box.style.minHeight = n.h + 'px';
      if (n.cat) box.style.setProperty('--tone', meta.color);
      if (mm.selected === n.id) box.classList.add('is-selected');
      if (n.matched) box.classList.add('is-match');

      const label = document.createElement('span');
      label.className = 'mm-node-label';
      label.textContent = mmText(n);
      box.appendChild(label);

      const kidCount = n.children.filter(c => c.kind !== 'more').length;
      if (kidCount) {
        const badge = document.createElement('span');
        badge.className = 'mm-node-badge';
        badge.textContent = (n.expanded ? '−' : '+') + ' ' + kidCount;
        box.appendChild(badge);
      } else if (n.kind === 'concept') {
        const badge = document.createElement('span');
        badge.className = 'mm-node-badge is-quiet';
        badge.textContent = String(n.weight);
        box.appendChild(badge);
      }

      box.addEventListener('click', () => {
        if (n.kind === 'more') {
          mm.revealed[n.cat] = true;
          mmRender();
          return;
        }
        if (n.children.length) n.expanded = !n.expanded;
        mmSelect(n.id);
      });
      el.mmNodes.appendChild(box);
      n.el = box;
    });

    mmUpdateHud();
  }

  function mmUpdateHud() {
    const isKo = state.currentLang === 'ko';
    const concepts = mm.flat.filter(n => n.kind === 'concept').length;
    const points = mm.flat.filter(n => n.kind === 'point').length;
    const total = Object.keys(mm.concepts).length;
    const tag = mm.summary ? (isKo ? '요약 보기 · ' : 'Summary · ') : '';
    el.mmHud.textContent = isKo
      ? `${tag}개념 ${concepts} · 시험 포인트 ${points} · 전체 ${total}개 개념`
      : `${tag}${concepts} concepts · ${points} points · ${total} total`;
  }

  // ------------------------------------------------------------ interaction
  function mmSelect(id) {
    mm.selected = id;
    mmRender();
    mmRenderPanel();
  }

  function mmExpandTo(id) {
    let n = mm.byId[id];
    while (n && n.parent) { n.parent.expanded = true; n = n.parent; }
  }

  function mmSetAll(expanded, maxDepth) {
    const walk = (n) => {
      if (n.children.length && n.depth <= maxDepth) n.expanded = expanded;
      else if (n.children.length) n.expanded = false;
      n.children.forEach(walk);
    };
    walk(mm.root);
    mm.root.expanded = true;
  }

  /**
   * Summary view: every category open, but only the MM_SUMMARY_TOP most-tested
   * concepts in each — the long tail sits behind a "show N more" node.
   */
  function mmSetSummary(on) {
    mm.summary = on;
    mm.revealed = Object.create(null);
    mmSetAll(true, 1);
    if (el.btnMmSummary) el.btnMmSummary.classList.toggle('is-active', on);
    mmRender();
    if (on) mmFitWidth(); else mmFit();
  }

  function mmApplyView() {
    el.mmViewport.style.transform =
      `translate(${mm.view.x}px, ${mm.view.y}px) scale(${mm.view.k})`;
  }

  function mmFit() {
    const rect = el.mmCanvasWrapper.getBoundingClientRect();
    if (!rect.width) return;
    const k = Math.min(1, Math.min(rect.width / mm.size.w, rect.height / mm.size.h) * 0.95);
    mm.view.k = Math.max(0.3, k);
    mm.view.x = 28;
    mm.view.y = Math.max(20, (rect.height - mm.size.h * mm.view.k) / 2);
    mmApplyView();
  }

  /**
   * Summary view is meant to be read, not squeezed: scale to the width only and
   * pin to the top. Height-fitting a 40-row tree hits the zoom floor and turns
   * every label into a smudge.
   */
  function mmFitWidth() {
    const rect = el.mmCanvasWrapper.getBoundingClientRect();
    if (!rect.width) return;
    mm.view.k = Math.max(0.5, Math.min(1, (rect.width / mm.size.w) * 0.95));
    mm.view.x = 28;
    mm.view.y = 20;
    mmApplyView();
  }

  function mmBindCanvasEvents() {
    el.mmCanvasWrapper.addEventListener('pointerdown', ev => {
      if (ev.target.closest('.mm-node')) return;
      mm.pan = { sx: ev.clientX, sy: ev.clientY, vx: mm.view.x, vy: mm.view.y };
      el.mmCanvasWrapper.setPointerCapture(ev.pointerId);
      el.mmCanvasWrapper.classList.add('is-panning');
    });
    el.mmCanvasWrapper.addEventListener('pointermove', ev => {
      if (!mm.pan) return;
      mm.view.x = mm.pan.vx + (ev.clientX - mm.pan.sx);
      mm.view.y = mm.pan.vy + (ev.clientY - mm.pan.sy);
      mmApplyView();
    });
    const endPan = () => { mm.pan = null; el.mmCanvasWrapper.classList.remove('is-panning'); };
    el.mmCanvasWrapper.addEventListener('pointerup', endPan);
    el.mmCanvasWrapper.addEventListener('pointercancel', endPan);

    el.mmCanvasWrapper.addEventListener('wheel', ev => {
      ev.preventDefault();
      const rect = el.mmCanvasWrapper.getBoundingClientRect();
      const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      const k = Math.max(0.3, Math.min(2.2, mm.view.k * (ev.deltaY < 0 ? 1.1 : 1 / 1.1)));
      const ratio = k / mm.view.k;
      mm.view.x = mx - (mx - mm.view.x) * ratio;
      mm.view.y = my - (my - mm.view.y) * ratio;
      mm.view.k = k;
      mmApplyView();
    }, { passive: false });

    // depth 1 = expand root and every category, so all concepts are visible
    // while the exam-point leaves stay tucked away (expanding those too would
    // put 340+ boxes on screen at once)
    if (el.btnMmSummary) {
      el.btnMmSummary.addEventListener('click', () => mmSetSummary(!mm.summary));
    }
    el.btnMmExpandAll.addEventListener('click', () => {
      mm.summary = false;
      if (el.btnMmSummary) el.btnMmSummary.classList.remove('is-active');
      mmSetAll(true, 1); mmRender(); mmFit();
    });
    el.btnMmCollapseAll.addEventListener('click', () => {
      mm.summary = false;
      if (el.btnMmSummary) el.btnMmSummary.classList.remove('is-active');
      mmSetAll(false, 3); mmRender(); mmFit();
    });
    el.btnMmFit.addEventListener('click', () => { mmFit(); });
  }

  // ------------------------------------------------------------- side panel
  function mmRenderPanel() {
    const isKo = state.currentLang === 'ko';
    const panel = el.mmPanel;
    panel.textContent = '';

    const n = mm.selected ? mm.byId[mm.selected] : null;
    if (!n || n.kind === 'root') return panel.appendChild(mmPanelIntro());

    if (n.kind === 'cat') return mmPanelCategory(panel, n);
    const conceptId = n.conceptId;
    const detail = CONCEPT_DETAIL[conceptId];
    const meta = mm.concepts[conceptId];
    if (!detail || !meta) return;

    const cat = mmCatMeta(meta.cat);
    panel.appendChild(mmPanelHead({
      title: isKo ? meta.label_ko : meta.label,
      alt: isKo ? meta.label : meta.label_ko,
      chip: cat.label, color: cat.color,
      count: isKo ? `덤프 ${meta.w}문제` : `${meta.w} questions`
    }));

    // one-line gist
    const gist = document.createElement('p');
    gist.className = 'mm-gist';
    gist.textContent = isKo ? detail.summary_ko : detail.summary_en;
    panel.appendChild(gist);

    const deep = (typeof CONCEPT_DEEP !== 'undefined' && CONCEPT_DEEP[conceptId]) || null;

    // plain-language basics: what kind of thing is this, before any exam
    // strategy -- only rendered for concepts that have this field filled in
    if (detail.plain_ko) {
      panel.appendChild(mmSection('이게 뭔가요?', 'What is this?'));
      const plain = document.createElement('p');
      plain.className = 'mm-body mm-plain';
      plain.textContent = isKo ? detail.plain_ko : detail.plain_en;
      panel.appendChild(plain);
    }

    // overview
    panel.appendChild(mmSection('개요', 'Overview'));
    const desc = document.createElement('p');
    desc.className = 'mm-body';
    desc.textContent = isKo ? detail.desc_ko : detail.desc_en;
    panel.appendChild(desc);

    // mechanism — the "how does this actually work" layer
    if (deep) {
      panel.appendChild(mmSection('동작 원리', 'How it works'));
      panel.appendChild(mmParagraphs(isKo ? deep.how_ko : deep.how_en));

      panel.appendChild(mmSection('시험은 무엇을 보는가', 'What the exam is testing'));
      const why = mmParagraphs(isKo ? deep.why_ko : deep.why_en);
      why.className = 'mm-why';
      panel.appendChild(why);
    }

    // exam points — the leaf nodes
    if (detail.points && detail.points.length) {
      panel.appendChild(mmSection('시험 포인트', 'Exam points'));
      const list = document.createElement('div');
      list.className = 'mm-points';
      detail.points.forEach((p, i) => {
        const item = document.createElement('div');
        item.className = 'mm-keypoint';
        if (n.kind === 'point' && n.pointIndex === i) item.classList.add('is-active');
        const h = document.createElement('div');
        h.className = 'mm-point-title';
        h.textContent = isKo ? p.ko : p.en;
        const b = document.createElement('p');
        b.className = 'mm-point-body';
        b.textContent = isKo ? p.body_ko : p.body_en;
        item.appendChild(h);
        item.appendChild(b);
        list.appendChild(item);
      });
      panel.appendChild(list);
    }

    // the specific wrong answers people pick
    if (deep && deep.traps && deep.traps.length) {
      panel.appendChild(mmSection('자주 틀리는 함정', 'Common traps'));
      const wrap = document.createElement('div');
      wrap.className = 'mm-traps';
      deep.traps.forEach(t => {
        const item = document.createElement('p');
        item.className = 'mm-trap';
        item.textContent = isKo ? t.ko : t.en;
        wrap.appendChild(item);
      });
      panel.appendChild(wrap);
    }

    // pairs that are routinely confused
    if (deep && deep.compare && deep.compare.length) {
      panel.appendChild(mmSection('헷갈리는 것 구분하기', 'Telling them apart'));
      const wrap = document.createElement('div');
      wrap.className = 'mm-compares';
      deep.compare.forEach(c => {
        const row = document.createElement('div');
        row.className = 'mm-compare';
        const head = document.createElement('div');
        head.className = 'mm-compare-head';
        const a = document.createElement('span');
        a.textContent = c.left;
        const vs = document.createElement('em');
        vs.textContent = 'vs';
        const b = document.createElement('span');
        b.textContent = c.right;
        head.appendChild(a); head.appendChild(vs); head.appendChild(b);
        const rule = document.createElement('p');
        rule.className = 'mm-compare-rule';
        rule.textContent = isKo ? c.rule_ko : c.rule_en;
        row.appendChild(head);
        row.appendChild(rule);
        wrap.appendChild(row);
      });
      panel.appendChild(wrap);
    }

    // canonical architecture
    if (detail.pattern_ko) {
      panel.appendChild(mmSection('권장 아키텍처 패턴', 'Reference pattern'));
      const pat = document.createElement('div');
      pat.className = 'mm-pattern';
      pat.textContent = isKo ? detail.pattern_ko : detail.pattern_en;
      panel.appendChild(pat);
    }

    // cross-links mined from the dump
    const neigh = (mm.adj[conceptId] || []).slice(0, 8);
    if (neigh.length) {
      panel.appendChild(mmSection('함께 출제되는 개념', 'Co-occurring concepts'));
      const wrap = document.createElement('div');
      wrap.className = 'mm-neighbours';
      neigh.forEach(a => {
        const other = mm.concepts[a.id];
        if (!other) return;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'mm-neighbour';
        chip.style.setProperty('--tone', mmCatMeta(other.cat).color);
        const nm = document.createElement('span');
        nm.textContent = isKo ? other.label_ko : other.label;
        const ct = document.createElement('em');
        ct.textContent = a.w;
        chip.appendChild(nm);
        chip.appendChild(ct);
        chip.addEventListener('click', () => {
          mmExpandTo('con:' + a.id);
          mmSelect('con:' + a.id);
          const target = mm.byId['con:' + a.id];
          if (target) {
            const rect = el.mmCanvasWrapper.getBoundingClientRect();
            mm.view.x = rect.width / 2 - (target.x + target.w / 2) * mm.view.k;
            mm.view.y = rect.height / 2 - target.y * mm.view.k;
            mmApplyView();
          }
        });
        wrap.appendChild(chip);
      });
      panel.appendChild(wrap);
    }

    // practice bridge: any question tagged with this concept, regardless of
    // whether it also happens to match a curated AWS_DOMAINS service entry
    const curated = findCuratedService(conceptId);
    const conceptQuestions = getAllQuestions().filter(q => (q.conceptIds || []).includes(conceptId));
    if (conceptQuestions.length > 0) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-secondary mm-wide-btn';
      btn.textContent = isKo ? `📝 이 개념 문제 풀기 (${conceptQuestions.length})` : `📝 Practice this concept (${conceptQuestions.length})`;
      btn.addEventListener('click', () => openConceptQuestionModal(meta, curated, conceptQuestions));
      panel.appendChild(btn);
    }

    // Notion export
    panel.appendChild(mmSection('Notion으로 정리', 'Send to Notion'));
    panel.appendChild(mmExportBar(conceptId, meta.cat));
  }

  function mmPanelIntro() {
    const isKo = state.currentLang === 'ko';
    const box = document.createElement('div');
    box.className = 'mm-intro';
    const icon = document.createElement('div');
    icon.className = 'mm-intro-icon';
    icon.textContent = '🌿';
    const h = document.createElement('h3');
    h.textContent = isKo ? '개념 지도' : 'Concept map';
    const p = document.createElement('p');
    p.textContent = isKo
      ? `SAA-C03 기출 684문제에서 뽑아낸 ${Object.keys(mm.concepts).length}개 개념과 245개 시험 포인트를 가지로 엮었습니다. 왼쪽에서 가지를 펼치고 마디를 누르면 이곳에 설명이 나옵니다.`
      : `${Object.keys(mm.concepts).length} concepts and 245 exam points distilled from 684 SAA-C03 questions. Expand a branch on the left and select a node to read about it here.`;
    const p2 = document.createElement('p');
    p2.className = 'mm-intro-hint';
    p2.textContent = isKo
      ? '마지막 가지 "출제 의도"는 서비스가 아니라 시험이 반복해서 묻는 판단 기준입니다 — 비용 최적화, 운영 부담 최소화 같은.'
      : 'The last branch, "exam intent", holds not services but the judgement criteria the exam keeps testing — cost, operational overhead, and so on.';
    box.appendChild(icon); box.appendChild(h); box.appendChild(p); box.appendChild(p2);
    return box;
  }

  function mmPanelCategory(panel, n) {
    const isKo = state.currentLang === 'ko';
    const meta = mmCatMeta(n.cat);
    // the synthetic "show N more" child is chrome, not a concept
    const concepts = n.children.filter(c => c.kind === 'concept');
    panel.appendChild(mmPanelHead({
      title: meta.label, alt: '', chip: isKo ? '분류' : 'Category', color: meta.color,
      count: isKo ? `개념 ${concepts.length}개` : `${concepts.length} concepts`
    }));

    panel.appendChild(mmSection('이 분류의 개념', 'Concepts in this branch'));
    const list = document.createElement('div');
    list.className = 'mm-cat-list';
    concepts.forEach(c => {
      const d = CONCEPT_DETAIL[c.conceptId] || {};
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'mm-cat-row';
      row.style.setProperty('--tone', meta.color);
      const t = document.createElement('span');
      t.className = 'mm-cat-row-name';
      t.textContent = mmText(c);
      const s = document.createElement('span');
      s.className = 'mm-cat-row-sum';
      s.textContent = isKo ? d.summary_ko : d.summary_en;
      const w = document.createElement('em');
      w.textContent = c.weight;
      row.appendChild(t); row.appendChild(w); row.appendChild(s);
      row.addEventListener('click', () => { n.expanded = true; mmSelect(c.id); });
      list.appendChild(row);
    });
    panel.appendChild(list);

    panel.appendChild(mmSection('Notion으로 정리', 'Send to Notion'));
    panel.appendChild(mmExportBar(null, n.cat));
  }

  function mmPanelHead({ title, alt, chip, color, count }) {
    const head = document.createElement('div');
    head.className = 'mm-panel-head';
    head.style.setProperty('--tone', color);
    const h = document.createElement('h3');
    h.textContent = title;
    head.appendChild(h);
    const sub = document.createElement('div');
    sub.className = 'mm-panel-sub';
    const c = document.createElement('span');
    c.className = 'mm-chip';
    c.textContent = chip;
    sub.appendChild(c);
    const q = document.createElement('span');
    q.className = 'mm-panel-count';
    q.textContent = count;
    sub.appendChild(q);
    head.appendChild(sub);
    if (alt) {
      const a = document.createElement('div');
      a.className = 'mm-panel-alt';
      a.textContent = alt;
      head.appendChild(a);
    }
    return head;
  }

  /** Renders a \n\n-separated string as one <p> per paragraph. */
  function mmParagraphs(text) {
    const wrap = document.createElement('div');
    wrap.className = 'mm-body';
    String(text || '').split(/\n{2,}/).forEach(para => {
      if (!para.trim()) return;
      const p = document.createElement('p');
      p.textContent = para.trim();
      wrap.appendChild(p);
    });
    return wrap;
  }

  function mmSection(ko, en) {
    const d = document.createElement('h4');
    d.className = 'mm-section';
    d.textContent = state.currentLang === 'ko' ? ko : en;
    return d;
  }

  // -------------------------------------------------------- Notion export
  /** Notion imports Markdown natively, so plain .md is the interchange format. */
  function mmConceptMarkdown(conceptId) {
    const isKo = state.currentLang === 'ko';
    const d = CONCEPT_DETAIL[conceptId];
    const meta = mm.concepts[conceptId];
    if (!d || !meta) return '';
    const cat = mmCatMeta(meta.cat);
    const L = [];
    L.push(`# ${isKo ? meta.label_ko : meta.label}`);
    L.push('');
    L.push(`> ${isKo ? d.summary_ko : d.summary_en}`);
    L.push('');
    L.push(`**${isKo ? '분류' : 'Category'}:** ${cat.label}  `);
    L.push(`**${isKo ? '다른 이름' : 'Also known as'}:** ${isKo ? meta.label : meta.label_ko}  `);
    L.push(`**${isKo ? '덤프 출제 빈도' : 'Dump frequency'}:** ${meta.w}${isKo ? '문제' : ' questions'}`);
    L.push('');
    L.push(`## ${isKo ? '개요' : 'Overview'}`);
    L.push('');
    L.push(isKo ? d.desc_ko : d.desc_en);
    L.push('');

    const deep = (typeof CONCEPT_DEEP !== 'undefined' && CONCEPT_DEEP[conceptId]) || null;
    if (deep) {
      L.push(`## ${isKo ? '동작 원리' : 'How it works'}`);
      L.push('');
      L.push(isKo ? deep.how_ko : deep.how_en);
      L.push('');
      L.push(`## ${isKo ? '시험은 무엇을 보는가' : 'What the exam is testing'}`);
      L.push('');
      L.push(isKo ? deep.why_ko : deep.why_en);
      L.push('');
    }

    if (d.points && d.points.length) {
      L.push(`## ${isKo ? '시험 포인트' : 'Exam points'}`);
      L.push('');
      d.points.forEach(p => {
        L.push(`### ${isKo ? p.ko : p.en}`);
        L.push('');
        L.push(isKo ? p.body_ko : p.body_en);
        L.push('');
      });
    }
    if (deep && deep.traps && deep.traps.length) {
      L.push(`## ${isKo ? '자주 틀리는 함정' : 'Common traps'}`);
      L.push('');
      deep.traps.forEach(t => L.push(`- ${isKo ? t.ko : t.en}`));
      L.push('');
    }
    if (deep && deep.compare && deep.compare.length) {
      L.push(`## ${isKo ? '헷갈리는 것 구분하기' : 'Telling them apart'}`);
      L.push('');
      deep.compare.forEach(c => {
        L.push(`### ${c.left} vs ${c.right}`);
        L.push('');
        L.push(isKo ? c.rule_ko : c.rule_en);
        L.push('');
      });
    }
    if (d.pattern_ko) {
      L.push(`## ${isKo ? '권장 아키텍처 패턴' : 'Reference pattern'}`);
      L.push('');
      L.push('```');
      L.push(isKo ? d.pattern_ko : d.pattern_en);
      L.push('```');
      L.push('');
    }
    const neigh = (mm.adj[conceptId] || []).slice(0, 8);
    if (neigh.length) {
      L.push(`## ${isKo ? '함께 출제되는 개념' : 'Co-occurring concepts'}`);
      L.push('');
      L.push(`| ${isKo ? '개념' : 'Concept'} | ${isKo ? '동시 출제' : 'Shared questions'} |`);
      L.push('| --- | --- |');
      neigh.forEach(a => {
        const o = mm.concepts[a.id];
        if (o) L.push(`| ${isKo ? o.label_ko : o.label} | ${a.w} |`);
      });
      L.push('');
    }
    L.push(`## ${isKo ? '출처' : 'Source'}`);
    L.push('');
    L.push(isKo
      ? `SAA-C03 덤프 문항 ${meta.qs.slice(0, 24).map(q => '#' + q).join(', ')}${meta.qs.length > 24 ? ' 외' : ''}`
      : `SAA-C03 dump questions ${meta.qs.slice(0, 24).map(q => '#' + q).join(', ')}${meta.qs.length > 24 ? ' and more' : ''}`);
    L.push('');
    return L.join('\n');
  }

  function mmCategoryMarkdown(cat) {
    const isKo = state.currentLang === 'ko';
    const meta = mmCatMeta(cat);
    const ids = KNOWLEDGE_GRAPH.nodes.filter(n => n.cat === cat)
      .sort((a, b) => b.w - a.w).map(n => n.id);
    const L = [`# ${meta.label}`, '', isKo
      ? `AWS SAA-C03 개념 정리 · 개념 ${ids.length}개`
      : `AWS SAA-C03 study notes · ${ids.length} concepts`, ''];
    L.push('---', '');
    ids.forEach(id => { L.push(mmConceptMarkdown(id)); L.push('---', ''); });
    return L.join('\n');
  }

  function mmAllMarkdown() {
    const isKo = state.currentLang === 'ko';
    const L = [`# AWS SAA-C03 ${isKo ? '개념 지도' : 'Concept Map'}`, '', isKo
      ? `기출 684문제에서 추출한 ${Object.keys(mm.concepts).length}개 개념 정리`
      : `${Object.keys(mm.concepts).length} concepts distilled from 684 exam questions`, '', '---', ''];
    Object.keys(KG_CATEGORIES).forEach(cat => {
      if (!KNOWLEDGE_GRAPH.nodes.some(n => n.cat === cat)) return;
      L.push(mmCategoryMarkdown(cat));
    });
    return L.join('\n');
  }

  function mmExportBar(conceptId, cat) {
    const isKo = state.currentLang === 'ko';
    const bar = document.createElement('div');
    bar.className = 'mm-export';

    const hint = document.createElement('p');
    hint.className = 'mm-export-hint';
    hint.textContent = isKo
      ? 'Markdown으로 복사하거나 .md로 내려받아 Notion 페이지에 붙여넣거나 임포트하세요.'
      : 'Copy as Markdown or download a .md file, then paste or import it into a Notion page.';
    bar.appendChild(hint);

    const row = document.createElement('div');
    row.className = 'mm-export-row';

    const mk = (label, getMd, filename) => {
      const g = document.createElement('div');
      g.className = 'mm-export-group';
      const name = document.createElement('span');
      name.className = 'mm-export-label';
      name.textContent = label;
      g.appendChild(name);

      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'mm-export-btn';
      copy.textContent = isKo ? '복사' : 'Copy';
      copy.addEventListener('click', () => {
        const md = getMd();
        mmCopyText(md).then(okd => {
          copy.textContent = okd ? (isKo ? '복사됨 ✓' : 'Copied ✓') : (isKo ? '실패' : 'Failed');
          setTimeout(() => { copy.textContent = isKo ? '복사' : 'Copy'; }, 1600);
        });
      });
      g.appendChild(copy);

      const dl = document.createElement('button');
      dl.type = 'button';
      dl.className = 'mm-export-btn';
      dl.textContent = isKo ? '.md 저장' : 'Download';
      dl.addEventListener('click', () => mmDownload(filename(), getMd()));
      g.appendChild(dl);
      return g;
    };

    if (conceptId) {
      row.appendChild(mk(isKo ? '이 개념' : 'This concept',
        () => mmConceptMarkdown(conceptId),
        () => `saa-${conceptId}.md`));
    }
    if (cat) {
      row.appendChild(mk(isKo ? '이 분류 전체' : 'This branch',
        () => mmCategoryMarkdown(cat),
        () => `saa-${cat}.md`));
    }
    const total = Object.keys(mm.concepts).length;
    row.appendChild(mk(isKo ? `전체 ${total}개` : `All ${total}`,
      () => mmAllMarkdown(),
      () => 'saa-c03-concepts.md'));

    bar.appendChild(row);
    return bar;
  }

  function mmCopyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true, () => mmCopyFallback(text));
    }
    return Promise.resolve(mmCopyFallback(text));
  }

  function mmCopyFallback(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const okd = document.execCommand('copy');
      document.body.removeChild(ta);
      return okd;
    } catch (e) {
      return false;
    }
  }

  function mmDownload(filename, text) {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /** Maps a concept id back to the hand-written AWS_DOMAINS entry, if any. */
  function findCuratedService(id) {
    for (const d of AWS_DOMAINS) {
      const hit = d.services.find(s => s.id === id);
      if (hit) return hit;
    }
    return null;
  }

  // ---------------------------------------------------------------- chrome
  function mmRenderCategoryPills() {
    const isKo = state.currentLang === 'ko';
    el.domainFilterGroup.textContent = '';
    const mkPill = (id, label, color) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'domain-pill' + (state.activeDomain === id ? ' active' : '');
      b.dataset.domain = id;
      if (color) b.style.setProperty('--tone', color);
      b.textContent = label;
      b.addEventListener('click', () => {
        state.activeDomain = id;
        if (id !== 'all') {
          const cat = mm.byId['cat:' + id];
          if (cat) cat.expanded = true;
        }
        mmRenderCategoryPills();
        mmRender();
        mmFit();
      });
      return b;
    };
    el.domainFilterGroup.appendChild(mkPill('all', isKo ? '전체' : 'All', null));
    Object.keys(KG_CATEGORIES).forEach(cat => {
      if (!KNOWLEDGE_GRAPH.nodes.some(n => n.cat === cat)) return;
      const c = KG_CATEGORIES[cat];
      el.domainFilterGroup.appendChild(mkPill(cat, isKo ? c.ko : c.en, c.color));
    });
  }

  function mmApplySearch() {
    const q = state.searchQuery.toLowerCase().trim();
    const hits = [];
    Object.values(mm.byId).forEach(n => {
      n.filteredOut = false;
      n.matched = false;
    });
    if (!q) return hits;

    Object.values(mm.byId).forEach(n => {
      if (n.kind === 'root' || n.kind === 'more') return;
      const hay = (n.label_ko + ' ' + n.label_en + ' ' + (n.conceptId || '')).toLowerCase();
      if (hay.includes(q)) { n.matched = true; hits.push(n); }
    });
    hits.forEach(n => mmExpandTo(n.id));
    return hits;
  }

  /** Entry point used by init / tab switch / language toggle. */
  function renderKnowledgeGraph() {
    if (!el.mmSvg) return;
    if (!mm.ready) {
      mmBuildModel();
      mmBindCanvasEvents();
      mm.ready = true;
      mmRenderCategoryPills();
      // open on the summary view: the whole exam at a glance, tail folded away
      mm.summary = true;
      mmSetAll(true, 1);
      if (el.btnMmSummary) el.btnMmSummary.classList.add('is-active');
      mmRender();
      mmRenderPanel();
      mmFitWidth();
      return;
    }
    mmRenderCategoryPills();
    mmRender();
    mmRenderPanel();
  }

  // ==========================================================================
  // Concept Question Modal -- one unified entry point for "practice this
  // concept", whether or not the concept also happens to match a curated
  // AWS_DOMAINS service. Exam tips are shown as a bonus when a service match
  // exists; the question list and quiz actions work for every concept.
  // ==========================================================================
  function openConceptQuestionModal(meta, curated, questions) {
    state.selectedConceptMeta = meta;
    state.selectedCuratedService = curated;
    state.selectedConceptQuestions = questions;
    // Default straight to Practice when this concept has no curated tips --
    // the Tips tab would otherwise open on an empty state every time.
    const isKo = state.currentLang === 'ko';
    const tips = curated ? (isKo ? curated.exam_tips_ko : curated.exam_tips_en) : null;
    state.cqTab = (tips && tips.length > 0) ? 'tips' : 'practice';
    state.cqPractice = { index: 0, userAnswers: {}, revealed: {} };
    renderConceptQuestionModalContent();
    el.modalConceptQuestions.classList.add('active');
  }

  function closeConceptQuestionModal() {
    el.modalConceptQuestions.classList.remove('active');
  }

  // Switches between the "Key Exam Tips" tab and the in-modal "Practice" tab
  // without ever leaving the modal or the mindmap tab.
  function setCqTab(tab) {
    state.cqTab = tab;
    el.btnCqTabTips.classList.toggle('active', tab === 'tips');
    el.btnCqTabPractice.classList.toggle('active', tab === 'practice');
    el.cqTipsPanel.style.display = tab === 'tips' ? '' : 'none';
    el.cqPracticePanel.style.display = tab === 'practice' ? '' : 'none';
    if (tab === 'practice') renderCqPracticePanel();
  }

  function renderConceptQuestionModalContent() {
    const meta = state.selectedConceptMeta;
    const curated = state.selectedCuratedService;
    const questions = state.selectedConceptQuestions || [];
    if (!meta) return;

    const isKo = state.currentLang === 'ko';
    el.cqModalIcon.textContent = (curated && curated.icon) || '📘';
    el.cqModalTitle.textContent = isKo ? meta.label_ko : meta.label_en;
    el.cqModalBadge.textContent = isKo ? `문제 ${questions.length}개` : `${questions.length} questions`;
    el.cqModalLangDisplay.innerHTML = isKo ? '<span class="lang-active">KO</span> / EN' : 'KO / <span class="lang-active">EN</span>';

    // Exam tips are a bonus, only shown when this concept matches a curated
    // AWS_DOMAINS service -- otherwise the tab shows a pointer to Practice.
    el.cqModalTipsList.innerHTML = '';
    const tips = curated ? (isKo ? curated.exam_tips_ko : curated.exam_tips_en) : null;
    const hasTips = !!(tips && tips.length > 0);
    el.cqModalTipsWrap.style.display = hasTips ? '' : 'none';
    el.cqTipsEmptyState.style.display = hasTips ? 'none' : '';
    if (tips) {
      tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        el.cqModalTipsList.appendChild(li);
      });
    }

    setCqTab(state.cqTab || 'tips');
  }

  // In-modal practice: solve every question tagged to this concept, with
  // number/prev/next navigation, right inside the mindmap tab's modal.
  function renderCqPracticePanel() {
    const questions = state.selectedConceptQuestions || [];
    const practice = state.cqPractice;
    if (!practice) return;
    const isKo = state.currentLang === 'ko';

    if (questions.length === 0) {
      el.cqNumStrip.innerHTML = '';
      el.cqLblQuestionNumber.textContent = '';
      el.cqLblQuestionScenario.textContent = isKo ? '이 개념에 연결된 문제가 아직 없습니다.' : 'No questions linked to this concept yet.';
      el.cqOptionsContainer.innerHTML = '';
      el.cqExplanationBox.style.display = 'none';
      el.btnCqPrevQuestion.disabled = true;
      el.btnCqNextQuestion.disabled = true;
      return;
    }

    if (practice.index >= questions.length) practice.index = 0;
    const idx = practice.index;
    const q = questions[idx];

    el.cqLblQuestionNumber.textContent = isKo ? `문제 ${idx + 1} / ${questions.length}` : `Q. ${idx + 1} / ${questions.length}`;
    el.cqLblQuestionScenario.textContent = isKo ? q.question_ko : q.question_en;

    el.cqNumStrip.innerHTML = '';
    questions.forEach((_, i) => {
      const node = document.createElement('div');
      node.className = 'omr-node';
      node.textContent = i + 1;
      if (i === idx) node.classList.add('current');
      if (practice.userAnswers[i] !== undefined) node.classList.add('answered');
      node.addEventListener('click', () => {
        practice.index = i;
        renderCqPracticePanel();
      });
      el.cqNumStrip.appendChild(node);
    });

    el.cqOptionsContainer.innerHTML = '';
    const options = isKo ? q.options_ko : q.options_en;
    const selected = practice.userAnswers[idx];
    const isRevealed = practice.revealed[idx];

    options.forEach((optText, optIdx) => {
      const optItem = document.createElement('div');
      optItem.className = 'option-item';
      if (selected === optIdx) optItem.classList.add('selected');
      if (isRevealed) {
        if (optIdx === q.answer) {
          optItem.classList.add('correct');
        } else if (selected === optIdx && selected !== q.answer) {
          optItem.classList.add('wrong');
        }
      }
      const markerLetter = String.fromCharCode(65 + optIdx);
      optItem.innerHTML = `
        <div class="option-marker">${markerLetter}</div>
        <div class="option-text">${optText}</div>
      `;
      optItem.addEventListener('click', () => {
        practice.userAnswers[idx] = optIdx;
        practice.revealed[idx] = true;
        renderCqPracticePanel();
      });
      el.cqOptionsContainer.appendChild(optItem);
    });

    if (isRevealed) {
      el.cqExplanationBox.style.display = 'block';
      el.cqLblExplanationText.innerHTML = renderExplanationMarkdown(isKo ? q.explanation_ko : q.explanation_en);
    } else {
      el.cqExplanationBox.style.display = 'none';
    }

    el.btnCqPrevQuestion.disabled = idx === 0;
    el.btnCqNextQuestion.disabled = idx === questions.length - 1;
  }

  // ==========================================================================
  // Exam Simulator Engine
  // ==========================================================================
  function startExam(customQuestionList = null, options = {}) {
    const infinite = !!options.infinite;
    const allQuestions = getAllQuestions();
    let questionsPool = [];
    let sourcePool = null; // infinite mode only: pool to keep drawing random questions from

    if (customQuestionList && customQuestionList.length > 0) {
      if (infinite) {
        sourcePool = [...customQuestionList];
        questionsPool = shuffleArray(sourcePool).slice(0, Math.min(20, sourcePool.length));
      } else {
        questionsPool = [...customQuestionList];
      }
    } else {
      const selectedDomain = el.selectExamDomain.value;
      const domainPool = selectedDomain === 'all' ? [...allQuestions] : allQuestions.filter(q => q.domain_id === selectedDomain);

      if (infinite) {
        sourcePool = domainPool;
        questionsPool = shuffleArray(sourcePool).slice(0, Math.min(20, sourcePool.length));
      } else {
        const count = parseInt(el.selectExamCount.value, 10) || 20;
        const wanted = Math.min(count, domainPool.length);
        const short = count - wanted;
        questionsPool = shuffleArray(domainPool).slice(0, wanted);
        // the bank used to be silently truncated — say so instead
        if (short > 0) {
          alert(state.currentLang === 'ko'
            ? `요청한 ${count}문항 중 ${wanted}문항만 출제됩니다.\n선택한 범위의 문제은행에 ${wanted}문제밖에 없습니다.`
            : `Only ${wanted} of the ${count} requested questions are available in this bank.`);
        }
      }
    }

    if ((infinite && (!sourcePool || sourcePool.length === 0)) || (!infinite && questionsPool.length === 0)) {
      alert(state.currentLang === 'ko' ? '선택한 조건의 문제가 없습니다.' : 'No questions found for the selected filter.');
      return;
    }

    // Shuffle each question's options and remap the answer index. Without this,
    // the curated bank's answer is 'B' on 14 of 16 questions, so memorising the
    // position alone scores a pass. Also protects against biased imported dumps.
    questionsPool = questionsPool.map(withShuffledOptions);

    // Calculate time: standard 2 minutes per question. Infinite mode has no
    // fixed length, so it runs with no countdown at all.
    const timeMinutes = infinite ? 0 : Math.min(130, Math.max(10, Math.round(questionsPool.length * 2)));
    const totalSeconds = infinite ? 0 : timeMinutes * 60;

    state.examSession = {
      active: true,
      mode: infinite ? 'infinite' : 'fixed',
      homeTab: state.currentTab,
      sourcePool,
      questions: questionsPool,
      currentIndex: 0,
      userAnswers: {},
      flagged: {},
      revealed: {},
      timeRemaining: totalSeconds,
      totalTime: totalSeconds,
      elapsedSeconds: 0,
      timerInterval: null,
      isSubmitted: false
    };

    updateSubmitButtonLabel();

    // UI screen toggle -- hide whichever tab-view is currently showing (the
    // exam screens live outside the tab-view system, see switchTab()) and
    // reveal the exam overlay in its place, without changing state.currentTab
    // or the nav-bar highlight. This lets e.g. local dump practice run
    // without navigating away from its own tab.
    el.tabViews.forEach(v => v.classList.remove('active'));
    el.examSetupScreen.style.display = 'none';
    el.examResultScreen.style.display = 'none';
    el.examInProgressScreen.style.display = 'block';

    // Start Timer
    startExamTimer();
    renderCurrentQuestion();
    renderOmrSheet();
  }

  // Infinite mode draws one more random question from the session's source
  // pool instead of running out — avoids repeating the question just shown
  // when the pool has more than one candidate.
  function growInfiniteSession(session) {
    if (!session.sourcePool || session.sourcePool.length === 0) return;
    const last = session.questions[session.questions.length - 1];
    let candidate = session.sourcePool[Math.floor(Math.random() * session.sourcePool.length)];
    if (session.sourcePool.length > 1) {
      let guard = 0;
      while (last && candidate.id === last.id && guard < 10) {
        candidate = session.sourcePool[Math.floor(Math.random() * session.sourcePool.length)];
        guard++;
      }
    }
    session.questions.push(withShuffledOptions(candidate));
  }

  // Relabels the submit button "시험 강제 종료 / End Session" in infinite
  // mode (there is no fixed end to "submit"), vs. the normal fixed-length
  // "최종 답안 제출 / Submit Exam" wording.
  function updateSubmitButtonLabel() {
    const infinite = state.examSession.mode === 'infinite';
    const isKo = state.currentLang === 'ko';
    if (el.lblSubmitExamText) {
      el.lblSubmitExamText.setAttribute('data-ko', infinite ? '시험 강제 종료' : '최종 답안 제출');
      el.lblSubmitExamText.setAttribute('data-en', infinite ? 'End Session' : 'Submit Exam');
      el.lblSubmitExamText.textContent = isKo ? el.lblSubmitExamText.getAttribute('data-ko') : el.lblSubmitExamText.getAttribute('data-en');
    }
    if (el.iconSubmitExam) {
      el.iconSubmitExam.textContent = infinite ? '🛑' : '🏁';
    }
  }

  function startExamTimer() {
    const session = state.examSession;
    if (session.timerInterval) {
      clearInterval(session.timerInterval);
    }

    updateTimerDisplay();

    session.timerInterval = setInterval(() => {
      session.elapsedSeconds++;
      if (session.mode === 'infinite') {
        updateTimerDisplay();
        return;
      }
      if (session.timeRemaining > 0) {
        session.timeRemaining--;
        updateTimerDisplay();
      } else {
        clearInterval(session.timerInterval);
        alert(state.currentLang === 'ko' ? '시험 시간이 종료되었습니다! 자동 채점됩니다.' : 'Time is up! Submitting answers automatically.');
        submitExam();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const session = state.examSession;
    if (session.mode === 'infinite') {
      const mins = Math.floor(session.elapsedSeconds / 60);
      const secs = session.elapsedSeconds % 60;
      el.examTimerDisplay.textContent = `∞ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      el.examTimerDisplay.classList.remove('warning');
      return;
    }

    const mins = Math.floor(session.timeRemaining / 60);
    const secs = session.timeRemaining % 60;
    const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    el.examTimerDisplay.textContent = str;

    if (session.timeRemaining <= 300) {
      el.examTimerDisplay.classList.add('warning');
    } else {
      el.examTimerDisplay.classList.remove('warning');
    }
  }

  function renderCurrentQuestion() {
    const session = state.examSession;
    const idx = session.currentIndex;
    const q = session.questions[idx];
    const isKo = state.currentLang === 'ko';

    el.lblQuestionNumber.textContent = session.mode === 'infinite'
      ? (isKo ? `문제 ${idx + 1} (무한 모드)` : `Q. ${idx + 1} (Infinite Mode)`)
      : `Q. ${idx + 1} / ${session.questions.length}`;
    el.lblQuestionDomain.textContent = (q.domain_id || 'General').toUpperCase();
    el.lblQuestionScenario.textContent = isKo ? q.question_ko : q.question_en;

    // Flag button status
    const isFlagged = !!session.flagged[idx];
    el.btnToggleFlag.classList.toggle('flagged', isFlagged);
    el.lblFlagText.textContent = isFlagged 
      ? (isKo ? '검토 표시됨' : 'Flagged') 
      : (isKo ? '검토 표시' : 'Flag');

    // Render Options
    el.optionsContainer.innerHTML = '';
    const options = isKo ? q.options_ko : q.options_en;
    const currentSelected = session.userAnswers[idx];
    const isRevealed = session.revealed[idx] || session.isSubmitted;

    options.forEach((optText, optIdx) => {
      const optItem = document.createElement('div');
      optItem.className = 'option-item';

      if (currentSelected === optIdx) {
        optItem.classList.add('selected');
      }

      if (isRevealed) {
        if (optIdx === q.answer) {
          optItem.classList.add('correct');
        } else if (currentSelected === optIdx && currentSelected !== q.answer) {
          optItem.classList.add('wrong');
        }
      }

      const markerLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
      optItem.innerHTML = `
        <div class="option-marker">${markerLetter}</div>
        <div class="option-text">${optText}</div>
      `;

      if (!session.isSubmitted) {
        optItem.addEventListener('click', () => {
          session.userAnswers[idx] = optIdx;
          // Infinite mode is a flashcard-style drill: show right/wrong and
          // the explanation the instant an option is picked, no separate
          // "Show Explanation" click needed.
          if (session.mode === 'infinite') {
            session.revealed[idx] = true;
          }
          renderCurrentQuestion();
          renderOmrSheet();
        });
      }

      el.optionsContainer.appendChild(optItem);
    });

    // Explanation Box
    if (isRevealed) {
      el.questionExplanationBox.style.display = 'block';
      el.lblExplanationText.innerHTML = renderExplanationMarkdown(isKo ? q.explanation_ko : q.explanation_en);
    } else {
      el.questionExplanationBox.style.display = 'none';
    }

    // Infinite mode has no fixed question count to map onto an OMR sheet,
    // and the explanation already appears automatically on selection.
    if (el.omrSheetCard) el.omrSheetCard.style.display = session.mode === 'infinite' ? 'none' : '';
    el.btnShowExplanation.style.display = session.mode === 'infinite' ? 'none' : '';

    // Navigation buttons state -- infinite mode can always advance (it draws
    // another random question on demand instead of running out).
    el.btnPrevQuestion.disabled = idx === 0;
    el.btnNextQuestion.disabled = session.mode !== 'infinite' && idx === session.questions.length - 1;
  }

  function renderOmrSheet() {
    const session = state.examSession;
    el.omrGridContainer.innerHTML = '';

    let answeredCount = 0;

    session.questions.forEach((_, idx) => {
      const node = document.createElement('div');
      node.className = 'omr-node';
      node.textContent = idx + 1;

      if (idx === session.currentIndex) {
        node.classList.add('current');
      }
      if (session.userAnswers[idx] !== undefined) {
        node.classList.add('answered');
        answeredCount++;
      }
      if (session.flagged[idx]) {
        node.classList.add('flagged');
      }

      node.addEventListener('click', () => {
        session.currentIndex = idx;
        renderCurrentQuestion();
        renderOmrSheet();
      });

      el.omrGridContainer.appendChild(node);
    });

    el.lblOmrProgress.textContent = `${answeredCount} / ${session.questions.length}`;
  }

  function submitExam() {
    const session = state.examSession;
    if (session.timerInterval) {
      clearInterval(session.timerInterval);
    }

    session.isSubmitted = true;

    // Calculate score
    let correctCount = 0;
    const wrongQuestions = [];

    session.questions.forEach((q, idx) => {
      const userAns = session.userAnswers[idx];
      if (userAns === q.answer) {
        correctCount++;
      } else {
        wrongQuestions.push({
          question: q,
          userAnswer: userAns,
          date: new Date().toISOString()
        });
      }
    });

    const totalQuestions = session.questions.length;
    const rawScorePercentage = Math.round((correctCount / totalQuestions) * 100);
    // Scaled AWS score: 100 to 1000 scale
    const scaledScore = Math.round(100 + (correctCount / totalQuestions) * 900);
    const isPassed = scaledScore >= 720;

    // Save incorrect questions to LocalStorage
    if (wrongQuestions.length > 0) {
      saveIncorrectNotes(wrongQuestions);
    }

    // Render Result Screen
    el.examInProgressScreen.style.display = 'none';
    el.examResultScreen.style.display = 'block';

    const isKo = state.currentLang === 'ko';
    el.resultStatusBadge.className = `result-status-badge ${isPassed ? 'pass' : 'fail'}`;
    el.resultStatusBadge.textContent = isPassed 
      ? (isKo ? '🎉 합격 (PASS)' : '🎉 PASS') 
      : (isKo ? '❌ 불합격 (FAIL)' : '❌ FAIL');

    el.lblFinalScore.textContent = `${scaledScore} / 1000`;
    el.lblScoreMeta.textContent = isKo 
      ? `합격 기준: 720점 이상 (총 ${totalQuestions}문제 중 ${correctCount}문제 정답 - ${rawScorePercentage}%)`
      : `Passing Score: 720+ (${correctCount} of ${totalQuestions} correct - ${rawScorePercentage}%)`;

    el.statCorrectCount.textContent = correctCount;
    el.statIncorrectCount.textContent = totalQuestions - correctCount;

    const timeSpentSec = session.elapsedSeconds;
    const spentMins = Math.floor(timeSpentSec / 60);
    const spentSecs = timeSpentSec % 60;
    el.statTimeSpent.textContent = `${spentMins}분 ${spentSecs}초`;
  }

  // ==========================================================================
  // Incorrect Notes Management
  // ==========================================================================
  function loadIncorrectNotes() {
    try {
      const stored = localStorage.getItem('aws_saa_incorrect_notes');
      state.incorrectNotes = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse incorrect notes:', e);
      state.incorrectNotes = [];
    }
  }

  function saveIncorrectNotes(newWrongList) {
    const existingMap = new Map();
    state.incorrectNotes.forEach(item => {
      if (item && item.question) {
        existingMap.set(item.question.id, item);
      }
    });

    newWrongList.forEach(item => {
      existingMap.set(item.question.id, item);
    });

    state.incorrectNotes = Array.from(existingMap.values());
    try {
      localStorage.setItem('aws_saa_incorrect_notes', JSON.stringify(state.incorrectNotes));
    } catch (e) {
      console.error('Failed to save incorrect notes:', e);
    }
    updateIncorrectBadge();
  }

  function updateIncorrectBadge() {
    const count = state.incorrectNotes.length;
    if (count > 0) {
      el.incorrectBadgeCount.style.display = 'inline-block';
      el.incorrectBadgeCount.textContent = count;
    } else {
      el.incorrectBadgeCount.style.display = 'none';
    }
  }

  function renderIncorrectNotes() {
    if (!el.incorrectListContainer) return;
    el.incorrectListContainer.innerHTML = '';

    const isKo = state.currentLang === 'ko';

    if (state.incorrectNotes.length === 0) {
      el.incorrectListContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
          <h3>${isKo ? '오답 노트가 비어 있습니다!' : 'Incorrect Notes are Empty!'}</h3>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">${isKo ? '모의고사를 풀고 틀린 문제가 여기에 자동으로 기록됩니다.' : 'Wrong questions from exam sessions will appear here.'}</p>
        </div>
      `;
      return;
    }

    state.incorrectNotes.forEach((item, idx) => {
      const q = item.question;
      const card = document.createElement('div');
      card.className = 'incorrect-card';

      const userAnsText = item.userAnswer !== undefined 
        ? (isKo ? q.options_ko[item.userAnswer] : q.options_en[item.userAnswer])
        : (isKo ? '미응답' : 'Unanswered');
      
      const correctAnsText = isKo ? q.options_ko[q.answer] : q.options_en[q.answer];

      card.innerHTML = `
        <div class="incorrect-card-top">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-weight: 800; color: var(--color-security);">#${idx + 1}</span>
            <span class="service-badge">${(q.domain_id || 'AWS').toUpperCase()}</span>
          </div>
          <button class="btn-remove-note" data-id="${q.id}" title="${isKo ? '오답노트에서 삭제' : 'Remove'}">✕ ${isKo ? '삭제' : 'Delete'}</button>
        </div>
        <div style="font-size: 1rem; font-weight: 600; color: var(--text-highlight); margin-bottom: 1rem; line-height: 1.5;">
          ${isKo ? q.question_ko : q.question_en}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div style="background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.2); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
            <strong style="color: var(--color-security);">❌ ${isKo ? '내가 고른 오답' : 'Your Answer'}:</strong>
            <div style="color: var(--text-main); margin-top: 0.25rem;">${userAnsText}</div>
          </div>
          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
            <strong style="color: var(--accent-emerald);">✅ ${isKo ? '정답' : 'Correct Answer'}:</strong>
            <div style="color: var(--text-main); margin-top: 0.25rem;">${correctAnsText}</div>
          </div>
        </div>
        <div class="explanation-box" style="margin-top: 0;">
          <div class="explanation-title">💡 ${isKo ? '핵심 개념 해설' : 'Key Explanation'}</div>
          <div class="explanation-content">${renderExplanationMarkdown(isKo ? q.explanation_ko : q.explanation_en)}</div>
        </div>
      `;

      // Remove single note handler
      card.querySelector('.btn-remove-note').addEventListener('click', (e) => {
        const idToRemove = e.target.getAttribute('data-id');
        state.incorrectNotes = state.incorrectNotes.filter(n => n.question.id !== idToRemove);
        localStorage.setItem('aws_saa_incorrect_notes', JSON.stringify(state.incorrectNotes));
        updateIncorrectBadge();
        renderIncorrectNotes();
      });

      el.incorrectListContainer.appendChild(card);
    });
  }

  // ==========================================================================
  // Language & Global UI Translation
  // ==========================================================================
  function toggleLanguage() {
    state.currentLang = state.currentLang === 'ko' ? 'en' : 'ko';
    updateLanguageUI();
    mmRenderCategoryPills();
    mmRender();
    mmRenderPanel();
    if (state.selectedConceptMeta) renderConceptQuestionModalContent();
    if (state.examSession.active && !state.examSession.isSubmitted) renderCurrentQuestion();
    if (state.currentTab === 'incorrect') renderIncorrectNotes();
  }

  function updateLanguageUI() {
    const isKo = state.currentLang === 'ko';
    el.currentLangDisplay.innerHTML = isKo 
      ? '<span class="lang-active">KO</span> / EN' 
      : 'KO / <span class="lang-active">EN</span>';

    // Translate static elements with data-ko / data-en attributes
    document.querySelectorAll('[data-ko]').forEach(node => {
      const koText = node.getAttribute('data-ko');
      const enText = node.getAttribute('data-en');
      if (node.tagName === 'INPUT') {
        node.placeholder = isKo ? koText : enText;
      } else {
        node.textContent = isKo ? koText : enText;
      }
    });

    if (el.inputMindmapSearch) {
      el.inputMindmapSearch.placeholder = isKo 
        ? '개념 검색 (예: EC2, S3, 비용 최적화...)'
        : 'Search concepts (e.g. EC2, S3, cost...)';
    }
  }

  // ==========================================================================
  // Event Listeners & Binding
  // ==========================================================================
  function bindEvents() {
    // Navigation Tab Switching
    el.navTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });

    el.navBrandLogo.addEventListener('click', () => switchTab('mindmap'));

    // Global Language Toggle
    el.btnGlobalLangToggle.addEventListener('click', toggleLanguage);
    el.btnCqModalLangToggle.addEventListener('click', toggleLanguage);

    // Mindmap search: expand the branches holding every match
    el.inputMindmapSearch.addEventListener('input', debounce((e) => {
      state.searchQuery = e.target.value;
      const hits = mmApplySearch();
      mmRender();
      // a query like "kms" also matches that concept's exam-point leaves, so
      // narrow to concept-level hits before deciding it is unambiguous
      const conceptHits = hits.filter(n => n.kind === 'concept');
      if (conceptHits.length === 1) {
        mmSelect(conceptHits[0].id);
      } else if (!state.searchQuery.trim()) {
        mmFit();
      }
    }, 220));

    // Concept Question Modal Controls
    el.btnCloseConceptQuestions.addEventListener('click', closeConceptQuestionModal);
    el.btnCloseConceptQuestionsFooter.addEventListener('click', closeConceptQuestionModal);
    el.modalConceptQuestions.addEventListener('click', (e) => {
      if (e.target === el.modalConceptQuestions) closeConceptQuestionModal();
    });

    // Tips <-> Practice tab switch, in-modal question navigation
    el.btnCqTabTips.addEventListener('click', () => setCqTab('tips'));
    el.btnCqTabPractice.addEventListener('click', () => setCqTab('practice'));

    el.btnCqPrevQuestion.addEventListener('click', () => {
      if (state.cqPractice.index > 0) {
        state.cqPractice.index--;
        renderCqPracticePanel();
      }
    });
    el.btnCqNextQuestion.addEventListener('click', () => {
      const total = (state.selectedConceptQuestions || []).length;
      if (state.cqPractice.index < total - 1) {
        state.cqPractice.index++;
        renderCqPracticePanel();
      }
    });

    // Exam Controls
    el.btnStartExam.addEventListener('click', () => {
      startExam(null, { infinite: el.selectExamCount.value === 'infinite' });
    });

    // Local-only dump practice
    if (el.btnStartLocalDumpExam) {
      el.btnStartLocalDumpExam.addEventListener('click', () => {
        const val = el.selectLocalDumpCount.value;
        if (val === 'infinite') {
          startExam(LOCAL_DUMP_BANK, { infinite: true });
        } else {
          const count = parseInt(val, 10) || 20;
          const wanted = Math.min(count, LOCAL_DUMP_BANK.length);
          startExam(shuffleArray(LOCAL_DUMP_BANK).slice(0, wanted));
        }
      });
    }

    el.btnToggleFlag.addEventListener('click', () => {
      const idx = state.examSession.currentIndex;
      state.examSession.flagged[idx] = !state.examSession.flagged[idx];
      renderCurrentQuestion();
      renderOmrSheet();
    });

    el.btnShowExplanation.addEventListener('click', () => {
      const idx = state.examSession.currentIndex;
      state.examSession.revealed[idx] = !state.examSession.revealed[idx];
      renderCurrentQuestion();
    });

    el.btnPrevQuestion.addEventListener('click', () => {
      if (state.examSession.currentIndex > 0) {
        state.examSession.currentIndex--;
        renderCurrentQuestion();
        renderOmrSheet();
      }
    });

    el.btnNextQuestion.addEventListener('click', () => {
      const session = state.examSession;
      if (session.mode === 'infinite' && session.currentIndex === session.questions.length - 1) {
        growInfiniteSession(session);
      }
      if (session.currentIndex < session.questions.length - 1) {
        session.currentIndex++;
        renderCurrentQuestion();
        renderOmrSheet();
      }
    });

    el.btnSubmitExam.addEventListener('click', () => {
      const session = state.examSession;
      const isKo = state.currentLang === 'ko';
      let confirmMsg;
      if (session.mode === 'infinite') {
        const answered = session.questions.filter((_, idx) => session.userAnswers[idx] !== undefined).length;
        confirmMsg = isKo
          ? `지금까지 푼 ${answered}문제를 기준으로 채점하고 시험을 종료합니다. 계속할까요?`
          : `This will end the session and score your ${answered} answered question(s) so far. Continue?`;
      } else {
        const unanswered = session.questions.filter((_, idx) => session.userAnswers[idx] === undefined).length;
        confirmMsg = unanswered > 0
          ? (isKo ? `아직 풀지 않은 문제가 ${unanswered}개 있습니다. 정말로 제출하시겠습니까?` : `You have ${unanswered} unanswered questions. Submit anyway?`)
          : (isKo ? '모든 답안을 제출하시겠습니까?' : 'Do you want to submit your final answers?');
      }

      if (confirm(confirmMsg)) {
        submitExam();
      }
    });

    el.btnRestartExam.addEventListener('click', () => {
      state.examSession.active = false;
      switchTab(state.currentTab);
    });

    el.btnGoToIncorrectNotes.addEventListener('click', () => {
      switchTab('incorrect');
    });

    // Incorrect Notes Controls
    el.btnClearAllIncorrect.addEventListener('click', () => {
      const isKo = state.currentLang === 'ko';
      if (confirm(isKo ? '오답 노트를 모두 삭제하시겠습니까?' : 'Clear all incorrect notes?')) {
        state.incorrectNotes = [];
        localStorage.removeItem('aws_saa_incorrect_notes');
        updateIncorrectBadge();
        renderIncorrectNotes();
      }
    });

    el.btnRetakeIncorrectExam.addEventListener('click', () => {
      if (state.incorrectNotes.length === 0) {
        alert(state.currentLang === 'ko' ? '오답 노트가 비어 있습니다.' : 'No incorrect notes to retake.');
        return;
      }
      const questions = state.incorrectNotes.map(n => n.question);
      switchTab('exam');
      startExam(questions);
    });

  }

  function switchTab(tabId) {
    state.currentTab = tabId;

    el.navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });

    el.tabViews.forEach(view => {
      view.classList.remove('active');
    });

    // The exam-in-progress/result screens live outside the tab-view system
    // (see startExam()) so a session started from a tab other than "exam"
    // (e.g. local dump practice) stays visible without navigating away from
    // it. Only keep them on screen if this is still the tab the active
    // session was launched from -- otherwise hide them and let the target
    // tab show its own normal content.
    const keepExamOverlay = state.examSession.active && state.examSession.homeTab === tabId;
    if (!keepExamOverlay) {
      el.examInProgressScreen.style.display = 'none';
      el.examResultScreen.style.display = 'none';
    }

    if (tabId === 'mindmap') {
      document.getElementById('viewMindmap').classList.add('active');
      renderKnowledgeGraph();
    } else if (tabId === 'exam') {
      document.getElementById('viewExam').classList.add('active');
      if (!keepExamOverlay) el.examSetupScreen.style.display = 'block';
    } else if (tabId === 'incorrect') {
      document.getElementById('viewIncorrect').classList.add('active');
      renderIncorrectNotes();
    } else if (tabId === 'localdump') {
      document.getElementById('viewLocalDump').classList.add('active');
    }
  }

  // ==========================================================================
  // Helper Utilities
  // ==========================================================================
  /**
   * Returns a copy of the question with its options in random order and the
   * answer index remapped to follow. Both language variants are permuted with
   * the same order so option A always means the same thing in KO and EN.
   */
  function withShuffledOptions(q) {
    const ko = Array.isArray(q.options_ko) ? q.options_ko : [];
    const en = Array.isArray(q.options_en) ? q.options_en : [];
    const n = Math.max(ko.length, en.length);
    if (n < 2 || typeof q.answer !== 'number') return q;

    const order = shuffleArray(Array.from({ length: n }, (_, i) => i));
    const newAnswer = order.indexOf(q.answer);
    if (newAnswer < 0) return q;   // answer out of range: leave it untouched

    return Object.assign({}, q, {
      options_ko: order.map(i => ko[i]),
      options_en: order.map(i => en[i]),
      answer: newAnswer
    });
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Explanation text ranges from plain one-line dump answers to richly
  // formatted generated-question write-ups (**bold**, `code`, - bullet and
  // 1. numbered lists, ### headings, --- dividers). Rendering it as plain
  // textContent collapsed everything into one unreadable wall of text with
  // literal asterisks. This renders that limited markdown subset as HTML
  // instead -- text is escaped first, so nothing in the source can inject
  // extra markup.
  function renderExplanationMarkdown(text) {
    if (!text) return '';
    const escapeHtml = s => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    let html = escapeHtml(String(text));
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/^###\s*(.+)$/gm, '<span class="exp-heading">$1</span>');
    html = html.replace(/^---+$/gm, '<hr class="exp-divider">');

    const blocks = html.split(/\n\s*\n/);
    return blocks.map(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return '';
      if (lines.length === 1 && /^(<span class="exp-heading">|<hr class="exp-divider">)/.test(lines[0])) {
        return lines[0];
      }
      if (lines.every(l => /^[-*]\s+/.test(l))) {
        return '<ul>' + lines.map(l => `<li>${l.replace(/^[-*]\s+/, '')}</li>`).join('') + '</ul>';
      }
      if (lines.every(l => /^\d+[.)]\s+/.test(l))) {
        return '<ol>' + lines.map(l => `<li>${l.replace(/^\d+[.)]\s+/, '')}</li>`).join('') + '</ol>';
      }
      return `<p>${lines.join('<br>')}</p>`;
    }).join('');
  }

  function debounce(fn, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Start Application
  init();
});
