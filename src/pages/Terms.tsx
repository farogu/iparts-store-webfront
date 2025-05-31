
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Términos de Servicio</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceptación de Términos</h2>
            <p>
              Al acceder y utilizar iParts Store, aceptas estar sujeto a estos Términos de 
              Servicio y a todas las leyes y regulaciones aplicables. Si no estás de acuerdo 
              con alguno de estos términos, tienes prohibido usar este sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Uso del Sitio Web</h2>
            <p>Este sitio web está destinado únicamente para uso personal y comercial legítimo. Te comprometes a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar información precisa y completa</li>
              <li>Mantener la seguridad de tu cuenta</li>
              <li>No utilizar el sitio para actividades ilegales</li>
              <li>No interferir con el funcionamiento del sitio</li>
              <li>Respetar los derechos de propiedad intelectual</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Productos y Precios</h2>
            <p>
              Nos esforzamos por mostrar información precisa sobre productos y precios. 
              Sin embargo, nos reservamos el derecho de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Corregir errores de precios o descripciones</li>
              <li>Modificar o descontinuar productos sin previo aviso</li>
              <li>Limitar las cantidades de compra</li>
              <li>Rechazar pedidos por cualquier motivo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Pedidos y Pagos</h2>
            <p>
              Al realizar un pedido, declaras que eres mayor de edad y tienes la capacidad 
              legal para celebrar contratos. Todos los pedidos están sujetos a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Disponibilidad de productos</li>
              <li>Verificación de información de pago</li>
              <li>Confirmación de la dirección de envío</li>
              <li>Cumplimiento de nuestras políticas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Envíos y Entregas</h2>
            <p>
              Los plazos de entrega son estimados y pueden variar debido a circunstancias 
              fuera de nuestro control. No somos responsables por retrasos en la entrega 
              causados por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Condiciones climáticas adversas</li>
              <li>Problemas con servicios de mensajería</li>
              <li>Direcciones incorrectas proporcionadas por el cliente</li>
              <li>Fuerza mayor</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Devoluciones y Reembolsos</h2>
            <p>
              Consulta nuestra Política de Garantía para información detallada sobre 
              devoluciones y reembolsos. En general, aceptamos devoluciones dentro de 
              30 días de la compra para productos en condición original.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitación de Responsabilidad</h2>
            <p>
              iParts Store no será responsable por daños indirectos, incidentales, 
              especiales o consecuentes que resulten del uso de nuestros productos 
              o servicios. Nuestra responsabilidad total no excederá el precio 
              pagado por el producto.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Propiedad Intelectual</h2>
            <p>
              Todo el contenido del sitio web, incluyendo textos, gráficos, logos 
              e imágenes, es propiedad de iParts Store o sus licenciantes y está 
              protegido por leyes de derechos de autor y marcas registradas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contacto</h2>
            <p>
              Para preguntas sobre estos términos, contacta con nosotros:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Email:</strong> legal@ipartsstore.com</p>
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

export default Terms;
