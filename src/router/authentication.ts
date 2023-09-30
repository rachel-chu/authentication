import * as express from 'express'; 

import authentication from './authentication';

import { register } from '../controllers/authentication'; 

export default (router: express.Router) => { 
    router.post('/auth/register', register);
}