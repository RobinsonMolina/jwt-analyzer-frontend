# JWT Analyzer - Frontend

Aplicación web interactiva para análisis completo de JSON Web Tokens con visualización de las seis fases de lenguajes formales.

## Descripción

Frontend desarrollado con React y Vite que consume la API REST del analizador JWT. Proporciona una interfaz visual intuitiva para ejecutar y observar las fases de análisis léxico, sintáctico, semántico, decodificación, codificación y verificación criptográfica en tiempo real.

## Características Principales

### Visualización de Fases
- **Análisis Léxico**: Muestra tokens identificados y validación del alfabeto Base64URL
- **Análisis Sintáctico**: Árbol de derivación y validación de gramática
- **Análisis Semántico**: Tabla de símbolos con tipos y validaciones temporales
- **Decodificación**: Header y payload legibles con claims estándar
- **Codificación**: Generador interactivo de nuevos JWT
- **Verificación**: Estado de firma digital y detección de manipulaciones

### Funcionalidades
- Análisis completo con un solo clic
- Generador de JWT con configuración personalizada
- Validación en tiempo real
- Interfaz responsive y moderna
- Manejo de errores con feedback visual
- Copia rápida de tokens generados

## Arquitectura
```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Analyzer.jsx     # Componente principal de análisis
│   │   ├── PhaseViewer.jsx  # Visualizador de fases individuales
│   │   ├── TokenForm.jsx    # Formulario de entrada
│   │   └── ResultsPanel.jsx # Panel de resultados
│   ├── services/
│   │   └── api.js           # Cliente Axios para API
│   ├── assets/              # Recursos estáticos
│   ├── App.jsx              # Componente raíz
│   └── main.jsx             # Punto de entrada
├── public/                  # Archivos públicos
├── index.html               # HTML base
├── vite.config.js           # Configuración de Vite
├── tailwind.config.js       # Configuración de Tailwind CSS
├── postcss.config.js        # Configuración de PostCSS
└── package.json             # Dependencias del proyecto
```

## Instalación

### Requisitos
- Node.js 24+
- npm o pnpm

### Configuración

1. **Instalar dependencias**
```bash
npm install
```

2. **Ejecutar en desarrollo**
```bash
npm run dev
```

## Integración con Backend

El frontend consume los siguientes endpoints de la API:

### Análisis completo
```javascript
POST /api/v1/analyze
// Request
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "secret": "my-secret-key"
}

// Response: Incluye las 6 fases de análisis
```

### Codificar JWT
```javascript
POST /api/v1/encode
{
  "payload": {"sub": "user123", "role": "admin"},
  "secret": "my-secret-key",
  "algorithm": "HS256",
  "expires_in": 3600
}
```

### Decodificar JWT
```javascript
POST /api/v1/decode
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Verificar firma
```javascript
POST /api/v1/verify
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "secret": "my-secret-key"
}
```

### Consultar logs
```javascript
GET /api/v1/logs?limit=50
```

## Uso de la Aplicación

1. **Analizar un JWT existente**
   - Pegar el token en el campo de entrada
   - Ingresar la clave secreta (si se requiere verificación)
   - Hacer clic en "Analizar Token"
   - Visualizar las 6 fases de análisis

2. **Generar un nuevo JWT**
   - Hacer clic en "Generar Token"
   - Configurar payload personalizado
   - Seleccionar algoritmo (HS256, HS384, HS512)
   - Establecer tiempo de expiración
   - Copiar el token generado

## Tecnologías

- **React 19.1.1** - Biblioteca para interfaces de usuario
- **Vite 7.1.7** - Build tool y servidor de desarrollo ultrarrápido
- **Axios 1.13.2** - Cliente HTTP para peticiones a la API
- **Tailwind CSS 3.4.1** - Framework CSS utility-first
- **PostCSS 8.4.35** - Procesador de CSS
- **ESLint 9.36.0** - Linter para mantener calidad de código
