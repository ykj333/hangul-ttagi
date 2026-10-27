"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Search, BookOpenText, ArrowRight, X } from "lucide-react";
import { domains } from "@/data/domains";
import { useNotebook } from "@/lib/storage";
import { Sidebar } from "./Sidebar";
import { Overview } from "./Overview";
import { DomainStudy } from "./DomainStudy";
import type { DomainId, SourceMeta, View } from "@/lib/types";
const Library = dynamic(() => import("./Library").then((m) => m.Library), {
	loading: () => <p role="status">자료실을 열고 있습니다…</p>,
});
const DesignLab = dynamic(
	() => import("./DesignLab").then((m) => m.DesignLab),
	{ loading: () => <p role="status">설계 실험실을 열고 있습니다…</p> },
);
const ResearchNotes = dynamic(
	() => import("./ResearchNotes").then((m) => m.ResearchNotes),
	{ loading: () => <p role="status">연구 노트를 열고 있습니다…</p> },
);
const SourceReader = dynamic(
	() => import("./SourceReader").then((m) => m.SourceReader),
	{
		ssr: false,
		loading: () => (
			<p className="reader-loading" role="status">
				원문을 준비하고 있습니다…
			</p>
		),
	},
);
type Props = {
	readonly sources: readonly SourceMeta[];
	readonly view: View;
	readonly active: DomainId;
	readonly hasIllustration: boolean;
};
export function Dashboard({ sources, view, active, hasIllustration }: Props) {
	const router = useRouter();
	const [menu, setMenu] = useState(false);
	const [source, setSource] = useState<{
		meta: SourceMeta;
		section?: string;
	} | null>(null);
	const [search, setSearch] = useState("");
	const [searchOpen, setSearchOpen] = useState(false);
	const [status, setStatus] = useState("");
	const main = useRef<HTMLElement>(null);
	const { notebook, save } = useNotebook();
	const domain = domains.find((d) => d.id === active) ?? domains[0];
	function navigate(next: View, id: DomainId = active) {
		router.push(`/?view=${next}&domain=${id}`, { scroll: true });
		setMenu(false);
		setSearchOpen(false);
		setStatus("");
		requestAnimationFrame(() => main.current?.focus());
	}
	const labels = {
		overview: "학습 대시보드",
		domain: domain.short,
		lab: "교구 설계 실험실",
		library: "원문 자료실",
		notes: "나의 연구 노트",
	};
	const matches = domains
		.flatMap((d) =>
			d.theories.map((t) => ({
				domain: d,
				title: t.title,
				preview: t.concept,
			})),
		)
		.filter((t) =>
			(t.title + t.preview + t.domain.name)
				.toLowerCase()
				.includes(search.toLowerCase()),
		);
	function mark(id: string) {
		const completed = notebook.completed.includes(id)
			? notebook.completed.filter((s) => s !== id)
			: [...notebook.completed, id];
		const ok = save({ ...notebook, completed });
		setStatus(
			ok
				? "학습 기록을 저장했습니다."
				: "브라우저 저장 공간을 사용할 수 없습니다.",
		);
	}
	return (
		<div className="app-shell">
			<a className="skip-link" href="#main-content">
				본문으로 바로가기
			</a>
			<Sidebar
				view={view}
				active={active}
				completed={notebook.completed.length}
				navigate={navigate}
				menu={menu}
				toggleMenu={() => setMenu(!menu)}
			/>
			<div className="main-shell">
				<header className="topbar">
					<div className="breadcrumb">
						<BookOpenText size={16} />
						<span>연구실</span>
						<span>/</span>
						<strong>{labels[view]}</strong>
					</div>
					<div className="topbar-actions">
						<button
							className="top-search"
							onClick={() => setSearchOpen(!searchOpen)}
							aria-expanded={searchOpen}
						>
							<Search size={16} />
							<span>이론 찾아보기</span>
						</button>
						<span className="researcher-avatar" aria-label="교사 연구 공간">
							연구
						</span>
					</div>
				</header>
				{searchOpen && (
					<section className="global-search" aria-label="이론 빠른 검색">
						<div className="search-title">
							<strong>어떤 이론이 궁금하세요?</strong>
							<button
								className="icon-button"
								onClick={() => setSearchOpen(false)}
								aria-label="이론 검색 닫기"
							>
								<X size={18} />
							</button>
						</div>
						<label className="search-field">
							<Search size={18} />
							<span className="sr-only">이론 검색</span>
							<input
								autoFocus
								placeholder="예: 비계, 감각, 사회정서, 문해…"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								maxLength={120}
							/>
						</label>
						<div className="quick-results">
							{matches.slice(0, 6).map((t) => (
								<button
									key={t.title}
									onClick={() => navigate("domain", t.domain.id)}
								>
									<span>
										<small style={{ color: t.domain.color }}>
											{t.domain.short}
										</small>
										{t.title}
									</span>
									<ArrowRight size={15} />
								</button>
							))}
							{matches.length === 0 && (
								<p>일치하는 이론이 없습니다. 다른 검색어를 입력해 보세요.</p>
							)}
						</div>
						<button className="text-button" onClick={() => navigate("library")}>
							13개 원문 전체에서 찾아보기 <ArrowRight size={15} />
						</button>
					</section>
				)}
				<main
					id="main-content"
					ref={main}
					tabIndex={-1}
					className="main-content"
				>
					<div key={`${view}-${active}`} className="content-enter">
						{view === "overview" && (
							<Overview
								navigate={navigate}
								completed={notebook.completed}
								noteCount={
									Object.values(notebook.notes).filter((n) => n.trim()).length
								}
								hasIllustration={hasIllustration}
							/>
						)}{" "}
						{view === "domain" && (
							<DomainStudy
								key={active}
								domain={domain}
								sources={sources}
								completed={notebook.completed}
								mark={mark}
								openSource={(meta, section) => setSource({ meta, section })}
								openLab={() => navigate("lab")}
								openNotes={() => navigate("notes")}
							/>
						)}{" "}
						{view === "library" && (
							<Library
								sources={sources}
								openSource={(meta) => setSource({ meta })}
							/>
						)}{" "}
						{view === "lab" && (
							<DesignLab
								initialDomain={active}
								sources={sources}
								openNotes={() => navigate("notes")}
							/>
						)}{" "}
						{view === "notes" && <ResearchNotes initialDomain={active} />}
					</div>
					<div className="global-status" role="status">
						{status}
					</div>
					<footer className="app-footer">
						<span>
							<span className="tiny-dot" />
							누리 이론 연구실
						</span>
						<span>원문을 읽고, 맥락을 살피고, 놀이로 연결합니다.</span>
						<span>3–5세 유아 · 교사용</span>
					</footer>
				</main>
			</div>
			{source && (
				<SourceReader
					key={source.meta.id}
					source={source.meta}
					section={source.section}
					close={() => setSource(null)}
				/>
			)}
		</div>
	);
}
