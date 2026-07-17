import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";

type Activity = Readonly<{
  href: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  description: ReactNode;
  tone: "orange" | "blue";
}>;

const ACTIVITIES: readonly Activity[] = [
  {
    href: "/trace",
    icon: "pencil",
    eyebrow: "손으로 익혀요",
    title: "따라쓰기",
    description: (
      <>
        큼직한 글자를 손가락으로 천천히 <span className="keep-together">따라 써요.</span>
      </>
    ),
    tone: "orange",
  },
  {
    href: "/quiz",
    icon: "speaker",
    eyebrow: "귀로 찾아요",
    title: "소리 퀴즈",
    description: (
      <>
        소리를 듣고 알맞은 글자를 <span className="keep-together">골라 보아요.</span>
      </>
    ),
    tone: "blue",
  },
] as const;

export default function Home() {
  return (
    <main id="main-content" className="home-shell">
      <div className="home-orbit home-orbit--one" aria-hidden="true" />
      <div className="home-orbit home-orbit--two" aria-hidden="true" />

      <section className="home-hero" aria-labelledby="home-title">
        <p className="home-kicker">오늘도 한 글자씩</p>
        <h1 id="home-title" className="home-title">
          한글 떼기
          <span>놀이터</span>
        </h1>
        <p className="home-lead">
          보고, 듣고, 직접 써 보며
          <br />
          {" "}
          우리 아이의 첫 글자를 만나요.
        </p>
      </section>

      <section className="activity-grid" aria-label="한글 놀이 고르기">
        {ACTIVITIES.map((activity) => (
          <Link
            key={activity.href}
            href={activity.href}
            className={`activity-card activity-card--${activity.tone}`}
          >
            <span className="activity-card__icon" aria-hidden="true">
              <Icon name={activity.icon} />
            </span>
            <span className="activity-card__eyebrow">{activity.eyebrow}</span>
            <strong className="activity-card__title">{activity.title}</strong>
            <span className="activity-card__description">
              {activity.description}
            </span>
            <span className="activity-card__action">
              시작하기
              <Icon name="arrow-right" />
            </span>
          </Link>
        ))}
      </section>

      <p className="sound-note">
        <Icon name="speaker" />
        <span>
          소리가 나와요. <span className="keep-together">기기 음량을 확인해 주세요.</span>
        </span>
      </p>
    </main>
  );
}
