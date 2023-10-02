import * as crypto from 'crypto'; // generate cryptographic functionality

const SECRET = 'RACHEL-REST-API';

export const random = () => crypto.randomBytes(128).toString('base64'); 
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}; 