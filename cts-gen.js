/**
 * @type HTMLInputElement
 */
const includeCInput = document.querySelector('input#include-c');
/**
 * @type HTMLInputElement
 */
const allowAInput = document.querySelector('input#allow-a');
/**
 * @type HTMLInputElement
 */
const allowNegativeAInput = document.querySelector('input#allow-negative-a');
/**
 * @type HTMLInputElement
 */
const gencountInput = document.querySelector('input#gencount');
/**
 * @type HTMLButtonElement
 */
const generateButton = document.querySelector('button#generate');
/**
 * @type Element
 */
const questionsContainer = document.querySelector('#questions-container');

function clearQuestions() {
  questionsContainer.innerHTML = '';
}

/**
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * A Question object representing the values of a Complete the Square question in the form of:
 *
 * ax^2 + bx + c = a(x + d)^2 + e
 *
 * @typedef {Object} Question
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 * @property {number} e
 */

/**
 * @param {Object} options
 * @param {boolean} options.includeC Allow for a C term to be generated
 * @param {boolean} options.allowA Allow for A term to not be 1
 * @param {boolean} options.allowNegativeA Allow for A term to be negative
 * @returns {Question}
 */
function generateQuestion({ includeC = false, allowA = false, allowNegativeA = false } = {}) {
  let a = 1;
  if (allowA) {
    a = randomIntFromInterval(1, 10);
    if (allowNegativeA) {
      if (randomIntFromInterval(0, 1) === 1) {
        a = -a;
      }
    }
  }
  const d = randomIntFromInterval(1, 10);

  const b = 2 * a * d;

  const f = (b * b) / (4 * a);

  let e;
  if (includeC) {
    e = randomIntFromInterval(1, 10);
  } else {
    e = -f;
  }
  const c = e + f;
  return {
    a, b, c, d, e,
  };
}

/**
 * @param {number} x
 * @returns {string} "+" or "-"
 */
function sign(x) {
  return x >= 0 ? '+' : '-';
}

/**
 * @param {Array<number>} poly
 * @returns {string}
 */
function formatPoly(poly) {
  return poly.reduce((acc, num, idx, arr) => {
    if (num === 0) return acc;

    let signStr = sign(num);
    if (num > 0 && idx === 0) signStr = '';

    const pow = (arr.length - 1) - idx;
    const x = pow !== 0 ? 'x' : '';
    const powStr = (pow > 1) ? `<sup>${pow}</sup>` : '';

    let numStr = `${Math.abs(num)}`;
    if (pow > 0) {
      if (num === 1) {
        numStr = '';
      }
    }

    return `${acc} ${signStr}${idx !== 0 ? ' ' : ''}${numStr}${x}${powStr}`;
  }, '').trim();
}

/**
 * @typedef {HTMLSpanElement} QuestionElement
 */

/**
 * @param {Question} question
 * @param {number} num
 * @returns {QuestionElement}
 */
function createQuestionElement({
  a, b, c,
}, num) {
  const span = document.createElement('span');
  span.innerHTML = `Q ${num}) ${formatPoly([a, b, c])}`;
  return span;
}

function formatCompletedSquare({ a, d, e }) {
  const aStr = a !== 1 ? `${a}` : '';

  const eSign = sign(e);
  const eStr = e !== 0 ? `${eSign} ${Math.abs(e)}` : '';

  return `${aStr}(${formatPoly([1, d])})<sup>2</sup> ${eStr}`.trim();
}

/**
 * @typedef {HTMLSpanElement} AnswerElement
 */

/**
 * @param {Question} question
 * @returns {AnswerElement}
 */
function createAnswerElement({ a, d, e }) {
  const span = document.createElement('span');
  span.innerHTML = ` = ${formatCompletedSquare({ a, d, e })}`;
  return span;
}

/**
 * @typedef {HTMLSpanElement} QuestionLineElement
 */

/**
 * @param {Question} question
 * @param {number} num
 * @returns {QuestionLineElement}
 */
function createQuestionLineElement(question, num) {
  const span = document.createElement('span');
  const questionElement = createQuestionElement(question, num);
  const answerElement = createAnswerElement(question);
  const button = document.createElement('button');
  button.innerHTML = 'Reveal Answer!';

  span.append(questionElement, button);

  button.addEventListener('click', () => {
    button.remove();
    span.append(answerElement);
  });

  return span;
}

/**
 * @this HTMLButtonElement
 * @param {MouseEvent} ev
 */
function onGenerate() {
  const num = gencountInput.value;
  clearQuestions();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < num; i++) {
    const question = generateQuestion({
      includeC: includeCInput.checked,
      allowA: allowAInput.checked,
      allowNegativeA: allowAInput.checked || allowNegativeAInput.checked,
    });
    const line = createQuestionLineElement(question, i + 1);
    questionsContainer.appendChild(line);
  }
}
generateButton.addEventListener('click', onGenerate);

function onAllowAInputChanged() {
  allowNegativeAInput.disabled = !this.checked;
}

allowAInput.addEventListener('change', onAllowAInputChanged);
