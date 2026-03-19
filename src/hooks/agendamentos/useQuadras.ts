import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export interface Quadra {
  id: string
  name: string
  price_per_hour: number
  image_url: string | null
}

export function useQuadras() {
  const [quadras, setQuadras] = useState<Quadra[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('courts')
      .select('id, name, price_per_hour, image_url')
      .order('name')
      .then(({ data }) => {
        setQuadras(data ?? [])
        setLoading(false)
      })
  }, [])

  return { quadras, loading }
}