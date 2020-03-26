const algorithm = require('../server/ms_algorithm');
const resultData = require('./results.json');

describe("Test ms_algorithm", () => {

  test("Test filterRecipe", () => {
    const testRecipe = resultData.specificChickenPotatoes[0];
    const searchObj = {
      parameters: ["chicken", "potatoes"],
      calories: 500,
      serving: 4,
      time: 120,
      restrictions: ['gluten-free']
    };

    // Check recipe does have attributes in line with searchObj
    expect(testRecipe.dietary_restrictions.length).toBe(2);
    expect(testRecipe.dietary_restrictions.includes('gluten-free')).toBe(true);
    expect(testRecipe.recipe_calories <= 500).toBe(true);
    expect(testRecipe.recipe_serving_size <= 4).toBe(true);
    expect(testRecipe.cooking_minutes <= 120).toBe(true);

    // Test that function allows valid recipe
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(true);

    // Test when a recipe has only a null value in the restrictions
    testRecipe.dietary_restrictions = [null];
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(false);

    // Test when a recipe has only [] in the restrictions
    testRecipe.dietary_restrictions = [];
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(false);

    // Test when a recipe has restrictions but not gluten-free
    testRecipe.dietary_restrictions = ['dairy-free'];
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(false);

    // Reset valid restrictions
    testRecipe.dietary_restrictions = ['dairy-free', 'gluten-free'];
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(true);

    // Test with invalid calories
    testRecipe.recipe_calories = 600;
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(false);

    // Reset calories
    testRecipe.recipe_calories = 500;
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(true);

    // Test with invalid serving size
    testRecipe.recipe_serving_size = 3;
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(false);

    // Reset serving size
    testRecipe.recipe_serving_size = 5;
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(true);

    // Test with invalid cooking time
    testRecipe.cooking_minutes = 135;
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(false);

    // Reset cooking time
    testRecipe.cooking_minutes = 105;
    expect(algorithm.filterRecipe(testRecipe, searchObj)).toBe(true);

  });
});
