import { useState } from "react"
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date"
import { useAgendamentos } from "../../hooks/agendamentos/useAgendamentos"
import { ControleExibicao } from "./components/ControleExibicao"
import { AgendamentosDia } from "./components/AgendamentosDia"
import { AgendamentosMes } from "./components/AgendamentosMes"

export function AgendamentosPage() {
    const [dataSelecionada, setDataSelecionada] = useState<CalendarDate>(
        today(getLocalTimeZone())
    )

    const [visualizacao, setVisualizacao] = useState<"dia" | "mes">("dia")
    const { agendamentos, loading, error, refetch } = useAgendamentos(dataSelecionada)

    return (
        <main className="px-12 pb-12 mt-10">
            <div className="flex flex-col-reverse md:flex-row md:items-start items-center">
                <div className="sticky top-10 shrink-0 mt-10 lg:mt-0">
                    <ControleExibicao
                        dataSelecionada={dataSelecionada}
                        setDataSelecionada={setDataSelecionada}
                        visualizacao={visualizacao}
                        setVisualizacao={setVisualizacao}
                        onNovoAgendamento={refetch}
                    />
                </div>

                <div className="flex-1 md:pl-4">
                    {visualizacao === "dia" && (
                        <AgendamentosDia
                            dataSelecionada={dataSelecionada}
                            setDataSelecionada={setDataSelecionada}
                            agendamentos={agendamentos}
                            loading={loading}
                            error={error}
                        />
                    )}

                    {visualizacao === "mes" && (
                        <AgendamentosMes
                            dataSelecionada={dataSelecionada}
                            setDataSelecionada={setDataSelecionada}
                            setVisualizacao={setVisualizacao}
                        />
                    )}
                </div>
            </div>


        </main>
    )
}