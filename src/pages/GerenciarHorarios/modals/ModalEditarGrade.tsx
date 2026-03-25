import { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from '@heroui/react'
import { type GradePadrao } from '../../../hooks/configuracoes/useGerenciarHorarios'

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  grade: GradePadrao | null
  onSalvar: (params: { id: string; court_id?: string; day_of_week?: number; open_time: string; close_time: string }) => Promise<boolean>
}

const DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

const HORARIOS = Array.from({ length: 24 }, (_, h) => {
  const label = `${String(h).padStart(2, '0')}:00`
  return { label, value: `${label}:00` }
})

const selectClass = {
  trigger: 'bg-lightblue rounded-xl px-4 h-11 shadow-none border-none data-[hover=true]:bg-lightblue/80',
  value: 'text-sm',
  popoverContent: 'rounded-xl shadow-lg border border-gray-100',
  listboxWrapper: 'max-h-48',
}

export function ModalEditarGrade({ isOpen, onOpenChange, grade, onSalvar }: Props) {
  const [openTime, setOpenTime]   = useState('06:00:00')
  const [closeTime, setCloseTime] = useState('23:00:00')
  const [saving, setSaving]       = useState(false)
  const [erro, setErro]           = useState<string | null>(null)

  useEffect(() => {
    if (grade) {
      setOpenTime(grade.open_time)
      setCloseTime(grade.close_time)
    }
    setErro(null)
  }, [grade, isOpen])

  async function handleSalvar(onClose: () => void) {
    if (!grade) return
    if (openTime >= closeTime) {
      setErro('Abertura deve ser anterior ao fechamento.')
      return
    }
    setSaving(true)
    const ok = await onSalvar({ id: grade.id, court_id: grade.court_id, day_of_week: grade.day_of_week, open_time: openTime, close_time: closeTime })
    setSaving(false)
    if (ok) onClose()
    else setErro('Erro ao salvar. Tente novamente.')
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      classNames={{
        wrapper: 'px-4 !overflow-hidden',
        closeButton: 'text-white hover:bg-white/40 cursor-pointer p-1',
        base: 'my-auto',
      }}
      className='rounded-t-xl'
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center gradient-background text-white rounded-t-xl">
              {grade?.id ? 'Editar Grade Padrão' : 'Nova Grade Padrão'}
            </ModalHeader>

            <ModalBody className="flex flex-col gap-y-4 mt-3">
              <div className="bg-lightblue rounded-xl px-4 py-3">
                <p className="text-sm font-medium">{grade ? DIAS[grade.day_of_week] : '—'}</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-y-1">
                  <p className="text-xs text-gray-500 px-1">Abre</p>
                  <Select
                    aria-label="Abertura"
                    selectedKeys={new Set([openTime])}
                    onSelectionChange={(k) => setOpenTime(Array.from(k)[0] as string)}
                    classNames={selectClass}
                  >
                    {HORARIOS.map(h => <SelectItem key={h.value}>{h.label}</SelectItem>)}
                  </Select>
                </div>
                <div className="flex-1 flex flex-col gap-y-1">
                  <p className="text-xs text-gray-500 px-1">Fecha</p>
                  <Select
                    aria-label="Fechamento"
                    selectedKeys={new Set([closeTime])}
                    onSelectionChange={(k) => setCloseTime(Array.from(k)[0] as string)}
                    classNames={selectClass}
                  >
                    {HORARIOS.map(h => <SelectItem key={h.value}>{h.label}</SelectItem>)}
                  </Select>
                </div>
              </div>

              {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
            </ModalBody>

            <ModalFooter className="flex justify-center">
              <button onClick={onClose} className="cancel-button">Cancelar</button>
              <button
                className="confirm-button disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
                onClick={() => handleSalvar(onClose)}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}