import { getUserByEmail, createUser } from '../db/users';
import * as express from 'express'; 

import { authentication, random } from '../helper';

export const register = async (req: express.Request, res: express.Response) => { 
    try { 
        // Extract registration data from request body (POST data)
        const { email, password, username } = req.body;

        // Check if any required field is missing (email, pass, username)
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        // Check if user with same email exists in the database 
        const existingUser = await getUserByEmail(email);

        // If user with same email exists, return 400 Bad Request response 
        if(existingUser) {
            return res.sendStatus(400);
        }

        // if all checks pass, create account 
        const salt = random(); // Generate random 'salt' value 
        const user = await createUser({
            email, 
            username, 
            authenticaiton: { 
                salt, 
                password: authentication(salt, password), // hash the password using salt 
            }, 
        });
        
        // send 200 OK response with the created user data in json format 
        return res.status(200).json(user).end();
    }    catch (error) {
            console.log(error); // log error to console for debugging 
            return res.sendStatus(400); // send 400 bad request 
        }
}