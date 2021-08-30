
const clearBtn = document.getElementsByClassName('clear-btn')[0]
if (clearBtn) {
  clearBtn.addEventListener('click', function () {
    document.getElementById('add-comment-btn').innerHTML = 'Comment'
    document.getElementById('comment-header').innerHTML = 'Add Comment'
    const addCommentBox = document.getElementsByClassName('add-comment')[0]
    const existCommentIdElem = addCommentBox.querySelector('[name=commentId]')
    if (existCommentIdElem) {
      existCommentIdElem.remove()
    }
    addCommentBox.querySelector('[name=name]').value = ''
    addCommentBox.querySelector('[name=body]').innerHTML = ''
    addCommentBox.querySelector('[name=email]').value = ''
  })
}

const replyBtns = document.getElementsByClassName('reply-btn')
for (let i = 0; i < replyBtns.length; i++) {
  const commentDiv = replyBtns[i].parentNode.parentNode
  const commentIdElem = commentDiv.querySelector('[name=commentId]')
  const addCommentBox = document.getElementsByClassName('add-comment')[0]
  replyBtns[i].addEventListener('click', function () {
    const existingCommentIdElem = addCommentBox.querySelector('[name=commentId]')
    const copyOfCurrentIdElem = commentIdElem.cloneNode()
    if (existingCommentIdElem) {
      existingCommentIdElem.remove()
    }
    document.getElementById('add-comment-btn').innerHTML = 'Post Reply'
    document.getElementById('comment-header').innerHTML = 'Add a Reply'
    addCommentBox.append(copyOfCurrentIdElem)
    setTimeout(function () {
      addCommentBox.scrollIntoView()
    }, 700)
  })
}
const commentBtn = document.getElementsByClassName('comment-btn')[0]
if (commentBtn) {
  const postId = commentBtn.parentNode.querySelector('[name=postId]').value
  const inp = document.querySelectorAll('.input-field input')
  const textarea = document.querySelector('.input-field textarea')
  const commentBox = document.getElementsByClassName('add-comment')[0]
  commentBtn.addEventListener('click', function () {
    let name = inp[0].value
    let email = inp[1].value
    let body = textarea.value
    let commentIdElem = commentBox.querySelector('[name=commentId]')
    addOrReplyComment(name, email, body, postId, commentIdElem)
      .then(res => {
        if (res == 'Operation Successful') {
          inp[0] = ''
          inp[1] = ''
          textarea.value = ''
          document.getElementById('add-comment-btn').innerHTML = 'Comment'
          document.getElementById('comment-header').innerHTML = 'Add Comment'
          if (commentIdElem) {
            commentIdElem.remove()
          }
        }
      })
  })
}

async function addOrReplyComment(...args) {
  const [name, email, body, postId, commentIdElem] = args
  if (commentIdElem && commentIdElem != null) {
    let commentId = commentIdElem.value
    try {
      const res = await fetch('http://localhost:3000/view-post/reply', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          email,
          name,
          body,
          commentId
        })
      })
      if (!res.ok) {
        alert('Something went wrong')
        return
      }
      const resData = await res.json()
      if (resData.message = 'Operation Successful') {
        alert('Operation Successful. You have replied to a comment')
        const replyDiv = createReplyBox(resData.reply.id, resData.reply.name, resData.reply.body, resData.reply.date, resData.reply.email)
        const commentDiv = document.getElementById(commentId)
        commentDiv.append(replyDiv)
        setTimeout(function () { replyDiv.scrollIntoView() }, 700)
        return resData.message
      }
      if (resData.message == 'Validation Failed') {
        alert(resData.message + '\n' + resData.errorDetails[0].msg)
        return resData.message
      }
      alert('Something went wrong')
      return 'Something went wrong'
    } catch (error) {
      alert(error.message)
      return error.message
    }

  }
  return fetch('http://localhost:3000/view-post/add-comment', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      body,
      postId,
      name
    })
  })
    .then(res => res.json())
    .then(resData => {
      if (resData.message == 'Operation Successful') {
        const commentBox = document.getElementsByClassName('comment-box')[0]
        const noComment = document.getElementsByClassName('nocomment')[0]
        if (noComment) {
          noComment.remove()
        }
        const div = createCommentBox(resData.comment.id, resData.comment.name, resData.comment.body, resData.comment.date, resData.comment.email)
        commentBox.appendChild(div)
        div.scrollIntoView()
        return resData.message
      }
      if (resData.message == 'Validation Failed') {
        alert(resData.message + '\n' + resData.errorDetails[0].msg)
        return resData.message
      }
      alert('Something went wrong')
      return 'Something went wrong'
    })
    .catch(err => {
      console.log(err)
      alert(err)
    })
}

function createReplyBox(id, name, body, date, email) {
  const div = document.createElement('div')
  div.classList.add('container')
  div.innerHTML = `<div class = "row">
  </div>
  <div class="row">
    <img src="img/header.jpg" class="col s2 circle" alt="reader-image">
    <div class="col s3">
        <p id = "name" class="col s12">${name}</p>
        <p class="col blue-text s12" id= "email">${email}</p>
    </div>  
      <p class="col offset-s3 offset-m3 offset-l3 s4">${date}</p>
  </div>
  <div class="row">
    <input type="hidden" value="${id}"/>
    <p class="col s12">${body}</p>
  </div>
  <hr style="border-bottom: 0.1px solid blue; background-color: transparent;" width="100%" />`
  return div
}


function createCommentBox(id, name, body, date, email) {
  const div = document.createElement('div')
  div.innerHTML = `<div class = "row">
  </div>
  <div class="row">
    <img src="img/header.jpg" class="col s2 circle" alt="reader-image">
    <div class="col s3">
    <div class="row">
        <p id = "name" class="col s12">${name}</p>
        <p class="col blue-text s12" id= "email">${email}</p>
    </div>
</div>  
      <p class="col offset-s3 offset-m3 offset-l3 s4">${date}</p>
  </div>
  <div class="row">
    <input type="hidden" value="${id}"/>
    <p class="col s12">${body}</p>
  </div>
  <div class="row">
    <i class="material-icons col s3 blue-text">reply</i>
  </div>
  <hr style="border: 0.1px solid #ccc; background-color: #ccc;" width="100%" />`
  return div
}
document.addEventListener('DOMContentLoaded', function () {
  const elems = document.querySelectorAll('.dropdown-trigger');
  console.log(elems)
  const instances = M.Dropdown.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});




var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (slides) {
    for (i = 0; i < slides.length; i++) {
      if (slides[i].style) {
        slides[i].style.display = "none";
      }

    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 4000);
  }
  // Change image every 2 seconds
}

document.addEventListener('DOMContentLoaded', function() {
  const options = {
    indicator: true
  }
  var elems = document.querySelectorAll('.carousel');
  var instances = M.Carousel.init(elems, options);
});

