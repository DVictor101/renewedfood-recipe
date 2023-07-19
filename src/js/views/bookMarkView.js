import View from './view';
import previewBookMark from './previewBookMark';

class bookMarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _successMessage = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkUp() {
    return this._data
      .map(bookmark => previewBookMark.render(bookmark, false))
      .join('');
  }
}

export default new bookMarkView();
