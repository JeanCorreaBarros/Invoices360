# PlasticosLC - Sistema de Facturación y Gestión Empresarial

Una plataforma moderna de SaaS built con Next.js 16 para gestión completa de facturas, inventario, clientes y reportes.

## 🚀 Características

- **Gestión de Facturas**: Crear, editar y gestionar facturas completas con firma digital
- **Inventario**: Control de productos y stock en tiempo real
- **Gestión de Clientes**: Base de datos centralizada de clientes con contacto directo
- **Reportes**: Dashboard con análisis de ventas, ingresos y tendencias
- **Estimados**: Crear presupuestos que se pueden convertir en facturas
- **Pagos**: Seguimiento de pagos recibidos y pendientes
- **Cobros**: Gestión de cobranzas
- **Recurrentes**: Facturas automáticas recurrentes
- **Menú Responsivo**: Interfaz completa adaptada para móvil y desktop
- **Autenticación**: Sistema seguro de login y sesiones
- **PWA**: Instalable como aplicación en dispositivos móviles

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm
- Git

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd plasticoslc-invoicing-app
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus valores:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_clave_publica
```

4. **Instalar dependencias adicionales** (si es necesario)
```bash
npm install framer-motion --legacy-peer-deps
```

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`

### Producción
```bash
npm run build
npm run start
```

## 📁 Estructura del Proyecto

```
plasticoslc-invoicing-app/
├── app/                           # Next.js App Router
│   ├── api/                      # Rutas API
│   │   └── modules/
│   │       └── agenda/
│   │           └── clients/
│   ├── facturacion/
│   │   └── nueva/               # Crear nueva factura
│   ├── inventarios/             # Gestión de inventario
│   ├── compras/                 # Módulo de compras
│   ├── ventas/                  # Módulo de ventas
│   ├── estimados/               # Crear estimados
│   ├── pagos/                   # Gestión de pagos
│   ├── recurrentes/             # Facturas recurrentes
│   ├── cobros/                  # Gestión de cobros
│   ├── clientes/                # Gestión de clientes
│   ├── productos/               # Catálogo de productos
│   ├── reportes/                # Reportes y análisis
│   ├── configuracion/           # Configuración del sistema
│   ├── ayuda/                   # Centro de ayuda
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   └── globals.css              # Estilos globales
├── components/                   # Componentes reutilizables
│   ├── dashboard-header.tsx     # Header con navegación
│   ├── invoice-list.tsx         # Lista de facturas
│   ├── invoice-detail.tsx       # Detalles de factura
│   ├── login-page.tsx           # Página de login
│   ├── mobile-bottom-nav.tsx    # Navegación móvil
│   ├── summary-cards.tsx        # Tarjetas de resumen
│   ├── ui/                      # Componentes shadcn/ui
│   └── theme-provider.tsx       # Proveedor de tema
├── hooks/                        # React hooks personalizados
│   ├── use-mobile.tsx           # Detectar dispositivo móvil
│   └── use-toast.ts             # Notificaciones toast
├── lib/                          # Utilidades y funciones
│   ├── auth-context.tsx         # Contexto de autenticación
│   ├── invoice-data.ts          # Datos de ejemplo
│   └── utils.ts                 # Funciones auxiliares
├── public/                       # Archivos estáticos
│   ├── manifest.json            # PWA manifest
│   └── icon-*.png               # Iconos de la app
├── styles/                       # Estilos globales
├── .env                         # Variables de entorno
├── next.config.mjs              # Configuración de Next.js
├── tailwind.config.ts           # Configuración de Tailwind
├── tsconfig.json                # Configuración de TypeScript
└── package.json                 # Dependencias del proyecto
```

## 🔧 Configuración Importante

### Autenticación
El sistema utiliza un contexto de React (`AuthProvider`) para manejar la autenticación. Los usuarios se redirigen a `/login` si no están autenticados.

**Localización**: `lib/auth-context.tsx`

### Tema y Estilos
- **Framework CSS**: Tailwind CSS
- **Colores principales**:
  - Fondo oscuro: `hsl(228,14%,9%)`
  - Verde principal: `hsl(90,100%,50%)`
  - Texto claro: `hsl(0,0%,95%)`

### Componentes UI
Se utiliza `shadcn/ui` para componentes pre-construidos y accesibles.

**Localización**: `components/ui/`

## 📱 Características Responsivas

- **Hamburger Menu**: Visible en móviles, oculto en desktop
- **Sidebar Navigation**: Despliega todas las opciones de navegación
- **Grid Adaptable**: Layouts fluidos para todos los tamaños

## 🌐 API Endpoints

### Clientes
```
GET /api/modules/agenda/clients
```

### Facturas (rutas predefinidas)
```
GET /api/modules/factura/invoices
GET /api/modules/factura/invoicesDetails
POST /api/modules/factura/invoices
```

## 🔐 Variables de Entorno

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Autenticación
NEXT_PUBLIC_AUTH_REDIRECT=/login

# Aplicación
NEXT_PUBLIC_APP_NAME=PlasticosLC

# Email
NEXT_PUBLIC_SUPPORT_EMAIL=soporte@plasticoslc.com

# Pagos (Stripe - opcional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Ambiente
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development
```

## 📦 Dependencias Principales

- **Next.js 16.1.6**: Framework React con Turbopack
- **React 19**: Librería UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de estilos
- **lucide-react**: Iconos
- **framer-motion**: Animaciones
- **shadcn/ui**: Componentes UI accesibles

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## 🐛 Troubleshooting

### Error: "useAuth outside AuthProvider"
**Solución**: Asegúrate de que el componente está dentro de `ClientProviders` en `app/layout.tsx`

### Error: "Module not found: framer-motion"
**Solución**: Instalar con flag legacy-peer-deps
```bash
npm install framer-motion --legacy-peer-deps
```

### Error: "Cannot find module 'lucide-react'"
**Solución**: Instalar dependencias faltantes
```bash
npm install lucide-react
```

## 📝 Uso de la Aplicación

### Crear una Factura
1. Ir a "Facturas" en el header o sidebar
2. Hacer clic en "Nueva Factura"
3. Seleccionar cliente
4. Agregar items/productos
5. Agregar firma digital
6. Hacer clic en "Emitir"

### Gestionar Inventario
1. Ir a "Productos" (desde sidebar)
2. Ver, editar o agregar productos
3. Actualizar precios y stock

### Ver Reportes
1. Ir a "Reportes" (desde sidebar)
2. Seleccionar rango de fechas
3. Analizar gráficos y estadísticas

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 📞 Soporte

Para reportar bugs o sugerencias, contáctanos en:
- **Email**: soporte@plasticoslc.com
- **Teléfono**: +1 (123) 456-7890

## 🗺️ Roadmap

- [ ] Integración con pasarelas de pago
- [ ] Módulo de contabilidad
- [ ] Sincronización de datos en tiempo real
- [ ] App móvil nativa
- [ ] Integraciones con terceros
- [ ] Sistema de notificaciones por email/SMS
- [ ] Backup automático en la nube
- [ ] Auditoría y logs de cambios

## ⭐ Reconocimientos

- Next.js por el increíble framework
- shadcn/ui por los componentes
- Tailwind CSS por los estilos
- Vercel por el hosting

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026  
**Estado**: En desarrollo activo ✅
