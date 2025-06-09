# seminario-React

Repositorio correspondiente a la **segunda entrega** del Seminario de Lenguajes 2025 — opción **PHP, React y API REST**.  
Este proyecto implementa una aplicación React que consume la API desarrollada en la primera parte (backend PHP) y permite al usuario gestionar mazos y jugar partidas.

---

## 📁 Estructura del proyecto

```
/seminario-React
├── public/                # Archivos estáticos (index.html, favicon, etc.)
├── src/                   # Código fuente
│   ├── assets/            # Imágenes y recursos estáticos
│   ├── components/        # Componentes reutilizables
│   ├── pages/             # Vistas principales (Login, Registro, Juego, etc.)
│   ├── styles/            # Estilos CSS / SCSS
│   ├── utils/             # Funciones auxiliares
│   ├── App.jsx            # Componente raíz
│   └── main.jsx           # Punto de entrada
├── package.json           # Dependencias y scripts
└── README.md              # Este archivo
```

---

## 🧩 Componentes obligatorios

- `HeaderComponent`: logo + título (redirecciona al home)
- `NavBarComponent`: navegación dinámica según estado de login
- `FooterComponent`: integrantes del grupo + año

Todos los componentes están organizados en la carpeta `src/components/`.

---

## ✅ Funcionalidades

- Navegación dinámica según estado del usuario
- Validación completa de formularios en el frontend
- Gestión completa de mazos (ABM)
- Consumo de API REST mediante `fetch` o `axios`
- Partida interactiva con visualización de resultados

---

## 📦 Librerías externas

> Todas las librerías utilizadas fueron instaladas mediante `npm` y están declaradas en `package.json`.

- `react-router-dom`: Navegación entre páginas
- `axios`: Llamadas a la API
- `classnames` (si se usa): Composición condicional de clases
- Cualquier otra que se incluya deberá documentarse aquí

---

## 🚀 Scripts de desarrollo

```bash
npm install     # Instala dependencias
npm run dev     # Inicia el servidor de desarrollo
npm run build   # Genera versión optimizada para producción
```
