import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@heroui/react"
import { useGerenciarAluno } from "../../../hooks/useGerenciarAluno"
import { type Aluno } from "../../../hooks/useAlunos"

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  aluno: Aluno | null
  onSuccess?: () => void
}

function aplicarMascaraTelefone(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 2) return `(${nums}`
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`
}

const inputClass = {
  innerWrapper: "flex items-center gap-2 bg-lightblue py-3 px-4 rounded-xl",
  input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
  inputWrapper: "p-0",
}

const inputDisabledClass = {
  innerWrapper: "flex items-center gap-2 bg-gray-200 py-3 px-4 rounded-xl",
  input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
  inputWrapper: "p-0",
}

export function ModalInfoAluno({ isOpen, onOpenChange, aluno, onSuccess }: Props) {
  const [fullname, setFullname] = useState('')
  const [telefone, setTelefone] = useState('')
  const { atualizarAluno, loading, error } = useGerenciarAluno()

  // Preenche os campos quando o aluno muda
  useEffect(() => {
    if (aluno) {
      setFullname(aluno.nome)
      setTelefone(aplicarMascaraTelefone(aluno.telefone))
    }
  }, [aluno])

  const phoneNumeros = telefone.replace(/\D/g, '')
  const telefoneValido = phoneNumeros.length === 11 && phoneNumeros[2] === '9'
  const podeSalvar = fullname.trim() && telefoneValido

  async function handleSalvar(onClose: () => void) {
    if (!aluno || !podeSalvar) return
    const ok = await atualizarAluno(aluno.id, fullname, phoneNumeros)
    if (ok) {
      onSuccess?.()
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size="2xl"
      classNames={{
        wrapper: "px-4",
        closeButton: "text-white hover:bg-white/40 cursor-pointer p-1"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center gradient-background text-white">
              Informações do Aluno
            </ModalHeader>

            <ModalBody className="grid lg:grid-cols-2 gap-x-6 gap-y-3 mt-4">
              <Input
                placeholder="Nome Completo"
                aria-label="Nome Completo"
                value={fullname}
                onValueChange={setFullname}
                classNames={inputClass}
              />
              <Input
                placeholder="(XX) 9XXXX-XXXX"
                aria-label="Telefone"
                value={telefone}
                onValueChange={(v) => setTelefone(aplicarMascaraTelefone(v))}
                isInvalid={telefone.length > 0 && !telefoneValido}
                errorMessage="Telefone inválido"
                classNames={inputClass}
              />
              <Input
                placeholder="Data do Último Pagamento"
                aria-label="Data do Último Pagamento"
                value={aluno?.ultimoPagamento ?? '—'}
                isReadOnly
                classNames={inputDisabledClass}
              />
              <Input
                placeholder="Data de Vencimento"
                aria-label="Data de Vencimento"
                value={aluno?.dataVencimento ?? '—'}
                isReadOnly
                classNames={inputDisabledClass}
              />
              {error && <p className="text-red-500 text-sm text-center col-span-2">{error}</p>}
            </ModalBody>

            <ModalFooter className="flex justify-end">
              <button
                className="confirm-button disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!podeSalvar || loading}
                onClick={() => handleSalvar(onClose)}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}