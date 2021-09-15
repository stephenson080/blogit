const headers = {
        'Content-Type': 'application/json'
}
const baseUrl = 'https://blogit-web.herokuapp.com'

const deleteUserbtn = document.getElementsByClassName('delete-user')
if (deleteUserbtn) {
    for (let i = 0; i < deleteUserbtn.length; i++) {
        deleteUserbtn[i].addEventListener('click', async function() {
            try {
                const userId = deleteUserbtn[i].parentNode.querySelector('[name=userId]').value
                // console.log(userId) 
                const res = await fetch(`${baseUrl}/admin/users/delete-user/${userId}`, {
                    headers: headers,
                    method: 'DELETE'
                })
                if (!res.ok){
                    throw new Error('Somthing went wrong')
                }
                const resData = await res.json()
                if (resData.message == 'Operation Successful') {
                    alert(resData.message)
                    return
                }
                alert(resData.message)
            } catch (error) {
                alert(error.message)
            }
        }) 
    }
}
const approveUserbtn = document.getElementsByClassName('approve-user')
if (approveUserbtn) {
    for (let i =0; i< approveUserbtn.length; i++) {
        approveUserbtn[i].addEventListener('click', async function() {
            const userId = approveUserbtn[i].parentNode.querySelector('[name=userId]').value
            console.log(userId)
            try {
                const res = await fetch(`${baseUrl}/admin/users/approve-user/${userId}`, {
                    headers: headers,
                    method: 'POST'
                })
                if (!res.ok) {
                    throw new Error('Somthing went wrong. try again')
                }

                const resData = await res.json()
                if (resData.message == 'Operation Successful') {
                    alert('You have successfully approve a user')
                    return
                }
                alert('Somthing went wrong')
            } catch (error) {
                alert(error.message)
            }
        })
    }
}

const deleteCatBtn = document.getElementsByClassName('delete-cat')
if (deleteCatBtn){
    for (let i = 0; i < deleteCatBtn.length; i++) {
        deleteCatBtn[i].addEventListener('click', async function() {
            const categoryCon = deleteCatBtn[i].parentNode.parentNode.parentNode
            const categoryId = +deleteCatBtn[i].parentNode.querySelector('[name=categoryId]').value
            try {
                const res = await fetch(`http://localhost:3000/admin/categories/delete-category/${categoryId}`, {
                    headers: headers,
                    method: 'DELETE'
                })
                if (!res.ok) {
                    throw new Error('Something went wrong')
                }
                const resData = await res.json()
                if (resData.message == 'Operation Successful'){
                    alert('Category Deleted Successfully')
                    categoryCon.remove()
                }
            } catch (error) {
                alert('Something went wrong')
            }
        })
    }
}

const approveBtn = document.getElementsByClassName('approve')[0]
if (approveBtn) {
    approveBtn.addEventListener('click', async function () {
        const postId = approveBtn.parentNode.querySelector('[name=postId]').value
        try {
            const res = await fetch(`http://localhost:3000/admin/posts/approve-post/${postId}`, {
                method: 'POST',
                headers: headers
            })
            if (!res.ok) {
                throw new Error('Something went wrong. Please try again')
            }
            const resData = await res.json()
            if (resData.message == 'Operation Successful') {
                approveBtn.innerHTML = 'Approved'
                return alert('You Have Approve the Post')
            }
            return alert('Something went wrong. Please try again')
        } catch (error) {
            alert(error.message)
        }
    })
}

let editMode = false
let editReplyMode = false

const cancelBtn = document.getElementsByClassName('cancel-btn')[0]
if(cancelBtn){
    cancelBtn.addEventListener('click', function(){
        const prtNode = cancelBtn.parentNode.parentNode.parentNode
        prtNode.querySelector('[name=name]').value = ''
        prtNode.querySelector('[name=imageUrl]').value = ''
    })
}
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
        document.getElementById('add-comment-btn').innerHTML = 'Post Reply'
        document.getElementById('comment-header').innerHTML = 'Add a Reply'
        addCommentBox.append(copyOfCurrentIdElem)
        setTimeout(function () {
            addCommentBox.scrollIntoView()
        }, 700)
    })
}

