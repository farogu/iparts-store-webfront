
# Guía de Despliegue en Vercel

## Pasos para desplegar:

### 1. Preparar Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta gratuita
3. Conecta tu cuenta de GitHub (si usas GitHub)

### 2. Desplegar desde Lovable
1. En Lovable, haz clic en el botón "Publish" (arriba a la derecha)
2. Selecciona "Deploy to Vercel"
3. Autoriza la conexión con Vercel
4. El proyecto se desplegará automáticamente

### 3. Configurar Variables de Entorno en Vercel
Una vez desplegado, ve a tu dashboard de Vercel:
1. Selecciona tu proyecto
2. Ve a Settings > Environment Variables
3. Agrega estas variables:
   - `VITE_SHOPIFY_DOMAIN`: r2qsad-18.myshopify.com
   - `VITE_SHOPIFY_STOREFRONT_TOKEN`: 2dccc961d3058108376a21e6a51c61e6
   - `VITE_APP_URL`: [tu-url-de-vercel].vercel.app

### 4. Verificar el Despliegue
- Accede a tu URL de Vercel
- Verifica que los productos se cargan correctamente
- Prueba el flujo de compra

## Dominio Personalizado (Opcional)
Si tienes un dominio propio:
1. En Vercel, ve a Settings > Domains
2. Agrega tu dominio
3. Configura los DNS según las instrucciones de Vercel

## Troubleshooting
- Si hay errores, revisa los logs en Vercel Dashboard
- Asegúrate de que todas las variables de entorno estén configuradas
- Verifica que tu token de Shopify tenga los permisos correctos
