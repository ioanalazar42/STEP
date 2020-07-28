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
  fetch('/login-status').then(response => response.json()).then((loginJson) => {
    const url = createAnchorElement(loginJson);

    const content = document.getElementById('content');
    content.appendChild(url);

    if (!loggedIn(loginJson)) {
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
    commentList.appendChild(createListElement(comment));
  });
}

/**
 * Get login status of user from json
 * @param {JSON} json
 * @return {Boolean} login status
 */
function loggedIn(json) {
  switch (json.logged) {
    case 'true':
      return true;
    case 'false':
      return false;
  }
}

/**
 * Create anchor element with attributes
 * href and some text
 * @param {JSON} json
 * @return {Element} a
 */
function createAnchorElement(json) {
  var a = document.createElement('a');
  var link = loggedIn(json) ? document.createTextNode("Logout") : 
    document.createTextNode("Login to see comments");
  a.appendChild(link);
  a.href = json.url; 
  return a;
}

/**
 * Creates a <li> element containing the body of the comment
 * @param {Promise} comment
 * @return {Element} liElement
 */
function createListElement(comment) {
  const liElement = document.createElement('li');
  liElement.innerText = comment.body;
  return liElement;
}
