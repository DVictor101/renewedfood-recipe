import View from './view';
import previewBookMark from './previewBookMark';

class searchResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Recipe not found, search another';
  _successMessage = '';

  _generateMarkUp() {
    return this._data
      .map(result => previewBookMark.render(result, false))
      .join('');
  }
}

export default new searchResultView();
