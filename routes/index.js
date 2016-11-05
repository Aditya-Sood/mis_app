var express = require('express');
var router = express.Router();
var auth = require('controllers/login');

/*
 * Routes that can be accessed by any one
 */


router.post('/login', auth.login_user);

/*
 * Routes that can be accessed only by authenticated & authorized users
*/
router.get('/api/v1/admin/users',auth.checkIt);
/*
router.get('/api/v1/admin/user/:id', user.getOne);
router.post('/api/v1/admin/user/', user.create);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);
*/


module.exports = router;
