const { response } = require("express");
const macros = require("../Macros");
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