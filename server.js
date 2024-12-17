/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";

import axios from "axios";





// The rest of the code implements the routes for our Express server.
let app = express();




app.use(express.json());

const idChat = "-ODvWrCbH47cu21VClQr";

 function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}




const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;




function sendMsj(recipientData,recipientId, messageText, route) {

  //if(route != null){

  console.log("routeSend: "+route);
  //if(route != null){
    
      console.log("routestep: "+route);
  var messageData2 = {
    userId: recipientData,
    routeStep: route,
    text: messageText,
    receipt: recipientData,
  };

axios(
    {
      uri:
        "https://getdev-b2c0b.firebaseio.com/company/sly/messageUsers/" +
        recipientData +
        ".json",
      // qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: messageData2,
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
      /* setTimeout(function () {
                 validationMsjRepeat(route);
                }, 700);*/
      
        
        //  var recipientId = body.recipient_id;
        // var messageId = body.message_id;
           //  var obj = JSON.parse(body);

        console.log("Successfully firebase id ");
        
      
      } else {
        console.error("Unable to send message.");
        console.error(response);
        console.error(error);
      }
    }
  );
 // }
  }


app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  
   const messageText = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0].text;
  const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

  
  //VALIDACION DE MENSAJES
  
  
  
    console.log("message: " + messageText);
  
var recipientData = business_phone_number_id;
axios(
    {
      uri: "https://getdev-b2c0b.firebaseio.com/company/sly/messageUsers/"+recipientData+"/.json",

      method: "GET",
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //  var recipientId = body.recipient_id;
        // var messageId = body.message_id;
           console.log("Successfully firebase4" + body);
        if(body == "null"){
            console.log("Successfully firebase5" + body);
          
    axios(
          {
            uri: "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/"+idChat+"/options/.json",

            method: "GET",
          },
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
              //  var recipientId = body.recipient_id;
              // var messageId = body.message_id;
              
                        
                var obj = JSON.parse(body);
          
      var listJson =     json2array(obj);
          console.error("lenghtoptions: "+json2array(obj).length+" : "+json2array(obj)[0]);
          
       var dataItemSelected ;  
for(var i = 0; i < json2array(obj).length;i++){
 var dataItem =  json2array(obj)[i];
  
  console.log("welcome: "+ dataItem["welcome"] );
  
  if(dataItem["welcome"] == true){
     dataItemSelected = dataItem;
  }

}
            
              console.log("Successfully firebase2: " + body + "  :  ");

   
              
              
              var title = dataItemSelected["title"];
              var route = dataItemSelected["routeStep"];
              var type = dataItemSelected["type"];

              console.error("body: " + title);

              console.log("Successfully firebase" + body);
              if (type == "chat") {
                sendMsj(recipientData,recipientData, title, route);

               /* setTimeout(function () {
                  validateFlow(body, route);
                }, 1000);*/
              }else{
                  sendMsj(recipientData,recipientData, title, route);
                
              }
            } else {
              console.error("Unable to send message.");
              console.error(response);
              console.error(error);
            }
          }
        );
          
        }else{
        }
      }
    });
  
  
  
  
  
  ///
  

  
  
  
  
  
  
  
  
  
  
  
  
  // check if the incoming message contains text
  if (message?.type === "text") {
    // extract the business number to send the reply from it
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    
    
    
    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v21.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: message.from,
        text: { body: "Echo: " + message.text.body },
        context: {
          message_id: message.id, // shows the message as a reply to the original user message
        },
      },
    });

    // mark incoming message as read
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v21.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });
  }

  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});