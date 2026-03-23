import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

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
  mes: string;
  faturamento: number;
  renovacoes: number;
}
export interface MesAlunosData {
  mes: string;
  alunos: number;
}

// ── Hook mensal — re-executa apenas quando mês/ano mudam ─────────────────────
export function useFinanceiroAcademiaMes(mes: number, ano: number) {
  const [kpis, setKpis]                 = useState<AcademiaKpis | null>(null);
  const [statusAlunos, setStatusAlunos] = useState<StatusAlunos | null>(null);
  const [porSemana, setPorSemana]       = useState<SemanaData[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  const hoje = new Date();
  const ehMesAtual = hoje.getMonth() === mes && hoje.getFullYear() === ano;
  const mesFormatado = ehMesAtual
    ? hoje.toISOString().split("T")[0]
    : `${ano}-${String(mes + 1).padStart(2, "0")}-01`;

  useEffect(() => {
    setLoading(true);
    setError(null);

    async function buscar() {
      const [kpisRes, semanasRes, statusRes] = await Promise.all([
        supabase.rpc("get_academia_kpis",          { p_mes: mesFormatado }),
        supabase.rpc("get_academia_semanas",        { p_mes: mesFormatado }),
        supabase.rpc("get_academia_status_alunos", { p_mes: mesFormatado }),
      ]);

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

    buscar();
  }, [mesFormatado]);

  return { kpis, statusAlunos, porSemana, loading, error };
}

// ── Hook anual — re-executa apenas quando o ano anual muda ───────────────────
export function useFinanceiroAcademiaAnual(yearAnual: number) {
  const [anual, setAnual]               = useState<MesData[]>([]);
  const [alunosPorMes, setAlunosPorMes] = useState<MesAlunosData[]>([]);

  useEffect(() => {
    async function buscar() {
      const [anualRes, alunosRes] = await Promise.all([
        supabase.rpc("get_academia_anual",      { p_ano: yearAnual }),
        supabase.rpc("get_academia_alunos_mes", { p_ano: yearAnual }),
      ]);

      if (!anualRes.error)  setAnual(anualRes.data ?? []);
      if (!alunosRes.error) setAlunosPorMes(alunosRes.data ?? []);
    }

    buscar();
  }, [yearAnual]);

  return { anual, alunosPorMes };
}