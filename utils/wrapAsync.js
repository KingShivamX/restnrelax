// this is try catch block

// this line is exporting an function.
// we can name this function whatever we want while requiring.
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};