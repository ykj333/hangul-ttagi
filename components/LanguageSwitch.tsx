import type { Lang } from "@/lib/letters";

type LanguageSwitchProps = Readonly<{
  lang: Lang;
  onChange: (lang: Lang) => void;
}>;

const LANGUAGES = [
  { value: "ko", label: "한글" },
  { value: "en", label: "ABC" },
] as const satisfies readonly { readonly value: Lang; readonly label: string }[];

export function LanguageSwitch({ lang, onChange }: LanguageSwitchProps) {
  return (
    <fieldset className="language-switch">
      <legend className="sr-only">연습할 언어</legend>
      {LANGUAGES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={lang === value}
          className="language-switch__button"
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </fieldset>
  );
}
