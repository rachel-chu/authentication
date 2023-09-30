import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as mongoose from 'mongoose';

import * as router from './router/router';

const app = express();

app.use(cors({
    credentials: true,
})); 

app.use(compression()); 
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app); 

server.listen(8080, () => {
    console.log("server running on http://localhost:8080");
})

const MONGO_URL = 'mongodb+srv://0xrachelchu:<K8XVJRxawlkV2T26>@cluster0.t6ifvfx.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URL); 
mongoose.connection.on('error', (error: Error) => console.log(error));

