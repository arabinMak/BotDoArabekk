import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Home, Book, Flame, Settings, CheckCircle2 } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import CelebrationModal from '../components/CelebrationModal';

interface DailyRecipe {
  id: string;
  day_number: number;
  meal_type: string;
  name: string;
  description: string;
  image_url: string;
  tags: string[];
}

interface ChallengeDay {
  id: string;
  day_number: number;
  completed: boolean;
  completed_at: string | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(1);
  const [todaysRecipes, setTodaysRecipes] = useState<{
    breakfast: DailyRecipe | null;
    lunch: DailyRecipe | null;
    dinner: DailyRecipe | null;
  }>({ breakfast: null, lunch: null, dinner: null });
  const [challengeDays, setChallengeDays] = useState<ChallengeDay[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDayCompleted, setIsDayCompleted] = useState(false);

  useEffect(() => {
    loadChallengeData();
  }, [user]);

  const loadChallengeData = async () => {
    if (!user) return;

    const { data: days } = await supabase
      .from('challenge_days')
      .select('*')
      .eq('user_id', user.id)
      .order('day_number', { ascending: true });

    if (days && days.length > 0) {
      setChallengeDays(days);
      const nextDay = days.find(d => !d.completed);
      const activeDayNumber = nextDay ? nextDay.day_number : 7;
      setCurrentDay(activeDayNumber);
      setIsDayCompleted(days.find(d => d.day_number === activeDayNumber)?.completed || false);
      await loadRecipes(activeDayNumber);
    } else {
      await initializeChallenge();
    }

    setLoading(false);
  };

  const initializeChallenge = async () => {
    if (!user) return;

    const daysToInsert = Array.from({ length: 7 }, (_, i) => ({
      user_id: user.id,
      day_number: i + 1,
      completed: false,
    }));

    await supabase.from('challenge_days').insert(daysToInsert);

    setCurrentDay(1);
    setIsDayCompleted(false);
    await loadRecipes(1);
  };

  const loadRecipes = async (dayNumber: number) => {
    const { data: recipes } = await supabase
      .from('daily_recipes')
      .select('*')
      .eq('day_number', dayNumber);

    if (recipes) {
      setTodaysRecipes({
        breakfast: recipes.find(r => r.meal_type === 'breakfast') || null,
        lunch: recipes.find(r => r.meal_type === 'lunch') || null,
        dinner: recipes.find(r => r.meal_type === 'dinner') || null,
      });
    }
  };

  const completeDayChallenge = async () => {
    if (!user || isDayCompleted) return;

    const { error } = await supabase
      .from('challenge_days')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('day_number', currentDay);

    if (!error) {
      setIsDayCompleted(true);
      setShowCelebration(true);

      const updatedDays = challengeDays.map(d =>
        d.day_number === currentDay ? { ...d, completed: true } : d
      );
      setChallengeDays(updatedDays);
    }
  };

