

const commentForm = document.getElementById('add-comment-form');
const blogpostBodyEl = document.querySelector('#add-comment-form textarea');
const submitButton = document.querySelector('.submit-btn');
commentForm.addEventListener("submit", addPost);


async function addPost(event) {
  let commentBody = blogpostBodyEl.value.trim();

  if (!commentBody) {
    blogpostBodyEl.classList.add("is-invalid");
    blogpostBodyEl.addEventListener("change",() => {
      blogpostBodyEl.classList.remove("is-invalid");
    }, {once: true})
    return;
  } else {
    await savePost(commentBody);
  }
}

async function savePost(commentBody) {
  submitButton.innerText = "Posting ..."
  const response = await fetch('/api/comment', {
    method: 'POST',
    body: JSON.stringify({
      body: commentBody
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
    submitButton.innerText = "Posted!!"
    location.assign( location.pathname + '#comments');
  } else {
    submitButton.innerText = "Failed to Comment :(";
    blogpostBodyEl.addEventListener("change",() => {
      submitButton.innerText = "Post My Comment";
    }, {once: true})
  }
}