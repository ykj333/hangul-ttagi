"use client";
import { useState } from "react";
import { ArrowRight, BookOpen, Check, CheckCircle2 } from "lucide-react";
import { TheoryContent } from "./TheoryContent";
import { MaterialContent } from "./MaterialContent";
import { PracticeContent } from "./PracticeContent";
import { ObservationContent } from "./ObservationContent";
import { DomainIcon } from "./DomainIcon";
import type { Domain, SourceMeta } from "@/lib/types";
const tabs = [
	"이론과 근거",
	"교재교구 탐색",
	"지도법과 활동",
	"관찰·평가",
] as const;
type Props = {
	readonly domain: Domain;
	readonly sources: readonly SourceMeta[];
	readonly completed: readonly string[];
	readonly mark: (id: string) => void;
	readonly openSource: (source: SourceMeta, section?: string) => void;
	readonly openLab: () => void;
	readonly openNotes: () => void;
};
export function DomainStudy({
	domain: d,
	sources,
	completed,
	mark,
	openSource,
	openLab,
	openNotes,
}: Props) {
	const [tab, setTab] = useState(0);

	const source =
		sources.find((s) => s.domain === d.id && s.kind === "general") ??
		sources.find((s) => s.domain === d.id);
	const studyId = `${d.id}-${tab}`;
	return (
		<>
			<div className="domain-heading">
				<span
					className="domain-glyph large"
					style={{ background: d.light, color: d.color }}
				>
					<DomainIcon id={d.id} size={32} />
				</span>
				<div>
					<div className="eyebrow">
						DOMAIN STUDY · {d.english.toUpperCase()}
					</div>
					<h1>{d.name}</h1>
					<p>{d.description}</p>
				</div>
			</div>
			<div className="curriculum-band">
				<span>누리과정 내용범주</span>
				{d.categories.map((c, i) => (
					<span className="curriculum-item" key={c}>
						<b>0{i + 1}</b>
						{c}
					</span>
				))}
			</div>
			<div className="study-tabs" aria-label="영역 학습 내용">
				{tabs.map((t, i) => (
					<button
						key={t}
						aria-pressed={tab === i}
						className={tab === i ? "selected" : ""}
						onClick={() => setTab(i)}
					>
						<span>0{i + 1}</span>
						{t}
						{completed.includes(`${d.id}-${i}`) && <Check size={14} />}
					</button>
				))}
			</div>
			<div key={tab} className="content-enter">
				{tab === 0 && <TheoryContent domain={d} />}
				{tab === 1 && <MaterialContent domain={d} openLab={openLab} />}
				{tab === 2 && <PracticeContent domain={d} />}
				{tab === 3 && <ObservationContent domain={d} openNotes={openNotes} />}
			</div>
			<div className="study-footer">
				<div>
					<BookOpen size={18} />
					<span>
						근거 자료: {d.short} 첨부 문서{" "}
						{sources.filter((s) => s.domain === d.id).length}개
					</span>
					{source && (
						<button
							className="text-button"
							onClick={() =>
								openSource(source, tab === 0 ? "2." : tab === 1 ? "3." : "5.")
							}
						>
							관련 원문 열기 <ArrowRight size={14} />
						</button>
					)}
				</div>
				<button
					className={`button ${completed.includes(studyId) ? "secondary" : "primary"}`}
					aria-pressed={completed.includes(studyId)}
					onClick={() => mark(studyId)}
				>
					<CheckCircle2 size={17} />
					{completed.includes(studyId) ? "학습 완료 표시됨" : "이 절 학습 완료"}
				</button>
			</div>
		</>
	);
}
