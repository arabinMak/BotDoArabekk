import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ChefHat, Sparkles } from 'lucide-react';

interface MenuDay {
  day: number;
  breakfast: { name: string; calories: number; time: number; description: string };
  lunch: { name: string; calories: number; time: number; description: string };
  dinner: { name: string; calories: number; time: number; description: string };
}

export default function SmartMenu() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    equipment: [] as string[],
    hungerLevel: '',
  });
  const [generatedMenu, setGeneratedMenu] = useState<MenuDay[] | null>(null);
  const [loading, setLoading] = useState(false);

  const goals = [
    'Emagrecer e desinchar',
    'Manter peso',
    'Ganhar energia',
    'Melhorar digestão',
  ];

  const equipmentOptions = ['Fogão', 'Airfryer', 'Micro-ondas', 'Liquidificador'];

  const hungerLevels = [
    { value: 'low', label: 'Leve - Prefiro refeições pequenas' },
    { value: 'medium', label: 'Moderado - Refeições equilibradas' },
    { value: 'high', label: 'Alto - Preciso de porções maiores' },
  ];

  const toggleEquipment = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const generateMenu = async () => {
    if (!user) return;

    setLoading(true);

    const sampleMenu: MenuDay[] = [
      {
        day: 1,
        breakfast: {
          name: 'Smoothie Verde Detox',
          calories: 142,
          time: 5,
          description: 'Refrescante, levemente adocicado com abacaxi',
        },
        lunch: {
          name: 'Frango Grelhado com Legumes',
          calories: 285,
          time: 12,
          description: 'Suculento, colorido e temperado na medida',
        },
        dinner: {
          name: 'Sopa Cremosa de Abóbora',
          calories: 168,
          time: 10,
          description: 'Aveludada, levemente picante',
        },
      },
      {
        day: 2,
        breakfast: {
          name: 'Panqueca Fit de Banana',
          calories: 183,
          time: 7,
          description: 'Macia, naturalmente doce',
        },
        lunch: {
          name: 'Omelete Caprese com Salada',
          calories: 248,
          time: 9,
          description: 'Colorida, fresca e aromática',
        },
        dinner: {
          name: 'Peixe ao Limão com Aspargos',
          calories: 225,
          time: 13,
          description: 'Leve, delicado e perfumado',
        },
      },
      {
        day: 3,
        breakfast: {
          name: 'Overnight Oats de Chia',
          calories: 195,
          time: 2,
          description: 'Cremoso, levemente crocante',
        },
        lunch: {
          name: 'Salada de Atum com Grão-de-Bico',
          calories: 312,
          time: 8,
          description: 'Completa, crocante e proteica',
        },
        dinner: {
          name: 'Caldo Verde Brasileiro',
          calories: 145,
          time: 11,
          description: 'Reconfortante e nutritivo',
        },
      },
      {
        day: 4,
        breakfast: {
          name: 'Vitamina de Mamão com Aveia',
          calories: 158,
          time: 4,
          description: 'Cremosa, digestiva e energizante',
        },
        lunch: {
          name: 'Peito de Peru na Airfryer',
          calories: 265,
          time: 14,
          description: 'Crocante por fora, macio por dentro',
        },
        dinner: {
          name: 'Sopa de Tomate Assado',
          calories: 135,
          time: 12,
          description: 'Aromática, levemente defumada',
        },
      },
      {
        day: 5,
        breakfast: {
          name: 'Tapioca Recheada com Ovo',
          calories: 210,
          time: 6,
          description: 'Quentinha, macia e satisfatória',
        },
        lunch: {
          name: 'Salada Caesar de Frango',
          calories: 298,
          time: 10,
          description: 'Clássica, crocante e saborosa',
        },
        dinner: {
          name: 'Legumes Assados com Ervas',
          calories: 155,
          time: 13,
          description: 'Caramelizados e aromáticos',
        },
      },
      {
        day: 6,
        breakfast: {
          name: 'Mingau de Quinoa com Canela',
          calories: 172,
          time: 8,
          description: 'Quentinho, cremoso e reconfortante',
        },
        lunch: {
          name: 'Hambúrguer de Frango na Airfryer',
          calories: 280,
          time: 12,
          description: 'Suculento, temperado e crocante',
        },
        dinner: {
          name: 'Creme de Brócolis Detox',
          calories: 142,
          time: 9,
          description: 'Aveludado, nutritivo e leve',
        },
      },
      {
        day: 7,
        breakfast: {
          name: 'Crepioca com Pasta de Atum',
          calories: 188,
          time: 5,
          description: 'Prática e salgada',
        },
        lunch: {
          name: 'Filé de Tilápia com Purê',
          calories: 255,
          time: 14,
          description: 'Delicado e cremoso',
        },
        dinner: {
          name: 'Sopa de Legumes com Frango',
          calories: 178,
          time: 11,
          description: 'Completa, caseira e nutritiva',
        },
      },
    ];

    await supabase.from('generated_menus').insert({
      user_id: user.id,
      goal: formData.goal,
      equipment: formData.equipment,
      preferences: { hungerLevel: formData.hungerLevel },
      menu_data: sampleMenu,
    });

    setGeneratedMenu(sampleMenu);
    setLoading(false);
  };

  if (generatedMenu) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-[#8B7355]" />
          </div>
          <h1 className="text-3xl font-bold text-[#8B7355] mb-2">
            Seu Cardápio Personalizado
          </h1>
          <p className="text-[#A68A7A]">7 dias de refeições planejadas para você</p>
        </div>

        <div className="space-y-6">
          {generatedMenu.map((day) => (
            <div key={day.day} className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-[#8B7355] mb-4">Dia {day.day}</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#FFF8F0] p-4 rounded-xl">
                  <div className="text-sm text-[#A68A7A] mb-1">Café da manhã</div>
                  <h3 className="font-bold text-[#8B7355] mb-2">{day.breakfast.name}</h3>
                  <p className="text-sm text-[#A68A7A] mb-2">{day.breakfast.description}</p>
                  <div className="flex gap-3 text-xs text-[#A68A7A]">
                    <span>{day.breakfast.calories} kcal</span>
                    <span>{day.breakfast.time} min</span>
                  </div>
                </div>

                <div className="bg-[#F5E6FF] p-4 rounded-xl">
                  <div className="text-sm text-[#A68A7A] mb-1">Almoço</div>
                  <h3 className="font-bold text-[#8B7355] mb-2">{day.lunch.name}</h3>
                  <p className="text-sm text-[#A68A7A] mb-2">{day.lunch.description}</p>
                  <div className="flex gap-3 text-xs text-[#A68A7A]">
                    <span>{day.lunch.calories} kcal</span>
                    <span>{day.lunch.time} min</span>
                  </div>
                </div>

                <div className="bg-[#FFF0F5] p-4 rounded-xl">
                  <div className="text-sm text-[#A68A7A] mb-1">Jantar</div>
                  <h3 className="font-bold text-[#8B7355] mb-2">{day.dinner.name}</h3>
                  <p className="text-sm text-[#A68A7A] mb-2">{day.dinner.description}</p>
                  <div className="flex gap-3 text-xs text-[#A68A7A]">
                    <span>{day.dinner.calories} kcal</span>
                    <span>{day.dinner.time} min</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setGeneratedMenu(null);
              setStep(1);
              setFormData({ goal: '', equipment: [], hungerLevel: '' });
            }}
            className="bg-white text-[#8B7355] font-semibold py-3 px-8 rounded-xl border-2 border-[#E6D5FF] hover:bg-[#FFF8F0] transition-all"
          >
            Criar Novo Cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] rounded-full mb-4">
          <ChefHat className="w-8 h-8 text-[#8B7355]" />
        </div>
        <h1 className="text-3xl font-bold text-[#8B7355] mb-2">Cardápio Inteligente</h1>
        <p className="text-[#A68A7A]">Responda 3 perguntas e receba seu plano personalizado</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full mx-1 transition-all ${
                s <= step ? 'bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-[#8B7355] mb-6">Qual é o seu objetivo?</h2>
            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => {
                    setFormData({ ...formData, goal });
                    setStep(2);
                  }}
                  className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-[#E6D5FF] hover:bg-[#FFF8F0] transition-all"
                >
                  <span className="text-[#8B7355] font-medium">{goal}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-[#8B7355] mb-6">
              Quais equipamentos você tem?
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {equipmentOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleEquipment(item)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.equipment.includes(item)
                      ? 'border-[#E6D5FF] bg-[#FFF8F0] text-[#8B7355] font-semibold'
                      : 'border-gray-200 text-[#A68A7A] hover:border-[#E6D5FF]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 text-[#A68A7A] hover:bg-gray-50 transition-all"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={formData.equipment.length === 0}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] text-[#8B7355] font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-[#8B7355] mb-6">
              Qual é o seu nível de fome?
            </h2>
            <div className="space-y-3 mb-6">
              {hungerLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setFormData({ ...formData, hungerLevel: level.value })}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    formData.hungerLevel === level.value
                      ? 'border-[#E6D5FF] bg-[#FFF8F0]'
                      : 'border-gray-200 hover:border-[#E6D5FF]'
                  }`}
                >
                  <span className="text-[#8B7355] font-medium">{level.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 text-[#A68A7A] hover:bg-gray-50 transition-all"
              >
                Voltar
              </button>
              <button
                onClick={generateMenu}
                disabled={!formData.hungerLevel || loading}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#E6D5FF] to-[#FFE6F0] text-[#8B7355] font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? 'Gerando...' : 'Gerar Cardápio'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
