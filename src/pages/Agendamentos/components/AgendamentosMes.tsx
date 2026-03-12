import { CalendarDate, getLocalTimeZone } from "@internationalized/date"
import { HugeiconsIcon } from "@hugeicons/react"
import { CircleArrowLeft01Icon, CircleArrowRight01Icon } from "@hugeicons/core-free-icons"

interface Props {
    dataSelecionada: CalendarDate
    setDataSelecionada: (data: CalendarDate) => void
    setVisualizacao: (v: 'mes' | 'dia') => void
}

interface DiaCalendario {
    dia: number
    mes: 'anterior' | 'atual' | 'proximo'
}

const DIAS_SEMANA_DESKTOP = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
const DIAS_SEMANA_MOBILE = ["D", "S", "T", "Q", "Q", "S", "S"]

const MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

// Simulação — substitua pelos dados reais
const DIAS_COM_EVENTOS = [1, 3, 4, 5, 10, 14, 15, 16, 18, 19, 22, 24, 27]

interface Agendamento {
    turno: 'morning' | 'afternoon' | 'night'
    quantidade: number
}

// Simulação — substitua pelos dados reais
const AGENDAMENTOS_POR_DIA: Record<number, Agendamento[]> = {
    1:  [{ turno: 'morning', quantidade: 1 }, { turno: 'afternoon', quantidade: 1 }, { turno: 'night', quantidade: 1 }],
    3:  [{ turno: 'morning', quantidade: 1 }, { turno: 'afternoon', quantidade: 1 }, { turno: 'night', quantidade: 1 }],
    4:  [{ turno: 'afternoon', quantidade: 2 }, { turno: 'night', quantidade: 1 }],
    5:  [{ turno: 'morning', quantidade: 1 }],
    10: [{ turno: 'morning', quantidade: 1 }],
    14: [{ turno: 'afternoon', quantidade: 2 }, { turno: 'night', quantidade: 1 }],
    18: [{ turno: 'morning', quantidade: 1 }, { turno: 'afternoon', quantidade: 1 }],
    19: [{ turno: 'afternoon', quantidade: 2 }, { turno: 'night', quantidade: 1 }],
    22: [{ turno: 'morning', quantidade: 1 }, { turno: 'afternoon', quantidade: 1 }],
    24: [{ turno: 'morning', quantidade: 1 }, { turno: 'afternoon', quantidade: 1 }, { turno: 'night', quantidade: 3 }],
    27: [{ turno: 'morning', quantidade: 1 }, { turno: 'afternoon', quantidade: 1 }, { turno: 'night', quantidade: 3 }],
}

const COR_TURNO = {
    morning:   'bg-morning',
    afternoon: 'bg-afternoon',
    night:     'bg-night',
}

const LABEL_TURNO = {
    morning:   'Manhã',
    afternoon: 'Tarde',
    night:     'Noite',
}

