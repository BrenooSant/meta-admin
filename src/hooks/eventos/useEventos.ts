import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";

export interface Evento {
  id: string;
  event_date: string;
  booking_start: string;
  booking_end: string;
  booking_type: "single_court" | "full_venue";
  include_sauna_pool: boolean;
  price: number;
  usuario: {
    fullname: string;
    phone: string;
  };
  quadra: {
    name: string;
    image_url: string | null;
  } | null;
}

export function useEventos(dataSelecionada: CalendarDate) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    setLoading(true);
    setError(null);

    const jsDate = dataSelecionada.toDate(getLocalTimeZone());
    const ano = jsDate.getFullYear();
    const mes = String(jsDate.getMonth() + 1).padStart(2, "0");
    const dia = String(jsDate.getDate()).padStart(2, "0");
    const dataISO = `${ano}-${mes}-${dia}`;

    const { data, error: supabaseError } = await supabase
      .from("events")
      .select(`
        id,
        event_date,
        booking_start,
        booking_end,
        booking_type,
        include_sauna_pool,
        price,
        users (
          fullname,
          phone
        ),
        courts (
          name,
          image_url
        )
      `)
      .eq("event_date", dataISO)
      .order("booking_start", { ascending: true });

    if (supabaseError) {
      setError("Erro ao buscar eventos.");
      setLoading(false);
      return;
    }

    const formatados: Evento[] = (data ?? []).map((e: any) => ({
      id: e.id,
      event_date: e.event_date,
      booking_start: e.booking_start,
      booking_end: e.booking_end,
      booking_type: e.booking_type,
      include_sauna_pool: e.include_sauna_pool,
      price: e.price,
      usuario: {
        fullname: e.users?.fullname ?? "—",
        phone: e.users?.phone ?? "—",
      },
      quadra: e.courts
        ? { name: e.courts.name, image_url: e.courts.image_url ?? null }
        : null,
    }));

    setEventos(formatados);
    setLoading(false);
  }, [dataSelecionada]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  return { eventos, loading, error, refetch: buscar };
}

// ------------- RESUMO DO DIA -------------

export interface ResumoEventosDia {
  quantidade: number;
  faturamento: number;
}

export function useResumoEventosDia(eventos: Evento[]): ResumoEventosDia {
  const quantidade = eventos.length;
  const faturamento = eventos.reduce((acc, e) => acc + (e.price ?? 0), 0);
  return { quantidade, faturamento };
}

// ------------- MÊS -------------

export interface EventoResumoMes {
  dia: number;
  quantidade: number;
}

export function useEventosMes(dataSelecionada: CalendarDate) {
  const [resumo, setResumo] = useState<Record<number, EventoResumoMes>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    setLoading(true);
    setError(null);

    const jsDate = dataSelecionada.toDate(getLocalTimeZone());
    const ano = jsDate.getFullYear();
    const mes = jsDate.getMonth();

    const inicioMes = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const fimMes = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;

    const { data, error: supabaseError } = await supabase
      .from("events")
      .select("id, event_date")
      .gte("event_date", inicioMes)
      .lte("event_date", fimMes);

    if (supabaseError) {
      setError("Erro ao buscar eventos do mês.");
      setLoading(false);
      return;
    }

    const agrupado: Record<number, number> = {};
    for (const e of data ?? []) {
      const dia = Number(e.event_date.split("-")[2]);
      agrupado[dia] = (agrupado[dia] ?? 0) + 1;
    }

    const resultado: Record<number, EventoResumoMes> = {};
    for (const [diaStr, qtd] of Object.entries(agrupado)) {
      const dia = Number(diaStr);
      resultado[dia] = { dia, quantidade: qtd };
    }

    setResumo(resultado);
    setLoading(false);
  }, [dataSelecionada]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  return { resumo, loading, error };
}