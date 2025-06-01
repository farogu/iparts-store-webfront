
import { Card, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Carlos R.',
      role: 'Cliente Verificado (CDMX)',
      content: 'Pedí una pantalla para iPhone 13 y llegó súper rápido. La calidad es excelente, igualita a la original. Muy buena atención también.',
      rating: 5
    },
    {
      id: 2,
      name: 'Andrea G.',
      role: 'Cliente Verificada (Guadalajara)',
      content: 'Tenía dudas sobre qué pieza era compatible con mi iPhone SE y me ayudaron por WhatsApp. Excelente servicio y buenos precios.',
      rating: 5
    },
    {
      id: 3,
      name: 'Luis M.',
      role: 'Técnico en Reparaciones (Monterrey)',
      content: 'He comprado varias veces piezas como baterías y conectores. Todo ha funcionado perfecto. Lo recomiendo para técnicos.',
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Miles de clientes satisfechos confían en nosotros para sus reparaciones de iPhone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-electric-blue to-blue-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Piezas Vendidas</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Tasa de Satisfacción</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24h</div>
              <div className="text-blue-100">Envío Express</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
