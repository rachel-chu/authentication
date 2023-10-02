import express from 'express'; 

import { getUserByEmail, createUser, getUserById, getUserBySessionToken } from '../db/users';
import { random, authentication } from '../helper';
import { auth } from 'slack';


// login controller 
export const login = async (req: express.Request, res: express.Response) => { 
    try {

        // extract login informatoin 
        const { email, password } = req.body; 

        // check if there is no email or password
        if ( !email || !password) { 
            return res.sendStatus(400);
        }

        // check if email has not been registered 
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user){ 
            return res.sendStatus(400);
        }
        
        // check if password doesn't match 
        const expectedHash = authentication(user.authentication.salt, password)

        if (user.authentication.password != expectedHash) { 
            return res.status(403).send("Password or username is wrong");
        }

        // if matches then login successful and add user session
        const salt = random(); 
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        await user.save();

        res.cookie('RACHEL-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: './'})

        return res.status(200).json(user).end();


    } catch (error) { 

    }
}

// register controller 
export const register = async (req: express.Request, res: express.Response) => { 
    try { 
        // Extract registration data from request body (POST data)
        const { email, password, username } = req.body;

        // Check if any required field is missing (email, pass, username)
        if (!email || !password || !username) {
            return res.status(400).send("Missing fields");
        }

        // Check if user with same email exists in the database 
        const existingUser = await getUserByEmail(email);

        // If user with same email exists, return 400 Bad Request response 
        if(existingUser) {
            return res.status(400).send("User already exists");
        }

        // if all checks pass, create account 
        const salt = random(); // Generate random 'salt' value 
        const user = await createUser({
            email, 
            username, 
            authentication: { 
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