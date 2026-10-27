import { Timer, UsersRound } from "lucide-react";
import type { Domain, Activity } from "@/lib/types";
type Props = {
	readonly domain: Domain;
	readonly activity: Activity;
	readonly age: string;
	readonly group: string;
	readonly minutes: number;
	readonly intro: number;
	readonly explore: number;
	readonly reflect: number;
	readonly supportLabel: string;
	readonly supportAdvice: string;
	readonly ageAdvice: string;
	readonly adapt: string;
};
export function LessonCanvas({
	domain: d,
	activity,
	age,
	group,
	minutes,
	intro,
	explore,
	reflect,
	supportLabel,
	supportAdvice,
	ageAdvice,
	adapt,
}: Props) {
	return (
		<>
			<div className="plan-heading">
				<span className="small-label">02 · LIVE LESSON CANVAS</span>
				<span className="pill">편집 가능한 현장 초안</span>
			</div>
			<div className="plan-title">
				<span style={{ color: d.color }}>{d.short}</span>
				<h2>{activity.title}</h2>
				<p>{activity.goal}</p>
			</div>
			<div className="plan-metadata">
				<span>
					<UsersRound size={16} />만 {age}세 · {group}
				</span>
				<span>
					<Timer size={16} />
					{minutes}분
				</span>
			</div>
			<div className="time-allocation">
				<div style={{ flex: intro }}>
					<b>{intro}분</b>
					<span>도입</span>
				</div>
				<div style={{ flex: explore }}>
					<b>{explore}분</b>
					<span>탐구·놀이</span>
				</div>
				<div style={{ flex: reflect }}>
					<b>{reflect}분</b>
					<span>성찰</span>
				</div>
			</div>
			<p className="muted small">
				시간 배분은 예시이며 유아의 놀이 흐름에 맞게 조정합니다.
			</p>
			<h3>준비하는 재료</h3>
			<p>{activity.materials}</p>
			<h3>놀이의 흐름</h3>
			<ol className="plan-steps">
				{activity.steps.map((s, i) => (
					<li key={s}>
						<span>{i + 1}</span>
						{s}
					</li>
				))}
			</ol>
			<div className="adaptation-box">
				<span className="small-label">현재 조건에 따른 지원</span>
				<h3>{supportLabel}</h3>
				<p>{supportAdvice}</p>
				<p>{ageAdvice}</p>
				{adapt && (
					<p>
						<strong>현장 조정 · </strong>
						{adapt}
					</p>
				)}
			</div>
			<h3>관찰의 초점</h3>
			<p>{activity.observe}</p>
		</>
	);
}
