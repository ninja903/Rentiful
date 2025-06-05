import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';    
import { dot } from 'node:test/reporters';


dotenv.config();
const app = express();
app.use(express.json())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

app.get('/', (req, res) => {
    res.send("working")
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
})