  const handleCelebrationClose = async () => {
    setShowCelebration(false);

    if (currentDay < 7) {
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);
      setIsDayCompleted(false);
      await loadRecipes(nextDay);
    }
  };

  const userName = user?.user_metadata?.name || 'Camila';
  const completedDays = challengeDays.filter(d => d.completed).length;
  const progressPercentage = Math.round((completedDays / 7) * 100);
  const isChallengComplete = completedDays === 7;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F9F6F1] to-[#F0F9F4]">
        <div className="text-[#A7D9C9] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F6F1] via-[#FDFDFB] to-[#F0F9F4] pb-24">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[600px] mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-[24px] font-bold text-[#3E3E3E] mb-1" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              Olá, {userName} 👋
            </h1>
            <p className="text-[14px] text-[#6B6B6B] mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Sua jornada Corpo Leve — Dia {currentDay} de 7
            </p>

            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#A7D9C9] to-[#B5E0B8] h-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <p className="text-[12px] text-[#6B6B6B] font-medium" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Você está a {progressPercentage}% da sua leveza total. Continue!
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-6 py-8 space-y-8">
        {isChallengComplete && (
          <section className="bg-gradient-to-r from-[#A7D9C9] to-[#B5E0B8] rounded-3xl p-8 text-center shadow-lg">
            <div className="text-[48px] mb-4">🎉</div>
            <h2 className="text-[22px] font-bold text-white mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              Desafio Completo!
            </h2>
            <p className="text-[14px] text-white/90" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Você completou todos os 7 dias do Desafio Corpo Leve!
            </p>
          </section>
        )}

        <section>
          <h2 className="text-[20px] font-bold text-[#3E3E3E] mb-1 text-center" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
            Cardápio de Hoje 🍽️
          </h2>
          <p className="text-[13px] text-[#6B6B6B] mb-6 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Complete todas as refeições para avançar
          </p>

          <div className="space-y-6">
            {todaysRecipes.breakfast && (
              <div>
                <h3 className="text-[16px] font-bold text-[#3E3E3E] mb-3 flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span>Café da Manhã</span>
                  <span className="text-[18px]">☀️</span>
                </h3>
                <RecipeCard
                  name={todaysRecipes.breakfast.name}
                  description={todaysRecipes.breakfast.description}
                  imageUrl={todaysRecipes.breakfast.image_url}
                  tags={todaysRecipes.breakfast.tags}
                  onViewRecipe={() => navigate('/receitas')}
                />
              </div>
            )}

            {todaysRecipes.lunch && (
              <div>
                <h3 className="text-[16px] font-bold text-[#3E3E3E] mb-3 flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span>Almoço</span>
                  <span className="text-[18px]">🍛</span>
                </h3>
                <RecipeCard
                  name={todaysRecipes.lunch.name}
                  description={todaysRecipes.lunch.description}
                  imageUrl={todaysRecipes.lunch.image_url}
                  tags={todaysRecipes.lunch.tags}
                  onViewRecipe={() => navigate('/receitas')}
                />
              </div>
            )}

            {todaysRecipes.dinner && (
              <div>
                <h3 className="text-[16px] font-bold text-[#3E3E3E] mb-3 flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span>Jantar</span>
                  <span className="text-[18px]">🌙</span>
                </h3>
                <RecipeCard
                  name={todaysRecipes.dinner.name}
                  description={todaysRecipes.dinner.description}
                  imageUrl={todaysRecipes.dinner.image_url}
                  tags={todaysRecipes.dinner.tags}
                  onViewRecipe={() => navigate('/receitas')}
                />
              </div>
            )}
          </div>

          {!isChallengComplete && (
            <div className="mt-8">
              <button
                onClick={completeDayChallenge}
                disabled={isDayCompleted}
                className={`w-full font-semibold py-4 rounded-xl transition-all text-[15px] flex items-center justify-center gap-2 ${
                  isDayCompleted
                    ? 'bg-[#A7D9C9]/40 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#A7D9C9] to-[#B5E0B8] text-white hover:shadow-lg hover:from-[#8BC4B4] hover:to-[#9DD4A3]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isDayCompleted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Concluído!
                  </>
                ) : (
                  <>
                    ✅ Fiz todas as refeições de hoje
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#F9F6F1]/95 backdrop-blur-md border-t border-gray-200 rounded-t-3xl shadow-2xl z-40">
        <div className="max-w-[900px] mx-auto px-2">
          <div className="flex items-center justify-around py-2.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-2.5 px-5 rounded-2xl transition-all ${
                activeTab === 'home'
                  ? 'bg-[#A7D9C9]/20 shadow-sm'
                  : 'bg-transparent hover:bg-[#F9F6F1]'
              }`}
            >
              <Home
                className={`w-6 h-6 ${activeTab === 'home' ? 'text-[#A7D9C9]' : 'text-[#9B9B9B]'}`}
                strokeWidth={activeTab === 'home' ? 2.5 : 2}
              />
              <span
                className={`text-[11px] font-semibold ${
                  activeTab === 'home' ? 'text-[#A7D9C9]' : 'text-[#9B9B9B]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Início
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('recipes');
                navigate('/receitas');
              }}
              className={`flex flex-col items-center gap-1 py-2.5 px-5 rounded-2xl transition-all ${
                activeTab === 'recipes'
                  ? 'bg-[#A7D9C9]/20 shadow-sm'
                  : 'bg-transparent hover:bg-[#F9F6F1]'
              }`}
            >
              <Book
                className={`w-6 h-6 ${activeTab === 'recipes' ? 'text-[#A7D9C9]' : 'text-[#9B9B9B]'}`}
                strokeWidth={activeTab === 'recipes' ? 2.5 : 2}
              />
              <span
                className={`text-[11px] font-semibold ${
                  activeTab === 'recipes' ? 'text-[#A7D9C9]' : 'text-[#9B9B9B]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Receitas
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('challenge');
                navigate('/cardapio');
              }}
              className={`flex flex-col items-center gap-1 py-2.5 px-5 rounded-2xl transition-all ${
                activeTab === 'challenge'
                  ? 'bg-[#A7D9C9]/20 shadow-sm'
                  : 'bg-transparent hover:bg-[#F9F6F1]'
              }`}
            >
              <Flame
                className={`w-6 h-6 ${activeTab === 'challenge' ? 'text-[#A7D9C9]' : 'text-[#9B9B9B]'}`}
                strokeWidth={activeTab === 'challenge' ? 2.5 : 2}
              />
              <span
                className={`text-[11px] font-semibold ${
                  activeTab === 'challenge' ? 'text-[#A7D9C9]' : 'text-[#9B9B9B]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Desafio
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                navigate('/configuracoes');
              }}
              className={`flex flex-col items-center gap-1 py-2.5 px-5 rounded-2xl transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#A7D9C9]/20 shadow-sm'
                  : 'bg-transparent hover:bg-[#F9F6F1]'
              }`}
            >
              <Settings
                className={`w-6 h-6 ${activeTab === 'profile' ? 'text-[#A7D9C9]' : 'text-[#9B9B9B]'}`}
                strokeWidth={activeTab === 'profile' ? 2.5 : 2}
              />
              <span
                className={`text-[11px] font-semibold ${
                  activeTab === 'profile' ? 'text-[#A7D9C9]' : 'text-[#9B9B9B]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Perfil
              </span>
            </button>
          </div>
        </div>
      </nav>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        dayNumber={currentDay}
        isChallengComplete={isChallengComplete}
      />
    </div>
  );
}
