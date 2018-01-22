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
            <input id="pr-input" autocapitalize="off" autocomplete="off" autocorrect="off" class="text" name="regex" placeholder="Example: /[A-Z]/" spellcheck="false" type="text" value="">
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
    this.error = this.form.querySelector('.pr-error');

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
  search(text = this.input.value || '') {
    this.resultsList.querySelectorAll('.message').forEach((e) => {
      try {
        const regex = new RegExp(text.replace(/\//, ''));
        const closest = e.closest('.event');

        this.hideError();

        if (!e.textContent.match(regex)) {
          closest.style.display = 'none';
        }
        else {
          closest.style.display = 'block';
        }
      } catch (e) {
        this.showError();
        throw e;
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
