import { useState } from "react";
import { supabase } from "../../lib/supabase";

export interface NovoEventoParams {
  fullname: string;
  phone: string;
  booking_type: "single_court" | "full_venue";
  court_id: string | null;
  include_sauna_pool: boolean;
  event_date: string;
  booking_start: string;
  booking_end: string;
  price: number;
}

export function useNovoEvento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function criarEvento(params: NovoEventoParams): Promise<boolean> {
    setLoading(true);
    setError(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { error: fnError } = await supabase.functions.invoke(
      "upsert-user-event",
      {
        body: {
          fullname: params.fullname,
          phone: params.phone,
          booking_type: params.booking_type,
          court_id: params.court_id,
          include_sauna_pool: params.include_sauna_pool,
          event_date: params.event_date,
          booking_start: params.booking_start,
          booking_end: params.booking_end,
          price: params.price,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );

    if (fnError) {
      setError("Erro ao criar evento.");
      setLoading(false);
      return false;
    }

    setLoading(false);
    return true;
  }

  return { criarEvento, loading, error };
}