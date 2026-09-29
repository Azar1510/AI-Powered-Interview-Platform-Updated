import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "./api";

/* ════════════════════════════════════════════
   GLOBAL STYLES
════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Clash+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&family=Sora:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  :root {
    --bg:           #060810;
    --bg2:          #0A0D16;
    --bg3:          #0E1220;
    --surface:      #111827;
    --surface2:     #161D2E;
    --surface3:     #1C2438;
    --border:       rgba(255,255,255,.06);
    --border2:      rgba(255,255,255,.10);
    --border3:      rgba(255,255,255,.18);
    --accent:       #6EE7F7;
    --accent2:      #A78BFA;
    --accent3:      #34D399;
    --accent4:      #FB923C;
    --rose:         #FB7185;
    --blue:         #60A5FA;
    --text:         #F0F4FF;
    --text2:        #B8C4DD;
    --muted:        #4B5A72;
    --hint:         #374157;
    --font-display: 'Plus Jakarta Sans', 'Space Grotesk', sans-serif;
    --font-body:    'Sora', 'Space Grotesk', sans-serif;
    --font-mono:    'JetBrains Mono', monospace;
    --r-xs: 6px; --r-sm: 10px; --r-md: 14px; --r-lg: 20px; --r-xl: 28px; --r-2xl: 36px;
  }

  html, body { height:100%; width:100%; background:var(--bg); color:var(--text); font-family:var(--font-body); overflow-x:hidden; }

  /* Noise overlay */
  body::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.018;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px 180px;
  }

  /* Grid lines */
  body::after {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image:
      linear-gradient(rgba(110,231,247,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(110,231,247,.025) 1px, transparent 1px);
    background-size:60px 60px;
  }

  /* Ambient glows */
  #ambient {
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(ellipse 55% 45% at 10% 20%, rgba(167,139,250,.07) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 90% 75%, rgba(110,231,247,.06) 0%, transparent 60%),
      radial-gradient(ellipse 35% 30% at 55% 5%,  rgba(96,165,250,.05) 0%, transparent 60%);
    animation: ambientDrift 20s ease-in-out infinite alternate;
  }
  @keyframes ambientDrift { from{transform:scale(1)} to{transform:scale(1.08) rotate(1.5deg)} }

  /* Floating figures canvas */
  #icon-canvas { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
  .float-fig {
    position:absolute; bottom:-160px; opacity:0;
    animation: ascend linear infinite; will-change:transform,opacity;
    filter: blur(0.4px);
  }
  @keyframes ascend {
    0%   { opacity:0;    transform:translateY(0) rotate(-5deg) scale(.85); }
    6%   { opacity:.11; }
    72%  { opacity:.07; }
    100% { opacity:0;    transform:translateY(-110vh) rotate(12deg) scale(1.12); }
  }

  /* Robot animations */
  .r-float  { animation:rFloat 3.2s ease-in-out infinite; }
  .r-ant    { transform-origin:28px 5px; animation:antWiggle 2.1s ease-in-out infinite; }
  .r-eyeL   { transform-origin:19px 27px; animation:blink 4.5s ease-in-out infinite; }
  .r-eyeR   { transform-origin:37px 27px; animation:blink 4.5s .8s ease-in-out infinite; }
  .r-scan   { animation:scanPulse 2.2s ease-in-out infinite; }
  @keyframes rFloat    { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
  @keyframes antWiggle { 0%,100%{transform:rotate(-14deg)} 50%{transform:rotate(14deg)} }
  @keyframes blink     { 0%,85%,100%{transform:scaleY(1)} 92%{transform:scaleY(.06)} }
  @keyframes scanPulse { 0%,100%{opacity:.5} 50%{opacity:1} }

  /* Human walk */
  .h-legL  { transform-origin:18px 44px; animation:legL .9s ease-in-out infinite alternate; }
  .h-legR  { transform-origin:30px 44px; animation:legR .9s ease-in-out infinite alternate; }
  .h-armL  { transform-origin:14px 26px; animation:legR .9s ease-in-out infinite alternate; }
  .h-armR  { transform-origin:34px 26px; animation:legL .9s ease-in-out infinite alternate; }
  .h-body  { animation:bodyBob .9s ease-in-out infinite alternate; }
  @keyframes legL    { from{transform:rotate(-26deg)} to{transform:rotate(26deg)} }
  @keyframes legR    { from{transform:rotate(26deg)}  to{transform:rotate(-26deg)} }
  @keyframes bodyBob { from{transform:translateY(0)}  to{transform:translateY(-3px)} }

  /* ── App layout ── */
  .app { position:relative; z-index:1; min-height:100vh; padding:3.5rem 1.5rem 8rem; max-width:1100px; margin:0 auto; }

  /* ── Keyframes ── */
  @keyframes slideDown { from{opacity:0;transform:translateY(-40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(50px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popIn     { from{opacity:0;transform:scale(.3) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0)} }
  @keyframes pulse2    { 0%,100%{opacity:1} 50%{opacity:.15} }
  @keyframes spin      { to{transform:rotate(360deg)} }
  @keyframes shimmerDk { from{background-position:200% 0} to{background-position:-200% 0} }
  @keyframes slideInL  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
  @keyframes bounceIn  { 0%{opacity:0;transform:scale(.2)} 65%{transform:scale(1.12)} 100%{opacity:1;transform:scale(1)} }
  @keyframes checkPop  { 0%{opacity:0;transform:scale(0) rotate(-30deg)} 70%{transform:scale(1.3) rotate(6deg)} 100%{opacity:1;transform:scale(1)} }
  @keyframes glowLine  { from{background-position:0% 50%} to{background-position:200% 50%} }
  @keyframes successRing { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.35)} 50%{box-shadow:0 0 0 12px rgba(52,211,153,0)} }
  @keyframes borderCycle { 0%,100%{border-color:rgba(110,231,247,.22)} 50%{border-color:rgba(167,139,250,.35)} }
  @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes typeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  @keyframes evalPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes particleFly {
    0%   { opacity:0; transform:translate(0,0) scale(0); }
    15%  { opacity:1; }
    100% { opacity:0; transform:translate(var(--tx), var(--ty)) scale(.4); }
  }
  @keyframes progressGlow {
    0%,100% { box-shadow:0 0 10px rgba(110,231,247,.4); }
    50%     { box-shadow:0 0 24px rgba(167,139,250,.6); }
  }
  @keyframes badgePulse { 0%,100%{box-shadow:0 0 18px rgba(110,231,247,.12)} 50%{box-shadow:0 0 30px rgba(110,231,247,.25)} }
  @keyframes numberCount { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

  /* ── Header ── */
  .header { text-align:center; margin-bottom:4rem; animation:slideDown 1s cubic-bezier(.16,1,.3,1); }

  .status-badge {
    display:inline-flex; align-items:center; gap:.6rem;
    background:rgba(110,231,247,.05); border:1px solid rgba(110,231,247,.2);
    color:var(--accent); font-family:var(--font-mono); font-size:.58rem;
    letter-spacing:.22em; text-transform:uppercase; padding:.45rem 1.4rem;
    border-radius:100px; margin-bottom:1.5rem;
    animation:badgePulse 3s ease-in-out infinite;
  }
  .status-dot {
    width:7px; height:7px; border-radius:50%; background:var(--accent);
    animation:pulse2 1.8s infinite; box-shadow:0 0 8px var(--accent);
  }

  .main-title {
    font-family:var(--font-display); font-size:clamp(2.4rem,7vw,5.2rem);
    font-weight:800; letter-spacing:-.04em; line-height:1.05; color:var(--text);
  }
  .title-accent {
    background:linear-gradient(135deg, var(--accent) 0%, var(--accent2) 55%, var(--blue) 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-size:300% 300%; animation:glowLine 5s linear infinite;
  }
  .title-sub {
    font-family:var(--font-display); font-size:clamp(1.1rem,2.8vw,1.7rem);
    font-weight:300; color:var(--muted); letter-spacing:.02em; display:block;
    margin-top:.25rem;
  }

  .subtitle {
    color:var(--muted); font-size:.7rem; margin-top:1rem;
    font-family:var(--font-mono); letter-spacing:.1em;
    display:inline-flex; align-items:center; gap:.6rem; flex-wrap:wrap; justify-content:center;
  }
  .subtitle-bar { width:24px; height:1px; background:var(--accent); opacity:.4; }

  .hero-pills { display:flex; justify-content:center; flex-wrap:wrap; gap:.5rem; margin-top:1.8rem; }
  .hero-pill {
    display:inline-flex; align-items:center; gap:.45rem;
    background:var(--surface); border:1px solid var(--border2);
    color:var(--text2); font-size:.68rem; font-weight:500;
    padding:.38rem 1rem; border-radius:100px;
    transition:all .25s cubic-bezier(.34,1.56,.64,1); cursor:default;
  }
  .hero-pill:hover {
    transform:translateY(-3px); border-color:rgba(110,231,247,.4);
    color:var(--accent); box-shadow:0 10px 24px rgba(110,231,247,.1);
    background:rgba(110,231,247,.04);
  }
  .hero-pill-icon { font-size:.8rem; }

  /* ── Card ── */
  .card {
    max-width:800px; margin:0 auto; width:100%;
    background:var(--surface); border:1px solid var(--border2);
    border-radius:var(--r-2xl); padding:3rem 3.2rem;
    box-shadow:0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.025);
    animation:fadeUp 1s .25s cubic-bezier(.16,1,.3,1) both;
    position:relative; overflow:hidden;
  }
  .card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent, var(--accent), var(--accent2), var(--blue), transparent);
    background-size:300% 100%; animation:glowLine 4s linear infinite;
  }
  .card::after {
    content:''; position:absolute; top:-80px; right:-80px; width:280px; height:280px;
    background:radial-gradient(circle, rgba(167,139,250,.04) 0%, transparent 70%);
    border-radius:50%; pointer-events:none;
  }

  /* ── Section labels ── */
  .section-label {
    display:flex; align-items:center; gap:.65rem;
    font-family:var(--font-mono); font-size:.56rem; letter-spacing:.22em;
    text-transform:uppercase; color:var(--muted); margin-bottom:1.6rem;
  }
  .section-label::after { content:''; flex:1; height:1px; background:var(--border); }
  .sl-num {
    display:inline-flex; align-items:center; justify-content:center;
    width:20px; height:20px; border-radius:50%;
    background:rgba(110,231,247,.08); border:1px solid rgba(110,231,247,.2);
    color:var(--accent); font-size:.56rem; font-weight:600; flex-shrink:0;
  }

  /* ── Form ── */
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1.6rem; margin-bottom:1.6rem; }
  @media(max-width:560px) { .form-row{grid-template-columns:1fr} .card{padding:2rem 1.5rem} }

  .form-group { display:flex; flex-direction:column; gap:.65rem; }
  .form-label {
    font-size:.58rem; font-weight:600; text-transform:uppercase;
    letter-spacing:.2em; color:var(--muted); font-family:var(--font-mono);
    display:flex; align-items:center; gap:.6rem;
  }
  .label-icon {
    display:inline-flex; align-items:center; justify-content:center;
    width:24px; height:24px; border-radius:7px;
    background:rgba(167,139,250,.1); border:1px solid rgba(167,139,250,.2); font-size:.85rem;
  }

  .form-select {
    appearance:none; background:var(--surface2); border:1px solid var(--border2);
    color:var(--text2); font-family:var(--font-body); font-size:.88rem;
    font-weight:400; padding:.9rem 2.6rem .9rem 1.2rem; border-radius:var(--r-md);
    cursor:pointer; width:100%; outline:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234B5A72' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 1.1rem center;
    transition:all .2s; border-left:2px solid transparent;
  }
  .form-select option { background:var(--surface2); color:var(--text); }
  .form-select:hover { border-color:rgba(110,231,247,.3); background:var(--surface3); color:var(--text); }
  .form-select:focus {
    border-color:rgba(110,231,247,.5); border-left-color:var(--accent);
    box-shadow:0 0 0 3px rgba(110,231,247,.08), 0 0 20px rgba(110,231,247,.05);
    background:var(--surface3); color:var(--text);
  }

  .multi-wrapper {
    border:1px solid var(--border2); border-radius:var(--r-md);
    background:var(--surface2); overflow:hidden;
    transition:border-color .2s, box-shadow .2s;
    border-left:2px solid transparent;
  }
  .multi-wrapper:focus-within {
    border-color:rgba(110,231,247,.4); border-left-color:var(--accent);
    box-shadow:0 0 0 3px rgba(110,231,247,.08);
  }
  .form-select-multi {
    appearance:none; background:transparent; border:none; color:var(--text2);
    font-family:var(--font-body); font-size:.88rem;
    padding:.65rem; width:100%; height:168px; outline:none; cursor:pointer;
  }
  .form-select-multi option { padding:.5rem .85rem; background:var(--surface2); color:var(--text); }
  .form-select-multi option:checked { background:rgba(110,231,247,.1); color:var(--accent); }

  .tags { display:flex; flex-wrap:wrap; gap:.5rem; min-height:28px; margin-top:.6rem; }
  .tag {
    display:inline-flex; align-items:center; gap:.5rem;
    background:rgba(167,139,250,.1); border:1px solid rgba(167,139,250,.25);
    color:var(--accent2); font-family:var(--font-mono); font-size:.63rem;
    font-weight:500; padding:.3rem .9rem; border-radius:100px;
    animation:popIn .3s cubic-bezier(.34,1.56,.64,1); box-shadow:0 0 12px rgba(167,139,250,.1);
  }
  .tag-remove {
    cursor:pointer; opacity:.45; transition:all .15s;
    background:none; border:none; color:var(--accent2); font-size:.82rem;
    padding:0; line-height:1;
  }
  .tag-remove:hover { opacity:1; color:var(--rose); transform:scale(1.2); }

  /* ── Divider ── */
  .divider {
    height:1px; margin:2.4rem 0;
    background:linear-gradient(90deg, transparent, var(--border3), transparent);
    position:relative;
  }
  .divider-dot {
    position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
    width:6px; height:6px; border-radius:50%;
    background:var(--border3); border:1px solid var(--border2);
  }

  /* ── Buttons ── */
  .btn {
    width:100%; padding:1.1rem 1.5rem; border:none; border-radius:var(--r-md);
    cursor:pointer; font-family:var(--font-display); font-size:.95rem;
    font-weight:700; letter-spacing:.03em; position:relative; overflow:hidden;
    transition:transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
    display:flex; align-items:center; justify-content:center; gap:.8rem;
    background:linear-gradient(135deg, #0D6E8E 0%, #6D28D9 100%); color:#fff;
    box-shadow:0 6px 28px rgba(110,231,247,.18), 0 2px 6px rgba(0,0,0,.4);
  }
  .btn::before {
    content:''; position:absolute; top:-50%; left:-65%; width:38%; height:200%;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
    transform:skewX(-18deg); transition:left .6s cubic-bezier(.25,.46,.45,.94);
  }
  .btn:hover::before { left:140%; }
  .btn:hover:not(:disabled) { transform:translateY(-4px) scale(1.01); box-shadow:0 18px 48px rgba(110,231,247,.28), 0 6px 20px rgba(109,40,217,.2); }
  .btn:active:not(:disabled) { transform:translateY(0) scale(.98); }
  .btn:disabled { opacity:.4; cursor:not-allowed; }

  .btn-icon {
    display:inline-flex; align-items:center; justify-content:center;
    width:30px; height:30px; border-radius:9px; background:rgba(255,255,255,.15);
    transition:transform .3s, background .2s; font-size:.9rem; flex-shrink:0;
  }
  .btn:hover:not(:disabled) .btn-icon { transform:rotate(-15deg) scale(1.22); background:rgba(255,255,255,.28); }

  .btn-submit {
    margin-top:2rem;
    background:linear-gradient(135deg, #064E3B 0%, #34D399 100%);
    box-shadow:0 6px 28px rgba(52,211,153,.2);
  }
  .btn-submit:hover:not(:disabled) { box-shadow:0 18px 48px rgba(52,211,153,.3); animation:successRing 1.6s infinite; }

  .spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,.2); border-top-color:#fff; border-radius:50%; animation:spin .75s linear infinite; }

  /* ── Shimmer ── */
  .shimmer-line {
    background:linear-gradient(90deg, var(--surface2) 25%, rgba(110,231,247,.04) 50%, var(--surface2) 75%);
    background-size:200% 100%; animation:shimmerDk 1.6s infinite;
    border-radius:9px; margin:12px 0;
  }

  /* ── Results ── */
  .results { margin-top:2.5rem; animation:fadeUp .7s cubic-bezier(.16,1,.3,1); }
  .results-header {
    display:flex; align-items:center; gap:.8rem; margin-bottom:1.8rem;
    font-size:.56rem; font-weight:600; text-transform:uppercase;
    letter-spacing:.24em; color:var(--muted); font-family:var(--font-mono);
  }
  .results-header::before,.results-header::after { content:''; flex:1; height:1px; background:var(--border); }

  /* ── Question items ── */
  .question-item {
    display:flex; flex-direction:column; gap:1rem;
    padding:1.4rem 1.6rem; background:var(--surface2);
    border:1px solid var(--border); border-radius:var(--r-lg);
    margin-bottom:1rem; cursor:default; position:relative; overflow:hidden;
    transition:all .28s cubic-bezier(.16,1,.3,1);
    animation:slideInL .5s cubic-bezier(.16,1,.3,1) both;
  }
  .question-item::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:0;
    background:linear-gradient(180deg, var(--accent), var(--accent2));
    transition:width .35s cubic-bezier(.34,1.56,.64,1);
  }
  .question-item:focus-within::before { width:3px; }
  .question-item:focus-within {
    border-color:rgba(110,231,247,.28); background:var(--surface3);
    box-shadow:0 10px 36px rgba(0,0,0,.35), 0 0 0 1px rgba(110,231,247,.08);
    transform:translateX(5px);
  }

  .q-header { display:flex; align-items:flex-start; gap:1.1rem; }
  .q-num {
    min-width:36px; height:36px; border-radius:11px;
    background:linear-gradient(135deg, #0891B2, #7C3AED);
    display:flex; align-items:center; justify-content:center;
    font-family:var(--font-mono); font-size:.6rem; color:#fff; flex-shrink:0;
    box-shadow:0 4px 16px rgba(110,231,247,.2); position:relative;
    animation:numberCount .4s ease both;
  }
  .q-num::after { content:''; position:absolute; inset:0; border-radius:11px; background:linear-gradient(135deg, rgba(255,255,255,.22), transparent 65%); }
  .q-text { font-size:.88rem; font-weight:400; line-height:1.8; color:var(--text2); padding-top:7px; flex:1; font-family:var(--font-body); }

  .answer-wrap { position:relative; }
  .answer-label {
    font-family:var(--font-mono); font-size:.55rem; text-transform:uppercase;
    letter-spacing:.2em; color:var(--muted); margin-bottom:.55rem;
    display:flex; align-items:center; gap:.5rem;
  }
  .ans-dot { width:5px; height:5px; border-radius:50%; background:var(--accent); box-shadow:0 0 6px var(--accent); }

  .answer-input {
    width:100%; min-height:92px; resize:vertical;
    background:var(--bg2); border:1px solid var(--border);
    border-radius:var(--r-sm); padding:.8rem 1.1rem;
    font-family:var(--font-body); font-size:.84rem; line-height:1.75;
    color:var(--text2); outline:none;
    transition:all .22s; border-left:2px solid transparent;
  }
  .answer-input::placeholder { color:var(--hint); }
  .answer-input:focus {
    border-color:rgba(110,231,247,.35); border-left-color:var(--accent);
    box-shadow:0 0 0 3px rgba(110,231,247,.07), 0 0 20px rgba(110,231,247,.04);
    background:var(--bg3); color:var(--text);
  }
  .answer-input.has-value { border-color:rgba(52,211,153,.35); border-left-color:var(--accent3); background:rgba(52,211,153,.025); color:var(--text); }

  .answer-saved {
    display:inline-flex; align-items:center; gap:.45rem;
    font-family:var(--font-mono); font-size:.57rem; color:var(--accent3);
    margin-top:.45rem; animation:checkPop .35s cubic-bezier(.34,1.56,.64,1);
  }

  /* ── Config chips ── */
  .config-row { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:2rem; }
  .chip {
    display:inline-flex; align-items:center; gap:.4rem; padding:.32rem .95rem;
    border-radius:100px; font-size:.62rem; font-family:var(--font-mono);
    font-weight:500; border:1px solid;
  }
  .chip-role  { background:rgba(251,146,60,.08);  border-color:rgba(251,146,60,.25);  color:var(--accent4); }
  .chip-level { background:rgba(52,211,153,.08);  border-color:rgba(52,211,153,.25);  color:var(--accent3); }
  .chip-tech  { background:rgba(167,139,250,.08); border-color:rgba(167,139,250,.25); color:var(--accent2); }

  /* ── Progress bar ── */
  .prog-label { display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:.57rem; color:var(--muted); margin-bottom:.6rem; }
  .prog-wrap { background:var(--surface3); border-radius:100px; height:5px; overflow:hidden; margin-bottom:1.8rem; border:1px solid var(--border); }
  .prog-fill {
    height:100%; border-radius:100px;
    background:linear-gradient(90deg, var(--accent), var(--accent2));
    transition:width .6s cubic-bezier(.16,1,.3,1);
    animation:progressGlow 2.5s ease-in-out infinite;
  }

  /* ── Error box ── */
  .error-box {
    text-align:center; color:var(--rose); font-family:var(--font-mono);
    font-size:.73rem; padding:1.1rem 1.4rem;
    border:1px solid rgba(251,113,133,.25); border-radius:var(--r-md);
    margin-top:1.8rem; background:rgba(251,113,133,.06);
    animation:bounceIn .35s cubic-bezier(.34,1.56,.64,1);
  }
  .hint-txt { color:var(--hint); font-size:.57rem; font-family:var(--font-mono); }

  /* ════════════════════════════════════════════
     EVALUATION OVERLAY  ← the star of the show
  ════════════════════════════════════════════ */
  .eval-overlay {
    position:fixed; inset:0; z-index:200;
    background:rgba(6,8,16,.94); backdrop-filter:blur(16px) saturate(1.5);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:0; padding:2rem;
    animation:fadeUp .5s cubic-bezier(.16,1,.3,1);
  }

  /* Particle burst container */
  .eval-particles { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
  .particle {
    position:absolute; border-radius:50%; animation:particleFly 2.4s ease-out infinite;
    width:6px; height:6px;
  }

  .eval-ring-outer {
    width:120px; height:120px; border-radius:50%; position:relative; margin-bottom:2.5rem;
    display:flex; align-items:center; justify-content:center;
    animation:evalPulse 2s ease-in-out infinite;
  }
  .eval-ring-outer::before {
    content:''; position:absolute; inset:-4px; border-radius:50%;
    border:2px solid transparent;
    background:linear-gradient(var(--bg), var(--bg)) padding-box,
               linear-gradient(135deg, var(--accent), var(--accent2), var(--blue)) border-box;
    animation:spin 3s linear infinite;
  }
  .eval-ring-outer::after {
    content:''; position:absolute; inset:8px; border-radius:50%;
    border:1px solid rgba(110,231,247,.15);
  }
  .eval-ring-inner {
    width:90px; height:90px; border-radius:50%;
    background:radial-gradient(circle, rgba(167,139,250,.12) 0%, rgba(110,231,247,.06) 100%);
    border:1px solid rgba(110,231,247,.25);
    display:flex; align-items:center; justify-content:center;
    position:relative; z-index:1;
  }
  .eval-brain { font-size:2.2rem; animation:rFloat 2.2s ease-in-out infinite; }

  .eval-title {
    font-family:var(--font-display); font-size:1.6rem; font-weight:800;
    color:var(--text); text-align:center; letter-spacing:-.025em; margin-bottom:.6rem;
  }
  .eval-title-accent {
    background:linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  }

  .eval-subtitle {
    font-family:var(--font-mono); font-size:.65rem; color:var(--muted);
    letter-spacing:.1em; text-align:center; margin-bottom:2.5rem;
  }

  /* Typing steps */
  .eval-steps { display:flex; flex-direction:column; gap:.7rem; width:100%; max-width:400px; margin-bottom:2.5rem; }
  .eval-step {
    display:flex; align-items:center; gap:.9rem; padding:.8rem 1.1rem;
    border-radius:var(--r-md); border:1px solid var(--border); background:var(--surface);
    transition:all .4s cubic-bezier(.16,1,.3,1); font-family:var(--font-mono); font-size:.7rem;
  }
  .eval-step.active { border-color:rgba(110,231,247,.3); background:rgba(110,231,247,.05); color:var(--accent); }
  .eval-step.done   { border-color:rgba(52,211,153,.25); background:rgba(52,211,153,.04); color:var(--accent3); }
  .eval-step.idle   { color:var(--muted); }
  .step-icon { font-size:.95rem; width:20px; text-align:center; }
  .step-text { flex:1; }
  .step-dot {
    width:7px; height:7px; border-radius:50%; flex-shrink:0;
    transition:all .3s;
  }
  .eval-step.active .step-dot { background:var(--accent); box-shadow:0 0 8px var(--accent); animation:pulse2 1s infinite; }
  .eval-step.done   .step-dot { background:var(--accent3); }
  .eval-step.idle   .step-dot { background:var(--hint); }

  /* Typing cursor */
  .typing-line {
    font-family:var(--font-mono); font-size:.68rem; color:var(--muted);
    text-align:center; min-height:1.4em; display:flex; align-items:center; justify-content:center; gap:.1rem;
  }
  .cursor { display:inline-block; width:2px; height:1em; background:var(--accent); animation:cursorBlink .9s ease-in-out infinite; }

  /* Progress dots */
  .eval-dots { display:flex; gap:.5rem; justify-content:center; margin-top:1.5rem; }
  .eval-dot {
    width:7px; height:7px; border-radius:50%; background:var(--border3);
    transition:all .4s;
  }
  .eval-dot.active { background:var(--accent); box-shadow:0 0 10px var(--accent); transform:scale(1.4); }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:var(--bg); }
  ::-webkit-scrollbar-thumb { background:var(--surface3); border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:var(--border3); }

  /* ── Quick Tech Chips (Mobile Friendly) ── */
  .quick-techs { display:flex; flex-wrap:wrap; gap:.45rem; margin-top:.5rem; }
  .quick-tech-btn {
    display:inline-flex; align-items:center; gap:.35rem;
    padding:.38rem .85rem; border-radius:100px; font-size:.65rem;
    border:1px solid var(--border2); background:var(--surface2); color:var(--text2);
    cursor:pointer; transition:all .2s; font-family:var(--font-mono); font-weight:500;
  }
  .quick-tech-btn:hover { border-color:rgba(110,231,247,.4); color:var(--accent); }
  .quick-tech-btn.selected {
    border-color:var(--accent); color:var(--accent);
    background:rgba(110,231,247,.12); box-shadow:0 0 12px rgba(110,231,247,.15);
  }

  /* ── Responsive Mobile Overrides ── */
  @media(max-width:768px) {
    .app { padding:2rem 1rem 6rem; }
    .header { margin-bottom:2.5rem; }
    .status-badge { font-size:.52rem; padding:.38rem 1.1rem; margin-bottom:1.2rem; }
    .main-title { font-size:clamp(2rem,7.5vw,3.2rem); }
    .title-sub { font-size:1.1rem; }
    .subtitle { font-size:.65rem; gap:.4rem; }
    .hero-pills { gap:.4rem; margin-top:1.2rem; }
    .hero-pill { font-size:.62rem; padding:.32rem .8rem; }
    .card { padding:1.6rem 1.1rem; border-radius:var(--r-xl); }
    .form-row { grid-template-columns:1fr; gap:1.1rem; margin-bottom:1.1rem; }
    .form-select { font-size:16px; padding:.8rem 2.2rem .8rem .95rem; }
    .form-select-multi { font-size:16px; height:140px; }
    .btn { padding:.95rem 1.2rem; font-size:.88rem; }
    .btn-icon { width:26px; height:26px; font-size:.8rem; }
    .question-item { padding:1.1rem 1rem; border-radius:var(--r-md); }
    .q-header { gap:.75rem; }
    .q-num { min-width:30px; height:30px; border-radius:8px; font-size:.56rem; }
    .q-text { font-size:.84rem; line-height:1.65; padding-top:3px; }
    .answer-input { font-size:16px; padding:.75rem .9rem; min-height:85px; }
    .eval-overlay { padding:1.5rem 1rem; overflow-y:auto; justify-content:flex-start; }
    .eval-ring-outer { width:90px; height:90px; margin-top:auto; margin-bottom:1.2rem; }
    .eval-ring-inner { width:68px; height:68px; }
    .eval-brain { font-size:1.6rem; }
    .eval-title { font-size:1.25rem; margin-bottom:.4rem; }
    .eval-subtitle { font-size:.6rem; margin-bottom:1.2rem; }
    .eval-steps { gap:.5rem; margin-bottom:1.2rem; }
    .eval-step { padding:.65rem .85rem; font-size:.65rem; }
    .eval-dots { margin-bottom:auto; }
  }

  @media(max-width:480px) {
    .app { padding:1.25rem .65rem 4.5rem; }
    .card { padding:1.25rem .8rem; border-radius:16px; }
    .form-group { gap:.45rem; }
    .config-row { gap:.35rem; margin-bottom:1.2rem; }
    .chip { font-size:.58rem; padding:.28rem .7rem; }
    .prog-label { font-size:.52rem; }
    .btn-submit { margin-top:1.2rem; font-size:.84rem; }
  }
`;

/* ════════════════════════════════════════════
   SVG Robot
════════════════════════════════════════════ */
const RobotSVG = ({ size = 56, pc = "#6EE7F7", ac = "#A78BFA" }) => (
  <svg width={size} height={size * 1.35} viewBox="0 0 56 76" fill="none">
    <g className="r-float">
      <ellipse cx="28" cy="68" rx="16" ry="4" fill={pc} opacity=".07"/>
      <g className="r-ant">
        <line x1="28" y1="4" x2="28" y2="14" stroke={pc} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="28" cy="3" r="3" fill={pc} opacity=".9"/>
        <circle cx="28" cy="3" r="5.5" fill={pc} opacity=".1"/>
      </g>
      <rect x="9" y="13" width="38" height="28" rx="9" fill={ac} opacity=".2"/>
      <rect x="9" y="13" width="38" height="28" rx="9" fill="none" stroke={pc} strokeWidth=".8" opacity=".35"/>
      <rect x="13" y="17" width="30" height="20" rx="5" fill="#060810" opacity=".9"/>
      <g className="r-eyeL">
        <rect x="16" y="21" width="9" height="9" rx="3" fill={pc} opacity=".12"/>
        <rect x="16" y="21" width="9" height="9" rx="3" fill="none" stroke={pc} strokeWidth=".7" opacity=".65"/>
        <circle cx="20.5" cy="25.5" r="3" fill={pc} opacity=".9"/>
        <circle cx="21.5" cy="24.5" r="1" fill="white" opacity=".8"/>
      </g>
      <g className="r-eyeR">
        <rect x="31" y="21" width="9" height="9" rx="3" fill={ac} opacity=".12"/>
        <rect x="31" y="21" width="9" height="9" rx="3" fill="none" stroke={ac} strokeWidth=".7" opacity=".65"/>
        <circle cx="35.5" cy="25.5" r="3" fill={ac} opacity=".9"/>
        <circle cx="36.5" cy="24.5" r="1" fill="white" opacity=".8"/>
      </g>
      <line x1="15" y1="30.5" x2="41" y2="30.5" stroke={pc} strokeWidth=".5" opacity=".3" className="r-scan"/>
      <rect x="19" y="34" width="18" height="3" rx="1.5" fill="none" stroke={pc} strokeWidth=".55" opacity=".4"/>
      <rect x="21" y="35" width="3" height="1" rx=".5" fill={pc} opacity=".7"/>
      <rect x="26" y="35" width="4" height="1" rx=".5" fill={pc} opacity=".5"/>
      <rect x="32" y="35" width="3" height="1" rx=".5" fill={pc} opacity=".7"/>
      <rect x="23" y="41" width="10" height="5" rx="2" fill={ac} opacity=".28"/>
      <rect x="10" y="46" width="36" height="24" rx="7" fill={ac} opacity=".18"/>
      <rect x="10" y="46" width="36" height="24" rx="7" fill="none" stroke={pc} strokeWidth=".5" opacity=".28"/>
      <rect x="17" y="50" width="22" height="14" rx="4" fill="#060810" opacity=".85"/>
      <circle cx="23" cy="57" r="3" fill={pc} opacity=".65"/>
      <circle cx="29" cy="57" r="2" fill={ac} opacity=".65"/>
      <rect x="1"  y="46" width="8"  height="18" rx="4" fill={ac} opacity=".28"/>
      <rect x="47" y="46" width="8"  height="18" rx="4" fill={ac} opacity=".28"/>
      <rect x="14" y="70" width="10" height="6" rx="3" fill={ac} opacity=".32"/>
      <rect x="32" y="70" width="10" height="6" rx="3" fill={ac} opacity=".32"/>
    </g>
  </svg>
);

/* ════════════════════════════════════════════
   SVG Human
════════════════════════════════════════════ */
const HumanSVG = ({ size = 48, color = "#A78BFA" }) => (
  <svg width={size} height={size * 1.55} viewBox="0 0 48 74" fill="none">
    <g>
      <ellipse cx="24" cy="72" rx="12" ry="3" fill={color} opacity=".06"/>
      <circle cx="24" cy="10" r="9.5" fill={color} opacity=".2"/>
      <circle cx="24" cy="10" r="9.5" fill="none" stroke={color} strokeWidth=".7" opacity=".45"/>
      <circle cx="21" cy="9" r="1.8" fill={color} opacity=".75"/>
      <circle cx="27" cy="9" r="1.8" fill={color} opacity=".75"/>
      <path d="M21 13.5 Q24 16.5 27 13.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity=".55"/>
      <rect x="21" y="19.5" width="6" height="5.5" rx="2" fill={color} opacity=".38"/>
      <g className="h-body">
        <rect x="12" y="25" width="24" height="22" rx="8" fill={color} opacity=".2"/>
        <rect x="12" y="25" width="24" height="22" rx="8" fill="none" stroke={color} strokeWidth=".6" opacity=".35"/>
      </g>
      <g className="h-armL"><rect x="5"    y="25" width="8.5" height="19" rx="4.25" fill={color} opacity=".25"/></g>
      <g className="h-armR"><rect x="34.5" y="25" width="8.5" height="19" rx="4.25" fill={color} opacity=".25"/></g>
      <g className="h-legL"><rect x="13"   y="47" width="10"  height="23" rx="5"    fill={color} opacity=".28"/></g>
      <g className="h-legR"><rect x="25"   y="47" width="10"  height="23" rx="5"    fill={color} opacity=".28"/></g>
    </g>
  </svg>
);

const FIGURES = [
  { type:"robot", dur:16, delay:0,   left:3,  size:54, pc:"#6EE7F7", ac:"#A78BFA" },
  { type:"human", dur:20, delay:3,   left:11, size:44, color:"#A78BFA" },
  { type:"robot", dur:18, delay:7,   left:22, size:64, pc:"#60A5FA", ac:"#6EE7F7" },
  { type:"human", dur:22, delay:1.5, left:35, size:40, color:"#6EE7F7" },
  { type:"robot", dur:15, delay:9,   left:49, size:60, pc:"#A78BFA", ac:"#60A5FA" },
  { type:"human", dur:19, delay:4,   left:62, size:46, color:"#60A5FA" },
  { type:"robot", dur:17, delay:11,  left:74, size:56, pc:"#6EE7F7", ac:"#A78BFA" },
  { type:"human", dur:21, delay:2,   left:84, size:42, color:"#A78BFA" },
  { type:"robot", dur:24, delay:6,   left:93, size:62, pc:"#60A5FA", ac:"#6EE7F7" },
  { type:"human", dur:14, delay:13,  left:28, size:38, color:"#6EE7F7" },
];

/* ════════════════════════════════════════════
   Typing effect hook
════════════════════════════════════════════ */
function useTypingEffect(text, speed = 38) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { displayed, done };
}

/* ════════════════════════════════════════════
   Evaluation Overlay component
════════════════════════════════════════════ */
const EVAL_STEPS = [
  { icon:"🔍", label:"Parsing your responses…" },
  { icon:"🧠", label:"Cross-referencing knowledge base…" },
  { icon:"📊", label:"Scoring accuracy & depth…" },
  { icon:"✍️",  label:"Generating feedback…" },
  { icon:"🎯", label:"Finalising your report…" },
];

const TYPING_MESSAGES = [
  "Analyzing semantic patterns in your answers...",
  "Comparing with industry best practices...",
  "Identifying strengths and growth areas...",
  "Crafting personalised recommendations...",
  "Building your performance report...",
];

function EvalOverlay() {
  const [stepIndex, setStepIndex] = useState(0);
  const [msgIndex, setMsgIndex]   = useState(0);
  const { displayed, done } = useTypingEffect(TYPING_MESSAGES[msgIndex], 32);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex(s => (s < EVAL_STEPS.length - 1 ? s + 1 : s));
    }, 1600);
    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setMsgIndex(m => (m + 1) % TYPING_MESSAGES.length), 600);
    return () => clearTimeout(t);
  }, [done]);

  const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    color: ["#6EE7F7","#A78BFA","#60A5FA","#34D399"][i % 4],
    tx: `${(Math.random() - 0.5) * 320}px`,
    ty: `${-(Math.random() * 280 + 60)}px`,
    left: `${45 + (Math.random() - 0.5) * 14}%`,
    top:  `${35 + (Math.random() - 0.5) * 12}%`,
    delay: `${Math.random() * 2.4}s`,
    dur: `${2.2 + Math.random() * 1.2}s`,
    size: `${4 + Math.random() * 5}px`,
  }));

  return (
    <div className="eval-overlay">
      {/* Particles */}
      <div className="eval-particles">
        {PARTICLES.map(p => (
          <div key={p.id} className="particle" style={{
            background: p.color, left: p.left, top: p.top,
            width: p.size, height: p.size,
            "--tx": p.tx, "--ty": p.ty,
            animationDelay: p.delay, animationDuration: p.dur,
          }}/>
        ))}
      </div>

      {/* Spinning ring + brain icon */}
      <div className="eval-ring-outer">
        <div className="eval-ring-inner">
          <div className="eval-brain">🤖</div>
        </div>
      </div>

      <div className="eval-title">
        Evaluating <span className="eval-title-accent">Answers</span>
      </div>
      <div className="eval-subtitle">AI is carefully reviewing your responses</div>

      {/* Step list */}
      <div className="eval-steps">
        {EVAL_STEPS.map((s, i) => (
          <div key={i} className={`eval-step ${i < stepIndex ? "done" : i === stepIndex ? "active" : "idle"}`}
               style={{ animationDelay: `${i * .12}s` }}>
            <span className="step-icon">{i < stepIndex ? "✅" : s.icon}</span>
            <span className="step-text">{s.label}</span>
            <div className="step-dot"/>
          </div>
        ))}
      </div>

      {/* Typing cursor line */}
      <div className="typing-line">
        {displayed}
        <span className="cursor"/>
      </div>

      {/* Dot indicators */}
      <div className="eval-dots">
        {EVAL_STEPS.map((_, i) => (
          <div key={i} className={`eval-dot ${i <= stepIndex ? "active" : ""}`}/>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════ */
const TECH_OPTIONS = ["ReactJS","NextJS","ExpressJS","NodeJS","Java","Python"];

export default function App() {
  const [role,       setRole]      = useState("");
  const [level,      setLevel]     = useState("");
  const [techStack,  setTechStack] = useState([]);
  const [questions,  setQuestions] = useState([]);
  const [loading,    setLoading]   = useState(false);
  const [evaluating, setEvaluating]= useState(false);
  const [error,      setError]     = useState("");
  const [answers,    setAnswers]   = useState([]);
  const navigate = useNavigate();

  const toggleTech = val => {
    setTechStack(prev => prev.includes(val) ? prev.filter(t => t !== val) : [...prev, val]);
  };
  const handleTechChange = e => setTechStack(Array.from(e.target.selectedOptions, o => o.value));
  const removeTag        = val => setTechStack(prev => prev.filter(t => t !== val));
  const handleAnswer     = (i, v) => setAnswers(prev => { const u=[...prev]; u[i]=v; return u; });

  /* Generate questions */
  const generateQuestions = async () => {
    setError("");
    if (!role || !level || techStack.length === 0) { setError("⚠ Please select Role, Level & at least one Tech"); return; }
    setLoading(true); setQuestions([]); setAnswers([]);
    try {
      const res  = await fetch(getApiUrl("/api/generate"), {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ role, level, techstack: techStack }),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.questions)) throw new Error(data.error || "Invalid response");
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(""));
    } catch (err) {
      console.error(err);
      setError(`⚠ ${err.message || "Failed to generate questions. Check backend connection."}`);
    }
    setLoading(false);
  };

  /* Evaluate answers */
  const evaluateAnswers = async () => {
    setError(""); setEvaluating(true);
    try {
      const res  = await fetch(getApiUrl("/api/evaluate"), {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ role, level, techstack: techStack, questions, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed");
      navigate("/result", { state: { role, level, techStack, questions, answers, evaluation: data } });
    } catch (err) {
      console.error(err); setError("⚠ Evaluation failed. Please try again.");
    }
    setEvaluating(false);
  };

  const filled   = answers.filter(a => a?.trim()).length;
  const progress = questions.length > 0 ? Math.round((filled / questions.length) * 100) : 0;

  return (
    <>
      <style>{styles}</style>

      {/* Ambient layer */}
      <div id="ambient"/>

      {/* Evaluation overlay */}
      {evaluating && <EvalOverlay/>}

      {/* Floating figures */}
      <div id="icon-canvas">
        {FIGURES.map((fig, i) => (
          <div key={i} className="float-fig" style={{
            left:`${fig.left}%`,
            animationDuration:`${fig.dur}s`,
            animationDelay:`${fig.delay}s`,
          }}>
            {fig.type === "robot"
              ? <RobotSVG size={fig.size} pc={fig.pc} ac={fig.ac}/>
              : <HumanSVG size={fig.size} color={fig.color}/>
            }
          </div>
        ))}
      </div>

      <div className="app">

        {/* ── Header ── */}
        <div className="header">
          <div className="status-badge">
            <span className="status-dot"/> AI-Powered Platform
          </div>
          <h1 className="main-title">
            Interview <span className="title-accent">Prep</span>
            <span className="title-sub">Studio</span>
          </h1>
          <p className="subtitle">
            <span className="subtitle-bar"/>
            generate · practice · master
            <span className="subtitle-bar"/>
          </p>
          <div className="hero-pills">
            {[["💻","Tech Roles"],["🎯","All Levels"],["⚡","AI Generated"],["📋","Smart Questions"],["🔒","Secure Session"]].map(([icon,label]) => (
              <div className="hero-pill" key={label}>
                <span className="hero-pill-icon">{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Card ── */}
        <div className="card">
          <div className="section-label">
            <span className="sl-num">1</span> Configure your session
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><span className="label-icon">👤</span> Role</label>
              <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="label-icon">📊</span> Seniority Level</label>
              <select className="form-select" value={level} onChange={e=>setLevel(e.target.value)}>
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{marginBottom:"1rem"}}>
            <label className="form-label">
              <span className="label-icon">🔧</span> Tech Stack
              <span className="hint-txt">&nbsp;(Tap to select)</span>
            </label>
            <div className="quick-techs">
              {TECH_OPTIONS.map(t => {
                const isSelected = techStack.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    className={`quick-tech-btn${isSelected ? " selected" : ""}`}
                    onClick={() => toggleTech(t)}
                  >
                    <span>{isSelected ? "✓" : "+"}</span> {t}
                  </button>
                );
              })}
            </div>
          </div>

          {techStack.length > 0 && (
            <div className="tags">
              {techStack.map(t => (
                <div className="tag" key={t}>
                  {t}
                  <button className="tag-remove" onClick={()=>removeTag(t)}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="divider"><div className="divider-dot"/></div>

          <button className="btn" onClick={generateQuestions} disabled={loading || evaluating}>
            {loading
              ? <><span className="spinner"/> Generating questions…</>
              : <><span className="btn-icon">🚀</span> Generate Interview Questions</>
            }
          </button>

          {error && <div className="error-box">{error}</div>}

          {/* Shimmer skeleton */}
          {loading && (
            <div className="results">
              {[78,62,88,68,74].map((w,i) => (
                <div key={i} className="shimmer-line" style={{width:`${w}%`, height:`${15+i*3}px`}}/>
              ))}
            </div>
          )}

          {/* Questions + answers */}
          {!loading && questions.length > 0 && (
            <div className="results">
              <div className="config-row">
                {role      && <div className="chip chip-role">👤 {role}</div>}
                {level     && <div className="chip chip-level">📊 {level}</div>}
                {techStack.map(t => <div className="chip chip-tech" key={t}>⚙ {t}</div>)}
              </div>

              <div className="prog-label">
                <span>Answers completed</span>
                <span style={{color: progress===100 ? "var(--accent3)" : "var(--muted)"}}>
                  {filled} / {questions.length} — {progress}%
                </span>
              </div>
              <div className="prog-wrap">
                <div className="prog-fill" style={{width:`${progress}%`}}/>
              </div>

              <div className="results-header">◈ Interview Questions</div>

              {questions.map((q, i) => (
                <div className="question-item" key={i} style={{animationDelay:`${i * .08}s`}}>
                  <div className="q-header">
                    <div className="q-num" style={{animationDelay:`${i*.06}s`}}>
                      {String(i+1).padStart(2,"0")}
                    </div>
                    <div className="q-text">{q}</div>
                  </div>
                  <div className="answer-wrap">
                    <div className="answer-label"><span className="ans-dot"/> Your Answer</div>
                    <textarea
                      className={`answer-input${answers[i]?.trim() ? " has-value" : ""}`}
                      placeholder="Type your answer here…"
                      value={answers[i] || ""}
                      onChange={e => handleAnswer(i, e.target.value)}
                    />
                    {answers[i]?.trim() && (
                      <div className="answer-saved">✓ Answer recorded</div>
                    )}
                  </div>
                </div>
              ))}

              <button
                className="btn btn-submit"
                onClick={evaluateAnswers}
                disabled={filled === 0 || evaluating}
              >
                <span className="btn-icon">✅</span>
                Submit All Answers &nbsp;·&nbsp; {filled}/{questions.length}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}