import path from "path";
import express from 'express';
const app = express();
import cors from "cors";
//import { data } from './data.js'
import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var con;
var vehicleSchema = new Schema({
    vin: { type: String, required: true, unique: true, index: true },
    LicencePlate: { type: String, required: true },
    Driver: { type: String, required: true },
    MMY: { type: String, required: true },
    CustomerName: { type: String, required: true },
    Office: { type: String, required: true },
    Status : { 
        ignition: { type: String, required: true },
        speed: { type: Number, required: true },
        location: {
            lat: { type: Number, required: true },
            lon: { type: Number, required: true }
        }
     }
});

var vehicleModel = mongoose.model('vehicles', vehicleSchema);



/* 
vehicle1.save((err) => {
    if(err){
        console.log(err);
    } else {
        console.log('saved');
    }
}); 
*/

mongoose.connect("mongodb+srv://ipsitagoel:ipsitagoel@motorq.pc51a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", (err) => {
    if(!err) {
        console.log('connected');
    } else {
        console.log(err);
    }
});
var con = mongoose.connection;


var corsOptions = {
    origin: "http://localhost:3000"
  };
app.use(cors(corsOptions));
app.use(express.json())
// app.get("/", (req,res) => {
//     res.json({ 'message' : 'this is the dashboard' });
// })
app.get('/api/vehicles', (req,res) => {
    var data = [];
    var totalLength;
    vehicleModel.find( (err,log) => {
        {/*for(let i = 0; i<log.length;i++) data.push(log[i]);*/}
        totalLength = log.length;
        let toSendData = []
        let givenVin = req.query.vin ? true : false;
        let givenCount = req.query.count ? true : false;
        let givenDriver = req.query.driver ? true : false;
        let givenPlate = req.query.plate ? true : false;
        if(givenCount === true){
            for(let i = 0 ; i < req.query.count ; i++){
                toSendData.push(log[i])

            }
        }
        for(let i = 0 ; i < log.length ; i++){
            if(givenVin === true && log[i].vin === req.query.vin) toSendData.push(log[i])
            if(givenDriver === true && log[i].Driver === req.query.driver) toSendData.push(log[i])
            if(givenPlate === true && log[i].LicencePlate === req.query.plate) toSendData.push(log[i])
        }
        if(givenVin === false && givenCount === false && givenDriver === false && givenPlate === false) 
            for(let i = 0; i<log.length;i++) toSendData.push(log[i]);
        res.json({ 'vehicles' : toSendData, 'noOfEntries': totalLength });
    } )

})


app.patch('/api/vehicles/:id', (req,res) => {
    console.log(req.body)
    vehicleModel.updateOne({vin:{$eq: req.body.vin}},{LicencePlate: req.body.licence, Driver: req.body.driver, CustomerName: req.body.customer, Office: req.body.office},
        function(err,log){
                console.log(log)
        }        
    )
    console.log('patched')
    res.json({ 'message': req.params.id  })
})

if(process.env.NODE_ENV == 'production'){
    app.use(express.static("./client/build"));
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')
    );
})
}

app.listen(process.env.PORT || 5000, () => {
    console.log('server running')
})