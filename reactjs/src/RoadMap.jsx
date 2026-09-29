import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getApiUrl } from "./api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  :root {
    --bg:#080B12; --bg2:#0D1117; --bg3:#111620;
    --surface:#141920; --surface2:#1A2030; --surface3:#1F2738;
    --border:rgba(255,255,255,.07); --border2:rgba(255,255,255,.13); --border3:rgba(255,255,255,.22);
    --cyan:#00D4FF; --cyan-dim:rgba(0,212,255,.12); --cyan-glow:rgba(0,212,255,.25);
    --blue:#3B82F6; --blue-dim:rgba(59,130,246,.12);
    --violet:#8B5CF6; --violet-dim:rgba(139,92,246,.12); --violet-glow:rgba(139,92,246,.3);
    --emerald:#10B981; --emerald-dim:rgba(16,185,129,.12);
    --rose:#F43F5E; --rose-dim:rgba(244,63,94,.12);
    --amber:#F59E0B; --amber-dim:rgba(245,158,11,.12);
    --text:#F1F5F9; --text2:#CBD5E1; --muted:#64748B; --hint:#475569;
    --r-sm:8px; --r-md:14px; --r-lg:20px; --r-xl:28px; --r-2xl:36px;
    --glow-cyan:0 0 30px rgba(0,212,255,.18),0 0 60px rgba(0,212,255,.08);
    --glow-violet:0 0 30px rgba(139,92,246,.2),0 0 60px rgba(139,92,246,.09);
  }

  html,body { height:100%; width:100%; background:var(--bg); color:var(--text); font-family:'Outfit',sans-serif; overflow-x:hidden; }

  body::before {
    content:''; position:fixed; inset:0; z-index:0;
    background-image:linear-gradient(rgba(0,212,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.03) 1px,transparent 1px);
    background-size:48px 48px; pointer-events:none;
  }
  body::after {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background:radial-gradient(ellipse 60% 50% at 15% 25%,rgba(139,92,246,.08) 0%,transparent 60%),
      radial-gradient(ellipse 50% 40% at 85% 70%,rgba(0,212,255,.07) 0%,transparent 60%);
    animation:orbDrift 18s ease-in-out infinite alternate;
  }
  @keyframes orbDrift { from{transform:scale(1) rotate(0deg)} to{transform:scale(1.06) rotate(2deg)} }
  @keyframes slideDown  { from{opacity:0;transform:translateY(-36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(44px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes glowLine   { from{background-position:0% 50%} to{background-position:100% 50%} }
  @keyframes pulse2     { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes spin       { to{transform:rotate(360deg)} }
  @keyframes borderGlow { 0%,100%{box-shadow:0 0 0 1px rgba(0,212,255,.25),var(--glow-cyan)} 50%{box-shadow:0 0 0 1px rgba(139,92,246,.35),var(--glow-violet)} }
  @keyframes nodeAppear { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
  @keyframes lineGrow   { from{stroke-dashoffset:1} to{stroke-dashoffset:0} }

  .app { position:relative; z-index:1; min-height:100vh; padding:3rem 1.5rem 7rem; max-width:1100px; margin:0 auto; }

  .header { text-align:center; margin-bottom:3rem; animation:slideDown 1s cubic-bezier(.16,1,.3,1); }
  .status-badge {
    display:inline-flex; align-items:center; gap:.55rem;
    background:rgba(0,212,255,.06); border:1px solid rgba(0,212,255,.22); color:var(--cyan);
    font-family:'Fira Code',monospace; font-size:.6rem; letter-spacing:.2em; text-transform:uppercase;
    padding:.45rem 1.3rem; border-radius:100px; margin-bottom:1.4rem;
    box-shadow:0 0 20px rgba(0,212,255,.12); animation:borderGlow 4s ease-in-out infinite;
  }
  .status-dot { width:7px; height:7px; border-radius:50%; background:var(--cyan); animation:pulse2 1.6s infinite; box-shadow:0 0 8px var(--cyan); }
  .main-title { font-family:'Syne',sans-serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:800; letter-spacing:-.03em; line-height:1.04; }
  .title-accent {
    background:linear-gradient(135deg,var(--cyan) 0%,var(--violet) 60%,var(--blue) 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-size:200% 200%; animation:glowLine 4s linear infinite;
  }

  .back-btn {
    display:inline-flex; align-items:center; gap:.6rem;
    background:var(--surface); border:1px solid var(--border2); color:var(--text2);
    font-family:'Fira Code',monospace; font-size:.65rem; letter-spacing:.1em;
    padding:.6rem 1.2rem; border-radius:100px; cursor:pointer; transition:all .2s; margin-bottom:2rem;
    animation:fadeUp .5s cubic-bezier(.16,1,.3,1);
  }
  .back-btn:hover { border-color:var(--cyan); color:var(--cyan); box-shadow:0 0 16px rgba(0,212,255,.12); transform:translateX(-4px); }

  /* Loading */
  .loading-screen { max-width:600px; margin:0 auto; text-align:center; animation:fadeUp .6s cubic-bezier(.16,1,.3,1); }
  .loading-orb { width:120px; height:120px; margin:0 auto 2rem; position:relative; }
  .loading-orb-inner {
    width:100%; height:100%; border-radius:50%;
    background:radial-gradient(circle at 35% 35%,rgba(0,212,255,.3),rgba(139,92,246,.2),transparent);
    border:1px solid rgba(0,212,255,.3); display:flex; align-items:center; justify-content:center; font-size:3rem;
    box-shadow:0 0 40px rgba(0,212,255,.15),0 0 80px rgba(139,92,246,.08);
  }
  .loading-ring  { position:absolute; inset:-8px;  border:2px solid transparent; border-top-color:var(--cyan);   border-right-color:rgba(0,212,255,.3);  border-radius:50%; animation:spin 1.4s linear infinite; }
  .loading-ring2 { position:absolute; inset:-16px; border:1px solid transparent; border-bottom-color:var(--violet); border-left-color:rgba(139,92,246,.2); border-radius:50%; animation:spin 2.2s linear infinite reverse; }
  .loading-title { font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:700; margin-bottom:.6rem; }
  .loading-sub   { font-family:'Fira Code',monospace; font-size:.65rem; color:var(--muted); letter-spacing:.1em; }

  /* Legend */
  .legend {
    display:flex; flex-wrap:wrap; gap:.6rem; justify-content:center;
    max-width:900px; margin:0 auto 2.5rem; animation:fadeUp .7s .2s cubic-bezier(.16,1,.3,1) both;
  }
  .legend-item {
    display:flex; align-items:center; gap:.45rem; padding:.35rem .9rem;
    background:var(--surface); border:1px solid var(--border); border-radius:100px;
    font-family:'Fira Code',monospace; font-size:.6rem; color:var(--text2); letter-spacing:.07em;
  }
  .legend-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }

  /* Progress bar */
  .progress-bar-wrap { max-width:900px; margin:0 auto 2rem; animation:fadeUp .6s .1s cubic-bezier(.16,1,.3,1) both; }
  .progress-meta { display:flex; justify-content:space-between; font-family:'Fira Code',monospace; font-size:.6rem; color:var(--muted); margin-bottom:.5rem; }
  .progress-track { background:var(--surface2); border-radius:100px; height:5px; overflow:hidden; }
  .progress-fill  { height:100%; border-radius:100px; background:linear-gradient(90deg,var(--cyan),var(--violet)); transition:width .8s cubic-bezier(.16,1,.3,1); }

  /* Roadmap canvas */
  .roadmap-wrap {
    max-width:960px; margin:0 auto; overflow-x:auto;
    -webkit-overflow-scrolling:touch; border-radius:var(--r-lg);
  }
  .roadmap-svg  { width:100%; min-width:700px; }

  /* Roadmap nodes */
  .rm-node { cursor:pointer; }
  .rm-node rect { transition:filter .2s; }
  .rm-node:hover rect { filter:brightness(1.18); }
  .rm-node text { pointer-events:none; }

  /* Tooltip */
  .tooltip {
    position:fixed; z-index:100; max-width:320px;
    background:var(--surface2); border:1px solid var(--border2); border-radius:var(--r-md);
    padding:1rem 1.2rem; font-family:'Outfit',sans-serif; box-shadow:0 12px 40px rgba(0,0,0,.5);
    pointer-events:none; opacity:0; transition:opacity .18s;
  }
  .tooltip.visible { opacity:1; }
  .tooltip-title { font-family:'Syne',sans-serif; font-size:.92rem; font-weight:700; margin-bottom:.45rem; }
  .tooltip-desc  { font-size:.78rem; color:var(--text2); line-height:1.65; }
  .tooltip-tag   { display:inline-block; margin-top:.6rem; padding:.2rem .65rem; border-radius:100px; font-family:'Fira Code',monospace; font-size:.58rem; letter-spacing:.1em; }

  /* Section tabs */
  .section-tabs  { display:flex; gap:.5rem; flex-wrap:wrap; justify-content:center; max-width:900px; margin:0 auto 2rem; animation:fadeUp .6s .15s cubic-bezier(.16,1,.3,1) both; }
  .section-tab   {
    padding:.45rem 1.1rem; border-radius:100px; border:1px solid var(--border2); background:var(--surface);
    color:var(--muted); font-family:'Fira Code',monospace; font-size:.62rem; letter-spacing:.08em;
    cursor:pointer; transition:all .2s;
  }
  .section-tab.active,
  .section-tab:hover { border-color:var(--cyan); color:var(--cyan); background:var(--cyan-dim); }

  .error-box {
    text-align:center; color:var(--rose); font-family:'Fira Code',monospace; font-size:.75rem;
    padding:1.5rem; border:1px solid rgba(244,63,94,.25); border-radius:var(--r-md); margin:2rem auto; max-width:600px;
    background:var(--rose-dim);
  }

  /* ── Mobile Responsive Overrides ── */
  @media(max-width:768px) {
    .app { padding:2rem 1rem 5rem; }
    .header { margin-bottom:2rem; }
    .status-badge { font-size:.52rem; padding:.35rem 1.1rem; }
    .main-title { font-size:clamp(1.8rem,6vw,2.8rem); }
    .legend { gap:.4rem; margin-bottom:1.5rem; }
    .legend-item { font-size:.55rem; padding:.28rem .7rem; }
    .section-tabs { gap:.35rem; margin-bottom:1.5rem; }
    .section-tab { font-size:.58rem; padding:.35rem .8rem; }
    .roadmap-wrap {
      border:1px solid var(--border);
      background:var(--bg2); padding:.5rem;
    }
    .tooltip { max-width:calc(100vw - 32px); }
  }

  @media(max-width:480px) {
    .app { padding:1.25rem .65rem 4rem; }
    .legend { justify-content:flex-start; }
    .section-tabs { justify-content:flex-start; overflow-x:auto; flex-wrap:nowrap; padding-bottom:.5rem; }
    .section-tab { flex-shrink:0; }
  }
`;

/* ── Color map for node priority ── */
const PRIORITY_COLORS = {
  essential:  { fill: "#0D3043", stroke: "#00D4FF", text: "#00D4FF",   badge: "Essential"  },
  important:  { fill: "#1A1040", stroke: "#8B5CF6", text: "#8B5CF6",   badge: "Important"  },
  optional:   { fill: "#0D2318", stroke: "#10B981", text: "#10B981",   badge: "Optional"   },
  bonus:      { fill: "#2A1A0A", stroke: "#F59E0B", text: "#F59E0B",   badge: "Bonus"      },
};

const LEGEND_ITEMS = [
  { label: "Essential",  color: "#00D4FF" },
  { label: "Important",  color: "#8B5CF6" },
  { label: "Optional",   color: "#10B981" },
  { label: "Bonus",      color: "#F59E0B" },
];

/* ── SVG Roadmap Renderer ── */
function RoadmapSVG({ sections, activeSection, onNodeClick }) {
  const NODE_W = 160, NODE_H = 46, COL_GAP = 24, ROW_GAP = 18;
  const SECTION_PAD = 24, SECTION_HEADER = 44, SECTION_GAP = 36;
  const COLS = 4;
  const CANVAS_W = COLS * NODE_W + (COLS - 1) * COL_GAP + SECTION_PAD * 2;

  const filtered = activeSection === "all"
    ? sections
    : sections.filter(s => s.title.toLowerCase().includes(activeSection.toLowerCase()));

  // Layout sections top-to-bottom
  let totalH = SECTION_PAD;
  const layout = filtered.map(section => {
    const rows = Math.ceil(section.nodes.length / COLS);
    const h = SECTION_HEADER + rows * (NODE_H + ROW_GAP) - ROW_GAP + SECTION_PAD * 2;
    const y = totalH;
    totalH += h + SECTION_GAP;
    return { ...section, y, h };
  });
  totalH += SECTION_PAD;

  const allNodes = [];
  layout.forEach(section => {
    section.nodes.forEach((node, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = SECTION_PAD + col * (NODE_W + COL_GAP);
      const y = section.y + SECTION_HEADER + row * (NODE_H + ROW_GAP);
      allNodes.push({ ...node, x, y, sectionY: section.y, sectionH: section.h });
    });
  });

  // Build connector lines: connect nodes within same section sequentially
  const lines = [];
  layout.forEach(section => {
    for (let i = 0; i < section.nodes.length - 1; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const nCol = (i + 1) % COLS;
      const nRow = Math.floor((i + 1) / COLS);
      const x1 = SECTION_PAD + col  * (NODE_W + COL_GAP) + NODE_W / 2;
      const y1 = section.y + SECTION_HEADER + row  * (NODE_H + ROW_GAP) + NODE_H / 2;
      const x2 = SECTION_PAD + nCol * (NODE_W + COL_GAP) + NODE_W / 2;
      const y2 = section.y + SECTION_HEADER + nRow * (NODE_H + ROW_GAP) + NODE_H / 2;
      lines.push({ x1, y1, x2, y2, priority: section.nodes[i].priority });
    }
  });

  return (
    <svg
      className="roadmap-svg"
      viewBox={`0 0 ${CANVAS_W} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* Section containers */}
      {layout.map((section, si) => (
        <g key={si}>
          <rect
            x={0} y={section.y} width={CANVAS_W} height={section.h}
            rx={14} fill="rgba(20,25,32,0.85)" stroke="rgba(255,255,255,0.07)" strokeWidth={1}
          />
          <text
            x={SECTION_PAD} y={section.y + 28}
            fontFamily="'Syne',sans-serif" fontWeight="700" fontSize="13"
            fill="var(--text2)" letterSpacing="0.04em"
          >
            {section.title}
          </text>
          <text
            x={CANVAS_W - SECTION_PAD} y={section.y + 28}
            textAnchor="end"
            fontFamily="'Fira Code',monospace" fontSize="10"
            fill="var(--muted)"
          >
            {section.nodes.length} topics
          </text>
        </g>
      ))}

      {/* Connector lines */}
      {lines.map((l, i) => {
        const color = PRIORITY_COLORS[l.priority]?.stroke ?? "#475569";
        const same_row = Math.floor(i / 1) % COLS !== COLS - 1;
        return (
          <line
            key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={color} strokeWidth={same_row ? "1.5" : "1"}
            strokeOpacity="0.35" strokeDasharray={same_row ? "none" : "4 3"}
            markerEnd={`url(#arr)`}
          />
        );
      })}

      {/* Nodes */}
      {allNodes.map((node, i) => {
        const c = PRIORITY_COLORS[node.priority] ?? PRIORITY_COLORS.optional;
        return (
          <g
            key={i} className="rm-node"
            onClick={e => onNodeClick(node, e)}
            style={{ animation: `nodeAppear .4s ${i * 0.025}s cubic-bezier(.16,1,.3,1) both` }}
          >
            <rect
              x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx={8}
              fill={c.fill} stroke={c.stroke} strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 6px ${c.stroke}33)` }}
            />
            {/* Priority dot */}
            <circle cx={node.x + 12} cy={node.y + NODE_H / 2} r={3} fill={c.stroke} />
            <text
              x={node.x + 22} y={node.y + NODE_H / 2 + 1}
              dominantBaseline="middle"
              fontFamily="'Outfit',sans-serif" fontWeight="500" fontSize="11.5"
              fill={c.text}
            >
              {node.label.length > 17 ? node.label.slice(0, 16) + "…" : node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Tooltip ── */
function Tooltip({ node, pos, visible }) {
  if (!node) return null;
  const c = PRIORITY_COLORS[node.priority] ?? PRIORITY_COLORS.optional;
  return (
    <div
      className={`tooltip ${visible ? "visible" : ""}`}
      style={{ top: pos.y, left: Math.min(pos.x, window.innerWidth - 340) }}
    >
      <div className="tooltip-title" style={{ color: c.text }}>{node.label}</div>
      <div className="tooltip-desc">{node.description}</div>
      <span className="tooltip-tag" style={{ background: `${c.stroke}22`, color: c.text, border: `1px solid ${c.stroke}55` }}>
        {c.badge}
      </span>
    </div>
  );
}

/* ── API Call ── */
async function fetchRoadmap({ role, level, techStack }) {
  const stack = Array.isArray(techStack) ? techStack.join(", ") : techStack;
  const prompt = `You are a senior engineering curriculum designer.
Generate a detailed learning roadmap for a ${role} at ${level} level. Tech stack: ${stack}.

Return ONLY valid JSON — no markdown fences, no commentary:
{
  "title": "<roadmap title>",
  "description": "<1-2 sentence overview>",
  "sections": [
    {
      "title": "<phase/category name>",
      "nodes": [
        {
          "label": "<short topic name, max 20 chars>",
          "description": "<2-3 sentence explanation of why this matters and what to learn>",
          "priority": "essential" | "important" | "optional" | "bonus"
        }
      ]
    }
  ]
}

Rules:
- 5-8 sections covering: Fundamentals, Core Tech Stack, Architecture, Testing, DevOps/Deployment, Performance, Security, Advanced Topics
- 4-8 nodes per section
- priority: "essential" = must-know, "important" = should-know, "optional" = nice-to-have, "bonus" = expert-level
- Keep labels concise (≤ 20 chars). Descriptions should be practical and specific to the tech stack.
- Tailor all content to the role, level, and tech stack provided.`;

  const res = await fetch(getApiUrl("/api/roadmap"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, level, techstack: techStack }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data;
}

/* ── Main Page ── */
export default function RoadMap() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, level, techStack } = location.state || {};

  const [roadmap,       setRoadmap]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [tooltip,       setTooltip]       = useState({ node: null, pos: { x: 0, y: 0 }, visible: false });
  const tooltipTimer = useRef(null);

  useEffect(() => {
    if (!role || !techStack) {
      setError("⚠ No session data. Go back and complete the interview first.");
      setLoading(false);
      return;
    }
    fetchRoadmap({ role, level, techStack })
      .then(data => { setRoadmap(data); setLoading(false); })
      .catch(err  => { setError(`⚠ ${err.message}`); setLoading(false); });
  }, []);

  const handleNodeClick = (node, e) => {
    clearTimeout(tooltipTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    const x = isMobile
      ? Math.max(16, (window.innerWidth - 300) / 2)
      : Math.min(Math.max(16, rect.left), window.innerWidth - 330);
    const y = isMobile
      ? Math.min(rect.bottom + 8, window.innerHeight - 200)
      : Math.min(rect.bottom + 8, window.innerHeight - 180);

    setTooltip({ node, pos: { x, y }, visible: true });
    tooltipTimer.current = setTimeout(() => setTooltip(t => ({ ...t, visible: false })), 4500);
  };

  // Stats
  const allNodes = roadmap?.sections?.flatMap(s => s.nodes) ?? [];
  const essentialCount = allNodes.filter(n => n.priority === "essential").length;
  const totalCount = allNodes.length;
  const progress = totalCount > 0 ? Math.round((essentialCount / totalCount) * 100) : 0;

  const sectionTabs = ["all", ...(roadmap?.sections?.map(s => s.title) ?? [])];

  return (
    <>
      <style>{styles}</style>
      <div className="app" onClick={() => setTooltip(t => ({ ...t, visible: false }))}>

        <div className="header">
          <div className="status-badge"><span className="status-dot" /> Learning Roadmap</div>
          <h1 className="main-title">
            Your <span className="title-accent">Roadmap</span>
          </h1>
          {roadmap && (
            <p style={{ color: "var(--muted)", fontFamily: "'Fira Code',monospace", fontSize: ".65rem", letterSpacing: ".1em", marginTop: ".8rem" }}>
              {roadmap.description}
            </p>
          )}
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <button className="back-btn" onClick={() => navigate(-1)}>← Back to Results</button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-screen">
            <div className="loading-orb">
              <div className="loading-ring" />
              <div className="loading-ring2" />
              <div className="loading-orb-inner">🗺️</div>
            </div>
            <div className="loading-title">Building your roadmap…</div>
            <div className="loading-sub">AI is crafting a personalised learning path</div>
          </div>
        )}

        {!loading && error && <div className="error-box">{error}</div>}

        {!loading && !error && roadmap && (
          <>
            {/* Legend */}
            <div className="legend">
              {LEGEND_ITEMS.map(item => (
                <div key={item.label} className="legend-item">
                  <span className="legend-dot" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}66` }} />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="progress-bar-wrap">
              <div className="progress-meta">
                <span>{essentialCount} essential topics</span>
                <span>{totalCount} total topics · {roadmap.sections.length} sections</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Section tabs */}
            <div className="section-tabs">
              {sectionTabs.map(tab => (
                <button
                  key={tab}
                  className={`section-tab ${activeSection === tab ? "active" : ""}`}
                  onClick={() => setActiveSection(tab)}
                >
                  {tab === "all" ? "All Sections" : tab}
                </button>
              ))}
            </div>

            {/* Roadmap SVG */}
            <div className="roadmap-wrap">
              <RoadmapSVG
                sections={roadmap.sections}
                activeSection={activeSection}
                onNodeClick={(node, e) => { e.stopPropagation(); handleNodeClick(node, e); }}
              />
            </div>
          </>
        )}

        {/* Tooltip */}
        <Tooltip node={tooltip.node} pos={tooltip.pos} visible={tooltip.visible} />
      </div>
    </>
  );
}