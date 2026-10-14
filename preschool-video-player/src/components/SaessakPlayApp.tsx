"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { TeacherUser, VideoItem } from "@/lib/types";

const TOPICS = [
  { label: "마음·감정", dotColor: "#EB6A5A" },
  { label: "자연·관찰", dotColor: "#3B9B6D" },
  { label: "생활 습관", dotColor: "#E8A838" },
  { label: "언어·동화", dotColor: "#4F86C6" },
  { label: "신체·음악", dotColor: "#9B6B9E" },
  { label: "자연·수학", dotColor: "#2A9D8F" }
];

export default function SaessakPlayApp() {
  const [teacher, setTeacher] = useState<TeacherUser>({
    id: "teacher-yoo",
    name: "체험 교사",
    email: "demo@saessak.local",
    avatarText: "구",
    className: "새싹반",
    institutionName: "유교수의 AI 유아교육 연구실",
    authProvider: "demo"
  });
  const [presets, setPresets] = useState<TeacherUser[]>([]); const [oauthReady, setOauthReady] = useState(false);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [counts, setCounts] = useState({ myClassCount: 19, sharedCount: 22 });
  const [currentIdx, setCurrentIdx] = useState(0);

  // Navigation & Filter states
  const [navSection, setNavSection] = useState<"home" | "playlist" | "liked" | "recent">("home");
  const [curationTab, setCurationTab] = useState<"shared" | "teacher">("shared");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [scrapeTab, setScrapeTab] = useState<"direct" | "agent">("direct");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Upload Form State
  const [upTitle, setUpTitle] = useState("");
  const [upCreator, setUpCreator] = useState("");
  const [upClassName, setUpClassName] = useState("");
  const [upAgeGroup, setUpAgeGroup] = useState("만 3-5세");
  const [upCategory, setUpCategory] = useState("언어·동화");
  const [upDesc, setUpDesc] = useState("");
  const [upFileUrl, setUpFileUrl] = useState("");
  const [upFileName, setUpFileName] = useState("");
  const [upSharePublic, setUpSharePublic] = useState(false);
  const [upRightsOk, setUpRightsOk] = useState(true);

  // Scrape Form State
  const [scrapeInput, setScrapeInput] = useState(
    "아기 오리들의 소풍 이야기 | https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4 | 자연·관찰 | 00:15\n친구와 장난감을 나누어 써요 | https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4 | 생활 습관 | 00:15"
  );
  const [scrapeCategory, setScrapeCategory] = useState("언어·동화");
  const [scrapeAge, setScrapeAge] = useState("만 3-5세");
  const [scrapeSharePublic, setScrapeSharePublic] = useState(false);
  const [agentToken, setAgentToken] = useState<string>("ag_saessak_24h_token");

  // Custom Google login input
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [customGoogleClass, setCustomGoogleClass] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playlistRef = useRef<HTMLDivElement | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? "" : prev));
    }, 3200);
  }

  async function fetchSessionAndVideos(
    overrideCuration = curationTab,
    overrideTopic = selectedTopic,
    overrideSearch = searchQuery,
    overrideNav = navSection
  ) {
    try {
      const filterMode =
        overrideNav === "liked" ? "liked" : overrideNav === "recent" ? "recent" : "all";
      const params = new URLSearchParams({
        curationTab: overrideCuration,
        topic: overrideTopic,
        q: overrideSearch,
        filterMode
      });
      const sessRes = await fetch("/api/session");
      const vidRes = await fetch(`/api/videos?${params.toString()}`);
      if (sessRes.ok) {
        const sData = await sessRes.json();
        setTeacher(sData.teacher); setOauthReady(sData.googleOAuthConfigured);
        setPresets(sData.presets || []);
      }
      if (vidRes.ok) {
        const vData = await vidRes.json();
        setVideos(vData.videos || []);
        setCounts(vData.counts || { myClassCount: 0, sharedCount: 0 });
        setCurrentIdx(0);
      }
    } catch (_e) {
      // Handled gracefully
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => fetchSessionAndVideos());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curationTab, selectedTopic, searchQuery, navSection]);

  const currentVideo = useMemo(
    () => videos[currentIdx] || videos[0] || null,
    [videos, currentIdx]
  );

  // Draw animated puppet storybook scene on canvas when video is playing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentVideo) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let rafId = 0;
    const colors = currentVideo.themeColors || ["#8FB996", "#F4A261", "#E76F51"];

    const render = () => {
      frame += isPlaying ? 1 : 0;
      const w = canvas.width;
      const h = canvas.height;

      // Soft warm classroom backdrop gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#F3F4F0");
      grad.addColorStop(1, "#E5EAE4");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const bounce = Math.sin(frame * 0.05) * 8;
      const bounce2 = Math.cos(frame * 0.05) * 8;

      // Left stick puppet (Warm Plush Rabbit)
      ctx.save();
      ctx.translate(w * 0.3, h * 0.56 + bounce);
      // Stick
      ctx.fillStyle = "#B07D4F";
      ctx.fillRect(-8, 90, 16, 140);
      // Ears
      ctx.fillStyle = "#E6BA95";
      ctx.beginPath();
      ctx.ellipse(-32, -135, 18, 48, -0.1, 0, Math.PI * 2);
      ctx.ellipse(32, -135, 18, 48, 0.1, 0, Math.PI * 2);
      ctx.fill();
      // Body (Orange sweater)
      ctx.fillStyle = colors[1] || "#E07A2E";
      ctx.beginPath();
      ctx.roundRect(-68, -15, 136, 115, 42);
      ctx.fill();
      // Head
      ctx.fillStyle = "#EBC5A0";
      ctx.beginPath();
      ctx.arc(0, -65, 68, 0, Math.PI * 2);
      ctx.fill();
      // Eyes & Nose
      ctx.fillStyle = "#2B2118";
      ctx.beginPath();
      ctx.arc(-24, -75, 8, 0, Math.PI * 2);
      ctx.arc(24, -75, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#E58C8A";
      ctx.beginPath();
      ctx.arc(0, -56, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right stick puppet (Friendly Green Turtle)
      ctx.save();
      ctx.translate(w * 0.72, h * 0.54 + bounce2);
      // Stick
      ctx.fillStyle = "#B07D4F";
      ctx.fillRect(-8, 100, 16, 140);
      // Shell Belly
      ctx.fillStyle = "#E9D8A6";
      ctx.beginPath();
      ctx.roundRect(-66, -18, 132, 125, 48);
      ctx.fill();
      ctx.strokeStyle = "#588157";
      ctx.lineWidth = 8;
      ctx.stroke();
      // Head
      ctx.fillStyle = "#6A994E";
      ctx.beginPath();
      ctx.arc(0, -76, 64, 0, Math.PI * 2);
      ctx.fill();
      // Smile & Eyes
      ctx.fillStyle = "#1B2618";
      ctx.beginPath();
      ctx.arc(-22, -85, 7, 0, Math.PI * 2);
      ctx.arc(22, -85, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Subtle caption banner at bottom center
      ctx.fillStyle = "rgba(24, 36, 32, 0.72)";
      ctx.beginPath();
      ctx.roundRect(w * 0.12, h - 86, w * 0.76, 40, 20);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 15px Pretendard, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `${currentVideo.title} · ${currentVideo.className || currentVideo.creatorName}`,
        w * 0.5,
        h - 60
      );

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [currentVideo, isPlaying]);

  async function handleSelectVideo(index: number) {
    setCurrentIdx(index);
    setIsPlaying(true);
    const target = videos[index];
    if (target) {
      await fetch(`/api/videos/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "view" })
      });
    }
  }

  async function handleToggleLike() {
    if (!currentVideo) return;
    const res = await fetch(`/api/videos/${currentVideo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bookmark" })
    });
    if (res.ok) {
      const data = await res.json();
      showToast(
        data.liked
          ? "찜한 영상 목록에 저장했어요."
          : "찜한 영상 목록에서 해제했어요."
      );
      fetchSessionAndVideos();
    }
  }

  async function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: upTitle,
        creatorName: upCreator || teacher.name,
        className: upClassName || teacher.className,
        ageGroup: upAgeGroup,
        category: upCategory,
        description: upDesc,
        playbackUrl: upFileUrl,
        downloadUrl: upFileUrl,
        isSharedCuration: upSharePublic,
        rightsConfirmed: upRightsOk,
        sponsorFreeConfirmed: upRightsOk
      })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "업로드에 실패했습니다.");
      return;
    }
    setShowUploadModal(false);
    setUpTitle("");
    setUpDesc("");
    setUpFileUrl("");
    setUpFileName("");
    setCurationTab("teacher");
    showToast(
      `${teacher.name} 선생님(${teacher.authProvider === "demo" ? "체험 프로필" : teacher.email})의 우리 반 전용 DB에 영상이 등록되었어요!`
    );
    fetchSessionAndVideos("teacher");
  }

  async function handleScrapeSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceUrlOrText: scrapeInput,
        defaultCategory: scrapeCategory,
        defaultAgeGroup: scrapeAge,
        creatorName: teacher.name,
        className: teacher.className,
        isSharedCuration: scrapeSharePublic,
        rightsConfirmed: true,
        sponsorFreeConfirmed: true
      })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "스크랩 중 오류가 발생했습니다.");
      return;
    }
    setShowScrapeModal(false);
    setCurationTab("teacher");
    showToast(
      `동영상 리스트 ${data.count}개를 스크랩하여 우리 반 전용 DB(${teacher.className})에 저장했어요!`
    );
    fetchSessionAndVideos("teacher");
  }

  async function handleSwitchTeacherAccount(
    email: string,
    name?: string,
    className?: string
  ) {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, className })
    });
    if (res.ok) {
      const data = await res.json();
      setTeacher(data.teacher);
      setShowAuthModal(false);
      showToast(
        `${data.teacher.name} 선생님 (${data.teacher.email}) 체험 프로필로 전환되어 '${data.teacher.className}' 전용 DB로 전환되었습니다.`
      );
      fetchSessionAndVideos(curationTab);
    }
  }

  async function handleDeleteCurrentVideo(videoId: string) {
    const res = await fetch(`/api/videos/${videoId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "삭제할 수 없습니다.");
      return;
    }
    showToast("우리 반 DB에서 선택한 영상을 삭제했어요.");
    fetchSessionAndVideos();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F7] text-[#182420]">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1B5E4B] text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#EBEFEB] px-4 lg:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setNavSection("home");
              setSelectedTopic("");
              setSearchQuery("");
            }}
            className="flex items-center gap-2.5 text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-[#1B5E4B] text-white font-bold flex items-center justify-center text-sm">
              새
            </span>
            <span className="font-extrabold text-lg tracking-tight text-[#14201C]">
              새싹 플레이
            </span>
          </button>
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F3EE] text-[#1B5E4B]">
            {teacher.className} · {teacher.authProvider === "demo" ? "체험 · 서버 임시 저장" : "Google 인증 · 서버 임시 저장"}
          </span>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목, 주제, 크리에이터 검색"
              className="w-full h-10 pl-4 pr-10 rounded-full bg-[#F3F5F4] text-sm placeholder:text-[#8A9691] focus:outline-none focus:ring-2 focus:ring-[#1B5E4B]/30"
            />
            <span className="absolute right-3.5 text-[#6D7B75] text-sm">🔍</span>
          </div>
        </div>

        {/* Right Actions: Scrape, Upload, Google Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setScrapeTab("direct");
              setShowScrapeModal(true);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#F2F5F3] hover:bg-[#E5ECE8] text-[#1B5E4B] transition"
          >
            <span>📥</span>
            <span>동영상 스크랩</span>
          </button>
          <button
            onClick={() => {
              setUpCreator(teacher.name);
              setUpClassName(teacher.className);
              setShowUploadModal(true);
            }}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-[#D8EFE4] hover:bg-[#C5E7D7] text-[#1B5E4B] transition"
          >
            <span>+ 영상 올리기</span>
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            title={`${teacher.name} (${teacher.authProvider === "demo" ? "체험 프로필" : teacher.email}) - 클릭하여 구글 계정/학급 DB 전환`}
            className="w-9 h-9 rounded-full bg-[#F7D2C4] text-[#7A3E2E] font-bold text-sm flex items-center justify-center shadow-sm hover:ring-2 hover:ring-[#1B5E4B]/40 transition"
          >
            {teacher.avatarText}
          </button>
        </div>
      </header>

      {/* Main 3-Column Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[220px_1fr_360px]">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col justify-between bg-white border-r border-[#EBEFEB] p-4">
          <div className="space-y-6">
            <nav className="space-y-1">
              {([
                { id: "home", label: "홈", icon: "⌂" },
                { id: "playlist", label: "재생목록", icon: "▤" },
                { id: "liked", label: "찜한 영상", icon: "♡" },
                { id: "recent", label: "최근 본 영상", icon: "◷" }
              ] as const).map((item) => {
                const active = navSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setNavSection(item.id);
                      if (item.id === "playlist") {
                        playlistRef.current?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      active
                        ? "bg-[#E8F3EE] text-[#1B5E4B]"
                        : "text-[#384640] hover:bg-[#F5F7F6]"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-[#EBEFEB] pt-5">
              <div className="px-3 mb-2 text-xs font-semibold text-[#889690]">
                수업 주제
              </div>
              <div className="space-y-1">
                {TOPICS.map((t) => {
                  const active = selectedTopic === t.label;
                  return (
                    <button
                      key={t.label}
                      onClick={() =>
                        setSelectedTopic((prev) => (prev === t.label ? "" : t.label))
                      }
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                        active
                          ? "bg-[#E8F3EE] text-[#1B5E4B] font-bold"
                          : "text-[#384640] hover:bg-[#F5F7F6]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: t.dotColor }}
                        />
                        <span>{t.label}</span>
                      </span>
                      {active && <span className="text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Teacher Google Account & Class DB Isolation Badge */}
          <div className="p-3.5 rounded-2xl bg-[#F6F8F7] border border-[#E4EAE7] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#1B5E4B] bg-[#D8EFE4] px-2 py-0.5 rounded-full">
                학급별 체험 자료
              </span>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-xs font-semibold text-[#1B5E4B] underline"
              >
                계정 전환
              </button>
            </div>
            <div className="text-xs font-bold text-[#1C2824]">
              {teacher.name} 선생님 ({teacher.className})
            </div>
            <div className="text-[11px] text-[#66756F] truncate">{teacher.authProvider === "demo" ? "체험 프로필" : teacher.email}</div>
            <div className="text-[11px] text-[#4A5A53]">
              우리 반 전용 업로드: <strong>{counts.myClassCount}개</strong>
            </div>
          </div>
        </aside>

        {/* Center Main Video Player Area */}
        <main className="flex flex-col items-center justify-between py-6 px-4 sm:px-8 overflow-y-auto">
          <div className="w-full max-w-[540px] space-y-4">
            {/* Subheader */}
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-[#E06D53] mb-1">
                  오늘의 수업 한 조각
                </p>
                <h1 className="text-2xl sm:text-[28px] font-extrabold leading-tight text-[#14201C]">
                  아이들과 바로 보는
                  <br />
                  짧고 좋은 배움 영상
                </h1>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#E5EAE7] text-xs font-semibold text-[#384640] shadow-2xs">
                <span className="text-[#1B5E4B]">✓</span> 광고 없는 교사 콘텐츠
              </span>
            </div>

            {/* Video Card */}
            {currentVideo ? (
              <div className="bg-white rounded-[28px] shadow-xs border border-[#E8ECEA] overflow-hidden">
                {/* Square Visual Stage */}
                <div className="relative aspect-square w-full bg-[#ECEEE9] overflow-hidden">
                  {currentVideo.playbackUrl ? (
                    <video
                      key={currentVideo.playbackUrl}
                      src={currentVideo.playbackUrl}
                      controls onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={600}
                      onClick={() => setIsPlaying((p) => !p)}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  )}

                  {/* Top-left Category Pill */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-xs">
                    {currentVideo.playbackUrl ? currentVideo.category : "샘플 애니메이션 · 원본 영상 미포함"}
                  </div>

                  {/* Top-center Control Pill */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/55 text-white text-xs backdrop-blur-xs">
                    <button
                      onClick={() => { const media = document.querySelector("video"); if (media) { if (media.paused) void media.play(); else media.pause(); } setIsPlaying((p) => !p); }}
                      title="재생/일시정지"
                      className="hover:text-[#D8EFE4]"
                    >
                      {isPlaying ? "⏸" : "▶"}
                    </button>
                    <span>|</span>
                    <button
                      onClick={() =>
                        canvasRef.current?.parentElement?.requestFullscreen()
                      }
                      title="수업 집중 보기"
                      className="hover:text-[#D8EFE4]"
                    >
                      ✨
                    </button>
                  </div>

                  {/* Top-right Counter Pill */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-xs">
                    {currentIdx + 1} / {videos.length}
                  </div>

                  {/* Right Vertical Prev / Next Buttons */}
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                    <button
                      onClick={() =>
                        handleSelectVideo(
                          currentIdx > 0 ? currentIdx - 1 : videos.length - 1
                        )
                      }
                      className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-sm backdrop-blur-xs"
                      title="이전 영상"
                    >
                      ⌃
                    </button>
                    <button
                      onClick={() =>
                        handleSelectVideo(
                          currentIdx < videos.length - 1 ? currentIdx + 1 : 0
                        )
                      }
                      className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-sm backdrop-blur-xs"
                      title="다음 영상"
                    >
                      ⌄
                    </button>
                  </div>

                  {/* Bottom-left Badges */}
                  <div className="absolute bottom-3.5 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/55 text-white text-[11px] font-medium backdrop-blur-xs">
                      ✓ 광고 없음
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/55 text-white text-[11px] font-medium backdrop-blur-xs">
                      ✓ 다운로드 허용
                    </span>
                  </div>
                </div>

                {/* Creator & Metadata Info */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F7D2C4] text-[#7A3E2E] font-bold flex items-center justify-center text-sm">
                        {currentVideo.creatorName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#14201C] flex items-center gap-1.5">
                          <span>{currentVideo.creatorName}</span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F2F5F3] text-[#55645E]">
                            {currentVideo.className}
                          </span>
                        </div>
                        <div className="text-xs text-[#7A8882]">
                          {currentVideo.ageGroup} · {currentVideo.durationLabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentVideo.ownerEmail.toLowerCase() ===
                        teacher.email.toLowerCase() && (
                        <button
                          onClick={() => handleDeleteCurrentVideo(currentVideo.id)}
                          className="px-3 py-1.5 rounded-full border border-[#F2D0C9] text-[#C94A38] text-xs font-semibold hover:bg-[#FFF5F3]"
                        >
                          삭제
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setFollowedCreators((prev) => ({
                            ...prev,
                            [currentVideo.creatorName]:
                              !prev[currentVideo.creatorName]
                          }));
                          showToast(
                            `${currentVideo.creatorName} 선생님의 새 수업 영상을 구독합니다.`
                          );
                        }}
                        className="px-4 py-1.5 rounded-full border border-[#DCE3DF] text-xs font-bold text-[#22302B] hover:bg-[#F5F7F6]"
                      >
                        {followedCreators[currentVideo.creatorName]
                          ? "팔로잉"
                          : "팔로우"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-[#14201C]">
                      {currentVideo.title}
                    </h2>
                    <p className="text-xs text-[#5E6D67] mt-1 leading-relaxed">
                      {currentVideo.description}
                    </p>
                  </div>

                  {/* 4-Column Interaction Row */}
                  <div className="grid grid-cols-4 pt-3 border-t border-[#F0F3F1] text-center">
                    <button
                      onClick={handleToggleLike}
                      className="flex flex-col items-center gap-0.5 py-1 hover:bg-[#F7F9F8] rounded-xl"
                    >
                      <span className="text-xs text-[#6A7872]">♡ 좋아요</span>
                      <span className="text-xs font-extrabold text-[#14201C]">
                        {currentVideo.likes}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        showToast("수업 영상 링크를 클립보드에 복사했어요.");
                      }}
                      className="flex flex-col items-center gap-0.5 py-1 hover:bg-[#F7F9F8] rounded-xl"
                    >
                      <span className="text-xs text-[#6A7872]">↗ 공유</span>
                      <span className="text-xs font-extrabold text-[#14201C]">
                        {currentVideo.shares}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob(
                          [
                            JSON.stringify(
                              {
                                title: currentVideo.title,
                                creator: currentVideo.creatorName,
                                className: currentVideo.className,
                                category: currentVideo.category,
                                ageGroup: currentVideo.ageGroup,
                                description: currentVideo.description
                              },
                              null,
                              2
                            )
                          ],
                          { type: "application/json" }
                        );
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = currentVideo.downloadUrl || url;
                        a.download = `${currentVideo.title}${currentVideo.playbackUrl ? ".mp4" : ".json"}`;
                        a.click(); URL.revokeObjectURL(url);
                        showToast(
                          `'${currentVideo.title}' 수업 자료 다운로드를 시작했어요.`
                        );
                      }}
                      className="flex flex-col items-center gap-0.5 py-1 hover:bg-[#F7F9F8] rounded-xl"
                    >
                      <span className="text-xs text-[#6A7872]">↓ 다운로드</span>
                      <span className="text-xs font-extrabold text-[#14201C]">
                        {currentVideo.downloads}
                      </span>
                    </button>
                    <div className="flex flex-col items-center gap-0.5 py-1">
                      <span className="text-xs text-[#6A7872]">▤ 조회</span>
                      <span className="text-xs font-extrabold text-[#14201C]">
                        {currentVideo.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8ECEA] space-y-3">
                <p className="text-base font-bold text-[#14201C]">
                  조건에 맞는 수업 영상이 없어요.
                </p>
                <p className="text-xs text-[#6A7872]">
                  다른 수업 주제를 선택하거나 우리 반 전용 새 영상을 업로드·스크랩해 보세요.
                </p>
              </div>
            )}

            {/* Bottom Floating Navigation Bar (Matches Reference UI) */}
            <div className="bg-white rounded-2xl border border-[#E8ECEA] px-6 py-2.5 flex items-center justify-between shadow-xs">
              <button
                onClick={() => {
                  setNavSection("home");
                  setSelectedTopic("");
                }}
                className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold ${
                  navSection === "home" ? "text-[#1B5E4B]" : "text-[#7A8882]"
                }`}
              >
                <span className="text-base">⌂</span>
                <span>홈</span>
              </button>
              <button
                onClick={() =>
                  showToast("상단 검색창이나 좌측 수업 주제로 영상을 찾아보세요.")
                }
                className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-[#7A8882]"
              >
                <span className="text-base">🔍</span>
                <span>찾기</span>
              </button>
              <button
                onClick={() => {
                  setScrapeTab("agent");
                  setShowScrapeModal(true);
                }}
                title="동영상 사이트 스크랩 & 에이전트 연결"
                className="w-11 h-11 rounded-full bg-[#1B5E4B] hover:bg-[#15493A] text-white text-xl font-bold flex items-center justify-center shadow-md -mt-4"
              >
                +
              </button>
              <button
                onClick={() => {
                  setCurationTab((prev) =>
                    prev === "shared" ? "teacher" : "shared"
                  );
                }}
                className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-[#7A8882]"
              >
                <span className="text-base">▤</span>
                <span>목록</span>
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-[#7A8882]"
              >
                <span className="text-base">◯</span>
                <span>내 정보</span>
              </button>
            </div>
          </div>
        </main>

        {/* Right Playlist Sidebar */}
        <aside
          ref={playlistRef}
          className="bg-white border-l border-[#EBEFEB] p-5 flex flex-col h-[calc(100vh-4rem)] sticky top-16"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] font-semibold text-[#889690]">
                교사용 큐레이션
              </p>
              <h2 className="text-lg font-extrabold text-[#14201C]">재생목록</h2>
            </div>
            <button
              onClick={() => {
                setSelectedTopic("");
                setSearchQuery("");
                setNavSection("home");
              }}
              className="text-xs font-semibold text-[#6A7872] hover:text-[#1B5E4B]"
            >
              전체보기
            </button>
          </div>

          {/* Peach Hero Card */}
          <div
            onClick={() => {
              setCurationTab("teacher");
              showToast(
                `${teacher.name} 선생님(${teacher.className}) 업로드 영상 재생목록을 열었어요.`
              );
            }}
            className="cursor-pointer rounded-2xl p-4 mb-4 bg-gradient-to-br from-[#F4DDD4] via-[#F7E5DE] to-[#F9EFEA] relative overflow-hidden border border-[#F0D5CA]"
          >
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/90 text-[11px] font-bold text-[#5A3E36] mb-6">
              {counts.myClassCount}개 영상 · {teacher.className}
            </span>
            <div className="text-base font-extrabold text-[#2B1E1A]">
              선생님 업로드 영상
            </div>
            <div className="text-[11px] text-[#6E5249] mt-0.5">
              {teacher.name} ({teacher.authProvider === "demo" ? "체험 프로필" : teacher.email}) 전용 DB
            </div>
          </div>

          {/* Curation Tabs */}
          <div className="grid grid-cols-2 border-b border-[#EBEFEB] mb-3 text-xs font-bold">
            <button
              onClick={() => setCurationTab("shared")}
              className={`pb-2.5 text-center border-b-2 transition ${
                curationTab === "shared"
                  ? "border-[#1B5E4B] text-[#14201C]"
                  : "border-transparent text-[#889690]"
              }`}
            >
              교사 공동 큐레이션 ({counts.sharedCount})
            </button>
            <button
              onClick={() => {
                setCurationTab("teacher");
                showToast("선생님 업로드 영상(우리 반 고유 DB)을 열었어요.");
              }}
              className={`pb-2.5 text-center border-b-2 transition ${
                curationTab === "teacher"
                  ? "border-[#1B5E4B] text-[#14201C]"
                  : "border-transparent text-[#889690]"
              }`}
            >
              교사 큐레이션 ({counts.myClassCount})
            </button>
          </div>

          {/* Scrollable Numbered Video List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {videos.map((v, idx) => {
              const active = currentVideo?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVideo(idx)}
                  className={`cursor-pointer p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    active
                      ? "bg-[#E8F3EE]/70 border-[#1B5E4B]/40"
                      : "bg-white border-[#F0F2F1] hover:bg-[#F9FBFA]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 ${
                        active
                          ? "bg-[#1B5E4B] text-white"
                          : "bg-[#F5E6DF] text-[#7A4D3B]"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#182420] truncate">
                        {v.title}
                      </div>
                      <div className="text-[11px] text-[#7A8882] truncate">
                        {v.category} · {v.durationLabel}
                      </div>
                    </div>
                  </div>
                  <button
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                      active
                        ? "bg-[#1B5E4B] text-white"
                        : "bg-[#F3F5F4] text-[#45544E]"
                    }`}
                  >
                    {active ? "재생 중" : "재생"}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* 1. Direct Teacher Video Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#1B5E4B] bg-[#E8F3EE] px-2.5 py-0.5 rounded-full">
                  교사 직접 업로드 · {teacher.className} 전용 DB
                </span>
                <h3 className="text-lg font-extrabold text-[#14201C] mt-1">
                  새 수업 영상 올리기
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-sm text-[#7A8882] hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <label className="block border-2 border-dashed border-[#CFE2D9] rounded-2xl p-4 text-center cursor-pointer hover:bg-[#F6FAF8]">
                <input
                  type="file" disabled
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUpFileName(file.name);
                      setUpFileUrl(URL.createObjectURL(file));
                      if (!upTitle) {
                        setUpTitle(file.name.replace(/\.[^/.]+$/, ""));
                      }
                    }
                  }}
                />
                <div className="font-bold text-[#1B5E4B]">
                  {upFileName
                    ? `선택된 파일: ${upFileName}`
                    : "파일 저장소 미설정 · 아래 공개 영상 URL로 등록해 주세요"}
                </div>
                <div className="text-[11px] text-[#7A8882] mt-1">
                  또는 아래에 외부 동영상 스트리밍 URL을 직접 입력할 수 있습니다.
                </div>
              </label>

              <div>
                <label className="font-bold block mb-1">영상 제목 *</label>
                <input
                  type="text"
                  required
                  value={upTitle}
                  onChange={(e) => setUpTitle(e.target.value)}
                  placeholder="예: 무지개 물고기와 친구들 막대동화"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCE3DF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">제작 교사 이름</label>
                  <input
                    type="text"
                    value={upCreator}
                    onChange={(e) => setUpCreator(e.target.value)}
                    placeholder={teacher.name}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE3DF]"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">우리 반 이름 (DB 구분)</label>
                  <input
                    type="text"
                    value={upClassName}
                    onChange={(e) => setUpClassName(e.target.value)}
                    placeholder={teacher.className}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE3DF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">대상 연령</label>
                  <select
                    value={upAgeGroup}
                    onChange={(e) => setUpAgeGroup(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE3DF]"
                  >
                    <option value="만 3-5세">만 3-5세</option>
                    <option value="만 3세">만 3세</option>
                    <option value="만 4세">만 4세</option>
                    <option value="만 5세">만 5세</option>
                    <option value="영아반 (만 0-2세)">영아반 (만 0-2세)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">수업 주제</label>
                  <select
                    value={upCategory}
                    onChange={(e) => setUpCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE3DF]"
                  >
                    {TOPICS.map((t) => (
                      <option key={t.label} value={t.label}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">
                  동영상 URL (공개 MP4/WebM 주소)
                </label>
                <input
                  type="url" required
                  value={upFileUrl}
                  onChange={(e) => setUpFileUrl(e.target.value)}
                  placeholder="https://example.edu/story-video.mp4"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCE3DF]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">수업 활용 설명</label>
                <textarea
                  rows={2}
                  value={upDesc}
                  onChange={(e) => setUpDesc(e.target.value)}
                  placeholder="아이들과 어떤 발문으로 이야기 나누기를 진행할지 적어주세요."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCE3DF]"
                />
              </div>

              <label className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={upSharePublic}
                  onChange={(e) => setUpSharePublic(e.target.checked)}
                />
                <span>
                  우리 반 전용 DB뿐 아니라 <strong>교사 공동 큐레이션</strong>에도 함께 공유하기
                </span>
              </label>

              <label className="flex items-center gap-2 bg-[#F6F8F7] p-3 rounded-xl">
                <input
                  type="checkbox"
                  required
                  checked={upRightsOk}
                  onChange={(e) => setUpRightsOk(e.target.checked)}
                />
                <span>
                  이 영상을 재생·공유·다운로드할 권리가 있고 협찬 광고가 없음을 확인합니다.
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-full border border-[#DCE3DF] font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1B5E4B] text-white font-bold"
                >
                  영상 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Video Site List Scrape & Agent Import Modal */}
      {showScrapeModal && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#1B5E4B] bg-[#E8F3EE] px-2.5 py-0.5 rounded-full">
                  동영상 사이트 리스트 스크랩 · 에이전트 연동
                </span>
                <h3 className="text-lg font-extrabold text-[#14201C] mt-1">
                  외부 동영상 리스트 스크랩 ({teacher.className} DB)
                </h3>
              </div>
              <button
                onClick={() => setShowScrapeModal(false)}
                className="text-sm text-[#7A8882] hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 bg-[#F3F5F4] p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setScrapeTab("direct")}
                className={`py-2 rounded-lg transition ${
                  scrapeTab === "direct"
                    ? "bg-white text-[#1B5E4B] shadow-2xs"
                    : "text-[#6A7872]"
                }`}
              >
                동영상 리스트 직접 스크랩
              </button>
              <button
                onClick={async () => {
                  setScrapeTab("agent");
                  const res = await fetch("/api/scrape", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mode: "create-agent-token" })
                  });
                  if (res.ok) {
                    const data = await res.json();
                    setAgentToken(data.tokenRecord.token);
                  }
                }}
                className={`py-2 rounded-lg transition ${
                  scrapeTab === "agent"
                    ? "bg-white text-[#1B5E4B] shadow-2xs"
                    : "text-[#6A7872]"
                }`}
              >
                에이전트 연결 (API 엔드포인트)
              </button>
            </div>

            {scrapeTab === "direct" ? (
              <form onSubmit={handleScrapeSubmit} className="space-y-3 text-xs">
                <p className="text-[#5A6862] leading-relaxed">
                  동영상 사이트의 동화·이야기나누기 영상 목록(`제목 | URL | 주제 | 시간` 또는 여러 줄의 URL/JSON 리스트)을 붙여넣으면 현재 로그인된{" "}
                  <strong>
                    {teacher.name} 선생님({teacher.authProvider === "demo" ? "체험 프로필" : teacher.email})
                  </strong>
                  의 우리 반 전용 DB로 일괄 스크랩됩니다.
                </p>

                <textarea
                  rows={5}
                  value={scrapeInput}
                  onChange={(e) => setScrapeInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#DCE3DF] font-mono text-[11px]"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">기본 분류 주제</label>
                    <select
                      value={scrapeCategory}
                      onChange={(e) => setScrapeCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DCE3DF]"
                    >
                      {TOPICS.map((t) => (
                        <option key={t.label} value={t.label}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">기본 대상 연령</label>
                    <select
                      value={scrapeAge}
                      onChange={(e) => setScrapeAge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DCE3DF]"
                    >
                      <option value="만 3-5세">만 3-5세</option>
                      <option value="만 4-5세">만 4-5세</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={scrapeSharePublic}
                    onChange={(e) => setScrapeSharePublic(e.target.checked)}
                  />
                  <span>교사 공동 큐레이션에도 함께 공개하기</span>
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowScrapeModal(false)}
                    className="px-4 py-2 rounded-full border border-[#DCE3DF] font-semibold"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#1B5E4B] text-white font-bold"
                  >
                    리스트 스크랩하여 우리 반 DB에 추가
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F6F8F7] border border-[#E2EAE6] space-y-1.5">
                  <div className="font-bold text-[#1B5E4B]">
                    24시간 유효 1회용 에이전트 수집 엔드포인트
                  </div>
                  <code className="block text-[11px] bg-white p-2 rounded-lg border border-[#E2EAE6] break-all">
                    {typeof window !== "undefined" ? window.location.origin : ""}/api/agent-import/{agentToken}
                  </code>
                </div>
                <pre className="p-3 rounded-xl bg-[#14201C] text-[#D8EFE4] text-[11px] overflow-x-auto">
{`POST /api/agent-import/${agentToken}
{
  "creatorName": "${teacher.name}",
  "videos": [
    {
      "title": "제목",
      "playbackUrl": "https://...",
      "ageGroup": "만 3-5세",
      "category": "언어·동화",
      "durationLabel": "00:30",
      "sponsorFreeConfirmed": true,
      "rightsConfirmed": true
    }
  ]
}`}
                </pre>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `${window.location.origin}/api/agent-import/${agentToken}`
                      );
                      showToast("에이전트 연결 요청 문구와 엔드포인트를 복사했어요.");
                    }}
                    className="px-4 py-2 rounded-full bg-[#1B5E4B] text-white font-bold"
                  >
                    요청 문구 복사하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Google Login & Class DB Isolation Switcher Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#1B5E4B] bg-[#E8F3EE] px-2.5 py-0.5 rounded-full">
                  교사 인증 · 체험 학급 전환
                </span>
                <h3 className="text-lg font-extrabold text-[#14201C] mt-1">
                  교사 계정 및 체험 학급
                </h3>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-sm text-[#7A8882] hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F8F7] border border-[#E2EAE6] text-xs space-y-1">
              <div className="font-bold text-[#14201C]">
                현재 사용자: {teacher.name} 선생님 ({teacher.className})
              </div>
              <div className="text-[#5A6862]">인증 방식: {teacher.authProvider === "google" ? "Google 인증" : "체험 모드"}</div>
              <div className="text-[11px] text-[#1B5E4B] font-semibold">
                우리 반 영상 {counts.myClassCount}개 · 서버 재시작 시 임시 자료가 초기화됩니다.
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[#384640]">
                체험 학급 선택 (Google 로그인과 별개)
              </div>
              {presets.map((p) => {
                const isCurrent = p.email.toLowerCase() === teacher.email.toLowerCase();
                return (
                  <button
                    key={p.id}
                    onClick={() =>
                      handleSwitchTeacherAccount(p.email, p.name, p.className)
                    }
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                      isCurrent
                        ? "border-[#1B5E4B] bg-[#E8F3EE]/60"
                        : "border-[#E8ECEA] hover:bg-[#F7F9F8]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#F7D2C4] text-[#7A3E2E] font-bold text-xs flex items-center justify-center">
                        {p.avatarText}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#14201C]">
                          {p.name} ({p.className})
                        </div>
                        <div className="text-[11px] text-[#6A7872]">{p.email}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1B5E4B]">
                      {isCurrent ? "현재 계정" : "전환"}
                    </span>
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customGoogleEmail) {
                  handleSwitchTeacherAccount(
                    customGoogleEmail,
                    customGoogleName || undefined,
                    customGoogleClass || undefined
                  );
                }
              }}
              className="border-t border-[#EBEFEB] pt-3 space-y-2.5 text-xs"
            >
              <div className="font-bold text-[#384640]">
                체험 프로필 만들기 · 입력한 이메일로 인증되지 않습니다
              </div>
              <input
                type="email"
                required
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                placeholder="체험 프로필 이메일 (인증용 아님)"
                className="w-full px-3 py-2 rounded-xl border border-[#DCE3DF]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  placeholder="교사 성함 (예: 박지민)"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3DF]"
                />
                <input
                  type="text"
                  value={customGoogleClass}
                  onChange={(e) => setCustomGoogleClass(e.target.value)}
                  placeholder="담당 반 이름 (예: 별님반)"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3DF]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#1B5E4B] text-white font-bold"
                >
                  체험 학급 시작하기
                </button>
                <Link
                  href="/api/auth/signin" onClick={(e) => { if (!oauthReady) { e.preventDefault(); showToast("Google OAuth 설정이 필요합니다. 현재 체험 모드입니다."); } }}
                  className="px-4 py-2.5 rounded-full border border-[#DCE3DF] font-bold text-[#14201C] hover:bg-[#F5F7F6]"
                >
                  Google 로그인
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
