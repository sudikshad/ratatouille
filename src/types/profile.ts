export interface PantryProfile {
  spices: string[];
  condiments: string[];
  grains: string[];
}

export interface TasteProfile {
  cuisines: string[];
  dislikes: string[];
  dietaryStyle: string;
  goals: string[];
}

export interface UserProfile {
  kitchen: string[];
  pantry: PantryProfile;
  taste: TasteProfile;
}
