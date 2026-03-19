import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Pagamento {
  id: string
  amount: number
  paid_at: string
  due_date: string
  payment_receipt_url: string | null
  paid_at_formatado: string
}

const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('T')[0].split('-')
  return `${parseInt(dia)} de ${MESES[parseInt(mes) - 1]} de ${ano}`
}

export function usePagamentosAluno(memberId: string | null) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pagina, setPagina] = useState(1)
  const POR_PAGINA = 6

  const buscar = useCallback(async (pag: number) => {
    if (!memberId) return
    setLoading(true)

    const from = (pag - 1) * POR_PAGINA
    const to = from + POR_PAGINA - 1

    const { data, count } = await supabase
      .from('gym_payments')
      .select('*', { count: 'exact' })
      .eq('member_id', memberId)
      .order('paid_at', { ascending: false })
      .range(from, to)

    setPagamentos(
      (data ?? []).map((p: any) => ({
        id: p.id,
        amount: p.amount,
        paid_at: p.paid_at,
        due_date: p.due_date,
        payment_receipt_url: p.payment_receipt_url ?? null,
        paid_at_formatado: formatarData(p.paid_at),
      }))
    )
    setTotal(count ?? 0)
    setLoading(false)
  }, [memberId])

  useEffect(() => {
    setPagina(1)
    buscar(1)
  }, [buscar])

  function irParaPagina(pag: number) {
    setPagina(pag)
    buscar(pag)
  }

  async function atualizarComprovante(pagamentoId: string, url: string): Promise<boolean> {
    const { error } = await supabase
      .from('gym_payments')
      .update({ payment_receipt_url: url })
      .eq('id', pagamentoId)

    if (error) return false
    await buscar(pagina)
    return true
  }

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  return { pagamentos, loading, pagina, totalPaginas, total, irParaPagina, atualizarComprovante, refetch: () => buscar(pagina) }
}