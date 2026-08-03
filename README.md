# NovaCore Smart Menu

Carta digital SaaS multi-tenant para restaurantes — carta pública, panel del
propietario y panel NovaCore sobre una única aplicación Next.js.

Este README cubre el estado actual del proyecto: estructura base, conexión a
Supabase, esquema de base de datos, autenticación y el sistema de diseño
completo (tokens, 6 temas, componentes reutilizables). El contenido real de
la carta pública, el CRUD del propietario, reseñas, QR y el panel NovaCore
se añaden en bloques posteriores — ver el documento de diseño de la Fase 1
aprobado.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Postgres +
Auth + RLS).

> **Next.js 16**: el antiguo `middleware.ts` se llama ahora `proxy.ts`
> (función `proxy`, no `middleware`) y corre siempre en runtime Node.js. Si
> tocas el enrutado/autenticación, revisa
> `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
> antes de asumir el comportamiento de versiones anteriores.

## 1. Requisitos

- Node.js 20.9+ (usa el `.nvmrc`/versión indicada en `package.json` si tu
  editor lo soporta).
- Una cuenta y proyecto en [supabase.com](https://supabase.com) (plan free
  es suficiente para desarrollo).
- Opcional: [Supabase CLI](https://supabase.com/docs/guides/cli) si prefieres
  gestionar las migraciones desde tu máquina en vez del SQL Editor del
  dashboard.

## 2. Instalar dependencias

```bash
npm install
```

## 3. Crear el proyecto de Supabase

1. Crea un proyecto nuevo en el dashboard de Supabase.
2. Ve a **Project Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**nunca** la expongas
     en el navegador ni la commitees; solo la usa `lib/supabase/admin.ts`,
     protegido con el paquete `server-only`)

## 4. Variables de entorno

```bash
cp .env.example .env.local
```

Rellena `.env.local` con los valores del paso anterior. `lib/env.ts` valida
estas variables al arrancar la app — si falta o está mal formada alguna, el
error aparece de inmediato en consola en vez de fallar más tarde de forma
críptica.

## 5. Aplicar el esquema de base de datos

El esquema completo de la Fase 1 vive en `supabase/migrations/` (tablas,
índices) y `supabase/seed.sql` (catálogo de los 14 alérgenos UE). Dos formas
de aplicarlo:

**Opción A — SQL Editor del dashboard (sin instalar nada):**

En el SQL Editor de tu proyecto, ejecuta en este orden exacto:

1. `supabase/migrations/20260803120000_init_schema.sql`
2. `supabase/migrations/20260803120100_functions_and_rls.sql`
3. `supabase/seed.sql`

**Opción B — Supabase CLI:**

```bash
supabase login
supabase link --project-ref <tu-project-ref>
supabase db push          # aplica las migraciones al proyecto remoto
# el seed no se ejecuta solo en remoto con db push; para sembrarlo:
supabase db execute -f supabase/seed.sql
```

(Si desarrollas con Supabase local vía `supabase start`, `supabase db reset`
aplica migraciones **y** `seed.sql` automáticamente.)

### 5.1 (Opcional) Restaurante de demostración

`supabase/seed-demo-note-di-caffe.sql` da de alta un restaurante real (Note
di Caffé, Los Abrigos — Tenerife) con sus datos verdaderos de contacto y
horario, pero con categorías y platos **explícitamente marcados como
demostración** ("Ejemplo — ...", "Producto de demostración — ...") hasta que
exista la carta oficial. Es idempotente: se puede ejecutar varias veces sin
duplicar nada. Aplícalo igual que el resto (SQL Editor o
`supabase db execute -f supabase/seed-demo-note-di-caffe.sql`) para tener
`/r/note-di-caffe` navegable de inmediato.

## 6. Crear el primer superadministrador de NovaCore

No hay registro público — ni de propietarios ni de administradores. Para el
primer `platform_admin`:

1. En **Authentication → Users** del dashboard, crea manualmente un usuario
   (email + contraseña) con el email que pondrás en
   `NOVACORE_ADMIN_BOOTSTRAP_EMAIL`.
2. En el SQL Editor, dale el rol de superadmin:

   ```sql
   insert into platform_admins (user_id)
   select id from auth.users where email = 'admin@tu-dominio.com';
   ```

Sin este paso, `/novacore` es inaccesible (correcto: nadie es admin todavía).

## 7. Ejecutar en local

```bash
npm run dev
```

- `http://localhost:3000` — landing mínima de NovaCore.
- `http://localhost:3000/login` — acceso para propietarios, staff y
  administradores de NovaCore (mismo formulario, el destino tras iniciar
  sesión depende del rol).
