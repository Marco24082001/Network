const { verify } = require("jsonwebtoken");
// import jwt_decode from "jwt-decode";
const jwt_decode = require('jwt-decode');


const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    // console.log(jwt_decode(accessToken));
    // console.log(accessToken)
    // if (!accessToken) return res.json({ error: "User not logged in!" });
    try {
        if(accessToken == 'None'){
            req.user = { role: 'GUEST'}
        } else {
            req.user = jwt_decode(accessToken);
        }
        // const validToken = verify(accessToken, process.env.KEY_SIGN);
        return next();
    } catch (err) {
        return res.json({ error: err });
    }
}

module.exports = { validateToken };