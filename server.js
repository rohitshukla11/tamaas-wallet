// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_y1Lz1qkCcJjNzGsMm9fR0bob");
var express = require("express");
var bodyParser = require("body-parser");
var app = express(); 
app.use(bodyParser.urlencoded({ extended: true }));
// Body Parser Middleware
app.use(bodyParser.json());
var acct;

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS
    req.header('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
 var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

 app.get('/', (req, res) => {
  res.send('HEY!')
})


app.post("/createAccount", function(req , res){
 var country = req.body.country;
 var day = req.body.day;
 var month = req.body.month;
 var year = req.body.year;          
 var first_name = req.body.first_name;
 var last_name = req.body.last_name;
 var address= req.body.address;
 var postal_code= req.body.postal_code;
 var city = req.body.city;
 var state = req.body.state;
 var ssn_last_4 = req.body.ssn_last_4;

 

 stripe.accounts.create({
  type: "custom",
  country: String(country),
  tos_acceptance: {
    date: Math.floor(Date.now() / 1000),
    ip: "122.161.138.190"
  },
  legal_entity: {
    dob: {
      day: day,
      month: month,
      year: year
    },
    first_name: String(first_name),
    last_name: String(last_name),
    type: "individual",
    address: {
      line1: String(address),
      postal_code: postal_code,
      city: String(city),
      state: String(state)
    },
    ssn_last_4: ssn_last_4,
  }

}, function(err, account) {
  var acct_id = account.id;
  console.log("Account created successfully:"+acct_id);

     if (err){
            res.json({'status':'failed','message':'Error while fetching data'});
            throw err;
           }
    else{
            var result = [];
            result.push({'status':'success',
                        'data':{'country': country, 'day': day, 'month': month, 'year': year, 'first_name': first_name, 'last_name': last_name,
                        'address': address, 'postal_code': postal_code, 'city': city, 'state': state, 'ssn_last_4': ssn_last_4, 'account_id': acct_id}
                    });
            res.json(result);
        } 
});
});

app.post("/addBankAccount", function(req , res){
var name = req.body.name;
var routing_number = req.body.routing_number;          
var account_number = req.body.account_number;
var account_id = req.body.account_id;

stripe.tokens.create({
  bank_account: {
    country: 'US',
    currency: 'usd',
    account_holder_name: String(name),
    account_holder_type: 'individual',
    routing_number: String(routing_number),
    account_number: String(account_number)
  }
}, function(err, token) {
  console.log(token['id']);
  var token = token['id'];
  stripe.accounts.createExternalAccount(
  String(account_id),
  { external_account: String(token) },
  function(err, bank_account) {
    bank_acct_id = bank_account.id;
    console.log("Bank account added successfully:"+bank_acct_id);

    if (err){
            res.json({'status':'failed','message':'Error while fetching data'});
            throw err;
           }
    else{
            var result = [];
            result.push({'status':'success',
                        'data':{'account_holder_name': name,'routing_number': routing_number, 'account_number': account_number, 'bank_account_id': bank_acct_id }
                    });
            res.json(result);
        } 
  }
);
});

});