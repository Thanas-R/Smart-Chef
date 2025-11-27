import { Recipe } from "@/types/recipe";

export const ALL_INGREDIENTS = [
  "tomato", "onion", "garlic", "potato", "carrot", "cabbage", "spinach", "bell pepper", "cucumber", "eggplant", "zucchini", "pumpkin", "sweet potato", "radish", "beetroot", "broccoli", "cauliflower", "green beans", "peas", "corn", "leek", "shallot", "scallion", "okra", "mushroom", "parsley", "cilantro", "celery", "brussels sprouts", "artichoke", "asparagus", "bok choy", "jalapeno", "chili", "watercress", "arugula", "kale", "mustard greens", "collard greens", "fennel", "endive", "chayote", "yam", "cassava", "turnip", "parsnip", "kohlrabi", "swiss chard", "sweetcorn", "sunchoke", "rapini", "daikon", "yam bean", "celeriac", "bell chiles", "apple", "banana", "orange", "lemon", "lime", "grapefruit", "pear", "peach", "plum", "cherry", "strawberry", "blueberry", "raspberry", "blackberry", "mango", "pineapple", "papaya", "kiwi", "apricot", "nectarine", "pomegranate", "fig", "date", "grapes", "cantaloupe", "watermelon", "avocado", "coconut", "persimmon", "guava", "starfruit", "lychee", "jackfruit", "kumquat", "cranberry", "boysenberry", "currants", "mulberry", "elderberry", "plantain", "blood orange", "tangerine", "satsuma", "basil", "oregano", "thyme", "rosemary", "sage", "bay leaf", "mint", "dill", "tarragon", "cilantro (leaf)", "coriander seeds", "cumin seeds", "cumin powder", "turmeric", "paprika", "smoked paprika", "chili powder", "red pepper flakes", "black pepper", "white pepper", "cardamom", "cloves", "nutmeg", "allspice", "ginger", "ground ginger", "galangal", "saffron", "sumac", "zaatar", "fenugreek", "mustard seeds", "carom seeds", "curry leaves", "garam masala", "five spice", "cajun seasoning", "Italian seasoning", "herbes de Provence", "star anise", "mace", "annatto seeds", "asafoetida", "lemongrass", "kaffir lime leaves", "kaffir lime zest", "lavender (culinary)", "milk", "whole milk", "skim milk", "cream", "heavy cream", "yogurt", "greek yogurt", "butter", "ghee", "cheese", "cheddar", "mozzarella", "parmesan", "feta", "cottage cheese", "cream cheese", "paneer", "ricotta", "buttermilk", "condensed milk", "evaporated milk", "goat cheese", "blue cheese", "eggs", "egg whites", "egg yolks", "chicken breast", "chicken thigh", "whole chicken", "ground chicken", "turkey", "ground turkey", "beef steak", "ground beef", "beef ribs", "pork chops", "pork loin", "bacon", "ham", "salami", "sausage", "lamb chops", "ground lamb", "veal", "duck", "prosciutto", "goose", "venison", "meatballs", "pork belly", "turkey bacon", "salmon", "tuna", "shrimp", "prawns", "scallops", "crab", "lobster", "mussels", "clams", "squid", "calamari", "anchovy", "sardines", "trout", "cod", "haddock", "tilapia", "sea bass", "octopus", "mackerel", "smoked salmon", "canned tuna", "canned salmon", "canned sardines", "canned mackerel", "rice", "basmati rice", "jasmine rice", "brown rice", "wild rice", "rice flour", "wheat flour", "all-purpose flour", "whole wheat flour", "bread", "bagel", "pita bread", "tortilla", "naan", "chapati", "sourdough", "rye bread", "ciabatta", "brioche", "croissant", "breadcrumbs", "panko", "oats", "rolled oats", "steel cut oats", "quinoa", "couscous", "bulgur", "barley", "semolina", "polenta", "cornmeal", "maida", "rye flour", "spelt flour", "sorghum flour", "pasta", "spaghetti", "penne", "macaroni", "fusilli", "lasagna sheets", "vermicelli", "rice noodles", "udon", "soba", "ramen", "lentils", "red lentils", "green lentils", "moong dal", "chana dal", "toor dal", "split peas", "black beans", "kidney beans", "pinto beans", "navy beans", "chickpeas", "soybeans", "edamame", "black-eyed peas", "adzuki beans", "olive oil", "extra virgin olive oil", "vegetable oil", "canola oil", "sunflower oil", "sesame oil", "peanut oil", "coconut oil", "sesame seeds", "chia seeds", "flax seeds", "pumpkin seeds", "sunflower seeds", "walnut", "almond", "cashew", "pistachio", "peanut", "hazelnut", "brazil nut", "macadamia", "pine nuts", "walnut oil", "hazelnut oil", "salt", "sea salt", "kosher salt", "soy sauce", "tamari", "fish sauce", "oyster sauce", "hoisin sauce", "ketchup", "mustard", "mayonnaise", "sriracha", "hot sauce", "BBQ sauce", "teriyaki sauce", "tahini", "peanut butter", "almond butter", "honey", "maple syrup", "molasses", "vinegar", "white vinegar", "apple cider vinegar", "balsamic vinegar", "red wine vinegar", "rice vinegar", "worcestershire sauce", "relish", "chutney", "jam", "jelly", "nutella", "salsa", "pesto", "anchovy paste", "baking powder", "baking soda", "yeast", "active dry yeast", "instant yeast", "vanilla extract", "vanilla bean", "cocoa powder", "chocolate chips", "powdered sugar", "brown sugar", "granulated sugar", "cornstarch", "gelatin", "agar agar", "cream of tartar", "unsalted butter", "salted butter", "food coloring", "coffee", "ground coffee", "instant coffee", "tea leaves", "green tea", "black tea", "herbal tea", "matcha", "cocoa", "hot chocolate", "apple juice", "orange juice", "lemonade", "sparkling water", "mineral water", "beer", "wine", "stock chicken", "stock vegetable", "stock beef", "bouillon cube", "canned tomatoes", "tomato paste", "tomato sauce", "canned beans", "canned corn", "canned coconut milk", "canned coconut cream", "pickles", "capers", "olives", "sun-dried tomatoes", "salsa jar", "pesto jar", "tofu", "tempeh", "seitan", "sushi nori", "rice paper", "spring roll wrappers", "marinara sauce", "alfredo sauce", "cream cheese spread", "pickled jalapenos", "pickled onions", "marinated olives", "jarred roasted peppers", "jarred artichokes", "jarred mushrooms", "roasted garlic in jar", "almond milk", "soy milk", "oat milk", "rice milk", "goat milk", "sheep milk", "tamari sauce", "black garlic", "white miso", "red miso", "yellow miso", "mirin", "sake", "shiro miso", "panko breadcrumbs", "masa harina", "nixtamalized corn", "masa dough", "corn tortillas", "polenta cake", "paneer cubes", "halloumi", "tofu firm", "tofu silken", "moringa", "tamarind paste", "tamarind", "jaggery", "gur", "brown jaggery", "brown rice flour", "almond flour", "coconut flour", "chickpea flour", "besan", "semolina (sooji)", "tapioca pearls", "tapioca starch", "glutinous rice", "glutinous rice flour", "won ton wrappers", "sushi rice", "sushi vinegar", "nori sheets", "seaweed", "furikake", "bonito flakes", "dashi", "kombu", "wakame", "scallops (dried)", "cocoa nibs", "white chocolate", "dark chocolate", "cooking chocolate", "caramel", "dulce de leche", "rock sugar", "brown rice syrup", "agave syrup", "date syrup", "yacon syrup", "pearl barley", "farro", "spelt", "freekeh", "teff", "amaranth", "arrowroot powder", "millet", "sorghum", "fonio", "buckwheat", "buckwheat noodles", "kamut", "emmer wheat", "hulled barley", "rye", "chipotle", "ancho chili", "guajillo chili", "berbere", "harissa", "ras el hanout", "shawarma spice", "sumac powder", "dried mint", "dried oregano", "dried basil", "dried thyme", "galangal paste", "tahini paste", "black sesame paste", "white sesame paste", "malt", "malt extract", "barley malt syrup", "miso paste", "coconut sugar", "plantain chips", "cassava flour", "yam flour", "wheat germ", "wheat bran", "oat flour", "sprouted bread", "sourdough starter", "kimchi", "ghee clarified butter", "lard", "duck fat", "shortening", "vegetable shortening", "cooking spray", "non-stick spray", "baking glaze", "egg wash", "edible gold leaf", "edible flowers", "microgreens", "pea shoots", "alfalfa sprouts", "lotus root", "bamboo shoots", "water chestnuts", "gingko nuts", "yam bean (jicama)", "longan", "rambutan", "durian", "breadfruit", "malabar spinach", "mizuna", "tatsoi", "choi sum", "shishito pepper", "poblano pepper", "anaheim pepper", "ghost pepper", "scotch bonnet", "carambola", "sugar snap peas", "snow peas", "bamboo shoots canned", "butternut squash", "kabocha", "acorn squash", "pattypan squash", "delicata squash", "horchata", "espresso", "cold brew", "nitro cold brew", "instant yeast packets", "dry milk powder", "sunflower seeds roasted", "toasted sesame seeds", "black sesame seeds", "white sesame seeds", "hemp seeds", "walnut halves", "almond slices", "slivered almonds", "almond meal", "coconut flakes", "desiccated coconut", "tamarind concentrate", "palm sugar", "demerara sugar", "turbinado sugar", "caster sugar", "icing sugar", "corn syrup", "golden syrup", "apple cider", "pear juice", "cranberry juice", "pineapple juice", "grapefruit juice", "vegetable stock", "dashi stock", "wasabi paste", "pickled ginger", "ponzu sauce", "light soy sauce", "dark soy sauce", "low sodium soy sauce", "sweet soy sauce", "black bean sauce", "XO sauce", "fermented black beans", "doubanjiang", "chili crisp", "chili oil", "Sambal Oelek", "harissa paste", "pomegranate molasses", "rose water", "orange blossom water", "rose syrup", "kewra water", "frozen peas", "frozen corn", "frozen mixed vegetables", "frozen spinach", "frozen berries", "frozen mango", "frozen edamame", "gelato", "ice cream", "sour cream", "crème fraîche", "mascarpone", "cooking cream", "single cream", "half and half", "skimmed milk powder", "whole milk powder", "soy yogurt", "coconut yogurt", "almond yogurt", "lactose-free milk", "ricotta salata", "halloumi cheese", "manchego", "camembert", "brie", "goat milk yogurt", "sheep milk cheese", "provolone", "emmental", "gruyere", "aged cheddar", "colby jack", "pepper jack", "monterey jack", "gouda", "smoked gouda", "edam cheese", "queso fresco", "cotija", "paneer tikka masala", "tikka masala sauce", "butter chicken sauce"
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Scrambled Eggs",
    ingredients: ["eggs", "milk", "butter", "salt", "black pepper"],
    instructions: [
      "Crack eggs into a bowl and whisk with milk, salt, and pepper",
      "Melt butter in a non-stick pan over medium heat",
      "Pour in the egg mixture and let it sit for 20 seconds",
      "Gently fold the eggs with a spatula, creating soft curds",
      "Remove from heat when still slightly wet and serve immediately"
    ],
    prepTime: 2,
    cookTime: 3,
    difficulty: "Easy"
  },
  {
    id: "2",
    title: "Omelette",
    ingredients: ["eggs", "onion", "tomato", "bell pepper", "salt", "black pepper", "butter"],
    instructions: [
      "Dice onion, tomato, and bell pepper into small pieces",
      "Beat eggs with salt and pepper in a bowl",
      "Melt butter in a pan and sauté vegetables for 2 minutes",
      "Pour beaten eggs over vegetables and cook until edges set",
      "Fold omelette in half and cook for another minute until golden"
    ],
    prepTime: 5,
    cookTime: 5,
    difficulty: "Easy"
  },
  {
    id: "3",
    title: "Grilled Cheese Sandwich",
    ingredients: ["bread", "cheddar", "butter"],
    instructions: [
      "Butter one side of each bread slice",
      "Place cheese between bread slices with buttered sides facing out",
      "Heat a pan over medium heat",
      "Grill sandwich for 3 minutes on each side until golden and cheese melts",
      "Cut diagonally and serve hot"
    ],
    prepTime: 2,
    cookTime: 6,
    difficulty: "Easy"
  },
  {
    id: "4",
    title: "Pasta Alfredo",
    ingredients: ["pasta", "cheese", "butter", "milk", "garlic"],
    instructions: [
      "Boil pasta in salted water according to package instructions",
      "In a separate pan, melt butter and sauté minced garlic",
      "Add milk and grated cheese, stirring continuously until smooth",
      "Drain pasta and toss with the creamy sauce",
      "Serve hot with extra cheese on top"
    ],
    prepTime: 5,
    cookTime: 15,
    difficulty: "Easy",
    cuisine: "Italian"
  },
  {
    id: "5",
    title: "Tomato Soup",
    ingredients: ["tomato", "onion", "garlic", "olive oil", "cream", "salt", "black pepper"],
    instructions: [
      "Chop tomatoes, onion, and garlic",
      "Heat olive oil and sauté onion and garlic until soft",
      "Add tomatoes, salt, and pepper, cook for 10 minutes",
      "Blend until smooth using an immersion blender",
      "Stir in cream and simmer for 2 minutes before serving"
    ],
    prepTime: 10,
    cookTime: 15,
    difficulty: "Easy"
  },
  {
    id: "6",
    title: "Paneer Butter Masala",
    ingredients: ["paneer", "tomato", "butter", "cream", "onion", "garlic", "garam masala"],
    instructions: [
      "Cube paneer and lightly fry in butter until golden, set aside",
      "Blend tomatoes into a smooth puree",
      "In a pan, melt butter and sauté chopped onion and garlic",
      "Add tomato puree and garam masala, cook for 10 minutes",
      "Add cream and paneer cubes, simmer for 5 minutes and serve"
    ],
    prepTime: 10,
    cookTime: 20,
    difficulty: "Medium",
    cuisine: "Indian"
  },
  {
    id: "7",
    title: "Banana Smoothie",
    ingredients: ["banana", "milk", "honey"],
    instructions: [
      "Peel and slice bananas",
      "Add bananas, milk, and honey to a blender",
      "Blend on high speed until smooth and creamy",
      "Pour into glasses and serve immediately"
    ],
    prepTime: 3,
    cookTime: 0,
    difficulty: "Easy"
  },
  {
    id: "8",
    title: "Apple Pie",
    ingredients: ["apple", "flour", "butter", "sugar", "cinnamon"],
    instructions: [
      "Make pie dough with flour, butter, and a pinch of sugar",
      "Peel and slice apples, toss with sugar and cinnamon",
      "Roll out dough and line a pie dish",
      "Fill with apple mixture and cover with top crust",
      "Bake at 375°F for 45 minutes until golden"
    ],
    prepTime: 20,
    cookTime: 45,
    difficulty: "Medium"
  },
  {
    id: "9",
    title: "Vegetable Stir Fry",
    ingredients: ["carrot", "cabbage", "bell pepper", "soy sauce", "olive oil", "garlic"],
    instructions: [
      "Slice all vegetables thinly",
      "Heat olive oil in a wok over high heat",
      "Add minced garlic and stir for 30 seconds",
      "Toss in vegetables and stir-fry for 5 minutes",
      "Add soy sauce, toss well, and serve hot"
    ],
    prepTime: 10,
    cookTime: 7,
    difficulty: "Easy",
    cuisine: "Asian"
  },
  {
    id: "10",
    title: "Chicken Curry",
    ingredients: ["chicken breast", "onion", "tomato", "garlic", "ginger", "salt", "black pepper", "garam masala"],
    instructions: [
      "Cut chicken into bite-sized pieces",
      "Sauté onion, garlic, and ginger in oil until fragrant",
      "Add tomatoes and cook until soft",
      "Add chicken pieces and cook for 10 minutes",
      "Season with garam masala, salt, and pepper, simmer until chicken is cooked through"
    ],
    prepTime: 15,
    cookTime: 25,
    difficulty: "Medium",
    cuisine: "Indian"
  },
  {
    id: "11",
    title: "Fried Rice",
    ingredients: ["rice", "carrot", "peas", "egg", "soy sauce", "onion", "vegetable oil"],
    instructions: [
      "Use day-old cooked rice for best results",
      "Dice carrot and onion, heat oil in a wok",
      "Scramble eggs first, set aside",
      "Stir-fry vegetables for 3 minutes",
      "Add rice and soy sauce, toss with eggs, and serve hot"
    ],
    prepTime: 10,
    cookTime: 10,
    difficulty: "Easy",
    cuisine: "Asian"
  },
  {
    id: "12",
    title: "French Toast",
    ingredients: ["bread", "egg", "milk", "sugar", "butter", "cinnamon"],
    instructions: [
      "Whisk eggs, milk, sugar, and cinnamon in a shallow dish",
      "Dip bread slices into the mixture, coating both sides",
      "Melt butter in a pan over medium heat",
      "Cook bread for 2-3 minutes per side until golden",
      "Serve with syrup or fresh fruit"
    ],
    prepTime: 5,
    cookTime: 6,
    difficulty: "Easy"
  },
  {
    id: "13",
    title: "Chocolate Cake",
    ingredients: ["flour", "sugar", "butter", "egg", "cocoa powder", "vanilla extract"],
    instructions: [
      "Cream butter and sugar until fluffy",
      "Beat in eggs one at a time, then add vanilla",
      "Mix flour and cocoa powder, fold into wet ingredients",
      "Pour batter into greased pan",
      "Bake at 350°F for 30-35 minutes until toothpick comes out clean"
    ],
    prepTime: 15,
    cookTime: 35,
    difficulty: "Medium"
  },
  {
    id: "14",
    title: "Pancakes",
    ingredients: ["flour", "milk", "egg", "butter", "sugar", "baking powder", "vanilla extract"],
    instructions: [
      "Mix flour, sugar, and baking powder in a bowl",
      "In another bowl, whisk milk, egg, melted butter, and vanilla",
      "Combine wet and dry ingredients until just mixed",
      "Pour batter onto hot griddle to form pancakes",
      "Flip when bubbles appear, cook until golden on both sides"
    ],
    prepTime: 5,
    cookTime: 15,
    difficulty: "Easy"
  },
  {
    id: "15",
    title: "Vegetable Soup",
    ingredients: ["carrot", "cabbage", "potato", "onion", "salt", "black pepper", "vegetable stock"],
    instructions: [
      "Chop all vegetables into bite-sized pieces",
      "Sauté onion in a pot until translucent",
      "Add remaining vegetables and vegetable stock",
      "Bring to boil, then simmer for 20 minutes",
      "Season with salt and pepper before serving"
    ],
    prepTime: 15,
    cookTime: 25,
    difficulty: "Easy"
  },
  {
    id: "16",
    title: "Masala Dosa (Quick)",
    ingredients: ["rice", "potato", "onion", "chili", "mustard seeds", "coriander", "turmeric"],
    instructions: [
      "Make dosa batter with soaked rice (or use ready-made)",
      "Boil and mash potatoes, season with turmeric",
      "Temper mustard seeds, add onion, chili, and potato",
      "Spread thin layer of batter on hot griddle",
      "Fill with potato mixture, fold and serve with chutney"
    ],
    prepTime: 15,
    cookTime: 20,
    difficulty: "Medium",
    cuisine: "Indian"
  },
  {
    id: "17",
    title: "Garlic Bread",
    ingredients: ["bread", "butter", "garlic", "oregano"],
    instructions: [
      "Mix softened butter with minced garlic and oregano",
      "Slice bread and spread garlic butter generously",
      "Wrap in foil and bake at 375°F for 10 minutes",
      "Unwrap and broil for 2 minutes until crispy",
      "Serve hot as a side dish"
    ],
    prepTime: 5,
    cookTime: 12,
    difficulty: "Easy",
    cuisine: "Italian"
  },
  {
    id: "18",
    title: "Mushroom Risotto",
    ingredients: ["rice", "mushroom", "cheese", "butter", "onion", "garlic", "vegetable stock"],
    instructions: [
      "Slice mushrooms and sauté in butter until golden",
      "In same pan, cook onion and garlic until soft",
      "Add rice and toast for 2 minutes",
      "Gradually add warm stock, stirring constantly",
      "Finish with butter and grated cheese, stir until creamy"
    ],
    prepTime: 10,
    cookTime: 30,
    difficulty: "Medium",
    cuisine: "Italian"
  },
  {
    id: "19",
    title: "Banana Bread",
    ingredients: ["banana", "flour", "butter", "sugar", "egg", "baking powder", "vanilla extract"],
    instructions: [
      "Mash ripe bananas in a bowl",
      "Cream butter and sugar, beat in eggs and vanilla",
      "Mix in mashed bananas",
      "Fold in flour and baking powder until just combined",
      "Bake in loaf pan at 350°F for 60 minutes"
    ],
    prepTime: 15,
    cookTime: 60,
    difficulty: "Easy"
  },
  {
    id: "20",
    title: "Vegetable Sandwich",
    ingredients: ["bread", "tomato", "cucumber", "cheese", "butter", "lettuce"],
    instructions: [
      "Butter bread slices on one side",
      "Layer lettuce, sliced tomato, cucumber, and cheese",
      "Add salt and pepper to taste",
      "Top with second bread slice",
      "Cut diagonally and serve"
    ],
    prepTime: 5,
    cookTime: 0,
    difficulty: "Easy"
  },
  {
    id: "21",
    title: "Paneer Tikka",
    ingredients: ["paneer", "yogurt", "chili powder", "coriander", "garlic", "lemon"],
    instructions: [
      "Cut paneer into cubes",
      "Mix yogurt with chili powder, coriander, minced garlic, and lemon juice",
      "Marinate paneer for 30 minutes",
      "Thread onto skewers and grill or bake at 400°F",
      "Cook for 15 minutes, turning occasionally until charred"
    ],
    prepTime: 10,
    cookTime: 15,
    difficulty: "Easy",
    cuisine: "Indian"
  },
  {
    id: "22",
    title: "Chicken Sandwich",
    ingredients: ["bread", "chicken breast", "mayonnaise", "lettuce", "tomato"],
    instructions: [
      "Grill or pan-fry chicken breast until cooked through",
      "Slice chicken into strips",
      "Spread mayonnaise on bread slices",
      "Layer with lettuce, tomato, and chicken",
      "Assemble and cut into halves"
    ],
    prepTime: 5,
    cookTime: 12,
    difficulty: "Easy"
  },
  {
    id: "23",
    title: "Tomato Pasta",
    ingredients: ["pasta", "tomato", "olive oil", "garlic", "basil", "salt"],
    instructions: [
      "Cook pasta according to package directions",
      "Chop tomatoes and sauté with garlic in olive oil",
      "Add salt and fresh basil",
      "Toss cooked pasta with tomato sauce",
      "Serve with extra basil on top"
    ],
    prepTime: 5,
    cookTime: 15,
    difficulty: "Easy",
    cuisine: "Italian"
  },
  {
    id: "24",
    title: "Mango Smoothie",
    ingredients: ["mango", "milk", "honey", "yogurt"],
    instructions: [
      "Peel and chop mango into chunks",
      "Add mango, milk, yogurt, and honey to blender",
      "Blend until smooth and creamy",
      "Add ice if desired for thickness",
      "Pour into glasses and serve immediately"
    ],
    prepTime: 5,
    cookTime: 0,
    difficulty: "Easy"
  },
  {
    id: "25",
    title: "Vegetable Pizza",
    ingredients: ["flour", "tomato", "cheese", "bell pepper", "onion", "olive oil"],
    instructions: [
      "Make pizza dough with flour, water, yeast, and oil",
      "Roll out dough and spread tomato sauce",
      "Top with cheese, sliced bell pepper, and onion",
      "Drizzle with olive oil",
      "Bake at 450°F for 12-15 minutes until crust is golden"
    ],
    prepTime: 20,
    cookTime: 15,
    difficulty: "Medium",
    cuisine: "Italian"
  },
  {
    id: "26",
    title: "Cheese Omelette",
    ingredients: ["eggs", "cheese", "milk", "salt", "black pepper", "butter"],
    instructions: [
      "Beat eggs with milk, salt, and pepper",
      "Melt butter in a non-stick pan",
      "Pour in egg mixture and let it set slightly",
      "Sprinkle grated cheese on one half",
      "Fold omelette and cook until cheese melts"
    ],
    prepTime: 3,
    cookTime: 5,
    difficulty: "Easy"
  },
  {
    id: "27",
    title: "Cucumber Salad",
    ingredients: ["cucumber", "tomato", "onion", "lemon", "salt", "olive oil"],
    instructions: [
      "Dice cucumber, tomato, and onion",
      "Combine in a bowl",
      "Dress with lemon juice, olive oil, and salt",
      "Toss well to combine",
      "Chill for 10 minutes before serving"
    ],
    prepTime: 10,
    cookTime: 0,
    difficulty: "Easy"
  },
  {
    id: "28",
    title: "Egg Curry",
    ingredients: ["eggs", "onion", "tomato", "garlic", "ginger", "chili", "turmeric", "salt"],
    instructions: [
      "Boil eggs, peel and set aside",
      "Make curry base with onion, garlic, ginger, and tomato",
      "Add turmeric, chili powder, and salt",
      "Cut eggs in half and add to curry",
      "Simmer for 10 minutes until flavors blend"
    ],
    prepTime: 15,
    cookTime: 20,
    difficulty: "Medium",
    cuisine: "Indian"
  },
  {
    id: "29",
    title: "Peanut Butter Sandwich",
    ingredients: ["bread", "peanut butter", "honey"],
    instructions: [
      "Spread peanut butter on one slice of bread",
      "Drizzle honey over peanut butter",
      "Top with second bread slice",
      "Cut diagonally",
      "Serve immediately or pack for lunch"
    ],
    prepTime: 3,
    cookTime: 0,
    difficulty: "Easy"
  },
  {
    id: "30",
    title: "Veggie Burger",
    ingredients: ["bread", "cabbage", "carrot", "onion", "cheese", "olive oil"],
    instructions: [
      "Shred cabbage and carrot, dice onion",
      "Sauté vegetables in olive oil until tender",
      "Season with salt and pepper",
      "Place vegetable patty between burger buns",
      "Top with cheese and serve with condiments"
    ],
    prepTime: 10,
    cookTime: 10,
    difficulty: "Easy"
  },
  {
    id: "31",
    title: "Chicken Fried Rice",
    ingredients: ["chicken breast", "rice", "onion", "soy sauce", "egg", "carrot"],
    instructions: [
      "Dice chicken and cook in hot oil until done",
      "Scramble egg separately, set aside",
      "Stir-fry diced vegetables in same pan",
      "Add cooked rice and chicken",
      "Season with soy sauce, mix in egg, and serve"
    ],
    prepTime: 10,
    cookTime: 15,
    difficulty: "Medium",
    cuisine: "Asian"
  },
  {
    id: "32",
    title: "Fruit Salad",
    ingredients: ["banana", "apple", "orange", "honey", "lemon"],
    instructions: [
      "Chop all fruits into bite-sized pieces",
      "Place in a large bowl",
      "Drizzle with honey and lemon juice",
      "Toss gently to coat",
      "Chill for 15 minutes before serving"
    ],
    prepTime: 10,
    cookTime: 0,
    difficulty: "Easy"
  },
  {
    id: "33",
    title: "Spinach Soup",
    ingredients: ["spinach", "onion", "garlic", "cream", "salt", "black pepper"],
    instructions: [
      "Wash spinach thoroughly",
      "Sauté onion and garlic until soft",
      "Add spinach and cook until wilted",
      "Blend with cream until smooth",
      "Season with salt and pepper, heat through before serving"
    ],
    prepTime: 10,
    cookTime: 15,
    difficulty: "Easy"
  },
  {
    id: "34",
    title: "Lemon Cake",
    ingredients: ["flour", "sugar", "butter", "egg", "lemon", "vanilla extract"],
    instructions: [
      "Cream butter and sugar until light and fluffy",
      "Beat in eggs, lemon zest, and vanilla",
      "Fold in flour until just combined",
      "Pour into greased cake pan",
      "Bake at 350°F for 35 minutes, drizzle with lemon glaze"
    ],
    prepTime: 15,
    cookTime: 35,
    difficulty: "Medium"
  },
  {
    id: "35",
    title: "Cabbage Stir Fry",
    ingredients: ["cabbage", "carrot", "soy sauce", "olive oil", "garlic"],
    instructions: [
      "Shred cabbage and carrot thinly",
      "Heat oil in wok over high heat",
      "Add minced garlic and stir for 30 seconds",
      "Toss in vegetables and stir-fry for 5 minutes",
      "Add soy sauce and serve hot"
    ],
    prepTime: 8,
    cookTime: 7,
    difficulty: "Easy",
    cuisine: "Asian"
  },
  {
    id: "36",
    title: "Egg Sandwich",
    ingredients: ["bread", "egg", "mayonnaise", "lettuce"],
    instructions: [
      "Boil eggs until hard-boiled, cool and chop",
      "Mix chopped eggs with mayonnaise",
      "Spread mixture on bread",
      "Add lettuce leaves",
      "Top with second slice and cut into triangles"
    ],
    prepTime: 10,
    cookTime: 10,
    difficulty: "Easy"
  },
  {
    id: "37",
    title: "Chicken Salad",
    ingredients: ["chicken breast", "lettuce", "tomato", "cucumber", "olive oil", "lemon"],
    instructions: [
      "Grill and slice chicken breast",
      "Chop lettuce, tomato, and cucumber",
      "Arrange vegetables on a plate",
      "Top with sliced chicken",
      "Dress with olive oil and lemon juice"
    ],
    prepTime: 10,
    cookTime: 12,
    difficulty: "Easy"
  },
  {
    id: "38",
    title: "Cheese Pizza",
    ingredients: ["flour", "tomato", "cheese", "olive oil", "oregano"],
    instructions: [
      "Prepare pizza dough and let it rise",
      "Roll out dough into circular shape",
      "Spread tomato sauce evenly",
      "Top with generous amount of cheese and oregano",
      "Bake at 450°F for 12 minutes until cheese bubbles"
    ],
    prepTime: 20,
    cookTime: 12,
    difficulty: "Medium",
    cuisine: "Italian"
  },
  {
    id: "39",
    title: "Vegetable Pasta",
    ingredients: ["pasta", "tomato", "bell pepper", "onion", "olive oil", "garlic"],
    instructions: [
      "Cook pasta according to package instructions",
      "Sauté onion, garlic, and bell pepper in olive oil",
      "Add diced tomatoes and cook for 5 minutes",
      "Toss cooked pasta with vegetable sauce",
      "Serve with grated cheese on top"
    ],
    prepTime: 10,
    cookTime: 15,
    difficulty: "Easy",
    cuisine: "Italian"
  },
  {
    id: "40",
    title: "Mushroom Soup",
    ingredients: ["mushroom", "onion", "garlic", "cream", "butter", "salt"],
    instructions: [
      "Slice mushrooms thinly",
      "Sauté onion and garlic in butter until soft",
      "Add mushrooms and cook until tender",
      "Blend with cream until smooth",
      "Season with salt and serve with crusty bread"
    ],
    prepTime: 10,
    cookTime: 20,
    difficulty: "Easy"
  },
  {
    id: "41",
    title: "Carrot Cake",
    ingredients: ["carrot", "flour", "sugar", "egg", "butter", "cinnamon", "baking powder"],
    instructions: [
      "Grate carrots finely",
      "Mix flour, sugar, baking powder, and cinnamon",
      "Beat eggs with melted butter",
      "Combine wet and dry ingredients, fold in carrots",
      "Bake at 350°F for 40 minutes until golden"
    ],
    prepTime: 20,
    cookTime: 40,
    difficulty: "Medium"
  },
  {
    id: "42",
    title: "Fried Egg Sandwich",
    ingredients: ["bread", "egg", "butter", "salt", "black pepper"],
    instructions: [
      "Butter bread slices and toast if desired",
      "Fry egg sunny-side up or over-easy",
      "Season with salt and pepper",
      "Place egg between bread slices",
      "Serve immediately while egg is warm"
    ],
    prepTime: 3,
    cookTime: 5,
    difficulty: "Easy"
  },
  {
    id: "43",
    title: "Tomato Sandwich",
    ingredients: ["bread", "tomato", "butter", "salt", "black pepper"],
    instructions: [
      "Butter bread slices generously",
      "Slice tomatoes thickly",
      "Layer tomato slices on bread",
      "Season with salt and pepper",
      "Top with second slice and serve fresh"
    ],
    prepTime: 5,
    cookTime: 0,
    difficulty: "Easy"
  },
  {
    id: "44",
    title: "Oats Porridge",
    ingredients: ["oats", "milk", "honey", "banana"],
    instructions: [
      "Bring milk to a simmer in a pot",
      "Add oats and cook stirring occasionally",
      "Cook for 5 minutes until creamy",
      "Drizzle with honey",
      "Top with sliced banana before serving"
    ],
    prepTime: 2,
    cookTime: 7,
    difficulty: "Easy"
  },
  {
    id: "45",
    title: "Paneer Sandwich",
    ingredients: ["bread", "paneer", "tomato", "onion", "cheese"],
    instructions: [
      "Slice paneer and pan-fry until golden",
      "Layer paneer, tomato, and onion on bread",
      "Top with cheese",
      "Grill sandwich until cheese melts",
      "Cut and serve hot"
    ],
    prepTime: 5,
    cookTime: 8,
    difficulty: "Easy",
    cuisine: "Indian"
  },
  {
    id: "46",
    title: "Vegetable Omelette",
    ingredients: ["eggs", "carrot", "onion", "spinach", "salt", "black pepper"],
    instructions: [
      "Dice all vegetables finely",
      "Beat eggs with salt and pepper",
      "Cook vegetables in pan for 2 minutes",
      "Pour eggs over vegetables",
      "Fold omelette when edges set and cook until done"
    ],
    prepTime: 8,
    cookTime: 6,
    difficulty: "Easy"
  },
  {
    id: "47",
    title: "Chicken Burger",
    ingredients: ["bread", "chicken breast", "lettuce", "tomato", "mayonnaise"],
    instructions: [
      "Season and grill chicken breast until cooked",
      "Toast burger buns lightly",
      "Spread mayonnaise on buns",
      "Layer lettuce, tomato, and chicken",
      "Assemble burger and serve with fries"
    ],
    prepTime: 10,
    cookTime: 15,
    difficulty: "Medium"
  },
  {
    id: "48",
    title: "Chocolate Brownie",
    ingredients: ["chocolate", "flour", "butter", "egg", "sugar", "vanilla extract"],
    instructions: [
      "Melt chocolate and butter together",
      "Beat eggs with sugar until fluffy",
      "Mix in melted chocolate and vanilla",
      "Fold in flour until just combined",
      "Bake at 350°F for 25 minutes for fudgy texture"
    ],
    prepTime: 15,
    cookTime: 25,
    difficulty: "Easy"
  },
  {
    id: "49",
    title: "Apple Crumble",
    ingredients: ["apple", "flour", "butter", "sugar", "cinnamon"],
    instructions: [
      "Slice apples and place in baking dish",
      "Sprinkle with cinnamon and sugar",
      "Make crumble topping with flour, butter, and sugar",
      "Spread crumble over apples",
      "Bake at 375°F for 30 minutes until golden"
    ],
    prepTime: 15,
    cookTime: 30,
    difficulty: "Easy"
  },
  {
    id: "50",
    title: "Garlic Mashed Potato",
    ingredients: ["potato", "garlic", "butter", "milk", "salt"],
    instructions: [
      "Boil potatoes until tender",
      "Mash potatoes with butter",
      "Add roasted or sautéed garlic",
      "Mix in warm milk until creamy",
      "Season with salt and serve hot"
    ],
    prepTime: 10,
    cookTime: 20,
    difficulty: "Easy"
  }
];
