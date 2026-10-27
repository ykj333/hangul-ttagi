"use client";
import { useEffect, useId, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { X, Download, BookOpen, AlertCircle, ChevronDown } from "lucide-react";
import { z } from "zod";
import type { SourceMeta } from "@/lib/types";
const schema = z.object({ content: z.string() });
type Props = {
	readonly source: SourceMeta;
	readonly section?: string;
	readonly close: () => void;
};
export function SourceReader({ source, section, close }: Props) {
	const dialog = useRef<HTMLDialogElement>(null);
	const body = useRef<HTMLDivElement>(null);
	const id = useId();
	const [text, setText] = useState("");
	const [error, setError] = useState("");
	const [toc, setToc] = useState(false);
	useEffect(() => {
		const previous = document.activeElement;
		dialog.current?.showModal();
		return () => {
			if (previous instanceof HTMLElement) previous.focus();
		};
	}, []);
	useEffect(() => {
		const controller = new AbortController();
		async function load() {
			try {
				const res = await fetch(`/api/sources/${source.id}`, {
					signal: controller.signal,
				});
				if (!res.ok) throw new Error("원문을 불러오지 못했습니다.");
				setText(schema.parse(await res.json()).content);
			} catch (e) {
				if (e instanceof DOMException && e.name === "AbortError") return;
				setError(
					e instanceof Error ? e.message : "원문을 불러오지 못했습니다.",
				);
			}
		}
		void load();
		return () => controller.abort();
	}, [source.id]);
	useEffect(() => {
		if (!text || !section) return;
		const heading = Array.from(
			body.current?.querySelectorAll("h1,h2,h3,h4") ?? [],
		).find((el) => el.textContent?.startsWith(section));
		heading?.scrollIntoView({ block: "start" });
	}, [text, section]);
	const go = (index: number) => {
		const headings = body.current?.querySelectorAll("h1,h2,h3,h4");
		headings
			?.item(index)
			?.scrollIntoView({ behavior: "smooth", block: "start" });
		setToc(false);
	};
	return (
		<dialog
			ref={dialog}
			className="reader-dialog"
			aria-labelledby={id}
			onCancel={close}
			onClick={(e) => {
				if (e.target === e.currentTarget) close();
			}}
		>
			<div className="reader-shell">
				<header className="reader-header">
					<BookOpen size={20} />
					<div>
						<span className="small-label">첨부 원문 · 내용 변경 없이 보존</span>
						<h2 id={id}>{source.filename}</h2>
					</div>
					<a
						className="icon-button"
						href={`/api/sources/${source.id}?download=1`}
						aria-label="원문 Markdown 다운로드"
					>
						<Download size={20} />
					</a>
					<button
						className="icon-button"
						onClick={close}
						aria-label="원문 닫기"
					>
						<X size={23} />
					</button>
				</header>
				<div className="reader-warning">
					<AlertCircle size={17} />
					<span>
						일부 발달단계 표현·효과 수치·참고문헌은 확인이 필요합니다. 해설과
						원문을 구분해 읽어 주세요.
					</span>
				</div>
				<button
					className="reader-toc-toggle"
					onClick={() => setToc(!toc)}
					aria-expanded={toc}
				>
					목차 보기 <ChevronDown size={16} />
				</button>
				<div className="reader-layout">
					<nav
						className={`reader-toc ${toc ? "open" : ""}`}
						aria-label="원문 목차"
					>
						<strong>문서 목차</strong>
						{source.headings.map((h, i) => (
							<button
								key={h.id}
								style={{ paddingLeft: h.level > 2 ? 18 : 8 }}
								onClick={() => go(i)}
							>
								{h.title}
							</button>
						))}
					</nav>
					<div className="reader-content" ref={body}>
						{error ? (
							<div className="empty-state" role="alert">
								<p>{error}</p>
								<button className="button secondary" onClick={close}>
									닫고 다시 시도하기
								</button>
							</div>
						) : !text ? (
							<p role="status">원문을 불러오고 있습니다…</p>
						) : (
							<div className="markdown">
								<Markdown
									remarkPlugins={[remarkGfm]}
									rehypePlugins={[rehypeSlug]}
									components={{
										table: (props) => (
											<div className="table-scroll">
												<table {...props} />
											</div>
										),
										a: (props) => (
											<a
												{...props}
												target={
													props.href?.startsWith("#") ? undefined : "_blank"
												}
												rel="noreferrer"
											/>
										),
										img: () => (
											<span className="muted">
												[원문 외부 이미지: 텍스트 자료 중심으로 표시합니다.]
											</span>
										),
									}}
								>
									{text}
								</Markdown>
								<footer className="reader-provenance">
									<strong>파일 무결성 · SHA-256</strong>
									<code>{source.sha256}</code>
									<p>{source.relativePath}</p>
								</footer>
							</div>
						)}
					</div>
				</div>
			</div>
		</dialog>
	);
}
