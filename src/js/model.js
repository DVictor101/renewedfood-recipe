import { async } from 'regenerator-runtime';
import { APIURL, DEFAULTPERPAGE, KEY } from './config';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    el: '',
    results: [],
    page: 1,
    resultsPerPage: DEFAULTPERPAGE,
  },
  bookMark: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipee = async function (id) {
  try {
    const data = await AJAX(`${APIURL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookMark.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.log(`${err}`);
    throw err;
  }
};

export const loadSearchResult = async function (el) {
  try {
    state.search.el = el;
    const data = await AJAX(`${APIURL}?search=${el}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookMark = function () {
  localStorage.setItem('bookMark', JSON.stringify(state.bookMark));
};

export const bookMark = function (recipe) {
  //ADD BOOKMARK
  state.bookMark.push(recipe);

  //MARK CURRRENT RECIPE AS BOOKMARK
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookMark();
};
export const removeBookMark = function (id) {
  //DELETE BOOKMARK
  const index = state.bookMark.findIndex(el => el.id === id);
  state.bookMark.splice(index, 1);
  //set bookmarked to false
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookMark();
};

const init = function () {
  const storage = localStorage.getItem('bookMark');
  if (storage) state.bookMark = JSON.parse(storage);
};
init();
const clearBooMark = function () {
  localStorage.clear('bookMark');
};
clearBooMark();

export const uploadRecipe = async function (newRecipe) {
  try {
    //
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => {
          el.trim();
        });
        if (ingArr.length !== 3) throw new Error('Wrong Ingredient format');
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${APIURL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    console.log(data);
    bookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
//c3307e25-aa6a-4f5b-94fd-160b796854fc
