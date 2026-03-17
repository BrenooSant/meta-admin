import { useState } from "react";
import { Calendar, Input, type DateValue } from "@heroui/react"
import { CalendarDate } from "@internationalized/date";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

export function AbaNovoPagamento() {
    const [valor, setValor] = useState("0")
    const [dataPagamento, setDataPagamento] = useState<CalendarDate | null>(null)
    const [dataVencimento, setDataVencimento] = useState<CalendarDate | null>(null)
    const [comprovante, setComprovante] = useState<File | null>(null)


    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const apenasDigitos = e.target.value.replace(/\D/g, "")
        const numero = apenasDigitos.replace(/^0+/, "") || "0"
        setValor(numero)
    }

    const formatarValor = (valor: string) => {
        const padded = valor.padStart(3, "0")
        const reais = padded.slice(0, -2)
        const centavos = padded.slice(-2)
        const reaisFormatado = Number(reais).toLocaleString("pt-BR")
        return `${reaisFormatado},${centavos}`
    }
    const valorPreenchido = valor !== "0"

    const formatarData = (data: CalendarDate | null) => {
        if (!data) return "Não selecionada"
        return `${String(data.day).padStart(2, "0")}/${String(data.month).padStart(2, "0")}/${data.year}`
    }

    const handleDataPagamento = (value: DateValue) => {
        setDataPagamento(value as CalendarDate)
    }

    const handleDataVencimento = (value: DateValue) => {
        setDataVencimento(value as CalendarDate)
    }

    const handleAnexar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setComprovante(file)
    }

    return (
        <div className="flex flex-col lg:flex-row justify-between gap-y-10">
            <div className="grid lg:grid-cols-2 gap-x-4 gap-y-4">
                <div className="flex flex-col items-center gap-y-1">
                    <p className="text-center">Data de Pagamento</p>
                    <Calendar
                        aria-label="Date (Uncontrolled)"
                        onChange={handleDataPagamento}
                        classNames={{
                            cellButton: `data-[selected=true]:bg-maingreen data-[selected=true]:text-white`
                        }}
                    />
                </div>

                <div className="flex flex-col items-center gap-y-1">
                    <p className="text-center">Data de Vencimento</p>
                    <Calendar
                        aria-label="Date (Uncontrolled)"
                        onChange={handleDataVencimento}
                        classNames={{
                            cellButton: `data-[selected=true]:bg-maingreen data-[selected=true]:text-white`
                        }}
                    />
                </div>
                <div>
                    <p>Valor da mensalidade</p>
                    <Input
                        placeholder="0,00"
                        aria-label="Valor da mensalidade"
                        type="text"
                        inputMode="numeric"
                        value={formatarValor(valor)}
                        onChange={handleValorChange}
                        startContent={
                            <span className="text-gray-500 text-sm select-none">R$</span>
                        }
                        classNames={{
                            innerWrapper: "flex items-center gap-2 bg-lightblue py-3 px-4 rounded-xl",
                            input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                            inputWrapper: "p-0",
                        }}
                    />
                </div>

                <div>
                    <p>Anexar Comprovante</p>
                    {comprovante ? (
                        <div className="rounded-xl border w-full border-maingreen px-1.5 py-2 flex items-center justify-between gap-2">
                            <p className="text-sm truncate max-w-60 lg:max-w-50">{comprovante.name}</p>
                            <button
                                onClick={() => setComprovante(null)}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer shrink-0"
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className="rounded-xl border w-full border-maingreen px-1.5 py-2 cursor-pointer
            hover:bg-secondarygreen/30 transition-all duration-200 flex items-center justify-center">
                            <p className="text-sm">Anexar comprovante aqui</p>
                            <input
                                type="file"
                                accept=".png,.jpeg,.jpg,.pdf"
                                className="hidden"
                                onChange={handleAnexar}
                            />
                        </label>
                    )}
                </div>
            </div>


            <div className="hidden lg:block bg-gray-300 w-0.5 rounded-3xl" />

            <div className="space-y-4">
                <div>
                    <p>Informações do novo pagamento</p>
                    <div className="bg-maingreen text-white text-sm rounded-2xl p-4 lg:min-w-90 mt-1">
                        <div className="space-y-1">
                            <p>Aluno:</p>
                            <p>
                                Data de Pagamento:{" "}
                                <span className="font-semibold">{formatarData(dataPagamento)}</span>
                            </p>
                            <p>
                                Data de Vencimento:{" "}
                                <span className="font-semibold">{formatarData(dataVencimento)}</span>
                            </p>
                            <p>
                                Valor da mensalidade:{" "}
                                <span className="font-semibold">
                                    {valorPreenchido ? `R$ ${formatarValor(valor)}` : "Não informado"}
                                </span>
                            </p>
                        </div>
                        <p className={`mt-4 ${comprovante ? "text-activeuser" : "text-inativeuser"}`}>
                            {comprovante ? "Comprovante anexado" : "Comprovante não anexado"}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="button-g py-2 rounded-xl">
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    )
}