var { check, validationResult } = require('express-validator');

const nameRule = check('name')
.not().isEmpty().withMessage("The name should be filled!");

const fileRule = check('file')
.custom((value, { req, loc, path }) => {
    if(req.files == null || req.files == undefined || typeof(req.files) === undefined){
        throw new Error('The file has not to be empty!');
    }
    if(!(req.files.file.name.includes(".pnml") || req.files.file.name.includes(".xml") || req.files.file.name.includes(".mxml"))){
        throw new Error('The file should be PNML, XML or MXML!');
    }
    return req.files.file;
});


const validationRule1= () => { return [ nameRule, fileRule ] }
  
const validationRule2 = () => {
    return [
        nameRule,
        check('file')
      	.custom((value, { req, loc, path }) => {
          if(req.files == null || req.files == undefined || typeof(req.files) === undefined){
              throw new Error('The file has not to be empty!');
          }
          if(!(req.files.file.name.includes(".pnml") || req.files.file.name.includes(".xml") || req.files.file.name.includes(".mxml"))){
              throw new Error('The file should be PNML, XML or MXML!');
          }
          return req.files.file;
      })
    ]
}
  
const validate = (req, res, next) => {
    const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ 'msg': err.msg }))

  return res.status(422).json({
    'errors': extractedErrors,
  })
}
  
module.exports = {
    validationRule1,
    validationRule2,
    validate
}