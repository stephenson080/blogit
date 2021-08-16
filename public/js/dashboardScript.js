let editMode = false
const clearBtn = document.getElementsByClassName('clear-btn')[0]
if (clearBtn) {
    clearBtn.addEventListener('click', function () {
        const addCommentBox = document.getElementsByClassName('add-comment')[0]
        const existCommentIdElem = addCommentBox.querySelector('[name=commentId]')
        if (existCommentIdElem) {
            existCommentIdElem.remove()
        }
        addCommentBox.querySelector('[name=body]').innerHTML = ''
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
        addCommentBox.append(copyOfCurrentIdElem)
        setTimeout(function () {
            addCommentBox.scrollIntoView()
        }, 700)
    })
}

const close = document.getElementsByClassName('closebtn')[0]
if (close) {
    close.addEventListener('click', function () {
        close.parentElement.style.opacity = '0'
        setTimeout(function () {
            close.parentElement.style.display = 'none';
        }, 700)
    })
}

const postbtns = document.getElementsByClassName('post-btn')
const path = window.location.pathname.split('/')
for (let i = 0; i < postbtns.length; i++) {
    postbtns[i].addEventListener('click', function () {
        const postId = postbtns[i].parentNode.querySelector('[name=postId]').value
        const postCon = postbtns[i].closest('article')
        const post = { postId: postId }
        fetch('http://localhost:3000/dashboard/posts/delete-post', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.message == 'Post Successfully Deleted') {
                    if (path[3] == 'view-post') {
                        window.location.href = 'http://localhost:3000/dashboard/posts/all-posts'
                        return
                    }
                    postCon.parentNode.removeChild(postCon)
                }
            })
            .catch(err => console.log(err))
    })
}
// const deleteBtnInPostDetailsPage = document.getElementsByClassName('delete-btn')[0]
// if (deleteBtnInPostDetailsPage){
//     deleteBtnInPostDetailsPage.addEventListener('click', function() {
//         const btnContainer = deleteBtnInPostDetailsPage.parentNode
//         const postId = btnContainer.querySelector('[name=postId]').value
//     })
// }
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
        const res = addOrReplyOrEditComment(name, email, body, postId, commentIdElem)
        if (res == 'Operation Successful') {
            inp[0] = ''
            inp[1] = ''
            textarea.value = ''
            if (commentIdElem) {
                commentIdElem.remove()
            }
        }
    })
}

async function addOrReplyOrEditComment(...args) {
    const [name, email, body, postId, commentIdElem] = args
    if (commentIdElem && commentIdElem != null) {
        let commentId = commentIdElem.value
        if (editMode) {
            console.log(commentId, editMode, body, email, name)
            try {
                const res = await fetch('http://localhost:3000/dashboard/posts/edit-comment', {
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
                    return 'Something went wrong'
                }

                const resData = await res.json()
                if (resData.message == 'Operation Successful') {
                    alert('Operation Successful. You have replied to a comment')
                    const editedDiv = createCommentBox(resData.comment.id, resData.comment.name, resData.comment.body, resData.comment.date, resData.comment.email)
                    const commentBox = document.getElementsByClassName('comment-box')[0]
                    const oldCommentDiv = commentBox.getElementsByClassName(`${resData.comment.id}`)[0]
                    oldCommentDiv.replaceWith(editedDiv)
                    editMode = false
                    setTimeout(function () { editedDiv.scrollIntoView() }, 700)
                    return resData.message
                }
                if (resData.message == 'Validation Failed') {
                    alert(resData.message + '\n' + resData.errorDetails[0])
                    return resData.message
                }
                alert('Something went wrong')
                return 'Something went wrong'
            } catch (error) {
                alert(error.message)
                return error.message
            }
        }
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
                return 'Something went wrong'
            }
            const resData = await res.json()
            if (resData.message == 'Operation Successful') {
                alert('Operation Successful. You have replied to a comment')
                const replyDiv = createReplyBox(resData.reply.id, resData.reply.name, resData.reply.body, resData.reply.date, resData.reply.email)
                const commentDiv = document.getElementById(commentId)
                commentDiv.append(replyDiv)
                setTimeout(function () { replyDiv.scrollIntoView() }, 700)
                return resData.message
            }
            if (resData.message == 'Validation Failed') {
                alert(resData.message + '\n' + resData.errorDetails[0])
                return resData.message
            }
            alert('Something went wrong')
            return 'Something went wrong'
        } catch (error) {
            alert(error.message)
            return error.message
        }

    }
    fetch('http://localhost:3000/view-post/add-comment', {
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
                alert(resData.message + '\n' + resData.errorDetails[0])
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

const editCommentBtn = document.getElementsByClassName('edit-btn')
if (editCommentBtn) {
    for (let i = 0; i < editCommentBtn.length; i++) {
        editCommentBtn[i].addEventListener('click', function () {
            const commentContainer = editCommentBtn[i].parentNode.parentNode
            const body = commentContainer.querySelector('#body').innerHTML
            const currentCommentIdElem = commentContainer.querySelector('[name=commentId]')
            const copyOfCurrentIdElem = currentCommentIdElem.cloneNode()
            const addCommentBox = document.getElementsByClassName('add-comment')[0]

            const existingCommentIdElem = addCommentBox.querySelector('[name=commentId]')
            addCommentBox.querySelector('[name=body]').innerHTML = body
            editMode = true
            if (existingCommentIdElem) {
                existingCommentIdElem.remove()
            }
            addCommentBox.append(copyOfCurrentIdElem)
            setTimeout(function () {
                addCommentBox.scrollIntoView()
            }, 800)

        })
    }
}

function createCommentBox(id, name, body, date, email) {
    const div = document.createElement('div')
    div.classList.add = id
    editMode ? div.innerHTML = `<div class = "row">
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
        <input name= "commentId" type="hidden" value="${id}"/>
        <p class="col s3 blue-text reply-btn" style="cursor: pointer; font-size: xx-smaller !important;"><i  class="material-icons tiny left">reply</i>Reply</p>
        <p style="font-size: xx-small; cursor: pointer;" class="col s4 blue-text edit-btn"><i class="material-icons left">edit</i>Edit</p>
        <p style="font-size: xx-small; cursor: pointer;" class="col s4 red-text delete-btn"><i class="material-icons left">delete</i>Delete</p>
    </div>
    </div>` : div.innerHTML = `<div class = "row">
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
        <input name= "commentId" type="hidden" value="${id}"/>
        <p class="col s3 blue-text reply-btn" style="cursor: pointer; font-size: xx-smaller !important;"><i  class="material-icons tiny left">reply</i>Reply</p>
        <p style="font-size: xx-small; cursor: pointer;" class="col s4 blue-text edit-btn"><i class="material-icons left">edit</i>Edit</p>
        <p style="font-size: xx-small; cursor: pointer;" class="col s4 red-text delete-btn"><i class="material-icons left">delete</i>Delete</p>
    </div>
    <hr style="border: 0.1px solid #ccc; background-color: #ccc;" width="100%" />`
    return div
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});
