import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabase.js'

export default function DJ() {
  const [sesion, setSesion] = useState(undefined) // undefined = cargando

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSesion(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (sesion === undefined) return <main className="dj"><p className="vacio">Cargando…</p></main>
  return sesion ? <Cola /> : <Login />
}

function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  async function entrar(e) {
    e.preventDefault()
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (err) setError('Correo o contraseña incorrectos.')
  }

  return (
    <main className="dj login">
      <h1>Cabina de DJ Lion</h1>
      <form onSubmit={entrar}>
        <label>
          Correo
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input type="password" required value={pass} onChange={e => setPass(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="principal">Entrar</button>
      </form>
    </main>
  )
}

function Cola() {
  const [pendientes, setPendientes] = useState([])
  const [cantadasHoy, setCantadasHoy] = useState(0)

  const cargar = useCallback(async () => {
    const { data } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: true })
    setPendientes(data ?? [])

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('solicitudes')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'cantada')
      .gte('created_at', hoy.toISOString())
    setCantadasHoy(count ?? 0)
  }, [])

  useEffect(() => {
    cargar()
    const canal = supabase
      .channel('cola-karaoke')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitudes' }, cargar)
      .subscribe()
    return () => supabase.removeChannel(canal)
  }, [cargar])

  async function marcarCantada(id) {
    await supabase.from('solicitudes').update({ estado: 'cantada' }).eq('id', id)
  }

  async function eliminar(id) {
    await supabase.from('solicitudes').delete().eq('id', id)
  }

  return (
    <main className="dj">
      <header className="dj-header">
        <div>
          <h1>Cabina de DJ Lion</h1>
          <p className="resumen">{pendientes.length} en fila · {cantadasHoy} cantadas hoy</p>
        </div>
        <button className="secundario" onClick={() => supabase.auth.signOut()}>Salir</button>
      </header>

      {pendientes.length === 0 ? (
        <p className="vacio">Sin canciones en la fila. En cuanto pidan una, aparece aquí sola.</p>
      ) : (
        <ol className="cola">
          {pendientes.map((s, i) => (
            <li key={s.id} className={i === 0 ? 'siguiente' : ''}>
              <div className="info">
                <p className="cancion">{s.cancion}</p>
                <p className="artista">{s.artista}</p>
                <p className="quien">Canta <strong>{s.cantante}</strong> · Mesa {s.mesa}</p>
              </div>
              <div className="acciones">
                <button className="ok" onClick={() => marcarCantada(s.id)}>Cantada</button>
                <button className="borrar" onClick={() => eliminar(s.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
