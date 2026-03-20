import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export interface Esporte {
  id: string
  name: string
}

export interface QuadraCompleta {
  id: string
  name: string
  price_per_hour: number
  image_url: string | null
  esportes: Esporte[]
}

export function useConfiguracoesQuadras() {
  const [quadras, setQuadras] = useState<QuadraCompleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buscar = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('courts')
      .select(`
        id, name, price_per_hour, image_url,
        court_sports ( id, sports ( id, name ) )
      `)
      .order('name')

    if (err) {
      setError('Erro ao buscar quadras.')
      setLoading(false)
      return
    }

    const formatadas: QuadraCompleta[] = (data ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      price_per_hour: c.price_per_hour,
      image_url: c.image_url ?? null,
      esportes: (c.court_sports ?? []).map((cs: any) => ({
        id: cs.sports?.id ?? '',
        name: cs.sports?.name ?? '—',
      })),
    }))

    setQuadras(formatadas)
    setLoading(false)
  }, [])

  useEffect(() => { buscar() }, [buscar])

  async function salvarQuadra(dados: {
    id?: string
    name: string
    price_per_hour: number
    image_url: string | null
    sport_ids: string[]
  }): Promise<boolean> {
    const isEdicao = !!dados.id

    if (isEdicao) {
      const { error: updateErr } = await supabase
        .from('courts')
        .update({ name: dados.name, price_per_hour: dados.price_per_hour, image_url: dados.image_url })
        .eq('id', dados.id!)

      if (updateErr) return false

      await supabase.from('court_sports').delete().eq('court_id', dados.id!)

      if (dados.sport_ids.length > 0) {
        const { error: csErr } = await supabase.from('court_sports').insert(
          dados.sport_ids.map(sport_id => ({ court_id: dados.id!, sport_id }))
        )
        if (csErr) return false
      }
    } else {
      const { data: nova, error: insertErr } = await supabase
        .from('courts')
        .insert({ name: dados.name, price_per_hour: dados.price_per_hour, image_url: dados.image_url })
        .select('id')
        .single()

      if (insertErr || !nova) return false

      if (dados.sport_ids.length > 0) {
        const { error: csErr } = await supabase.from('court_sports').insert(
          dados.sport_ids.map(sport_id => ({ court_id: nova.id, sport_id }))
        )
        if (csErr) return false
      }
    }

    await buscar()
    return true
  }

  async function excluirQuadra(courtId: string): Promise<boolean> {
    const { data: courtSports } = await supabase
      .from('court_sports')
      .select('id')
      .eq('court_id', courtId)

    const csIds = (courtSports ?? []).map((cs: any) => cs.id)

    if (csIds.length > 0) {
      const { error: bookingsErr } = await supabase
        .from('bookings')
        .delete()
        .in('court_sport_id', csIds)

      if (bookingsErr) return false

      await supabase.from('court_opening_interval').delete().eq('court_id', courtId)

      const { error: csErr } = await supabase
        .from('court_sports')
        .delete()
        .eq('court_id', courtId)

      if (csErr) return false
    }

    const { error: courtErr } = await supabase
      .from('courts')
      .delete()
      .eq('id', courtId)

    if (courtErr) return false

    await buscar()
    return true
  }

  return { quadras, loading, error, salvarQuadra, excluirQuadra, refetch: buscar }
}

export function useTodosEsportes() {
  const [esportes, setEsportes] = useState<Esporte[]>([])

  useEffect(() => {
    supabase
      .from('sports')
      .select('id, name')
      .order('name')
      .then(({ data }) => setEsportes(data ?? []))
  }, [])

  return { esportes }
}