- `http://localhost:3000/dashboard` — restaurantes del usuario autenticado.
- `http://localhost:3000/novacore` — panel NovaCore (requiere
  `platform_admin`).
- `http://localhost:3000/r/[slug]` — carta pública de un restaurante activo
  (sin sesión). Con el seed de demostración aplicado: `/r/note-di-caffe`.
- `http://localhost:3000/novacore/design-system` — catálogo del sistema de
  diseño (requiere `platform_admin`); acepta `?preset=` (elegante, moderno,
  minimalista, oscuro, mediterraneo, premium) y `?mode=` (system, light,
  dark) para navegar los 6 temas sin escribir código.

Para probar el flujo de propietario necesitas, además del usuario en
`auth.users`, un restaurante y una fila en `restaurant_users` que lo
vincule con rol `owner` o `staff` — todavía no existe la pantalla de alta en
`/novacore` (llega en un bloque posterior), así que de momento se crean a
mano desde el SQL Editor (o reutiliza `note-di-caffe` si ya aplicaste el
seed de demostración):

```sql
insert into restaurants (slug, name) values ('mi-restaurante', 'Mi Restaurante');

insert into restaurant_users (restaurant_id, user_id, role)
select r.id, u.id, 'owner'
from restaurants r, auth.users u
where r.slug = 'mi-restaurante' and u.email = 'propietario@tu-dominio.com';
```

## Estructura del proyecto

```
app/(public)/r/[slug]/       carta pública — sin login, tema del propio restaurante
app/(owner)/dashboard/       panel del propietario — auth + rol owner/staff
app/(admin)/novacore/        panel NovaCore — auth + rol platform_admin
app/(admin)/novacore/design-system/  catálogo del sistema de diseño
app/login, app/auth/         formulario de acceso, callback de magic link, sign-out
features/                    lógica de negocio por dominio (menu/ poblado, resto por venir)
components/ui/               primitivas del design system (Button, Dialog, Tabs...)
components/shared/           compuestos de negocio (DishCard, QRCard, SearchBar...)
lib/theme/                   tokens, 6 presets, ThemeProvider, resolución de tema
lib/supabase/                clientes de Supabase (server, browser, admin, proxy)
lib/auth/                    server actions de login/logout + comprobación de roles
lib/types/database.ts        tipos de la base de datos (formato Supabase generado)
supabase/migrations/         esquema versionado
supabase/seed.sql            catálogo de alérgenos UE
supabase/seed-demo-note-di-caffe.sql  restaurante de demostración (opcional)
proxy.ts                     Proxy de Next.js 16 — refresca sesión y protege rutas
```

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run start    # sirve el build de producción
npm run lint     # ESLint
```

## Notas de seguridad de este bloque

- La autorización real vive en las políticas RLS de Postgres
  (`supabase/migrations/20260803120100_functions_and_rls.sql`), no en el
  código de Next.js. `proxy.ts` y los layouts de `(owner)`/`(admin)` son una
  capa de conveniencia (evitan que alguien sin sesión vea la interfaz), no
  la frontera de seguridad.
- `SUPABASE_SERVICE_ROLE_KEY` solo se importa desde
  `lib/supabase/admin.ts`, protegido con el paquete `server-only` para que
  el build falle si algún día terminase importado desde código de cliente.
- Ninguna política RLS quedó desactivada ni relajada para facilitar el
  desarrollo local.
