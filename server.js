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
var tokenFacebook = "EAAMLZAcqhqNcBOzZA74KZCbYlFjDZA0txgIYagPir93a2D5XwQ3xJuVVc7HaQpk1seZBeHheGrd8ImQ4NRxPV2UGfAAbYtFKi7pLBFZBC4cU7u5higtLH8T9OVEgyqNkm2tHybqU9408XTK1BSqoJYgcMYbQhYn9MU9AFVHXyiOwhNZBg8puZB4slBwZD";
var to = "573013928129";
var oneChat = false;
var  idChat = "-OFgeOd2BaXFQqqmMLU_";

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
// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
   res.status(200);

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
  res.status(200);
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

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

  axios.post(
    `https://graph.facebook.com/v18.0/${recipientId}/messages`,
    {
      messaging_product: 'whatsapp', // Obligatorio
      to: to,               // Número del destinatario
      type: 'text',
      text: {
        body: `Visita este enlace: ${value}` // Cuerpo del mensaje con la URL
      },
      preview_url: true
    },
    {
      headers: {
        Authorization: `Bearer ${tokenFacebook}`, // Token de acceso
        'Content-Type': 'application/json'
      }
    }
  )
    .then(response => {
      console.log('Mensaje enviado con éxito:', response.data);
    })
    .catch(error => {
      console.error('Error al enviar el mensaje:', error.response?.data || error.message);
    });
}

