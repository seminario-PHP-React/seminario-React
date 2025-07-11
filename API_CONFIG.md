# Configuración Centralizada de la API

## 📁 Archivos de configuración

### 1. **Variables de entorno** (`.env`)
```bash
VITE_API_BASE_URL=http://seminariophp.localhost
```

### 2. **Configuración centralizada** (`src/config/api.ts`)
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://seminariophp.localhost',
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'x-api-key': 'abc123'
  }
};
```

## 🔧 Funciones helper disponibles

### `buildApiUrl(endpoint: string)`
Construye URLs completas para la API:
```typescript
buildApiUrl('/usuarios/1/mazos') // → http://seminariophp.localhost/usuarios/1/mazos
```

### `getAuthHeaders(token?: string)`
Obtiene headers con autenticación:
```typescript
getAuthHeaders(token) // → { 'Content-Type': 'application/json', 'x-api-key': 'abc123', 'Authorization': 'Bearer token' }
```

## 📝 Ejemplos de uso

### Antes (URLs hardcodeadas):
```typescript
const response = await fetch('http://localhost:8000/usuarios/1/mazos', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-api-key': 'abc123',
    'Content-Type': 'application/json'
  }
});
```

### Después (configuración centralizada):
```typescript
import { buildApiUrl, getAuthHeaders } from '../../config/api';

const response = await fetch(buildApiUrl('/usuarios/1/mazos'), {
  headers: getAuthHeaders(token)
});
```

## 🚀 Cambiar la URL del backend

Para cambiar la URL del backend, solo edita el archivo `.env`:

```bash
# Cambiar a otra URL
VITE_API_BASE_URL=http://tu-nueva-url.com

# O usar localhost
VITE_API_BASE_URL=http://localhost:8000
```

## ✅ Archivos actualizados

- ✅ `LoginComponent.tsx`
- ✅ `MazosPage.tsx`
- ✅ `JugarPage.tsx`
- ✅ `StatPage.jsx`
- ✅ `EditarUsuarioPage.tsx`
- ✅ `RegistroPage.tsx`

## 🔄 Beneficios

1. **Mantenimiento fácil**: Un solo lugar para cambiar URLs
2. **Código más limpio**: Headers centralizados
3. **Consistencia**: Misma configuración en toda la app
4. **Flexibilidad**: Fácil cambio de entorno (dev/prod) 

### Causas comunes y cómo solucionarlas

#### 1. **Nombre de host incorrecto**
- En tu `.env` y configuración usas:  
  `VITE_API_BASE_URL=http://seminariophp.localhost`
- Pero mencionas que tu XAMPP está en:  
  `localhost.seminariophp`

**Solución:**  
Asegúrate de que el nombre de host en `.env` coincida exactamente con el de XAMPP.  
Por ejemplo, si tu backend responde en `http://localhost.seminariophp`, tu `.env` debe ser:

```
VITE_API_BASE_URL=http://localhost.seminariophp
```

#### 2. **El backend no está corriendo**
- Verifica que el servidor Apache de XAMPP esté iniciado.
- Abre en tu navegador:  
  `http://localhost.seminariophp/login`  
  (o la ruta que corresponda a tu API)
- Si no carga, el problema es del backend.

#### 3. **CORS**
- Si el frontend y backend están en hosts diferentes, asegúrate de que tu backend PHP permita CORS (Access-Control-Allow-Origin).

#### 4. **Proxy de Vite**
- Si usas el proxy de Vite, puedes hacer peticiones a `/login` y Vite las redirige a tu backend.  
  El proxy debe apuntar al host correcto.

Ejemplo en `vite.config.js`:
```js
proxy: {
  '/login': 'http://localhost.seminariophp',
  // ...otros endpoints
}
```

---

## Pasos para solucionar

1. **Corrige el archivo `.env`**  
   Cambia a:
   ```
   VITE_API_BASE_URL=http://localhost.seminariophp
   ```

2. **Corrige el proxy de Vite** (si lo usas):  
   En `vite.config.js`:
   ```js
   proxy: {
     '/login': 'http://localhost.seminariophp',
     // ...
   }
   ```

3. **Reinicia el servidor de desarrollo**  
   Cada vez que cambias `.env` o `vite.config.js`, debes reiniciar Vite:
   ```bash
   npm run dev
   ```

4. **Verifica el backend**  
   Abre en tu navegador:  
   `http://localhost.seminariophp/login`  
   Si no ves respuesta, el problema es del backend.

---

¿Quieres que te ayude a editar los archivos y reiniciar el servidor?  
¿O prefieres que te pase los comandos para hacerlo tú? 