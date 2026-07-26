import { useMemo } from "react";
import { nfCad, nfUsdt, type AdminOrder } from "@/lib/adminOrders";

const MARGIN = 0.02; // marché + 2 %

const Card = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="rounded-2xl border border-border bg-card px-5 py-4">
    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <p className="mt-1.5 font-display text-[24px] font-light leading-none tracking-tight">{value}</p>
    {sub && <p className="mt-1.5 text-[12px] text-muted-foreground">{sub}</p>}
  </div>
);

const AccountingPanel = ({ orders }: { orders: AdminOrder[] }) => {
  const stats = useMemo(() => {
    const done = orders.filter((o) => o.status === "termine");
    const volume = done.reduce((s, o) => s + o.cad, 0);
    const buys = done.filter((o) => o.type === "buy");
    const sells = done.filter((o) => o.type === "sell");
    const buyVol = buys.reduce((s, o) => s + o.cad, 0);
    const sellVol = sells.reduce((s, o) => s + o.cad, 0);
    const margin = volume * MARGIN;
    const avg = done.length ? volume / done.length : 0;
    return { count: done.length, volume, margin, avg, buyVol, sellVol, buyN: buys.length, sellN: sells.length };
  }, [orders]);

  const Line = ({ label, value, count }: { label: string; value: string; count: number }) => (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-[13px] font-medium">{label}</p>
        <p className="text-[12px] text-muted-foreground">{count} commande{count > 1 ? "s" : ""}</p>
      </div>
      <p className="text-[14px] font-semibold">{value}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card label="Revenus (marge 2 %)" value={`${nfCad.format(stats.margin)} CAD`} sub="Sur commandes terminées" />
        <Card label="Volume traité" value={`${nfCad.format(stats.volume)} CAD`} />
        <Card label="Commandes" value={String(stats.count)} sub="Terminées" />
        <Card label="Panier moyen" value={`${nfCad.format(stats.avg)} CAD`} />
      </div>

      <div>
        <p className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Répartition</p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <Line label="Achats (USDT vendus)" value={`${nfCad.format(stats.buyVol)} CAD`} count={stats.buyN} />
          <Line label="Ventes (USDT rachetés)" value={`${nfCad.format(stats.sellVol)} CAD`} count={stats.sellN} />
        </div>
      </div>

      <p className="px-1 text-[12px] text-muted-foreground">
        Calculé sur les commandes réelles terminées. Les revenus sont une estimation via la marge
        ({nfUsdt.format(MARGIN * 100)} %) ; les montants définitifs seront confirmés par la
        réconciliation des paiements Interac.
      </p>
    </div>
  );
};

export default AccountingPanel;
