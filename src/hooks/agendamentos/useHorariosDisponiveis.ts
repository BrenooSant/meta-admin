import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
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
    const ano = jsDate.getFullYear();
    const mes = String(jsDate.getMonth() + 1).padStart(2, "0");
    const dia = String(jsDate.getDate()).padStart(2, "0");
    const dataISO = `${ano}-${mes}-${dia}`;

    async function buscar() {
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

      const courtId = courtSport.court_id;

      const { data: excecao } = await supabase
        .from("court_schedule_exception")
        .select("open_time, close_time, open_time_2, close_time_2")
        .eq("court_id", courtId)
        .eq("date", dataISO)
        .maybeSingle();

      let intervalos: { open_time: string; close_time: string }[] = [];

      if (excecao !== null) {
        if (!excecao.open_time) {
          setHorarios([]);
          setLoading(false);
          return;
        }
        intervalos.push({
          open_time: excecao.open_time,
          close_time: excecao.close_time,
        });
        if (excecao.open_time_2 && excecao.close_time_2) {
          intervalos.push({
            open_time: excecao.open_time_2,
            close_time: excecao.close_time_2,
          });
        }
      } else {
        const { data: gradePadrao } = await supabase
          .from("court_opening_interval")
          .select("open_time, close_time")
          .eq("court_id", courtId)
          .eq("day_of_week", diaSemana)
          .maybeSingle();

        if (!gradePadrao) {
          setHorarios([]);
          setLoading(false);
          return;
        }
        intervalos.push(gradePadrao);
      }

      const inicioDia = new Date(jsDate);
      inicioDia.setHours(0, 0, 0, 0);
      const fimDia = new Date(jsDate);
      fimDia.setHours(23, 59, 59, 999);

      const { data: todosCourtSports } = await supabase
        .from("court_sports")
        .select("id")
        .eq("court_id", courtId);

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

      const slots: HorarioDisponivel[] = [];

      for (const intervalo of intervalos) {
        const [openH, openM] = intervalo.open_time.split(":").map(Number);
        const [closeH, closeM] = intervalo.close_time.split(":").map(Number);

        let h = openH;
        let m = openM;

        while (h < closeH || (h === closeH && m < closeM)) {
          const slotKey = `${h}:${String(m).padStart(2, "0")}`;

          if (!ocupados.has(slotKey)) {
            const hora = String(h).padStart(2, "0");
            const minuto = String(m).padStart(2, "0");
            slots.push({
              label: `${hora}:${minuto}`,
              value: `${ano}-${mes}-${dia}T${hora}:${minuto}:00`,
            });
          }

          h += 1;
        }
      }

      setHorarios(slots);
      setLoading(false);
    }

    buscar();
  }, [courtSportId, data]);

  return { horarios, loading };
}
