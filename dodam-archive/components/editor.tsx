"use client";
import Image from "next/image";
import { useState } from "react";
import { X, ImagePlus, Sparkles, LoaderCircle, Check } from "lucide-react";
import {
  ArchiveRecord,
  Attachment,
  Category,
  Teacher,
  categories,
  recordSchema,
  today,
} from "@/lib/records";
import { Dialog } from "./dialog";
export async function compressImage(file: Blob): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/webp", 0.8);
}
export function Editor({
  record,
  category,
  teacher,
  imageReady,
  onClose,
  onSave,
}: {
  record?: ArchiveRecord;
  category: Category;
  teacher: Teacher;
  imageReady: boolean;
  onClose: () => void;
  onSave: (record: ArchiveRecord) => Promise<void>;
}) {
  const [draft, setDraft] = useState<ArchiveRecord>(
    record || {
      id: crypto.randomUUID(),
      category,
      title: "",
      date: today(),
      child: "",
      className: teacher.className,
      description: "",
      memo: "",
      tags: [],
      attachments: [],
      starred: false,
      updatedAt: new Date().toISOString(),
    },
  );
  const [tags, setTags] = useState(draft.tags.join(", "));
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  function update<K extends keyof ArchiveRecord>(
    key: K,
    value: ArchiveRecord[K],
  ) {
    setDirty(true);
    setDraft((old) => ({ ...old, [key]: value }));
  }
  function close() {
    if (
      !busy &&
      (!dirty || window.confirm("작성 중인 내용을 저장하지 않고 닫을까요?"))
    )
      onClose();
  }
  async function upload(files: FileList | null) {
    if (!files) return;
    setBusy("upload");
    setError("");
    try {
      if (draft.attachments.length + files.length > 6)
        throw Error("사진은 6장까지 첨부할 수 있어요.");
      const items: Attachment[] = [];
      for (const file of Array.from(files)) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 5 * 1024 * 1024
        )
          throw Error("JPG, PNG, WEBP 파일을 장당 5MB 이하로 선택해 주세요.");
        items.push({
          id: crypto.randomUUID(),
          name: file.name,
          data: await compressImage(file),
        });
      }
      update("attachments", [...draft.attachments, ...items]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "사진을 불러오지 못했어요.");
    } finally {
      setBusy("");
    }
  }
  async function generate() {
    setBusy("image");
    setError("");
    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      const blob = await (await fetch(result.data)).blob();
      update("attachments", [
        ...draft.attachments,
        {
          id: crypto.randomUUID(),
          name: "AI-기록-삽화.webp",
          data: await compressImage(blob),
          generated: true,
        },
      ]);
      setPrompt("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지를 만들지 못했어요.");
    } finally {
      setBusy("");
    }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy("save");
    setError("");
    const parsed = recordSchema.safeParse({
      ...draft,
      tags: tags
        .split(/[,#\n]/)
        .map((t) => t.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString(),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      setBusy("");
      return;
    }
    try {
      await onSave(parsed.data);
      onClose();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "저장하지 못했어요. 다시 시도해 주세요.",
      );
    } finally {
      setBusy("");
    }
  }
  return (
    <Dialog
      label={record ? "기록 수정" : "새 기록 남기기"}
      onClose={close}
      className="editor-dialog"
    >
      <form onSubmit={submit}>
        <header className="modal-header">
          <div>
            <span className="eyebrow">A LITTLE MOMENT TO KEEP</span>
            <h2>{record ? "기록 다듬기" : "새로운 순간 남기기"}</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="닫기"
            onClick={close}
            disabled={!!busy}
          >
            <X size={21} />
          </button>
        </header>
        <div className="form-content">
          <div className="form-row">
            <label>
              기록 종류
              <select
                value={draft.category}
                onChange={(e) => update("category", e.target.value as Category)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              기록 날짜
              <input
                type="date"
                required
                value={draft.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </label>
          </div>
          <label>
            제목 <span className="required">*</span>
            <input
              autoFocus
              required
              maxLength={100}
              placeholder="어떤 순간을 기억하고 싶으세요?"
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </label>
          <div className="form-row">
            <label>
              원아명
              <input
                maxLength={60}
                placeholder="전체 또는 원아명"
                value={draft.child}
                onChange={(e) => update("child", e.target.value)}
              />
            </label>
            <label>
              반 이름
              <input
                maxLength={60}
                value={draft.className}
                onChange={(e) => update("className", e.target.value)}
              />
            </label>
          </div>
          <label>
            장면 설명
            <textarea
              rows={4}
              maxLength={12000}
              placeholder="아이의 말과 행동, 그날의 장면을 적어 주세요."
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </label>
          <label>
            교사 메모
            <textarea
              rows={3}
              maxLength={12000}
              placeholder="발견한 배움과 다음 놀이에 대한 생각을 남겨요."
              value={draft.memo}
              onChange={(e) => update("memo", e.target.value)}
            />
          </label>
          <label>
            태그
            <input
              value={tags}
              onChange={(e) => {
                setDirty(true);
                setTags(e.target.value);
              }}
              placeholder="자연탐구, 함께자라요 (쉼표로 구분)"
            />
          </label>
          <div className="attachment-heading">
            <strong>사진 첨부</strong>
            <span>최대 6장 · JPG, PNG, WEBP · 장당 5MB</span>
          </div>
          <label className="upload-zone">
            <ImagePlus size={25} />
            <span>
              {busy === "upload"
                ? "사진을 준비하고 있어요…"
                : "사진을 선택해 순간을 더 생생하게"}
            </span>
            <input
              className="sr-only"
              type="file"
              aria-label="사진 선택"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={!!busy}
              onChange={(e) => {
                void upload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          {draft.attachments.length > 0 && (
            <div className="attachment-previews">
              {draft.attachments.map((a) => (
                <div key={a.id}>
                  <Image
                    unoptimized
                    width={90}
                    height={80}
                    src={a.data}
                    alt={a.name}
                  />
                  <button
                    type="button"
                    aria-label={`${a.name} 첨부 취소`}
                    onClick={() =>
                      update(
                        "attachments",
                        draft.attachments.filter((item) => item.id !== a.id),
                      )
                    }
                    disabled={!!busy}
                  >
                    <X size={14} />
                  </button>
                  {a.generated && <small>AI 삽화</small>}
                </div>
              ))}
            </div>
          )}
          <details className="image-generator">
            <summary>
              <Sparkles size={17} /> AI로 장면 그리기{" "}
              <span>GPT-Image 2.5 · 하루 2회</span>
            </summary>
            <p>
              실제 이름이나 개인정보 없이 장면만 설명해 주세요. 샘플 계정은 하루
              2회를 함께 사용해요.
            </p>
            <textarea
              aria-label="삽화 설명"
              rows={2}
              maxLength={1500}
              placeholder="작은 화분에 씨앗을 심는 아이들, 따뜻한 수채화"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="secondary-btn"
              type="button"
              onClick={generate}
              disabled={
                !imageReady ||
                !!busy ||
                prompt.trim().length < 5 ||
                draft.attachments.length >= 6
              }
            >
              {busy === "image" ? (
                <LoaderCircle className="spin" size={16} />
              ) : (
                <Sparkles size={16} />
              )}{" "}
              {busy === "image" ? "장면을 그리고 있어요…" : "삽화 생성"}
            </button>
            {!imageReady && <p>관리자가 이미지 서비스 연결을 준비 중이에요.</p>}
          </details>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </div>
        <footer className="modal-footer">
          <span>오늘의 순간을 차곡차곡.</span>
          <button
            className="secondary-btn"
            type="button"
            disabled={!!busy}
            onClick={close}
          >
            취소
          </button>
          <button className="primary-btn" disabled={!!busy}>
            {busy === "save" ? (
              <LoaderCircle size={17} className="spin" />
            ) : (
              <Check size={17} />
            )}
            기록 저장
          </button>
        </footer>
      </form>
    </Dialog>
  );
}
