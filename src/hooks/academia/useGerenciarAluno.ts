import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export function useGerenciarAluno() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function adicionarAluno(fullname: string, phone: string): Promise<boolean> {
    setLoading(true)
    setError(null)

    const { error: err } = await supabase
      .from('gym_members')
      .insert({ fullname, phone })

    if (err) {
      setError('Erro ao adicionar aluno.')
      setLoading(false)
      return false
    }

    setLoading(false)
    return true
  }

  async function atualizarAluno(id: string, fullname: string, phone: string): Promise<boolean> {
    setLoading(true)
    setError(null)

    const { error: err } = await supabase
      .from('gym_members')
      .update({ fullname, phone })
      .eq('id', id)

    if (err) {
      setError('Erro ao atualizar aluno.')
      setLoading(false)
      return false
    }

    setLoading(false)
    return true
  }

  return { adicionarAluno, atualizarAluno, loading, error }
}