const macros = require("../Macros");
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discordapp.com/api/webhooks/1114874636375687270/4bse9FnxYBN7ofI3rhmFMgHLbKcaN3Ogz4QVPjFyelW8wdpIw28k-_OfjWjSrKY0L8hK");
 
const IMAGE_URL = 'https://w7.pngwing.com/pngs/168/75/png-transparent-lightweight-directory-access-protocol-computer-icons-authentication-directory-service-computer-servers-authentication-protocol-logo-sign-authentication.png';
hook.setUsername('[LOADER] Logger');
hook.setAvatar(IMAGE_URL);
module.exports = {
name: "extend",
adminOnly: true,
execute(db,body,out_obj,adminMode){
    return new Promise(resolve=>{
        db.serialize(function(){
            db.get("SELECT * FROM Users WHERE Username = ?",[body.username], async function(err,row)
            {
                if(row)
                {
                    var extendDate = await macros.extendTime(row.Expiry,parseInt(body.extendBy));
                    db.run("UPDATE Users SET Expiry = ? WHERE Username = ?",[extendDate,body.username],function(err){
                        if(err)
                            resolve(err.message);
                        else
                            resolve(hook.info('**Lisans uzatıldı**', body.extendBy + ' gün şu kullanıcıya eklendi ' + body.username + 'Yeni bitiş süresi: '+ extendDate));
                            
                            
                    })
                }
                else{
                    resolve("No user found");
                }
            })
        });
    })
}
}