const config = require("../config.json");
const macros = require("../Macros");
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discordapp.com/api/webhooks/1114874636375687270/4bse9FnxYBN7ofI3rhmFMgHLbKcaN3Ogz4QVPjFyelW8wdpIw28k-_OfjWjSrKY0L8hK");
 
const IMAGE_URL = 'https://w7.pngwing.com/pngs/168/75/png-transparent-lightweight-directory-access-protocol-computer-icons-authentication-directory-service-computer-servers-authentication-protocol-logo-sign-authentication.png';
hook.setUsername('[LOADER] Logger');
hook.setAvatar(IMAGE_URL);

module.exports = {
    name:"login",
    adminOnly: false,
    execute(db,body,out_obj,adminMode)
    {
        return new Promise(resolve=>{
            db.serialize(function(){
                db.get("SELECT * FROM Users WHERE Username = ? AND Password = ?",[body.username, body.password],async function(err,row)
                {
                    if(row)
                    {                       
                            if(new Date(row.Expiry) > new Date())
                            {
                                if(row.HWID === body.hwid || (!config.HWID_LOCKED))
                                {
                                    db.run("UPDATE Users SET LastLogin = ? WHERE Username = ?",[macros.getTimestamp(new Date()),body.username],async function(err,row){});
                                    out_obj["Rank"] = (row.Rank).toString();
                                    out_obj["UserVar"] = row.UserVar;
                                    out_obj["Expiry"] = row.Expiry;
                                    resolve("Login Success");
                                    hook.success('**Başarılı giriş**', 'Username: ' + body.username, 'Expiry: '+ row.Expiry);
                                }
                                else if(row.HWID === "0")
                                {
                                    db.run("UPDATE Users SET HWID = ? WHERE Username = ?",[body.hwid,body.username],async function(err,row){
                                        resolve("HWID Updated");
                                    });
                                }
                                else
                                {
                                    out_obj["status"] = "401";
                                    resolve("Invalid HWID");
                                    hook.error('**Yanlış HWID**', 'Username: ' + body.username, 'Expiry: '+ row.Expiry);
                                }
                            }
                            else
                            {
                                out_obj["status"] = "401";
                                resolve("License Expired");
                                hook.error('**Lisans sona erdi**', 'Username: ' + body.username, 'Expiry: '+ row.Expiry);
                            }
                    }
                    else
                    {
                        out_obj["status"] = "401";
                        resolve("Invalid Credentials");          
                    }
                })
            });
        
        })
}
}