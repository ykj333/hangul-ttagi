"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import type { Domain } from "@/lib/types";
export function MaterialContent({
	domain: d,
	openLab,
}: {
	readonly domain: Domain;
	readonly openLab: () => void;
}) {
	return (
		<>
			<div className="section-title">
				<div>
					<span className="eyebrow">MATERIALS & AFFORDANCES</span>
					<h2>교구의 모양보다 교육적 기능을</h2>
				</div>
				<button className="button secondary" onClick={openLab}>
					교구 설계하기 <ArrowRight size={16} />
				</button>
			</div>
			<div className="material-grid">
				{d.materials.map((m, i) => (
					<article className="panel material-panel" key={m.name}>
						<span className="small-label">
							MATERIAL 0{i + 1} · {m.type}
						</span>
						<h3>{m.name}</h3>
						<p className="concept-text">{m.mechanism}</p>
						<h4>제작·환경 구성</h4>
						<p>{m.making}</p>
						<h4>AI와 연결하는 방법</h4>
						<p>{m.ai}</p>
						<div className="callout">
							<ShieldCheck size={18} />
							<p>{m.caution}</p>
						</div>
					</article>
				))}
			</div>
			<div className="academic-note">
				<strong>기술을 선택하기 전에</strong>
				<p>
					실물 조작·또래 협력·교사 상호작용이라는 교육적 목표를 먼저 정합니다.
					AI 없이 같은 목표를 달성할 수 있는 대안도 마련하고, 기술은 필요한
					부분을 확장하는 데 사용합니다.
				</p>
			</div>
		</>
	);
}
