"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";

type MaterialType = "scene" | "cards" | "worksheet";
type Draft = { type: MaterialType; topic: string; age: number; style: string; objective: string; details: string };
type SavedMaterial = { id: string; image: string; model: string; topic: string; type: MaterialType; createdAt: number };
const types: { value: MaterialType; title: string; description: string; output: string }[] = [
  { value: "scene", title: "이야기나누기 그림자료", description: "한 장면을 크게 보며 생각을 나눠요", output: "큰 장면 1장" },
  { value: "cards", title: "그림카드", description: "오리고 분류하기 좋은 8장 카드", output: "그림카드 8장" },
  { value: "worksheet", title: "활동지", description: "찾기·연결·색칠을 위한 선화 자료", output: "활동지 1장" },
];
const initialDraft: Draft = { type: "scene", topic: "봄에 피는 꽃", age: 4, style: "색연필", objective: "봄꽃의 생김새를 관찰하고 특징을 말해본다", details: "" };

function openArchive(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("grim-material-library", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("materials", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function readArchive(): Promise<SavedMaterial[]> {
  const db = await openArchive();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction("materials", "readonly").objectStore("materials").getAll();
      request.onsuccess = () => resolve((request.result as SavedMaterial[]).sort((a, b) => b.createdAt - a.createdAt));
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}
async function updateArchive(material: SavedMaterial | null, removeIds: string[]): Promise<void> {
  const db = await openArchive();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction("materials", "readwrite");
      const store = transaction.objectStore("materials");
      if (material) store.put(material);
      removeIds.forEach((id) => store.delete(id));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { db.close(); }
}

function PaperArt({ hero = false }: { hero?: boolean }) {
  return <svg className={hero ? "hero-art" : "empty-art"} viewBox="0 0 350 350" fill="none" aria-hidden="true">
    <g transform={hero ? "rotate(7 235 185)" : "rotate(-8 140 210)"}>
      <rect x="112" y="73" width="192" height="241" rx="2" fill="#203032" />
      <rect x="107" y="67" width="192" height="241" rx="2" fill={hero ? "#CBE3DD" : "#EBD074"} stroke="#203032" strokeWidth="2" />
      <path d="M201 252c-29-39-33-68-26-105m21 94c26-3 40-19 42-28-17-3-31 4-42 19m-12-37c-19 3-33-9-36-20 14-8 28 2 36 15" stroke="#1D7065" strokeWidth="5" strokeLinecap="round" />
      <path d="M165 159c-22-23-20-35-8-38 4-16 15-15 21 2 18-8 24 1 8 19 18 14 12 24-5 16-5 19-19 18-16 1Z" fill="#ED7356" />
    </g>
    <g transform={hero ? "rotate(-3 146 160)" : "rotate(7 210 190)"}>
      <rect x="45" y="52" width="220" height="238" rx="2" fill="#203032" />
      <rect x="40" y="46" width="220" height="238" rx="2" fill={hero ? "#FCF7E9" : "#CBE3DD"} stroke="#203032" strokeWidth="2" />
      {hero ? <>
        <path d="M118 36h62v20h-62z" fill="#EBD074" fillOpacity=".85" />
        <text x="60" y="76" fill="#1D7065" fontSize="8" fontWeight="800" letterSpacing=".7">TODAY’S MATERIAL</text>
        <text x="61" y="121" fill="#203032" fontSize="29" fontFamily="serif" fontWeight="700">봄의</text>
        <text x="61" y="155" fill="#203032" fontSize="29" fontFamily="serif" fontWeight="700">작은 발견</text>
        <text x="60" y="259" fill="#6D7B7C" fontSize="9">관찰하고 · 말하고 · 그려요</text>
        <circle cx="213" cy="101" r="22" stroke="#EE7356" strokeWidth="1.5" />
        <path d="M213 67v68m-34-34h68m-57-23 46 46m0-46-46 46" stroke="#EE7356" strokeWidth="1.5" />
      </> : <>
        <path d="m126 188 17-15 12 10 10-7 17 9" stroke="#1D7065" strokeWidth="4" />
        <path d="m86 267 11-30L203 96c3-4 6-4 10-1l5 4c4 3 5 7 2 10L113 250l-27 17Z" fill="#EE7356" stroke="#203032" strokeWidth="2" />
        <path d="m86 267 11-30 16 13-27 17Z" fill="#FCF7E9" stroke="#203032" strokeWidth="2" />
        <path d="m86 267 5-14 8 7-13 7Z" fill="#203032" />
      </>}
    </g>
  </svg>;
}

export default function Home() {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState<SavedMaterial | null>(null);
  const [archive, setArchive] = useState<SavedMaterial[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const selected = types.find((type) => type.value === draft.type) ?? types[0];
  const resultType = types.find((type) => type.value === result?.type);
  useEffect(() => {
    queueMicrotask(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("grim-material-draft") || "null");
      if (saved && typeof saved === "object") {
        const value = saved as Partial<Draft>;
        if (types.some((type) => type.value === value.type) && typeof value.topic === "string" && [3, 4, 5].includes(value.age ?? 0) && ["색연필", "크레용", "수채화", "종이 콜라주"].includes(value.style ?? "") && typeof value.objective === "string" && typeof value.details === "string") {
          setDraft(value as Draft);
        }
      }
    } catch {}
    setReady(true);
    });
    readArchive().then(setArchive).catch(() => setNotice("이 브라우저에서는 보관함을 사용할 수 없어요. 만든 그림은 파일로 저장해 주세요."));
    fetch("/api/quota").then(async (response) => {
      if (response.ok) {
        const quota: { remaining: number } = await response.json();
        setRemaining(quota.remaining);
      }
    }).catch(() => {});
  }, []);
  useEffect(() => {
    if (ready) {
      try { localStorage.setItem("grim-material-draft", JSON.stringify(draft)); } catch {}
    }
  }, [draft, ready]);
  function update<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft((current) => ({ ...current, [key]: value })); }
  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      const body: { image?: string; model?: string; remaining?: number; error?: string } = await response.json();
      if (typeof body.remaining === "number") setRemaining(body.remaining);
      if (!response.ok || !body.image) throw new Error(body.error || "그림을 만들지 못했어요. 잠시 후 다시 시도해 주세요.");
      const material: SavedMaterial = { id: crypto.randomUUID(), image: body.image, model: body.model || "GPT Image 2.5", topic: draft.topic.trim(), type: draft.type, createdAt: Date.now() };
      setResult(material);
      try {
        const previous = await readArchive();
        await updateArchive(material, previous.slice(11).map((item) => item.id));
        setArchive([material, ...previous].slice(0, 12));
        setNotice("그림을 이 브라우저의 보관함에 저장했어요.");
      } catch { setNotice("보관함 저장 공간이 부족해요. 아래 버튼으로 그림 파일을 저장해 주세요."); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "연결을 확인하고 다시 시도해 주세요."); }
    finally {
      setLoading(false);
      fetch("/api/quota").then(async response => { if(response.ok) { const quota: {remaining:number} = await response.json(); setRemaining(quota.remaining); } }).catch(() => {});
    }
  }
  async function download() {
    if (!result) return;
    try {
      const blob = await (await fetch(result.image)).blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `${result.topic.replace(/[<>:"/\\|?*]/g, "-")}-${resultType?.title || "그림교구"}.png`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError("그림 저장에 실패했어요. 다시 눌러 주세요."); }
  }
  async function remove(id: string) {
    try {
      await updateArchive(null, [id]);
      setArchive((current) => current.filter((item) => item.id !== id));
      setNotice("보관함에서 삭제했어요.");
    } catch { setNotice("삭제하지 못했어요. 브라우저 저장 공간을 확인해 주세요."); }
  }
  return <main id="top" className="site-shell">
    <header className="masthead paper-panel"><a href="#top" className="brand"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>그림교구실</a><span className="header-note"><span />교사를 위한 AI 드로잉 도구</span></header>
    <section className="hero paper-panel" aria-labelledby="hero-title">
      <div className="hero-copy"><p className="eyebrow"><span className="pill">AI DRAWING LAB</span><span>· 오늘 수업을 위한 한 장</span></p>
        <h1 id="hero-title">아이들의 생각이 열리는<br /><span className="highlight">그림 교구</span>를 만드세요.</h1>
        <p className="hero-description">주제와 연령을 알려주면 따뜻한 손그림 스타일의 이야기 자료, 그림카드, 활동지를 만들어요.</p>
        <ul className="hero-benefits"><li>수업 맞춤</li><li>바로 인쇄</li><li>API 키 노출 없음</li></ul>
      </div><PaperArt hero />
    </section>
    <div className="workspace">
      <section className="form-panel paper-panel" aria-labelledby="form-title">
        <div className="form-heading"><div><p className="eyebrow">STEP 1–3</p><h2 id="form-title">어떤 교구가 필요하세요?</h2></div><span className="teacher-stamp" aria-hidden="true">TEACHER<br />MADE</span></div>
        <form onSubmit={generate}>
          <fieldset className="type-options"><legend className="sr-only">교구 유형</legend>{types.map((type, index) => <label className={`type-option ${draft.type === type.value ? "selected" : ""}`} key={type.value}><input type="radio" name="material-type" value={type.value} checked={draft.type === type.value} onChange={() => update("type", type.value)} disabled={loading} /><span className="type-number">0{index + 1}</span><span className="type-copy"><strong>{type.title}</strong><small>{type.description}</small></span><span className="selection-dot" aria-hidden="true">{draft.type === type.value ? "✓" : ""}</span></label>)}</fieldset>
          <div className="form-divider" />
          <label className="field-label" htmlFor="topic">수업 주제 <span className="field-tag">필수</span></label><input id="topic" className="text-input" required maxLength={100} value={draft.topic} onChange={(event) => update("topic", event.target.value)} placeholder="예: 봄에 피는 꽃" disabled={loading} />
          <div className="option-columns"><fieldset><legend className="field-label">대상 연령</legend><div className="segmented ages">{[3, 4, 5].map((age) => <label key={age} className={draft.age === age ? "active" : ""}><input type="radio" name="age" value={age} checked={draft.age === age} onChange={() => update("age", age)} disabled={loading} /><span>만 {age}세</span></label>)}</div></fieldset><fieldset><legend className="field-label">그림 느낌</legend><div className="segmented styles">{["색연필", "크레용", "수채화", "종이 콜라주"].map((style) => <label key={style} className={draft.style === style ? "active" : ""}><input type="radio" name="style" value={style} checked={draft.style === style} onChange={() => update("style", style)} disabled={loading} /><span>{style}</span></label>)}</div></fieldset></div>
          <label className="field-label" htmlFor="objective">수업 목표 <span className="field-tag">선택</span></label><input id="objective" className="text-input" maxLength={300} value={draft.objective} onChange={(event) => update("objective", event.target.value)} placeholder="이 그림으로 어떤 이야기를 나눌까요?" disabled={loading} />
          <label className="field-label" htmlFor="details">꼭 넣고 싶은 것 <span className="field-tag">선택</span></label><textarea id="details" className="text-input" rows={4} maxLength={600} value={draft.details} onChange={(event) => update("details", event.target.value)} placeholder="예: 민들레, 개나리, 벚꽃을 함께 보여주세요" disabled={loading} />
          <button className="generate-button" type="submit" disabled={loading || remaining === 0}><span aria-hidden="true">✦</span>{loading ? "선생님의 그림을 그리고 있어요…" : remaining === 0 ? "오늘 체험을 모두 사용했어요" : `${selected.title} 만들기`}<span aria-hidden="true">↗</span></button>
          <p className="secure-note"><span />이미지는 서버에서 안전하게 생성돼요. API 키는 브라우저에 보이지 않아요.</p><p className="quota-note">공개 체험 · 전체 사용자 하루 2회 (한국 시간), 실패한 시도도 포함{remaining !== null && <strong>오늘 남은 횟수 {remaining}회</strong>}</p>
          {error && <p className="error-message" role="alert">{error}</p>}
        </form>
      </section>
      <section className="output-panel paper-panel" aria-labelledby="output-title" aria-busy={loading}>
        <div className="output-heading"><h2 id="output-title"><span className="eyebrow">OUTPUT</span>{result && !loading ? resultType?.output : selected.output}</h2><span className="model-badge">GPT Image 2.5</span></div>
        {loading ? <div className="empty-state loading-state" role="status"><span className="drawing-loader" aria-hidden="true">✦</span><p className="eyebrow">A LITTLE MAGIC IN PROGRESS</p><h3>수업에 어울리는 그림을 그려요.</h3><p>보통 1–3분 정도 걸려요.<br />이 창을 열어 두고 잠시 기다려 주세요.</p><div className="loading-track"><span /></div></div> : result ? <div className="result-state"><div className="result-caption"><div><p className="eyebrow">MADE FOR YOUR CLASS</p><h3>{result.topic}</h3></div><span>{resultType?.title}</span></div><Image unoptimized width={1024} height={1536} className="generated-image" src={result.image} alt={`${result.topic} 주제의 ${resultType?.title || "그림 교구"}`} /><div className="result-actions"><button onClick={download}>↓ PNG 이미지 저장</button><button onClick={() => window.print()}>인쇄하기 ↗</button></div><p className="result-guidance">수업에 사용하기 전 그림과 글자를 확인해 주세요. 인쇄 창에서 용지 방향과 크기를 맞출 수 있어요.</p></div> : <div className="empty-state"><PaperArt /><p className="eyebrow">READY WHEN YOU ARE</p><h3>왼쪽에서 교구를 설계해 보세요.</h3><p>유형과 주제를 고르면 이곳에 인쇄 가능한 그림 교구가 나타나요.</p><ol className="mini-steps"><li><span>1</span>유형 고르기</li><li><span>2</span>주제 적기</li><li><span>3</span>생성하기</li></ol></div>}
      </section>
    </div>
    <section className="archive-panel paper-panel" aria-labelledby="archive-title"><div className="archive-heading"><div><p className="eyebrow">YOUR LITTLE LIBRARY</p><h2 id="archive-title">우리 반 그림 보관함 <span>{archive.length}/12</span></h2><p>최근 12장의 그림을 이 기기의 현재 브라우저에만 보관해요. 오래 두고 쓸 그림은 파일로 저장해 주세요.</p></div><span className="archive-decoration" aria-hidden="true">✳</span></div>{notice && <p className="archive-notice" role="status">{notice}</p>}{archive.length ? <div className="archive-grid">{archive.map((item) => <article className={`archive-card ${result?.id === item.id ? "current" : ""}`} key={item.id}><button className="archive-open" onClick={() => { setResult(item); setError(""); document.getElementById("output-title")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} aria-label={`${item.topic} 그림 다시 열기`}><Image unoptimized width={1024} height={1536} src={item.image} alt="" loading="lazy" /><strong>{item.topic}</strong><small>{types.find((type) => type.value === item.type)?.title} · {new Date(item.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}</small></button><button className="archive-delete" onClick={() => remove(item.id)} aria-label={`${item.topic} 보관함에서 삭제`}>삭제</button></article>)}</div> : <p className="archive-empty">아직 보관한 그림이 없어요. 첫 교구를 만들면 여기에 차곡차곡 모여요.</p>}</section>
    <footer><a href="#top">그림교구실</a><p>선생님의 작은 아이디어가, 아이들의 큰 발견으로.</p><span>오늘도 즐거운 수업을 만들어 주세요.</span></footer>
  </main>;
}
