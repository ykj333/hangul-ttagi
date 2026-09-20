"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { BookOpen, Images, NotebookPen, FolderHeart, Blocks, Search, Plus, Download, Star, LogOut, ChevronRight, CalendarDays, Pencil, Trash2, Leaf, ArrowLeft, ShieldCheck, X, Upload, Cloud, Monitor, LoaderCircle } from "lucide-react";
import { ArchiveRecord, Category, Teacher, categories, recordSchema, recordText, formatDate } from "@/lib/records";
import { loadLocal, saveLocal, deleteLocal } from "@/lib/local-db";
import { Login } from "./login";
import { Editor } from "./editor";
import { Dialog } from "./dialog";
import { Scene } from "./scene";
const icons = [Images, NotebookPen, FolderHeart, Blocks];
function download(content: string, name: string, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function safeName(title: string) { return title.replace(/[<>:"/\|?*\x00-\x1f]/g, "_").slice(0, 80); }
export function Archive(props: { teacher: Teacher | null; googleReady: boolean; cloudReady: boolean; imageReady: boolean }) {
  if (!props.teacher) return <Login googleReady={props.googleReady}/>;
  return <Workspace {...props} teacher={props.teacher}/>;
}
function Workspace({ teacher, cloudReady, imageReady }: { teacher: Teacher; cloudReady: boolean; imageReady: boolean }) {
  const [profile, setProfile] = useState({ institution: "", classRole: teacher.className });
  const [records, setRecords] = useState<ArchiveRecord[]>([]);
  const [category, setCategory] = useState<Category>("album");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [starOnly, setStarOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [editor, setEditor] = useState<ArchiveRecord | "new" | null>(null);
  const [deleting, setDeleting] = useState<ArchiveRecord | null>(null);
  const [backup, setBackup] = useState(false);
  const [help, setHelp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const pending = localStorage.getItem("dodam-profile");
        let savedProfile = { institution: "", classRole: teacher.className };
        if (teacher.demo) {
          if (pending) { try { savedProfile = JSON.parse(pending); } catch {} }
        } else {
          const profileResponse = await fetch("/api/profile", pending ? { method: "POST", headers: { "Content-Type": "application/json" }, body: pending } : undefined);
          if (profileResponse.ok) { const value = await profileResponse.json(); if (value) savedProfile = value; if (pending) localStorage.removeItem("dodam-profile"); }
        }
        if (active) setProfile(savedProfile);
        let items: ArchiveRecord[];
        if (teacher.demo) items = await loadLocal(teacher);
        else { const response = await fetch("/api/records"); const data = await response.json(); if (!response.ok) throw Error(data.error); items = data; }
        if (active) { setRecords(items); setSelected(items.find(r => r.category === "album")?.id || null); }
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "기록을 불러오지 못했어요."); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [teacher]);
  useEffect(() => { if (notice) { const timer = setTimeout(() => setNotice(""), 4000); return () => clearTimeout(timer); } }, [notice]);
  const visible = useMemo(() => records.filter(r => r.category === category && (!starOnly || r.starred) && `${r.title} ${r.child} ${r.className} ${r.description} ${r.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "newest" ? b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt) : a.date.localeCompare(b.date)), [records, category, query, starOnly, sort]);
  const current = visible.find(r => r.id === selected) || visible[0];
  const activeCategory = categories.find(c => c.id === category)!;
  async function save(record: ArchiveRecord) {
    if (teacher.demo) await saveLocal(teacher, record);
    else { const response = await fetch("/api/records", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) }); if (!response.ok) throw Error((await response.json()).error); }
    setRecords(old => [...old.filter(r => r.id !== record.id), record]); setSelected(record.id); setCategory(record.category); setNotice("소중한 순간을 저장했어요.");
  }
  async function logout() {
    try {
      if (!teacher.demo) {
        const response = await fetch("/api/neon-auth/sign-out", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
        if (!response.ok) throw Error("로그아웃하지 못했어요. 다시 시도해 주세요.");
      }
      await signOut({ callbackUrl: "/" });
    } catch { setError("로그아웃하지 못했어요. 다시 시도해 주세요."); }
  }
  async function remove() {
    if (!deleting) return; setBusy(true);
    try {
      if (teacher.demo) await deleteLocal(teacher, deleting.id);
      else { const response = await fetch(`/api/records?id=${deleting.id}`, { method: "DELETE" }); if (!response.ok) throw Error((await response.json()).error); }
      setRecords(old => old.filter(r => r.id !== deleting.id)); setDeleting(null); setNotice("기록을 삭제했어요.");
    } catch (e) { setError(e instanceof Error ? e.message : "삭제에 실패했어요."); } finally { setBusy(false); }
  }
  async function restore(file?: File) {
    if (!file) return; setBusy(true); setError("");
    try {
      if (file.size > 100 * 1024 * 1024) throw Error("100MB 이하의 도담 JSON 백업을 선택해 주세요.");
      const data = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
      if (data.format !== "dodam-archive-v1" || !Array.isArray(data.records) || data.records.length > 500) throw Error("도담 기록실에서 내보낸 JSON 백업 파일을 선택해 주세요.");
      const items = data.records.map((r: unknown) => recordSchema.parse(r));
      for (const record of items) await save({ ...record, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
      setNotice(`${items.length}개의 기록을 새 기록으로 가져왔어요.`); setBackup(false);
    } catch (e) { setError(e instanceof Error ? e.message : "백업을 읽지 못했어요."); } finally { setBusy(false); }
  }
  return <div className="app-shell"><a className="skip-link" href="#archive-main">본문으로 이동</a>
    <aside className="sidebar"><Link href="/" className="brand"><span className="brand-icon"><BookOpen size={23}/></span><span>도담 기록실<small>DODAM ARCHIVE</small></span></Link>
      <button className="mobile-signout" aria-label="로그아웃" onClick={logout}><LogOut size={18}/></button><div className="sidebar-caption">{profile.institution || "아이의 오늘, 선생님의 시선"}</div><div className="nav-label">나의 기록장</div>
      <nav aria-label="기록 종류">{categories.map((c, i) => { const Icon = icons[i]; return <button key={c.id} className={`nav-item ${category === c.id ? "active" : ""}`} aria-current={category === c.id ? "page" : undefined} onClick={() => { setCategory(c.id); setQuery(""); setStarOnly(false); setDetailOpen(false); }}><Icon size={19}/><span>{c.name}</span><span className="count">{records.filter(r => r.category === c.id).length}</span></button>; })}</nav>
      <div className="sidebar-bottom"><div className="quote-card"><Leaf size={22}/><p>작은 순간이 모여<br/>큰 성장이 됩니다.</p><small>오늘은 어떤 발견을 하셨나요?</small></div><button className="help-link" onClick={() => setHelp(true)}><ShieldCheck size={16}/> 기록실 이용 안내 <ChevronRight size={15}/></button><div className="profile"><span className="profile-avatar">{teacher.name.slice(1, 2)}</span><span><strong>{teacher.name} 선생님</strong><small>{teacher.demo ? teacher.className : profile.classRole} {teacher.demo && "· 샘플"}</small></span><button title="로그아웃" aria-label="로그아웃" className="logout" onClick={logout}><LogOut size={17}/></button></div></div>
    </aside>
    <main id="archive-main" className="archive-main"><div className="topline"><span>나의 기록장 <ChevronRight size={12}/> {activeCategory.name}</span><span className="storage-status">{teacher.demo ? <Monitor size={13}/> : <Cloud size={14}/>} {teacher.demo ? "브라우저에 안전하게 저장" : cloudReady ? "나만의 클라우드 기록실" : "DB 연결 필요"}</span></div>
      <header className="page-header"><div><span className="eyebrow">COLLECTING OUR LITTLE MOMENTS</span><h1>{activeCategory.name}<span className="title-dot">.</span></h1><p>{activeCategory.description}</p></div><div className="header-actions"><button className="secondary-btn" onClick={() => setBackup(true)}><Download size={16}/><span>전체 백업</span></button><button className="primary-btn" onClick={() => setEditor("new")} disabled={loading}><Plus size={19}/>새 기록</button></div></header>
      <div className="daily-note"><span><Leaf size={16}/><strong>선생님의 기록이 아이의 성장이 돼요.</strong><span>평범한 오늘 속 특별한 순간을 남겨 보세요.</span></span><small>차곡차곡, 총 {records.length}개의 이야기</small></div>
      {error && <div role="alert" className="error page-error">{error}<button aria-label="오류 닫기" onClick={() => setError("")}><X size={16}/></button></div>}
      <div className={`archive-grid ${detailOpen ? "mobile-detail" : ""}`}><section className="record-list" aria-label="기록 목록"><div className="list-tools"><label className="search-box"><Search size={18}/><input aria-label="기록 검색" placeholder="제목, 원아명, 태그 검색" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button onClick={() => setQuery("")} aria-label="검색 지우기"><X size={14}/></button>}</label><div className="list-filter"><button className={starOnly ? "star-filter selected" : "star-filter"} aria-pressed={starOnly} onClick={() => setStarOnly(!starOnly)}><Star size={13}/>{starOnly ? "소중한 기록" : `전체 ${visible.length}`}</button><select aria-label="정렬 순서" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">최신순</option><option value="oldest">오래된순</option></select></div></div>
      <div className="record-items">{loading ? <div className="empty-list"><LoaderCircle className="spin"/>기록장을 펼치고 있어요.</div> : visible.length === 0 ? <div className="empty-list"><BookOpen/><strong>{query || starOnly ? "찾는 기록이 없어요" : "첫 번째 순간을 남겨 볼까요?"}</strong><p>{query || starOnly ? "검색어나 필터를 바꿔 보세요." : "작은 발견 하나로 시작해도 좋아요."}</p><button className="text-btn" onClick={() => query || starOnly ? (setQuery(""), setStarOnly(false)) : setEditor("new")}>{query || starOnly ? "필터 초기화" : "+ 새 기록 작성"}</button></div> : visible.map(r => <button key={r.id} className={`record-item ${r.id === current?.id ? "selected" : ""}`} onClick={() => { setSelected(r.id); setDetailOpen(true); }}><div className="record-date">{formatDate(r.date)}{r.starred && <Star size={12} fill="currentColor"/>}</div><h3>{r.title}</h3><p>{r.child || "우리 반"}<span>·</span>{r.className}</p><div className="record-excerpt">{r.description.slice(0, 65)}</div><div className="record-bottom"><span>{r.tags[0] && `# ${r.tags[0]}`}</span><span><Images size={12}/>{r.attachments.length}</span></div></button>)}</div><div className="list-footer">한 장 한 장, 소중한 우리 반 이야기</div></section>
      <article className="record-detail" aria-label="선택한 기록"><button className="mobile-back text-btn" onClick={() => setDetailOpen(false)}><ArrowLeft size={16}/>기록 목록</button>{current ? <>
        <div className="detail-top"><span className="record-kind"><span/> {activeCategory.name}</span><div className="detail-actions"><button aria-label={current.starred ? "즐겨찾기 해제" : "즐겨찾기 추가"} className={`icon-btn ${current.starred ? "is-starred" : ""}`} onClick={() => save({ ...current, starred: !current.starred }).catch(e => setError(e.message))}><Star size={18} fill={current.starred ? "currentColor" : "none"}/></button><button className="icon-btn" aria-label="기록 수정" onClick={() => setEditor(current)}><Pencil size={17}/></button><button className="icon-btn danger" aria-label="기록 삭제" onClick={() => setDeleting(current)}><Trash2 size={17}/></button></div></div>
        <div className="detail-date"><CalendarDays size={14}/>{formatDate(current.date)}</div><h2>{current.title}</h2><div className="detail-meta"><span className="mini-avatar">{current.child.slice(0, 1) || "반"}</span>{current.child || "우리 반 친구들"}<span className="meta-dot">·</span>{current.className}<span className="author">기록한 사람 <strong>{teacher.name}</strong></span></div>
        {current.attachments.length > 0 ? <div className="photo-gallery">{current.attachments.map(a => <a key={a.id} href={a.data} download={safeName(a.name)} className="photo-card"><Image unoptimized width={700} height={500} src={a.data} alt={a.generated ? "AI로 생성한 교육용 삽화" : a.name}/><span>{a.generated ? "AI 삽화" : a.name}<Download size={13}/></span></a>)}</div> : current.id === "00000000-0000-4000-8000-000000000001" ? <figure className="sample-scene"><Scene/><figcaption><span>THE LITTLE GARDEN</span>샘플 삽화 · 작은 씨앗이 자라는 시간</figcaption></figure> : null}
        <section className="detail-section"><h3><span className="section-line"/>장면의 이야기</h3><p className="prose">{current.description || "아직 장면 설명이 없어요. 기록 수정으로 이야기를 더해 보세요."}</p></section>
        <section className="detail-section"><h3><NotebookPen size={16}/>선생님의 시선</h3><div className="memo-paper"><span className="quote-mark">“</span><p className="prose">{current.memo || "이 순간에서 발견한 배움을 메모해 보세요."}</p><span className="memo-signature">{teacher.name} 선생님의 기록</span></div></section>
        <div className="tag-list">{current.tags.map((tag, index) => <button key={`${tag}-${index}`} onClick={() => setQuery(tag)}># {tag}</button>)}</div><footer className="detail-footer"><span><ShieldCheck size={14}/>{teacher.demo ? "이 브라우저의 샘플 기록" : "선생님만 볼 수 있는 기록"}</span><button className="secondary-btn" onClick={() => { download(recordText(current), `${current.date}_${safeName(current.title)}.txt`); setNotice("텍스트 다운로드를 시작했어요."); }}><Download size={15}/>텍스트 다운로드</button></footer>
      </> : <div className="empty-detail"><div className="empty-book"><BookOpen size={40}/></div><span className="eyebrow">EVERY MOMENT MATTERS</span><h2>오늘의 작은 발견을<br/>이곳에 담아 보세요.</h2><p>기록을 선택하거나 새로운 이야기를 시작하세요.</p><button className="primary-btn" disabled={loading} onClick={() => setEditor("new")}><Plus size={17}/>첫 기록 남기기</button></div>}</article></div>
      <footer className="page-footer"><span>도담 기록실</span> 아이의 오늘을, 내일의 이야기로.<Leaf size={12}/></footer>
    </main>
    {notice && <div className="toast" role="status"><Leaf size={16}/>{notice}</div>}
    {editor && <Editor record={editor === "new" ? undefined : editor} category={category} teacher={{ ...teacher, className: teacher.demo ? teacher.className : profile.classRole }} imageReady={imageReady} onClose={() => setEditor(null)} onSave={save}/>}
    {deleting && <Dialog label="기록 삭제 확인" onClose={() => !busy && setDeleting(null)} className="small-dialog"><Trash2 className="dialog-symbol"/><h2>이 기록을 삭제할까요?</h2><p>‘{deleting.title}’ 기록과 첨부 사진이 삭제됩니다. 필요한 기록은 먼저 백업해 주세요.</p><div className="dialog-actions"><button className="secondary-btn" disabled={busy} onClick={() => setDeleting(null)}>취소</button><button className="danger-btn" disabled={busy} onClick={remove}>{busy ? "삭제 중…" : "기록 삭제"}</button></div></Dialog>}
    {backup && <Dialog label="기록 전체 백업" onClose={() => !busy && setBackup(false)} className="small-dialog"><button className="dialog-close icon-btn" aria-label="닫기" onClick={() => setBackup(false)} disabled={busy}><X size={19}/></button><Download className="dialog-symbol"/><h2>소중한 기록, 따로 보관하기</h2><p>네 가지 기록장에 담긴 {records.length}개의 이야기를 한 번에 내려받으세요.</p><button className="backup-option" onClick={() => download(records.map(recordText).join("\n\n" + "═".repeat(42) + "\n\n"), "도담기록실_전체기록.txt")}><Download size={20}/><span><strong>전체 기록 텍스트</strong><small>읽기 편한 TXT 문서 · 사진 제외</small></span></button><button className="backup-option" onClick={() => download(JSON.stringify({ format: "dodam-archive-v1", exportedAt: new Date().toISOString(), records }, null, 2), "도담기록실_전체백업.json", "application/json")}><FolderHeart size={20}/><span><strong>사진 포함 전체 백업</strong><small>복원 가능한 JSON 파일</small></span></button><label className="backup-option restore"><Upload size={20}/><span><strong>{busy ? "기록을 가져오고 있어요…" : "백업 파일 가져오기"}</strong><small>기존 기록을 유지하고 새 기록으로 추가해요</small></span><input className="sr-only" type="file" accept=".json" aria-label="백업 파일 가져오기" disabled={busy} onChange={e => { void restore(e.target.files?.[0]); e.target.value = ""; }}/></label>{error && <p className="error" role="alert">{error}</p>}</Dialog>}
    {help && <Dialog label="기록실 이용 안내" onClose={() => setHelp(false)} className="small-dialog"><button className="dialog-close icon-btn" aria-label="닫기" onClick={() => setHelp(false)}><X size={19}/></button><BookOpen className="dialog-symbol"/><h2>도담 기록실 이용 안내</h2><div className="help-copy"><h3>네 가지 기록장</h3><p>사진 앨범, 관찰 기록, 성장 포트폴리오, 교재 교구를 따로 정리해요. 제목·원아명·태그로 검색할 수 있어요.</p><h3>기록은 어디에 저장되나요?</h3><p>{teacher.demo ? "샘플 교사의 기록은 이 브라우저의 IndexedDB에 저장됩니다. 두 교사의 기록은 분리되며, 브라우저 데이터를 지우면 삭제됩니다. 다른 기기에서는 동기화되지 않습니다." : "Google 계정의 기록은 계정별로 분리된 서버 데이터베이스에 저장되며, 다른 기기에서도 같은 계정으로 확인할 수 있습니다."}</p><h3>그림으로 남기는 장면</h3><p>GPT-Image 2.5 삽화를 하루 2회 생성할 수 있어요. 샘플 계정의 한도는 모든 체험 사용자가 공유합니다. 실제 아동의 개인정보는 입력하지 마세요.</p><h3>기록을 오래 보관하려면</h3><p>텍스트 다운로드로 문서를 저장하거나, 전체 백업에서 사진이 포함된 JSON 파일을 보관하세요. 백업 파일은 안전한 곳에 보관해 주세요.</p></div></Dialog>}
  </div>;
}
