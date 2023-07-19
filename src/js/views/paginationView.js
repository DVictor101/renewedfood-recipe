import View from './view';
import icons from '../../img/icons.svg';

class Pagination extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerbtn(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      console.log(gotoPage);
      handler(gotoPage);
    });
  }

  _generateMarkUp() {
    const cPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1 and there are other pages
    if (cPage === 1 && numPages > 1) {
      return `<button data-goto="${
        cPage + 1
      }" class="btn--inline pagination__btn--next">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      <span>Page ${cPage + 1}</span>
    </button>`;
    }

    //Page 1 and no other pages
    //Last Page
    if (cPage === numPages && numPages > 1) {
      return ` <button data-goto="${
        cPage - 1
      }"  class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${cPage - 1}</span>
    </button>
    `;
    }
    //Other page
    if (cPage < numPages) {
      return `<button data-goto="${
        cPage - 1
      }"  class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${cPage - 1}</span>
    </button>
    <button data-goto="${cPage + 1}"  class="btn--inline pagination__btn--next">
      <span>Page ${cPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
    return '';
  }
}
export default new Pagination();
