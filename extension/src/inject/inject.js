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
      <div class="search-input">
        <a href="#" id="pr-reset" class="zoom-icon" data-tooltip-hide-trigger="click" data-tooltip-position="top-left" data-tooltip="Clear search"><span class="flaticon solid x-2"></span></a>
        <input id="pr-input" autocapitalize="off" autocomplete="off" autocorrect="off" class="text" name="regex" placeholder='Example: blocked-uri:"(.*?)"' spellcheck="false" type="text" value="">
      </div>
      <div class="search-submit">
        <button type="submit" id="pr-submit" class="btn-link btn-search-control btn-velocity">Filter</button>
      </div>
      <div class="pr-error pr-hide"><small>Invalid regex</small></div>
    `;

    this.form = document.createElement('form');
    this.form.id = 'pr-form';
    this.form.classList.add('search');
    this.form.innerHTML = formTemplate;

    document.querySelector('#tail-search-form').insertAdjacentElement('afterend', this.form);

    this.input = this.form.querySelector('#pr-input');
    this.resetBtn = this.form.querySelector('#pr-reset');
    this.error = this.form.querySelector('.pr-error');

    this.resetBtn.addEventListener('click', (e) => {
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
    this.error.classList.remove('pr-hide');
  }

  /**
   * Hides error message
   */
  hideError() {
    this.error.classList.add('pr-hide');
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
    this.hideError();

    this.resultsList.querySelectorAll('.message').forEach(element => {
      element.style.display = 'inline';

      const sibling = element.nextElementSibling;

      if (sibling && sibling.classList.contains('.pr-match')) {
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
