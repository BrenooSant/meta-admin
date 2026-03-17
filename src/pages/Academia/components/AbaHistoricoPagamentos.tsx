import { HugeiconsIcon } from "@hugeicons/react"
import { UserCircleIcon } from '@hugeicons/core-free-icons';

interface Aluno {
  id: number
  nome: string
  dataPagamento: string
  comprovante: boolean
  mensalidade: string
}

const alunosMock: Aluno[] = [
    { id: 1, nome: "Carlos Silva Castro", dataPagamento: "20 de fevereiro de 2026", comprovante: true,  mensalidade: "R$ 80,00" },
    { id: 2, nome: "Fernanda Lima Souza", dataPagamento: "15 de fevereiro de 2026", comprovante: false, mensalidade: "R$ 80,00" },
    { id: 3, nome: "Rafael Mendes Borges", dataPagamento: "10 de fevereiro de 2026", comprovante: true, mensalidade: "R$ 80,00" },
    { id: 4, nome: "Juliana Costa Pires", dataPagamento: "05 de fevereiro de 2026", comprovante: false, mensalidade: "R$ 80,00" },
    { id: 5, nome: "Bruno Alves Teixeira", dataPagamento: "20 de fevereiro de 2026", comprovante: false, mensalidade: "R$ 80,00" },
    { id: 6, nome: "Mariana Rocha Dias", dataPagamento: "18 de fevereiro de 2026", comprovante: true, mensalidade: "R$ 80,00" },
]
export function AbaHistoricoPagamentos() {
    return (
        <div>
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
                        {alunosMock.map((aluno) => {
                            return (
                                <tr key={aluno.id} className="border-b border-gray-200">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <HugeiconsIcon icon={UserCircleIcon} size={20} />
                                            {aluno.nome}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">{aluno.dataPagamento}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                    {aluno.comprovante ? (
                                        <button className="px-3 py-1 text-xs rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                                            Ver Comprovante
                                        </button>
                                    ) : (
                                        <button className="px-3 py-1 text-xs rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                                            Anexar Comprovante
                                        </button>
                                    )}
                                </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">{aluno.mensalidade}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 md:hidden">
                {alunosMock.map((aluno) => (
                    <div key={aluno.id} className="rounded-2xl border p-4 flex flex-col gap-2 text-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-medium">
                                <HugeiconsIcon icon={UserCircleIcon} size={20} />
                                {aluno.nome}
                            </div>
                            <span className="font-semibold text-gray-800">{aluno.mensalidade}</span>
                        </div>
 
                        <div className="text-xs text-gray-500">
                            Pagamento: <span className="text-gray-800">{aluno.dataPagamento}</span>
                        </div>
 
                        <div className="flex justify-end pt-1">
                            {aluno.comprovante ? (
                                <button className="px-3 py-1 text-xs rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                                    Ver Comprovante
                                </button>
                            ) : (
                                <button className="px-3 py-1 text-xs rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                                    Anexar Comprovante
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}