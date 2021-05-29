import "dotenv/config";
import express from "express";
import routes from './routes';
import cors from 'cors';

const PORT = process.env.PORT;
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', routes.products)

app.listen(PORT, () =>{
    console.log(`Server is working on ${PORT} port`);
})