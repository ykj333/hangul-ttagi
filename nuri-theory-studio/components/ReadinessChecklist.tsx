import { ShieldCheck } from "lucide-react";
type Props = {
	readonly checks: readonly number[];
	readonly toggle: (index: number) => void;
};
export function ReadinessChecklist({ checks, toggle }: Props) {
	return (
		<fieldset className="safety-checks">
			<legend>
				<ShieldCheck size={17} />
				실행 전 교사 확인
			</legend>
			{[
				"재료·공간의 안전과 접근성을 점검했어요.",
				"유아의 선택·거절·휴식 기회를 마련했어요.",
				"개인정보와 외부 전송 여부를 확인했어요.",
				"관찰 사실과 해석을 구분해 기록할 준비가 됐어요.",
			].map((text, index) => (
				<label key={text}>
					<input
						type="checkbox"
						checked={checks.includes(index)}
						onChange={() => toggle(index)}
					/>
					{text}
				</label>
			))}
		</fieldset>
	);
}
