import { useDisclosure } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react"
import { UserCircleIcon, Money03Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { ModalInfoAluno } from "../modals/ModalInfoAluno";
import { ModalPagamentosAluno } from "../modals/ModalPagamentosAluno";

type Status = "ativo" | "inativo" | "expirado"

interface Aluno {
  id: number
  nome: string
  telefone: string
  ultimoPagamento: string
  dataVencimento: string
  mensalidade: string
  status: Status
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "border-[var(--color-activeuser)] text-[var(--color-activeuser)]" },
  inativo: { label: "Inativo", className: "border-[var(--color-inativeuser)] text-[var(--color-inativeuser)]" },
  expirado: { label: "Expirado", className: "border-[var(--color-expireduser)] text-[var(--color-expireduser)]" },
}

const alunosMock: Aluno[] = [
  { id: 1, nome: "Carlos Silva Castro", telefone: "(64) 90000-0000", ultimoPagamento: "20 de janeiro de 2026", dataVencimento: "20 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "ativo" },
  { id: 2, nome: "Fernanda Lima Souza", telefone: "(62) 91111-1111", ultimoPagamento: "15 de janeiro de 2026", dataVencimento: "15 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "expirado" },
  { id: 3, nome: "Rafael Mendes Borges", telefone: "(61) 92222-2222", ultimoPagamento: "10 de janeiro de 2026", dataVencimento: "10 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "ativo" },
  { id: 4, nome: "Juliana Costa Pires", telefone: "(64) 93333-3333", ultimoPagamento: "05 de janeiro de 2026", dataVencimento: "05 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "inativo" },
  { id: 5, nome: "Bruno Alves Teixeira", telefone: "(62) 94444-4444", ultimoPagamento: "20 de janeiro de 2026", dataVencimento: "20 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "ativo" },
  { id: 6, nome: "Mariana Rocha Dias", telefone: "(61) 95555-5555", ultimoPagamento: "18 de janeiro de 2026", dataVencimento: "18 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "ativo" },
  { id: 7, nome: "Lucas Ferreira Nunes", telefone: "(64) 96666-6666", ultimoPagamento: "12 de janeiro de 2026", dataVencimento: "12 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "expirado" },
  { id: 8, nome: "Patrícia Gomes Leal", telefone: "(62) 97777-7777", ultimoPagamento: "08 de janeiro de 2026", dataVencimento: "08 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "inativo" },
  { id: 9, nome: "Thiago Martins Cunha", telefone: "(61) 98888-8888", ultimoPagamento: "20 de janeiro de 2026", dataVencimento: "20 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "ativo" },
  { id: 10, nome: "Camila Barros Vieira", telefone: "(64) 99999-9999", ultimoPagamento: "01 de janeiro de 2026", dataVencimento: "01 de fevereiro de 2026", mensalidade: "R$ 80,00", status: "expirado" },
]

export function TabelaAlunos() {
  const { isOpen: isOpenInfo, onOpen: onOpenInfo, onOpenChange: onOpenChangeInfo } = useDisclosure()
  const { isOpen: isOpenPagamento, onOpen: onOpenPagamento, onOpenChange: onOpenChangePagamento } = useDisclosure()

  return (
    <>
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-maingreen text-white">
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Nome Completo</th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Telefone</th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Último Pagamento</th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Data de Vencimento</th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Mensalidade</th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Informações</th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Pagamentos</th>
            </tr>
          </thead>
          <tbody>
            {alunosMock.map((aluno) => {
              const { label, className } = statusConfig[aluno.status]
              return (
                <tr key={aluno.id} className="border-b border-gray-200">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserCircleIcon} size={20} />
                      {aluno.nome}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{aluno.telefone}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">{aluno.ultimoPagamento}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">{aluno.dataVencimento}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">{aluno.mensalidade}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium border ${className}`}>
                      {label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer" onClick={onOpenInfo}>
                      <HugeiconsIcon icon={InformationCircleIcon} size={18} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer" onClick={onOpenPagamento}>
                      <HugeiconsIcon icon={Money03Icon} size={18} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {alunosMock.map((aluno) => {
          const { label, className } = statusConfig[aluno.status]
          return (
            <div key={aluno.id} className="rounded-2xl border p-4 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                  <HugeiconsIcon icon={UserCircleIcon} size={20} />
                  {aluno.nome}
                </div>
                <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium border ${className}`}>
                  {label}
                </span>
              </div>

              <div className="text-gray-500">{aluno.telefone}</div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Último pagamento: <span className="text-gray-800">{aluno.ultimoPagamento}</span></span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Vencimento: <span className="text-gray-800">{aluno.dataVencimento}</span></span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="font-semibold text-gray-800">{aluno.mensalidade}</span>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button className="text-gray-400 hover:text-gray-700 transition-colors" onClick={onOpenInfo}>
                  <HugeiconsIcon icon={InformationCircleIcon} size={18} />
                </button>
                <button className="text-gray-400 hover:text-gray-700 transition-colors" onClick={onOpenPagamento}>
                  <HugeiconsIcon icon={Money03Icon} size={18} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <ModalInfoAluno
        isOpen={isOpenInfo}
        onOpenChange={onOpenChangeInfo}
      />

      <ModalPagamentosAluno
        isOpen={isOpenPagamento}
        onOpenChange={onOpenChangePagamento}
      />
    </>
  )
}