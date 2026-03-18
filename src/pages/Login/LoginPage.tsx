import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LogoMeta from "../../assets/logo-meta.png"
import MenBG from "../../assets/men-bg.png"
import { Input } from "@heroui/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Mail01Icon, ViewOffSlashIcon, ViewIcon } from "@hugeicons/core-free-icons"
import { useAdminAuth } from "../../hooks/useAdminAuth"

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const { loginAdmin, loading, error } = useAdminAuth()
    const navigate = useNavigate()

    async function handleLogin() {
        const admin = await loginAdmin({ email, password })
        if (admin) {
            navigate("/agendamentos")
        }
    }

    return (
        <main>
            <header className="w-full bg-maingreen flex items-center px-12 py-2">
                <img src={LogoMeta} alt="Logo Meta Centro Esportivo" className="h-14" />
            </header>

            <div className="hidden md:block">
                <div className="fixed top-40 left-40 blur-3xl bg-maingreen/35 h-60 w-60 rounded-full" />
                <div className="fixed top-80 left-100 blur-3xl bg-maingreen/35 h-60 w-60 rounded-full" />
                <div className="fixed top-60 left-60">
                    <p className="font-montserrat font-bold text-4xl">
                        Seu melhor <br />
                        organizador de <br />
                        horários
                    </p>
                    <img src={MenBG} alt="Homem Caindo" className="w-90 fixed top-65 left-120" />
                </div>
            </div>

            <div className="w-full flex justify-center md:justify-end mt-20">
                <div className="flex flex-col md:mr-40 items-center justify-center">
                    <h1 className="font-montserrat font-bold text-2xl mb-4">Seja Bem-Vindo!</h1>
                    <h2 className="font-montserrat font-light text-lg">Acesso administrativo</h2>

                    <div className="w-full flex flex-col mt-8 gap-y-4 min-w-80">
                        <Input
                            placeholder="Email"
                            aria-label="Email"
                            type="email"
                            value={email}
                            onValueChange={setEmail}
                            classNames={{
                                innerWrapper: "flex items-center gap-2 bg-lightblue py-3 px-4 rounded-xl",
                                input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                                inputWrapper: "p-0",
                            }}
                            endContent={<HugeiconsIcon icon={Mail01Icon} className="w-5 h-5" />}
                        />
                        <Input
                            placeholder="••••••"
                            aria-label="Senha"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onValueChange={setPassword}
                            classNames={{
                                innerWrapper: "flex items-center gap-2 bg-lightblue py-3 px-4 rounded-xl",
                                input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                                inputWrapper: "p-0",
                            }}
                            endContent={
                                <button onClick={() => setShowPassword(p => !p)} className="hover:cursor-pointer">
                                    <HugeiconsIcon
                                        icon={showPassword ? ViewIcon : ViewOffSlashIcon}
                                        className="w-5 h-5"
                                    />
                                </button>
                            }
                        />

                        {/* Mensagem de erro */}
                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <button
                            className="button-g disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleLogin}
                            disabled={loading || !email || !password}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </button>

                        <div className="flex items-center justify-center gap-x-4 mt-10">
                            <button className="rounded-2xl py-1 px-5 shadow-lg text-maingreen text-sm font-semibold cursor-pointer">
                                Contato
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}