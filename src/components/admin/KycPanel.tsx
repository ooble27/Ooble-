import { useState } from "react";
import { Check, X, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SEED_KYC, KYC_STATUS_META, timeAgo, type KycRequest, type KycStatus } from "@/lib/adminOrders";
import { ClientCell } from "./AdminBits";

const KycBadge = ({ status }: { status: KycStatus }) => {
  const m = KYC_STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 text-[12px] font-medium">
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      <span className={m.tone}>{m.label}</span>
    </span>
  );
};

type Filter = "attente" | "verifie" | "refuse";

const KycPanel = () => {
  const [rows, setRows] = useState<KycRequest[]>(SEED_KYC);
  const [tab, setTab] = useState<Filter>("attente");

  const set = (id: string, status: KycStatus) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const TABS: { id: Filter; label: string }[] = [
    { id: "attente", label: "À vérifier" },
    { id: "verifie", label: "Vérifiés" },
    { id: "refuse", label: "Refusés" },
  ];
  const counts = {
    attente: rows.filter((r) => r.status === "attente").length,
    verifie: rows.filter((r) => r.status === "verifie").length,
    refuse: rows.filter((r) => r.status === "refuse").length,
  };
  const list = rows.filter((r) => r.status === tab);
  const cols = "grid grid-cols-[1fr_auto] md:grid-cols-[1.7fr_1fr_0.7fr_auto] items-center gap-3";

  return (
    <div className="space-y-4">
      {/* Sous-onglets soulignés */}
      <div className="-mx-5 flex gap-1 overflow-x-auto border-b border-border px-5 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const on = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "-mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-2.5 pt-2 text-[13px] font-medium transition-colors",
                on ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {counts[t.id] > 0 && (
                <span className="rounded-full bg-secondary px-1.5 py-px text-[11px] font-semibold text-muted-foreground">{counts[t.id]}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className={cn(cols, "hidden border-b border-border px-4 py-2.5 md:grid")}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Client</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Document</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Soumis</span>
          <span />
        </div>

        {list.map((r, i) => (
          <div key={r.id} className={cn(cols, "px-4 py-3", i < list.length - 1 && "border-b border-border")}>
            <ClientCell name={r.clientName} email={r.email} />
            <span className="hidden text-[13px] text-muted-foreground md:block">{r.docType}</span>
            <span className="hidden text-[12.5px] text-muted-foreground md:block">{timeAgo(r.submittedMinsAgo)}</span>
            <div className="flex items-center justify-end gap-2">
              {r.status === "attente" ? (
                <>
                  <Button variant="appOutline" shape="rounded" className="h-auto gap-1.5 rounded-[10px] px-3 py-1.5 text-[12.5px]" onClick={() => set(r.id, "refuse")}>
                    <X className="h-[13px] w-[13px]" /> Refuser
                  </Button>
                  <Button variant="appPrimary" shape="rounded" className="h-auto gap-1.5 rounded-[10px] px-3 py-1.5 text-[12.5px]" onClick={() => set(r.id, "verifie")}>
                    <Check className="h-[13px] w-[13px]" /> Approuver
                  </Button>
                </>
              ) : (
                <KycBadge status={r.status} />
              )}
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <FileCheck className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="mt-3 text-sm text-muted-foreground">Aucune vérification ici.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycPanel;
