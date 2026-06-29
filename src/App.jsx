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
  "Aluminio": "#a8a8a8", "Amarillo Neón": "#e8ff00", "Azul Claro": "#7fb8d9", "Azul Cobalto": "#1f5fa8",
  "Azul Columbia": "#7ba7c9", "Azul Neón": "#00c8ff", "Azul Verdadero": "#1f5fc9", "Azul Verdoso": "#1f8a8a",
  "Birch": "#c9bfa8", "Biscuit": "#d9c9a8", "Café Coyote": "#8a6a4a", "Caramelo": "#a8651f",
  "Cardinal": "#8c1a2b", "Chocolate": "#4a3019", "Cian": "#1fc9d9", "Crema": "#e8dcc0",
  "Dorado": "#c9a01f", "Dorado Vegas": "#d4af37", "Gun Metal": "#5a5e63", "Humo": "#7a7a7a",
  "Khaki Pálido": "#cdbe96", "Loden": "#5a6b4a", "Marrón": "#5a3d24", "Melange Gris Oscuro": "#5a5a5a",
  "Melange Plata": "#b0b0b0", "Naranja Neón": "#ff7a1f", "Navy Oscuro": "#0f1a30", "Plata": "#b8b8b8",
  "Quarry": "#8a8a82", "Rosa Fuerte": "#e0529c", "Rosa Neón": "#ff3fb0", "Tan": "#c9a878",
  "Verde Kelly": "#2e8b3a", "Verde Neón": "#39ff14", "Verde Olivo": "#5a6b3a", "Verde Oscuro": "#1c4d2e",
  "Ámbar": "#c9941f", "Beige": "#d9c9a8",
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
  // ---- Modelo 112 (agregado) ----
  { id: 21, name: "Richardson 112 Azul Verdadero/Biscuit", model: "112", category: "Trucker", color: "Azul Verdadero/Biscuit" },
  { id: 22, name: "Richardson 112 Negro/Gris Oscuro", model: "112", category: "Trucker", color: "Negro/Gris Oscuro" },
  { id: 23, name: "Richardson 112 Negro/Dorado", model: "112", category: "Trucker", color: "Negro/Dorado" },
  { id: 24, name: "Richardson 112 Negro/Dorado Vegas", model: "112", category: "Trucker", color: "Negro/Dorado Vegas" },
  { id: 25, name: "Richardson 112 Negro/Blanco/Heather", model: "112", category: "Trucker", color: "Negro/Blanco/Heather" },
  { id: 26, name: "Richardson 112 Negro/Blanco", model: "112", category: "Trucker", color: "Negro/Blanco" },
  { id: 27, name: "Richardson 112 Negro/Blanco/Rojo", model: "112", category: "Trucker", color: "Negro/Blanco/Rojo" },
  { id: 28, name: "Richardson 112 Café/Khaki", model: "112", category: "Trucker", color: "Café/Khaki" },
  { id: 29, name: "Richardson 112 Cardinal/Negro", model: "112", category: "Trucker", color: "Cardinal/Negro" },
  { id: 30, name: "Richardson 112 Cardinal/Blanco", model: "112", category: "Trucker", color: "Cardinal/Blanco" },
  { id: 31, name: "Richardson 112 Gris Oscuro/Negro", model: "112", category: "Trucker", color: "Gris Oscuro/Negro" },
  { id: 32, name: "Richardson 112 Gris Oscuro/Azul Columbia", model: "112", category: "Trucker", color: "Gris Oscuro/Azul Columbia" },
  { id: 33, name: "Richardson 112 Gris Oscuro/Verde Kelly", model: "112", category: "Trucker", color: "Gris Oscuro/Verde Kelly" },
  { id: 34, name: "Richardson 112 Gris Oscuro/Navy", model: "112", category: "Trucker", color: "Gris Oscuro/Navy" },
  { id: 35, name: "Richardson 112 Gris Oscuro/Azul Neón", model: "112", category: "Trucker", color: "Gris Oscuro/Azul Neón" },
  { id: 36, name: "Richardson 112 Gris Oscuro/Verde Neón", model: "112", category: "Trucker", color: "Gris Oscuro/Verde Neón" },
  { id: 37, name: "Richardson 112 Gris Oscuro/Naranja Neón", model: "112", category: "Trucker", color: "Gris Oscuro/Naranja Neón" },
  { id: 38, name: "Richardson 112 Gris Oscuro/Rosa Neón", model: "112", category: "Trucker", color: "Gris Oscuro/Rosa Neón" },
  { id: 39, name: "Richardson 112 Gris Oscuro/Amarillo Neón", model: "112", category: "Trucker", color: "Gris Oscuro/Amarillo Neón" },
  { id: 40, name: "Richardson 112 Gris Oscuro/Naranja", model: "112", category: "Trucker", color: "Gris Oscuro/Naranja" },
  { id: 41, name: "Richardson 112 Gris Oscuro/Rojo", model: "112", category: "Trucker", color: "Gris Oscuro/Rojo" },
  { id: 42, name: "Richardson 112 Gris Oscuro/Azul Rey", model: "112", category: "Trucker", color: "Gris Oscuro/Azul Rey" },
  { id: 43, name: "Richardson 112 Gris Oscuro/Blanco", model: "112", category: "Trucker", color: "Gris Oscuro/Blanco" },
  { id: 44, name: "Richardson 112 Azul Columbia/Negro", model: "112", category: "Trucker", color: "Azul Columbia/Negro" },
  { id: 45, name: "Richardson 112 Azul Columbia", model: "112", category: "Trucker", color: "Azul Columbia" },
  { id: 46, name: "Richardson 112 Azul Columbia/Blanco", model: "112", category: "Trucker", color: "Azul Columbia/Blanco" },
  { id: 47, name: "Richardson 112 Azul Columbia/Blanco/Navy", model: "112", category: "Trucker", color: "Azul Columbia/Blanco/Navy" },
  { id: 48, name: "Richardson 112 Cian/Blanco", model: "112", category: "Trucker", color: "Cian/Blanco" },
  { id: 49, name: "Richardson 112 Verde Oscuro", model: "112", category: "Trucker", color: "Verde Oscuro" },
  { id: 50, name: "Richardson 112 Gris/Gris Oscuro", model: "112", category: "Trucker", color: "Gris/Gris Oscuro" },
  { id: 51, name: "Richardson 112 Gris/Navy", model: "112", category: "Trucker", color: "Gris/Navy" },
  { id: 52, name: "Richardson 112 Heather/Negro", model: "112", category: "Trucker", color: "Heather/Negro" },
  { id: 53, name: "Richardson 112 Heather/Gris Oscuro", model: "112", category: "Trucker", color: "Heather/Gris Oscuro" },
  { id: 54, name: "Richardson 112 Heather/Verde Oscuro", model: "112", category: "Trucker", color: "Heather/Verde Oscuro" },
  { id: 55, name: "Richardson 112 Heather/Gris Claro", model: "112", category: "Trucker", color: "Heather/Gris Claro" },
  { id: 56, name: "Richardson 112 Heather/Navy", model: "112", category: "Trucker", color: "Heather/Navy" },
  { id: 57, name: "Richardson 112 Heather/Azul Rey", model: "112", category: "Trucker", color: "Heather/Azul Rey" },
  { id: 58, name: "Richardson 112 Heather/Blanco", model: "112", category: "Trucker", color: "Heather/Blanco" },
  { id: 59, name: "Richardson 112 Rosa Fuerte/Negro", model: "112", category: "Trucker", color: "Rosa Fuerte/Negro" },
  { id: 60, name: "Richardson 112 Rosa Fuerte/Blanco", model: "112", category: "Trucker", color: "Rosa Fuerte/Blanco" },
  { id: 61, name: "Richardson 112 Verde Kelly/Blanco", model: "112", category: "Trucker", color: "Verde Kelly/Blanco" },
  { id: 62, name: "Richardson 112 Khaki/Café", model: "112", category: "Trucker", color: "Khaki/Café" },
  { id: 63, name: "Richardson 112 Khaki/Blanco", model: "112", category: "Trucker", color: "Khaki/Blanco" },
  { id: 64, name: "Richardson 112 Vino/Blanco", model: "112", category: "Trucker", color: "Vino/Blanco" },
  { id: 65, name: "Richardson 112 Navy/Naranja", model: "112", category: "Trucker", color: "Navy/Naranja" },
  { id: 66, name: "Richardson 112 Navy/Heather/Blanco", model: "112", category: "Trucker", color: "Navy/Heather/Blanco" },
  { id: 67, name: "Richardson 112 Navy/Blanco", model: "112", category: "Trucker", color: "Navy/Blanco" },
  { id: 68, name: "Richardson 112 Navy/Rojo/Blanco", model: "112", category: "Trucker", color: "Navy/Rojo/Blanco" },
  { id: 69, name: "Richardson 112 Naranja/Negro", model: "112", category: "Trucker", color: "Naranja/Negro" },
  { id: 70, name: "Richardson 112 Naranja", model: "112", category: "Trucker", color: "Naranja" },
  { id: 71, name: "Richardson 112 Naranja/Blanco/Negro", model: "112", category: "Trucker", color: "Naranja/Blanco/Negro" },
  { id: 72, name: "Richardson 112 Naranja/Blanco", model: "112", category: "Trucker", color: "Naranja/Blanco" },
  { id: 73, name: "Richardson 112 Morado", model: "112", category: "Trucker", color: "Morado" },
  { id: 74, name: "Richardson 112 Morado/Blanco", model: "112", category: "Trucker", color: "Morado/Blanco" },
  { id: 75, name: "Richardson 112 Rojo/Negro", model: "112", category: "Trucker", color: "Rojo/Negro" },
  { id: 76, name: "Richardson 112 Rojo/Heather/Blanco", model: "112", category: "Trucker", color: "Rojo/Heather/Blanco" },
  { id: 77, name: "Richardson 112 Rojo/Blanco/Negro", model: "112", category: "Trucker", color: "Rojo/Blanco/Negro" },
  { id: 78, name: "Richardson 112 Rojo/Blanco/Navy", model: "112", category: "Trucker", color: "Rojo/Blanco/Navy" },
  { id: 79, name: "Richardson 112 Azul Rey/Negro", model: "112", category: "Trucker", color: "Azul Rey/Negro" },
  { id: 80, name: "Richardson 112 Azul Rey/Heather/Blanco", model: "112", category: "Trucker", color: "Azul Rey/Heather/Blanco" },
  { id: 81, name: "Richardson 112 Azul Rey/Blanco/Rojo", model: "112", category: "Trucker", color: "Azul Rey/Blanco/Rojo" },
  { id: 82, name: "Richardson 112 Azul Rey/Blanco", model: "112", category: "Trucker", color: "Azul Rey/Blanco" },
  { id: 83, name: "Richardson 112 Caramelo/Negro", model: "112", category: "Trucker", color: "Caramelo/Negro" },
  { id: 84, name: "Richardson 112 Chocolate/Birch", model: "112", category: "Trucker", color: "Chocolate/Birch" },
  { id: 85, name: "Richardson 112 Navy/Caramelo", model: "112", category: "Trucker", color: "Navy/Caramelo" },
  { id: 86, name: "Richardson 112 Navy/Khaki/Caramelo", model: "112", category: "Trucker", color: "Navy/Khaki/Caramelo" },
  { id: 87, name: "Richardson 112 Azul Verdoso/Birch/Navy", model: "112", category: "Trucker", color: "Azul Verdoso/Birch/Navy" },
  { id: 88, name: "Richardson 112 Heather/Birch/Ámbar", model: "112", category: "Trucker", color: "Heather/Birch/Ámbar" },
  { id: 89, name: "Richardson 112 Heather/Birch/Verde Olivo", model: "112", category: "Trucker", color: "Heather/Birch/Verde Olivo" },
  { id: 90, name: "Richardson 112 Beige/Gris Oscuro/Ámbar", model: "112", category: "Trucker", color: "Beige/Gris Oscuro/Ámbar" },
  { id: 91, name: "Richardson 112 Blanco/Azul Columbia/Amarillo", model: "112", category: "Trucker", color: "Blanco/Azul Columbia/Amarillo" },
  { id: 92, name: "Richardson 112 Loden/Negro", model: "112", category: "Trucker", color: "Loden/Negro" },
  { id: 93, name: "Richardson 112 Ámbar", model: "112", category: "Trucker", color: "Ámbar" },
  { id: 94, name: "Richardson 112 Negro/Gris", model: "112", category: "Trucker", color: "Negro/Gris" },
  { id: 95, name: "Richardson 112 Azul", model: "112", category: "Trucker", color: "Azul" },
  { id: 96, name: "Richardson 112 Café/Khaki", model: "112", category: "Trucker", color: "Café/Khaki" },
  { id: 97, name: "Richardson 112 Café", model: "112", category: "Trucker", color: "Café" },
  { id: 98, name: "Richardson 112 Crema/Negro/Loden", model: "112", category: "Trucker", color: "Crema/Negro/Loden" },
  { id: 99, name: "Richardson 112 Crema/Gris/Café", model: "112", category: "Trucker", color: "Crema/Gris/Café" },
  { id: 100, name: "Richardson 112 Crema/Negro/Ámbar", model: "112", category: "Trucker", color: "Crema/Negro/Ámbar" },
  { id: 101, name: "Richardson 112 Crema", model: "112", category: "Trucker", color: "Crema" },
  { id: 102, name: "Richardson 112 Gun Metal/Chocolate", model: "112", category: "Trucker", color: "Gun Metal/Chocolate" },
  { id: 103, name: "Richardson 112 Khaki/Negro", model: "112", category: "Trucker", color: "Khaki/Negro" },
  { id: 104, name: "Richardson 112 Khaki/Azul", model: "112", category: "Trucker", color: "Khaki/Azul" },
  { id: 105, name: "Richardson 112 Khaki/Chocolate", model: "112", category: "Trucker", color: "Khaki/Chocolate" },
  { id: 106, name: "Richardson 112 Khaki/Loden", model: "112", category: "Trucker", color: "Khaki/Loden" },
  { id: 107, name: "Richardson 112 Khaki/Navy", model: "112", category: "Trucker", color: "Khaki/Navy" },
  { id: 108, name: "Richardson 112 Verde Kelly", model: "112", category: "Trucker", color: "Verde Kelly" },
  { id: 109, name: "Richardson 112 Azul Claro/Gris Claro", model: "112", category: "Trucker", color: "Azul Claro/Gris Claro" },
  { id: 110, name: "Richardson 112 Gris Claro/Gun Metal", model: "112", category: "Trucker", color: "Gris Claro/Gun Metal" },
  { id: 111, name: "Richardson 112 Gris Claro", model: "112", category: "Trucker", color: "Gris Claro" },
  { id: 112, name: "Richardson 112 Marrón", model: "112", category: "Trucker", color: "Marrón" },
  { id: 113, name: "Richardson 112 Navy/Khaki", model: "112", category: "Trucker", color: "Navy/Khaki" },
  { id: 114, name: "Richardson 112 Quarry", model: "112", category: "Trucker", color: "Quarry" },
  { id: 115, name: "Richardson 112 Humo", model: "112", category: "Trucker", color: "Humo" },
  { id: 116, name: "Richardson 112 Blanco/Aluminio/Negro", model: "112", category: "Trucker", color: "Blanco/Aluminio/Negro" },
  { id: 117, name: "Richardson 112 Blanco/Aluminio/Navy", model: "112", category: "Trucker", color: "Blanco/Aluminio/Navy" },
  { id: 118, name: "Richardson 112 Blanco/Negro", model: "112", category: "Trucker", color: "Blanco/Negro" },
  { id: 119, name: "Richardson 112 Blanco/Gris Oscuro", model: "112", category: "Trucker", color: "Blanco/Gris Oscuro" },
  { id: 120, name: "Richardson 112 Blanco/Azul Columbia", model: "112", category: "Trucker", color: "Blanco/Azul Columbia" },
  { id: 121, name: "Richardson 112 Blanco/Verde Kelly", model: "112", category: "Trucker", color: "Blanco/Verde Kelly" },
  { id: 122, name: "Richardson 112 Blanco/Navy", model: "112", category: "Trucker", color: "Blanco/Navy" },
  { id: 123, name: "Richardson 112 Blanco/Rojo", model: "112", category: "Trucker", color: "Blanco/Rojo" },
  { id: 124, name: "Richardson 112 Blanco/Azul Rey", model: "112", category: "Trucker", color: "Blanco/Azul Rey" },
  // ---- Modelo 112FP (agregado) ----
  { id: 125, name: "Richardson 112FP Verde Olivo/Khaki", model: "112FP", category: "Trucker", color: "Verde Olivo/Khaki" },
  { id: 126, name: "Richardson 112FP Cardinal/Tan", model: "112FP", category: "Trucker", color: "Cardinal/Tan" },
  { id: 127, name: "Richardson 112FP Gris Oscuro/Negro", model: "112FP", category: "Trucker", color: "Gris Oscuro/Negro" },
  { id: 128, name: "Richardson 112FP Quarry", model: "112FP", category: "Trucker", color: "Quarry" },
  { id: 129, name: "Richardson 112FP Negro", model: "112FP", category: "Trucker", color: "Negro" },
  { id: 130, name: "Richardson 112FP Negro/Blanco", model: "112FP", category: "Trucker", color: "Negro/Blanco" },
  { id: 131, name: "Richardson 112FP Azul Verdoso/Navy", model: "112FP", category: "Trucker", color: "Azul Verdoso/Navy" },
  { id: 132, name: "Richardson 112FP Navy/Navy Oscuro", model: "112FP", category: "Trucker", color: "Navy/Navy Oscuro" },
  { id: 133, name: "Richardson 112FP Gris Oscuro/Blanco", model: "112FP", category: "Trucker", color: "Gris Oscuro/Blanco" },
  { id: 134, name: "Richardson 112FP Chocolate/Birch", model: "112FP", category: "Trucker", color: "Chocolate/Birch" },
  { id: 135, name: "Richardson 112FP Azul Cobalto/Gris", model: "112FP", category: "Trucker", color: "Azul Cobalto/Gris" },
  { id: 136, name: "Richardson 112FP Heather/Birch/Verde Olivo", model: "112FP", category: "Trucker", color: "Heather/Birch/Verde Olivo" },
  { id: 137, name: "Richardson 112FP Heather/Ámbar", model: "112FP", category: "Trucker", color: "Heather/Ámbar" },
  { id: 138, name: "Richardson 112FP Heather/Negro", model: "112FP", category: "Trucker", color: "Heather/Negro" },
  { id: 139, name: "Richardson 112FP Khaki/Café", model: "112FP", category: "Trucker", color: "Khaki/Café" },
  { id: 140, name: "Richardson 112FP Navy/Blanco", model: "112FP", category: "Trucker", color: "Navy/Blanco" },
  { id: 141, name: "Richardson 112FP Verde Olivo/Negro", model: "112FP", category: "Trucker", color: "Verde Olivo/Negro" },
  { id: 142, name: "Richardson 112FP Khaki Pálido/Loden", model: "112FP", category: "Trucker", color: "Khaki Pálido/Loden" },
  { id: 143, name: "Richardson 112FP Blanco", model: "112FP", category: "Trucker", color: "Blanco" },
  // ---- Flexfit 110 (agregado) ----
  { id: 144, name: "Richardson Flexfit Negro", model: "Flexfit", category: "Trucker", color: "Negro" },
  { id: 145, name: "Richardson Flexfit Negro/Blanco", model: "Flexfit", category: "Trucker", color: "Negro/Blanco" },
  { id: 146, name: "Richardson Flexfit Café/Khaki", model: "Flexfit", category: "Trucker", color: "Café/Khaki" },
  { id: 147, name: "Richardson Flexfit Caramelo", model: "Flexfit", category: "Trucker", color: "Caramelo" },
  { id: 148, name: "Richardson Flexfit Caramelo/Khaki", model: "Flexfit", category: "Trucker", color: "Caramelo/Khaki" },
  { id: 149, name: "Richardson Flexfit Gris Oscuro", model: "Flexfit", category: "Trucker", color: "Gris Oscuro" },
  { id: 150, name: "Richardson Flexfit Gris Oscuro/Negro", model: "Flexfit", category: "Trucker", color: "Gris Oscuro/Negro" },
  { id: 151, name: "Richardson Flexfit Gris Oscuro/Blanco", model: "Flexfit", category: "Trucker", color: "Gris Oscuro/Blanco" },
  { id: 152, name: "Richardson Flexfit Café Coyote/Negro", model: "Flexfit", category: "Trucker", color: "Café Coyote/Negro" },
  { id: 153, name: "Richardson Flexfit Café Coyote/Khaki", model: "Flexfit", category: "Trucker", color: "Café Coyote/Khaki" },
  { id: 154, name: "Richardson Flexfit Gris Oscuro", model: "Flexfit", category: "Trucker", color: "Gris Oscuro" },
  { id: 155, name: "Richardson Flexfit Heather/Negro", model: "Flexfit", category: "Trucker", color: "Heather/Negro" },
  { id: 156, name: "Richardson Flexfit Heather/Blanco", model: "Flexfit", category: "Trucker", color: "Heather/Blanco" },
  { id: 157, name: "Richardson Flexfit Khaki", model: "Flexfit", category: "Trucker", color: "Khaki" },
  { id: 158, name: "Richardson Flexfit Melange Plata/Blanco", model: "Flexfit", category: "Trucker", color: "Melange Plata/Blanco" },
  { id: 159, name: "Richardson Flexfit Melange Gris Oscuro/Negro", model: "Flexfit", category: "Trucker", color: "Melange Gris Oscuro/Negro" },
  { id: 160, name: "Richardson Flexfit Navy", model: "Flexfit", category: "Trucker", color: "Navy" },
  { id: 161, name: "Richardson Flexfit Navy/Blanco", model: "Flexfit", category: "Trucker", color: "Navy/Blanco" },
  { id: 162, name: "Richardson Flexfit Verde Olivo/Khaki", model: "Flexfit", category: "Trucker", color: "Verde Olivo/Khaki" },
  { id: 163, name: "Richardson Flexfit Rojo", model: "Flexfit", category: "Trucker", color: "Rojo" },
  { id: 164, name: "Richardson Flexfit Rojo/Blanco", model: "Flexfit", category: "Trucker", color: "Rojo/Blanco" },
  { id: 165, name: "Richardson Flexfit Azul Rey/Blanco", model: "Flexfit", category: "Trucker", color: "Azul Rey/Blanco" },
  { id: 166, name: "Richardson Flexfit Plata", model: "Flexfit", category: "Trucker", color: "Plata" },
  { id: 167, name: "Richardson Flexfit Blanco/Gris", model: "Flexfit", category: "Trucker", color: "Blanco/Gris" },
  { id: 168, name: "Richardson Flexfit Blanco/Navy", model: "Flexfit", category: "Trucker", color: "Blanco/Navy" },
  { id: 169, name: "Richardson Flexfit Blanco/Negro", model: "Flexfit", category: "Trucker", color: "Blanco/Negro" },
  { id: 170, name: "Richardson Flexfit Blanco", model: "Flexfit", category: "Trucker", color: "Blanco" },
];

const MODELS = ["Todos", "112", "112FP", "Flexfit"];
const CATEGORIES_BASE = ["Todos"];

function CapThumb({ id, color, model, size = "normal" }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hex1 = getPrimaryHex(color);
  const hex2 = getSecondaryHex(color);
  const dim = size === "small" ? "w-16 h-16" : "w-full h-full";

  if (id && !imgFailed) {
    return (
      <div className={`${dim} flex items-center justify-center bg-white relative`}>
        <img
          src={`/images/${id}.jpg`}
          alt={`${model} ${color}`}
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
        <span className="absolute bottom-1 right-1 text-[9px] font-bold text-neutral-400 bg-white/80 rounded px-1">{model}</span>
      </div>
    );
  }

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
                  <CapThumb id={product.id} color={product.color} model={product.model} />
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
              <CapThumb id={selectedProduct.id} color={selectedProduct.color} model={selectedProduct.model} />
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
                        <CapThumb id={item.id} color={item.color} model={item.model} size="small" />
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
