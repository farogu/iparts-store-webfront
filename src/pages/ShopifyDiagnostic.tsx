
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ShopifyConnectionStatus from '@/components/ShopifyConnectionStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShopifyDiagnostic = () => {
  const { toast } = useToast();
  const [copiedEnv, setCopiedEnv] = useState(false);

  const envVariables = `VITE_SHOPIFY_DOMAIN=tu-tienda.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=tu_storefront_access_token
VITE_APP_URL=https://tu-app.vercel.app`;

  const copyEnvVariables = () => {
    navigator.clipboard.writeText(envVariables);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
    toast({
      title: 'Copiado',
      description: 'Variables de entorno copiadas al portapapeles',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Diagnóstico de Conexión Shopify
          </h1>
          <p className="text-gray-600">
            Verifica y configura la conexión con tu tienda de Shopify
          </p>
        </div>

        <div className="space-y-6">
          <ShopifyConnectionStatus />

          <Card>
            <CardHeader>
              <CardTitle>Guía de Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Crear Private App en Shopify</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">• Ve a tu Admin de Shopify</p>
                  <p className="text-sm">• Settings → Apps and sales channels</p>
                  <p className="text-sm">• Develop apps → Create an app</p>
                  <p className="text-sm">• Dale un nombre a tu aplicación</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Configurar Storefront API</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">• En tu app, ve a "Configuration"</p>
                  <p className="text-sm">• Habilita "Storefront API access"</p>
                  <p className="text-sm">• Selecciona estos permisos:</p>
                  <div className="ml-4 space-y-1">
                    <Badge variant="outline" className="mr-2">unauthenticated_read_products</Badge>
                    <Badge variant="outline" className="mr-2">unauthenticated_read_product_listings</Badge>
                    <Badge variant="outline" className="mr-2">unauthenticated_write_checkouts</Badge>
                    <Badge variant="outline" className="mr-2">unauthenticated_read_checkouts</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Obtener Credenciales</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">• Copia el "Storefront access token"</p>
                  <p className="text-sm">• Anota tu dominio de Shopify (ej: mi-tienda.myshopify.com)</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">4. Configurar en Vercel</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-2">Agrega estas variables de entorno en Vercel:</p>
                  <div className="bg-black text-green-400 p-3 rounded font-mono text-xs relative">
                    <pre>{envVariables}</pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 text-xs"
                      onClick={copyEnvVariables}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedEnv ? 'Copiado' : 'Copiar'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => window.open('https://help.shopify.com/en/manual/apps/private-apps', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Documentación Shopify
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => window.open('https://vercel.com/docs/concepts/projects/environment-variables', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Variables Vercel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShopifyDiagnostic;
