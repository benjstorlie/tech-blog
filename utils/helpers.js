const Handlebars = require("handlebars");
const dayjs = require('dayjs');

const colors = ["primary","success","danger","info"];

module.exports = {
  format_date: (dateTime) => {
    // Format date as at hh:mm on dd MM YYYY 
    return dayjs(dateTime).format("[at] h:mm a [on] D MMM YYYY");
  },
  edited_at: (createDate,updateDate) => {
    createDate = dayjs(createDate);
    updateDate = dayjs(updateDate);
    let edited = !createDate.isSame(updateDate);
    if (edited) {
      return ` (edited at ${updateDate.format("h:mm a [on] D MMM YYYY")})`
    } else {
      return ''
    }
  },
  // is_selected: (tags,tagId) => {
    
  //       {
  //       return 'checked';
  //      }

  // },
  user_link: (user) => {
    return new Handlebars.SafeString(`<a class="username" href='/user/${user.id}'>${user.username}</a>`);
  },
  tag_link: (tag) => {
    const color = colors[tag.id % 4];
    return new Handlebars.SafeString(`<a href='/tag/${tag.id}' class='badge badge-pill badge-${color}'>${tag.tagName}</a> `);
  },
  blogpost_title_link: (blogpost) => {
    return new Handlebars.SafeString(`<a class="blogpost-title-link" href="/blogpost/${blogpost.id}">${blogpost.title}</a>`);
  },
  blogpost_comment_count_link: (blogpost) => {
    return new Handlebars.SafeString(`<a class="comment-link" href="/blogpost/${blogpost.id}">${blogpost.commentCount} Comment${blogpost.commentCount == 1 ? '' : 's'}</a>`);
  },
  blogpost_page_comment_count: (blogpost) => {
    return new Handlebars.SafeString(`<a class="comment-link" href="/blogpost/${blogpost.id}#comments">${blogpost.commentCount} Comment${blogpost.commentCount == 1 ? '' : 's'}</a>`);
  },
  pagination: (blogpostCount,page) => {
    if (blogpostCount <= 5) {
      return '';
    }
    page = Number(page);
    let html = '';
    if (page == 1) {
    html = html + `<li class="page-item disabled">
      <span class="page-link">Previous</span>
    </li>`
    } else {
      html = html + `<li class="page-item"><a class="page-link" href="/?page=${page-1}">Previous</a></li>`
    }
    const lastPage = Math.ceil(blogpostCount/5);
    for (let p = 1; p <= lastPage; p++) {
      if (p == page) {
        html = html + `<li class="page-item active">
        <span class="page-link"> ${p} <span class="sr-only">(current)</span>
        </span>
      </li>`
      } else {
        html = html + `<li class="page-item"><a class="page-link" href="/?page=${p}">${p}</a></li>`
      }
    }
    if (page == lastPage) {
      html = html + `<li class="page-item disabled">
      <span class="page-link">Next</span>
    </li>`
    } else {
      html = html + `<li class="page-item">
      <a class="page-link" href="/?page=${page+1}">Next</a>
    </li>`
    }
    return new Handlebars.SafeString(html);
  }
};
