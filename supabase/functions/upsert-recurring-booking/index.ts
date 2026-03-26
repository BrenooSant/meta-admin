import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Não autorizado." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    )

    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Token inválido." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const { data: adminData } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .single()

    if (!adminData) {
      return new Response(
        JSON.stringify({ error: "Acesso negado." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const {
      phone,
      fullname,
      court_sport_id,
      day_of_week,
      start_time,
      end_time,
      price,
      valid_from,
      valid_until,
    } = await req.json()

    if (!phone || !fullname || !court_sport_id || day_of_week == null || !start_time || !end_time || !price || !valid_from) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios faltando." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Upsert de usuário — mesma lógica da upsert-user-booking
    const { data: usuarioExistente } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single()

    let userId: string

    if (usuarioExistente) {
      await supabaseAdmin
        .from("users")
        .update({ fullname })
        .eq("id", usuarioExistente.id)

      userId = usuarioExistente.id
    } else {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        phone,
        phone_confirm: true,
        password: phone,
        user_metadata: { fullname },
      })

      if (authError || !authData.user) {
        return new Response(
          JSON.stringify({ error: "Erro ao criar usuário: " + authError?.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      const { error: userInsertError } = await supabaseAdmin
        .from("users")
        .insert({
          id: authData.user.id,
          fullname,
          phone,
        })

      if (userInsertError) {
        return new Response(
          JSON.stringify({ error: "Erro ao salvar usuário: " + userInsertError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      userId = authData.user.id
    }

    // Inserir agendamento fixo
    const { data: recurring, error: recurringError } = await supabaseAdmin
      .from("recurring_bookings")
      .insert({
        user_id: userId,
        court_sport_id,
        day_of_week,
        start_time,
        end_time,
        price,
        valid_from,
        valid_until: valid_until ?? null,
      })
      .select()
      .single()

    if (recurringError) {
      return new Response(
        JSON.stringify({ error: "Erro ao criar agendamento fixo: " + recurringError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ recurring }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: "Erro inesperado", detail: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})