import { useState } from "react";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { useEventos, useResumoEventosDia } from "../../hooks/eventos/useEventos";
import { ControleExibicaoEventos } from "./components/ControleExibicaoEventos";
import { EventosDia } from "./components/EventosDia";
import { EventosMes } from "./components/EventosMes";

export function EventosPage() {
  function proximoDomingo(): CalendarDate {
    let d = today(getLocalTimeZone());
    while (d.toDate(getLocalTimeZone()).getDay() !== 0) {
      d = d.add({ days: 1 });
    }
    return d;
  }

  const [dataSelecionada, setDataSelecionada] = useState<CalendarDate>(
    proximoDomingo()
  );

  const [visualizacao, setVisualizacao] = useState<"dia" | "mes">("dia");
  const { eventos, loading, error, refetch } = useEventos(dataSelecionada);
  const resumoDia = useResumoEventosDia(eventos);

  return (
    <main className="px-12 pb-12 mt-10">
      <div className="flex flex-col-reverse md:flex-row md:items-start items-center">
        <div className="sticky top-10 shrink-0 mt-10 lg:mt-0">
          <ControleExibicaoEventos
            dataSelecionada={dataSelecionada}
            setDataSelecionada={setDataSelecionada}
            visualizacao={visualizacao}
            setVisualizacao={setVisualizacao}
            onNovoEvento={refetch}
            quantidade={resumoDia.quantidade}
            faturamento={resumoDia.faturamento}
          />
        </div>

        <div className="flex-1 md:pl-4">
          {visualizacao === "dia" && (
            <EventosDia
              dataSelecionada={dataSelecionada}
              setDataSelecionada={setDataSelecionada}
              eventos={eventos}
              loading={loading}
              error={error}
              onRefetch={refetch}
            />
          )}

          {visualizacao === "mes" && (
            <EventosMes
              dataSelecionada={dataSelecionada}
              setDataSelecionada={setDataSelecionada}
              setVisualizacao={setVisualizacao}
            />
          )}
        </div>
      </div>
    </main>
  );
}