
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Warranty = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Garantía y Devoluciones</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Garantía de Calidad</h2>
            <p>
              En iParts Store, garantizamos la calidad de todos nuestros productos. <br />
              Todas nuestras piezas y accesorios para iPhone cuentan con una garantía contra defectos
              de fabricación y fallos de funcionamiento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cobertura de Garantía</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Repuestos Electrónicos</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Garantía de 3 meses</li>
                  <li>• Defectos de fabricación</li>
                  <li>• Funcionamiento incorrecto</li>
                  <li>• Reemplazo gratuito</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Productos Compatibles y Accesorios</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• Garantía de 30 días</li>
                  <li>• Defectos de fabricación</li>
                  <li>• Soporte técnico incluido</li>
                  <li>• Reemplazo gratuito</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Política de Devoluciones</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Plazo de Devolución: 30 días</h3>
              <p className="mb-4">
                Puedes devolver cualquier producto dentro de 30 días desde la fecha 
                de entrega siempre y cuando cumpla con las siguientes condiciones.
              </p>
              
              <h4 className="font-semibold mb-2">Condiciones para Devoluciones:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>El producto debe estar en su empaque original</li>
                <li>No debe mostrar signos de uso o daño</li>
                <li>Incluir todos los accesorios y documentación</li>
                <li>Proporcionar número de pedido original</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Proceso de Devolución</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-electric-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Contacta con nuestro equipo</h4>
                  <p>Envía un email a contacto@ipartsstore.com con tu número de pedido.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-electric-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Recibe autorización</h4>
                  <p>Te enviaremos un RMA (Return Merchandise Authorization) number</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-electric-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Envía el producto</h4>
                  <p>Empaca el producto de forma segura e incluye el número RMA</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-electric-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold">Procesamos tu devolución</h4>
                  <p>Reembolso procesado en 5-7 días hábiles después de recibir el producto</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Gastos de Envío</h2>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-green-600">✓</span>
                <span><strong>Producto defectuoso:</strong> Cubrimos todos los gastos de envío</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-600">✓</span>
                <span><strong>Error nuestro:</strong> Cubrimos todos los gastos de envío</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-orange-600">●</span>
                <span><strong>Cambio de opinión:</strong> El cliente cubre los gastos de envío de devolución</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exclusiones de Garantía</h2>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <p className="text-red-800 mb-3">La garantía NO cubre:</p>
              <ul className="list-disc pl-6 space-y-1 text-red-700">
                <li>Daños por mal uso o instalación incorrecta</li>
                <li>Daños por líquidos o agua</li>
                <li>Desgaste normal del producto</li>
                <li>Daños físicos o caídas</li>
                <li>Modificaciones no autorizadas</li>
                <li>Uso comercial intensivo</li>
              </ul>
            </div>
          </section>

          <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ Aviso importante sobre garantías
            </h2>
            <p className="text-gray-700">
              Algunos productos como <span className="font-semibold">carcazas</span>, <span className="font-semibold">micas de cristal</span> y <span className="font-semibold">micas de hidrogel</span> 
              <span className="font-semibold text-red-600"> no cuentan con garantía</span> debido a su naturaleza frágil y uso inmediato tras la instalación.
            </p>
            <p className="text-gray-700 mt-2">
              Te recomendamos revisar bien el producto antes de abrirlo o instalarlo. Si tienes dudas, contáctanos antes de completar tu compra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Instalación y Soporte</h2>
            <p>
              Ofrecemos guías de instalación gratuitas y soporte técnico para todos 
              nuestros productos. Si necesitas ayuda con la instalación, contáctanos 
              antes de proceder para evitar daños no cubiertos por la garantía.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contacto para Garantías</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p><strong>Email de Devoluciones y Garantías:</strong> contacto@ipartsstore.com</p>
              <p><strong>Teléfono:</strong> +52 8115187063</p>
              <p><strong>Horario:</strong> Lunes a Viernes,9:00–18:00 (GMT-6)</p>
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

export default Warranty;
