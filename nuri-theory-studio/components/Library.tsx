"use client";
import { useState } from "react";
import {
	Search,
	ArrowUpRight,
	FileText,
	ShieldCheck,
	ExternalLink,
	RotateCcw,
} from "lucide-react";
import { z } from "zod";
import { domains, curriculumUrl } from "@/data/domains";
import type { SourceMeta } from "@/lib/types";
type Result = { readonly id: string; readonly snippet: string };
const resultSchema = z.object({
	sources: z.array(z.object({ id: z.string(), snippet: z.string() })),
});
type Props = {
	readonly sources: readonly SourceMeta[];
	readonly openSource: (source: SourceMeta) => void;
};
export function Library({ sources, openSource }: Props) {
	const [query, setQuery] = useState("");
	const [domain, setDomain] = useState("all");
	const [results, setResults] = useState<readonly Result[] | null>(null);
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);
	const shown = sources.filter(
		(s) =>
			(domain === "all" || s.domain === domain) &&
			(results === null || results.some((r) => r.id === s.id)),
	);
	async function search() {
		setLoading(true);
		setStatus("");
		try {
			const response = await fetch(
				`/api/sources?q=${encodeURIComponent(query)}&domain=${domain}`,
				{ signal: AbortSignal.timeout(20000) },
			);
			if (!response.ok)
				throw new Error("원문 검색에 실패했습니다. 잠시 후 다시 시도하세요.");
			const data = resultSchema.parse(await response.json());
			setResults(data.sources);
			setStatus(`${data.sources.length}개 문서에서 검색어를 찾았습니다.`);
		} catch (error) {
			setStatus(
				error instanceof Error ? error.message : "검색을 완료하지 못했습니다.",
			);
		} finally {
			setLoading(false);
		}
	}
	return (
		<>
			<div className="page-heading">
				<div>
					<div className="eyebrow">SOURCE LIBRARY</div>
					<h1>해설의 출발점, 원문 자료실.</h1>
					<p>
						AI Theory 하위 폴더의 Markdown 13개를 내용 변경 없이 수록했습니다.
					</p>
				</div>
				<span className="edition">13 DOCUMENTS · 5 AREAS</span>
			</div>
			<section className="academic-note">
				<ShieldCheck size={23} />
				<div>
					<strong>원문 보존과 비판적 읽기를 함께</strong>
					<p>
						원문은 첨부 자료이며, 개별 논문을 독립적으로 검증한 데이터베이스가
						아닙니다. 예술경험 자료에는 중복 내용이 있고, 일부 효과 수치·서지는
						확인이 필요합니다. 문서 수를 독립 연구 수나 근거 강도로 해석하지
						않습니다.
					</p>
				</div>
			</section>
			<form
				className="library-search"
				onSubmit={(e) => {
					e.preventDefault();
					void search();
				}}
			>
				<label className="search-field">
					<Search size={19} />
					<span className="sr-only">원문 전체 검색어</span>
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						maxLength={120}
						placeholder="전체 원문에서 이론, 교구, 연구 키워드 검색"
					/>
				</label>
				<label>
					<span className="sr-only">자료 영역 필터</span>
					<select
						value={domain}
						onChange={(e) => {
							setDomain(e.target.value);
							setResults(null);
							setStatus("");
						}}
					>
						<option value="all">모든 영역</option>
						{domains.map((d) => (
							<option key={d.id} value={d.id}>
								{d.short}
							</option>
						))}
					</select>
				</label>
				<button className="button primary" type="submit" disabled={loading}>
					{loading ? "검색 중…" : "원문 검색"}
				</button>
				<button
					className="icon-button"
					type="button"
					aria-label="검색 초기화"
					onClick={() => {
						setQuery("");
						setDomain("all");
						setResults(null);
						setStatus("");
					}}
				>
					<RotateCcw size={19} />
				</button>
			</form>
			<div className="section-title compact">
				<h2>
					첨부 자료 <span className="muted">{shown.length}</span>
				</h2>
				<span className="muted" role="status">
					{status || "검색어가 포함된 원문 본문까지 탐색합니다."}
				</span>
			</div>
			<div className="source-list">
				{shown.map((s) => {
					const d = domains.find((d) => d.id === s.domain);
					const snippet = results?.find((r) => r.id === s.id)?.snippet;
					return (
						<button
							className="source-row"
							key={s.id}
							onClick={() => openSource(s)}
						>
							<span
								className="source-file"
								style={{ background: d?.light, color: d?.color }}
							>
								<FileText size={23} />
							</span>
							<span className="source-info">
								<span className="source-tags">
									<span style={{ color: d?.color }}>{d?.short}</span>
									<i /> {s.kind === "ai" ? "AI 교재교구" : "일반 교재교구"}
									<i />
									{Math.round(s.bytes / 1024)} KB
								</span>
								<strong>{s.filename.replace(".md", "")}</strong>
								<small>
									{s.headings.length}개 제목 · 원문 전체 읽기 · Markdown
									다운로드
								</small>
								{snippet && <span className="search-snippet">…{snippet}…</span>}
							</span>
							<ArrowUpRight size={19} />
						</button>
					);
				})}
			</div>
			{shown.length === 0 && (
				<div className="empty-state">
					<Search size={30} />
					<h3>일치하는 자료가 없습니다.</h3>
					<p>다른 키워드를 입력하거나 영역 필터를 바꾸어 보세요.</p>
				</div>
			)}
			<details className="panel editorial-notes">
				<summary>
					자료를 읽기 전에: 편집·검증 메모 <span>6개 항목</span>
				</summary>
				<ol>
					<li>
						사회관계 AI 자료와 자연탐구 AI 자료의 일부 문장은 3~5세를 구체적
						조작기로 설명합니다. 편집 해설에서는 전조작기와 구체적 경험의
						중요성을 구분했습니다.
					</li>
					<li>
						일부 문서의 “219·292·227편 분석”은 검색식·선정 흐름·전체 포함 문헌이
						확인되지 않아 연구 규모 통계로 재사용하지 않았습니다.
					</li>
					<li>
						“90.55% 효과성”, “38% 향상” 등은 지표와 맥락이 불충분하여 앱 해설의
						효과 수치로 사용하지 않았습니다.
					</li>
					<li>
						의사소통 AI 문서의 일부 참고문헌은 저자·연도·학술지 정보가
						불완전합니다. 자연탐구 일반 문서에는 예술경험 참고문헌 혼입이
						있습니다.
					</li>
					<li>
						학술적 개념의 설명과 교수 설계 예시는 첨부 자료를 교사용으로
						재구성한 것입니다. 특정 프로그램의 효과를 검증했다는 뜻은 아닙니다.
					</li>
					<li>
						자료의 중심 대상은 3~5세입니다. 0~2세 영아에게 같은 교구·활동을
						그대로 적용하는 지침이 아닙니다.
					</li>
				</ol>
			</details>
			<section className="panel official-sources">
				<h3>편집 대조에 사용한 공식 자료</h3>
				<a href={curriculumUrl} target="_blank" rel="noreferrer">
					2019 개정 누리과정 고시문 · i-누리 <ExternalLink size={15} />
				</a>
				<a
					href="https://www.naeyc.org/resources/position-statements/dap/core-considerations"
					target="_blank"
					rel="noreferrer"
				>
					NAEYC · DAP의 공통성·개별성·맥락 <ExternalLink size={15} />
				</a>
				<p className="muted">
					공식 자료는 교육과정 구조와 DAP의 해석을 대조하는 데 사용했습니다.
					첨부 자료의 개별 효과 연구를 모두 검증했다는 뜻은 아닙니다.
				</p>
			</section>
		</>
	);
}
