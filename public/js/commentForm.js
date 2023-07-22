

const commentForm = document.getElementById('add-comment-form');
const blogpostId = commentForm.getAttribute("data-blogpostId");

const blogpostBodyEl = document.querySelector('#add-comment-form textarea');
const submitButton = document.getElementById('submit-comment');
commentForm.addEventListener("submit", addPost);

// const loginBtn = document.getElementById("login-btn");
// loginBtn.addEventListener("click",() =>{
//   location.href="/login";
// })

async function addPost(event) {
  event.preventDefault();
  let commentBody = blogpostBodyEl.value.trim();

  if (!commentBody) {
    blogpostBodyEl.classList.add("is-invalid");
    blogpostBodyEl.addEventListener("input",() => {
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
      body: commentBody,
      blogpostId
    }),
    headers: { 'Content-Type': 'application/json' },
  });
    const data = await response.json();
  if (response.ok && data.body && data.blogpostId && data.userId) {
    submitButton.innerText = "Posted!!";
    location.href = location.pathname + '#comments';
    location.reload();
  } else {
    console.log(data);
    submitButton.innerText = "Failed to Comment :(";
    blogpostBodyEl.addEventListener("input",() => {
      submitButton.innerText = "Post My Comment";
    }, {once: true})
  }
}