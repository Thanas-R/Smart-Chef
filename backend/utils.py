from typing import List

def calculate_matches(user_ingredients: List[str], all_recipes: List[dict]) -> List[dict]:
    user_set = set(i.lower().strip() for i in user_ingredients)
    matches = []
    for recipe in all_recipes:
        recipe_ingredients = [i.lower().strip() for i in recipe["ingredients"]]
        has_ingredients = [i for i in recipe["ingredients"] if i.lower().strip() in user_set]
        missing_ingredients = [i for i in recipe["ingredients"] if i.lower().strip() not in user_set]
        match_percentage = round((len(has_ingredients) / len(recipe_ingredients)) * 100)
        if match_percentage > 0:
            matches.append({
                **recipe,
                "matchPercentage": match_percentage,
                "hasIngredients": has_ingredients,
                "missingIngredients": missing_ingredients
            })
    return sorted(matches, key=lambda x: x["matchPercentage"], reverse=True)
