export const fmt = (n: string | number | null | undefined): string =>
  !n ? "0" : Number(n).toLocaleString("id-ID");

export const fmtRp = (n: string | number | null | undefined): string =>
  !n ? "Rp 0" : "Rp " + Number(n).toLocaleString("id-ID");

export const fmtDate = (iso: string | null | undefined): string =>
  !iso ? "?" : new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); 