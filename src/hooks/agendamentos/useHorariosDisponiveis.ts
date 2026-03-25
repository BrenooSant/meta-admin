import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";

export interface HorarioDisponivel {
  label: string;
  value: string;
  slotDurationMinutes: number;
  price: number;
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

      const { data: excecao } = await supabase
        .from("court_schedule_exception")
        .select("open_time, close_time, open_time_2, close_time_2")
        .eq("court_id", courtId)
        .eq("date", dataISO)
        .maybeSingle();

      const bloqueios: { startMin: number; endMin: number }[] = [];

      if (excecao !== null) {
        if (!excecao.open_time) {
          setHorarios([]);
          setLoading(false);
          return;
        }
        const [bh1, bm1] = excecao.open_time.split(":").map(Number);
        const [eh1, em1] = excecao.close_time.split(":").map(Number);
        bloqueios.push({ startMin: bh1 * 60 + bm1, endMin: eh1 * 60 + em1 });

        if (excecao.open_time_2 && excecao.close_time_2) {
          const [bh2, bm2] = excecao.open_time_2.split(":").map(Number);
          const [eh2, em2] = excecao.close_time_2.split(":").map(Number);
          bloqueios.push({ startMin: bh2 * 60 + bm2, endMin: eh2 * 60 + em2 });
        }
      }

      const { data: pricingRows } = await supabase
        .from("court_pricing")
        .select("start_time, end_time, price, slot_duration_minutes")
        .eq("court_id", courtId)
        .eq("day_of_week", diaSemana)
        .order("start_time", { ascending: true });

      const pricing = pricingRows ?? [];

      const { data: todosCourtSports } = await supabase
        .from("court_sports")
        .select("id")
        .eq("court_id", courtId);

      const todosIds = (todosCourtSports ?? []).map((cs: any) => cs.id);

      const inicioDia = `${ano}-${mes}-${dia}T00:00:00`;
      const fimDia = `${ano}-${mes}-${dia}T23:59:59`;

      const { data: bookingsExistentes } = await supabase
        .from("bookings")
        .select("booking_start, booking_end")
        .in("court_sport_id", todosIds)
        .gte("booking_start", inicioDia)
        .lte("booking_start", fimDia);

      const bookedIntervals = (bookingsExistentes ?? []).map((b: any) => {
        const start = new Date(b.booking_start);
        const end = new Date(b.booking_end);
        return {
          startMin: start.getHours() * 60 + start.getMinutes(),
          endMin: end.getHours() * 60 + end.getMinutes(),
        };
      });

      function isOcupado(slotStartMin: number, durationMin: number): boolean {
        const slotEnd = slotStartMin + durationMin;
        return bookedIntervals.some(
          ({ startMin, endMin }) => slotStartMin < endMin && slotEnd > startMin,
        );
      }

      function isBloqueado(slotStartMin: number, durationMin: number): boolean {
        const slotEnd = slotStartMin + durationMin;
        return bloqueios.some(
          ({ startMin, endMin }) => slotStartMin < endMin && slotEnd > startMin,
        );
      }

      function getPricing(slotStartMin: number) {
        return (
          pricing.find((p) => {
            const [ph, pm] = p.start_time.split(":").map(Number);
            const [eh, em] = p.end_time.split(":").map(Number);
            const pStart = ph * 60 + pm;
            const pEnd = eh * 60 + em;
            return slotStartMin >= pStart && slotStartMin < pEnd;
          }) ?? null
        );
      }

      const slots: HorarioDisponivel[] = [];

      const [openH, openM] = gradePadrao.open_time.split(":").map(Number);
      const [closeH, closeM] = gradePadrao.close_time.split(":").map(Number);
      const openMin = openH * 60 + openM;
      const closeMin = closeH * 60 + closeM;

      let cursor = openMin;

      while (cursor < closeMin) {
        const rule = getPricing(cursor);

        if (!rule) {
          cursor += 60;
          continue;
        }

        const duration = rule.slot_duration_minutes;
        const cabe = cursor + duration <= closeMin;
        const livre = !isOcupado(cursor, duration) && !isBloqueado(cursor, duration);

        if (cabe && livre) {
          const h = Math.floor(cursor / 60);
          const m = cursor % 60;
          const hora = String(h).padStart(2, "0");
          const minuto = String(m).padStart(2, "0");

          slots.push({
            label: `${hora}:${minuto}`,
            value: `${ano}-${mes}-${dia}T${hora}:${minuto}:00`,
            slotDurationMinutes: duration,
            price: Number(rule.price),
          });
        }

        cursor += 60;
      }

      setHorarios(slots);
      setLoading(false);
    }

    buscar();
  }, [courtSportId, data]);

  return { horarios, loading };
}