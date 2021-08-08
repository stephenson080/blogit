document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

const close = document.getElementsByClassName('closebtn')[0]
if (close){
    close.addEventListener('click', function() {
        close.parentElement.style.opacity = '0'
        setTimeout(function() {
            close.parentElement.style.display = 'none';
        }, 700)
        
    })
}

const postbtns = document.getElementsByClassName('postbtn')
const path = window.location.pathname.split('/')
for (let i = 0; i< postbtns.length; i++) {
    postbtns[i].addEventListener('click', function(){
        console.log(postbtns[i])
        const postId = postbtns[i].parentNode.querySelector('[name=postId]').value
        const postCon = postbtns[i].closest('article')
        const post = {postId: postId }
        fetch('http://localhost:3000/dashboard/posts/delete-post', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
        .then(res => res.json())
        .then(resData => {
            console.log(resData)
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
