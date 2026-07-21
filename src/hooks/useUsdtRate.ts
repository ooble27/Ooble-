import { useEffect, useState } from "react";

/** Marge Ooble appliquée au taux de marché réel. */
export const OOBLE_MARGIN = 0.02;

/** Valeur de repli tant que le taux en direct n'est pas chargé (USDT/CAD). */
const FALLBACK_BASE = 1.4020;

interface UsdtRate {
  /** Taux de marché réel USDT/CAD. */
  base: number;
  /** Ce que le client paie pour 1 USDT (marché + marge). */
  buy: number;
  /** Ce que le client reçoit pour 1 USDT (marché − marge). */
  sell: number;
  /** true si le taux en direct a été chargé. */
  live: boolean;
}

/**
 * Récupère le taux USDT/CAD réel côté client (CoinGecko) et applique la
 * marge Ooble. Repli sur une valeur de base si l'appel échoue.
 */
export function useUsdtRate(): UsdtRate {
  const [base, setBase] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=cad")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const v = d?.tether?.cad;
        if (alive && typeof v === "number" && v > 0) setBase(v);
      })
      .catch(() => {
        /* on garde le repli */
      });
    return () => {
      alive = false;
    };
  }, []);

  const b = base ?? FALLBACK_BASE;
  return {
    base: b,
    buy: b * (1 + OOBLE_MARGIN),
    sell: b * (1 - OOBLE_MARGIN),
    live: base !== null,
  };
}
