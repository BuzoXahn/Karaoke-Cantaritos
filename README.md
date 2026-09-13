# Karaoke Cantaritos

Los clientes escanean el QR de su mesa, piden su canción y a DJ Lion le llega
en tiempo real con: número de mesa, canción, artista y quién la canta.

## Rutas

- `/mesa/7` — formulario del cliente con la mesa 7 precargada (esto es lo que abre el QR)
- `/dj` — cabina de DJ Lion (requiere iniciar sesión)
- `/qr?desde=1&hasta=20` — hoja imprimible con los QR de las mesas 1 a 20

## Puesta en marcha (una sola vez)

1. **Supabase**: crea un proyecto nuevo en supabase.com.
2. En **SQL Editor**, pega y corre `supabase/schema.sql`.
3. En **Authentication → Users → Add user**, crea el usuario del DJ
   (correo y contraseña; marca "Auto confirm").
4. Copia `.env.example` a `.env` y pon la URL y la anon key del proyecto
   (Settings → API).
5. Local: `npm install` y `npm run dev`.
6. **Vercel**: sube el repo a GitHub, impórtalo en Vercel y agrega las dos
   variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
7. Ya desplegado, abre `/qr`, imprime los códigos y pégalos en las mesas.

## Notas

- La fila se ordena por llegada. El primero de la lista se resalta: es el que sigue.
- "Cantada" la quita de la fila pero se guarda (cuenta de cantadas del día).
  "Eliminar" la borra por completo.
- Si alguien abre la app sin QR, el formulario le pide su número de mesa.
