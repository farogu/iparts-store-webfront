
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw, Settings } from 'lucide-react';
import { ShopifyConnectionVerifier } from '@/utils/shopifyConnectionVerifier';

const ShopifyConnectionStatus = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean;
    error?: string;
    shopInfo?: { name: string; domain: string };
  } | null>(null);
  const [productTest, setProductTest] = useState<{
    success: boolean;
    error?: string;
    productCount?: number;
  } | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const status = await ShopifyConnectionVerifier.verifyConnection();
      setConnectionStatus(status);

      if (status.isConnected) {
        const testResult = await ShopifyConnectionVerifier.testProductsQuery();
        setProductTest(testResult);
      }
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        error: 'Failed to check connection',
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Estado de Conexión con Shopify
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Estado de la conexión:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={isChecking}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Verificando...' : 'Verificar'}
          </Button>
        </div>

        {connectionStatus && (
          <Alert variant={connectionStatus.isConnected ? 'default' : 'destructive'}>
            <div className="flex items-center gap-2">
              {connectionStatus.isConnected ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {connectionStatus.isConnected ? 'Conectado' : 'Error de Conexión'}
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {connectionStatus.isConnected ? (
                <div>
                  <p>✅ Conexión exitosa con Shopify</p>
                  {connectionStatus.shopInfo && (
                    <div className="mt-2 text-sm">
                      <p><strong>Tienda:</strong> {connectionStatus.shopInfo.name}</p>
                      <p><strong>Dominio:</strong> {connectionStatus.shopInfo.domain}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p>❌ No se pudo conectar con Shopify</p>
                  <p className="mt-1 text-sm"><strong>Error:</strong> {connectionStatus.error}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {productTest && (
          <Alert variant={productTest.success ? 'default' : 'destructive'}>
            <AlertTitle>Test de Productos</AlertTitle>
            <AlertDescription>
              {productTest.success ? (
                <p>✅ API de productos funcionando correctamente</p>
              ) : (
                <div>
                  <p>❌ Error al obtener productos</p>
                  <p className="mt-1 text-sm"><strong>Error:</strong> {productTest.error}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Configuración actual:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Dominio:</strong> {import.meta.env.VITE_SHOPIFY_DOMAIN}</p>
            <p><strong>Token:</strong> {import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN ? '***configurado***' : 'NO CONFIGURADO'}</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">Pasos para configurar:</h4>
          <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
            <li>Ve a tu Admin de Shopify → Settings → Apps and sales channels</li>
            <li>Develop apps → Create an app</li>
            <li>Configura Storefront API access con permisos de lectura</li>
            <li>Copia el Storefront access token</li>
            <li>Actualiza las variables en Vercel con tus credenciales</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopifyConnectionStatus;
