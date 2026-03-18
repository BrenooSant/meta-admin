import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";

export interface HorarioDisponivel {
  label: string;
  value: string;
}

export function useHorariosDisponiveis(
  courtSportId: string | null,
  data: CalendarDate | null,
) {
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courtSportId || !data) {
      setHorarios([]);
      return;
    }

    setLoading(true);

    const jsDate = data.toDate(getLocalTimeZone());
    const diaSemana = jsDate.getDay();

    async function buscar() {
      const { data: intervalos } = await supabase
        .from("court_opening_interval")
        .select("open_time, close_time, court_id")
        .eq("day_of_week", diaSemana);

      const { data: courtSport } = await supabase
        .from("court_sports")
        .select("court_id")
        .eq("id", courtSportId)
        .single();

      if (!courtSport) {
        setHorarios([]);
        setLoading(false);
        return;
      }

      const intervalo = (intervalos ?? []).find(
        (i: any) => i.court_id === courtSport.court_id,
      );

      if (!intervalo) {
        setHorarios([]);
        setLoading(false);
        return;
      }

      const inicioDia = new Date(jsDate);
      inicioDia.setHours(0, 0, 0, 0);
      const fimDia = new Date(jsDate);
      fimDia.setHours(23, 59, 59, 999);

      const { data: todosCourtSports } = await supabase
        .from("court_sports")
        .select("id")
        .eq("court_id", courtSport.court_id);

      const todosIds = (todosCourtSports ?? []).map((cs: any) => cs.id);

      const { data: bookingsExistentes } = await supabase
        .from("bookings")
        .select("booking_start")
        .in("court_sport_id", todosIds)
        .gte("booking_start", inicioDia.toISOString())
        .lte("booking_start", fimDia.toISOString());

      const ocupados = new Set(
        (bookingsExistentes ?? []).map((b: any) => {
          const d = new Date(b.booking_start);
          return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
        }),
      );

      const [openH, openM] = intervalo.open_time.split(":").map(Number);
      const [closeH, closeM] = intervalo.close_time.split(":").map(Number);

      const slots: HorarioDisponivel[] = [];
      let h = openH;
      let m = openM;

      while (h < closeH || (h === closeH && m < closeM)) {
        const slotKey = `${h}:${String(m).padStart(2, "0")}`;

        if (!ocupados.has(slotKey)) {
          const ano = jsDate.getFullYear();
          const mes = String(jsDate.getMonth() + 1).padStart(2, "0");
          const dia = String(jsDate.getDate()).padStart(2, "0");
          const hora = String(h).padStart(2, "0");
          const minuto = String(m).padStart(2, "0");

          slots.push({
            label: `${hora}:${minuto}`,
            value: `${ano}-${mes}-${dia}T${hora}:${minuto}:00`,
          });
        }

        h += 1;
      }

      setHorarios(slots);
      setLoading(false);
    }

    buscar();
  }, [courtSportId, data]);

  return { horarios, loading };
}
