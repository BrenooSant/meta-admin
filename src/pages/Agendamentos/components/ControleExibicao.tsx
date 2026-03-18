import { HugeiconsIcon } from "@hugeicons/react"
import { Appointment02Icon, MoneyAdd02Icon } from "@hugeicons/core-free-icons"
import { Calendar, useDisclosure } from "@heroui/react"
import { CalendarDate } from "@internationalized/date";
import { ModalNovoAgendamento } from "../modals/ModalNovoAgendamento";

interface Props {
    dataSelecionada: CalendarDate
    setDataSelecionada: (data: CalendarDate) => void
    visualizacao: "dia" | "mes"
    setVisualizacao: (v: "dia" | "mes") => void
    onNovoAgendamento: () => void
}


export function ControleExibicao({ dataSelecionada, setDataSelecionada, visualizacao, setVisualizacao, onNovoAgendamento }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <div className="flex flex-col">
            <div className="max-w-fit border p-5 rounded-2xl shadow-lg">
                <div className="flex justify-center">
                    <Calendar
                        aria-label="Date (Uncontrolled)"
                        value={dataSelecionada}
                        onChange={setDataSelecionada}
                        focusedValue={dataSelecionada}
                        onFocusChange={setDataSelecionada}
                        classNames={{
                            cellButton: `data-[selected=true]:bg-maingreen data-[selected=true]:text-white`
                        }}
                    />
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-x-2">
                        <HugeiconsIcon icon={Appointment02Icon} size={20} />
                        <span className="text-xs font-medium">11 Horário(s) Marcado(s)</span>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <HugeiconsIcon icon={MoneyAdd02Icon} size={20} />
                        <span className="text-xs font-medium">Faturamento Previsto: R$ 6060,00</span>
                    </div>
                </div>
            </div>


            <div className="mt-4 flex flex-col justify-center">
                <button className="button-g" onClick={onOpen}>
                    Adicionar Agendamento
                </button>

                <div className="mt-4">
                    <p className="text-center">Configurações de Visualização</p>

                    <div className="flex justify-center gap-x-4 mt-2">
                        <button
                            onClick={() => setVisualizacao("dia")}
                            className={`flex-1 rounded-2xl py-2 cursor-pointer transition-all
                            ${visualizacao === "dia"
                                    ? "bg-maingreen text-white"
                                    : "border border-maingreen text-maingreen bg-transparent hover:bg-maingreen/10"
                                }`}>
                            Dia
                        </button>

                        <button
                            onClick={() => setVisualizacao("mes")}
                            className={`flex-1 rounded-2xl py-2 cursor-pointer transition-all
                            ${visualizacao === "mes"
                                    ? "bg-maingreen text-white"
                                    : "border border-maingreen text-maingreen bg-transparent hover:bg-maingreen/10"
                                }`}>
                            Mês
                        </button>
                    </div>
                </div>
            </div>

            <ModalNovoAgendamento
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onSuccess={onNovoAgendamento}
            />
        </div>
    )
}