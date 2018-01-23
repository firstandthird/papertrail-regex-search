class RegexForm {

  /**
   * Creates an instance of RegexForm
   *
   * @constructor
   */
  constructor() {
    this.resultsList = document.querySelector('#event_list');

    this.generateTemplate();
  }

  /**
   * Generates the initial form template
   */
  generateTemplate() {
    const formTemplate = `
      <div class="pr-wrapper grid flex mod-with-velocity">
        <div class="grid-cell cell-query">
          <div class="query-wrapper">
            <a href="#" id="pr-reset" class="zoom-icon" data-tooltip-hide-trigger="click" data-tooltip-position="top-left" data-tooltip="Clear search"><span class="flaticon solid x-2"></span></a>
            <input id="pr-input" autocapitalize="off" autocomplete="off" autocorrect="off" class="text" name="regex" placeholder='Example: blocked-uri:"(.*?)"' spellcheck="false" type="text" value="">
          </div>
        </div>
        <div class="grid-cell cell-tail-options">
          <button type="submit" id="pr-submit" class="btn btn-velocity">Filter</button>
        </div>
        <div class="pr-error"><small>Invalid regex</small></div>
      </div>
    `;

    this.form = document.createElement('form');
    this.form.id = 'pr-form';
    this.form.innerHTML = formTemplate;

    document.querySelector('#tail-search-form').insertAdjacentElement('afterend', this.form);

    this.input = this.form.querySelector('#pr-input');
    this.resetBtn = this.form.querySelector('#pr-reset');
    this.error = this.form.querySelector('.pr-error');

    this.resetBtn.addEventListener('click', (e) => {
      console.log('reset');
      e.preventDefault();
      this.form.reset();
      this.resetForm();
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.search(this.input.value);
    });
  }

  /**
   * Displays an error message on regex failure
   */
  showError() {
    this.error.style.display = 'block';
  }

  /**
   * Hides error message
   */
  hideError() {
    this.error.style.display = 'none';
  }

  /**
   * Searches among the list of papertrail results and displays the ones matching
   * the provided regular expression
   *
   * @param {string} text
   */
  search(text = this.input.value) {
    if (!text || text === '') {
      this.resetForm();
      return;
    }

    try {
      const regex = new RegExp(text.replace(/\//, ''));

      this.resultsList.querySelectorAll('.message').forEach(element => {
        const match = element.textContent.match(regex);

        this.hideError();

        let matchContainer = null;

        if (element.nextElementSibling && element.nextElementSibling.classList.contains('pr-match')) {
          matchContainer = element.nextElementSibling;
        }

        if (match) {
          if (!matchContainer) {
            matchContainer = document.createElement('span');
            matchContainer.classList.add('pr-match');
            element.insertAdjacentElement('afterEnd', matchContainer);
          }

          matchContainer.style.display = 'inline';
          matchContainer.textContent = match[1];
          element.style.display = 'none';
        }
        else {
          element.style.display = 'inline';

          if (matchContainer) {
            matchContainer.style.display = 'none';
          }
        }
      });
    }
    catch(err) {
      this.showError();
      throw err;
    }
  }

  resetForm() {
    this.resultsList.querySelectorAll('.message').forEach(element => {
      element.style.display = 'inline';
      const sibling = element.nextElementSibling;

      if (sibling.classList.contains('.pr-match')) {
        sibling.style.display = 'none';
      }
    });
  }
}

/**
 * Initialize script
 */
function init() {
  const regexForm = new RegexForm();

  const observeTarget = document.querySelector('#event_list');
  const observer = new MutationObserver(() => regexForm.search());

  observer.observe(observeTarget, { childList: true });
}

window.onload = init;
