import { useState } from 'react'
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Select, SelectItem,
} from '@heroui/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { usePrecificacaoQuadra, type FaixaPreco } from '../../../hooks/configuracoes/useConfiguracoesQuadras'

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  courtId: string | null
  quadraNome: string
}

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const HORARIOS = Array.from({ length: 24 }, (_, h) => {
  const label = `${String(h).padStart(2, '0')}:00`
  return { label, value: `${label}:00` }
})

const DURACOES = [
  { label: '60 min (1h)', value: 60 },
  { label: '120 min (2h)', value: 120 },
  { label: '180 min (3h)', value: 180 },
]

const selectClass = {
  trigger: 'bg-lightblue rounded-xl px-3 h-10 shadow-none border-none data-[hover=true]:bg-lightblue/80',
  value: 'text-sm',
  popoverContent: 'rounded-xl shadow-lg border border-gray-100',
  listboxWrapper: 'max-h-48',
}

const VAZIO = {
  day_of_week: 1,
  start_time: '08:00:00',
  end_time: '10:00:00',
  price: '',
  slot_duration_minutes: 60 as 60 | 120 | 180,
}

function formatarHorario(t: string) { return t.slice(0, 5) }

function formatarPreco(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function CardFaixa({ faixa, onRemover }: { faixa: FaixaPreco; onRemover: () => void }) {
  return (
    <div className="flex items-center justify-between bg-lightblue rounded-xl px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">
          {DIAS[faixa.day_of_week]} · {formatarHorario(faixa.start_time)} – {formatarHorario(faixa.end_time)}
        </p>
        <p className="text-xs text-gray-500">
          {formatarPreco(faixa.price)} · {faixa.slot_duration_minutes} min/slot
        </p>
      </div>
      <button
        onClick={onRemover}
        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1"
      >
        <HugeiconsIcon icon={Delete02Icon} size={16} />
      </button>
    </div>
  )
}

export function ModalPrecificacao({ isOpen, onOpenChange, courtId, quadraNome }: Props) {
  const { faixas, loading, adicionarFaixa, removerFaixa } = usePrecificacaoQuadra(courtId)

  const [nova, setNova] = useState(VAZIO)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function resetNova() { setNova(VAZIO); setErro(null) }

  function handleOpenChange(open: boolean) {
    if (!open) resetNova()
    onOpenChange(open)
  }

  async function handleAdicionar() {
    setErro(null)
    const priceNum = parseFloat(String(nova.price).replace(',', '.'))

    if (isNaN(priceNum) || priceNum <= 0) return setErro('Informe um valor válido.')
    if (nova.start_time >= nova.end_time) return setErro('Horário de início deve ser anterior ao fim.')

    setSaving(true)
    const ok = await adicionarFaixa({
      day_of_week: nova.day_of_week,
      start_time: nova.start_time,
      end_time: nova.end_time,
      price: priceNum,
      slot_duration_minutes: nova.slot_duration_minutes,
    })
    setSaving(false)

    if (ok) resetNova()
    else setErro('Erro ao adicionar faixa. Tente novamente.')
  }

  // Agrupa faixas por dia da semana para exibição
  const faixasPorDia = DIAS.reduce<Record<number, FaixaPreco[]>>((acc, _, i) => {
    const dodia = faixas.filter(f => f.day_of_week === i)
    if (dodia.length > 0) acc[i] = dodia
    return acc
  }, {})

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement="center"
      scrollBehavior="inside"
      classNames={{
        wrapper: 'px-4 !overflow-hidden',
        closeButton: 'text-white hover:bg-white/40 cursor-pointer p-1',
        base: 'max-h-[90vh] my-auto',
      }}
      className="rounded-t-xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center gradient-background text-white rounded-t-xl">
              Precificação · {quadraNome}
            </ModalHeader>

            <ModalBody className="flex flex-col gap-y-5 mt-3">

              {/* ── Faixas existentes ── */}
              {loading ? (
                <p className="text-sm text-gray-400 animate-pulse text-center">Carregando...</p>
              ) : faixas.length === 0 ? (
                <p className="text-sm text-gray-400 text-center">Nenhuma faixa cadastrada.</p>
              ) : (
                <div className="flex flex-col gap-y-4">
                  {Object.entries(faixasPorDia).map(([diaStr, lista]) => (
                    <div key={diaStr} className="flex flex-col gap-y-1.5">
                      <p className="text-xs font-semibold text-gray-500 px-1">
                        {DIAS[Number(diaStr)]}
                      </p>
                      {lista.map(f => (
                        <CardFaixa
                          key={f.id}
                          faixa={f}
                          onRemover={() => removerFaixa(f.id)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Formulário nova faixa ── */}
              <div className="flex flex-col gap-y-3 border-t pt-4">
                <p className="text-xs font-semibold text-gray-500 px-1">Nova faixa</p>

                {/* Dia */}
                <Select
                  aria-label="Dia da semana"
                  selectedKeys={new Set([String(nova.day_of_week)])}
                  onSelectionChange={(keys) =>
                    setNova(p => ({ ...p, day_of_week: Number(Array.from(keys)[0]) }))
                  }
                  classNames={selectClass}
                >
                  {DIAS.map((d, i) => (
                    <SelectItem key={String(i)}>{d}</SelectItem>
                  ))}
                </Select>

                {/* Horários */}
                <div className="flex gap-3">
                  <div className="flex-1 flex flex-col gap-y-1">
                    <p className="text-xs text-gray-400 px-1">Início</p>
                    <Select
                      aria-label="Início"
                      selectedKeys={new Set([nova.start_time])}
                      onSelectionChange={(keys) =>
                        setNova(p => ({ ...p, start_time: Array.from(keys)[0] as string }))
                      }
                      classNames={selectClass}
                    >
                      {HORARIOS.map(h => (
                        <SelectItem key={h.value}>{h.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1 flex flex-col gap-y-1">
                    <p className="text-xs text-gray-400 px-1">Fim</p>
                    <Select
                      aria-label="Fim"
                      selectedKeys={new Set([nova.end_time])}
                      onSelectionChange={(keys) =>
                        setNova(p => ({ ...p, end_time: Array.from(keys)[0] as string }))
                      }
                      classNames={selectClass}
                    >
                      {HORARIOS.map(h => (
                        <SelectItem key={h.value}>{h.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Duração do slot */}
                <div className="flex flex-col gap-y-1">
                  <p className="text-xs text-gray-400 px-1">Duração do slot</p>
                  <Select
                    aria-label="Duração"
                    selectedKeys={new Set([String(nova.slot_duration_minutes)])}
                    onSelectionChange={(keys) =>
                      setNova(p => ({
                        ...p,
                        slot_duration_minutes: Number(Array.from(keys)[0]) as 60 | 120 | 180,
                      }))
                    }
                    classNames={selectClass}
                  >
                    {DURACOES.map(d => (
                      <SelectItem key={String(d.value)}>{d.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Preço */}
                <div className="flex items-center bg-lightblue rounded-xl px-4 h-10 gap-2">
                  <span className="text-sm text-gray-400 shrink-0">R$</span>
                  <input
                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
                    placeholder="Valor (ex: 70,00)"
                    value={nova.price}
                    onChange={e => setNova(p => ({ ...p, price: e.target.value }))}
                  />
                </div>

                {erro && <p className="text-red-500 text-xs text-center">{erro}</p>}

                <button
                  className="confirm-button disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={saving}
                  onClick={handleAdicionar}
                >
                  {saving ? 'Adicionando...' : '+ Adicionar faixa'}
                </button>
              </div>
            </ModalBody>

            <ModalFooter className="flex justify-center">
              <button onClick={onClose} className="cancel-button">Fechar</button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}