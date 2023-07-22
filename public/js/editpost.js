const newPostForm = document.getElementById('new-post-form');
const blogpostTitleEl = document.querySelector('#new-post-form input');
const blogpostBodyEl = document.querySelector('#new-post-form textarea');
const submitButton = document.getElementById('submit-post');
const postStatusButton = document.getElementById('post-status');
newPostForm.addEventListener("submit", addPost);


async function addPost(event) {
  event.preventDefault();

  let blogpostBody = blogpostBodyEl.value.trim();
  let blogpostTitle = blogpostTitleEl.value.trim();

  if (!blogpostBody || !blogpostTitle) {
    if (!blogpostTitle) {
      blogpostTitleEl.classList.add("is-invalid");
      blogpostTitleEl.addEventListener("input",() => {
        blogpostTitleEl.classList.remove("is-invalid");
      }, {once: true})
    }
    if (!blogpostBody) {
      blogpostBodyEl.classList.add("is-invalid");
      blogpostBodyEl.addEventListener("input",() => {
        blogpostBodyEl.classList.remove("is-invalid");
      }, {once: true})
    }
    return;

  } else {
    await savePost(blogpostTitle,blogpostBody);
  }
}

async function savePost(title,body) {
  submitButton.classList.add('d-none');
  postStatusButton.classList.remove('d-none');
  const response = await fetch('/api/blogpost', {
    method: 'POST',
    body: JSON.stringify({
      title,
      body
    }),
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await response.json();
  if (response.ok && data.body && data.title && data.userId) {
    postStatusButton.innerText = "posted!!";
    location.assign('/dashboard');

  } else {
  console.log(data);
    submitButton.innerText = "Failed to Post :(";
    submitButton.classList.remove('d-none');
  postStatusButton.classList.add('d-none');

    blogpostBodyEl.addEventListener("input",() => {
      submitButton.innerText = "Submit";
    }, {once: true})
  }

}