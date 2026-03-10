import LogoMeta from "../../assets/logo-meta.png"
import { BodyPartMuscleIcon, Calendar03Icon, SaveMoneyDollarIcon, Settings01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useNavigate } from "react-router-dom"

export function Navbar() {
    const navigate = useNavigate()

    return (
        <header className="w-full bg-maingreen flex flex-row items-center px-12 py-2 text-white justify-between">
            <img src={LogoMeta} alt="Logo Meta Centro Esportivo" className="h-14" />

            <div className="flex flex-row gap-8">
                <button className="navbar-button" onClick={() => navigate("/agendamentos")}>
                    <HugeiconsIcon icon={Calendar03Icon} />
                    Agendamentos
                </button>

                <button className="navbar-button" onClick={() => navigate("/academia")}>
                    <HugeiconsIcon icon={BodyPartMuscleIcon}/>
                    Academia
                </button>

                <button className="navbar-button" onClick={() => navigate("/financeiro")}>
                    <HugeiconsIcon icon={SaveMoneyDollarIcon} />
                    Financeiro
                </button>

                <button className="navbar-button" onClick={() => navigate("/configuracoes")}>
                    <HugeiconsIcon icon={Settings01Icon} />
                    Configurações
                </button>
            </div>
        </header>
    )
}