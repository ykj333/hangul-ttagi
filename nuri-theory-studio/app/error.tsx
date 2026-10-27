"use client";
export default function ErrorPage({ reset }: { readonly reset: () => void }) {
	return (
		<main className="empty-state">
			<h1>학습 화면을 불러오지 못했습니다.</h1>
			<p>
				잠시 후 다시 시도해 주세요. 브라우저에 저장한 연구 노트는 유지됩니다.
			</p>
			<button className="button primary" onClick={reset}>
				다시 시도하기
			</button>
		</main>
	);
}
