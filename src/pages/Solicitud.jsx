import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase.js'

export default function Solicitud() {
  const { num } = useParams()
  const mesaQR = parseInt(num, 10)
  const mesaValida = Number.isInteger(mesaQR) && mesaQR > 0

  const [cancion, setCancion] = useState('')
  const [artista, setArtista] = useState('')
  const [cantante, setCantante] = useState('')
  const [mesaManual, setMesaManual] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [enviada, setEnviada] = useState(null) // { lugar }

  const mesa = mesaValida ? mesaQR : parseInt(mesaManual, 10)

  async function enviar(e) {
    e.preventDefault()
    setError('')
    if (!Number.isInteger(mesa) || mesa < 1) {
      setError('Falta tu número de mesa.')
      return
    }
    setEnviando(true)
    const { data, error: err } = await supabase
      .from('solicitudes')
      .insert({
        mesa,
        cancion: cancion.trim(),
        artista: artista.trim(),
        cantante: cantante.trim()
      })
      .select('id, created_at')
      .single()

    if (err) {
      setError('No se pudo enviar. Revisa tu conexión e intenta de nuevo.')
      setEnviando(false)
      return
    }

    const { count } = await supabase
      .from('solicitudes')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'pendiente')
      .lte('created_at', data.created_at)

    setEnviada({ lugar: count ?? null })
    setEnviando(false)
  }

  function otra() {
    setCancion('')
    setArtista('')
    setCantante('')
    setEnviada(null)
  }

  if (enviada) {
    return (
      <main className="cliente">
        <header className="marquesina">
          <p className="bar">Cantaritos</p>
          <h1>¡Ya está!</h1>
        </header>
        <section className="confirmacion">
          <p>
            DJ Lion ya tiene tu canción.
            {enviada.lugar ? (
              <> Vas en el lugar <strong>{enviada.lugar}</strong> de la fila.</>
            ) : null}
          </p>
          <p className="detalle">
            {cancion} — {artista} · canta {cantante} · mesa {mesa}
          </p>
          <button className="principal" onClick={otra}>Pedir otra canción</button>
        </section>
      </main>
    )
  }

  return (
    <main className="cliente">
      <header className="marquesina">
        <p className="bar">Cantaritos · karaoke con DJ Lion</p>
        <h1>¡Cántale!</h1>
        {mesaValida && <p className="mesa-chip">Mesa {mesaQR}</p>}
      </header>

      <form onSubmit={enviar}>
        {!mesaValida && (
          <label>
            Tu número de mesa
            <input
              type="number"
              inputMode="numeric"
              min="1"
              required
              value={mesaManual}
              onChange={e => setMesaManual(e.target.value)}
              placeholder="Ej. 7"
            />
          </label>
        )}
        <label>
          Canción
          <input
            required
            maxLength={120}
            value={cancion}
            onChange={e => setCancion(e.target.value)}
            placeholder="Ej. Amor eterno"
          />
        </label>
        <label>
          Artista
          <input
            required
            maxLength={120}
            value={artista}
            onChange={e => setArtista(e.target.value)}
            placeholder="Ej. Rocío Dúrcal"
          />
        </label>
        <label>
          ¿Quién la canta?
          <input
            required
            maxLength={80}
            value={cantante}
            onChange={e => setCantante(e.target.value)}
            placeholder="Tu nombre"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="principal" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Mandar a DJ Lion'}
        </button>
      </form>
    </main>
  )
}
