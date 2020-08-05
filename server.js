var express= require('express')
var bodyParser= require('body-parser')
var app= express()

var http=require('http').Server(app)
var io= require('socket.io')(http)
var mongoose= require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl='mongodb+srv://user:user@cluster0.7tvsl.mongodb.net/test?retryWrites=true&w=majority'

var MMessage=mongoose.model('MMessage',{
    name: String,
    message: String
})


app.get('/messages',(req, res)=>{

    MMessage.find({},(err,messages)=>{
        res.send(messages)
    })
   // res.send(messages)
})

app.post('/messages',(req, res)=>{
   var message=new MMessage(req.body)
   message.save((err)=>{
       if(err)
       sendStatus(500)

    io.emit('message',req.body)

    res.sendStatus(200)

   })

    
})

mongoose.connect(dbUrl,{ useUnifiedTopology: true },(err)=>{
    if(err)
    console.log('give a mongodb connection'+err)
    else console.log("connected")
})

io.on('connection',(socket)=>{
    console.log('a user connected')
})

http.listen(3000) 