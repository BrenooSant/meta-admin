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

export function ModalAddAluno({ isOpen, onOpenChange }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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

            <ModalBody className="flex gap-x-6 mt-4">
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