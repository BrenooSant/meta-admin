import { Input, Select, SelectItem } from "@heroui/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { useDisclosure } from "@heroui/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { TabelaAlunos } from "./components/TabelaAlunos"
import { ModalAddAluno } from "./modals/ModalAddAluno"

export function AcademiaPage() {
    const { isOpen: isOpenNewAluno, onOpen: onOpenNewAluno, onOpenChange: onOpenChangeNewAluno } = useDisclosure()

    return (
        <main className="px-12 pb-12 mt-10">
            <div className="flex flex-col lg:flex-row lg:justify-between items-center">
                <div className="mb-5 lg:mb-0">
                    <p className="font-montserrat font-semibold text-2xl text-maingreen">
                        Alunos
                    </p>
                </div>

                <div className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:gap-x-4">
                    <Input
                        placeholder="Buscar aluno..."
                        aria-label="Buscar aluno"
                        type="text"
                        classNames={{
                            innerWrapper: "flex items-center gap-2 bg-white py-3 px-4 rounded-xl min-w-90 border border-maingreen",
                            input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0 placeholder:!text-maingreen/80 !text-maingreen",
                            inputWrapper: "p-0",
                        }}
                    >
                    </Input>

                    <Select
                        aria-label="Escolha uma atividade"
                        className="min-w-40"
                        placeholder="Todos"
                        classNames={{
                            trigger: "bg-white border border-maingreen data-[hover=true]:bg-maingreen/10 hover:cursor-pointer transition-all duration-200",
                            value: "!text-maingreen/80 data-[placeholder=true]:text-maingreen",
                            selectorIcon: "!text-maingreen/80",
                            popoverContent: "border border-!maingreen rounded-xl",
                        }}
                    >
                        <SelectItem
                            classNames={{
                                base: "data-[hover=true]:!bg-activeuser/10 data-[selected=true]:!bg-maingreen/10",
                                selectedIcon: "text-maingreen"
                            }}
                        >
                            Ativo
                        </SelectItem>
                        <SelectItem
                            classNames={{
                                base: "data-[hover=true]:!bg-expireduser/10 data-[selected=true]:!bg-maingreen/10",
                                selectedIcon: "text-maingreen"
                            }}
                        >
                            Expirado
                        </SelectItem>
                        <SelectItem
                            classNames={{
                                base: "data-[hover=true]:!bg-inativeuser/10 data-[selected=true]:!bg-maingreen/10",
                                selectedIcon: "text-maingreen"
                            }}
                        >
                            Inativo
                        </SelectItem>
                    </Select>

                    <button
                        className="flex justify-center items-center rounded-full border 
                        border-maingreen p-2 w-fit cursor-pointer hover:bg-maingreen/10
                        transition-all duration-200
                        " 
                        onClick={onOpenNewAluno}>
                        <HugeiconsIcon icon={PlusSignIcon} size={20} className="text-maingreen" />
                    </button>
                </div>
            </div>

            <div className="mt-5">
                <TabelaAlunos />
            </div>

            <ModalAddAluno
                isOpen={isOpenNewAluno}
                onOpenChange={onOpenChangeNewAluno}
            />
        </main>
    )
}