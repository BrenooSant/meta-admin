import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons"

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ModalNovoAgendamento({ isOpen, onOpenChange }: Props) {
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
            <ModalHeader className="flex justify-center bg-maingreen text-white">
              Novo Agendamento
            </ModalHeader>

            <ModalBody className="flex flex-col gap-y-3 mt-3">
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

            <ModalFooter className="flex justify-center">
              <button onClick={onClose} className="cancel-button">
                Cancelar
              </button>

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