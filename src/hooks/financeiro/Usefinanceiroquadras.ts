import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // ajuste o caminho do seu cliente

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface QuadrasKpis {
  faturamento: number;
  agendamentos: number;
  clientes: number;
  quadraMaisAlugada: string;
}

export interface EsporteData {
  esporte: string;
  agendamentos: number;
  faturamento: number;
}

export interface SemanaData {
  semana: number;
  agendamentos: number;
  faturamento: number;
}

export interface MesData {
  mes: string;
  faturamento: number;
  agendamentos: number;
}

export interface MesEsporteData {
  mes: string;
  esporte: string;
  agendamentos: number;
}

export interface UseFinanceiroQuadrasReturn {
  kpis: QuadrasKpis | null;
  porEsporte: EsporteData[];
  porSemana: SemanaData[];
  anual: MesData[];
  anualPorEsporte: MesEsporteData[];
  loading: boolean;
  error: string | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFinanceiroQuadras(
  mes: number, // 0-11
  ano: number,
  yearAnual: number 
): UseFinanceiroQuadrasReturn {
  const [kpis, setKpis]                       = useState<QuadrasKpis | null>(null);
  const [porEsporte, setPorEsporte]           = useState<EsporteData[]>([]);
  const [porSemana, setPorSemana]             = useState<SemanaData[]>([]);
  const [anual, setAnual]                     = useState<MesData[]>([]);
  const [anualPorEsporte, setAnualPorEsporte] = useState<MesEsporteData[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState<string | null>(null);

  // "2026-12-01"
  const mesFormatado = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;

  // ── Dados do mês (re-busca quando mês/ano mudar) ──────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);

    async function buscarMes() {
      const [kpisRes, esportesRes, semanasRes] = await Promise.all([
        supabase.rpc("get_quadras_kpis",     { p_mes: mesFormatado }),
        supabase.rpc("get_quadras_esportes", { p_mes: mesFormatado }),
        supabase.rpc("get_quadras_semanas",  { p_mes: mesFormatado }),
      ]);

      if (kpisRes.error || esportesRes.error || semanasRes.error) {
        setError("Erro ao carregar dados do mês.");
        setLoading(false);
        return;
      }

      setKpis(kpisRes.data);
      setPorEsporte(esportesRes.data ?? []);
      setPorSemana(semanasRes.data ?? []);
      setLoading(false);
    }

    buscarMes();
  }, [mesFormatado]);

  // ── Dados anuais (re-busca só quando o ano mudar) ─────────────────────────
  useEffect(() => {
  async function buscarAnual() {
    const [anualRes, anualEsportesRes] = await Promise.all([
      supabase.rpc("get_quadras_anual",          { p_ano: yearAnual }),  // ← yearAnual
      supabase.rpc("get_quadras_anual_esportes", { p_ano: yearAnual }),  // ← yearAnual
    ]);
    if (!anualRes.error)         setAnual(anualRes.data ?? []);
    if (!anualEsportesRes.error) setAnualPorEsporte(anualEsportesRes.data ?? []);
  }
  buscarAnual();
}, [yearAnual]);

  return { kpis, porEsporte, porSemana, anual, anualPorEsporte, loading, error };
}