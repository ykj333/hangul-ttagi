"use client";

import { Lightbulb, Quote, ShieldCheck, ChevronDown } from "lucide-react";
import type { Domain } from "@/lib/types";
export function TheoryContent({ domain: d }: { readonly domain: Domain }) {
	return (
		<>
			<div className="section-title">
				<div>
					<span className="eyebrow">FROM THEORY TO PRACTICE</span>
					<h2>이론을 교실의 언어로 읽기</h2>
				</div>
				<span className="pill">첨부 자료 기반 편집 해설</span>
			</div>
			<div className="theory-list">
				{d.theories.map((t, i) => (
					<article className="panel theory-panel" key={t.title}>
						<div className="theory-title">
							<span className="theory-number" style={{ color: d.color }}>
								0{i + 1}
							</span>
							<div>
								<span className="small-label">{t.author}</span>
								<h3>{t.title}</h3>
							</div>
						</div>
						<p className="concept-text">{t.concept}</p>
						<div className="theory-columns">
							<div>
								<h4>
									<Lightbulb size={16} />
									교구와 지도에 주는 시사점
								</h4>
								<p>{t.implication}</p>
							</div>
							<div className="example-box">
								<h4>
									<Quote size={16} />
									교실에서 이렇게
								</h4>
								<p>{t.example}</p>
							</div>
						</div>
						<details className="caution-detail">
							<summary>
								<ShieldCheck size={15} />
								해석할 때 유의할 점<ChevronDown size={15} />
							</summary>
							<p>{t.caution}</p>
						</details>
					</article>
				))}
			</div>
		</>
	);
}
