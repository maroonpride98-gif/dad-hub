export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: RecipeCategory;
  authorId: string;
  author: string;
  avatar: string;
  likes: number;
  likedBy: string[];
  imageUrl?: string;
  time: string;
}

export type RecipeCategory =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Snacks'
  | 'Grilling'
  | 'Quick & Easy'
  | 'Kid-Friendly'
  | 'Meal Prep';

export interface DadHack {
  id: string;
  title: string;
  description: string;
  category: DadHackCategory;
  authorId: string;
  author: string;
  avatar: string;
  likes: number;
  likedBy: string[];
  time: string;
}

export type DadHackCategory =
  | 'Parenting'
  | 'Home'
  | 'Car'
  | 'Tech'
  | 'Money'
  | 'Health'
  | 'Travel'
  | 'Life';
