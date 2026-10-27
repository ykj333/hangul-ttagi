"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import type { Domain } from "@/lib/types";
export function ObservationContent({
	domain: d,
	openNotes,
}: {
	readonly domain: Domain;
	readonly openNotes: () => void;
}) {
	const [answer, setAnswer] = useState<number | null>(null);
	return (
		<>
			<div className="section-title">
				<div>
					<span className="eyebrow">OBSERVE, INTERPRET, SUPPORT</span>
					<h2>결과보다 배움의 과정을 기록하기</h2>
				</div>
			</div>
			<section className="panel">
				<h3>관찰을 여는 세 가지 초점</h3>
				<p className="muted">
					아래 문장은 관찰의 초점입니다. 유아의 발달 수준을 진단하거나 점수로
					서열화하는 기준이 아닙니다.
				</p>
				<ul className="observation-list">
					{d.observations.map((o, i) => (
						<li key={o}>
							<span>0{i + 1}</span>
							{o}
						</li>
					))}
				</ul>
				<div className="record-flow">
					<div>
						<b>사실</b>
						<p>들은 말과 본 행동</p>
					</div>
					<ArrowRight size={18} />
					<div>
						<b>해석</b>
						<p>가능한 의미와 맥락</p>
					</div>
					<ArrowRight size={18} />
					<div>
						<b>다음 지원</b>
						<p>환경·질문·도움 조정</p>
					</div>
				</div>
				<button className="button secondary" onClick={openNotes}>
					관찰 성찰을 연구 노트에 남기기 <ArrowRight size={16} />
				</button>
			</section>
			<section className="panel case-question">
				<span className="small-label">상황으로 생각해 보기</span>
				<h3>{d.question.scenario}</h3>
				<div className="quiz-options">
					{d.question.options.map((o, i) => (
						<button
							key={o}
							className={answer === i ? "chosen" : ""}
							aria-pressed={answer === i}
							onClick={() => setAnswer(i)}
						>
							<span>{i + 1}</span>
							{o}
							{answer === i && <Check size={17} />}
						</button>
					))}
				</div>
				{answer !== null && (
					<div
						className={`answer-note ${answer === d.question.correct ? "correct" : ""}`}
						role="status"
					>
						<strong>
							{answer === d.question.correct
								? "적절한 지원을 선택했어요."
								: "다른 관점에서 다시 생각해 보세요."}
						</strong>
						<p>{d.question.explanation}</p>
					</div>
				)}
			</section>
		</>
	);
}
