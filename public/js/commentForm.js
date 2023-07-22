

const commentForm = document.getElementById('add-comment-form');
const blogpostId = commentForm.getAttribute("data-blogpostId");

const commentBodyEl = document.querySelector('#add-comment-form textarea');
const submitButton = document.getElementById('submit-comment');
commentForm.addEventListener("submit", addPost);

const allComments = document.querySelectorAll('.list-group-item.comment');

// const loginBtn = document.getElementById("login-btn");
// loginBtn.addEventListener("click",() =>{
//   location.href="/login";
// })

const editIcons = document.querySelectorAll('.icon.edit');
editIcons.forEach(function(icon) {
  let commentId = icon.getAttribute('data-commentId');
  icon.addEventListener("click", () => {
    clearCommentEditors();
    let original = document.getElementById('comment-'+commentId);
    original.classList.add('d-none');
    let originalText = original.innerText;

    let editCommentForm = document.createElement('form');
    editCommentForm.setAttribute('id','edit-comment-form');
    editCommentForm.setAttribute('data-commentId',commentId);
    editCommentForm.innerHTML = `
    <div class="form-group">
      <label for="comment-textarea">Edit comment</label>
      <textarea class="form-control" id="edit-comment-textarea" rows="3">${originalText}</textarea>
     <div class="invalid-feedback">
        Comment must not be blank
      </div>
    </div>
    <button type="submit" id="update-comment" class="btn">Update My Comment</button>`
    icon.parentElement.append(editCommentForm);
    editCommentForm.addEventListener('submit',editPost)

  })
});

const delIcons = document.querySelectorAll('.icon.delete');
delIcons.forEach(function(icon) {
  let commentId = icon.getAttribute('data-commentId');
  icon.addEventListener("click", async function() {
    if (confirm("Do you want to delete your comment?")) {
      const response = await fetch(`/api/comment/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        location.reload();
      } else {
        alert('Failed to delete comment');
      }
    }
  });
});

async function addPost(event) {
  event.preventDefault();
  let commentBody = blogpostBodyEl.value.trim();

  if (!commentBody) {
    commentBodyEl.classList.add("is-invalid");
    commentBodyEl.addEventListener("input",() => {
      commentBodyEl.classList.remove("is-invalid");
    }, {once: true})
    return;
  } else {
    await savePost(commentBody);
  }
}

async function editPost(event) {
  event.preventDefault();

  let commentId = event.currentTarget.getAttribute('data-commentId');
  console.log(commentId)

  let commentBody = document.getElementById("edit-comment-textarea").value.trim();

  if (!commentBody) {
    commentBodyEl.classList.add("is-invalid");
    commentBodyEl.addEventListener("input",() => {
      commentBodyEl.classList.remove("is-invalid");
    }, {once: true})
    return;
  } else {
    await updatePost(commentBody,commentId);
  }
}

async function savePost(commentBody) {
  submitButton.innerText = "Posting ..."
  const response = await fetch('/api/comment', {
    method: 'POST',
    body: JSON.stringify({
      body: commentBody,
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
    commentBodyEl.addEventListener("input",() => {
      submitButton.innerText = "Post My Comment";
    }, {once: true})
  }
}


async function updatePost(commentBody,commentId) {
  let updateButton = document.getElementById('update-comment');
  updateButton.innerText = "Posting ..."
  const response = await fetch('/api/comment/'+commentId, {
    method: 'PUT',
    body: JSON.stringify({
      body: commentBody,
      blogpostId
    }),
    headers: { 'Content-Type': 'application/json' },
  });
    const data = await response.json();
  if (response.ok) {
    updateButton.innerText = "Posted!!";
    location.href = location.pathname + '#comments';
    location.reload();
  } else {
    console.log(data);
    updateButton.innerText = "Failed to Comment :(";
    document.getElementById('edit-comment-textarea').addEventListener("input",() => {
      updateButton.innerText = "Update My Comment";
    }, {once: true})
  }
}

function clearCommentEditors() {
  allComments.forEach((item) => {
    let form = item.querySelector('form');
    if (form) {form.remove();}
    let original = item.querySelector('.comment-body');
    original.classList.remove('d-none');
  })
}