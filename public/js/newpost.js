const newPostForm = document.getElementById('new-post-form');
const blogpostTitleEl = document.querySelector('#new-post-form input');
const blogpostBodyEl = document.querySelector('#new-post-form textarea');
const submitButton = document.querySelector('.submit-btn');
newPostForm.addEventListener("submit", addPost);


async function addPost(event) {
  event.preventDefault();

  let blogpostBody = blogpostBodyEl.value.trim();
  let blogpostTitle = blogpostTitleEl.value.trim();

  if (!blogpostBody || !blogpostTitle) {
    if (!blogpostTitle) {
      blogpostTitleEl.classList.add("is-invalid");
      blogpostTitleEl.addEventListener("change",() => {
        blogpostTitleEl.classList.remove("is-invalid");
      }, {once: true})
    }
    if (!blogpostBody) {
      blogpostBodyEl.classList.add("is-invalid");
      blogpostBodyEl.addEventListener("change",() => {
        blogpostBodyEl.classList.remove("is-invalid");
      }, {once: true})
    }
    return;

  } else {
    await savePost(blogpostTitle,blogpostBody);
  }
}

async function savePost(title,body) {
  submitButton.innerText = "Posting ..."
  const response = await fetch('/api/blogpost', {
    method: 'POST',
    body: JSON.stringify({
      title,
      body
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
    submitButton.innerText = "Posted!!";
    location.assign('/blogpost/'+response.body.id);
  } else {
    console.log(response)
    submitButton.innerText = "Failed to Post :(";
    blogpostBodyEl.addEventListener("change",() => {
      submitButton.innerText = "Submit";
    }, {once: true})
  }
}