import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { CalendarDate } from "@internationalized/date";

interface NovoAgendamentoParams {
  fullname: string;
  phone: string;
  court_sport_id: string;
  data: CalendarDate;
  horario: string;
  price: number;
}

export function useNovoAgendamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function criarAgendamento(
    params: NovoAgendamentoParams,
  ): Promise<boolean> {
    setLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();

    const { error: fnError } = await supabase.functions.invoke(
      "upsert-user-booking",
      {
        body: {
          fullname: params.fullname,
          phone: params.phone,
          court_sport_id: params.court_sport_id,
          booking_start: params.horario,
          price: params.price,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );

    if (fnError) {
      setError("Erro ao criar agendamento.");
      setLoading(false);
      return false;
    }

    setLoading(false);
    return true;
  }

  return { criarAgendamento, loading, error };
}
