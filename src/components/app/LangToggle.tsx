import { useLang, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LangToggle = ({ className }: { className?: string }) => {
  const [lang, setLang] = useLang();

  const toggle = () => setLang(lang === "fr" ? "en" : "fr");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-[13px] font-bold uppercase tracking-wide text-foreground transition-all hover:bg-secondary active:scale-95",
        className,
      )}
    >
      {lang === "fr" ? "EN" : "FR"}
    </button>
  );
};

export default LangToggle;

export const LangPicker = ({ className }: { className?: string }) => {
  const [lang, setLang] = useLang();

  return (
    <div className={cn("flex rounded-lg border border-border bg-secondary/60 p-0.5", className)}>
      {(["fr", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
            lang === l ? "bg-card text-foreground dark:bg-neutral-600" : "text-muted-foreground",
          )}
        >
          {l === "fr" ? "FR" : "EN"}
        </button>
      ))}
    </div>
  );
};
