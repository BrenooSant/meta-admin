import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useDisclosure } from '@heroui/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Pen01Icon,
  Delete02Icon,
  TennisBallIcon,
  VolleyballIcon,
  DashedLineCircleIcon,
  AlbumNotFound01Icon,
} from '@hugeicons/core-free-icons'
import { useCompany } from '../../hooks/company/useCompany'
import { useConfiguracoesQuadras, type QuadraCompleta } from '../../hooks/configuracoes/useConfiguracoesQuadras'
import { ModalQuadra } from './modals/ModalQuadra'
import { ModalConfirmarExclusao } from './modals/ModalConfirmarExclusao'
import { ModalCropImagem } from './modals/ModalCropImagem'

const ICONE_ESPORTE: Record<string, any> = {
  'Beach Tennis': TennisBallIcon,
  'Vôlei':       VolleyballIcon,
}

function getIconeEsporte(nome: string) {
  return ICONE_ESPORTE[nome] ?? DashedLineCircleIcon
}

// ─── Card de quadra ───────────────────────────────────────────────────────────
function CardQuadra({
  quadra,
  onEditar,
  onExcluir,
}: {
  quadra: QuadraCompleta
  onEditar: () => void
  onExcluir: () => void
}) {
  const precoFormatado = quadra.price_per_hour.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="border rounded-2xl overflow-hidden flex flex-col shadow-sm">
      {/* Imagem */}
      <div className="h-32 bg-gray-100 relative flex items-center justify-center">
        {quadra.image_url ? (
          <img src={quadra.image_url} alt={quadra.name} className="w-full h-full object-cover" />
        ) : (
          <HugeiconsIcon icon={AlbumNotFound01Icon} size={36} className="text-gray-300" />
        )}

        {/* Ações */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={onEditar}
            className="w-8 h-8 rounded-full bg-maingreen flex items-center justify-center shadow cursor-pointer hover:bg-maingreen/80 transition-colors"
          >
            <HugeiconsIcon icon={Pen01Icon} size={14} className="text-white" />
          </button>
          <button
            onClick={onExcluir}
            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow cursor-pointer hover:bg-red-600 transition-colors"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-y-2">
        <p className="font-montserrat font-semibold text-sm">{quadra.name}</p>

        {quadra.esportes.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {quadra.esportes.map(e => (
              <div key={e.id} className="flex items-center gap-1">
                <HugeiconsIcon icon={getIconeEsporte(e.name)} size={14} className="text-maingreen" />
                <span className="text-xs text-gray-600">{e.name}</span>
              </div>
            ))}
          </div>
        )}

        <span className="self-start bg-maingreen/10 text-maingreen text-xs font-semibold px-2.5 py-1 rounded-full">
          {precoFormatado}/h
        </span>
      </div>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────
export function ConfiguracoesPage() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  const { company, saving, salvarCompany } = useCompany()
  const { quadras, loading: loadingQuadras, salvarQuadra, excluirQuadra } = useConfiguracoesQuadras()

  // Company — campos locais para edição inline
  const [companyName, setCompanyName]           = useState('')
  const [companyAddress, setCompanyAddress]     = useState('')
  const [companyMaps, setCompanyMaps]           = useState('')
  const [uploadingLogo, setUploadingLogo]       = useState(false)
  const [cropSrc, setCropSrc]                   = useState<string | null>(null)
  const [savedFeedback, setSavedFeedback]       = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)
  const cropModal = useDisclosure()

  // Sincroniza quando os dados chegam
  const [synced, setSynced] = useState(false)
  if (company && !synced) {
    setCompanyName(company.name ?? '')
    setCompanyAddress(company.address ?? '')
    setCompanyMaps(company.google_maps_link ?? '')
    setSynced(true)
  }

  const hasChanges =
    companyName !== (company?.name ?? '') ||
    companyAddress !== (company?.address ?? '') ||
    companyMaps !== (company?.google_maps_link ?? '')

  // Modal quadra
  const quadraModal = useDisclosure()
  const [quadraEditando, setQuadraEditando] = useState<QuadraCompleta | null>(null)

  // Modal exclusão
  const exclusaoModal = useDisclosure()
  const [quadraExcluindo, setQuadraExcluindo] = useState<QuadraCompleta | null>(null)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  async function handleUploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Cria URL local e abre o modal de crop
    const objectUrl = URL.createObjectURL(file)
    setCropSrc(objectUrl)
    cropModal.onOpen()
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = ''
  }

  async function handleCropSuccess(url: string) {
    setUploadingLogo(true)
    await salvarCompany({ image_url: url })
    setUploadingLogo(false)
  }

  async function handleSalvarCompany() {
    const ok = await salvarCompany({
      name: companyName,
      address: companyAddress,
      google_maps_link: companyMaps,
    })
    if (ok) {
      setSavedFeedback(true)
      setTimeout(() => setSavedFeedback(false), 3000)
    }
  }

  function handleAbrirEdicao(q: QuadraCompleta) {
    setQuadraEditando(q)
    quadraModal.onOpen()
  }

  function handleAbrirNova() {
    setQuadraEditando(null)
    quadraModal.onOpen()
  }

  function handleAbrirExclusao(q: QuadraCompleta) {
    setQuadraExcluindo(q)
    exclusaoModal.onOpen()
  }

  const inputBase =
    'w-full bg-lightblue rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-gray-400'

  return (
    <main className="px-6 md:px-12 pb-12 mt-10">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Coluna esquerda — Company ── */}
        <aside className="lg:w-72 shrink-0 flex flex-col gap-6">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer relative group border"
              onClick={() => logoRef.current?.click()}
            >
              {company?.image_url ? (
                <>
                  <img src={company.image_url} alt="Logo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <HugeiconsIcon icon={Pen01Icon} size={20} className="text-white" />
                  </div>
                </>
              ) : (
                <HugeiconsIcon icon={AlbumNotFound01Icon} size={36} className="text-gray-300" />
              )}
            </div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleUploadLogo} />
            <p className="text-xs text-gray-400 cursor-pointer" onClick={() => logoRef.current?.click()}>
              {uploadingLogo ? 'Enviando...' : 'Editar Imagem'}
            </p>
          </div>

          {/* Campos company */}
          <div className="flex flex-col gap-3">
            <input
              className={inputBase}
              placeholder="Nome da empresa"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
            <input
              className={inputBase}
              placeholder="Endereço"
              value={companyAddress}
              onChange={e => setCompanyAddress(e.target.value)}
            />
            <input
              className={inputBase}
              placeholder="Link Google Maps"
              value={companyMaps}
              onChange={e => setCompanyMaps(e.target.value)}
            />

            <button
              className="confirm-button disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving || !hasChanges}
              onClick={handleSalvarCompany}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>

            {savedFeedback && (
              <p className="text-center text-sm text-maingreen font-medium animate-pulse">
                ✓ Dados salvos com sucesso!
              </p>
            )}
          </div>

          {/* Gerenciar Horários */}
          <button
            onClick={() => navigate('/configuracoes/horarios')}
            className="w-full border border-maingreen text-maingreen hover:bg-maingreen/5 font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
          >
            Gerenciar Horários
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-2 border border-red-400 text-red-500 hover:bg-red-50 font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
          >
            Sair
          </button>
        </aside>

        {/* ── Coluna direita — Quadras ── */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-montserrat font-bold text-xl">Minhas Quadras</h2>
            <button className="button-g" onClick={handleAbrirNova}>
              Adicionar Quadra
            </button>
          </div>

          {loadingQuadras ? (
            <p className="text-sm text-gray-400 animate-pulse">Carregando quadras...</p>
          ) : quadras.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma quadra cadastrada.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {quadras.map(q => (
                <CardQuadra
                  key={q.id}
                  quadra={q}
                  onEditar={() => handleAbrirEdicao(q)}
                  onExcluir={() => handleAbrirExclusao(q)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modais */}
      <ModalQuadra
        isOpen={quadraModal.isOpen}
        onOpenChange={quadraModal.onOpenChange}
        quadra={quadraEditando}
        onSalvar={salvarQuadra}
      />

      <ModalConfirmarExclusao
        isOpen={exclusaoModal.isOpen}
        onOpenChange={exclusaoModal.onOpenChange}
        nomeQuadra={quadraExcluindo?.name ?? ''}
        onConfirmar={() => excluirQuadra(quadraExcluindo!.id)}
      />

      <ModalCropImagem
        isOpen={cropModal.isOpen}
        onOpenChange={cropModal.onOpenChange}
        imageSrc={cropSrc}
        onUploadSuccess={handleCropSuccess}
      />
    </main>
  )
}