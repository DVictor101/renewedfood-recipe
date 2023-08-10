'strict';
import { async } from 'regenerator-runtime';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import searchedResultView from './views/searchedResultView';
import bookMarkView from './views/bookMarkView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import { CLOSEMODALSECONDS } from './config';

import 'core-js';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//SPINNER

const loadRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.displaySpinner();
    await model.loadRecipee(id);
    //const recipe = model.state.recipe;
    searchedResultView.update(model.getSearchResultPage());
    bookMarkView.update(model.state.bookMark);
    //RENDERING RECIPE

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.errorHandler();
  }
};

const controlSearchResult = async function () {
  try {
    //DIPLAYING THE RESULT VIEW
    searchedResultView.displaySpinner();
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //LOAD SEARCH
    await model.loadSearchResult(query);

    searchedResultView.render(model.getSearchResultPage());

    //Render Pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPaginationBtn = function (gotoPage) {
  //Rendering new serch result
  searchedResultView.render(model.getSearchResultPage(gotoPage));

  //Render Pagination button
  paginationView.render(model.state.search);
};

const controlRecipeServings = function (newServings) {
  //Update the recipe servings in the state
  model.updateServings(newServings);
  //Updater the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookMark = function () {
  //ADD /REMOVE BOOKMARK
  if (!model.state.recipe.bookmarked) {
    model.bookMark(model.state.recipe);
  } else model.removeBookMark(model.state.recipe.id);
  //UPDATE RECIPEBVIEW
  recipeView.update(model.state.recipe);
  bookMarkView.render(model.state.bookMark);
};

const controlAddBookMark = function () {
  bookMarkView.render(model.state.bookMark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //
    addRecipeView.displaySpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    //DISPLAYING SUUCCESSNMESSAGE
    addRecipeView.successMessageHandler();

    //RENDER BOOKMARJ
    bookMarkView.render(model.state.bookMark);

    //CHANGE ID TH E URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow(), CLOSEMODALSECONDS * 1000;
    });
  } catch (err) {
    console.log(err);
    addRecipeView.errorHandler(err.message);
  }

  //Upload the new recipe data
};

const init = function () {
  bookMarkView.addHandlerRender(controlAddBookMark);
  recipeView.addHandlerRender(loadRecipe);
  recipeView.addHandlerUpdateServings(controlRecipeServings);
  recipeView.addHandlerBookMark(controlBookMark);
  searchView.addSearchHandler(controlSearchResult);
  paginationView.addHandlerbtn(controlPaginationBtn);
  addRecipeView.addUploadHandler(controlAddRecipe);
};
init();
