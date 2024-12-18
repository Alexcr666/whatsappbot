/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const idChat = "-ODvWrCbH47cu21VClQr";

function json2array(json) {
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(json[key]);
  });
  return result;
}

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

function validationMsj(receiver, value) {
  axios
    .get(
      "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/" +
        idChat +
        "/options/" +
        value +
        "/.json"
    )
    .then((response) => {
      if (response.status == 200) {
     
          const jsonData = JSON.stringify(response.data, null, 2);
        
        
          var dataItemSelected = jsonData;
        
          console.log("datosnuevo: "+jsonData);
        
        

          /*      if(dataItemSelected.isNull("routeStep")){
        
        
          var keys = Object.keys( dataItemSelected["optionsStep"]);
                
    keys.forEach(function(key){
      console.log("datos: "+key);
      if(key.toLowerCase() ==   messageReceip.toLowerCase()){

      }});
        
        
      }else{*/

          var type = dataItemSelected["type"];
          var route = dataItemSelected["routeStep"];

          var title = dataItemSelected["title"];
          if (type == "chat" || type == "text") {
            sendMsj(receiver, title, route);
          }
        
                  if (type == "terms") {
                    
                     sendMsj(receiver, title, route);
                    
                  }
        
            if (type == "answer") {
                    
                  }
        
            if (type == "form") {
                    
                  }
        
            if (type == "agent") {
                    
                  }
        
            if (type == "end") {
    
    }
    if (type == "media") {
    
    }
    if (type == "pause") {
     
    }

     if (type == "analitic") {
     
    }

        if (type == "product") {
     
    }
        
      

          if (type == "multiple") {
            var list = dataItemSelected["optionsMulti"];

            var listString = "";

            for (var i = 0; i < list.length; i++) {
              listString += list[i].capitalize() + "\n";
            }
            var message = title.capitalize() + ":" + " \n\n" + listString;

            //  setTimeout(function () {
            sendMsj(receiver, message, route);
            // }, 500);

            /*
           var keys = Object.keys( dataItemSelected["optionsStep"]);
                
    keys.forEach(function(key){
      console.log("datos: "+key);
      if(key.toLowerCase() ==   messageReceip.toLowerCase()){

      }});*/
          }

          if (type == "link") {
            sendMsj(receiver, title, route);
          }
        }
      
      // }
    });
}

function sendMsj(recipientData, recipientId, messageText, route)  {
  //if(route != null){
    console.log("sendmsj---: " + route);
  

  axios
    .get(
      "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/" +
        idChat +
        "/options/" +
        route +
        "/.json"
    )
    .then((response) => {
      if (response.status == 200) {
        
          const jsonData = JSON.stringify(response.data, null, 2);
        
        
       var title = jsonData["title"];
        
        var business_phone_number_id = "545034448685967"; 
        var to = "573013928129";
       
        
        axios
    .post(
     `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
    {
        messaging_product: "whatsapp",
        to: to,
        text: { body: title },
       
      },
    )
    .then((response) => {
          
          
        });
        
        
      }});
  
   
  /*
  await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
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
    });*/

  console.log("routeSend: " + route);
  //if(route != null){

  console.log("routestep: " + route);
  var messageData2 = {
    userId: recipientData,
    routeStep: route,
    text: messageText,
    receipt: recipientData,
  };

  axios
    .post(
      "https://getdev-b2c0b.firebaseio.com/company/sly/messageUsers/" +
        recipientData +
        ".json",
      messageData2
    )
    .then((response) => {
      if (response.status == 200) {
        validationMsj(response);
        
        
        
        
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
      }
    });

  // }
}

app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  // check if the incoming message contains text
  if (message?.type === "text") {
    // extract the business number to send the reply from it
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    var recipientData = business_phone_number_id;
    axios
      .get(
        "https://getdev-b2c0b.firebaseio.com/company/sly/messageUsers/" +
          recipientData +
          "/.json"
      )
      .then((response) => {
        console.log("Successfully firebase4" + response.data);
        if (response.data == null) {
          console.log("Successfully firebase5" + response.data);

          axios
            .get(
              "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/-ODvWrCbH47cu21VClQr/options/.json"
            )
            .then((response) => {
              const jsonData = JSON.stringify(response.data, null, 2); // Convierte a JSON legible
              console.log("Datos en formato JSON:", jsonData);

              //  var recipientId = body.recipient_id;
              // var messageId = body.message_id;

              var obj = JSON.parse(jsonData);

              var listJson = json2array(obj);
              console.log(
                "lenghtoptionsinit : " +
                  json2array(obj).length +
                  " : " +
                  json2array(obj)[0]
              );

              var dataItemSelected;
              for (var i = 0; i < json2array(obj).length; i++) {
                var dataItem = json2array(obj)[i];

                console.log("welcome: " + dataItem["welcome"]);

                if (dataItem["welcome"] == true) {
                  dataItemSelected = dataItem;
                }
              }

              console.log("Successfully firebase2: " + response.data + "  :  ");

              var title = dataItemSelected["title"];
              var route = dataItemSelected["routeStep"];
              var type = dataItemSelected["type"];

              console.error("body: " + title);

              console.log("Successfully firebase" + response.data);
              sendMsj(recipientData, recipientData, title, route);
            });
        } else {
          
          const jsonData = JSON.stringify(response.data, null, 2); // Convierte a JSON legible
              console.log("Datos en formato JSON:", jsonData);

              //  var recipientId = body.recipient_id;
              // var messageId = body.message_id;

             var obj = JSON.parse(jsonData);

             var listJson = json2array(obj);
              console.log(
                "lenghtoptions34: " +
                  json2array(obj).length +
                  " : " +
                  json2array(obj)[0]
              );
          
           // const jsonData2 = JSON.stringify(json2array(obj)[0], null, 2);
                  //   console.log("route99: "+ jsonData2+" - "+json2array(obj)[0]["routeStep"]);
             var route =   json2array(obj)[0]["routeStep"];
          
           console.log("route", route);
          
           validationMsj(recipientData,route);
        }
      })
      .catch((error) => {
        console.log(error); // Manejo de errores
      });

    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    /* await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
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
    });*/

    // mark incoming message as read
    /* await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });*/
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
