# Instrucciones para Integrar Frontend con Backend Spring Boot

## 🚀 Cambios Realizados

### 1. Actualización del archivo `api.ts`
- ✅ Eliminadas las funciones mock (`mockResponses`)
- ✅ Cambiado el puerto del backend de 8089 a 8080
- ✅ Creadas nuevas funciones de API para Spring Boot:
  - `authAPI.login()` - Login de usuarios
  - `authAPI.register()` - Registro de usuarios
  - `authAPI.verifyToken()` - Verificación de token
  - `menuAPI.getMenu()` - Obtener menú
  - `orderAPI.*` - Funciones para órdenes

### 2. Actualización del `AuthContext.tsx`
- ✅ Eliminadas las referencias a `mockResponses`
- ✅ Actualizado `login()`, `loginAsClient()`, `loginAsAdmin()` para usar la API real
- ✅ Mejorada la verificación de tokens con `authAPI.verifyToken()`
- ✅ Agregada validación de roles en el frontend

### 3. Configuración del `.env`
- ✅ Actualizada la URL del backend a `http://localhost:8080/api`
- ✅ Eliminado el modo mock de desarrollo

## 🔧 Cómo Ejecutar

### Paso 1: Ejecutar el Backend Spring Boot
```bash
# En la carpeta del proyecto Spring Boot
mvn spring-boot:run
# O si usas Gradle:
./gradlew bootRun
```

### Paso 2: Ejecutar el Frontend React
```bash
# En la carpeta del frontend
npm run dev
# O con yarn:
yarn dev
```

## 🧪 Cómo Probar el Login

### Usuarios de Prueba (según el backend)
Asegúrate de que tu backend tenga estos usuarios de prueba:

**Usuario Administrador:**
- Email: `admin@toritogrill.com`
- Password: `admin123`
- Role: `admin`

**Usuario Cliente:**
- Email: `cliente@toritogrill.com`
- Password: `cliente123`
- Role: `client`

### Endpoints que debe tener tu Backend

1. **POST** `/api/auth/login`
   ```json
   {
     "email": "admin@toritogrill.com",
     "password": "admin123"
   }
   ```
   
   **Respuesta esperada:**
   ```json
   {
     "token": "jwt-token-aqui",
     "user": {
       "id": 1,
       "name": "Administrador",
       "email": "admin@toritogrill.com",
       "role": "admin"
     }
   }
   ```

2. **GET** `/api/auth/verify` (con Authorization header)
   - Debe verificar si el token JWT es válido
   - Retornar información del usuario si es válido

3. **GET** `/api/health`
   - Endpoint para verificar que el backend esté funcionando
   - Puede retornar simplemente `{"status": "OK"}`

## ⚠️ Posibles Errores y Soluciones

### Error: "Backend no disponible"
- ✅ Verifica que el backend esté ejecutándose en `http://localhost:8080`
- ✅ Verifica que el endpoint `/api/health` esté funcionando
- ✅ Revisa la consola del backend para errores

### Error: "CORS"
- ✅ Asegúrate de que tu backend tenga configurado CORS para `http://localhost:5173`
- ✅ En Spring Boot, agrega la configuración CORS que te proporcioné anteriormente

### Error: "Token inválido"
- ✅ Verifica que el endpoint `/api/auth/verify` esté implementado
- ✅ Asegúrate de que el JWT esté siendo validado correctamente

### Error: "Credenciales incorrectas"
- ✅ Verifica que los usuarios de prueba estén en la base de datos
- ✅ Asegúrate de que las contraseñas estén hasheadas correctamente

## 📝 Próximos Pasos

1. **Implementar registro de usuarios** - El frontend ya tiene `authAPI.register()`
2. **Conectar el menú** - Usar `menuAPI.getMenu()` en lugar del menú local
3. **Implementar órdenes** - Usar las funciones de `orderAPI`
4. **Agregar manejo de errores mejorado** - Mostrar mensajes más específicos al usuario

## 🎯 Resultado Esperado

Después de estos cambios:
- ✅ El frontend ya NO usa datos mock
- ✅ Todas las peticiones van al backend Spring Boot
- ✅ El login funciona con usuarios reales de la base de datos
- ✅ Los tokens JWT se validan correctamente
- ✅ Los roles se verifican tanto en frontend como backend

¡Ahora tu aplicación está completamente integrada con el backend de Spring Boot! 🎉