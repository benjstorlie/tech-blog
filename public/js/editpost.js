const editPostForm = document.getElementById('edit-post-form');
const blogpostTitleEl = document.querySelector('#edit-post-form input');
const blogpostBodyEl = document.querySelector('#edit-post-form textarea');
const submitButton = document.getElementById('submit-post');
const postStatusButton = document.getElementById('post-status');

const blogpostId = editPostForm.getAttribute('data-blogpostId');

const newTagEl = document.getElementById("new-tag");
const newTagCol = document.getElementById("new-tag-col");
const tagsRow = document.getElementById("tags-row"); 

submitButton.addEventListener("click", addPost);

blogpostTitleEl.addEventListener("keydown",(event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
})

const tagList = document.getElementById("tag-list")
const tagChecks = document.querySelectorAll(".tag-check");

tagChecks.forEach((tagEl) => {
    let tagId = tagEl.getAttribute('data-tagId');
  tagEl.addEventListener("change",() => {
    if (tagEl.checked) {
      document.getElementById("badge-"+tagId).classList.remove("d-none");
    } else {
      document.getElementById("badge-"+tagId).classList.add("d-none");
    }
  })
});

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

    let tagIds = [];
    document.querySelectorAll('.tag-check').forEach((tagEl) => {
      let tagId = tagEl.getAttribute('data-tagId');
      if (tagEl.checked) {
        tagIds.push(tagId);
      }
    })

    await savePost(blogpostTitle,blogpostBody,tagIds);
  }
}

async function savePost(title,body,tagIds) {
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
    const tagResponse = await fetch('/api/blogpost/tags/'+blogpostId, {
      method: 'PUT',
      body: JSON.stringify({
        tagIds
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (tagResponse.ok) {
      success();
    } else {
      let data = await tagResponse.json();
  console.log(data);
   failedToPost();
    }

  } else {
    let data = await response.json();
  console.log(data);
   failedToPost();
  }

}

function success() {
  postStatusButton.innerText = "posted!!";
    location.assign('/dashboard');
}

function failedToPost() {
  submitButton.innerText = "Failed to Post :(";
  submitButton.classList.remove('d-none');
postStatusButton.classList.add('d-none');

  blogpostBodyEl.addEventListener("input",() => {
    submitButton.innerText = "Update";
  }, {once: true})
}



const colors = ["primary","success","danger","info"];

newTagEl.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    const tagName = newTagEl.value.trim();
    const response = await fetch('/api/tag', {
      method: 'POST',
      body: JSON.stringify({
        tagName
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (response.ok) {
      newTagEl.value = "";
      console.log(data);
      let tagId = data.id;
      let tagColor = colors[tagId % 4];
      let tagCheck = document.createElement("div");
      tagCheck.classList.add("col-auto");
      tagCheck.innerHTML = `
      <div class="form-check">
        <input class="form-check-input tag-check" type="checkbox" id="tag-${tagId}" data-tagId="${tagId}" checked>
        <label class="form-check-label" for="tag-${tagId}">
          ${tagName}
        </label>
      </div>`

      

      let tagBadge = document.createElement("span");
      tagBadge.classList.add("badge");
      tagBadge.classList.add("badge-pill");
      tagBadge.classList.add("badge-"+tagColor);
      tagBadge.innerText = tagName;
      tagBadge.setAttribute("id","badge-"+tagId);

      tagsRow.insertBefore(tagCheck,newTagCol);
      tagList.append(tagBadge);

      document.getElementById("tag-"+tagId).addEventListener("change",(event) => {
    if (event.target.checked) {
      document.getElementById("badge-"+tagId).classList.remove("d-none");
    } else {
      document.getElementById("badge-"+tagId).classList.add("d-none");
    }
  });

    } else {
      console.log(data);
    }
  }
});