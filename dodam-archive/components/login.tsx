"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  ArrowUpRight,
  BookOpen,
  Leaf,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import { demoTeachers } from "@/lib/records";
import { Scene } from "./scene";
export function Login({ googleReady }: { googleReady: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [institution, setInstitution] = useState("햇살유치원");
  const [classRole, setClassRole] = useState("만 4세 햇살반 담당교사");
  function remember() {
    localStorage.setItem(
      "dodam-profile",
      JSON.stringify({ institution, classRole }),
    );
  }
  const [error, setError] = useState("");
  async function googleLogin() {
    remember();
    setBusy("google");
    setError("");
    try {
      const response = await fetch("/api/neon-auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          callbackURL: window.location.origin + "/",
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.url)
        throw Error(
          result.message ||
            result.error ||
            "Google 로그인 연결을 확인해 주세요.",
        );
      window.location.assign(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google 로그인에 실패했어요.");
      setBusy("");
    }
  }
  async function login(id: string) {
    setBusy(id);
    setError("");
    remember();
    try {
      const result = await signIn("credentials", {
        teacher: id,
        redirect: false,
      });
      if (result?.error) throw Error();
      router.refresh();
    } catch {
      setBusy("");
      setError("로그인하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  }
  return (
    <main className="welcome">
      <section className="welcome-story">
        <Link className="brand" href="/">
          <span className="brand-icon">
            <BookOpen size={24} />
          </span>
          <span>
            도담 기록실<small>DODAM ARCHIVE</small>
          </span>
        </Link>
        <div className="welcome-title">
          <span className="eyebrow">LITTLE MOMENTS, GROWING STORIES</span>
          <h1>
            아이의 오늘을,
            <br />
            내일의 <em>이야기</em>로.
          </h1>
          <p>
            눈을 맞추고, 마음을 읽고, 성장을 기록하는 일.
            <br />
            선생님의 다정한 시선이 머무는 공간입니다.
          </p>
        </div>
        <div className="welcome-art">
          <Scene />
          <span className="paper-caption">
            작은 순간을 오래도록 기억하는 방법
          </span>
        </div>
        <div className="welcome-foot">
          <Leaf size={15} /> 매일의 발견이 모여, 한 아이의 이야기가 됩니다.
        </div>
      </section>
      <section className="welcome-login">
        <div className="login-content">
          <span className="eyebrow">A SPACE FOR TEACHERS</span>
          <h2>선생님, 어서 오세요.</h2>
          <p className="muted">우리 반의 소중한 순간을 펼쳐 볼까요?</p>
          <div className="login-benefits">
            <strong>Google 로그인 시 제공되는 기능</strong>
            <div>✓ 교사 계정별 기록과 포트폴리오 DB 영구 보관</div>
            <div>✓ 다른 기기에서도 내 학급 기록 동기화</div>
            <div>✓ 관찰 기록과 성장 이야기 통합 관리</div>
          </div>
          <div className="login-fields">
            <label>
              소속 기관명
              <input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                maxLength={60}
              />
            </label>
            <label>
              담당 학급 / 직책
              <input
                value={classRole}
                onChange={(e) => setClassRole(e.target.value)}
                maxLength={60}
              />
            </label>
          </div>
          <button
            className="google-btn"
            disabled={!googleReady || !!busy}
            onClick={googleLogin}
          >
            <span className="google-g">G</span>내 구글 계정으로 로그인 진행
            <ArrowUpRight size={17} />
          </button>
          {!googleReady && (
            <p className="connection-note">
              Google 로그인은 관리자 연결 준비 중이에요.
              <br />
              아래 샘플 선생님으로 모든 기록 기능을 둘러보세요.
            </p>
          )}
          <div className="divider">
            <span>먼저 둘러보고 싶다면</span>
          </div>
          <div className="demo-logins">
            {demoTeachers.map((teacher, i) => (
              <button
                className="teacher-card"
                key={teacher.id}
                onClick={() => login(teacher.id)}
                disabled={!!busy}
              >
                <span className={`teacher-avatar avatar-${i}`}>
                  {i === 0 ? "은" : "민"}
                </span>
                <span>
                  <strong>{teacher.name} 선생님</strong>
                  <small>{teacher.className} · 샘플 계정</small>
                </span>
                {busy === teacher.id ? (
                  <LoaderCircle size={18} className="spin" />
                ) : (
                  <ArrowUpRight size={19} />
                )}
              </button>
            ))}
          </div>
          <p className="privacy-note">
            <ShieldCheck size={17} /> 샘플 기록은 이 브라우저에만 저장돼요.
            <br />
            실제 아이의 개인정보는 입력하지 마세요.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </div>
        <footer>
          도담 기록실 <span>유치원 기록화 포트폴리오</span>
        </footer>
      </section>
    </main>
  );
}
