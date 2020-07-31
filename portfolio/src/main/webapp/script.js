// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* eslint-disable no-unused-vars */
/**

 * Adds a random fact to the page.
 */
function addRandomFact() {
  const facts =
      ['My favorite comedy show is The Office.',
        'I am a cat person but I also love dogs',
        'My favorite color is pink',
        'Favorite summer activity: going to the beach.',
        'choccy milk is my guilty pleasure.'];

  // Pick a random fact.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factContainer = document.getElementById('fact-container');
  factContainer.innerText = fact;
} /* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
/**
 * Fetch login status from the server and display
 * comments section if the user is logged in
 * @return {void}
 */
function checkLogin() {
  fetch('/login-status').then((response) =>
    response.json()).then((json) => {
    const url = createAnchorElement(json);

    const content = document.getElementById('content');
    content.appendChild(url);

    if (!json.logged) {
      return;
    } else {
      getComments();
    }
  });
} /* eslint-enable no-unused-vars */

/**
 * Fetch comments from the server and add them to DOM
 * @return {void}
 */
async function getComments() {
  const response = await fetch('/list-comments');
  const comments = await response.json();

  // Build the comments section
  const commentList = document.getElementById('comments-section');
  comments.forEach((comment) => {
    commentList.appendChild(createCommentElement(comment));
  });
}

/**
 * Create anchor element with a link that depends on whether
 * the user is logged in or not:
 *  - If user is logged in, the link logs the user out
 *  - If the user is logged out, the link prompts the user to log in
 * @param {JSON} json - an object containing user login status
 * @return {Element} a - an anchor element with behaviour described above
 */
function createAnchorElement(json) {
  const a = document.createElement('a');
  const link = json.logged ? document.createTextNode('Logout') :
    document.createTextNode('Login to see comments');
  a.appendChild(link);
  a.href = json.url;

  // wrap anchor in title tag to make it more visible
  const anchorWrap = document.createElement('h2');
  anchorWrap.appendChild(a);
  return anchorWrap;
}

/**
 * Create container for comments wtih delete button and
 * analyse button that computes sentiment analysis score
 * when pressed
 * @param {Promise} comment
 * @return {Element} commentElement
 */
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.className = 'comment';

  const emailBox = document.createElement('span');
  const commentBody = document.createElement('span');
  const scoreMessage = document.createElement('span');

  const deleteBttn = document.createElement('button');
  deleteBttn.innerText = 'Delete';
  deleteBttn.className = 'btn btn-default';
  deleteBttn.addEventListener('click', () => {
    /* when delete button is pressed, send comment to servlet which
    checks whether the person who want to delete the comment is
    the same as the person who wrote the comment */
    fetch('/delete-comment?id=' + comment.id).then((response) => {
      if (response.ok) {
        commentElement.remove();
      }
    });
  });

  const scoreBttn = document.createElement('button');
  scoreBttn.innerText = 'Analyse';
  scoreBttn.className = 'btn btn-default';
  /* when score button pressed, send comment to servlet which
   deals with computing sentiment analysis score and sends back the
   updated comment */
  scoreBttn.addEventListener('click', () => {
    scoreMessage.innerText = 'Computing score...';
    fetch('/sentiment-analysis?id=' + comment.id).then((response) =>
      response.json()).then((comment) => {
      scoreMessage.innerText = 'Score: ' + (comment.score).toFixed(1);
    });
  });

  emailBox.innerHTML = comment.email + ': ';
  emailBox.style.fontWeight = 'bold';

  commentBody.innerText = comment.body;

  commentElement.appendChild(emailBox);
  commentElement.appendChild(commentBody);
  commentElement.appendChild(deleteBttn);
  commentElement.appendChild(scoreBttn);
  commentElement.appendChild(scoreMessage);
  return commentElement;
}

