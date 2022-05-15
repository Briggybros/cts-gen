/**
 * @type HTMLInputElement
 */
const gencount = document.querySelector('input#gencount');
/**
 * @type HTMLButtonElement
 */
const generate = document.querySelector('button#generate');
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
 * @param {number} a
 * @returns {string}
 */
function formatA(a) {
  switch (a) {
    case 1:
      return '';
    default:
      return `${a}`;
  }
}

/**
 * @param {number} b
 * @returns {string}
 */
function formatB(b) {
  switch (b) {
    case 1:
      return '';
    default:
      return `${b}`;
  }
}

/**
 * @param {number} c
 * @returns {string}
 */
function formatC(c) {
  return `${c}`;
}

/**
 * @param {number} d
 * @returns {string}
 */
function formatD(d) {
  return `${d}`;
}

/**
 * @param {number} e
 * @returns {string}
 */
function formatE(e) {
  return `${e}`;
}

/**
 * @param {Object} qnums
 */
function mathFormat(qnums) {
  return {
    a: formatA(qnums.a),
    b: formatB(qnums.b),
    c: formatC(qnums.c),
    d: formatD(qnums.d),
    e: formatE(qnums.e),
  };
}

/**
 * A Question object representing the values of a Complete the Square question in the form of:
 *
 * ax^2 + bx + c = a(x + d)^2 + e
 *
 * @typedef {Object} Question
 * @property {string} a
 * @property {string} b
 * @property {string} c
 * @property {string} d
 * @property {string} e
 */

/**
 * @returns {Question}
 */
function generateQuestion() {
  const a = randomIntFromInterval(1, 10);
  const d = randomIntFromInterval(1, 10);
  const e = randomIntFromInterval(1, 10);

  const b = 2 * a * d;
  const c = e + (b * b) / (4 * a);
  return mathFormat({
    a, b, c, d, e,
  });
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
  span.innerHTML = `Q ${num}) ${a}x<sup>2</sup> + ${b}x + ${c}`;
  return span;
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
  span.innerHTML = ` = ${a}(x + ${d})<sup>2</sup> + ${e}`;
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
  const num = gencount.value;
  clearQuestions();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < num; i++) {
    const question = generateQuestion();
    const line = createQuestionLineElement(question, i + 1);
    questionsContainer.appendChild(line);
  }
}
generate.addEventListener('click', onGenerate);
