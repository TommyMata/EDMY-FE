# Agencia de Viajes - Frontend

Frontend en React/Vite para la Agencia de Viajes

## Instalación

```bash
npm install
npm run dev
```

## Estructura

```
frontend/
├── src/
│   ├── components/       (Componentes reutilizables)
│   ├── pages/           (Páginas principales)
│   ├── services/        (Servicios API)
│   ├── styles/          (Estilos CSS)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

## Conexión con Backend

El frontend se conecta al backend Laravel en `http://localhost:8000/api/v1`

Asegúrate de que:
1. El backend está corriendo en `http://localhost:8000`
2. El archivo `.env` tiene configurado: `VITE_API_URL=http://localhost:8000/api/v1`

## Ejecutar

```bash
npm run dev   # Modo desarrollo (http://localhost:5173)
npm run build # Construir para producción
```
