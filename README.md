# HC-SCAN (Helpcopies Scan) - Frontend

Panel de administración e interfaz web para **HC-SCAN (Helpcopies Scan)**, plataforma SaaS multitenant para ingesta inteligente de documentos PDF, procesamiento con Inteligencia Artificial y consulta estructurada.

## 🚀 Tecnologías Principales

- **Framework:** Next.js 13 (Pages Router con React 18)
- **UI & Diseño:** Material-UI (MUI v5)
- **Seguridad & Permisos:** CASL (`@casl/ability` y `@casl/react`) con control estricto multitenant
- **Gestión de Estado:** Redux Toolkit (`@reduxjs/toolkit`)
- **Gestión Documental:** Drag & Drop con `react-dropzone` (validación PDF, max 25MB) y previsualización segura en streaming
- **Formularios:** `react-hook-form` con validación mediante `yup`
- **Tablas de Datos:** `@mui/x-data-grid`
- **Tiempo Real:** WebSocket (`socket.io-client`) para notificaciones inmediatas

---

## 🏛️ Estructura de Navegación y Páginas

- `/dashboards`: Resumen de métricas, estado de documentos e ingesta con accesos directos.
- `/documents`: Gestión Documental PDF (Carga Web, sincronización FTP, filtros por estado IA, previsualización y descarga).
- `/companies`: Gestión de organizaciones y tenants (**Exclusivo para Super Administrador**, con límites de usuarios `maxUsers` y módulos asignados `enabledModules`).
- `/user/list`: Administración de usuarios por tenant con visualización de cupos.
- `/roles` y `/permissions`: Matriz de roles y permisos del sistema.
- `/audit`: Trazabilidad y logs de auditoría por compañía.
- `/notifications`: Centro de avisos y notificaciones en tiempo real.

---

## 🧩 Biblioteca de Componentes Reutilizables

Ubicados en `src/components/common/` y `src/components/documents/`, catalogados en `.agents/components_catalog.md`:

| Componente | Ruta | Descripción |
| :--- | :--- | :--- |
| `StatusChip` | `src/components/common/StatusChip.tsx` | Chip universal para estados de documentos (`PENDING`, `PROCESSED`, etc.) y compañías. |
| `QuotaProgressBar` | `src/components/common/QuotaProgressBar.tsx` | Barra de progreso visual con porcentajes y alerta de umbrales (`activeUsers / maxUsers`). |
| `ConfirmActionDialog` | `src/components/common/ConfirmActionDialog.tsx` | Diálogo modal estandarizado para confirmaciones con estado de carga. |
| `DocumentDropzone` | `src/components/documents/DocumentDropzone.tsx` | Zona Drag & Drop para PDFs con validación de extensión y tamaño (25MB). |
| `SyncFtpButton` | `src/components/documents/SyncFtpButton.tsx` | Botón interactivo con spinner para sincronizar PDFs desde el servidor FTP. |
| `PdfViewerModal` | `src/components/documents/PdfViewerModal.tsx` | Visor de PDF integrado mediante streaming seguro con pestaña de datos IA. |

---

## 📦 Instalación y Ejecución

1. Configurar variables de entorno en `.env`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5002/api
   ```

2. Instalar dependencias:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Compilar para producción:
   ```bash
   npm run build
   ```
