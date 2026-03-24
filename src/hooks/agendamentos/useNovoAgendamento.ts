import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface NovoAgendamentoParams {
  fullname: string;
  phone: string;
  court_sport_id: string;
  horario: string;
  slotDurationMinutes: number;
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

    function toLocalISOString(date: Date): string {
      const pad = (n: number) => String(n).padStart(2, "0");
      return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
      );
    }

    const [datePart, timePart] = params.horario.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    const bookingStart = new Date(year, month - 1, day, hour, minute, second ?? 0);
    const bookingEnd = new Date(
      bookingStart.getTime() + params.slotDurationMinutes * 60 * 1000,
    );

    const { data: { session } } = await supabase.auth.getSession();

    const { error: fnError } = await supabase.functions.invoke(
      "upsert-user-booking",
      {
        body: {
          fullname: params.fullname,
          phone: params.phone,
          court_sport_id: params.court_sport_id,
          booking_start: toLocalISOString(bookingStart),
          booking_end: toLocalISOString(bookingEnd),
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