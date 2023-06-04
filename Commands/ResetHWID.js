const config = require("../config.json");
const macros = require("../Macros");
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discordapp.com/api/webhooks/1114874636375687270/4bse9FnxYBN7ofI3rhmFMgHLbKcaN3Ogz4QVPjFyelW8wdpIw28k-_OfjWjSrKY0L8hK");
 
const IMAGE_URL = 'https://w7.pngwing.com/pngs/168/75/png-transparent-lightweight-directory-access-protocol-computer-icons-authentication-directory-service-computer-servers-authentication-protocol-logo-sign-authentication.png';
hook.setUsername('[LOADER] Logger');
hook.setAvatar(IMAGE_URL);
module.exports = {
name: "resethwid",
adminOnly: false,
execute(db,body,obj_out,adminMode){
    console.log(adminMode);
    return new Promise(resolve=>{
        db.serialize(function(){
            db.get("SELECT * FROM Users WHERE Username = ?"+(adminMode?"":" AND Password = ?"),adminMode?[body.username]:[body.username,body.password], async function(err,row)
            {
                if(row)
                {
                    var DaysFromLastReset = await macros.dayDifference(new Date(row.LastReset));
                    if(DaysFromLastReset > config.HWID_RESET_FREQUENCY_DAYS || adminMode)
                    {
                        db.run("UPDATE Users SET HWID = '0', LastReset = ? WHERE Username = ?",[macros.getTimestamp(new Date()),body.username],function(err){
                            if(err){
                                obj_out["status"] = "401";
                                resolve(err.message);
                            }
                            else
                                //resolve(`HWID Successfully Updated for ${body.username}`);
                                //resolve(`HWID Successfully Updated for ${body.username}`);
                                resolve(hook.success(`"${body.username}" adlı kullanıcının HWID'i sıfırlandı.`));
                        })
                    }else{
                        obj_out["status"] = "401";
                        resolve(`You cannot reset your HWID for another ${(config.HWID_RESET_FREQUENCY_DAYS-DaysFromLastReset).toFixed(2)} days`);
                    }
                }
                else{
                    obj_out["status"] = "401";
                    resolve("No user found");
                }
            })
        });
    })
}
}