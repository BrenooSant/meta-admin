import { HugeiconsIcon } from "@hugeicons/react"
import { SunCloud02Icon, Sun02Icon, Moon02Icon, CircleArrowLeft01Icon, CircleArrowRight01Icon, CalendarLock01Icon, UserCircleIcon, TennisBallIcon } from "@hugeicons/core-free-icons"
import { CalendarDate, getLocalTimeZone } from "@internationalized/date"

interface Props {
    dataSelecionada: CalendarDate
    setDataSelecionada: (data: CalendarDate) => void
}

const DIAS_SEMANA = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]

export function AgendamentosDia({ dataSelecionada, setDataSelecionada }: Props) {
    const jsDate = dataSelecionada.toDate(getLocalTimeZone())
    const diaSemana = DIAS_SEMANA[jsDate.getDay()]
    const dataFormatada = dataSelecionada.toString().split("-").reverse().join("/")

    const avancar = () => setDataSelecionada(dataSelecionada.add({ days: 1 }))
    const retroceder = () => setDataSelecionada(dataSelecionada.subtract({ days: 1 }))

    return (
        <div className="w-full flex flex-col items-center md:block">
            <div className="flex flex-col items-center justify-center">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4">
                    <button className="cursor-pointer" onClick={retroceder}>
                        <HugeiconsIcon icon={CircleArrowLeft01Icon} />
                    </button>

                    <p className="font-montserrat font-bold text-maingreen text-center">
                        {diaSemana}, {dataFormatada}
                    </p>

                    <button className="cursor-pointer" onClick={avancar}>
                        <HugeiconsIcon icon={CircleArrowRight01Icon} />
                    </button>
                </div>


                <button className="flex mt-2 gap-x-2 items-center cursor-pointer text-secondarygreen">
                    <HugeiconsIcon icon={CalendarLock01Icon} size={20} />
                    <p className="font-montserrat text-sm">Ajustar Disponibilidade</p>
                </button>
            </div>

            <div className="mt-6 md:ml-12 space-y-6">
                <section>
                    <div className="flex text-sm items-center gap-x-2 text-morning">
                        <HugeiconsIcon icon={SunCloud02Icon} size={32} />
                        <p className="font-montserrat font-semibold text-lg">Manhã</p>
                    </div>

                    <div className="flex overflow-x-auto scrollbar-hide overflow-y-visible gap-x-4 py-3 px-3 md:px-1 pb-6 md:pb-2 md:grid md:grid-cols-6 md:gap-y-4 rounded-2xl">
                        <button className="card-day">
                            <div className="bg-maingreen rounded-t-2xl px-8 py-1.5 font-montserrat text-white">
                                <p className="text-center">09:00</p>
                            </div>
                            <div className="flex flex-col border-x-1 border-b-1 rounded-b-2xl border-maingreen justify-center py-2 px-1 gap-y-1">
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Carlos Silva</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Quadra 01</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={TennisBallIcon} size={24} />
                                    <p className="text-sm">Beach Tênnis</p>
                                </div>
                            </div>
                        </button>

                        <button className="card-day">
                            <div className="bg-maingreen rounded-t-2xl px-8 py-1.5 font-montserrat text-white">
                                <p className="text-center">09:00</p>
                            </div>
                            <div className="flex flex-col border-x-1 border-b-1 rounded-b-2xl border-maingreen justify-center py-2 px-1 gap-y-1">
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Carlos Silva</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Quadra 01</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={TennisBallIcon} size={24} />
                                    <p className="text-sm">Beach Tênnis</p>
                                </div>
                            </div>
                        </button>

                        <button className="card-day">
                            <div className="bg-maingreen rounded-t-2xl px-8 py-1.5 font-montserrat text-white">
                                <p className="text-center">09:00</p>
                            </div>
                            <div className="flex flex-col border-x-1 border-b-1 rounded-b-2xl border-maingreen justify-center py-2 px-1 gap-y-1">
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Carlos Silva</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Quadra 01</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={TennisBallIcon} size={24} />
                                    <p className="text-sm">Beach Tênnis</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                <section>
                    <div className="flex text-sm items-center gap-x-2 text-afternoon">
                        <HugeiconsIcon icon={Sun02Icon} size={32} />
                        <p className="font-montserrat font-semibold text-lg">Tarde</p>
                    </div>

                    <div className="flex overflow-x-auto overflow-y-visible gap-x-4 py-3 px-3 md:px-1 pb-6 md:pb-2 md:grid md:grid-cols-6 md:gap-y-4 rounded-2xl">
                        <button className="card-day">
                            <div className="bg-maingreen rounded-t-2xl px-8 py-1.5 font-montserrat text-white">
                                <p className="text-center">08:00</p>
                            </div>
                            <div className="flex flex-col border-x-1 border-b-1 rounded-b-2xl border-maingreen justify-center py-2 px-1 gap-y-1">
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Carlos Silva</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Quadra 01</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={TennisBallIcon} size={24} />
                                    <p className="text-sm">Beach Tênnis</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                <section>
                    <div className="flex text-sm items-center gap-x-2 text-night">
                        <HugeiconsIcon icon={Moon02Icon} size={32} />
                        <p className="font-montserrat font-semibold text-lg">Noite</p>
                    </div>

                    <div className="flex overflow-x-auto overflow-y-visible gap-x-4 py-3 px-3 md:px-1 pb-6 md:pb-2 md:grid md:grid-cols-6 md:gap-y-4 rounded-2xl">
                        <button className="card-day">
                            <div className="bg-maingreen rounded-t-2xl px-8 py-1.5 font-montserrat text-white">
                                <p className="text-center">08:00</p>
                            </div>
                            <div className="flex flex-col border-x-1 border-b-1 rounded-b-2xl border-maingreen justify-center py-2 px-1 gap-y-1">
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Carlos Silva</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                                    <p className="text-sm">Quadra 01</p>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <HugeiconsIcon icon={TennisBallIcon} size={24} />
                                    <p className="text-sm">Beach Tênnis</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}