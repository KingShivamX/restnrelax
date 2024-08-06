// this is costome error.

class ExpressError extends Error {
    constructor(status, message){ // getting status code and message
        super();
        this.status = status;  // replacinng with our one in "Error"
        this.message = message;
    };
};

module.exports = ExpressError; // exporting an class.