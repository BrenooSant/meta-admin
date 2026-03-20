import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { CalendarDate, getLocalTimeZone } from '@internationalized/date'

export interface GradePadrao {
  open_time: string | null
  close_time: string | null
}

export interface Excecao {
  id: string
  open_time: string | null
  close_time: string | null
  open_time_2: string | null
  close_time_2: string | null
  reason: string | null
}

export function useDisponibilidadeDia(courtIds: string[], data: CalendarDate | null) {
  const [gradePadrao, setGradePadrao] = useState<Record<string, GradePadrao | null>>({})
  const [excecoes, setExcecoes] = useState<Record<string, Excecao | null>>({})
  const [loading, setLoading] = useState(false)

  const buscar = useCallback(async () => {
    if (courtIds.length === 0 || !data) {
      setGradePadrao({})
      setExcecoes({})
      return
    }

    setLoading(true)

    const jsDate = data.toDate(getLocalTimeZone())
    const diaSemana = jsDate.getDay()
    const ano = jsDate.getFullYear()
    const mes = String(jsDate.getMonth() + 1).padStart(2, '0')
    const dia = String(jsDate.getDate()).padStart(2, '0')
    const dataISO = `${ano}-${mes}-${dia}`

    const [{ data: intervalos }, { data: excecoesData }] = await Promise.all([
      supabase
        .from('court_opening_interval')
        .select('court_id, open_time, close_time')
        .in('court_id', courtIds)
        .eq('day_of_week', diaSemana),
      supabase
        .from('court_schedule_exception')
        .select('id, court_id, open_time, close_time, open_time_2, close_time_2, reason')
        .in('court_id', courtIds)
        .eq('date', dataISO),
    ])

    const gradePorId: Record<string, GradePadrao | null> = {}
    const excecaoPorId: Record<string, Excecao | null> = {}

    courtIds.forEach(id => {
      gradePorId[id] = (intervalos ?? []).find((i: any) => i.court_id === id) ?? null
      excecaoPorId[id] = (excecoesData ?? []).find((e: any) => e.court_id === id) ?? null
    })

    setGradePadrao(gradePorId)
    setExcecoes(excecaoPorId)
    setLoading(false)
  }, [courtIds.join(','), data])

  useEffect(() => { buscar() }, [buscar])

  async function salvarExcecao(courtId: string, params: {
    open_time: string | null
    close_time: string | null
    open_time_2: string | null
    close_time_2: string | null
    reason: string | null
  }): Promise<boolean> {
    if (!data) return false

    const jsDate = data.toDate(getLocalTimeZone())
    const ano = jsDate.getFullYear()
    const mes = String(jsDate.getMonth() + 1).padStart(2, '0')
    const dia = String(jsDate.getDate()).padStart(2, '0')
    const dataISO = `${ano}-${mes}-${dia}`

    const { error } = await supabase
      .from('court_schedule_exception')
      .upsert(
        { court_id: courtId, date: dataISO, ...params },
        { onConflict: 'court_id,date' }
      )

    return !error
  }

  async function removerExcecao(courtId: string): Promise<boolean> {
    const excecao = excecoes[courtId]
    if (!excecao) return true

    const { error } = await supabase
      .from('court_schedule_exception')
      .delete()
      .eq('id', excecao.id)

    return !error
  }

  async function salvarTodas(params: {
    modo: 'padrao' | 'fechado' | 'customizado'
    open_time: string | null
    close_time: string | null
    open_time_2: string | null
    close_time_2: string | null
    reason: string | null
  }): Promise<boolean> {
    const resultados = await Promise.all(
      courtIds.map(id => {
        if (params.modo === 'padrao') return removerExcecao(id)
        return salvarExcecao(id, {
          open_time:   params.modo === 'fechado' ? null : params.open_time,
          close_time:  params.modo === 'fechado' ? null : params.close_time,
          open_time_2: params.modo === 'fechado' ? null : params.open_time_2,
          close_time_2: params.modo === 'fechado' ? null : params.close_time_2,
          reason: params.reason,
        })
      })
    )

    await buscar()
    return resultados.every(Boolean)
  }

  return { gradePadrao, excecoes, loading, salvarTodas }
}