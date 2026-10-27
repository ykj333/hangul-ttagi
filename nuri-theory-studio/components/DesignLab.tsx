"use client";
import { useState } from "react";
import { FlaskConical, ArrowRight, Download, Save, Check } from "lucide-react";
import { ReadinessChecklist } from "./ReadinessChecklist";
import { LessonCanvas } from "./LessonCanvas";
import { domains } from "@/data/domains";
import { downloadFile, useNotebook } from "@/lib/storage";
import type { DomainId, SourceMeta } from "@/lib/types";
type Props = {
	readonly initialDomain: DomainId;
	readonly sources: readonly SourceMeta[];
	readonly openNotes: () => void;
};
export function DesignLab({ initialDomain, sources, openNotes }: Props) {
	const [domainId, setDomainId] = useState<string>(initialDomain);
	const [activityIndex, setActivityIndex] = useState(0);
	const [age, setAge] = useState("4");
	const [group, setGroup] = useState("소집단 4~6명");
	const [minutes, setMinutes] = useState(20);
	const [support, setSupport] = useState(1);
	const [aiRole, setAiRole] = useState("실물·사람 중심");
	const [adapt, setAdapt] = useState("");
	const [checks, setChecks] = useState<readonly number[]>([]);
	const [status, setStatus] = useState("");
	const { notebook, save } = useNotebook();
	const d = domains.find((d) => d.id === domainId) ?? domains[0];
	const activity = d.activities[activityIndex] ?? d.activities[0];
	const supportLabels = [
		"자율적인 탐색",
		"질문과 언어 단서",
		"시범과 함께 시도",
		"필요한 신체·접근 지원",
	];
	const ageAdvice =
		age === "3"
			? "선택지를 줄이고 큰 실물 자료와 한 단계 지시를 제공합니다. 말뿐 아니라 몸짓·가리키기를 응답으로 인정합니다."
			: age === "4"
				? "두 가지 방법을 비교하고 선택 이유를 말·그림으로 표현하도록 돕습니다. 또래와 역할을 나눌 기회를 제공합니다."
				: "유아가 탐구 기준·역할·표현 방식을 제안하고 수정하도록 합니다. 계획과 실제 경험을 비교하는 대화를 확장합니다.";
	const supportAdvice = [
		"교사는 가까이에서 관찰하고 유아가 요청할 때 반응합니다. 스스로 선택하거나 쉬는 시간을 보장합니다.",
		"“어떤 방법이 있을까?”와 같은 짧은 질문을 제시하고 충분히 기다립니다. 답을 대신 말하지 않습니다.",
		"교사가 한 가지 방법을 짧게 보여 준 뒤 함께 시도합니다. 익숙해지면 시범과 언어 도움을 차례로 줄입니다.",
		"유아의 의사를 먼저 확인하고 자세·도구·공간을 조정합니다. 필요한 접근 지원을 제공하면서 선택권을 유지합니다.",
	][support];
	const intro = Math.max(2, Math.round(minutes * 0.2));
	const reflect = Math.max(2, Math.round(minutes * 0.2));
	const explore = minutes - intro - reflect;
	const provenance = sources
		.filter((s) => s.domain === d.id)
		.map((s) => `- ${s.filename}`)
		.join("\n");
	const plan = `# ${d.short} · ${activity.title}\n\n첨부 자료 기반 교수 설계 예시 / 현장 적용 전 교사 검토 필요\n\n## 기본 조건\n- 대상: 만 ${age}세 중심 (3~5세 내 개별화 예시)\n- 집단: ${group}\n- 총 시간: ${minutes}분 (도입 ${intro} / 탐구 ${explore} / 성찰 ${reflect}, 조정 가능한 예시)\n- 내용범주: ${activity.category}\n- 기술 활용: ${aiRole}\n\n## 목표와 재료\n${activity.goal}\n\n${activity.materials}\n\n## 이론적 연결\n${d.theories[0].title}: ${d.theories[0].implication}\n\n## 놀이와 지도\n${activity.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n## 교사의 질문\n${activity.questions.map((s) => `- ${s}`).join("\n")}\n\n## 개별화\n${ageAdvice}\n\n${supportLabels[support]}: ${supportAdvice}\n\n현장 조정: ${adapt || "교실 환경과 개별 유아의 관심·요구를 관찰하여 보완합니다."}\n\n## 관찰과 다음 지원\n${activity.observe}\n\n${activity.extend}\n\n## 실행 전 확인\n${["재료·공간의 안전과 접근성", "유아의 선택·거절·휴식 가능성", "개인정보·외부 전송 여부", "관찰·해석·다음 지원의 구분"].map((s, i) => `- [${checks.includes(i) ? "x" : " "}] ${s}`).join("\n")}\n\n## 근거 자료\n${provenance}\n\n편집 해설과 활동은 원문을 바탕으로 재구성했으며, 효과를 검증한 프로그램이나 발달 진단이 아닙니다. AI 자료를 활용하면 교사가 출력·편향·연령 적합성을 사전 검토합니다.\n`;
	function savePlan() {
		const ok = save({
			...notebook,
			plans: {
				...notebook.plans,
				[`${d.short} · ${activity.title} · ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`]:
					plan,
			},
		});
		setStatus(
			ok
				? "설계안을 이 브라우저의 연구 노트에 저장했습니다."
				: "저장 공간을 사용할 수 없습니다. 설계안을 내려받아 보관해 주세요.",
		);
	}
	return (
		<>
			<div className="page-heading">
				<div>
					<div className="eyebrow">MATERIAL DESIGN LAB</div>
					<h1>이론을 나의 활동으로.</h1>
					<p>
						조건을 바꾸며 지도 방법을 구체화하고, 교실에 맞는 설계안을 만들어
						보세요.
					</p>
				</div>
				<span className="edition">
					<FlaskConical size={16} />
					규칙 기반 설계 시뮬레이션
				</span>
			</div>
			<div className="lab-layout">
				<section className="panel lab-controls">
					<span className="small-label">01 · CONTEXT</span>
					<h2>우리 교실의 조건</h2>
					<label>
						누리과정 영역
						<select
							value={domainId}
							onChange={(e) => {
								setDomainId(e.target.value);
								setActivityIndex(0);
								setStatus("");
							}}
						>
							{domains.map((d) => (
								<option value={d.id} key={d.id}>
									{d.name}
								</option>
							))}
						</select>
					</label>
					<label>
						탐구 활동
						<select
							value={activityIndex}
							onChange={(e) => setActivityIndex(Number(e.target.value))}
						>
							{d.activities.map((a, i) => (
								<option key={a.title} value={i}>
									{a.title}
								</option>
							))}
						</select>
					</label>
					<div className="form-pair">
						<label>
							대상 연령
							<select value={age} onChange={(e) => setAge(e.target.value)}>
								<option value="3">만 3세 중심</option>
								<option value="4">만 4세 중심</option>
								<option value="5">만 5세 중심</option>
							</select>
						</label>
						<label>
							참여 형태
							<select value={group} onChange={(e) => setGroup(e.target.value)}>
								<option>개별·일대일</option>
								<option>짝 활동 2명</option>
								<option>소집단 4~6명</option>
							</select>
						</label>
					</div>
					<label>
						활동 시간 <strong className="range-value">{minutes}분</strong>
						<input
							aria-label="활동 시간"
							type="range"
							min={10}
							max={40}
							step={5}
							value={minutes}
							onChange={(e) => setMinutes(Number(e.target.value))}
						/>
					</label>
					<label>
						교사의 지원 수준{" "}
						<strong className="range-value">{support + 1}단계</strong>
						<input
							aria-label="교사의 지원 수준"
							type="range"
							min={0}
							max={3}
							value={support}
							onChange={(e) => setSupport(Number(e.target.value))}
						/>
						<small>{supportLabels[support]}</small>
					</label>
					<label>
						AI 활용 위치
						<select value={aiRole} onChange={(e) => setAiRole(e.target.value)}>
							<option>실물·사람 중심</option>
							<option>교사 사전 자료 제작 보조</option>
							<option>교사 중재 하의 비교 자료</option>
						</select>
					</label>
					<label>
						우리 교실에 맞춘 조정
						<textarea
							rows={4}
							maxLength={2000}
							value={adapt}
							onChange={(e) => setAdapt(e.target.value)}
							placeholder="예: 큰 그림 카드, 조용한 참여 자리, 다양한 가정 언어…"
						/>
					</label>
					<p className="muted small">
						연령·시간·지원에 따른 문구를 조합하는 설계 도구입니다. 실시간 AI
						생성이나 발달 평가를 수행하지 않습니다.
					</p>
				</section>
				<section className="panel plan-preview" aria-label="활동 설계 미리보기">
					<LessonCanvas
						domain={d}
						activity={activity}
						age={age}
						group={group}
						minutes={minutes}
						intro={intro}
						explore={explore}
						reflect={reflect}
						supportLabel={supportLabels[support]}
						supportAdvice={supportAdvice}
						ageAdvice={ageAdvice}
						adapt={adapt}
					/>
					<ReadinessChecklist
						checks={checks}
						toggle={(index) =>
							setChecks(
								checks.includes(index)
									? checks.filter((n) => n !== index)
									: [...checks, index],
							)
						}
					/>
					<div className="plan-actions">
						<button className="button primary" onClick={savePlan}>
							<Save size={17} />
							연구 노트에 저장
						</button>
						<button
							className="button secondary"
							onClick={() => {
								downloadFile(`${d.short}-활동설계.md`, plan);
								setStatus("Markdown 설계안 다운로드를 시작했습니다.");
							}}
						>
							<Download size={17} />
							설계안 다운로드
						</button>
					</div>
					<div role="status" className="save-status">
						{status && (
							<>
								<Check size={16} />
								{status}
							</>
						)}
					</div>
					{status.includes("저장했습니다") && (
						<button className="text-button" onClick={openNotes}>
							저장한 설계안 보기 <ArrowRight size={16} />
						</button>
					)}
				</section>
			</div>
		</>
	);
}
