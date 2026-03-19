import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export interface EsporteDaQuadra {
  court_sport_id: string
  sport_name: string
}

export function useEsportesPorQuadra(courtId: string | null) {
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
        setEsportes(
          (data ?? []).map((item: any) => ({
            court_sport_id: item.id,
            sport_name: item.sports?.name ?? '—',
          }))
        )
        setLoading(false)
      })
  }, [courtId])

  return { esportes, loading }
}