const deleteCommentbtns = document.getElementsByClassName('delete-comment-btn')
if (deleteCommentbtns) {
    for (let i = 0; i < deleteCommentbtns.length; i++) {
        deleteCommentbtns[i].addEventListener('click', async function (){
            const commentId = deleteCommentbtns[i].parentNode.querySelector('[name=commentId]').value
            const proceed = confirm('Do you want Delete this Comment?')
            if (!proceed) {
                return
            }
            try {
                const res = await fetch(`http://localhost:3000/dashboard/posts/delete-comment/${commentId}`, {
                    headers: headers,
                    method: 'DELETE'
                })

                if (!res.ok) {
                    alert('Something went wrong')
                    return 'Something went wrong'
                }
                const resData = await res.json()
                if (resData.message == 'Operation Successful') {
                    alert('Operation Successful. You have deleted Your Comment')
                    location.reload()
                }

            } catch (error) {
                alert('Something went wrong.' + error.message)
            }
        })
    }
}

const deleteReplybtns = document.getElementsByClassName('delete-reply-btn')
if (deleteReplybtns) {
    for (let i = 0; i < deleteReplybtns.length; i++) {
        deleteReplybtns[i].addEventListener('click', async function (){
            const commentId = deleteReplybtns[i].parentNode.querySelector('[name=commentId]').value
            const proceed = confirm('Do you want Delete this Comment?')
            if (!proceed) {
                return
            }
            try {
                const res = await fetch(`http://localhost:3000/dashboard/posts/delete-reply/${commentId}`, {
                    headers: headers,
                    method: 'DELETE'
                })

                if (!res.ok) {
                    alert('Something went wrong')
                    return 'Something went wrong'
                }
                const resData = await res.json()
                if (resData.message == 'Operation Successful') {
                    alert('Operation Successful. You have deleted Your Comment')
                    location.reload()
                }

            } catch (error) {
                alert('Something went wrong.' + error.message)
            }
        })
    }
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
        fetch(`${basicUrl}/dashboard/posts/delete-post`, {
            method: "DELETE",
            headers: headers,
            body: JSON.stringify(post)
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.message == 'Post Successfully Deleted') {
                    if (path[3] == 'view-post') {
                        window.location.href = `${basicUrl}/dashboard/posts/all-posts`
                        return
                    }
                    postCon.parentNode.removeChild(postCon)
                }
            })
            .catch(err => {
                alert(err.message)
            })
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
        addOrReplyOrEditComment(name, email, body, postId, commentIdElem)
            .then(res => {
                if (res == 'Operation Successful') {
                    document.getElementById('add-comment-btn').innerHTML = 'Comment'
                    document.getElementById('comment-header').innerHTML = 'Add Comment'
                    inp[0] = ''
                    inp[1] = ''
                    textarea.value = ''
                    if (commentIdElem) {
                        commentIdElem.remove()
                    }
                }
            })

    })
}

