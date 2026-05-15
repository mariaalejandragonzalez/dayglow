-- =====================================================
-- DayGlow — Esquema de Base de Datos para Supabase
-- =====================================================
-- INSTRUCCIONES:
-- 1. Crea un proyecto en https://supabase.com
-- 2. Ve a SQL Editor → New query
-- 3. Pega TODO este archivo y haz clic en "Run"
-- =====================================================

-- ─── TABLA: profiles (datos extendidos del usuario) ───
-- Supabase Auth maneja login/registro; esto guarda info adicional
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  department TEXT DEFAULT 'Tolima',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLA: products ───
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  colors JSONB DEFAULT '[]',
  color_hex JSONB DEFAULT '[]',
  stock JSONB DEFAULT '[]',
  is_tip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLA: kits (kits estilo de vida) ───
CREATE TABLE IF NOT EXISTS kits (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  includes JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLA: cart_items (carrito persistente por usuario) ───
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color TEXT,
  quantity INT DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, color)
);

-- ─── TABLA: orders (pedidos) ───
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'Pendiente',
  -- Contacto
  contact_name TEXT,
  contact_phone TEXT,
  -- Dirección
  city TEXT,
  address TEXT,
  notes TEXT,
  -- Pago
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLA: order_items (productos de cada pedido) ───
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  color TEXT,
  quantity INT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

-- ─── TABLA: product_issues (reclamos / problemas) ───
CREATE TABLE IF NOT EXISTS product_issues (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_item_id BIGINT REFERENCES order_items(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Recibido',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_issues ENABLE ROW LEVEL SECURITY;

-- Policies: profiles
CREATE POLICY "Usuarios ven su propio perfil" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuarios crean su propio perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Usuarios actualizan su propio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies: products & kits (lectura pública)
CREATE POLICY "Productos públicos" ON products FOR SELECT USING (true);
CREATE POLICY "Kits públicos" ON kits FOR SELECT USING (true);

-- Policies: cart_items
CREATE POLICY "Carrito propio - select" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Carrito propio - insert" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Carrito propio - update" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Carrito propio - delete" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Policies: orders
CREATE POLICY "Pedidos propios - select" ON orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Pedidos propios - insert" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies: order_items
CREATE POLICY "Items de pedidos propios - select" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
CREATE POLICY "Items de pedidos propios - insert" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Policies: product_issues
CREATE POLICY "Reclamos propios - select" ON product_issues
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Reclamos propios - insert" ON product_issues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCIÓN: crear perfil automáticamente al registrarse
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, city)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- DATOS DEMO (seed)
-- =====================================================
INSERT INTO products (name, description, price, category, image_url, colors, color_hex, stock, is_tip) VALUES
('Corrector de caras', 'El nuevo labial líquido Superstay Vinyl Ink le da a tus labios un color vinilo de larga duración. Consigue un brillo inmaculado que dure hasta 16 horas. ¡Atrévete a lucir unos labios de impacto!', 50000, 'base', null, '["Unrivaled","Natural"]', '["#8B2252","#C47868"]', '[8,12]', true),
('Base', 'Base de cobertura total con acabado natural. Formulada para todo tipo de piel.', 22000, 'base', null, '["Natural","Ivory"]', '["#D4A082","#F2D9CA"]', '[15,10]', false),
('Rubor', 'Rubor en polvo de larga duración con acabado satinado. Toque de color natural.', 18000, 'mejillas', null, '["Rose","Peach"]', '["#E06070","#F0A070"]', '[20,8]', false),
('Polvo compacto', 'Polvo compacto translúcido que fija el maquillaje y controla el brillo durante todo el día.', 16000, 'base', null, '["Translucent","Beige"]', '["#F0E0D0","#D4B090"]', '[25,15]', false),
('Labial', 'Labial cremoso con fórmula hidratante. Color intenso y acabado suave.', 19000, 'labios', null, '["Red Affair","Pink Power"]', '["#C43070","#E87BA0"]', '[18,22]', false),
('Gloss', 'Gloss voluminizador con efecto plumping. Brillo espejado de larga duración.', 13000, 'labios', null, '["Clear","Rosé"]', '["#FFD0E0","#F08090"]', '[30,20]', false);

INSERT INTO kits (name, description, price, includes) VALUES
('Kit Básico', 'Todo lo que necesitas para un maquillaje natural y fresco.', 63000, '["Corrector","Base","Rubor"]'),
('Kit Profesional', 'Set completo para un maquillaje de larga duración.', 108000, '["Corrector","Base","Rubor","Labial","Polvo"]'),
('Kit Emprendedora', 'Ideal para iniciar tu negocio de belleza.', 45000, '["Labial x3","Gloss x2","Rubor"]');

-- =====================================================
-- ¡LISTO! Tu base de datos está configurada.
-- =====================================================
