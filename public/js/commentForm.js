

const commentForm = document.getElementById('add-comment-form');
const commentInput = document.querySelector('#add-comment-form textarea');
const submitButton = document.querySelector('.submit-btn');
commentForm.addEventListener("submit", addComment);


async function addComment(event) {
  let commentBody = commentInput.value.trim();

  if (!commentBody) {
    commentInput.classList.add("is-invalid");
    commentInput.addEventListener("change",() => {
      commentInput.classList.remove("is-invalid");
    }, {once: true})
    return;
  } else {
    await saveComment(commentBody);
  }
}

async function saveComment(commentBody) {
  submitButton.innerText = "Posting ..."
  const response = await fetch('/api/comment', {
    method: 'POST',
    body: JSON.stringify(
      commentBody
    ),
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
    submitButton.innerText = "Posted!!"
  } else {
    submitButton.innerText = "Failed to Comment :(";
    commentInput.addEventListener("change",() => {
      submitButton.innerText = "Post My Comment";
    }, {once: true})
  }
}