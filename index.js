var messages = [];

var express = require('express');
var app = express();
var db = require('./models')

const Users = require("./models/users")
const Mails = require("./models/mails")
const MailAliases = require("./models/mailaliases")

function parseMessage (session, message_data){
    return new Promise(async resolve =>  {
        message = new Object();
        message.id = session.id;
        message.from = session.envelope.mailFrom.address;
        message.rcpt = session.envelope.rcptTo.map(function(item){ return item.address });
        message.data = message_data;
        simpleParser(message_data, async (err, mail) => {
            message.subject = mail.subject;
            message.date = mail.date;
            if (mail.html != false) {
                message.html = mail.html;
            } else {
                message.html = mail.text;
            }
            console.log(session.envelope.rcptTo)
            console.log(message.rcpt)

            resolve(message)
        })


    });
    
}

db.sequelize.sync({ force: true })
.then(() => {
  console.log(`Database & tables created!`)
})
function getMessageTo(email) {
    messagesFound = [];
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].rcpt[0].address == email) {
            messagesFound.push(messages[i]);
        }
    }
    return messagesFound;
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get("/", function (req, res, next) {
    res.send("You can ask /messages to see messages");
});

app.get("/initdb", async (req, res,) => {
    try{
        await Users.create({
            firstName: "Adrien",
            lastName: "Luneau",
            email: "adrien@luneau.me",
            userName: "bloudman",
            passwordHash: "test"
        })

        user = await Users.findOne({where : {email: "adrien@luneau.me"}});
        await MailAliases.create({
            mailAlias: "adrien@local.mailbag.io",
            userId: user.userId
        })
        res.send("ok")
    }catch (err){
        if(err.name == "SequelizeUniqueConstraintError"){
            res.send("Oups Something already exist! ");
        }else{
            res.send("KO")
            console.log(err)
        }
    }
})


app.get('/messages', function (req, res, next) {
    res.send(messages);
});

app.get("/messages/from/:mail", function (req, res, next) {
    messagesFound = getMessageTo(req.params.mail);
    if (messagesFound.length > 0) {
        res.send(messagesFound);
    } else {
        notFound = [];
        res.send(notFound);
    }

});

app.get("/messages/from/:mail/last", function (req, res, next) {
    messagesFound = getMessageTo(req.params.mail);
    if (messagesFound.length > 0) {
        res.send(messagesFound[messagesFound.length - 1]);
    } else {
        notFound = [];
        res.send(notFound);
    }
});

app.listen(80);
const simpleParser = require('mailparser').simpleParser;
const SMTPServer = require('smtp-server').SMTPServer;
const server = new SMTPServer({
    secure: false,
    authOptional: true,
    onConnect(session, callback) {
        // if(session.remoteAddress === '127.0.0.1'){
        //     return callback(new Error('No connections from localhost allowed'));
        // }
        return callback();
    },
    onMailFrom(address, session, callback) {
        callback(null, "Ok");
    },
    onRcptTo(address, session, callback) {
        callback(null, "Ok");
    },
    onData(stream, session, callback) {
        var message_data = "";
        stream.on("data", (data) => {
            message_data += data;
        });

        stream.on('end', async () => {
            let err;
            if (stream.sizeExceeded) {
                err = new Error('Error: message exceeds fixed maximum message size 10 MB');
                err.responseCode = 552;
                return callback(err);
            }

                        
            try{
                let message = await parseMessage(session, message_data);
                mailAliases = await MailAliases.findAll({
                    where : {
                        mailAlias: {
                            [db.Sequelize.Op.or]:message.rcpt
                        }
                    }
                })
                for (mailAlias of mailAliases){
                    console.log(mailAlias.mailAliasId)
                    await Mails.create({
                        from: message.from,
                        to: mailAlias.mailAlias,
                        data: message.html,
                        date: message.date,
                        subject: message.subject,
                        mailAliasId: mailAlias.mailAliasId
                    })
                }
                callback(null, 'Message queued as ' + message.id); // accept the message once the stream is ended
                messages.push(message);
            } catch (err) {
                console.log(err)
                err.responseCode = 550
                return callback(err)
            }
        });
    }
});

server.listen(25);