# Assessment Next.js + TypeScript – Refactor de proyecto existente

## 1. Descripción general

Este proyecto es una aplicación Next.js que consume la API pública de Rick and Morty para mostrar una lista de personajes y un dashboard con filtros y estadísticas básicas.

El objetivo del assessment no era crear una app desde cero, sino **mejorar un código heredado** con problemas de tipado, arquitectura y manejo de estados, manteniendo siempre el proyecto funcional.

---

## 2. Problemas detectados en el código original

### 2.1 Tipado y uso de TypeScript

- Uso extensivo de `any`, por ejemplo:
  - `const [characters, setCharacters] = useState<any[]>([])` en distintas páginas.
  - `const [stats, setStats] = useState<any>({})` en el dashboard.
- Ausencia de tipos compartidos para el dominio ([Character](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:0:0-6:1), [ApiResponse](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:8:0-10:1), etc.).
- Errores no tipados correctamente en los `catch` (uso de `any` en vez de `unknown` + checks).

**Riesgo**: imposible confiar en el editor/compilador para detectar errores de datos, mayor probabilidad de errores en tiempo de ejecución.

---

### 2.2 Arquitectura y separación de responsabilidades

- Llamadas directas a `fetch` dentro de los componentes de página ([Home](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/app/page.tsx:4:0-6:1), `(home)`, `Dashboard`), en vez de centralizar la lógica de acceso a datos.
- Interfaces de datos repetidas en varios archivos en lugar de definir un único contrato de tipos.
- Lógica de negocio (cálculo de estadísticas, filtrado) mezclada con JSX dentro de los componentes.

**Riesgo**: código difícil de mantener, duplicado y poco reusable.

---

### 2.3 Manejo de estados (loading, error, datos vacíos)

- En [Home](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/app/page.tsx:4:0-6:1) original:
  - Solo estado `loading`, sin manejo de `error` ni de lista vacía.
- En `Dashboard` original:
  - `loading` y `error` presentes, pero sin tipado estricto.
  - Lista vacía no tratada de forma clara en la UI.

**Riesgo**: mala experiencia de usuario en caso de errores de red o listas vacías y más difícil de depurar.

---

### 2.4 Legibilidad y duplicación

