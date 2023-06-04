const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discordapp.com/api/webhooks/1114874636375687270/4bse9FnxYBN7ofI3rhmFMgHLbKcaN3Ogz4QVPjFyelW8wdpIw28k-_OfjWjSrKY0L8hK");
 
const IMAGE_URL = 'https://w7.pngwing.com/pngs/168/75/png-transparent-lightweight-directory-access-protocol-computer-icons-authentication-directory-service-computer-servers-authentication-protocol-logo-sign-authentication.png';
hook.setUsername('[LOADER] Logger');
hook.setAvatar(IMAGE_URL);
module.exports = {
    name:"resetpw",
    adminOnly: false,
    execute(db,body,out_obj,adminMode)
    {
        return new Promise(resolve=>{
            db.serialize(function(){
                db.get("SELECT * FROM Users WHERE Username = ?"+(adminMode?"":" AND License = ?"),adminMode?[body.username]:[body.username,body.license],async function(err,row){
                    if(row)
                    {
                        db.run("UPDATE Users SET Password = ? WHERE Username = ?",[body.newPassword, body.username],function(err){},
                        (err,result)=>{
                            if(err)
                                resolve(err.message)
                            else
                                resolve("Password Changed Successfully");
                                hook.success('**Şifre değiştirildi**', 'Username: ' + body.username);
                        })
                    }else if(err){
                        out_obj["status"] = "401";
                        resolve(er.message);
                    }else{
                        out_obj["status"] = "401";
                        resolve("No user found");
                    }
                })
            });
        
        })
    }
}