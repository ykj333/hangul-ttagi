"use client";
import { useState } from "react";
import { Download, NotebookPen, Trash2, Check } from "lucide-react";
import { domains } from "@/data/domains";
import { downloadFile, useNotebook } from "@/lib/storage";
import type { DomainId } from "@/lib/types";
export function ResearchNotes({
	initialDomain,
}: {
	readonly initialDomain: DomainId;
}) {
	const [selected, setSelected] = useState<string>(initialDomain);
	const [status, setStatus] = useState("");
	const [drafts, setDrafts] = useState<Record<string, string>>({});
	const { notebook, save } = useNotebook();
	const domain = domains.find((d) => d.id === selected) ?? domains[0];
	const note = drafts[selected] ?? notebook.notes[selected] ?? "";
	function update(value: string) {
		setDrafts({ ...drafts, [selected]: value });
		const ok = save({
			...notebook,
			notes: { ...notebook.notes, [selected]: value },
		});
		setStatus(
			ok
				? "이 브라우저에 저장됨"
				: "저장할 수 없습니다. 메모를 복사하거나 다운로드해 주세요.",
		);
	}
	function exportAll() {
		const text =
			"# 나의 누리 이론 연구 노트\n\n" +
			domains
				.map(
					(d) =>
						`## ${d.name}\n\n${drafts[d.id] ?? notebook.notes[d.id] ?? "(아직 기록 없음)"}\n`,
				)
				.join("\n") +
			"\n# 저장한 활동 설계\n\n" +
			Object.entries(notebook.plans)
				.map(([name, plan]) => `## ${name}\n\n${plan}`)
				.join("\n\n---\n\n");
		downloadFile("누리-연구노트.md", text);
		setStatus("연구 노트 다운로드를 시작했습니다.");
	}
	return (
		<>
			<div className="page-heading">
				<div>
					<div className="eyebrow">MY RESEARCH NOTEBOOK</div>
					<h1>이론과 교실 사이의 기록.</h1>
					<p>
						자료를 읽으며 떠오른 질문, 관찰한 장면, 다음 지원을 연결해 보세요.
					</p>
				</div>
				<button className="button secondary" onClick={exportAll}>
					<Download size={17} />
					전체 노트 다운로드
				</button>
			</div>
			<div className="local-notice">
				<NotebookPen size={18} />
				<span>
					이 기기·브라우저에만 저장됩니다. 브라우저 데이터를 지우면 사라질 수
					있으니 다운로드로 보관하세요. 실제 아동의 이름·사진 등 식별 정보는
					기록하지 마세요.
				</span>
			</div>
			<div className="notes-layout">
				<nav className="notes-domains" aria-label="연구 노트 영역">
					{domains.map((d) => (
						<button
							className={d.id === selected ? "selected" : ""}
							key={d.id}
							aria-pressed={d.id === selected}
							onClick={() => {
								setSelected(d.id);
								setStatus("");
							}}
						>
							<span className="tiny-dot" style={{ background: d.color }} />
							{d.short}
							{notebook.notes[d.id]?.trim() && <Check size={15} />}
						</button>
					))}
				</nav>
				<section className="panel note-editor">
					<span className="small-label">REFLECTIVE JOURNAL</span>
					<h2>{domain.name}</h2>
					<div className="writing-prompts">
						<span>01 관찰한 사실</span>
						<span>02 이론으로 해석</span>
						<span>03 다음에 제공할 지원</span>
					</div>
					<label htmlFor="research-note" className="sr-only">
						{domain.short} 연구 메모
					</label>
					<textarea
						id="research-note"
						maxLength={12000}
						value={note}
						onChange={(e) => update(e.target.value)}
						placeholder={
							"오늘 읽은 이론에서 발견한 점은?\n\n교실에서 본 행동·들은 말은?\n\n어떤 다른 해석이 가능할까?\n\n다음에는 환경·질문·도움을 어떻게 바꿀까?"
						}
						rows={16}
					/>
					<div className="editor-status">
						<span role="status">
							{status || "입력하면 자동으로 저장됩니다."}
						</span>
						<span>{note.length.toLocaleString()} / 12,000자</span>
					</div>
					<button
						className="text-button"
						onClick={() =>
							downloadFile(
								`${domain.short}-연구노트.md`,
								`# ${domain.name}\n\n${note}`,
							)
						}
					>
						<Download size={16} />이 영역 노트 다운로드
					</button>
				</section>
			</div>
			<div className="section-title">
				<div>
					<span className="eyebrow">SAVED LESSON PLANS</span>
					<h2>
						내가 설계한 활동{" "}
						<span className="muted">{Object.keys(notebook.plans).length}</span>
					</h2>
				</div>
			</div>
			{Object.keys(notebook.plans).length === 0 ? (
				<div className="empty-state">
					<NotebookPen size={28} />
					<h3>아직 저장한 활동 설계안이 없습니다.</h3>
					<p>교구 설계 실험실에서 활동 조건을 조정한 뒤 저장해 보세요.</p>
				</div>
			) : (
				Object.entries(notebook.plans).map(([name, plan]) => (
					<details className="panel saved-plan" key={name}>
						<summary>{name}</summary>
						<pre>{plan}</pre>
						<div className="plan-actions">
							<button
								className="button secondary"
								onClick={() =>
									downloadFile(
										`${name.split(" · ").slice(0, 2).join("-")}.md`,
										plan,
									)
								}
							>
								<Download size={16} />
								다운로드
							</button>
							<button
								className="text-button danger"
								onClick={() => {
									const next = { ...notebook.plans };
									delete next[name];
									const ok = save({ ...notebook, plans: next });
									setStatus(
										ok
											? "선택한 설계안을 삭제했습니다."
											: "저장 공간 오류로 삭제하지 못했습니다.",
									);
								}}
							>
								<Trash2 size={15} />이 설계안 삭제
							</button>
						</div>
					</details>
				))
			)}
		</>
	);
}
