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

function capitalize(str) {
  if (!str) return ""; // Maneja cadenas vacías
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

var to = "573013928129";

const idChat = "-OFPs0CgE1K7UIqi4YuL";

var messageGlobal = "";

var recipientId = "";
var messageFinal;

function json2array(json) {
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(json[key]);
  });
  return result;
}

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

var repeatMessageOption = false;

function savedAlertAgentData() {
  var dataForm = {
    agent: true,
    idUser: recipientId,
  };
  axios
    .post(
      "https://getdev-b2c0b.firebaseio.com/company/sly/alertAgent/.json",
      dataForm
    )
    .then((response) => {
      if (response.status == 200) {
      }
    });
}

function savedAnswerData(value) {
  var dataForm = {
    value: value,
  };
  axios
    .post(
      "https://getdev-b2c0b.firebaseio.com/company/sly/answerValue/.json",
      dataForm
    )
    .then((response) => {
      if (response.status == 200) {
      }
    });
}

function savedForm(city, company, consult, email, name, phone) {
  var dataForm = {
    city: city,
    company: company,
    consult: consult,
    email: email,
    name: name,
    phone: phone,
  };
  axios
    .post(
      "https://getdev-b2c0b.firebaseio.com/company/sly/formContact/.json",
      dataForm
    )
    .then((response) => {
      if (response.status == 200) {
      }
    });
}

function sendLink(value) {
  axios
    .post("https://graph.facebook.com/v16.0/" + recipientId + "/messages", {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      params: {
        messaging_product: "whatsapp",
        to: to,
        type: "link",
        link: {
          url: value,
        },
      },
    })
    .then((response) => {
      if (response.status == 200) {
        print("Imagen enviada con éxito");
        print("Respuesta: ${response.body}");
      } else {
        print("Error enviando la imagen: ${response.statusCode}");
        print("Detalles del error: ${response.body}");
      }
    });
}

function sendVideo(imageUrl) {
  axios
    .post("https://graph.facebook.com/v16.0/" + recipientId + "/messages", {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      params: {
        messaging_product: "whatsapp",
        to: to,
        type: "video",
        video: {
          link: imageUrl,
          caption: "Aquí tienes el video solicitado.",
        },
      },
    })
    .then((response) => {
      if (response.status == 200) {
        print("Imagen enviada con éxito");
        print("Respuesta: ${response.body}");
      } else {
        print("Error enviando la imagen: ${response.statusCode}");
        print("Detalles del error: ${response.body}");
      }
    });
}

function sendMedia(imageUrl) {
  axios
    .post("https://graph.facebook.com/v16.0/" + recipientId + "/messages", {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      params: {
        messaging_product: "whatsapp",
        to: to,
        type: "image",
        image: {
          link: imageUrl,
          // Agrega el caption si está disponible
        },
      },
    })
    .then((response) => {
      if (response.status == 200) {
        print("Imagen enviada con éxito");
        print("Respuesta: ${response.body}");
      } else {
        print("Error enviando la imagen: ${response.statusCode}");
        print("Detalles del error: ${response.body}");
      }
    });
}
function sendEventAnalitics() {}

