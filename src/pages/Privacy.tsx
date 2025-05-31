
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Información que Recopilamos</h2>
            <p>
              En iParts Store recopilamos información personal cuando realizas una compra, 
              te registras en nuestro sitio web, te suscribes a nuestro boletín informativo 
              o participas en una encuesta.
            </p>
            <p>La información recopilada puede incluir:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Dirección postal</li>
              <li>Número de teléfono</li>
              <li>Información de pago (procesada de forma segura)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cómo Utilizamos tu Información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Procesar y completar tus pedidos</li>
              <li>Enviarte confirmaciones de pedidos y actualizaciones de envío</li>
              <li>Mejorar nuestro servicio al cliente</li>
              <li>Personalizar tu experiencia de compra</li>
              <li>Enviar comunicaciones promocionales (solo si has dado tu consentimiento)</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Protección de la Información</h2>
            <p>
              Implementamos medidas de seguridad apropiadas para proteger tu información personal 
              contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos 
              encriptación SSL para todas las transacciones y almacenamos la información en 
              servidores seguros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Compartir Información</h2>
            <p>
              No vendemos, intercambiamos ni transferimos tu información personal a terceros, 
              excepto en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proveedores de servicios que nos ayudan a operar nuestro negocio</li>
              <li>Procesadores de pagos para completar transacciones</li>
              <li>Servicios de envío para entregar productos</li>
              <li>Cuando sea requerido por ley</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
            <p>
              Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. 
              Las cookies nos ayudan a recordar tus preferencias y entender cómo utilizas 
              nuestro sitio. Puedes configurar tu navegador para rechazar cookies, 
              aunque esto puede afectar la funcionalidad del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Tus Derechos</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@ipartsstore.com</p>
              <p><strong>Teléfono:</strong> +1 (555) 123-4567</p>
              <p><strong>Dirección:</strong> 123 Tech Street, Digital City, DC 12345</p>
            </div>
          </section>

          <section>
            <p className="text-sm text-gray-600 mt-8">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
