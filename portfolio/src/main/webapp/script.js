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
 * Fetch data from the server and adds them to DOM
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
} /* eslint-enable no-unused-vars */

/**
 * Create container for comments wtih delete button
 * @param {Promise} comment
 * @return {Element} commentElement
 */
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.className = 'comment';

  const commentBody = document.createElement('span');
  const commentToDisplay = comment.body + '\n Score: ' + (comment.score);
  commentBody.innerText = commentToDisplay;

  const deleteBttn = document.createElement('button');
  deleteBttn.innerText = 'Delete';
  deleteBttn.addEventListener('click', () => {
    deleteComment(comment);

    commentElement.remove();
  });

  commentElement.appendChild(commentBody);
  commentElement.appendChild(deleteBttn);
  return commentElement;
}

/**
 * Delete comment through servlet
 * @param {Promise} comment
 * @return {void}
 */
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}
