import { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, MessageCircle, Instagram, Search, ChevronDown } from "lucide-react";

// ============================================================
// CONFIGURACIÓN GENERAL — edita aquí lo básico de la tienda
// ============================================================
const WHATSAPP_NUMBER = "50766769726"; // +507 6676-9726
const INSTAGRAM_HANDLE = "wsixshop";
const PRICE = 10; // precio único para todas las gorras

// ============================================================
// MAPA DE NOMBRES DE COLOR → CÓDIGO HEX
// Agrega aquí SOLO los nombres de color nuevos que uses.
// Si un color que escribes abajo en PRODUCTS no está aquí,
// el sitio usa un gris por defecto (no se rompe).
// ============================================================
const COLOR_HEX = {
  "Negro": "#1a1a1a", "Blanco": "#f5f5f5", "Gris": "#6a6a6a", "Gris Claro": "#8a8a8a",
  "Gris Oscuro": "#4a4a4a", "Navy": "#1b2a4a", "Azul Rey": "#2c4fc9", "Celeste": "#6fa8c9",
  "Azul": "#1f8fc9", "Azul Petróleo": "#1f6b6b", "Rojo": "#9c1c1c", "Vino": "#6b1f2a",
  "Rosado": "#e0529c", "Naranja": "#d9601f", "Mostaza": "#9c7a1f", "Amarillo": "#d4b800",
  "Verde": "#2e8b3a", "Verde Bosque": "#1c4d2e", "Verde Oliva": "#5a6b4a", "Verde Loden": "#5a6b4a",
  "Morado": "#6a2c91", "Café": "#5a3d24", "Khaki": "#b8a06a", "Heather": "#9a9a9a",
  "Heather Oscuro": "#6a6a6a",
};

function getPrimaryHex(colorName) {
  const first = colorName.split("/")[0].trim();
  return COLOR_HEX[first] || "#555555";
}
function getSecondaryHex(colorName) {
  const parts = colorName.split("/");
  if (parts.length < 2) return null;
  const second = parts[1].trim();
  return COLOR_HEX[second] || "#333333";
}

// ============================================================
// CATÁLOGO DE PRODUCTOS
// Para agregar una gorra nueva, copia una línea y cambia:
//   name, model, category, color, price (opcional, usa PRICE si se omite)
// El color admite "Color" o "Color1/Color2" (ej "Gris/Negro").
// ============================================================
const PRODUCTS = [
  { id: 1, name: "Richardson 112 Negro", model: "112", category: "Trucker", color: "Negro" },
  { id: 2, name: "Richardson 112 Negro/Blanco", model: "112", category: "Trucker", color: "Negro/Blanco" },
  { id: 3, name: "Richardson 112 Gris/Negro", model: "112", category: "Trucker", color: "Gris/Negro" },
  { id: 4, name: "Richardson 112 Navy", model: "112", category: "Trucker", color: "Navy" },
  { id: 5, name: "Richardson 112 Navy/Blanco", model: "112", category: "Trucker", color: "Navy/Blanco" },
  { id: 6, name: "Richardson 112 Rojo/Negro", model: "112", category: "Trucker", color: "Rojo/Negro" },
  { id: 7, name: "Richardson 112 Rojo/Blanco", model: "112", category: "Trucker", color: "Rojo/Blanco" },
  { id: 8, name: "Richardson 112 Azul Rey/Negro", model: "112", category: "Trucker", color: "Azul Rey/Negro" },
  { id: 9, name: "Richardson 112 Celeste/Negro", model: "112", category: "Trucker", color: "Celeste/Negro" },
  { id: 10, name: "Richardson 112 Celeste/Blanco", model: "112", category: "Trucker", color: "Celeste/Blanco" },
  { id: 11, name: "Richardson 112 Gris/Blanco", model: "112", category: "Trucker", color: "Gris/Blanco" },
  { id: 12, name: "Richardson 112 Verde Bosque", model: "112", category: "Trucker", color: "Verde Bosque" },
  { id: 13, name: "Richardson 112 Heather/Negro", model: "112", category: "Trucker", color: "Heather/Negro" },
  { id: 14, name: "Richardson 112 Khaki/Negro", model: "112", category: "Trucker", color: "Khaki/Negro" },
  { id: 15, name: "Richardson 112 Mostaza/Navy", model: "112", category: "Trucker", color: "Mostaza/Navy" },
  { id: 16, name: "Richardson 112 Blanco/Negro", model: "112", category: "Trucker", color: "Blanco/Negro" },
  { id: 17, name: "Richardson 112 Blanco", model: "112", category: "Trucker", color: "Blanco" },
  { id: 18, name: "Richardson 112 Naranja/Negro", model: "112", category: "Trucker", color: "Naranja/Negro" },
  { id: 19, name: "Richardson 112 Morado/Blanco", model: "112", category: "Trucker", color: "Morado/Blanco" },
  { id: 20, name: "Richardson 112 Rosado/Negro", model: "112", category: "Trucker", color: "Rosado/Negro" },
];

