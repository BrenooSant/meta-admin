import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "../../hooks/useAdminAuth"

export function ConfiguracoesPage() {
    const { logout } = useAdminAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        navigate("/login")
    }

    return (
        <main className="p-8">
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl transition-colors cursor-pointer"
            >
                Sair
            </button>
        </main>
    )
}