async function addOrReplyOrEditComment(...args) {
    const [name, email, body, postId, commentIdElem] = args
    if (commentIdElem && commentIdElem != null) {
        let commentId = commentIdElem.value
        if (editMode) {
            try {
                const res = await fetch(`${basicUrl}/dashboard/posts/edit-comment`, {
                    headers: headers,
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
                    alert('Operation Successful. You have edited your  comment')
                    const editedDiv = createCommentBox(resData.comment.id, resData.comment.name, resData.comment.body, resData.comment.date, resData.comment.email)
                    const commentBox = document.getElementsByClassName('comment-box')[0]
                    const oldCommentDiv = commentBox.getElementsByClassName(`${resData.comment.id}`)[0]
                    oldCommentDiv.replaceWith(editedDiv)
                    editMode = false
                    setTimeout(function () { editedDiv.scrollIntoView() }, 700)
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
        if (editReplyMode) {
            try {
                const res = await fetch(`${basicUrl}/dashboard/posts/edit-reply`, {
                    headers: headers,
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
                    alert('Operation Successful. You have edit your comment')
                    editReplyMode = false
                    location.reload()
                    return
                    // const replyDiv = createReplyBox(resData.reply.id, resData.reply.name, resData.reply.body, resData.reply.date, resData.reply.email)
                    // const commentDiv = document.getElementById(commentId)
                    // commentDiv.append(replyDiv)
                    // setTimeout(function () { replyDiv.scrollIntoView() }, 700)
                    // return resData.message
                }
                if (resData.message == 'Validation Failed') {
                    alert(resData.message + '\n' + resData.errorDetails[0])
                    return resData.message
                }
            } catch (error) {
                alert(error.message)
                return error.message
            }
        }
        try {
            const res = await fetch(`${baseUrl}view-post/reply`, {
                headers: headers,
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
                location.reload()
                return
                // const replyDiv = createReplyBox(resData.reply.id, resData.reply.name, resData.reply.body, resData.reply.date, resData.reply.email)
                // const commentDiv = document.getElementById(commentId)
                // commentDiv.append(replyDiv)
                // setTimeout(function () { replyDiv.scrollIntoView() }, 700)
                // return resData.message
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
    return fetch(`${baseUrl}/view-post/add-comment`, {
        headers: headers,
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
                alert('Operation Successful. You have added a comment')
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
            alert(err)
            return err.message
        })
}

const editReplyBtn = document.getElementsByClassName('edit-reply-btn')
if (editReplyBtn) {
    for (let i = 0; i < editReplyBtn.length; i++) {
        editReplyBtn[i].addEventListener('click', function () {
            document.getElementById('add-comment-btn').innerHTML = 'Submit'
            document.getElementById('comment-header').innerHTML = 'Edit Your Reply'
            const commentContainer = editReplyBtn[i].parentNode
            const body = commentContainer.parentNode.querySelector('#body').innerHTML
            const currentCommentIdElem = commentContainer.querySelector('[name=commentId]')
            const copyOfCurrentIdElem = currentCommentIdElem.cloneNode()
            const addCommentBox = document.getElementsByClassName('add-comment')[0]
            const existingCommentIdElem = addCommentBox.querySelector('[name=commentId]')
            addCommentBox.querySelector('[name=body]').innerHTML = body
            editReplyMode = true
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
const editCommentBtn = document.getElementsByClassName('edit-btn')
if (editCommentBtn) {
    for (let i = 0; i < editCommentBtn.length; i++) {
        editCommentBtn[i].addEventListener('click', function () {
            document.getElementById('add-comment-btn').innerHTML = 'Submit'
            document.getElementById('comment-header').innerHTML = 'Edit Your Comment'
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
    div.classList.add(id)
    if (editMode) {
        div.innerHTML = `<div class = "row">
    <div>
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
            <p class="col s12">${body}</p>
        </div>
        <div class="row">
            <input name= "commentId" type="hidden" value="${id}"/>
            <p class="col s3 blue-text reply-btn" style="cursor: pointer; font-size: xx-smaller !important;"><i  class="material-icons tiny left">reply</i>Reply</p>
            <p style="font-size: xx-small; cursor: pointer;" class="col s4 blue-text edit-btn"><i class="material-icons left">edit</i>Edit</p>
            <p style="font-size: xx-small; cursor: pointer;" class="col s4 red-text delete-btn"><i class="material-icons left">delete</i>Delete</p>
        </div>
    </div>
    </div>`
        return div
    }
    div.innerHTML = `<div class = "row">
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
      <input type="hidden" name ="commentId" value="${id}"/>
      <p class="col s12">${body}</p>
    </div>
    </div>
    </div>`
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