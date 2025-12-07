/*
  # Create 7-Day Challenge System

  1. New Tables
    - `challenge_days`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `day_number` (integer, 1-7)
      - `completed` (boolean, default false)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `daily_recipes`
      - `id` (uuid, primary key)
      - `day_number` (integer, 1-7)
      - `meal_type` (text: 'breakfast', 'lunch', 'dinner')
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `tags` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can read/update their own challenge progress
    - Everyone can read daily recipes (public content)

  3. Notes
    - Challenge days track user progress through the 7-day journey
    - Daily recipes contain the meals for each day
    - Tags stored as JSON array for flexibility
*/

-- Create challenge_days table
CREATE TABLE IF NOT EXISTS challenge_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, day_number)
);

ALTER TABLE challenge_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenge progress"
  ON challenge_days FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge days"
  ON challenge_days FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress"
  ON challenge_days FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create daily_recipes table
CREATE TABLE IF NOT EXISTS daily_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  name text NOT NULL,
  description text,
  image_url text,
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view daily recipes"
  ON daily_recipes FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample recipes for Day 1
INSERT INTO daily_recipes (day_number, meal_type, name, description, tags) VALUES
(1, 'breakfast', 'Vitamina Verde Detox', 'Couve, maçã verde, gengibre e limão', '["sem glúten", "sem lactose", "vegano"]'::jsonb),
(1, 'lunch', 'Frango Grelhado com Quinoa', 'Proteína magra com quinoa e legumes no vapor', '["sem glúten", "rico em proteína"]'::jsonb),
(1, 'dinner', 'Sopa de Abóbora com Cúrcuma', 'Cremosa e reconfortante, perfeita para o jantar', '["sem glúten", "sem lactose", "vegano"]'::jsonb),
(2, 'breakfast', 'Panqueca de Aveia e Banana', 'Sem farinha branca, adoçada naturalmente', '["sem glúten", "sem lactose"]'::jsonb),
(2, 'lunch', 'Salada de Grão-de-Bico', 'Com tomate, pepino e molho tahine', '["sem glúten", "vegano", "proteína vegetal"]'::jsonb),
(2, 'dinner', 'Peixe ao Forno com Aspargos', 'Salmão com limão siciliano e ervas', '["sem glúten", "ômega 3"]'::jsonb),
(3, 'breakfast', 'Mingau de Chia com Frutas', 'Pudim de chia com leite de coco', '["sem glúten", "sem lactose", "vegano"]'::jsonb),
(3, 'lunch', 'Bowl Mediterrâneo', 'Arroz integral, falafel e vegetais assados', '["vegano", "mediterrâneo"]'::jsonb),
(3, 'dinner', 'Omelete de Claras com Espinafre', 'Leve e nutritivo', '["sem glúten", "baixa caloria"]'::jsonb);

-- Insert remaining days (4-7)
INSERT INTO daily_recipes (day_number, meal_type, name, description, tags) VALUES
(4, 'breakfast', 'Smoothie de Açaí', 'Com banana e granola sem açúcar', '["sem glúten", "antioxidante"]'::jsonb),
(4, 'lunch', 'Wrap de Alface com Peru', 'Wrap low-carb recheado', '["sem glúten", "baixo carboidrato"]'::jsonb),
(4, 'dinner', 'Risoto de Couve-Flor', 'Versão leve do risoto tradicional', '["sem glúten", "vegano"]'::jsonb),
(5, 'breakfast', 'Tapioca com Ovo Mexido', 'Sem glúten e muito saborosa', '["sem glúten", "sem lactose"]'::jsonb),
(5, 'lunch', 'Peito de Frango ao Curry', 'Com arroz de couve-flor', '["sem glúten", "baixo carboidrato"]'::jsonb),
(5, 'dinner', 'Caldo Verde', 'Tradicional português, leve e nutritivo', '["sem glúten"]'::jsonb),
(6, 'breakfast', 'Iogurte Vegetal com Nozes', 'Proteína e gorduras saudáveis', '["sem glúten", "sem lactose", "vegano"]'::jsonb),
(6, 'lunch', 'Buddha Bowl', 'Mix de vegetais, proteína e grãos', '["vegano", "colorido"]'::jsonb),
(6, 'dinner', 'Berinjela Recheada', 'Com carne moída magra e temperos', '["sem glúten"]'::jsonb),
(7, 'breakfast', 'Crepioca com Queijo Branco', 'Versão fit da tapioca', '["sem glúten"]'::jsonb),
(7, 'lunch', 'Filé de Tilápia com Brócolis', 'Simples, leve e delicioso', '["sem glúten", "rico em proteína"]'::jsonb),
(7, 'dinner', 'Sopa de Lentilha', 'Nutritiva e reconfortante para finalizar', '["sem glúten", "vegano", "proteína vegetal"]'::jsonb);