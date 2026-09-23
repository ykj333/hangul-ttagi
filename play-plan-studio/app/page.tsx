"use client";

import { useState } from "react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { sectionKeys, sectionLabels, isPlan, type Plan, type PlanInput, type SectionKey } from "@/lib/plan";

const initial: PlanInput = { age: "만 4세", title: "", context: "", playType: "" };
const examples = [
  { label: "자연 탐색", title: "비 오는 날의 물길", context: "비가 온 뒤 유아들이 운동장에 고인 물과 물길에 관심을 보이며 나뭇잎을 띄워 보고 있어요.", playType: "실외 탐색 놀이" },
  { label: "상상 놀이", title: "우리 동네 작은 가게", context: "유아들이 빈 상자와 장바구니로 가게를 만들고 서로 손님과 주인 역할을 바꿔 가며 놀고 있어요.", playType: "역할 놀이" },
];

export default function Home() {
  const [input, setInput] = useState<PlanInput>(initial);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState("");
  const [error, setError] = useState("");

  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setLoading(true);
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const data: unknown = await response.json();
      if (!response.ok) throw new Error((data as { error?: string }).error || "생성에 실패했습니다.");
      if (!isPlan(data)) throw new Error("생성 결과를 읽을 수 없습니다.");
      setPlan(data);
      window.setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "다시 시도해 주세요."); }
    finally { setLoading(false); }
  }

  async function download() {
    if (!plan) return;
    setDownloading(true); setError(""); setDownloadNotice("");
    try {
      const children = [
        new Paragraph({ text: "놀이 실행안", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: "연령  ", bold: true }), new TextRun(input.age), new TextRun({ text: "    놀이명  ", bold: true }), new TextRun(plan.title)], spacing: { after: 300 } }),
        ...sectionKeys.flatMap((key) => [
          new Paragraph({ text: `${String(sectionKeys.indexOf(key) + 2).padStart(2, "0")}  ${sectionLabels[key]}`, heading: HeadingLevel.HEADING_2, spacing: { before: 260, after: 100 } }),
          ...plan.sections[key].split("\n").map((line) => new Paragraph({ text: line || " ", spacing: { after: 90, line: 360 } })),
        ]),
      ];
      const docxDocument = new Document({ sections: [{ properties: {}, children }] });
      const blob = await Packer.toBlob(docxDocument);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `${(plan.title || "놀이_실행안").replace(/[\/:*?"<>|]/g, "-")}_놀이실행안.docx`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove(); setDownloadNotice("DOCX 다운로드를 시작했습니다.");
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch { setError("DOCX 파일을 만들지 못했습니다. 다시 시도해 주세요."); }
    finally { setDownloading(false); }
  }

  function updateSection(key: SectionKey, value: string) {
    setPlan((current) => current ? { ...current, sections: { ...current.sections, [key]: value } } : null);
  }

  return <main>
    <header className="site-header"><div className="header-inner"><a className="brand" href="#top" aria-label="놀이결 홈"><span className="brand-mark">✳</span><span>놀이결 <small>PLAY PLAN STUDIO</small></span></a><span className="header-note"><span className="status-dot" /> 교사를 위한 놀이 기록 도구</span></div></header>
    <div id="top" className="page-shell">
      <section className="hero" aria-labelledby="hero-title"><div className="eyebrow"><span className="eyebrow-line" /> FROM CURIOSITY TO PLAY</div><h1 id="hero-title">아이의 오늘이,<br /><em>내일의 놀이</em>가 되도록.</h1><p>유아의 작은 관심에서 시작해, 교사가 바로 활용할 수 있는<br className="desktop-break" /> 놀이 실행안을 함께 만들어 드립니다.</p><div className="hero-decoration" aria-hidden="true"><span>✳</span><span>✦</span><span>○</span></div></section>
      <div className="workspace">
        <section className="form-panel" aria-labelledby="form-title"><div className="panel-top"><div><span className="step">01 / 시작하기</span><h2 id="form-title">놀이의 씨앗을 적어주세요</h2><p>네 가지만 알려주시면 실행안을 완성해 드려요.</p></div><span className="panel-icon" aria-hidden="true">✎</span></div>
          <form onSubmit={generate}>
            <fieldset className="field"><legend>연령 <span className="required">*</span></legend><div className="age-options">{["만 3세", "만 4세", "만 5세"].map((age) => <label key={age} className={input.age === age ? "age-option selected" : "age-option"}><input type="radio" name="age" value={age} checked={input.age === age} onChange={() => setInput({ ...input, age })} />{age}</label>)}</div></fieldset>
            <label className="field">놀이명 <span className="required">*</span><input required maxLength={100} value={input.title} onChange={(event) => setInput({ ...input, title: event.target.value })} placeholder="예: 비 오는 날의 물길" /></label>
            <label className="field">유아의 관심 · 현재 놀이 환경 및 모습 <span className="required">*</span><textarea required maxLength={2000} rows={5} value={input.context} onChange={(event) => setInput({ ...input, context: event.target.value })} placeholder="아이들이 무엇에 호기심을 보이나요? 지금 어떤 놀이를 하고 있나요?" /><small>관찰한 모습이 구체적일수록 실행안이 더 풍부해져요.</small></label>
            <label className="field">놀이 유형 <span className="required">*</span><input required maxLength={100} value={input.playType} onChange={(event) => setInput({ ...input, playType: event.target.value })} placeholder="예: 역할 놀이, 자연 탐색 놀이" /></label>
            <button className="generate-button" disabled={loading} type="submit">{loading ? <><span className="spinner" /> 실행안을 만들고 있어요</> : <>놀이 실행안 만들기 <span aria-hidden="true">↗</span></>}</button>
          </form>
          <div className="example-box"><div className="example-heading"><span>✦</span> 이렇게 시작해 보세요</div><div className="example-actions">{examples.map((example) => <button key={example.label} type="button" onClick={() => { setInput({ ...input, title: example.title, context: example.context, playType: example.playType }); setPlan(null); setError(""); }}>{example.label} <span aria-hidden="true">↗</span></button>)}</div></div>
        </section>
        <section className="result-panel" id="result" aria-labelledby="result-title"><div className="panel-top result-top"><div><span className="step">02 / 놀이 실행안</span><h2 id="result-title">우리의 놀이 설계</h2><p>{plan ? "내용을 직접 다듬고 DOCX로 저장하세요." : "완성된 실행안이 이곳에 나타납니다."}</p></div>{plan && <button className="download-button" type="button" onClick={download} disabled={downloading}>{downloading ? "준비 중…" : "↓ DOCX 다운로드"}</button>}</div>
          {error && <div className="error" role="alert">{error}</div>}
          {downloadNotice && <div className="download-notice" role="status">{downloadNotice}</div>}
          {!plan ? <div className="empty-state"><div className="empty-art" aria-hidden="true"><span className="art-card card-one">✳</span><span className="art-card card-two">✦</span><span className="art-stem">╱</span></div><h3>아직 비어 있는 놀이 한 장</h3><p>왼쪽에 아이들의 이야기를 적고<br />‘놀이 실행안 만들기’를 눌러주세요.</p><div className="empty-divider" /><span>관찰에서 시작되는 진짜 놀이</span></div> : <div className="plan-content"><div className="plan-heading"><span className="plan-label">PLAY PLAN · {input.age}</span><input aria-label="놀이명 수정" value={plan.title} onChange={(event) => setPlan({ ...plan, title: event.target.value })} /><p>아이의 관심을 따라 확장하는 놀이</p></div>{sectionKeys.map((key, index) => <div className="plan-section" key={key}><div className="section-number">{String(index + 2).padStart(2, "0")}</div><div className="section-body"><label htmlFor={`section-${key}`}>{sectionLabels[key]}</label><textarea id={`section-${key}`} value={plan.sections[key]} onChange={(event) => updateSection(key, event.target.value)} rows={Math.max(3, Math.min(9, plan.sections[key].split("\n").length + 2))} /></div></div>)}<div className="result-footer">생성된 내용은 교사가 유아의 실제 모습과 안전 상황에 맞게 검토해 주세요.</div></div>}
        </section>
      </div>
      <footer>놀이결 <span>·</span> 유아의 호기심에서 시작하는 놀이 계획</footer>
    </div>
  </main>;
}
