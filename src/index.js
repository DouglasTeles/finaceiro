const { response, request } = require('express');
const express = require('express');
const {v4: uuidv4} = require('uuid');//gera uuid

const app = express();

app.use(express.json());


//array com os dados da aplicação
const customers = [];

//Middleware
//verifica se o usuario existe
function verifyExistsAccount(req, res, next) {

    const {cpf} = req.headers;

    const customer = customers.find(customer => customer.cpf === cpf)
    if(!customer){
        return res.status(400).json({error:"Customer not found"})
    }
    
    request.customer = customer;
    return next()
}


app.post('/account', (req, res) =>{
    const {cpf, name} = req.body
    console.log( req.body)

    const customersAlreadyExist = customers.some(//consulta a variavel e verifica se o cpf que esta sendo inserido já existe
        (customer)=>customer.cpf === cpf
    );
    if(customersAlreadyExist){
        return res.status(400).json({error: 'Customer already exists'});
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement:[]
    });
    return res.status(200).send();
});


app.get('/statement', verifyExistsAccount, (req, res) => {
    const {customer} = request;
    
    return res.json(customer.statement)

});

app.post("/deposit",verifyExistsAccount, (req, res) => {
    const {description, amount} = req.body;
    const {customer} = request;

    const statementOparation = {
        description,
        amount,
        created_at: new Date(),
        tipe:"Credit"
    }

    customer.statement.push(statementOparation);
    return res.status(201).send();

})

app.post("withdraw",verifyExistsAccount, (req, res)=>{
    const {amount} = req.body;
    const {customer} = request;




})

app.listen(3000)