function sendVideo(imageUrl) {
  axios
    .post("https://graph.facebook.com/v18.0/" + recipientId + "/messages", {
      headers: {
        Authorization: `Bearer ${tokenFacebook}`,
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

function sendMedia(title,imageUrl,typeUrl) {
  console.error("IMAGEN REFERENCIA: "+imageUrl);

  
  axios.post(
    `https://graph.facebook.com/v18.0/${recipientId}/messages`,
    {
      messaging_product: 'whatsapp', // Obligatorio
      to: to, // Número del destinatario
      type: 'image',
      image: {
        link: imageUrl, // Enlace a la imagen
        caption: title // Opcional
      }
    },
    {
      headers: {
        Authorization: `Bearer ${tokenFacebook}`, // Token de acceso
        'Content-Type': 'application/json'
      }
    }
  )
    .then(response => {
      console.log('Mensaje enviado con éxito:', response.data);
    })
    .catch(error => {
      console.error('Error al enviar el mensaje:', error.response?.data || error.message);
    });
}


function sendMediaVideo(title,imageUrl,typeUrl) {
  console.error("VIDEO REFERENCIA: "+imageUrl);

  
  axios.post(
    `https://graph.facebook.com/v18.0/${recipientId}/messages`,
    {
      messaging_product: 'whatsapp', // Obligatorio
      to: to, // Número del destinatario
      type: 'video',
      video: {
        link: imageUrl, // Enlace a la imagen
        caption: title // Opcional
      }
    },
    {
      headers: {
        Authorization: `Bearer ${tokenFacebook}`, // Token de acceso
        'Content-Type': 'application/json'
      }
    }
  )
    .then(response => {
      console.log('Mensaje enviado con éxito:', response.data);
    })
    .catch(error => {
      console.error('Error al enviar el mensaje:', error.response?.data || error.message);
    });
}
function sendEventAnalitics() {}

function validationMsj(value) {
  //VALIDA QUE LA RUTA NO SEA VACIA
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

          var type = dataItemSelected["type"];
          var route = dataItemSelected["routeStep"];

          var title = dataItemSelected["title"];

          if (type == "chat" || type == "text") {
            sendMsj(title, route, type, false);
            console.error("ENVIADA EL CHAT: " + route);

            setTimeout(() => {
              validationMsj(route);
            }, 1000);
          }
          if (type == "multiple") {
            if (repeatMessageOption == true) {
              repeatMessageOption = false;
              var keys = Object.keys(dataItemSelected["optionsStep"]);
              var position = 0;
              var result45 = true;
              keys.forEach(function (key) {
                console.log("datos: " + key);

                position += 1;
                console.log("global: " + messageGlobal.toLowerCase());

                if (key.toLowerCase() == messageGlobal.toLowerCase()) {
                  var list2 = dataItemSelected["optionsStep"];

                  var listProm = json2array(list2);
                  console.error("RESULTADO DE MULTIPLE: " + listProm);

                  var positionFinal = position - 1;
                  console.error("SELECCIONADO DE MULTIPLE: " + positionFinal);
                  var route = listProm[positionFinal];
                  console.error("RUTA SELECCIONADA MULTIPLE: " + route);

                  validationMsj(route);
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
                sendMsj(message, "route", "multiple", false);
              } else {
                sendMsj(message, route, type, false);
              }
            }
          }

          if (type == "terms") {
            //VALIDA POLICIAS
            console.error("VALIDA POLITICAS");
            var listString =
              "Aceptar los terminos y condiciones" +
              "\n" +
              "1.Aceptar" +
              "\n" +
              "2.Rechazar";
            if (repeatMessageOption == true) {
              
              console.error("VALIDA EL MENSAJE RESPUESTA POLITICAS: "+ messageGlobal );
              if (messageGlobal == "1") {

                var list2 = dataItemSelected["optionsStep"];

                  var listProm = json2array(list2);
                  


                  console.error("VALIDA EL CONTENIDO DE LA LISTA TEMS: "+ listProm );
                  var route = listProm[1];

                  console.error("RUTA SELECCIONADA TERMS"+ route);
                repeatMessageOption = false;
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
              console.error("ENVIA MENSAJE POLITICAS");
              sendMsj(listString, route, type, false);
            }
          }

          if (type == "answer") {
            var title = dataItemSelected["title"];

            if (repeatMessageOption == true) {
              repeatMessageOption = false;
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
              repeatMessageOption = false;
              validationMsj(route);

              console.error("GUARDANDO FORMULARIO");

              let lista = messageGlobal.split(", ");


           

              var city = lista[0];
              var company = lista[1];
              var consult = lista[2];
              var email = lista[3];
              var name = lista[4];
              var phone = lista[5];

              savedForm(city, company, consult, email, name, phone);

            //  sendMsj("Gracias por compartir", route, type, true);
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
              console.log("VALIDAR FINALIZACIÓN CHAT");
              if (messageGlobal == "1") {
                repeatMessageOption = false;
                sendMsj("Gracias por comunicarte", route, type, true);
              }

              if (messageGlobal == "2") {
                repeatMessageOption = false;
                repeatChat();
              }
              if (messageGlobal == "3") {
                repeatMessageOption = false;
                savedAlertAgentData();
                sendMsj("Buscando agentes disponibles", route, type, true);
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

            console.error("ENVIA MENSAJE MEDIA");
            var url = dataItemSelected["link"];
            var title = dataItemSelected["subtitle"];

            var type = dataItemSelected["typeUrl"];

            if (type == "Imagen") {
              sendMedia(title,url,'image');
            } else {
              sendMediaVideo(title,url,'video');
            }

            validationMsj(route);

            sendMsj(message, route, type, false);
          }
          if (type == "pause") {
            // var valuePause = dataItemSelected["value"];

            setTimeout(function () {
              validationMsj(route);
              sendMsj(message, route, type, false);
            }, 6000);
          }

          if (type == "analitic") {
            sendEventAnalitics();

            validationMsj(route);

            sendMsj(message, route, type, false);
          }

          if (type == "product") {
            var value = dataItemSelected["link"];

            sendLink(value);

            validationMsj(route);

            sendMsj(message, route, type, false);
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

    information: false,
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

  // if (notification == true) {
  console.error("----MENSAJE ENVIADO---" + messageText);

  await axios({
    method: "POST",
 
    url: `https://graph.facebook.com/v18.0/${recipientId}/messages`,
    headers: {
         Authorization: `Bearer ${tokenFacebook}`,
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
  //}

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
      "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/" +
        idChat +
        "/options/.json"
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
      oneChat = true;

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

    try {
      const response = await axios.get( "https://getdev-b2c0b.firebaseio.com/company/sly/chatMessage/whatsapp/.json");
      console.log(response.data); // Muestra los datos obtenidos
   
      const jsonData = JSON.stringify(response.data, null, 2); // Convierte a JSON legible
      console.log("Datos en formato JSONprincipal:", jsonData);
    //  console.log("Datos en formato JSONprincipal:", response.data);
      idChat = jsonData.replace('"', '').replace('"', '');

      console.log("Datos en formato JSONprincipal68: "+ idChat);
    } catch (error) {
      console.error('Error al obtener datos:', error.message);
    }

    

    // extract the business number to send the reply from it

    messageGlobal = message.text.body;

    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    recipientId = business_phone_number_id;

    repeatMessageOption = false;

    axios
      .get(
        "https://getdev-b2c0b.firebaseio.com/company/sly/messageUsers/" +
          recipientId +
          "/.json"
      )
      .then((response) => {
        //CONSULTA LOS MENSAJES DEL USUARIO

        if (response.data == null) {
          var messageData2 = {
            apertura: 0,
            typeOpen: "whatsapp",
            contactAdd: "nuevo",
            date: "2025-01-01 08:15",
            departamentTitle: "Nuevo23",
            getHelp: 1,
            idAgent: "d1",

            idChat: "/company/sly/chatbotCreateMessage/" + idChat,

            idEtiqueta: "d1",
            idMessage: "/company/sly/messageUsers/" + recipientId,
            idTrigger: "d1",
            ip: "1.0.1",
            levelService: 5,
            location: "http://localhost:55927/#/chatbot",
            mediaPlayer: 7,
            mediaResp: 4,
            mediaSesion: 5,
            messageUser: recipientId,
            name: "Segurex",
            open: "visitante",
            rating: 4,
            titleAgent: "Joser",
            titleEtiqueta: "Compras",
            titleTrigger: "Nuevo",
            totalHour: 4,
            type: "2",
          };

          //CREA LA INFORMACIÓN DE LA CONVERZACIÓN

          axios
            .post(
              "https://getdev-b2c0b.firebaseio.com/company/sly/infoChat/.json",
              messageData2
            )
            .then((response) => {
              repeatChat();
              //INICIA EL CHAT
            });
        } else {
          const jsonData = JSON.stringify(response.data, null, 2); // Convierte a JSON legible

          //  var recipientId = body.recipient_id;
          // var messageId = body.message_id;

          var obj = JSON.parse(jsonData);

          var listJson = json2array(obj);

          let dataItemSelected = [];

          //VALIDA LOS MENSAJES INFORMATIVOS
          for (var i = 0; i < json2array(obj).length; i++) {
            var dataItem = json2array(obj)[i];

            if (dataItem["information"] != true) {
              dataItemSelected.push(dataItem);
            }
          }

          // GENERA LA POSICION DE LAS 2 ULTIMAS
          var position = dataItemSelected.length - 2; //changed1

          var route = dataItemSelected[position]["routeStep"];
          console.error("LA RUTA EN EL INICIO DE LA APP1: " + route);
          if(route == "route"){

          route = dataItemSelected[dataItemSelected.length - 1]["routeStep"];

          }

          console.error("LA RUTA EN EL INICIO DE LA APP2: " + route);
          var type = dataItemSelected[dataItemSelected.length - 1]["type"];

          console.error("EL TIPO DE MENSAJE EN EL INICIO DE LA APP: " + type);

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