const MODELS = ["Todos", "112", "115", "112FP", "Flexfit"];
const CATEGORIES_BASE = ["Todos"];

function CapThumb({ color, model, size = "normal" }) {
  const hex1 = getPrimaryHex(color);
  const hex2 = getSecondaryHex(color);
  const dim = size === "small" ? "w-16 h-16" : "w-full h-full";
  return (
    <div className={`${dim} flex items-center justify-center bg-white relative`}>
      <svg viewBox="0 0 100 100" className={size === "small" ? "w-12 h-12" : "w-2/3 h-2/3"}>
        <path d="M15 65 Q15 35 50 30 Q85 35 85 65 L82 68 Q50 75 18 68 Z" fill={hex1} stroke="#00000022" strokeWidth="1.5" />
        <path d="M15 65 Q5 68 2 70 L18 68 Z" fill={hex2 || hex1} stroke="#00000022" strokeWidth="1" />
      </svg>
      <span className="absolute bottom-1 right-1 text-[9px] font-bold text-neutral-400 bg-white/80 rounded px-1">{model}</span>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filterModel, setFilterModel] = useState("Todos");
  const [filterColor, setFilterColor] = useState("Todos");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState("");

  const COLORS = useMemo(() => ["Todos", ...Array.from(new Set(PRODUCTS.map(p => p.color)))], []);
  const CATEGORIES = useMemo(() => [...CATEGORIES_BASE, ...Array.from(new Set(PRODUCTS.map(p => p.category)))], []);

  const productsWithPrice = useMemo(() => PRODUCTS.map(p => ({ ...p, price: p.price ?? PRICE })), []);

  const filtered = useMemo(() => {
    return productsWithPrice.filter(p => {
      if (filterModel !== "Todos" && p.model !== filterModel) return false;
      if (filterColor !== "Todos" && p.color !== filterColor) return false;
      if (filterCategory !== "Todos" && p.category !== filterCategory) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterModel, filterColor, filterCategory, search, productsWithPrice]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setToast(`${product.name} agregada al carrito`);
    setTimeout(() => setToast(""), 2000);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
      .filter(i => i.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const sendToWhatsApp = () => {
    if (cart.length === 0) return;
    let msg = "¡Hola Wsixshop! Quiero hacer este pedido:\n\n";
    cart.forEach(i => {
      msg += `• ${i.name} (${i.color}) x${i.qty} - $${(i.price * i.qty).toFixed(2)}\n`;
    });
    msg += `\nTotal: $${total.toFixed(2)}\n\n¿Está disponible?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const contactWhatsApp = () => {
    const msg = "¡Hola Wsixshop! Tengo una pregunta sobre sus gorras.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const openInstagram = () => {
    window.open(`https://instagram.com/${INSTAGRAM_HANDLE}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-white text-black px-4 py-3 rounded-lg shadow-2xl text-sm font-medium animate-pulse">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center font-black text-black text-lg">
              W6
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">WSIXSHOP</h1>
              <p className="text-[10px] text-neutral-400 tracking-widest uppercase">Catálogo · Panamá</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={openInstagram} className="hidden sm:flex items-center justify-center text-neutral-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-neutral-800" aria-label="Instagram">
              <Instagram size={20} />
            </button>
            <button onClick={contactWhatsApp} className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-neutral-800">
              <MessageCircle size={18} /> Contacto
            </button>
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors">
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Carrito</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">{itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-red-500/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-yellow-400 font-bold tracking-[0.3em] text-xs uppercase mb-4">Richardson & Flexfit Authentic</p>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
            VISTE TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">ESTILO</span>
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm sm:text-base mb-6">
            Gorras Richardson y Flexfit. Catálogo completo, consulta disponibilidad por WhatsApp.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-400">
            <button onClick={contactWhatsApp} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MessageCircle size={16} /> +507 6676-9726
            </button>
            <span className="text-neutral-700">|</span>
            <button onClick={openInstagram} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Instagram size={16} /> @{INSTAGRAM_HANDLE}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar gorra..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="sm:hidden flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2.5 text-sm font-medium">
            Filtros <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className={`${showFilters ? "flex" : "hidden"} sm:flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap`}>
          <FilterGroup label="Modelo" options={MODELS} value={filterModel} onChange={setFilterModel} />
          <FilterGroup label="Color" options={COLORS} value={filterColor} onChange={setFilterColor} />
          <FilterGroup label="Categoría" options={CATEGORIES} value={filterCategory} onChange={setFilterCategory} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">No se encontraron gorras con esos filtros.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(product => (
              <div key={product.id} className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <CapThumb color={product.color} model={product.model} />
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold mb-1">{product.model}</p>
                  <h3 className="font-bold text-sm leading-tight mb-1 cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => setSelectedProduct(product)}>
                    {product.name}
                  </h3>
                  <p className="text-neutral-500 text-xs mb-3">{product.color} · {product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-lg">${product.price}</span>
                    <button onClick={() => addToCart(product)} className="bg-white text-black rounded-full p-2 hover:bg-yellow-400 transition-colors active:scale-90">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-black text-lg">WSIXSHOP</p>
            <p className="text-neutral-500 text-xs mt-1">Gorras Richardson y Flexfit originales · Panamá</p>
          </div>
          <div className="flex gap-3">
            <button onClick={contactWhatsApp} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 transition-colors px-4 py-2.5 rounded-full text-sm font-bold">
              <MessageCircle size={16} /> +507 6676-9726
            </button>
            <button onClick={openInstagram} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 transition-colors px-4 py-2.5 rounded-full text-sm font-bold">
              <Instagram size={16} /> @{INSTAGRAM_HANDLE}
            </button>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-neutral-900 rounded-2xl max-w-2xl w-full overflow-hidden border border-neutral-800 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative bg-white aspect-square">
              <CapThumb color={selectedProduct.color} model={selectedProduct.model} />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-2">Modelo {selectedProduct.model}</p>
              <h2 className="text-2xl font-black mb-2">{selectedProduct.name}</h2>
              <p className="text-neutral-400 text-sm mb-4">{selectedProduct.color} · {selectedProduct.category}</p>
              <p className="text-3xl font-black mb-6">${selectedProduct.price}</p>
              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-white text-black font-bold py-3.5 rounded-full hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/70 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 flex flex-col h-full">
            <div className="flex items-center justify-between p-5 border-b border-neutral-800">
              <h3 className="font-black text-lg flex items-center gap-2"><ShoppingBag size={20} /> Tu Carrito</h3>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="text-center text-neutral-500 py-16">
                  <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 bg-neutral-900 rounded-xl p-3 border border-neutral-800">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <CapThumb color={item.color} model={item.model} size="small" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.name}</p>
                        <p className="text-neutral-500 text-xs mb-2">{item.color}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-neutral-800 rounded-full px-1">
                            <button onClick={() => updateQty(item.id, -1)} className="p-1.5 hover:bg-neutral-700 rounded-full transition-colors"><Minus size={12} /></button>
                            <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-1.5 hover:bg-neutral-700 rounded-full transition-colors"><Plus size={12} /></button>
                          </div>
                          <span className="font-black text-sm">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-neutral-500 hover:text-red-500 transition-colors self-start"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-neutral-800 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium text-neutral-400">Total</span>
                  <span className="font-black text-2xl">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-neutral-500 text-center">
                  Al enviar, confirmaremos disponibilidad y tiempo de entrega por WhatsApp
                </p>
                <button onClick={sendToWhatsApp} className="w-full bg-green-600 hover:bg-green-500 transition-colors font-bold py-4 rounded-full flex items-center justify-center gap-2 text-base">
                  <MessageCircle size={20} /> Enviar pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">{label}:</span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              value === opt ? "bg-yellow-400 text-black" : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
