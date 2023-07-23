const editPostForm = document.getElementById('edit-post-form');
const blogpostTitleEl = document.querySelector('#edit-post-form input');
const blogpostBodyEl = document.querySelector('#edit-post-form textarea');
const submitButton = document.getElementById('submit-post');
const postStatusButton = document.getElementById('post-status');

const blogpostId = editPostForm.getAttribute('data-blogpostId');

editPostForm.addEventListener("submit", addPost);

const tagChecks = document.getElementsByClassName("form-check-input");


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
  const response = await fetch('/api/blogpost/'+blogpostId, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      body
    }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (response.ok) {
    postStatusButton.innerText = "posted!!";
    location.assign('/dashboard');

  } else {
    data = await response.json();
  console.log(data);
    submitButton.innerText = "Failed to Post :(";
    submitButton.classList.remove('d-none');
  postStatusButton.classList.add('d-none');

    blogpostBodyEl.addEventListener("input",() => {
      submitButton.innerText = "Update";
    }, {once: true})
  }

}