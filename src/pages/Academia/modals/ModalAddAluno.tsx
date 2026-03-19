import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@heroui/react"
import { useGerenciarAluno } from "../../../hooks/academia/useGerenciarAluno"

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
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

export function ModalAddAluno({ isOpen, onOpenChange, onSuccess }: Props) {
  const [fullname, setFullname] = useState('')
  const [telefone, setTelefone] = useState('')
  const { adicionarAluno, loading, error } = useGerenciarAluno()

  const phoneNumeros = telefone.replace(/\D/g, '')
  const telefoneValido = phoneNumeros.length === 11 && phoneNumeros[2] === '9'
  const podeSalvar = fullname.trim() && telefoneValido

  function resetar() {
    setFullname('')
    setTelefone('')
  }

  async function handleSalvar(onClose: () => void) {
    if (!podeSalvar) return
    const ok = await adicionarAluno(fullname, phoneNumeros)
    if (ok) {
      resetar()
      onSuccess?.()
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) resetar(); onOpenChange(open) }}
      placement="center"
      classNames={{
        wrapper: "px-4",
        closeButton: "text-white hover:bg-white/40 cursor-pointer p-1"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center gradient-background text-white">
              Adicionar Aluno
            </ModalHeader>

            <ModalBody className="flex flex-col gap-y-3 mt-4">
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
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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