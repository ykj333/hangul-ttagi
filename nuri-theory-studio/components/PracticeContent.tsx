"use client";

import { Quote, ScanEye } from "lucide-react";
import type { Domain } from "@/lib/types";
export function PracticeContent({ domain: d }: { readonly domain: Domain }) {
	return (
		<>
			<div className="section-title">
				<div>
					<span className="eyebrow">TEACHING & SCAFFOLDING</span>
					<h2>놀이의 흐름에 맞춰 지원하기</h2>
				</div>
				<span className="pill">교수 설계 예시 · 효과 검증 프로그램 아님</span>
			</div>
			{d.activities.map((a, i) => (
				<article className="panel activity-panel" key={a.title}>
					<div className="activity-heading">
						<span className="small-label">
							활동 0{i + 1} · {a.category}
						</span>
						<h3>{a.title}</h3>
						<p>{a.goal}</p>
						<div className="materials-line">
							<strong>준비</strong>
							{a.materials}
						</div>
					</div>
					<ol className="activity-steps">
						{a.steps.map((step, j) => (
							<li key={step}>
								<span>{j + 1}</span>
								<p>{step}</p>
							</li>
						))}
					</ol>
					<div className="activity-support">
						<div>
							<h4>
								<Quote size={16} />
								교사의 열린 질문
							</h4>
							{a.questions.map((q) => (
								<blockquote key={q}>“{q}”</blockquote>
							))}
						</div>
						<div>
							<h4>
								<ScanEye size={16} />
								관찰의 초점
							</h4>
							<p>{a.observe}</p>
						</div>
					</div>
					<p className="extension">
						<strong>확장·개별화</strong>
						{a.extend}
					</p>
				</article>
			))}
		</>
	);
}
