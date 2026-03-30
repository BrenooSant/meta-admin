import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export interface EsporteDaQuadra {
  court_sport_id: string
  sport_name: string
}

interface Options {
  excluirEsportes?: string[]
}

export function useEsportesPorQuadra(courtId: string | null, options: Options = {}) {
  const { excluirEsportes = [] } = options
  const [esportes, setEsportes] = useState<EsporteDaQuadra[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!courtId) {
      setEsportes([])
      return
    }

    setLoading(true)
    supabase
      .from('court_sports')
      .select('id, sports(name)')
      .eq('court_id', courtId)
      .then(({ data }) => {
        const todos: EsporteDaQuadra[] = (data ?? []).map((item: any) => ({
          court_sport_id: item.id,
          sport_name: item.sports?.name ?? '—',
        }))

        const filtrados = excluirEsportes.length > 0
          ? todos.filter(e => !excluirEsportes.includes(e.sport_name))
          : todos

        setEsportes(filtrados)
        setLoading(false)
      })
  }, [courtId, JSON.stringify(excluirEsportes)])

  return { esportes, loading }
}