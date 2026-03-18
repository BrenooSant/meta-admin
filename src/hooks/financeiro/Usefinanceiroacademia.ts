import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // ajuste o caminho

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface AcademiaKpis {
  faturamento: number;
  renovacoes: number;
  alunosAtivos: number;
  outrosAlunos: number;
}

export interface StatusAlunos {
  ativos: number;
  expirados: number;
  inativos: number;
}

export interface SemanaData {
  semana: number;
  renovacoes: number;
  faturamento: number;
}

export interface MesData {
  mes: string;       // "Jan", "Fev", ...
  faturamento: number;
  renovacoes: number;
}

export interface MesAlunosData {
  mes: string;
  alunos: number;
}

export interface UseFinanceiroAcademiaReturn {
  kpis: AcademiaKpis | null;
  statusAlunos: StatusAlunos | null;
  porSemana: SemanaData[];
  anual: MesData[];
  alunosPorMes: MesAlunosData[];
  loading: boolean;
  error: string | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFinanceiroAcademia(
  mes: number,  // 0-11
  ano: number
): UseFinanceiroAcademiaReturn {
  const [kpis, setKpis]                   = useState<AcademiaKpis | null>(null);
  const [statusAlunos, setStatusAlunos]   = useState<StatusAlunos | null>(null);
  const [porSemana, setPorSemana]         = useState<SemanaData[]>([]);
  const [anual, setAnual]                 = useState<MesData[]>([]);
  const [alunosPorMes, setAlunosPorMes]   = useState<MesAlunosData[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  const mesFormatado = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;

  // ── Dados do mês (re-busca quando mês/ano mudar) ──────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);

    async function buscarMes() {
      const [kpisRes, semanasRes, statusRes] = await Promise.all([
        supabase.rpc("get_academia_kpis",          { p_mes: mesFormatado }),
        supabase.rpc("get_academia_semanas",        { p_mes: mesFormatado }),
        supabase.rpc("get_academia_status_alunos"),
      ]);

      console.log("kpis error:",   JSON.stringify(kpisRes.error));
      console.log("semanas error:", JSON.stringify(semanasRes.error));
      console.log("status error:",  JSON.stringify(statusRes.error));
      if (kpisRes.error || semanasRes.error || statusRes.error) {
        setError("Erro ao carregar dados da academia.");
        setLoading(false);
        return;
      }

      setKpis(kpisRes.data);
      setPorSemana(semanasRes.data ?? []);
      setStatusAlunos(statusRes.data);
      setLoading(false);
    }

    buscarMes();
  }, [mesFormatado]);

  // ── Dados anuais (re-busca só quando o ano mudar) ─────────────────────────
  useEffect(() => {
    async function buscarAnual() {
      const [anualRes, alunosRes] = await Promise.all([
        supabase.rpc("get_academia_anual",      { p_ano: ano }),
        supabase.rpc("get_academia_alunos_mes", { p_ano: ano }),
      ]);

      if (!anualRes.error)  setAnual(anualRes.data ?? []);
      if (!alunosRes.error) setAlunosPorMes(alunosRes.data ?? []);
    }

    buscarAnual();
  }, [ano]);

  return { kpis, statusAlunos, porSemana, anual, alunosPorMes, loading, error };
}