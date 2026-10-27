import {
	BookOpen,
	LayoutDashboard,
	FlaskConical,
	LibraryBig,
	NotebookPen,
	ArrowUpRight,
	Leaf,
	ChevronDown,
} from "lucide-react";
import { domains, curriculumUrl } from "@/data/domains";
import { DomainIcon } from "./DomainIcon";
import type { DomainId, View } from "@/lib/types";
type Props = {
	readonly view: View;
	readonly active: DomainId;
	readonly completed: number;
	readonly navigate: (view: View, domain?: DomainId) => void;
	readonly menu: boolean;
	readonly toggleMenu: () => void;
};
export function Sidebar({
	view,
	active,
	completed,
	navigate,
	menu,
	toggleMenu,
}: Props) {
	const nav = [
		{ id: "overview", label: "학습 대시보드", Icon: LayoutDashboard },
		{ id: "lab", label: "교구 설계 실험실", Icon: FlaskConical },
		{ id: "library", label: "원문 자료실", Icon: LibraryBig },
		{ id: "notes", label: "나의 연구 노트", Icon: NotebookPen },
	] as const;
	return (
		<aside className="sidebar">
			<button
				className="brand"
				onClick={() => navigate("overview")}
				aria-label="누리 이론 연구실 홈"
			>
				<span className="brand-mark">
					<BookOpen size={25} strokeWidth={1.5} />
					<Leaf size={14} />
				</span>
				<span>
					누리 이론 연구실<small>NURI THEORY STUDIO</small>
				</span>
			</button>
			<button className="mobile-menu" onClick={toggleMenu} aria-expanded={menu}>
				학습 메뉴 <ChevronDown size={18} />
			</button>
			<div className={`sidebar-body ${menu ? "is-open" : ""}`}>
				<div className="workspace-label">
					<span className="tiny-dot" />
					교사를 위한 연구 공간
				</div>
				<nav aria-label="연구실 메뉴">
					{nav.map(({ id, label, Icon }) => (
						<button
							key={id}
							className={`nav-item ${view === id ? "active" : ""}`}
							onClick={() => navigate(id)}
							aria-current={view === id ? "page" : undefined}
						>
							<Icon size={18} />
							{label}
							{id === "library" && <span className="nav-count">13</span>}
						</button>
					))}
				</nav>
				<div className="nav-heading">
					누리과정 5개 영역 <span>05</span>
				</div>
				<nav aria-label="누리과정 영역">
					{domains.map((d) => (
						<button
							key={d.id}
							className={`nav-item domain-nav ${view === "domain" && active === d.id ? "active" : ""}`}
							onClick={() => navigate("domain", d.id)}
							aria-current={
								view === "domain" && active === d.id ? "page" : undefined
							}
						>
							<span style={{ color: d.color }}>
								<DomainIcon id={d.id} size={18} />
							</span>
							{d.short}
						</button>
					))}
				</nav>
				<div className="sidebar-bottom">
					<div className="progress-heading">
						<span>나의 학습 기록</span>
						<strong>{completed} / 20</strong>
					</div>
					<progress value={completed} max={20} aria-label="학습 완료 절 수" />
					<p>
						이해한 절을 완료로 표시하며
						<br />
						나만의 학습 여정을 남겨 보세요.
					</p>
					<a href={curriculumUrl} target="_blank" rel="noreferrer">
						2019 개정 누리과정 <ArrowUpRight size={14} />
					</a>
				</div>
				<div className="sidebar-foot">이론에서 놀이로, 놀이에서 배움으로.</div>
			</div>
		</aside>
	);
}
