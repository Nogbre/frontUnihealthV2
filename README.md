# Unihealth Frontend

Frontend moderno y minimalista para el sistema de gestión de salud Unihealth, construido con React, TypeScript, Vite y Tailwind CSS.

## 🚀 Características

- **Diseño Minimalista**: Interfaz limpia y moderna con Tailwind CSS
- **Autenticación Completa**: Login y registro con JWT
- **Gestión de Pacientes**: CRUD completo de pacientes
- **Citas Médicas**: Crear, listar y gestionar citas
- **Sistema de Alertas**: Crear, asignar y resolver alertas
- **Signos Vitales**: Registrar y consultar signos vitales de pacientes
- **Dashboard Interactivo**: Resumen general con estadísticas y datos recientes
- **Responsive**: Diseño adaptativo para móviles y tablets

## 📋 Prerequisitos

- Node.js (v18 o superior)
- npm o yarn
- Backend Unihealth corriendo en `http://localhost:3000`

## 🛠️ Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno** (opcional)
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm run preview` - Previsualiza la versión de producción

## 🏗️ Estructura del Proyecto

```
front/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── contexts/        # Contextos de React (Auth)
│   ├── pages/           # Páginas principales
│   ├── services/        # Servicios API
│   ├── config/          # Configuración
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Punto de entrada
├── public/              # Archivos estáticos
└── package.json
```

## 🎨 Tecnologías Utilizadas

- **React 18**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **React Router**: Navegación
- **Axios**: Cliente HTTP
- **Tailwind CSS**: Framework de estilos
- **Lucide React**: Iconos
- **date-fns**: Manejo de fechas

## 📱 Páginas Principales

### Dashboard
- Resumen general del sistema
- Estadísticas de pacientes, citas y alertas
- Lista de citas y alertas recientes

### Pacientes
- Lista de todos los pacientes
- Crear, editar y eliminar pacientes
- Visualización de información detallada

### Citas
- Lista de todas las citas
- Crear nuevas citas
- Actualizar estado de citas (confirmar/cancelar)

### Alertas
- Lista de alertas del sistema
- Crear nuevas alertas
- Asignar alertas a enfermeros
- Marcar alertas como resueltas

### Signos Vitales
- Registrar signos vitales de pacientes
- Consultar historial de signos vitales
- Visualización con iconos y colores

## 🔐 Autenticación

El sistema utiliza JWT para la autenticación. El token se almacena en `localStorage` y se envía automáticamente en todas las peticiones API.

## 🎯 Próximas Mejoras

- [ ] Filtros y búsqueda avanzada
- [ ] Gráficos de signos vitales
- [ ] Notificaciones en tiempo real
- [ ] Exportación de datos
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)

## 📄 Licencia

UNLICENSED - Privado

