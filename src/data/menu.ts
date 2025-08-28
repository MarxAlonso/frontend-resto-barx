export interface Item {
  id: string;
  title: string;
  price: number;
  desc: string;
  category: "Parrillas" | "Bebidas" | "Postres";
}

export const menu: Item[] = [
  // Parrillas
  {
    id: "p1",
    title: "Anticucho de Corazón",
    price: 25.90,
    desc: "Brochetas de corazón de res marinadas en ají panca, acompañadas con papas doradas y choclo.",
    category: "Parrillas"
  },
  {
    id: "p2",
    title: "Parrilla Mixta",
    price: 45.90,
    desc: "Selección de carnes: chorizo, morcilla, costilla de cerdo y lomo de res. Para 2 personas.",
    category: "Parrillas"
  },
  {
    id: "p3",
    title: "Lomo Saltado",
    price: 32.90,
    desc: "Tiras de lomo fino salteadas con cebolla, tomate y papas fritas. Acompañado con arroz.",
    category: "Parrillas"
  },
  {
    id: "p4",
    title: "Costillas BBQ",
    price: 38.90,
    desc: "Costillas de cerdo glaseadas con salsa barbacoa casera, acompañadas con ensalada coleslaw.",
    category: "Parrillas"
  },
  {
    id: "p5",
    title: "Pollo a la Brasa",
    price: 28.90,
    desc: "Medio pollo marinado con especias secretas, cocido a la brasa. Con papas fritas y ensalada.",
    category: "Parrillas"
  },
  {
    id: "p6",
    title: "Churrasco Argentino",
    price: 42.90,
    desc: "Jugoso bife de chorizo a la parrilla, acompañado con chimichurri y papas rústicas.",
    category: "Parrillas"
  },

  // Bebidas
  {
    id: "b1",
    title: "Chicha Morada",
    price: 8.90,
    desc: "Refrescante bebida tradicional peruana preparada con maíz morado, piña y especias.",
    category: "Bebidas"
  },
  {
    id: "b2",
    title: "Inca Kola",
    price: 6.90,
    desc: "La bebida dorada del Perú, con su sabor único y refrescante.",
    category: "Bebidas"
  },
  {
    id: "b3",
    title: "Limonada Frozen",
    price: 9.90,
    desc: "Limonada helada con hielo frappe, perfecta para acompañar las parrillas.",
    category: "Bebidas"
  },
  {
    id: "b4",
    title: "Cerveza Pilsen",
    price: 12.90,
    desc: "Cerveza peruana bien fría, ideal para maridar con carnes a la parrilla.",
    category: "Bebidas"
  },
  {
    id: "b5",
    title: "Jugo de Maracuyá",
    price: 10.90,
    desc: "Jugo natural de maracuyá, dulce y aromático, preparado al momento.",
    category: "Bebidas"
  },

  // Postres
  {
    id: "d1",
    title: "Suspiro Limeño",
    price: 14.90,
    desc: "Clásico postre peruano con manjar blanco y merengue, espolvoreado con canela.",
    category: "Postres"
  },
  {
    id: "d2",
    title: "Mazamorra Morada",
    price: 12.90,
    desc: "Postre tradicional de maíz morado con frutas picadas y leche condensada.",
    category: "Postres"
  },
  {
    id: "d3",
    title: "Tres Leches",
    price: 16.90,
    desc: "Esponjoso bizcocho bañado en tres tipos de leche, coronado con merengue.",
    category: "Postres"
  },
  {
    id: "d4",
    title: "Picarones",
    price: 13.90,
    desc: "Tradicionales picarones peruanos servidos con miel de chancaca caliente.",
    category: "Postres"
  },
  {
    id: "d5",
    title: "Helado de Lúcuma",
    price: 11.90,
    desc: "Cremoso helado artesanal de lúcuma, fruta exótica peruana de sabor único.",
    category: "Postres"
  }
];