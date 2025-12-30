const homepage = (req, res) => {
    res.render("home");
}

const indexpage = (req, res) => {
    res.render("index");
}

export{
    homepage,
    indexpage,
};