function validationMsj(value) {
  if (value != null) {
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

          var dataItemSelected = JSON.parse(jsonData);

          //    var obj = JSON.parse(jsonData);

          console.log("datosnuevo: " + route + " - " + jsonData);

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

          console.log("datosnuevo1: " + route);

          //  var business_phone_number_id = "545034448685967";

          if (type == "chat" || type == "text") {
            sendMsj(title, route, type, true);

            validationMsj(route);
          }

          if (type == "terms") {
            var listString =
              "Aceptar los terminos y condiciones" +
              "\n" +
              "1.Aceptar" +
              "\n" +
              "2.Rechazar";
            if (repeatMessageOption == true) {
              if (messageGlobal == "1") {
                validationMsj(route);
              } else {
                sendMsj(
                  "Para continuar debes aceptar los terminos y condiciones",
                  route,
                  type,
                  true
                );
              }
            } else {
              sendMsj(title, route, type, false);
            }
          }

          if (type == "answer") {
            var title = dataItemSelected["title"];

            if (repeatMessageOption == true) {
              savedAnswerData(messageGlobal);

              validationMsj(route);
              sendMsj(listString, route, type, false);
            } else {
              sendMsj(title, route, type, true);
            }
          }

          if (type == "form") {
            var listString =
              "Formulario de contacto" +
              "\n" +
              "1.Nombre" +
              "\n" +
              "2.Empresa" +
              "\n" +
              "3.Correo electronico" +
              "\n" +
              "4.Ciudad" +
              "\n" +
              "5.Consulta";

            if (repeatMessageOption == true) {
              validationMsj(route);

              let lista = messageGlobal.split(", ");

              var city = lista[0];
              var company = lista[1];
              var consult = lista[2];
              var email = lista[3];
              var name = lista[4];
              var phone = lista[5];

              savedForm(city, company, consult, email, name, phone);

              sendMsj(listString, route, type, true);
            } else {
              sendMsj(listString, route, type, true);
            }
          }

          if (type == "agent") {
            savedAlertAgentData();
            sendMsj("Buscando agentes disponibles", route, type, true);
          }

          if (type == "end") {
            if (repeatMessageOption == true) {
              if (messageGlobal == "1") {
                sendMsj("Gracias por comunicarte", route, type, true);
              }

              if (messageGlobal == "2") {
                repeatChat();
              }
              if (messageGlobal == "3") {
                sendMsj("Buscando", route, type, true);
              }
            } else {
              var listString =
                "Deseas terminar la converzación" +
                "\n" +
                "1.Si" +
                "\n" +
                "2.Ir al inicio" +
                "\n" +
                "3.Contactar a un acesor";

              sendMsj(listString, route, type, true);
            }
          }
          if (type == "media") {
            var url = dataItemSelected["url"];

            var type = dataItemSelected["type"];

            if (type == "photo") {
              sendMedia(url);
            } else {
              sendVideo(url);
            }

            validationMsj(route);

            sendMsj(message, route, type, false);
          }
          if (type == "pause") {
            // var valuePause = dataItemSelected["value"];

            setTimeout(function () {
              validationMsj(route);
              sendMsj(message, route, type, false);
            }, 1000);
          }

          if (type == "analitic") {
            sendEventAnalitics();

            validationMsj(route);

            sendMsj(message, route, type, false);
          }

          if (type == "product") {
            var value = dataItemSelected["product"];

            sendLink(value);

            validationMsj(route);

            sendMsj(message, route, type, false);
          }

          if (type == "multiple") {
            if (repeatMessageOption == true) {
              var keys = Object.keys(dataItemSelected["optionsStep"]);
              var position = 0;
              keys.forEach(function (key) {
                console.log("datos: " + key);

                position += 1;
                console.log("global: "+messageGlobal.toLowerCase());
                if (key.toLowerCase() == messageGlobal.toLowerCase()) {
                  console.log("datosselected: " + key);

                  var list2 = dataItemSelected["optionsStep"];

                  var listProm = json2array(list2);

                  console.log("datosselected67: " + listProm);
                  var route = listProm[0];

                  console.error("DATOS SELECTED------: " + route);
                  
                  var message = kkk

                  /*  axios
      .delete(
        "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/" +
          idChat +
          "/options/" +
          value +
          "/.json"
      )
      .then((response) => {});*/

                  sendMsj(message, route, type, true);
                  validationMsj(route);
                  messageGlobal = "";
                }
              });
            } else {
              console.error("DATOS SELECTED1------: " + route);

              var list2 = dataItemSelected["optionsMulti"];

              var list = json2array(list2);

              console.log("longitud: " + list[0]);

              var listString = "";

              for (var i = 0; i < list.length; i++) {
                console.log("longitud2: " + list[i]);
                listString += i + 1 + ". " + capitalize(list[i]) + "\n";
              }
              var message = title + ":" + " \n\n" + listString;

              console.log("mensajeopcionmultiple: " + message);

              //  setTimeout(function () {
              //   sendMsj(receiver, message, route);
              //hola
              //firme
              //poder

              if (route == undefined) {
                sendMsj(message, "route", "multiple", true);
              } else {
                sendMsj(message, route, type, true);
              }
            }

            // }, 500);

            /*
           var keys = Object.keys( dataItemSelected["optionsStep"]);
                
    keys.forEach(function(key){
      console.log("datos: "+key);
      if(key.toLowerCase() ==   messageReceip.toLowerCase()){

      }});*/
          }

          if (type == "link") {
            var link = dataItemSelected["link"];

            sendLink(link);

            sendMsj(message, route, type, false);

            validationMsj(route);
            // sendMsj(receiver, title, route);
          }
        }

        // }
      })
      .catch((error) => {
        console.log("errorfirebasE: " + error); // Manejo de errores
      });
  } else {
    console.log("------CHAT FINALIZADO------");
  }
}