export function AgendamentosMes({ dataSelecionada, setDataSelecionada, setVisualizacao }: Props) {

    const jsDate = dataSelecionada.toDate(getLocalTimeZone())
    const mes = jsDate.getMonth()
    const ano = jsDate.getFullYear()

    const primeiroDiaMes = new Date(ano, mes, 1).getDay()
    const diasNoMes = new Date(ano, mes + 1, 0).getDate()
    const diasNoMesAnterior = new Date(ano, mes, 0).getDate()

    const diasCalendario: DiaCalendario[] = []

    for (let i = primeiroDiaMes - 1; i >= 0; i--) {
        diasCalendario.push({ dia: diasNoMesAnterior - i, mes: 'anterior' })
    }
    for (let i = 1; i <= diasNoMes; i++) {
        diasCalendario.push({ dia: i, mes: 'atual' })
    }
    let diaProximo = 1
    while (diasCalendario.length < 35) {
        diasCalendario.push({ dia: diaProximo++, mes: 'proximo' })
    }

    function mesAnterior() {
        setDataSelecionada(dataSelecionada.subtract({ months: 1 }))
    }

    function proximoMes() {
        setDataSelecionada(dataSelecionada.add({ months: 1 }))
    }

    function irParaDia(dia: number) {
        setDataSelecionada(new CalendarDate(ano, mes + 1, dia))
        setVisualizacao('dia')
    }

    // Dias do mês atual que têm eventos, em ordem
    const diasComEventos = Object.keys(AGENDAMENTOS_POR_DIA)
        .map(Number)
        .filter(d => d >= 1 && d <= diasNoMes)
        .sort((a, b) => a - b)

    return (
        <div className="bg-white rounded-2xl shadow p-6">

            {/* Header — igual nos dois layouts */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <button onClick={mesAnterior} className="cursor-pointer">
                    <HugeiconsIcon icon={CircleArrowLeft01Icon} size={22} />
                </button>
                <h2 className="text-lg font-semibold">
                    {MESES[mes]} {ano}
                </h2>
                <button onClick={proximoMes} className="cursor-pointer">
                    <HugeiconsIcon icon={CircleArrowRight01Icon} size={22} />
                </button>
            </div>

            {/* ── DESKTOP ── */}
            <div className="hidden md:block">
                <div className="grid grid-cols-7 text-center text-sm mb-2">
                    {DIAS_SEMANA_DESKTOP.map((dia) => (
                        <div key={dia} className="font-medium">{dia}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 grid-rows-5 border rounded-xl overflow-hidden">
                    {diasCalendario.map((item, index) => (
                        <div
                            key={index}
                            className={`border h-28 p-2 flex flex-col ${item.mes !== 'atual' ? 'bg-gray-100' : ''}`}
                        >
                            <span className={`text-sm mb-2 ${item.mes !== 'atual' ? 'text-gray-400' : 'text-gray-800'}`}>
                                {String(item.dia).padStart(2, '0')}
                            </span>

                            {item.mes === 'atual' && (
                                <div className="flex gap-1 flex-wrap justify-center mt-2">
                                    <button onClick={() => irParaDia(item.dia)} className="w-6 h-6 rounded-full bg-morning text-white text-xs flex items-center justify-center cursor-pointer">01</button>
                                    <button onClick={() => irParaDia(item.dia)} className="w-6 h-6 rounded-full bg-afternoon text-white text-xs flex items-center justify-center cursor-pointer">01</button>
                                    <button onClick={() => irParaDia(item.dia)} className="w-6 h-6 rounded-full bg-night text-white text-xs flex items-center justify-center cursor-pointer">01</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── MOBILE ── */}
            <div className="md:hidden">

                {/* Grade compacta */}
                <div className="grid grid-cols-7 text-center text-xs mb-1">
                    {DIAS_SEMANA_MOBILE.map((dia, i) => (
                        <div key={i} className="font-medium text-gray-500 py-1">{dia}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 border rounded-xl overflow-hidden mb-6">
                    {diasCalendario.map((item, index) => {
                        const temEvento = item.mes === 'atual' && DIAS_COM_EVENTOS.includes(item.dia)

                        return (
                            <button
                                key={index}
                                onClick={() => item.mes === 'atual' && irParaDia(item.dia)}
                                className={`
                                    border aspect-square flex flex-col items-center justify-center gap-0.5 p-1
                                    ${item.mes !== 'atual' ? 'bg-gray-100' : ''}
                                    ${temEvento ? 'cursor-pointer' : 'cursor-default'}
                                `}
                            >
                                <span className={`text-xs font-medium leading-none ${
                                    item.mes !== 'atual'
                                        ? 'text-gray-300'
                                        : temEvento
                                            ? 'text-gray-900'
                                            : 'text-gray-400'
                                }`}>
                                    {String(item.dia).padStart(2, '0')}
                                </span>

                                {/* Dot indicador de evento */}
                                {temEvento && (
                                    <span className="w-1 h-1 rounded-full bg-morning mt-0.5" />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Lista de agendamentos do mês */}
                <div className="flex flex-col gap-3">
                    {diasComEventos.map((dia) => {
                        const agendamentos = AGENDAMENTOS_POR_DIA[dia]
                        const dataFormatada = new Date(ano, mes, dia)
                            .toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

                        return (
                            <button
                                key={dia}
                                onClick={() => irParaDia(dia)}
                                className="w-full text-left border rounded-xl p-3 hover:bg-gray-50 cursor-pointer"
                            >
                                {/* Data */}
                                <p className="text-sm font-semibold text-gray-700 capitalize mb-2">
                                    {dataFormatada}
                                </p>

                                {/* Bolinhas com quantidade */}
                                <div className="flex gap-2">
                                    {agendamentos.map((ag, i) => (
                                        <div key={i} className="flex items-center gap-1">
                                            <span className={`w-5 h-5 rounded-full ${COR_TURNO[ag.turno]} text-white text-xs flex items-center justify-center`}>
                                                {String(ag.quantidade).padStart(2, '0')}
                                            </span>
                                            <span className="text-xs text-gray-500">{LABEL_TURNO[ag.turno]}</span>
                                        </div>
                                    ))}
                                </div>
                            </button>
                        )
                    })}
                </div>

            </div>

        </div>
    )
}