- Existían dos páginas Home:
  - [src/app/page.tsx](cci:7://file:///home/Coder/Documentos/Juseth/employibilty-test/src/app/page.tsx:0:0-0:0)
  - `src/app/(home)/page.tsx`
  
  con lógica similar pero ligeramente distinta (diferentes props para [Card](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/app/components/Card.tsx:50:0-67:2), diferentes efectos en `onClick`).
- Código mezclando estilos de Tailwind y clases tipo Bootstrap.
- Estructura de carpetas sin separación clara entre:
  - `types`
  - `services`
  - `components`

---

## 3. Decisiones técnicas y refactorización

### 3.1 Tipos compartidos

Se creó [src/types/character.ts](cci:7://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:0:0-0:0) con:

- [Character](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:0:0-6:1): modelo de un personaje (id, name, status, species, image).
- [ApiResponse](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:8:0-10:1): respuesta tipada de la API (`results: Character[]`).
- [CharacterStats](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:12:0-17:1): estructura para las estadísticas del dashboard (`total`, `alive`, `dead`, `unknown`).

**Justificación**: centralizar el contrato de datos para que Home, Dashboard y servicios compartan el mismo modelo, reduciendo duplicación y errores.

---

### 3.2 Servicio de datos (API)

Se refactorizó [src/services/api.ts](cci:7://file:///home/Coder/Documentos/Juseth/employibilty-test/src/services/api.ts:0:0-0:0):

- Antes: devolvía el `Response` crudo de `fetch`, sin `response.ok`, sin tipos.
- Ahora:
  - Encapsula la URL base de personajes.
  - Valida `response.ok` y lanza un error con mensaje claro si falla.
  - Parsea el JSON como [ApiResponse](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:8:0-10:1) y devuelve [Character[]](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:0:0-6:1).
  - Firma tipada: [getCharacters(): Promise<Character[]>](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/services/api.ts:4:0-13:1).

**Justificación**: separar acceso a datos de la UI, facilitar el testeo y evitar repetir lógica de `fetch` y parsing en cada componente.

---

### 3.3 Refactor de Home

- Se decidió que la **Home real del usuario** sería el dashboard.
- [src/app/page.tsx](cci:7://file:///home/Coder/Documentos/Juseth/employibilty-test/src/app/page.tsx:0:0-0:0) ahora:
  - Usa `redirect("/dashboard")` para enviar al usuario directamente al dashboard.
- `src/app/(home)/page.tsx` ahora:
  - Reexporta el componente principal: `export { default } from "../page";`
  - Deja de tener lógica propia y evita duplicación.

**Justificación**: evitar dos “homes” distintas que compiten entre sí y mantener una única fuente de verdad para la landing de la app.

---

### 3.4 Refactor de Dashboard

En [src/app/dashboard/page.tsx](cci:7://file:///home/Coder/Documentos/Juseth/employibilty-test/src/app/dashboard/page.tsx:0:0-0:0) se hicieron estos cambios:

- Se eliminaron las interfaces locales [Character](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:0:0-6:1) y [ApiResponse](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:8:0-10:1) y se importan desde [src/types/character.ts](cci:7://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:0:0-0:0).
- Se eliminó el uso de `any`:
  - `characters` y `filteredCharacters` ahora son [Character[]](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:0:0-6:1).
  - `stats` ahora es [CharacterStats](cci:2://file:///home/Coder/Documentos/Juseth/employibilty-test/src/types/character.ts:12:0-17:1) inicializado una sola vez.
- Se sustituyó el `fetch` directo por el servicio [getCharacters()](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/services/api.ts:4:0-13:1):
  - Maneja `loading`, borra `error` antes de cargar.
  - Usa `try/catch` con `err: unknown` y comprobación `instanceof Error` para construir mensajes seguros.
- Se mantiene y enfatiza el mensaje de “No se encontraron resultados” cuando los filtros dejan la lista vacía.
- Se crearon/aislaron componentes UI reutilizables como:
  - [StatsCard](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/components/StatsCard.tsx:6:0-22:1) (para métricas del dashboard).
  - [FiltersPanel](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/components/FiltersPanel.tsx:7:0-41:1) (para la UI de filtros de búsqueda y estado).

**Justificación**: mejorar la legibilidad, reutilizar la lógica de datos y aprovechar TypeScript para detectar errores en tiempo de compilación.

---

## 4. Manejo de estados y flujos de datos

La app ahora trata explícitamente los tres estados principales:

- **Loading**:
  - [Home](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/app/page.tsx:4:0-6:1) redirige directamente; el estado de loading relevante es el del `Dashboard`.
  - `Dashboard` muestra un spinner a pantalla completa mientras se cargan datos.

- **Error**:
  - `Dashboard` muestra un `alert-danger` con el mensaje de error originado desde el servicio ([getCharacters](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/services/api.ts:4:0-13:1)), incluyendo código de estado HTTP cuando aplica.

- **Datos vacíos**:
  - Si después de aplicar filtros no hay personajes visibles, se muestra un mensaje info: “No se encontraron resultados”.
  - Las estadísticas se inicializan en 0 para evitar lecturas de valores indefinidos.

**Flujo de datos**:

1. La página inicia en `/` → se redirige a `/dashboard`.
2. `Dashboard` monta:
   - Llama a [getCharacters()](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/services/api.ts:4:0-13:1) desde el `useEffect` inicial.
   - Actualiza `characters`, `filteredCharacters` y `stats`.
3. El usuario interactúa con [FiltersPanel](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/components/FiltersPanel.tsx:7:0-41:1):
   - Actualiza `search` y `statusFilter`.
   - Se recalcula `filteredCharacters` y `totalCharacters`.
   - La UI se vuelve a renderizar con los datos filtrados.

---

## 5. Propuestas de mejora futura

Algunas posibles líneas de evolución:

- Añadir **tests unitarios** para:
  - El servicio [getCharacters](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/services/api.ts:4:0-13:1).
  - La función [calculateStats](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/app/dashboard/page.tsx:43:2-54:4).
- Extraer [calculateStats](cci:1://file:///home/Coder/Documentos/Juseth/employibilty-test/src/app/dashboard/page.tsx:43:2-54:4) y la lógica de filtros a helpers/hook dedicados (`useCharactersDashboard`).
- Unificar el sistema de diseño:
  - Elegir entre Bootstrap o Tailwind y aplicarlo consistentemente.
- Manejo de paginación:
  - Extender el servicio y el dashboard para soportar múltiples páginas de la API.
- Añadir un sistema básico de **autenticación/mock** para hacer útil la pantalla de Login/Register.

---

## 6. Cómo ejecutar el proyecto

```bash
npm install
npm run dev
# Abrir http://localhost:3000