import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface GeralKpis {
  faturamentoTotal: number;
  faturamentoQuadras: number;
  faturamentoAcademia: number;
  agendamentos: number;
  alunosAtivos: number;
}

export interface GeralSemanaData {
  semana: number;
  faturamento: number;
}

export interface GeralMesData {
  mes: string;
  total: number;
}

export interface GeralMesSegmentadoData {
  mes: string;
  quadras: number;
  academia: number;
}

export interface UseFinanceiroGeralReturn {
  kpis: GeralKpis | null;
  porSemana: GeralSemanaData[];
  anual: GeralMesData[];
  anualSegmentado: GeralMesSegmentadoData[];
  loading: boolean;
  error: string | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFinanceiroGeral(
  mes: number,  // 0-11
  ano: number,
  yearAnual: number 
): UseFinanceiroGeralReturn {
  const [kpis, setKpis]                         = useState<GeralKpis | null>(null);
  const [porSemana, setPorSemana]               = useState<GeralSemanaData[]>([]);
  const [anual, setAnual]                       = useState<GeralMesData[]>([]);
  const [anualSegmentado, setAnualSegmentado]   = useState<GeralMesSegmentadoData[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState<string | null>(null);

  const mesFormatado = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;

  // ── Dados do mês ─────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);

    async function buscarMes() {
      const [kpisRes, semanasRes] = await Promise.all([
        supabase.rpc("get_geral_kpis",    { p_mes: mesFormatado }),
        supabase.rpc("get_geral_semanas", { p_mes: mesFormatado }),
      ]);

      if (kpisRes.error || semanasRes.error) {
        setError("Erro ao carregar dados gerais.");
        setLoading(false);
        return;
      }

      setKpis(kpisRes.data);
      setPorSemana(semanasRes.data ?? []);
      setLoading(false);
    }

    buscarMes();
  }, [mesFormatado]);

  // ── Dados anuais ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function buscarAnual() {
      const [anualRes, segmentadoRes] = await Promise.all([
        supabase.rpc("get_geral_anual",            { p_ano: yearAnual }),  // ← yearAnual
        supabase.rpc("get_geral_anual_segmentado", { p_ano: yearAnual }),  // ← yearAnual
      ]);
      if (!anualRes.error)      setAnual(anualRes.data ?? []);
      if (!segmentadoRes.error) setAnualSegmentado(segmentadoRes.data ?? []);
    }
    buscarAnual();
  }, [yearAnual]); 

  return { kpis, porSemana, anual, anualSegmentado, loading, error };
}