import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #080B12;
    --bg2:         #0D1117;
    --bg3:         #111620;
    --surface:     #141920;
    --surface2:    #1A2030;
    --surface3:    #1F2738;
    --border:      rgba(255,255,255,.07);
    --border2:     rgba(255,255,255,.13);
    --border3:     rgba(255,255,255,.22);
    --cyan:        #00D4FF;
    --cyan-dim:    rgba(0,212,255,.12);
    --cyan-glow:   rgba(0,212,255,.25);
    --blue:        #3B82F6;
    --blue-dim:    rgba(59,130,246,.12);
    --violet:      #8B5CF6;
    --violet-dim:  rgba(139,92,246,.12);
    --violet-glow: rgba(139,92,246,.3);
    --emerald:     #10B981;
    --emerald-dim: rgba(16,185,129,.12);
    --rose:        #F43F5E;
    --rose-dim:    rgba(244,63,94,.12);
    --amber:       #F59E0B;
    --amber-dim:   rgba(245,158,11,.12);
    --text:        #F1F5F9;
    --text2:       #CBD5E1;
    --muted:       #64748B;
    --hint:        #475569;
    --r-sm:   8px;
    --r-md:   14px;
    --r-lg:   20px;
    --r-xl:   28px;
    --r-2xl:  36px;
    --glow-cyan:   0 0 30px rgba(0,212,255,.18), 0 0 60px rgba(0,212,255,.08);
    --glow-violet: 0 0 30px rgba(139,92,246,.2),  0 0 60px rgba(139,92,246,.09);
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; }

  body::before {
    content: ''; position: fixed; inset: 0; z-index: 0;
    background-image: linear-gradient(rgba(0,212,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,.03) 1px, transparent 1px);
    background-size: 48px 48px; pointer-events: none;
  }
  body::after {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 60% 50% at 15% 25%, rgba(139,92,246,.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 85% 70%, rgba(0,212,255,.07) 0%, transparent 60%),
      radial-gradient(ellipse 45% 35% at 50% 5%, rgba(59,130,246,.05) 0%, transparent 60%);
    animation: orbDrift 18s ease-in-out infinite alternate;
  }
  @keyframes orbDrift { from{transform:scale(1) rotate(0deg)} to{transform:scale(1.06) rotate(2deg)} }

  @keyframes slideDown  { from{opacity:0;transform:translateY(-36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(44px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes slideInL   { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes glowLine   { from{background-position:0% 50%} to{background-position:100% 50%} }
  @keyframes pulse2     { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes spin       { to{transform:rotate(360deg)} }
  @keyframes shimmerDk  { from{background-position:200% 0} to{background-position:-200% 0} }
  @keyframes bounceIn   { 0%{opacity:0;transform:scale(.3)} 65%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }
  @keyframes borderGlow { 0%,100%{box-shadow:0 0 0 1px rgba(0,212,255,.25),var(--glow-cyan)} 50%{box-shadow:0 0 0 1px rgba(139,92,246,.35),var(--glow-violet)} }
  @keyframes countUp    { from{opacity:0;transform:scale(.5) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes scoreReveal { 0%{opacity:0;transform:scale(0) rotate(-180deg)} 60%{transform:scale(1.15) rotate(5deg)} 100%{opacity:1;transform:scale(1) rotate(0)} }
  @keyframes ringGrow   { from{stroke-dashoffset:283} to{stroke-dashoffset:var(--dash-offset)} }
  @keyframes floatUp    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes typeIn     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .app { position:relative; z-index:1; min-height:100vh; padding:3rem 1.5rem 7rem; }

  .header { text-align:center; margin-bottom:3rem; animation:slideDown 1s cubic-bezier(.16,1,.3,1); }

  .status-badge {
    display:inline-flex; align-items:center; gap:.55rem;
    background:rgba(0,212,255,.06); border:1px solid rgba(0,212,255,.22); color:var(--cyan);
    font-family:'Fira Code',monospace; font-size:.6rem; letter-spacing:.2em; text-transform:uppercase;
    padding:.45rem 1.3rem; border-radius:100px; margin-bottom:1.4rem;
    box-shadow:0 0 20px rgba(0,212,255,.12); animation:borderGlow 4s ease-in-out infinite;
  }
  .status-dot { width:7px; height:7px; border-radius:50%; background:var(--cyan); animation:pulse2 1.6s infinite; box-shadow:0 0 8px var(--cyan); }

  .main-title { font-family:'Syne',sans-serif; font-size:clamp(2.2rem,6vw,4rem); font-weight:800; letter-spacing:-.03em; line-height:1.04; color:var(--text); }
  .title-accent {
    background:linear-gradient(135deg, var(--cyan) 0%, var(--violet) 60%, var(--blue) 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-size:200% 200%; animation:glowLine 4s linear infinite;
  }

  .loading-screen { max-width:600px; margin:0 auto; text-align:center; animation:fadeUp .6s cubic-bezier(.16,1,.3,1); }
  .loading-orb { width:120px; height:120px; margin:0 auto 2rem; position:relative; animation:floatUp 2.5s ease-in-out infinite; }
  .loading-orb-inner {
    width:100%; height:100%; border-radius:50%;
    background:radial-gradient(circle at 35% 35%, rgba(0,212,255,.3), rgba(139,92,246,.2), transparent);
    border:1px solid rgba(0,212,255,.3); display:flex; align-items:center; justify-content:center; font-size:3rem;
    box-shadow:0 0 40px rgba(0,212,255,.15), 0 0 80px rgba(139,92,246,.08);
  }
  .loading-ring { position:absolute; inset:-8px; border:2px solid transparent; border-top-color:var(--cyan); border-right-color:rgba(0,212,255,.3); border-radius:50%; animation:spin 1.4s linear infinite; }
  .loading-ring2 { position:absolute; inset:-16px; border:1px solid transparent; border-bottom-color:var(--violet); border-left-color:rgba(139,92,246,.2); border-radius:50%; animation:spin 2.2s linear infinite reverse; }
  .loading-title { font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:700; color:var(--text); margin-bottom:.6rem; }
  .loading-sub { font-family:'Fira Code',monospace; font-size:.65rem; color:var(--muted); letter-spacing:.1em; }
  .loading-steps { margin-top:2rem; display:flex; flex-direction:column; gap:.6rem; }
  .loading-step {
    display:flex; align-items:center; gap:.8rem; padding:.7rem 1.2rem;
    background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md);
    font-family:'Fira Code',monospace; font-size:.68rem; color:var(--muted); transition:all .4s;
  }
  .loading-step.active { border-color:rgba(0,212,255,.3); color:var(--cyan); background:rgba(0,212,255,.05); box-shadow:0 0 16px rgba(0,212,255,.08); }
  .loading-step.done { border-color:rgba(16,185,129,.3); color:var(--emerald); background:rgba(16,185,129,.05); }
  .step-dot { width:8px; height:8px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .step-dot.pulsing { animation:pulse2 1s infinite; }

  .score-hero { max-width:860px; margin:0 auto 2.5rem; animation:fadeUp .8s cubic-bezier(.16,1,.3,1); }
  .score-card {
    background:var(--surface); border:1px solid var(--border2); border-radius:var(--r-2xl); padding:2.5rem;
    position:relative; overflow:hidden; box-shadow:0 24px 64px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.03);
  }
  .score-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent, var(--cyan), var(--violet), var(--blue), transparent);
    background-size:200% 100%; animation:glowLine 3s linear infinite;
  }

  .score-layout { display:grid; grid-template-columns:200px 1fr; gap:2.5rem; align-items:center; }
  @media(max-width:600px) { .score-layout{grid-template-columns:1fr; text-align:center} }

  .score-ring-wrap { display:flex; flex-direction:column; align-items:center; gap:1rem; }
  .score-ring { position:relative; width:160px; height:160px; animation:scoreReveal .8s .2s cubic-bezier(.34,1.56,.64,1) both; }
  .score-ring svg { transform:rotate(-90deg); }
  .score-ring-bg { fill:none; stroke:var(--surface3); stroke-width:10; }
  .score-ring-fill { fill:none; stroke-width:10; stroke-linecap:round; stroke-dasharray:283; animation:ringGrow 1.4s .6s cubic-bezier(.16,1,.3,1) both; }
  .score-ring-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .score-number { font-family:'Syne',sans-serif; font-size:2.6rem; font-weight:800; line-height:1; animation:countUp .6s .9s cubic-bezier(.34,1.56,.64,1) both; }
  .score-label-sm { font-family:'Fira Code',monospace; font-size:.55rem; color:var(--muted); letter-spacing:.15em; text-transform:uppercase; margin-top:.15rem; }
  .score-grade { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:700; letter-spacing:.05em; padding:.4rem 1.2rem; border-radius:100px; animation:bounceIn .5s 1s cubic-bezier(.34,1.56,.64,1) both; }

  .score-details { display:flex; flex-direction:column; gap:1.2rem; }
  .score-detail-title { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:700; color:var(--text); line-height:1.2; margin-bottom:.4rem; }
  .score-detail-sub { font-family:'Fira Code',monospace; font-size:.62rem; color:var(--muted); letter-spacing:.1em; }

  .stat-row { display:grid; grid-template-columns:repeat(3,1fr); gap:.8rem; margin-top:.6rem; }
  @media(max-width:480px) { .stat-row{grid-template-columns:1fr 1fr} }

  .stat-chip { background:var(--surface2); border:1px solid var(--border); border-radius:var(--r-md); padding:.8rem 1rem; display:flex; flex-direction:column; gap:.3rem; transition:transform .2s, border-color .2s; }
  .stat-chip:hover { transform:translateY(-3px); border-color:var(--border2); }
  .stat-chip-val { font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:700; }
  .stat-chip-lbl { font-family:'Fira Code',monospace; font-size:.55rem; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; }

  .overall-feedback {
    margin-top:1.4rem; padding:1.2rem 1.4rem; background:var(--surface2); border:1px solid var(--border);
    border-radius:var(--r-md); font-family:'Outfit',sans-serif; font-size:.88rem; color:var(--text2);
    line-height:1.75; border-left:3px solid var(--cyan); animation:typeIn .5s 1.2s both;
  }
  .overall-feedback-label { font-family:'Fira Code',monospace; font-size:.58rem; color:var(--cyan); letter-spacing:.15em; text-transform:uppercase; margin-bottom:.6rem; display:flex; align-items:center; gap:.4rem; }

  /* ── Roadmap CTA Button ── */
  .roadmap-cta {
    display:flex; align-items:center; justify-content:center; gap:1rem;
    max-width:860px; margin:0 auto 2.5rem; animation:fadeUp .6s .3s cubic-bezier(.16,1,.3,1) both;
  }
  .roadmap-btn {
    display:inline-flex; align-items:center; gap:.7rem;
    background:linear-gradient(135deg, rgba(139,92,246,.15) 0%, rgba(0,212,255,.12) 100%);
    border:1px solid rgba(139,92,246,.45); color:var(--violet);
    font-family:'Fira Code',monospace; font-size:.72rem; letter-spacing:.12em; text-transform:uppercase;
    padding:.9rem 2rem; border-radius:100px; cursor:pointer; font-weight:500;
    transition:all .25s; position:relative; overflow:hidden;
    box-shadow:0 0 24px rgba(139,92,246,.2);
  }
  .roadmap-btn::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg, rgba(139,92,246,.25), rgba(0,212,255,.2));
    opacity:0; transition:opacity .25s;
  }
  .roadmap-btn:hover { transform:translateY(-2px); box-shadow:0 0 40px rgba(139,92,246,.35); border-color:rgba(139,92,246,.7); color:var(--cyan); }
  .roadmap-btn:hover::before { opacity:1; }
  .roadmap-btn-icon { font-size:1.1rem; position:relative; }
  .roadmap-btn-text { position:relative; }

  .results-grid { max-width:860px; margin:0 auto; }

  .section-header {
    display:flex; align-items:center; gap:.75rem; margin-bottom:1.6rem;
    font-size:.58rem; font-weight:500; text-transform:uppercase; letter-spacing:.22em;
    color:var(--muted); font-family:'Fira Code',monospace; animation:slideDown .6s cubic-bezier(.16,1,.3,1);
  }
  .section-header::before,.section-header::after { content:''; flex:1; height:1px; background:var(--border); }

  .result-item {
    background:var(--surface); border:1px solid var(--border2); border-radius:var(--r-lg); margin-bottom:1rem; overflow:hidden;
    animation:slideInL .5s cubic-bezier(.16,1,.3,1) both; transition:box-shadow .25s, border-color .25s;
  }
  .result-item:hover { box-shadow:0 8px 32px rgba(0,0,0,.3); border-color:var(--border3); }

  .result-header { display:flex; align-items:center; gap:1rem; padding:1.2rem 1.4rem; cursor:pointer; user-select:none; }
  .result-num { min-width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:'Fira Code',monospace; font-size:.62rem; color:#fff; flex-shrink:0; position:relative; }
  .result-num::after { content:''; position:absolute; inset:0; border-radius:10px; background:linear-gradient(135deg, rgba(255,255,255,.2), transparent 60%); }

  .result-q-text { flex:1; font-size:.88rem; color:var(--text2); font-family:'Outfit',sans-serif; line-height:1.5; }

  .result-score-badge { display:flex; align-items:center; gap:.5rem; flex-shrink:0; }
  .score-pill { font-family:'Syne',sans-serif; font-size:.9rem; font-weight:700; padding:.3rem .9rem; border-radius:100px; border:1px solid currentColor; }
  .chevron { font-size:.75rem; color:var(--muted); transition:transform .3s; flex-shrink:0; }
  .chevron.open { transform:rotate(180deg); }

  .stars { display:flex; gap:.15rem; }
  .star { font-size:.9rem; }

  .result-body { overflow:hidden; max-height:0; transition:max-height .45s cubic-bezier(.16,1,.3,1); }
  .result-body.expanded { max-height:800px; }
  .result-body-inner { padding:0 1.4rem 1.4rem; display:flex; flex-direction:column; gap:1rem; }

  .answer-block, .feedback-block, .ideal-block { border-radius:var(--r-md); padding:1rem 1.2rem; }
  .answer-block { background:var(--surface2); border:1px solid var(--border); }
  .feedback-block { background:rgba(0,212,255,.04); border:1px solid rgba(0,212,255,.15); }
  .ideal-block { background:rgba(16,185,129,.04); border:1px solid rgba(16,185,129,.2); }

  .block-label { font-family:'Fira Code',monospace; font-size:.56rem; text-transform:uppercase; letter-spacing:.18em; margin-bottom:.6rem; display:flex; align-items:center; gap:.45rem; }
  .block-text { font-family:'Outfit',sans-serif; font-size:.84rem; color:var(--text2); line-height:1.75; }
  .block-empty { font-family:'Fira Code',monospace; font-size:.7rem; color:var(--hint); font-style:italic; }

  .score-bar-wrap { background:var(--surface3); border-radius:100px; height:4px; overflow:hidden; margin-top:.6rem; }
  .score-bar-fill { height:100%; border-radius:100px; transition:width 1s cubic-bezier(.16,1,.3,1); }

  .back-btn {
    display:inline-flex; align-items:center; gap:.6rem;
    background:var(--surface); border:1px solid var(--border2); color:var(--text2);
    font-family:'Fira Code',monospace; font-size:.65rem; letter-spacing:.1em;
    padding:.6rem 1.2rem; border-radius:100px; cursor:pointer; transition:all .2s; margin-bottom:2rem;
    animation:fadeUp .5s cubic-bezier(.16,1,.3,1);
  }
  .back-btn:hover { border-color:var(--cyan); color:var(--cyan); box-shadow:0 0 16px rgba(0,212,255,.12); transform:translateX(-4px); }

  .error-box {
    text-align:center; color:var(--rose); font-family:'Fira Code',monospace; font-size:.75rem;
    padding:1.5rem; border:1px solid rgba(244,63,94,.25); border-radius:var(--r-md); margin:2rem auto; max-width:600px;
    background:var(--rose-dim); animation:bounceIn .3s cubic-bezier(.34,1.56,.64,1);
  }

  .shimmer-line {
    background:linear-gradient(90deg, var(--surface2) 25%, rgba(0,212,255,.05) 50%, var(--surface2) 75%);
    background-size:200% 100%; animation:shimmerDk 1.5s infinite; border-radius:8px; margin:10px 0;
  }

  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:var(--bg); }
  ::-webkit-scrollbar-thumb { background:var(--surface3); border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:var(--border2); }

  /* ── Mobile Responsive Overrides ── */
  @media(max-width:768px) {
    .app { padding:2rem 1rem 5rem; }
    .header { margin-bottom:2rem; }
    .status-badge { font-size:.52rem; padding:.35rem 1.1rem; }
    .main-title { font-size:clamp(1.8rem,6vw,3rem); }
    .score-hero { margin-bottom:1.8rem; }
    .score-card { padding:1.6rem 1.1rem; border-radius:var(--r-xl); }
    .score-layout { grid-template-columns:1fr; gap:1.5rem; text-align:center; }
    .score-ring-wrap { margin:0 auto; }
    .score-ring { width:130px; height:130px; }
    .score-number { font-size:2.2rem; }
    .score-details { text-align:center; }
    .stat-row { grid-template-columns:repeat(3, 1fr); gap:.5rem; }
    .stat-chip { padding:.6rem .75rem; }
    .stat-chip-val { font-size:1.1rem; }
    .overall-feedback { text-align:left; font-size:.82rem; padding:1rem; }
    .roadmap-cta { margin-bottom:2rem; }
    .roadmap-btn { width:100%; justify-content:center; font-size:.68rem; padding:.85rem 1.2rem; }
    .result-header { padding:1rem; gap:.75rem; }
    .result-num { min-width:30px; height:30px; border-radius:8px; font-size:.56rem; }
    .result-q-text { font-size:.84rem; line-height:1.45; }
    .result-body-inner { padding:0 1rem 1rem; gap:.75rem; }
    .answer-block, .feedback-block, .ideal-block { padding:.8rem .95rem; }
    .block-text { font-size:.8rem; }
  }

  @media(max-width:480px) {
    .app { padding:1.25rem .65rem 4rem; }
    .score-card { padding:1.25rem .85rem; border-radius:16px; }
    .stat-row { grid-template-columns:1fr; gap:.45rem; }
    .score-pill { font-size:.75rem; padding:.2rem .6rem; }
    .stars { display:none; }
    .result-header { flex-wrap:wrap; }
    .result-q-text { min-width:100%; order:2; margin-top:.3rem; }
    .result-num { order:1; }
    .result-score-badge { order:1; margin-left:auto; }
  }
`;

/* ─── Helpers ─── */
const getScoreColor = (score) => {
  if (score >= 8) return "#10B981";
  if (score >= 5) return "#F59E0B";
  return "#F43F5E";
};

const getStars = (score) => {
  const filled = Math.round((score / 10) * 5);
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className="star" style={{ opacity: i < filled ? 1 : 0.2 }}>★</span>
  ));
};

const getRingColor = (avg) => {
  if (avg >= 7) return "#10B981";
  if (avg >= 4) return "#F59E0B";
  return "#F43F5E";
};

function getGrade(avg) {
  if (avg >= 9) return { label: "Outstanding", emoji: "🏆" };
  if (avg >= 7) return { label: "Excellent",   emoji: "⭐" };
  if (avg >= 5) return { label: "Good",         emoji: "👍" };
  if (avg >= 3) return { label: "Needs Work",   emoji: "📈" };
  return           { label: "Keep Practicing", emoji: "💪" };
}

/* ─── Result Item ─── */
function ResultItem({ question, answer, result, index, delay }) {
  const [open, setOpen] = useState(false);
  const color = getScoreColor(result.score);

  return (
    <div
      className="result-item"
      style={{ animationDelay: `${delay}s`, borderColor: open ? `${color}33` : undefined }}
    >
      <div className="result-header" onClick={() => setOpen(o => !o)}>
        <div className="result-num" style={{ background: `linear-gradient(135deg, ${color}44, ${color}22)`, border: `1px solid ${color}44` }}>
          <span style={{ color, fontFamily: "'Fira Code',monospace", fontSize: ".62rem" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="result-q-text">{question}</div>
        <div className="result-score-badge">
          <div className="stars">{getStars(result.score)}</div>
          <div className="score-pill" style={{ color, borderColor: `${color}44`, background: `${color}11` }}>
            {result.score}/10
          </div>
        </div>
        <div className={`chevron ${open ? "open" : ""}`}>▼</div>
      </div>

      <div className={`result-body ${open ? "expanded" : ""}`}>
        <div className="result-body-inner">
          <div className="score-bar-wrap">
            <div className="score-bar-fill" style={{ width: open ? `${result.score * 10}%` : "0%", background: `linear-gradient(90deg, ${color}88, ${color})` }} />
          </div>
          <div className="answer-block">
            <div className="block-label" style={{ color: "var(--muted)" }}><span>📝</span> Your Answer</div>
            {answer?.trim() ? <div className="block-text">{answer}</div> : <div className="block-empty">— No answer provided —</div>}
          </div>
          <div className="feedback-block">
            <div className="block-label" style={{ color: "var(--cyan)" }}><span>🤖</span> AI Feedback</div>
            <div className="block-text">{result.feedback}</div>
          </div>
          <div className="ideal-block">
            <div className="block-label" style={{ color: "var(--emerald)" }}><span>✅</span> Ideal Answer / Key Points</div>
            <div className="block-text">{result.idealAnswer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  "Parsing your answers…",
  "Analyzing technical depth…",
  "Scoring each response…",
  "Generating personalized feedback…",
  "Compiling your report…",
];

/* ─── Main Result Page ─── */
export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [stepIdx,    setStepIdx]    = useState(0);

  const { role, level, techStack, questions, answers, evaluation: preEval } = location.state || {};

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setStepIdx(i => Math.min(i + 1, STEPS.length - 1)), 900);
    return () => clearInterval(iv);
  }, [loading]);

  useEffect(() => {
    if (!questions || !answers) {
      setError("⚠ No session data found. Please go back and complete the interview.");
      setLoading(false);
      return;
    }

    if (preEval) {
      try {
        if (preEval.questionResults) {
          setEvaluation(preEval);
        } else {
          setEvaluation({
            overallScore: preEval.overall_score ?? 0,
            overallFeedback: preEval.overall_feedback ?? "",
            questionResults: (preEval.results ?? []).map(r => ({
              score: r.score ?? 0,
              feedback: r.feedback ?? "",
              idealAnswer: r.improvements ?? r.strengths ?? "",
            }))
          });
        }
      } catch (e) {
        setError("⚠ Failed to parse evaluation data.");
      }
      setLoading(false);
    } else {
      callAnthropicEval({ role, level, techStack, questions, answers })
        .then(data => { setEvaluation(data); setLoading(false); })
        .catch(err  => { setError(`⚠ Evaluation failed: ${err.message}`); setLoading(false); });
    }
  }, []); // eslint-disable-line

  const avg       = evaluation?.overallScore ?? 0;
  const grade     = getGrade(avg);
  const ringColor = getRingColor(avg);
  const dashOff   = 283 - (avg / 10) * 283;
  const answered  = answers?.filter(a => a?.trim()).length ?? 0;

  /* ── Navigate to roadmap page ── */
  const handleViewRoadmap = () => {
    navigate("/roadmap", {
      state: { role, level, techStack },
    });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        <div className="header">
          <div className="status-badge"><span className="status-dot" /> AI Evaluation Report</div>
          <h1 className="main-title">Your <span className="title-accent">Results</span></h1>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <button className="back-btn" onClick={() => navigate("/")}>← Back to Interview Prep</button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-screen">
            <div className="loading-orb">
              <div className="loading-ring" />
              <div className="loading-ring2" />
              <div className="loading-orb-inner">🧠</div>
            </div>
            <div className="loading-title">Evaluating your answers…</div>
            <div className="loading-sub">AI is reviewing your responses</div>
            <div className="loading-steps">
              {STEPS.map((step, i) => (
                <div key={i} className={`loading-step ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}`}>
                  <div className={`step-dot ${i === stepIdx ? "pulsing" : ""}`} />
                  {i < stepIdx ? "✓ " : ""}{step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && <div className="error-box">{error}</div>}

        {/* Results */}
        {!loading && !error && evaluation && (
          <>
            <div className="score-hero">
              <div className="score-card">
                <div className="score-layout">

                  <div className="score-ring-wrap">
                    <div className="score-ring">
                      <svg width="160" height="160" viewBox="0 0 100 100">
                        <circle className="score-ring-bg" cx="50" cy="50" r="45" />
                        <circle
                          className="score-ring-fill"
                          cx="50" cy="50" r="45"
                          style={{ stroke: ringColor, "--dash-offset": dashOff }}
                        />
                      </svg>
                      <div className="score-ring-center">
                        <div className="score-number" style={{ color: ringColor }}>{avg.toFixed(1)}</div>
                        <div className="score-label-sm">out of 10</div>
                      </div>
                    </div>
                    <div className="score-grade" style={{ color: ringColor, borderColor: `${ringColor}44`, background: `${ringColor}11` }}>
                      {grade.emoji} {grade.label}
                    </div>
                  </div>

                  <div className="score-details">
                    <div>
                      <div className="score-detail-title">Interview Complete</div>
                      <div className="score-detail-sub">
                        {role} · {level} · {Array.isArray(techStack) ? techStack.join(", ") : techStack}
                      </div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-chip">
                        <div className="stat-chip-val" style={{ color: "var(--cyan)" }}>{questions?.length ?? 0}</div>
                        <div className="stat-chip-lbl">Questions</div>
                      </div>
                      <div className="stat-chip">
                        <div className="stat-chip-val" style={{ color: "var(--emerald)" }}>{answered}</div>
                        <div className="stat-chip-lbl">Answered</div>
                      </div>
                      <div className="stat-chip">
                        <div className="stat-chip-val" style={{ color: ringColor }}>{Math.round(avg * 10)}%</div>
                        <div className="stat-chip-lbl">Score</div>
                      </div>
                    </div>
                    {evaluation.overallFeedback && (
                      <div className="overall-feedback">
                        <div className="overall-feedback-label"><span>💬</span> Overall Feedback</div>
                        {evaluation.overallFeedback}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* ── Roadmap CTA ── */}
            <div className="roadmap-cta">
              <button className="roadmap-btn" onClick={handleViewRoadmap}>
                <span className="roadmap-btn-icon">🗺️</span>
                <span className="roadmap-btn-text">View Learning Roadmap</span>
                <span style={{ opacity: 0.6, fontSize: ".65rem" }}>→</span>
              </button>
            </div>

            <div className="results-grid">
              <div className="section-header">⬡ Detailed Question Breakdown</div>
              {questions.map((q, i) => (
                <ResultItem
                  key={i}
                  question={q}
                  answer={answers[i]}
                  result={evaluation.questionResults?.[i] ?? { score: 0, feedback: "N/A", idealAnswer: "N/A" }}
                  index={i}
                  delay={i * 0.07}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </>
  );
}

/* ─── Anthropic fallback (if no preEval passed) ─── */
async function callAnthropicEval({ role, level, techStack, questions, answers }) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are an expert technical interviewer evaluating a ${role} (${level}) candidate.
Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack}

${questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "(No answer provided)"}`).join("\n\n")}

Return ONLY valid JSON — no markdown, no explanation:
{
  "overallScore": <number 0-10>,
  "overallFeedback": "<2-3 sentence summary>",
  "questionResults": [
    { "score": <number 0-10>, "feedback": "<specific feedback>", "idealAnswer": "<key points>" }
  ]
}`
      }]
    })
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content.map(b => b.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}