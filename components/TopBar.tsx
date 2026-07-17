import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";

type TopBarProps = Readonly<{
  title: string;
  icon: IconName;
}>;

export default function TopBar({ title, icon }: TopBarProps) {
  return (
    <header className="top-bar">
      <Link href="/" aria-label="처음 화면으로" className="icon-button">
        <Icon name="home" className="icon-button__icon" />
      </Link>
      <h1 className="top-bar__title">
        <span className="top-bar__badge" aria-hidden="true">
          <Icon name={icon} className="top-bar__icon" />
        </span>
        {title}
      </h1>
      <span className="top-bar__balance" aria-hidden="true" />
    </header>
  );
}
