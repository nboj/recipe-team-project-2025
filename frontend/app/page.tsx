// frontend/app/page.tsx
import type { Recipe } from "./_types/recipe";
import HeroBanner from "./_components/HeroBanner";
import Row from "./_components/Row";


// --- Top banner slides ---
const topRecipes: Recipe[] = [
  {
    id: 1,
    title: "Sheet-Pan Lemon Chicken",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1600&h=900&q=80",
    summary: "Crisp & zesty weekday hero.",
    myRating: 4.6,
    categories: ["Quick"],
  },
  {
    id: 2,
    title: "Nonna’s Lasagna",
    image:
      "https://images.unsplash.com/photo-1546549039-49e542f2d4d0?auto=format&fit=crop&w=1600&h=900&q=80",
    summary: "Rich layers, Sunday vibes.",
    myRating: 4.9,
    categories: ["Italian", "Comfort"],
  },
  {
    id: 3,
    title: "Vegan Lemon Bars",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1600&h=900&q=80",
    summary: "Tangy & bright dessert.",
    myRating: 4.3,
    categories: ["Vegan", "Dessert"],
  },
];

// --- Quick dinners row ---
const quickDinners: Recipe[] = [
  {
    id: 4,
    title: "Aglio e Olio",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.5,
    categories: ["Quick", "Italian"],
  },
  {
    id: 5,
    title: "15-min Fried Rice",
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.2,
    categories: ["Quick"],
  },
  {
    id: 7,
    title: "Chicken Stir-Fry",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.3,
    categories: ["Quick", "Asian"],
  },
  {
    id: 8,
    title: "Garlic Butter Shrimp",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.4,
    categories: ["Quick", "Seafood"],
  },
  {
    id: 9,
    title: "Caprese Panini",
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.1,
    categories: ["Quick", "Vegetarian"],
  },
];

// --- Vegan favorites row ---
const veganFavorites: Recipe[] = [
  {
    id: 6,
    title: "Coconut Chickpea Curry",
    image:
      "https://images.unsplash.com/photo-1498654077810-12f23ab8c29d?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.7,
    categories: ["Vegan"],
  },
  {
    id: 10,
    title: "Roasted Veggie Bowl",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.5,
    categories: ["Vegan", "Gluten-Free"],
  },
  {
    id: 11,
    title: "Tofu Pad Thai",
    image:
      "https://images.unsplash.com/photo-1605478261120-99f4bf02a4b7?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.3,
    categories: ["Vegan", "Asian"],
  },
  {
    id: 12,
    title: "Avocado Toast",
    image:
      "https://images.unsplash.com/photo-1541516160071-6fa1a17c3c56?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.2,
    categories: ["Vegan", "Breakfast"],
  },
  {
    id: 13,
    title: "Lentil Bolognese",
    image:
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&h=600&q=80",
    myRating: 4.4,
    categories: ["Vegan", "Italian"],
  },
];

export default function Home() {
  return (
    <main className="bg-slate-900 text-slate-100 min-h-screen">
      <HeroBanner slides={topRecipes} />

      <section className="max-w-7xl mx-auto px-6 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center">Recipe Forge</h1>
      </section>

      <Row title="Quick Dinners" items={quickDinners} />
      <Row title="Vegan Favorites" items={veganFavorites} />
    </main>
  );
}
