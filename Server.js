const express = require('express'),
      app = express(),
      router = express.Router();
const config = require('./config.json');
const port = 3131; 
const bodyParser = require('body-parser');

const sqlite3 = require("sqlite3");
const database_filepath = "./users.db";
const db = new sqlite3.Database(database_filepath);
const DEBUG = config.DEBUG;
const crypto = require('./Encryption/crypto');
const key = Buffer.from("oUHqJ9IOlyjA4edqmyFdkeNi8J/x+dte2AWlGRd2uTM=",'base64');
let session_ivs = new Map();


let Commands = new Map();
const fs = require("fs");
function ImportCommands() {
    const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./Commands/${file}`);
        Commands.set(command.name, command);
        
    }
}
ImportCommands();

const validate_session = function(req,res,next)
{
    let iv = session_ivs.get(req.body.iv);
    if(iv && (req.headers.authorization === config.public_token))
    {
        session_ivs.delete(req.body.iv);
        if ((new Date()-iv)/1000 < 30) //Checks if IV is less than 30 seconds old
        {
            next();
            return;
        };
    }
    res.send({"res":"Invalid Session"});
     
}
router.post("/post",validate_session,async(req,res)=>{
    console.log(req.body);
    if(!DEBUG)req.body = await crypto.decryptBody(req.body,key,req.body.iv); //decrypt the JSON Object request
    console.log(req.body);
    req.body.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const command = Commands.get(req.body.command);
    let resObj = {"status":"200"};
    if(!command.adminOnly)
        resObj.res = await command.execute(db,req.body,resObj);
    else 
        resObj.res = "You do not have access to this command";
    if(!DEBUG)resObj = await crypto.encryptResponse(resObj,key,req.body.iv); //encrypt the JSON Object response
    resObj["token"] = req.body.token;
    res.send(resObj);
});

router.post("/admin",async(req,res)=>{
    if(config.auth === req.headers.authorization)
    {
        const Database = Commands.get(req.body.command);
        var response = await Database.execute(db,req.body,res,true);
        res.send(response);
    }else{
        res.send("Access Denied");
    }
});

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  } 

app.get("/initialize",async(req,res)=>{
    let iv = crypto.generateIV();
    console.log("Generated: " + iv);
    res.send(iv);
    session_ivs.set(iv,new Date());
})

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies 
app.use('/',router);
console.log('\x1b[36m%s\x1b[0m', '[+] Auth system loaded !')
delay(5000);
app.listen('8080', '18.212.160.231');
