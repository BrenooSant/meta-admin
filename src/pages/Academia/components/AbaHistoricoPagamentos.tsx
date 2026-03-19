import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserCircleIcon } from '@hugeicons/core-free-icons'
import { uploadComprovante } from "../../../hooks/useCloudinary"
import { type Aluno } from "../../../hooks/useAlunos"
import { type Pagamento } from "../../../hooks/usePagamentosAluno"

interface Props {
    aluno: Aluno | null
    pagamentos: Pagamento[]
    loading: boolean
    pagina: number
    totalPaginas: number
    irParaPagina: (p: number) => void
    atualizarComprovante: (id: string, url: string) => Promise<boolean>
}

export function AbaHistoricoPagamentos({ aluno, pagamentos, loading, pagina, totalPaginas, irParaPagina, atualizarComprovante }: Props) {
    const [uploadingId, setUploadingId] = useState<string | null>(null)

    async function handleAnexar(pagamentoId: string, file: File) {
        setUploadingId(pagamentoId)
        const url = await uploadComprovante(file)
        if (url) await atualizarComprovante(pagamentoId, url)
        setUploadingId(null)
    }

    if (loading) return (
        <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-3 border-gray-200 border-t-maingreen animate-spin" />
        </div>
    )

    if (pagamentos.length === 0) return (
        <p className="text-center text-gray-400 py-8 text-sm">Nenhum pagamento encontrado.</p>
    )

    const BotaoComprovante = ({ pagamento }: { pagamento: typeof pagamentos[0] }) => {
        if (uploadingId === pagamento.id) return (
            <span className="text-xs text-gray-400">Enviando...</span>
        )

        if (pagamento.payment_receipt_url) return (
            <button
                onClick={() => {
                    const url = pagamento.payment_receipt_url!
                    const isPdf = url.toLowerCase().includes('.pdf')

                    if (isPdf) {
                        window.open(`/comprovante?url=${encodeURIComponent(url)}`, '_blank')
                    } else {
                        window.open(url, '_blank')
                    }
                }}
                className="px-3 py-1 text-xs rounded-md border border-maingreen text-maingreen hover:bg-maingreen/10 transition-colors cursor-pointer"
            >
                Ver Comprovante
            </button>
        )

        return (
            <label className="px-3 py-1 text-xs rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                Anexar Comprovante
                <input
                    type="file"
                    accept=".png,.jpeg,.jpg,.pdf"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAnexar(pagamento.id, f) }}
                />
            </label>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Desktop */}
            <div className="hidden md:block w-full overflow-x-auto rounded-2xl border">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-maingreen text-white">
                            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Nome Completo</th>
                            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Data do Pagamento</th>
                            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Comprovante</th>
                            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagamentos.map((p) => (
                            <tr key={p.id} className="border-b border-gray-200">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <HugeiconsIcon icon={UserCircleIcon} size={20} />
                                        {aluno?.nome}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">{p.paid_at_formatado}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                    <BotaoComprovante pagamento={p} />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                    R$ {p.amount.toFixed(2).replace('.', ',')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-3 md:hidden">
                {pagamentos.map((p) => (
                    <div key={p.id} className="rounded-2xl border p-4 flex flex-col gap-2 text-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-medium">
                                <HugeiconsIcon icon={UserCircleIcon} size={20} />
                                {aluno?.nome}
                            </div>
                            <span className="font-semibold">R$ {p.amount.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            Pagamento: <span className="text-gray-800">{p.paid_at_formatado}</span>
                        </div>
                        <div className="flex justify-end pt-1">
                            <BotaoComprovante pagamento={p} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                        onClick={() => irParaPagina(pagina - 1)}
                        disabled={pagina === 1}
                        className="px-3 py-1 text-sm rounded-lg border border-maingreen text-maingreen disabled:opacity-30 disabled:cursor-not-allowed hover:bg-maingreen/10 cursor-pointer"
                    >
                        Anterior
                    </button>

                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => irParaPagina(p)}
                            className={`w-8 h-8 text-sm rounded-lg border transition-colors cursor-pointer
                                ${p === pagina
                                    ? 'bg-maingreen text-white border-maingreen'
                                    : 'border-maingreen text-maingreen hover:bg-maingreen/10'
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => irParaPagina(pagina + 1)}
                        disabled={pagina === totalPaginas}
                        className="px-3 py-1 text-sm rounded-lg border border-maingreen text-maingreen disabled:opacity-30 disabled:cursor-not-allowed hover:bg-maingreen/10 cursor-pointer"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    )
}