async function sendMsj(
  messageText,
  route,
  type,
  /* information,*/ notification
) {
  //if(route != null){
  console.log("-----sendmsj---: " + route);

  console.log("routestep: " + route);
  var messageData2 = {
    routeStep: route,
    type: type,

    information: notification,
    text: messageText,
    receipt: recipientId,
  };

  axios
    .post(
      "https://getdev-b2c0b.firebaseio.com/company/sly/messageUsers/" +
        recipientId +
        ".json",
      messageData2
    )
    .then((response) => {
      if (response.status == 200) {
        //validationMsj(response);

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

  if (notification == true) {
    console.error("----MENSAJE ENVIADO---"+messageText);

    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${recipientId}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: to,
        text: { body: messageText },
        /* context: {
          message_id: messageFinal.id, // shows the message as a reply to the original user message
        },*/
      },
      
    }).catch((error) => {
        console.error("errorfirebaseend: msj: " + error); // Manejo de errores
      });

    // mark incoming message as read
    /* await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${recipientId}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageFinal.id,
      },
    });*/

    /* axios
      .post("https://graph.facebook.com/v18.0/" + recipientId + "/messages", {
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
     
          "Content-Type": "application/json",
          
          
        },
        params: {
          messaging_product: "whatsapp",
          to: to,
          text: { body: messageText },
          context: {
            message_id: messageText, // shows the message as a reply to the original user message
          },
        },
      })
      .then((response) => {
      
        console.error("mensaje enviado--" );
    }).catch((error) => {
        console.error("errorfirebassend: " + error); // Manejo de errores
      });;*/
  }

  /*
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
        
         console.log("sendmsj---1: " + route);
        
          const jsonData = JSON.stringify(response.data, null, 2);
        
        
       var title = jsonData["title"];
        
        var business_phone_number_id = "545034448685967"; 
        var to = "573013928129";
       
        
        axios
    .post(
     `https://graph.facebook.com/v18.0/545034448685967/messages`,
    {
        messaging_product: "whatsapp",
        to: to,
        text: { body: "title" },
       
      },
    )
    .then((response) => { 
        });
        
        
      }});*/

  console.log("routeSend: " + route);
  //if(route != null){

  // }
}

function repeatChat() {
  axios
    .get(
      "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/"+idChat+  "/options/.json"
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
      sendMsj(title, route, type, true);

      validationMsj(route);
    });
}

app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  messageFinal = message;
  // check if the incoming message contains text
  if (message?.type === "text") {
    // extract the business number to send the reply from it

    messageGlobal = message.text.body;

    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    //  var recipientData = business_phone_number_id;

    recipientId = business_phone_number_id;

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
    });

    // mark incoming message as read
    await axios({
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

    repeatMessageOption = false;

    axios
      .get(
        "https://getdev-b2c0b.firebaseio.com/company/sly/messageUsers/" +
          recipientId +
          "/.json"
      )
      .then((response) => {
        console.log("Successfully firebase4" + response.data);
        if (response.data == null) {
          console.log("Successfully firebase5" + response.data);

          repeatChat();
        } else {
          const jsonData = JSON.stringify(response.data, null, 2); // Convierte a JSON legible
          console.log("Datos en formato JSON22:", jsonData);

          //  var recipientId = body.recipient_id;
          // var messageId = body.message_id;

          var obj = JSON.parse(jsonData);

          var listJson = json2array(obj);

          let dataItemSelected = [];
          for (var i = 0; i < json2array(obj).length; i++) {
            var dataItem = json2array(obj)[i];

            console.log("welcome: " + dataItem["welcome"]);

            if (dataItem["information"] != true) {
              
              dataItemSelected.push(dataItem);
            }
          }

          console.error("routefirme23: " + dataItemSelected);

          var position = dataItemSelected.length - 2; //changed1

          // const jsonData2 = JSON.stringify(json2array(obj)[0], null, 2);
             console.log("route99: "+ dataItemSelected[position]["type"]);
          
          var route = dataItemSelected[position]["routeStep"];

          // var route2 = json2array(obj)[1]["routeStep"];

          console.error("routefirme: " + route);
          var type = dataItemSelected[dataItemSelected.length - 1]["type"];

          console.error("validation: " + type);

          if (
            type == "multiple" ||
            type == "answer" ||
            type == "form" ||
            type == "end" ||
            type == "terms"
          ) {
            repeatMessageOption = true;
          }

          validationMsj(route);
        }
      })
      .catch((error) => {
        console.log(error); // Manejo de errores
      });

    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages

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
