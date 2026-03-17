import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Tabs,
    Tab,
} from "@heroui/react"
import { AbaNovoPagamento } from "../components/AbaNovoPagamento";
import { AbaHistoricoPagamentos } from "../components/AbaHistoricoPagamentos";

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function ModalPagamentosAluno({ isOpen, onOpenChange }: Props) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            size="5xl"
            scrollBehavior="inside"
            classNames={{
                wrapper: "px-4",
                closeButton: "text-white hover:bg-white/40 cursor-pointer p-1"
            }}
            className="rounded-t-xl"
        >
            <ModalContent>
                    <>
                        <ModalHeader className="flex justify-center gradient-background text-white rounded-t-xl">
                            Pagamentos
                        </ModalHeader>

                        <ModalBody className="my-4">
                            <Tabs
                                aria-label="Pagamentos"
                                classNames={{
                                    tabList: "mx-auto",
                                    cursor: "bg-maingreen",
                                    tab: "data-[selected=true]:text-white",
                                    tabContent: "group-data-[selected=true]:text-white"
                                }}>
                                <Tab key="novo" title="Novo pagamento">
                                    <AbaNovoPagamento />
                                </Tab>

                                <Tab key="historico" title="Histórico de pagamentos">
                                    <AbaHistoricoPagamentos />
                                </Tab>
                            </Tabs>
                        </ModalBody>
                    </>
            </ModalContent>
        </Modal>
    )
}