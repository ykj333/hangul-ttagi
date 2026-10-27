import Image from "next/image";
import {
	ArrowRight,
	ArrowUpRight,
	BookOpenText,
	Layers3,
	MoveUpRight,
	Sparkles,
	Check,
	Compass,
} from "lucide-react";
import { domains } from "@/data/domains";
import { DomainIcon } from "./DomainIcon";
import type { DomainId, View } from "@/lib/types";
type Props = {
	readonly navigate: (view: View, id?: DomainId) => void;
	readonly completed: readonly string[];
	readonly noteCount: number;
	readonly hasIllustration: boolean;
};
export function Overview({
	navigate,
	completed,
	noteCount,
	hasIllustration,
}: Props) {
	return (
		<>
			<div className="page-heading">
				<div>
					<div className="eyebrow">LEARNING DASHBOARD</div>
					<h1>이론을 깊이, 놀이를 넓게.</h1>
					<p>
						AI 영유아 교재교구 연구 및 지도법 이론
						<span className="sub-separator">/</span>누리과정 영역별
					</p>
				</div>
				<span className="edition">
					<span className="tiny-dot" />
					교사·예비교사를 위한 학습실
				</span>
			</div>
			<section className="intro-paper" aria-labelledby="intro-title">
				<div className="intro-copy">
					<span className="overline">질문에서 시작하는 교재교구 연구</span>
					<h2 id="intro-title">
						아이의 놀이를 이해하는
						<br />
						다섯 가지 관점
					</h2>
					<p>
						발달 이론과 교재교구, 교사의 상호작용을 연결해 보세요.
						<br className="desktop-break" />
						첨부 자료를 바탕으로 구체적인 실천까지 함께 탐구합니다.
					</p>
					<button
						className="button primary"
						onClick={() => navigate("domain", "physical")}
					>
						영역별 탐구 시작하기 <ArrowRight size={17} />
					</button>
					<div className="intro-meta">
						<span>3–5세 유아 중심</span>
						<i />
						<span>유아·놀이 중심 접근</span>
					</div>
				</div>
				<div className="intro-art">
					{hasIllustration ? (
						<Image
							src="/learning-table.png"
							alt="균형 놀이, 협력 블록, 미술 재료, 그림책과 자연 탐구 도구를 연결한 수채화 드로잉"
							fill
							priority
							sizes="(max-width: 760px) 100vw, 48vw"
						/>
					) : (
						<div className="concept-words">
							몸으로 느끼고
							<br />
							함께 나누고
							<br />
							<em>스스로 발견하기.</em>
						</div>
					)}
					<span className="art-caption">다양한 교구, 하나로 이어지는 배움</span>
				</div>
			</section>
			<section className="stat-strip" aria-label="학습 자료 현황">
				<div>
					<span className="stat-icon">
						<Layers3 size={21} />
					</span>
					<strong>
						5<small>개 영역</small>
					</strong>
					<p>통합적으로 연결하는 관점</p>
				</div>
				<div>
					<span className="stat-icon">
						<BookOpenText size={21} />
					</span>
					<strong>
						13<small>개 원문</small>
					</strong>
					<p>첨부 자료 전체 수록</p>
				</div>
				<div>
					<span className="stat-icon">
						<Compass size={21} />
					</span>
					<strong>
						15<small>개 이론 해설</small>
					</strong>
					<p>개념부터 적용과 유의점까지</p>
				</div>
				<div>
					<span className="stat-icon">
						<Check size={21} />
					</span>
					<strong>
						{completed.length}
						<small>/ 20절 완료</small>
					</strong>
					<p>직접 남기는 학습 기록</p>
				</div>
			</section>
			<div className="section-title">
				<div>
					<span className="eyebrow">FIVE AREAS, CONNECTED LEARNING</span>
					<h2>어떤 영역을 탐구할까요?</h2>
				</div>
				<span className="muted">
					영역을 선택하면 상세 이론과 활동이 펼쳐집니다.
				</span>
			</div>
			<section className="domain-grid" aria-label="영역 선택">
				{domains.map((d, i) => (
					<button
						className="domain-card"
						key={d.id}
						onClick={() => navigate("domain", d.id)}
					>
						<div className="domain-card-top">
							<span
								className="domain-glyph"
								style={{ background: d.light, color: d.color }}
							>
								<DomainIcon id={d.id} size={27} />
							</span>
							<span className="domain-number">0{i + 1}</span>
						</div>
						<h3>{d.short}</h3>
						<span className="domain-english">{d.english}</span>
						<p>{d.description}</p>
						<div className="card-keywords">
							{d.keywords.slice(0, 2).map((k) => (
								<span key={k}>{k}</span>
							))}
						</div>
						<div className="domain-card-bottom">
							<span>
								{d.theories.length}개 이론 · {d.materials.length}종 교구
							</span>
							<ArrowUpRight size={19} />
						</div>
					</button>
				))}
			</section>
			<div className="overview-bottom">
				<section className="panel learning-route">
					<div className="section-title compact">
						<h2>이렇게 탐구해 보세요</h2>
						<span className="pill">THE LEARNING LOOP</span>
					</div>
					<div className="route-steps">
						{[
							{ title: "이론 이해", text: "유아가 배우는 원리 찾기" },
							{ title: "교구 탐색", text: "교육적 기능과 제작 살피기" },
							{ title: "지도 설계", text: "질문과 지원 방법 구체화" },
							{ title: "관찰·성찰", text: "배움의 과정 다시 읽기" },
						].map((s, i) => (
							<div key={s.title}>
								<span>{String(i + 1).padStart(2, "0")}</span>
								<h3>{s.title}</h3>
								<p>{s.text}</p>
								{i < 3 && <ArrowRight className="route-arrow" size={16} />}
							</div>
						))}
					</div>
					<button className="text-button" onClick={() => navigate("lab")}>
						나의 활동 설계로 연결하기 <ArrowRight size={16} />
					</button>
				</section>
				<section className="note-invitation">
					<span className="small-label">
						<Sparkles size={15} /> 생각을 남기는 습관
					</span>
					<h2>
						좋은 교구는
						<br />
						좋은 질문에서 시작됩니다.
					</h2>
					<p>
						오늘 발견한 이론과 교실의 장면을
						<br />
						연구 노트에 연결해 보세요.
					</p>
					<button className="text-button" onClick={() => navigate("notes")}>
						연구 노트 열기 <MoveUpRight size={16} />
						<span className="count-badge">{noteCount}</span>
					</button>
				</section>
			</div>
			<p className="source-footnote">
				자료 기반 해설과 활동은 교사용 재구성입니다. 원문 13개는 연구 13편을
				뜻하지 않으며, 원문 주장·서지의 검증 상태는 자료실에서 확인할 수
				있습니다.
			</p>
		</>
	);
}
