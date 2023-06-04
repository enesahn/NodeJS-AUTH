const { response } = require("express");
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discordapp.com/api/webhooks/1114874636375687270/4bse9FnxYBN7ofI3rhmFMgHLbKcaN3Ogz4QVPjFyelW8wdpIw28k-_OfjWjSrKY0L8hK");
 
const IMAGE_URL = 'https://w7.pngwing.com/pngs/168/75/png-transparent-lightweight-directory-access-protocol-computer-icons-authentication-directory-service-computer-servers-authentication-protocol-logo-sign-authentication.png';
hook.setUsername('[LOADER] Logger');
hook.setAvatar(IMAGE_URL);
const uuid4 = require("uuid4");

module.exports = {
    name: "generate",
    adminOnly: true,
    async execute(db,body,out_obj){
        var id = await new Promise(resolve=>{var ID = uuid4();resolve(ID)});
        return new Promise(resolve=>{
            db.serialize(async function(){
                db.run(`INSERT INTO Users(License, Expiry, Rank) VALUES (?,?,?)`,[id,body.length,body.rank],async function(err)
                    {
                        if(err)
                            console.log(err.message);
                    },
                    (err,res)=>{
                        if(err)
                            resolve("FAILED: " + err.message);
                        else
                            resolve(hook.info('**Key oluşturuldu**', body.length + ' günlük key oluşturuldu. ', 'Key: '+ id));
                            //resolve(`Appended ${body.length} Day License: ${id} to database with rank ${body.rank}\n`);
                            
                        }
                    ); 
            })
        });
    }
};