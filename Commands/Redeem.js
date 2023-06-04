const { response } = require("express");
const macros = require("../Macros");
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discordapp.com/api/webhooks/1114874636375687270/4bse9FnxYBN7ofI3rhmFMgHLbKcaN3Ogz4QVPjFyelW8wdpIw28k-_OfjWjSrKY0L8hK");
 
const IMAGE_URL = 'https://w7.pngwing.com/pngs/168/75/png-transparent-lightweight-directory-access-protocol-computer-icons-authentication-directory-service-computer-servers-authentication-protocol-logo-sign-authentication.png';
hook.setUsername('[LOADER] Logger');
hook.setAvatar(IMAGE_URL);
module.exports = {
    name: "redeem",
    adminOnly: false,
    execute(db, body,obj_out)
    {
        return new Promise(resolve=>{
            db.serialize(function(){
                db.get(`SELECT * FROM Users WHERE License = ? AND Username IS NULL`,[body.license],async function(err,row){
                if(row)
                {
                    var expiry = await macros.getExpiry(parseInt(row.Expiry));
                    db.run(`UPDATE Users SET Username = ?, Password = ?, Expiry = ?, HWID = ?, LastIP = ? WHERE License = ?`,[body.username,body.password,expiry,body.hwid, body.ip, body.license],function(err,row){

                    },
                    (err,finished)=>{
                        if(err)
                        {
                            if(err.code === "SQLITE_CONSTRAINT"){
                                obj_out["status"] = "401";
                                resolve("Username already taken");
                            }
                            resolve(err.message);
                        }
                        else{
                            resolve("License Redeemed");
                            hook.success('**Yeni kullanıcı kayıt oldu**', 'Username: ' + body.username, 'IP: '+ body.ip);
                        }
                    });
                }else{
                    obj_out["status"] = "401";
                    resolve("License not found or already redeemed");
                }
            })              
        
            });
            
        })
    }
}