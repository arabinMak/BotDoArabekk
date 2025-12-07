import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Users, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ icon: '🌸', text: '', emoji: '' });
  const navigate = useNavigate();

  const testimonials = [
    {
      image: 'https://images.pexels.com/photos/6551070/pexels-photo-6551070.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Perdi 4kg em 7 dias — sem dieta nem academia.',
    },
    {
      image: 'https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Mais energia e menos inchaço em 1 semana.',
    },
    {
      image: 'https://images.pexels.com/photos/5938225/pexels-photo-5938225.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Meu corpo e autoestima voltaram em 7 dias.',
    },
  ];

  const popupMessages = [
    { icon: '🌸', text: 'Juliana acabou de garantir acesso ao Sistema Corpo Leve!', emoji: 'flower' },
    { icon: '🔥', text: '18 pessoas estão acessando as receitas agora.', emoji: 'fire' },
    { icon: '💫', text: 'Resultados visíveis já na primeira semana!', emoji: 'sparkle' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const showFirstPopup = setTimeout(() => {
      const randomMessage = popupMessages[Math.floor(Math.random() * popupMessages.length)];
      setPopupMessage(randomMessage);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 4000);
    }, 6000);

    return () => clearTimeout(showFirstPopup);
  }, []);

  useEffect(() => {
    const popupInterval = setInterval(() => {
      const randomMessage = popupMessages[Math.floor(Math.random() * popupMessages.length)];
      setPopupMessage(randomMessage);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 4000);
    }, Math.random() * 10000 + 20000);

    return () => clearInterval(popupInterval);
  }, []);

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);

    const demoEmail = 'demo@corpoleve.com';
    const demoPassword = 'demo123456';

    try {
      const { error: signInError } = await signIn(demoEmail, demoPassword);

      if (signInError) {
        const { error: signUpError } = await signUp(demoEmail, demoPassword, 'Demo User');

        if (signUpError) {
          setError('Erro ao acessar conta demo. Tente novamente.');
          setLoading(false);
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erro ao processar. Tente novamente.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError('Credenciais inválidas. Use a conta demo para testar.');
          setLoading(false);
        } else {
          navigate('/dashboard');
        }
      } else {
        if (!name.trim()) {
          setError('Por favor, insira seu nome');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          setError('Erro ao criar conta. Tente novamente.');
          setLoading(false);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('Erro ao processar. Tente novamente.');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9F6F1] via-[#FDFDFB] to-[#F0F9F4]" />

      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#A7D9C9] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#B5E0B8] rounded-full blur-3xl" />
      </div>

      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-[#A7D9C9]" strokeWidth={2.5} />
          <h2 className="text-xl font-bold text-[#3E3E3E] tracking-wide lowercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            corpo leve
          </h2>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="hidden lg:block">
              <div className="relative">
                <h2
                  className="text-2xl font-bold text-[#3E3E3E] mb-6"
                  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                >
                  Resultados reais de quem transformou a alimentação
                </h2>
                <div className="relative overflow-hidden rounded-3xl">
                  <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="min-w-full">
                        <div className="relative">
                          <div className="absolute -inset-2 bg-gradient-to-r from-[#A7D9C9] to-[#B5E0B8] rounded-2xl blur-lg opacity-20" />
                          <div className="relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                            <img
                              src={testimonial.image}
                              alt={`Transformation ${index + 1}`}
                              className="w-full h-[500px] object-cover"
                            />
                            <div className="p-6">
                              <p
                                className="text-[#3E3E3E] text-center font-medium leading-relaxed text-lg"
                                style={{ fontFamily: 'Open Sans, sans-serif' }}
                              >
                                "{testimonial.caption}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentTestimonial
                            ? 'bg-[#A7D9C9] w-8'
                            : 'bg-gray-300 w-1.5'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
              <div className="w-full text-center lg:text-left mb-8 space-y-6 px-4">
                <div className="flex justify-center lg:justify-start">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-[#A7D9C9] to-[#E6B89C] rounded-full" />
                </div>
                <h1 className="text-[22px] sm:text-2xl lg:text-5xl font-bold text-[#3E3E3E] tracking-tight" style={{ fontFamily: 'Nunito Sans, sans-serif', lineHeight: '1.3' }}>
                  Transforme sua alimentação.<br />Sinta-se leve em 7 dias.
                </h1>
                <p className="text-[15px] sm:text-base text-[#6B6B6B] font-medium leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif', letterSpacing: '0.01em' }}>
                  +200 receitas práticas, naturais e deliciosas — sem glúten e sem lactose.
                </p>
              </div>

              <div className="w-full bg-[#F9F6F1] rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      isLogin
                        ? 'bg-gradient-to-r from-[#A7D9C9] to-[#B5E0B8] text-white shadow-md'
                        : 'bg-white text-[#6B6B6B] hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      !isLogin
                        ? 'bg-gradient-to-r from-[#A7D9C9] to-[#B5E0B8] text-white shadow-md'
                        : 'bg-white text-[#6B6B6B] hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Cadastrar
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-semibold text-[#3E3E3E] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Nome
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D9C9] focus:ring-2 focus:ring-[#A7D9C9]/20 transition-all bg-white"
                        placeholder="Seu nome completo"
                        required={!isLogin}
                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-[#3E3E3E] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D9C9] focus:ring-2 focus:ring-[#A7D9C9]/20 transition-all bg-white"
                      placeholder="seu@email.com"
                      required
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3E3E3E] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Senha
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D9C9] focus:ring-2 focus:ring-[#A7D9C9]/20 transition-all bg-white"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#E6B89C] to-[#E6B89C] text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:from-[#D9A685] hover:to-[#D9A685] transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {loading ? 'Processando...' : isLogin ? 'Acessar meu cardápio' : 'Começar transformação'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full bg-white text-[#A7D9C9] font-semibold py-3 px-6 rounded-xl border-2 border-[#A7D9C9] hover:bg-[#A7D9C9] hover:text-white transform transition-all"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Usar conta demo
                  </button>

                  <p className="text-center text-sm text-[#6B6B6B] font-medium" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    +200 receitas testadas. Transformação natural e sustentável.
                  </p>
                </form>

                <p className="text-center text-sm text-[#6B6B6B] mt-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#A7D9C9] font-semibold hover:text-[#8BC4B4] hover:underline transition-colors"
                  >
                    {isLogin ? 'Cadastre-se grátis' : 'Faça login'}
                  </button>
                </p>

                <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-[#A7D9C9]/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#A7D9C9]" />
                    </div>
                    <p className="text-xs text-[#3E3E3E] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>+3.200 pessoas</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-[#A7D9C9]/10 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#A7D9C9]" />
                    </div>
                    <p className="text-xs text-[#3E3E3E] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Garantia 7 dias</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-[#A7D9C9]/10 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#A7D9C9]" />
                    </div>
                    <p className="text-xs text-[#3E3E3E] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Acesso vitalício</p>
                  </div>
                </div>
              </div>

              <div className="lg:hidden w-full max-w-[400px] mx-auto mt-8 px-4">
                <h2
                  className="text-[20px] sm:text-2xl font-bold text-[#3E3E3E] text-center mb-6"
                  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                >
                  Resultados reais de quem transformou a alimentação
                </h2>
                <div className="relative overflow-hidden rounded-3xl">
                  <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="min-w-full">
                        <div className="relative">
                          <div className="absolute -inset-2 bg-gradient-to-r from-[#A7D9C9] to-[#B5E0B8] rounded-2xl blur-lg opacity-20" />
                          <div className="relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                            <img
                              src={testimonial.image}
                              alt={`Transformation ${index + 1}`}
                              className="w-full h-64 sm:h-72 object-cover"
                            />
                            <div className="p-5">
                              <p
                                className="text-[15px] text-[#3E3E3E] text-center font-medium leading-relaxed"
                                style={{ fontFamily: 'Open Sans, sans-serif' }}
                              >
                                "{testimonial.caption}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentTestimonial
                            ? 'bg-[#A7D9C9] w-8'
                            : 'bg-gray-300 w-1.5'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-500 ${
          showPopup ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="text-2xl flex-shrink-0">{popupMessage.icon}</div>
            <p className="text-sm font-medium text-[#3E3E3E]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{popupMessage.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
