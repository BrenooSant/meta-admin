import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

export type Status = 'ativo' | 'expirado' | 'inativo'

export interface Aluno {
  id: string
  nome: string
  telefone: string
  ultimoPagamento: string | null
  dataVencimento: string | null
  mensalidade: number | null
  status: Status
  raw: {
    member_id: string
    due_date: string | null
    paid_at: string | null
    amount: number | null
  }
}

function calcularStatus(dueDate: string | null): Status {
  if (!dueDate) return 'inativo'

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const vencimento = new Date(dueDate)
  vencimento.setHours(0, 0, 0, 0)

  const diffMs = hoje.getTime() - vencimento.getTime()
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDias <= 0) return 'ativo'
  if (diffDias <= 30) return 'expirado'
  return 'inativo'
}

function formatarData(data: string | null): string | null {
  if (!data) return null
  const [ano, mes, dia] = data.split('T')[0].split('-')
  const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
  return `${parseInt(dia)} de ${MESES[parseInt(mes) - 1]} de ${ano}`
}

export function useAlunos(busca: string = '', filtroStatus: Status | 'todos' = 'todos') {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscar = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Busca todos os membros com o pagamento mais recente de cada um
    const { data, error: supabaseError } = await supabase
      .from('gym_members')
      .select(`
        id,
        fullname,
        phone,
        gym_payments (
          amount,
          paid_at,
          due_date
        )
      `)
      .order('fullname', { ascending: true })

    if (supabaseError) {
      setError('Erro ao buscar alunos.')
      setLoading(false)
      return
    }

    const formatados: Aluno[] = (data ?? []).map((m: any) => {
      // Pega o pagamento mais recente (maior due_date)
      const pagamentos = (m.gym_payments ?? []) as { amount: number; paid_at: string; due_date: string }[]
      const ultimoPag = pagamentos.sort(
        (a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
      )[0] ?? null

      return {
        id: m.id,
        nome: m.fullname,
        telefone: m.phone,
        ultimoPagamento: formatarData(ultimoPag?.paid_at ?? null),
        dataVencimento: formatarData(ultimoPag?.due_date ?? null),
        mensalidade: ultimoPag?.amount ?? null,
        status: calcularStatus(ultimoPag?.due_date ?? null),
        raw: {
          member_id: m.id,
          due_date: ultimoPag?.due_date ?? null,
          paid_at: ultimoPag?.paid_at ?? null,
          amount: ultimoPag?.amount ?? null,
        }
      }
    })

    setAlunos(formatados)
    setLoading(false)
  }, [])

  useEffect(() => {
    buscar()
  }, [buscar])

  // Filtragem client-side
  const alunosFiltrados = alunos.filter(a => {
    const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.telefone.includes(busca)
    const matchStatus = filtroStatus === 'todos' || a.status === filtroStatus
    return matchBusca && matchStatus
  })

  return { alunos: alunosFiltrados, loading, error, refetch: buscar }
}