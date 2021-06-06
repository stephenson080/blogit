exports.getIndexPage = (req, res, next) => {
    res.render('index', {
        title: "BLOGit Home"
    })
}