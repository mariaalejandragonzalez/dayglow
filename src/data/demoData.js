// Datos demo usados cuando Supabase no está configurado
const ph = (color, label) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0.85"/><stop offset="1" stop-color="${color}" stop-opacity="1"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="32" fill="white" opacity="0.85">${label}</text></svg>`)}`;

export const demoProducts = [
  { id: 1, name: 'Corrector de caras', description: 'El nuevo labial líquido Superstay Vinyl Ink le da a tus labios un color vinilo de larga duración. Consigue un brillo inmaculado que dure hasta 16 horas. ¡Atrévete a lucir unos labios de impacto!', price: 50000, category: 'base', image_url: ph('#E8A0B4','Corrector'), colors: ['Unrivaled','Natural'], color_hex: ['#8B2252','#C47868'], stock: [8,12], is_tip: true },
  { id: 2, name: 'Base', description: 'Base de cobertura total con acabado natural. Formulada para todo tipo de piel.', price: 22000, category: 'base', image_url: ph('#D4799A','Base'), colors: ['Natural','Ivory'], color_hex: ['#D4A082','#F2D9CA'], stock: [15,10], is_tip: false },
  { id: 3, name: 'Rubor', description: 'Rubor en polvo de larga duración con acabado satinado. Toque de color natural.', price: 18000, category: 'mejillas', image_url: ph('#E87BA0','Rubor'), colors: ['Rose','Peach'], color_hex: ['#E06070','#F0A070'], stock: [20,8], is_tip: false },
  { id: 4, name: 'Polvo compacto', description: 'Polvo compacto translúcido que fija el maquillaje y controla el brillo durante todo el día.', price: 16000, category: 'base', image_url: ph('#F0C0D0','Polvo'), colors: ['Translucent','Beige'], color_hex: ['#F0E0D0','#D4B090'], stock: [25,15], is_tip: false },
  { id: 5, name: 'Labial', description: 'Labial cremoso con fórmula hidratante. Color intenso y acabado suave.', price: 19000, category: 'labios', image_url: ph('#C43070','Labial'), colors: ['Red Affair','Pink Power'], color_hex: ['#C43070','#E87BA0'], stock: [18,22], is_tip: false },
  { id: 6, name: 'Gloss', description: 'Gloss voluminizador con efecto plumping. Brillo espejado de larga duración.', price: 13000, category: 'labios', image_url: ph('#F08090','Gloss'), colors: ['Clear','Rosé'], color_hex: ['#FFD0E0','#F08090'], stock: [30,20], is_tip: false },
];

export const demoKits = [
  { id: 1, name: 'Kit Básico', description: 'Todo lo que necesitas para un maquillaje natural y fresco.', price: 63000, image_url: ph('#E87BA0','Kit Básico'), includes: ['Corrector','Base','Rubor'] },
  { id: 2, name: 'Kit Profesional', description: 'Set completo para un maquillaje de larga duración.', price: 108000, image_url: ph('#C43070','Kit Pro'), includes: ['Corrector','Base','Rubor','Labial','Polvo'] },
  { id: 3, name: 'Kit Emprendedora', description: 'Ideal para iniciar tu negocio de belleza.', price: 45000, image_url: ph('#F0C0D0','Kit Empr.'), includes: ['Labial x3','Gloss x2','Rubor'] },
];
