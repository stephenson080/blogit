const fs = require("fs")
const path = require("path")


exports.delefile = imageUrl => {
    const filePath = path.join(__dirname, '..', 'images', imageUrl)
    fs.exists(filePath, (e) => {
        if (e) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    throw err
                }
            })
        }
        return
    })
    
}

function findThreeBiggestNumbers(arr) {
    let biggest = -1;
    let secondBiggest = -1;
    let thirdBiggest = -1
    if (arr.length == 0) {
        return 'no post'
    }
    if (arr.length == 1 || arr.length == 2) {
        return [0, 1]
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].noOfComments > thirdBiggest) {
            thirdBiggest = arr[i].noOfComments;
            if (thirdBiggest > secondBiggest) {
                const temp = secondBiggest;
                secondBiggest = thirdBiggest;
                thirdBiggest = temp;
            }
            if (secondBiggest > biggest) {
                const temp = biggest
                biggest = secondBiggest
                secondBiggest = temp
            }
        }
    }

    return [biggest, secondBiggest, thirdBiggest]
}

exports.getHotPosts = (posts) => {
    const nums = findThreeBiggestNumbers(posts)
    let hotPosts = []
    if (nums == 'no post') {
        return hotPosts
    }
    if (nums.length == 2) {
        hotPosts = [...posts]
        return hotPosts
    }
    for (let i = 0; i <= 2; i++) {
        const post = posts.find(post => post.noOfComments == nums[i])
        hotPosts.push(post)
    }
    return hotPosts
}



