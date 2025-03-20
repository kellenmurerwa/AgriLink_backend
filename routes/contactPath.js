import { CreateContact, getAllContact, getContactById,deleteContactById} from '../Controllers/contactController.js';
import {admin} from "../middlewares/roleIdentification.js";
import {auth} from '../middlewares/tokenVerification.js';
import express from 'express';
const contactRouter = express();

contactRouter.post('/createContact', CreateContact);
contactRouter.get('/getAllContact', auth,admin, getAllContact);
contactRouter.get('/getContactById/:id',auth,admin,  getContactById);
contactRouter.get('/deleteContactById/:id',auth,admin,  deleteContactById);

export default contactRouter;

