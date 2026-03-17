import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react"

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ModalInfoAluno({ isOpen, onOpenChange }: Props) {
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

            <ModalBody className="grid lg:grid-cols-2 gap-x-6 mt-4">
              <Input
                placeholder="Nome Completo"
                aria-label="Nome Completo"
                type="text"
                classNames={{
                  innerWrapper: "flex items-center gap-2 bg-lightblue py-3 px-4 rounded-xl",
                  input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                  inputWrapper: "p-0",
                }}
              />

              <Input
                placeholder="Telefone"
                aria-label="Telefone"
                type="text"
                classNames={{
                  innerWrapper: "flex items-center gap-2 bg-lightblue py-3 px-4 rounded-xl",
                  input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                  inputWrapper: "p-0",
                }}
              />

              <Input
                placeholder="Data do Último Pagamento"
                aria-label="Data do Último Pagamento"
                disabled
                type="text"
                classNames={{
                  innerWrapper: "flex items-center gap-2 bg-gray-200 py-3 px-4 rounded-xl",
                  input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                  inputWrapper: "p-0",
                }}
              />

              <Input
                placeholder="Data de Vencimento"
                aria-label="Data de Vencimento"
                disabled
                type="text"
                classNames={{
                  innerWrapper: "flex items-center gap-2 bg-gray-200 py-3 px-4 rounded-xl",
                  input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                  inputWrapper: "p-0",
                }}
              />
            </ModalBody>

            <ModalFooter className="flex justify-end">
              <button className="confirm-button" onClick={onClose}>
                Salvar
              </button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}