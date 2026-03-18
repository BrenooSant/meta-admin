import { useState } from 'react'
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input,
} from "@heroui/react"
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date"
import { useQuadras } from "../../../hooks/useQuadras"
import { useEsportesPorQuadra } from "../../../hooks/useEsportesPorQuadra"
import { useHorariosDisponiveis } from "../../../hooks/useHorariosDisponiveis"
import { useNovoAgendamento } from "../../../hooks/useNovoAgendamento"

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function aplicarMascaraTelefone(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 2) return `(${nums}`
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`
}

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

const selectClass = {
  innerWrapper: "flex items-center gap-2 bg-lightblue py-3 px-4 rounded-xl",
  input: "text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
  inputWrapper: "p-0",
}

export function ModalNovoAgendamento({ isOpen, onOpenChange, onSuccess }: Props) {
  const [fullname, setFullname] = useState('')
  const [telefone, setTelefone] = useState('')
  const [quadraId, setQuadraId] = useState<string | null>(null)
  const [courtSportId, setCourtSportId] = useState<string | null>(null)
  const [dataSelecionada, setDataSelecionada] = useState<CalendarDate | null>(null)
  const [horario, setHorario] = useState<string | null>(null)

  const { quadras } = useQuadras()
  const { esportes } = useEsportesPorQuadra(quadraId)
  const { horarios } = useHorariosDisponiveis(courtSportId, dataSelecionada)
  const { criarAgendamento, loading, error } = useNovoAgendamento()

  const quadraSelecionada = quadras.find(q => q.id === quadraId)
  const price = quadraSelecionada?.price_per_hour ?? 0

  const phoneNumeros = telefone.replace(/\D/g, '')
  const telefoneValido = phoneNumeros.length === 11 && phoneNumeros[2] === '9'

  const podeSalvar =
    fullname.trim() &&
    telefoneValido &&
    courtSportId &&
    dataSelecionada &&
    horario

  function resetar() {
    setFullname('')
    setTelefone('')
    setQuadraId(null)
    setCourtSportId(null)
    setDataSelecionada(null)
    setHorario(null)
  }

  async function handleSalvar(onClose: () => void) {
    if (!podeSalvar) return

    const ok = await criarAgendamento({
      fullname,
      phone: phoneNumeros,
      court_sport_id: courtSportId!,
      data: dataSelecionada!,
      horario: horario!,
      price,
    })

    if (ok) {
      resetar()
      onSuccess?.()
      onClose()
    }
  }

  const hoje = today(getLocalTimeZone())
  const diasDisponiveis = Array.from({ length: 60 }, (_, i) => hoje.add({ days: i }))

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) resetar(); onOpenChange(open) }}
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
              Novo Agendamento
            </ModalHeader>

            <ModalBody className="flex flex-col gap-y-3 mt-3">
              {/* Nome */}
              <Input
                placeholder="Nome Completo"
                aria-label="Nome Completo"
                value={fullname}
                onValueChange={setFullname}
                classNames={selectClass}
              />

              {/* Telefone com máscara */}
              <Input
                placeholder="(XX) 9XXXX-XXXX"
                aria-label="Telefone"
                value={telefone}
                onValueChange={(v) => setTelefone(aplicarMascaraTelefone(v))}
                isInvalid={telefone.length > 0 && !telefoneValido}
                errorMessage="Telefone inválido"
                classNames={selectClass}
              />

              {/* Quadra */}
              <div className="bg-lightblue py-3 px-4 rounded-xl">
                <select
                  className="w-full bg-transparent text-sm focus:outline-none"
                  value={quadraId ?? ''}
                  onChange={(e) => {
                    setQuadraId(e.target.value || null)
                    setCourtSportId(null)
                    setDataSelecionada(null)
                    setHorario(null)
                  }}
                >
                  <option value="">Selecionar Quadra</option>
                  {quadras.map(q => (
                    <option key={q.id} value={q.id}>{q.name}</option>
                  ))}
                </select>
              </div>

              {/* Esporte — só aparece após quadra selecionada */}
              {quadraId && (
                <div className="bg-lightblue py-3 px-4 rounded-xl">
                  <select
                    className="w-full bg-transparent text-sm focus:outline-none"
                    value={courtSportId ?? ''}
                    onChange={(e) => {
                      setCourtSportId(e.target.value || null)
                      setDataSelecionada(null)
                      setHorario(null)
                    }}
                  >
                    <option value="">Selecionar Esporte</option>
                    {esportes.map(e => (
                      <option key={e.court_sport_id} value={e.court_sport_id}>
                        {e.sport_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Data — só aparece após esporte selecionado */}
              {courtSportId && (
                <div className="bg-lightblue py-3 px-4 rounded-xl">
                  <select
                    className="w-full bg-transparent text-sm focus:outline-none"
                    value={dataSelecionada?.toString() ?? ''}
                    onChange={(e) => {
                      if (!e.target.value) { setDataSelecionada(null); return }
                      const [y, m, d] = e.target.value.split('-').map(Number)
                      setDataSelecionada(new CalendarDate(y, m, d))
                      setHorario(null)
                    }}
                  >
                    <option value="">Selecionar Data</option>
                    {diasDisponiveis.map(d => {
                      const js = d.toDate(getLocalTimeZone())
                      const label = `${String(js.getDate()).padStart(2, '0')} de ${MESES[js.getMonth()]} de ${js.getFullYear()}`
                      return (
                        <option key={d.toString()} value={d.toString()}>{label}</option>
                      )
                    })}
                  </select>
                </div>
              )}

              {/* Horário — só aparece após data selecionada */}
              {dataSelecionada && (
                <div className="bg-lightblue py-3 px-4 rounded-xl">
                  <select
                    className="w-full bg-transparent text-sm focus:outline-none"
                    value={horario ?? ''}
                    onChange={(e) => setHorario(e.target.value || null)}
                  >
                    <option value="">Selecionar Horário</option>
                    {horarios.length === 0
                      ? <option disabled>Nenhum horário disponível</option>
                      : horarios.map(h => (
                        <option key={h.value} value={h.value}>{h.label}</option>
                      ))
                    }
                  </select>
                </div>
              )}

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </ModalBody>

            <ModalFooter className="flex justify-center">
              <button onClick={onClose} className="cancel-button">Cancelar</button>
              <button
                className="confirm-button disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!podeSalvar || loading}
                onClick={() => handleSalvar(onClose)}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}