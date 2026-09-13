import { QRCodeSVG } from 'qrcode.react'
import { useSearchParams } from 'react-router-dom'

// Imprime los QR de las mesas: /qr?desde=1&hasta=20
export default function QRs() {
  const [params] = useSearchParams()
  const desde = parseInt(params.get('desde') ?? '1', 10)
  const hasta = parseInt(params.get('hasta') ?? '20', 10)
  const mesas = []
  for (let m = desde; m <= hasta; m++) mesas.push(m)

  return (
    <main className="qrs">
      <p className="instruccion no-print">
        Cambia el rango en la dirección, por ejemplo <code>/qr?desde=1&amp;hasta=30</code>,
        y usa Imprimir del navegador. Pega cada QR en su mesa.
      </p>
      <div className="qr-grid">
        {mesas.map(m => (
          <figure key={m}>
            <QRCodeSVG value={`${window.location.origin}/mesa/${m}`} size={140} />
            <figcaption>
              <span>Mesa {m}</span>
              <small>Escanea y pide tu canción</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  )
}
