const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

const userSchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 3 },
    email: { type: "string", format: "email" } 
  },
  required: ["username", "email"],
  additionalProperties: false
};

const validateUser = ajv.compile(userSchema);

const validateUserMiddleware = (req, res, next) => {
  const valid = validateUser(req.body);
  if (!valid) {
    return res.status(400).json({ 
      message: "invalid", 
      errors: validateUser.errors 
    });
  }
  next();
};

module.exports = { validateUserMiddleware };
