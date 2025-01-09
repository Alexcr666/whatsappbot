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
var activeChat = true;
var opcionesMultiple  = [];
var idChat = "-OFgeOd2BaXFQqqmMLU_";

var messageGlobal = "";
var initChat = true;

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

const {
  WEBHOOK_VERIFY_TOKEN,
  GRAPH_API_TOKEN,
  PORT
} = process.env;
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
      if (response.status == 200) {}
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
      if (response.status == 200) {}
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
      if (response.status == 200) {}
    });
}

function sendLink(value) {

  axios.post(
      `https://graph.facebook.com/v18.0/${recipientId}/messages`, {
        messaging_product: 'whatsapp', // Obligatorio
        to: to, // Número del destinatario
        type: 'text',
        text: {
          body: `Visita este enlace: ${value}` // Cuerpo del mensaje con la URL
        },
        preview_url: true
      }, {
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

function sendMedia(title, imageUrl, typeUrl) {
  console.error("IMAGEN REFERENCIA: " + imageUrl);


  axios.post(
      `https://graph.facebook.com/v18.0/${recipientId}/messages`, {
        messaging_product: 'whatsapp', // Obligatorio
        to: to, // Número del destinatario
        type: 'image',
        image: {
          link: imageUrl, // Enlace a la imagen
          caption: title // Opcional
        }
      }, {
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


function sendMediaVideo(title, imageUrl, typeUrl) {
  console.error("VIDEO REFERENCIA: " + imageUrl);


  axios.post(
      `https://graph.facebook.com/v18.0/${recipientId}/messages`, {
        messaging_product: 'whatsapp', // Obligatorio
        to: to, // Número del destinatario
        type: 'video',
        video: {
          link: imageUrl, // Enlace a la imagen
          caption: title // Opcional
        }
      }, {
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


async function sendDynamicList() {

  const options = opcionesMultiple // Lista dinámica de opciones

  
  // Construir la lista dinámica de opciones
  const rows = options.map((option, index) => ({
    id: `option_${index + 1}`,
    title: option,
   // description: `${option}`
  }));

  // Construir la solicitud JSON
  const requestBody = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "Selecciona una opción"
      },
      body: {
        text: "Por favor selecciona una de las opciones siguientes:"
      },
      footer: {
        text: "Gracias por tu respuesta"
      },
      action: {
        button: "Ver opciones",
        sections: [
          {
            title: "Opciones disponibles",
            rows: rows
          }
        ]
      }
    }
  };

  // Enviar la solicitud HTTP con Axios
  try {


    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${recipientId}/messages`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenFacebook}`
        }
      }
    );

    console.log("Mensaje enviado con éxito:", response.data);
    opcionesMultiple = [];
  } catch (error) {
    console.error("Error al enviar el mensaje:", error.response?.data || error.message);
  }
}

function validationMsj(value) {
  //VALIDA QUE LA RUTA NO SEA VACIA


  setTimeout(() => {


    console.log("VALIDANDO CREATE4" + value + " " + "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/" +
      idChat +
      "/options/" +
      value +
      "/.json");
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
         
            var jsonData = JSON.stringify(response.data, null, 2);

            var dataItemSelected = JSON.parse(jsonData);

            var type = dataItemSelected["type"];
            var route = dataItemSelected["routeStep"];

            var title = dataItemSelected["title"];

            if (type == "chat" || type == "text") {
              repeatMessageOption = false;
              sendMsj(title, route, type, false);

              console.error("ENVIADA EL CHAT: " + route);


              validationMsj(route);

            }
            if (type == "multiple") {
              //  sendMultipleButtonTemplates();
              if (repeatMessageOption == true) {
                repeatMessageOption = false;
                var keys = Object.keys(dataItemSelected["optionsStep"]);
                var position = 0;
                var success = false;

                keys.forEach(function (key) {
                  console.log("datos: " + key);

                  position += 1;
                  console.log("global: " + messageGlobal.toLowerCase());

                  if (key.toLowerCase() == messageGlobal.toLowerCase()) {
                    success = true;
                    var list2 = dataItemSelected["optionsStep"];

                    var listProm = json2array(list2);
                    console.error("RESULTADO DE MULTIPLE: " + listProm);

                    var positionFinal = position - 1;
                    console.error("SELECCIONADO DE MULTIPLE: " + positionFinal);
                    var routeMultiple = listProm[positionFinal];
                    console.error("RUTA SELECCIONADA MULTIPLE: " + routeMultiple);
                    var newData = {
                      routeStep: routeMultiple,

                    };

                    console.log("VALIDANDO CREATE1-");
                    /* axios
                       .patch(
                         "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/" +
                         idChat +
                         "/options/" +
                         value +
                         "/.json", newData
                       )
                       .then((response) => {
                         console.log('Datos actualizados23:', response.data);

                       });*/

                    validationMsj(routeMultiple);
                  }
                });

                if (success == false) {
                  sendMsj(
                    "No reconocemos esta opción",
                    route,
                    type,
                    true
                  );

                }
              } else {
                console.error("DATOS SELECTED1------: " + route);

                var list2 = dataItemSelected["optionsMulti"];

                var list = json2array(list2);

                console.log("longitud: " + list[0]);

                var listString = "";
                opcionesMultiple = list;


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

                repeatMessageOption = true;
                sendMsj(message, "route", "multiple", false);
                /* if (route == undefined) {
            
                   sendMsj(message, "route", "multiple", false);
               



              } else {
                repeatMessageOption = true;
                sendMsj(message, route, type, false);
              }*/
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

              opcionesMultiple = ["Aceptar", "Rechazar"];
              if (repeatMessageOption == true) {

                console.error("VALIDA EL MENSAJE RESPUESTA POLITICAS: " + messageGlobal);
                if (messageGlobal == "Aceptar") {

                  var list2 = dataItemSelected["optionsStep"];




                  var listProm = json2array(list2);



                  console.error("VALIDA EL CONTENIDO DE LA LISTA TEMS: " + listProm);




                  var position = 0;

                  var keys = Object.keys(dataItemSelected["optionsStep"]);
                  keys.forEach(function (key) {

                    position += 1;


                    if (key.toLowerCase() == "si") {

                      var positionFinal = position - 1;
                      route = listProm[positionFinal];
                      console.log("VALIDANDO CREATE2");

                    }
                  });

                  console.error("RUTA SELECCIONADA TERMS" + route);
                  repeatMessageOption = false;
                  opcionesMultiple = [];
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
                repeatMessageOption = true;
                console.error("ENVIA MENSAJE POLITICAS");
                sendMsj(listString, "route", type, false);
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
                sendMsj(title, "route", type, true);
              }
            }

            if (type == "email") {

              sendMsj("Enviado email", route, type, true);


              validationMsj(route);




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




                console.error("GUARDANDO FORMULARIO");
                let lista = messageGlobal.split(", ");

                if (lista.length == 4) {
                  validationMsj(route);

                  var city = lista[0];
                  var company = lista[1];
                  var consult = lista[2];
                  var email = lista[3];
                  var name = lista[4];
                  var phone = lista[5];


                  savedForm(city, company, consult, email, name, phone);
                } else {

                  sendMsj("Faltan campos por llenar", route, type, true);
                }

                //  sendMsj("Gracias por compartir", route, type, true);
              } else {
                repeatMessageOption = true;
                sendMsj(listString, "route", type, false);
              }
            }

            if (type == "agent") {
              savedAlertAgentData();
              sendMsj("Buscando agentes disponibles", route, type, true);
              validationMsj(route);
            }

            if (type == "end") {
              if (repeatMessageOption == true) {
                console.log("VALIDAR FINALIZACIÓN CHAT");
                opcionesMultiple = [];
                if (messageGlobal == "Si") {

                  repeatMessageOption = false;
                  sendMsj("Gracias por comunicarte", route, type, true);
                  setTimeout(function () {
                    repeatChat();

                  }, 3000);


                } else {

                  if (messageGlobal == "Ir al inicio") {
                    repeatMessageOption = false;

                    for (var i = 0; i < closeTriggers.length; i++) {

                      var value = closeTriggers[i];

                      sendMsjAdmin(value);


                    }


                    repeatChat();
                  } else {
                    if (messageGlobal == "Contactar a un acesor") {
                      repeatMessageOption = false;
                      savedAlertAgentData();
                      sendMsj("Buscando agentes disponibles", route, type, true);
                    } else {
                      sendMsj("Elige alguna opción", route, type, true);
                    }

                  }
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

                opcionesMultiple = ["Si", "Ir al inicio", "Contactar a un acesor"]
                repeatMessageOption = true;

                // sendMsj(listString, route, type, true);
                sendMsj(listString, "route", type, true);
              }
            }
            if (type == "media") {

              console.error("ENVIA MENSAJE MEDIA");
              var url = dataItemSelected["link"];
              var title = dataItemSelected["subtitle"];

              var type = dataItemSelected["typeUrl"];

              if (type == "Imagen") {
                sendMedia(title, url, 'image');
              } else {
                sendMediaVideo(title, url, 'video');
              }

              validationMsj(route);

              sendMsj(message, route, type, false);
            }
            if (type == "pause") {
              // var valuePause = dataItemSelected["value"];

              setTimeout(function () {
                sendMsj(message, route, type, false);
                validationMsj(route);

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


              for (var i = 0; i < openProductTriggers.length; i++) {

                var value = openProductTriggers[i];

                sendMsjAdmin(value);


              }
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
  }, 500);
}



async function sendMsj(
  messageText,
  route,
  type,
  /* information,*/
  notification
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
  if(opcionesMultiple.length == 0){
  await axios({
    method: "POST",

    url: `https://graph.facebook.com/v18.0/${recipientId}/messages`,
    headers: {
      Authorization: `Bearer ${tokenFacebook}`,
    },
    data: {
      messaging_product: "whatsapp",
      to: to,
      text: {
        body: messageText
      },
      /* context: {
          message_id: messageFinal.id, // shows the message as a reply to the original user message
        },*/
    },
  }).catch((error) => {
    console.error("errorfirebaseend: msj: " + error); // Manejo de errores
  });
}else{
  sendDynamicList();
}

  
  console.log("routeSend: " + route);
  
}

function repeatChat() {
  console.log("VALIDANDO CREATE3");
  axios
    .get(
      "https://getdev-b2c0b.firebaseio.com/company/sly/chatbotCreateMessage/" +
      idChat +
      "/options/.json"
    )
    .then((response) => {
      var jsonData = JSON.stringify(response.data, null, 2); // Convierte a JSON legible
      console.log("Datos en formato JSON:", jsonData);

      //   var recipientId = body.recipient_id;
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
if(dataItem["welcome"] != null){
        console.log("welcome: " + dataItem["welcome"]);

        if (dataItem["welcome"] == true) {
          dataItemSelected = dataItem;
        }
      }
      }
      

      console.log("Successfully firebase2: " + dataItemSelected["id"] + "  :  ");

      var route = dataItemSelected["id"];



      validationMsj(route);
    });
}



function createInfoChat() {
  // var recipientId = "hola";
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
    type: "1",
  };

  //CREA LA INFORMACIÓN DE LA CONVERZACIÓN

  axios
    .post(
      "https://getdev-b2c0b.firebaseio.com/company/sly/infoChat/.json",
      messageData2
    )
    .then((response) => {


      repeatChat();
      //repeatChat();
      //INICIA EL CHAT
    });
}




const closeTriggers = [];
const openProductTriggers = [];

function initTimeFun(description) {

}

function sendMsjAdmin(description) {

  opcionesMultiple = [];
  sendMsj(description, "route", "chat", false);

}

async function triggersFun() {



  try {
    // Hacer la solicitud GET a Firebase
    const response = await axios.get(
      "https://getdev-b2c0b.firebaseio.com/company/sly/triggers" +

      "/.json"
    );

    // Verificar si hay datos disponibles
    if (response.data) {
      const dataTriggersChat = response.data;
      console.log("consumir triggers: " + dataTriggersChat);
      // Iterar sobre los hijos del nodo "triggers"
      Object.keys(dataTriggersChat).forEach((key) => {
        const dataEvent = dataTriggersChat[key];
        const description = dataEvent.description;

        console.log("triggers1: " + dataEvent.event);




        if (dataEvent.event == "Inactivo por 30 segundos") {
          initTimeFun(description);
        }

        if (dataEvent.event == "Abrir chat") {

          console.log("triggers2: " + dataEvent.event + " " + description);
          sendMsjAdmin(description);
        }

        if (dataEvent.event == "Cerrar chat") {
          closeTriggers.push(description);
        }

        if (dataEvent.event == "Abrir un producto") {
          openProductTriggers.push(description);
        }
      });
    } else {
      console.log("No data available in triggers");
    }
  } catch (error) {
    console.error("Error fetching triggers:", error);
  }

}

async function sendMsjNoNotification(
  messageText,
  route,
  type,
  /* information,*/
  notification
) {
  //if(route != null){
  console.log("-----sendmsj---: " + route);

  console.log("routestep1: " + messageText);
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
       

        console.log("Successfully firebase id ");
      } else {
        console.error("Unable to send message.");
        console.error(response);
      }
    });

}
app.post("/webhook", async (req, res) => {
  // log incoming messages

  //console.log("Incoming webhook message2:",req.body);
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  try {
    // Imprimir el JSON recibido para depuración
    console.log("JSON recibido:", JSON.stringify(req.body, null, 2));

    // Extraer el `title` desde el JSON
    const messageEntry = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (messageEntry?.interactive?.type === "list_reply") {
      const title = messageEntry.interactive.list_reply.title; // Obtén el `title`
      console.log("Titulo seleccionado:", title);
    } else {
      console.log("No es un mensaje interactivo de tipo 'list_reply'.");
    }

    // Responder al servidor de Meta
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al procesar el webhook:", error.message);
    res.sendStatus(500);
  }


  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?. [0]?.changes[0]?.value?.messages?. [0];

  messageFinal = message;
  // check if the incoming message contains text
  if (message?.type === "text") {

    try {
      const response = await axios.get("https://getdev-b2c0b.firebaseio.com/company/sly/chatMessage/whatsapp/.json");
      console.log(response.data); // Muestra los datos obtenidos

      const jsonData = JSON.stringify(response.data, null, 2); // Convierte a JSON legible
      console.log("Datos en formato JSONprincipal:", jsonData);
      //  console.log("Datos en formato JSONprincipal:", response.data);
      idChat = jsonData.replace('"', '').replace('"', '');

      console.log("Datos en formato JSONprincipal68: " + idChat);
    } catch (error) {
      console.error('Error al obtener datos:', error.message);
    }



    // extract the business number to send the reply from it

    messageGlobal = message.text.body;

    const changes = req.body.entry?.[0]?.changes?.[0];
    const messages = changes?.value?.messages?.[0];
console.log("messageglobal1: "+messageGlobal+" "+message);
    if (messages?.interactive?.type === "list_reply") {
      const from = messages.from; // Número del usuario
      const selectedOptionId = messages.interactive.list_reply.id; // ID de la opción seleccionada
      const selectedOptionTitle = messages.interactive.list_reply.title; // Título de la opción
      const selectedOptionDescription = messages.interactive.list_reply.description; // Descripción de la opción

      console.log(`Usuario ${from} seleccionó la opción:`);
      console.log(`ID: ${selectedOptionId}`);
      console.log(`Título: ${selectedOptionTitle}`);
      console.log(`Descripción: ${selectedOptionDescription}`);
    }

    const business_phone_number_id =
      req.body.entry?. [0].changes?. [0].value?.metadata?.phone_number_id;

    recipientId = business_phone_number_id;





    function executeInit() {

      axios
        .get(
          "https://getdev-b2c0b.firebaseio.com/company/sly/messageUsers/" +
          recipientId +
          "/.json"
        )
        .then((response) => {
          //CONSULTA LOS MENSAJES DEL USUARIO

          if (response.data == null) {

            console.log("CREATE INFO CHAT");


            //CREA LA INFORMACIÓN DE LA CONVERZACIÓN

            createInfoChat();
          } else {

            console.log("CREATE INFO CHAT2");
            var jsonData = JSON.stringify(response.data, null, 2); // Convierte a JSON legible

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
            if (route == "route") {

              route = dataItemSelected[dataItemSelected.length - 1]["routeStep"];

            }

            console.error("LA RUTA EN EL INICIO DE LA APP2: " + route);
            var type = dataItemSelected[dataItemSelected.length - 1]["type"];

            console.error("EL TIPO DE MENSAJE EN EL INICIO DE LA APP: " + type);

            if (route != undefined) {



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
            } else {
              repeatMessageOption = false;
              sendMsj("No hay mas opciones", "route", type, false);
              sendMsj("Iniciando chat", "route", type, false);



              setTimeout(function () {
                repeatChat();

              }, 1500);
            }
          }
        })
        .catch((error) => {
          console.log(error); // Manejo de errores
        });

    }
    try {
      var response = await axios.get("https://getdev-b2c0b.firebaseio.com/company/sly/activeChat/.json");
      console.log("tokenfacebook: " + response.data); // Muestra los datos obtenidos
      var jsonData = JSON.stringify(response.data, null, 2);

      var dataItemSelected = JSON.parse(jsonData);
     // tokenFacebook = dataItemSelected["tokenFacebook"];


      activeChat = dataItemSelected["active"];

      console.log("validinit: " + activeChat + " : " + tokenFacebook);



      //process.env.PAGE_ACCESS_TOKEN = tokenFacebook ;






      console.log("tokenfacebook: " + response.data);

    } catch (e) {

    }

    if (activeChat) {



      try {
        var response = await axios.get("https://getdev-b2c0b.firebaseio.com/company/sly/chatMessage/whatsapp/.json");
        console.log(response.data); // Muestra los datos obtenidos

        var jsonData = JSON.stringify(response.data, null, 2); // Convierte a JSON legible
        console.log("Datos en formato JSONprincipal:", jsonData);
        //  console.log("Datos en formato JSONprincipal:", response.data);
        idChat = jsonData.replace('"', '').replace('"', '');

        executeInit();


        setTimeout(function () {
          if (initChat) {
            initChat = false;

            //triggersFun();
          }

        //  sendMsjNoNotification(messageGlobal, "information", "chat", true);

        }, 500);


        console.log("Datos en formato JSONprincipal68: " + idChat);
      } catch (error) {
        console.error('Error al obtener datos:', error.message);
      }
    } else {


      sendMsj("Chat no disponible", "information", "chat", true);

    }





  }

  res.sendStatus(200);
});