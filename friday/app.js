// Elementos del DOM
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#habla");

// MP3 para indicar que el VR está activo
const vrActiveSound = new Audio('active.mp3');

// Configuración de reconocimiento de voz
const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new speechRecognition();

// Establecer idioma en español
recognition.lang = "es-ES";

// Variable para controlar si Perla está activa
let perlaActive = false;

// Función para enviar un mensaje MQTT
function sendMQTTMessage(topic, message) {
    const mqttMessage = new Paho.MQTT.Message(message);
    mqttMessage.destinationName = topic;
    mqttClient.send(mqttMessage);
}

// Diccionario de álbumes con enlaces
const albums = {
  "por siempre": "https://www.youtube.com/watch?v=TlFlP2BQmew&list=PLzoUNPFg0yEONgIwPf4W5HKRZHRJLST0m&autoplay=1",
  "un verano sin ti": "https://www.youtube.com/watch?v=p38WgakuYDo&list=PLRW7iEDD9RDStpKHAckdbGs3xaCChAL7Z&autoplay=1",
  "nadie sabe": "https://www.youtube.com/watch?v=qWL7Iy7jhKc&list=PLRW7iEDD9RDR3nExwJcID9uzkHI3y53YX&autoplay=1",
  "like mike": "https://www.youtube.com/watch?v=FgQbXQnKHO0&list=PLICSCPefPgxFm9Q6a7veD2MnAErlqEEjM&autoplay=1",
  "casete": "https://www.youtube.com/watch?v=zrAmTz1-VsA&list=PLICSCPefPgxGkpoJnmxB7CpqSf21CmHHQ&autoplay=1",
  "Sauce Boyz": "https://www.youtube.com/watch?v=9qk3srcv1To&list=PLKFDUctmsbgpiucNumyyWqJ4rnzFyShdW&autoplay=1",
  "monarca": "https://www.youtube.com/watch?v=u7jjJT8Dibg&list=PLKFDUctmsbgqEmHFT9CnBHa75LrqxwWaiautoplay=1",
  "tremendo": "https://www.youtube.com/watch?v=Li2fXHoDP1s&list=PLKFDUctmsbgocbq6_3G2UwmbO-nbpEtYAautoplay=1",
  "it was never there": "https://www.youtube.com/watch?v=OlStmta0Vh4autoplay=1",
  "hurt your feet": "https://www.youtube.com/watch?v=wKDU5pXhf5oautoplay=1",
  "after hours": "https://www.youtube.com/watch?v=ygTZZpVkmKg&list=RDwKDU5pXhf5o&index=6autoplay=1",
  "lost in the fire": "https://www.youtube.com/watch?v=ZGDGdRIxvd0&list=RDwKDU5pXhf5o&index=7autoplay=1",
  "one of the girls": "https://www.youtube.com/watch?v=f1r0XZLNlGQ&list=RDwKDU5pXhf5o&index=10autoplay=1",
  "after dark": "https://www.youtube.com/watch?v=sVx1mJDeUjY&list=RDsVx1mJDeUjY&start_radio=1&rv=sVx1mJDeUjY&t=2autoplay=1",
  "pastel": "https://www.youtube.com/watch?v=nld6DBwYI3k&list=RDEMEPMW0VGtXoEw5Qz4Yw6bhw&index=2autoplay=1",
  "destroy": "https://www.youtube.com/watch?v=9FSVPnVLUUQ&list=RDEMEPMW0VGtXoEw5Qz4Yw6bhw&index=6autoplay=1",
  "melting": "https://www.youtube.com/watch?v=RXG1IylsxvE&list=PLDb_G8HX8POTJMl1bmdmOfI9VHYNuRwtN&index=8autoplay=1",
  "amigos y enemigos": "https://www.youtube.com/watch?v=CngpTQz6hVU&list=RDEMbr9pK3cwMhULLg-oX7lNeQ&start_radio=1autoplay=1",
  "la paso cabron": "https://www.youtube.com/watch?v=XaYN6-iWgzEautoplay=1",
  "la llamada": "https://www.youtube.com/watch?v=miS3oyEcIBs&list=PLYzcQaInHXcdAewkeyP31s1469soPItLd&index=5autoplay=1",
  "uwaie": "https://www.youtube.com/watch?v=spbagny8OjMautoplay=1",
  "oana": "https://www.youtube.com/watch?v=lmDfmilZ4Xoautoplay=1",
  "alor on dance": "https://www.youtube.com/watch?v=8nW4jypamrAautoplay=1",
  "goosebumps": "https://www.youtube.com/watch?v=Dst9gZkq1a8autoplay=1",
  "outside": "https://www.youtube.com/watch?v=J9NQFACZYEUautoplay=1",
  "stereo love": "https://www.youtube.com/watch?v=qgnKpbnbAdgautoplay=1",
  "scared to be lonely": "https://www.youtube.com/watch?v=e2vBLd5Egnk&list=PLcLuEnKbFPHzt3awP6ofFyU9G6j1X6hje&index=24autoplay=1"
};
const commandsList = [
  "Abre Google: Abre el sitio web de Google.",
  "Busca <query>: Busca en Google con la consulta especificada.",
  "Reproduce <álbum>: Reproduce un álbum de YouTube.",
  "Enciende cuarto: Enciende las luces del cuarto.",
  "Apaga cuarto: Apaga las luces del cuarto.",
  "Cierra todas las ventanas: Cierra todas las ventanas abiertas.",
  "Ve a dormir: Detiene el reconocimiento y espera la activación.",
  "Perla: Reinicia el reconocimiento de voz.",
  "Qué hora es: Informa la hora actual.",
  "Abre YouTube: Abre el sitio web de YouTube.",
  "Quiero ver tus comandos: Muestra una lista de todos los comandos disponibles.",
  "Cuéntame un chiste: Perla te contará un chiste.",
  "Quiero escribir algo: Abre un popup para escribir en tiempo real y descargar el texto en un archivo .txt",
  "Abre WhatsApp: Abre el sitio web de WhatsApp Web.",
  "Calcula: podras hacer las siguientes operaciones (+,/,*,-,**)"
];
// Diccionario de chistes
const jokes = [
  "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.",
  "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
  "¿Por qué los esqueletos no pelean entre ellos? Porque no tienen agallas.",
  "¿Cómo se llama un dinosaurio que está durmiendo? ¡Un dino-sueño!",
  "¿Qué le dice una iguana a su hermana gemela? Somos iguanitas.",
  "¿Cuál es el colmo de un electricista? No encontrar su corriente de trabajo.",
  "¿Cómo se despiden los químicos? Ácido un placer.",
  "¿Qué hace una computadora cuando tiene hambre? ¡Se come un byte!",
  "¿Por qué los matemáticos odian la jungla? Porque hay demasiadas raíces cuadradas.",
  "¿Cómo te organizas una fiesta en el espacio? ¡Primero planeta!",
  "¿Por qué los peces no juegan al baloncesto? Porque tienen miedo a la red.",
  "¿Qué hace una abeja con un peine? ¡Se peina!",
  "¿Cómo se llama el primo optimista de Bruce Lee? ¡Felicidad Lee!",
  "¿Qué le dijo una impresora a otra? ¿Ese papel es tuyo o es una impresión mía?",
  "¿Por qué el libro de matemáticas estaba deprimido? ¡Porque tenía demasiados problemas!",
  "¿Qué le dice un semáforo a otro? No me mires, me estoy cambiando.",
  "¿Por qué el espagueti fue al gimnasio? ¡Para ser más fuerte!",
  "¿Cómo llama un pez a su novia? ¡Mi amorcito!",
  "¿Por qué los caracoles nunca prestan dinero? Porque odian los intereses.",
  "¿Qué le dice una pared a otra? Nos vemos en la esquina.",
  "¿Por qué el tomate nunca cruza la carretera? ¡Porque se hace puré!",
  "¿Qué le dijo un ojo al otro? Entre tú y yo, algo huele mal.",
  "¿Cómo sabes que la luna está llena? ¡Porque no cabe en ningún lado!",
  "¿Por qué el café no tiene amigos? ¡Porque siempre se amargura!",
  "¿Qué hace un mueble cuando está aburrido? ¡Se sienta!",
  "¿Qué pasa cuando llueve café? ¡El día se hace espresso!",
  "¿Por qué las bicicletas no se caen? ¡Porque están dos-tadas!",
  "¿Cómo te deja una hamburguesa triste? ¡Con muchas lástimas!",
  "¿Por qué el esqueleto fue a la fiesta solo? Porque no tenía cuerpo con quien ir.",
  "¿Qué le dijo el mar al otro mar? ¡Nada, solo se saludaron con las olas!",
  "¿Cuál es el colmo de un jardinero? ¡Que le dejen plantado!",
  "¿Por qué las computadoras nunca tienen hambre? Porque siempre están llenas de bits.",
  "¿Cómo se llama el campeón de buceo japonés? Tokofondo.",
  "¿Por qué los astronautas no cuentan chistes en el espacio? ¡Porque no tienen gravedad!",
  "¿Qué le dijo el número 0 al número 8? ¡Qué cinturón más bonito!",
  "¿Por qué los gatos no usan internet? ¡Porque no pueden encontrar el ratón!",
  "¿Cómo se despiden los pollos? ¡Hasta luego, polluelo!",
  "¿Qué hace un perro astronauta? ¡Da vueltas por el espacio ladrando a las estrellas!",
  "¿Por qué los pingüinos no van a la playa? Porque ya tienen su traje puesto.",
  "¿Qué le dice el pan al otro pan? ¡Tú me completas!"
];

// Función para guardar el texto en un archivo .txt
function saveTextAsFile(text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'texto.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// Variables para el popup de escritura
let isWriting = false;
let currentText = "";

// Función para mostrar el popup para escribir texto
function showWritingPopup() {
  if (isWriting) return; // Evitar múltiples popups

  isWriting = true;
  const popup = document.createElement('div');
  popup.id = 'writingPopup';
  popup.style.position = 'fixed';
  popup.style.bottom = '10px';
  popup.style.left = '10px';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.color = 'white';
  popup.style.padding = '10px';
  popup.style.borderRadius = '5px';
  popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  popup.style.zIndex = '1000';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 1s';

  const textarea = document.createElement('textarea');
  textarea.style.width = '300px';
  textarea.style.height = '200px';
  textarea.style.backgroundColor = '#222';
  textarea.style.color = '#fff';
  textarea.style.border = 'none';
  textarea.style.padding = '10px';
  textarea.style.borderRadius = '5px';
  textarea.placeholder = 'Empieza a escribir...';

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Guardar como archivo';
  saveButton.style.marginTop = '10px';
  saveButton.style.padding = '10px';
  saveButton.style.border = 'none';
  saveButton.style.borderRadius = '5px';
  saveButton.style.backgroundColor = '#007bff';
  saveButton.style.color = '#fff';
  saveButton.style.cursor = 'pointer';

  saveButton.addEventListener('click', () => {
    currentText = textarea.value;
    saveTextAsFile(currentText);
    document.body.removeChild(popup);
    isWriting = false;
  });

  popup.appendChild(textarea);
  popup.appendChild(saveButton);
  document.body.appendChild(popup);

  // Animar el popup
  setTimeout(() => {
    popup.style.opacity = '1';
  }, 100);
}
recognition.onstart = function () {
  console.log("Escuchando...");
};

let waitingForCommand = false;
let waitTimer;

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase().trim();
  console.log(`Tú: ${transcript}`);

  // Mostrar el comando reconocido en el div de mensajes
  const messagesContainer = document.getElementById('messagesContainer');
  const messageElement = document.createElement('p');
  messageElement.textContent = `Tú: ${transcript}`;
  messagesContainer.appendChild(messageElement);

  // Mostrar mensaje solo por 8 segundos
  setTimeout(() => {
    messageElement.remove();
  }, 8000);

  if (transcript.includes("perla") || transcript.includes("verla")) {
    activatePerla();
  } else if (perlaActive || waitingForCommand) {
    processCommand(transcript);
  }
};

function activatePerla() {
  perlaActive = true;
  waitingForCommand = true;
  clearTimeout(waitTimer);
  
  const frases = [
    "Sí, dime",
    "¿En qué puedo ayudarte?",
    "Te escucho",
    "¿Qué necesitas?",
    "Aquí estoy",
    "Sí"
  ];

  const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
  
  readOut(fraseAleatoria);
  showIndicator();
  vrActiveSound.play();

  waitForNextCommand();
}
// Almacenar las ventanas abiertas
let openedWindows = [];

// Función para abrir una nueva ventana y almacenarla en el arreglo
function openWindow(url) {
  let newWindow = window.open(url, "_blank");
  if (newWindow) {
    openedWindows.push(newWindow);
  }
}

// Función mejorada para manejar operaciones matemáticas
function handleMathOperation(expression) {
  console.log("Expresión original:", expression);

  // Convertir palabras a símbolos matemáticos
  expression = expression.replace(/más/g, '+')
                         .replace(/menos/g, '-')
                         .replace(/por/g, '*')
                         .replace(/multiplicado por/g, '*')
                         .replace(/dividido por|entre/g, '/')
                         .replace(/elevado a/g, '**');

  console.log("Expresión después de reemplazo:", expression);

  // Eliminar cualquier carácter que no sea número, operador o espacio
  expression = expression.replace(/[^0-9+\-*/.\s]/g, '');

  console.log("Expresión limpia:", expression);

  // Manejar raíz cuadrada
  if (expression.includes("raíz cuadrada")) {
    let num = expression.split("raíz cuadrada de")[1].trim();
    return Math.sqrt(parseFloat(num));
  }

  // Evaluar la expresión
  try {
    let result = Function(`'use strict'; return (${expression})`)();
    console.log("Resultado:", result);
    return result;
  } catch (error) {
    console.error("Error al evaluar la expresión:", error);
    return null;
  }
}
function processCommand(transcript) {

  // Comando para operaciones matemáticas
  if ( transcript.includes("calcula")) {
    let mathExpression = transcript.replace(/cuanto es|calcula/gi, "").trim();
    console.log("Expresión matemática extraída:", mathExpression);
    
    let result = handleMathOperation(mathExpression);
    
    if (result !== null) {
      readOut(`El resultado es ${result}`);
    } else {
      readOut("Lo siento, no pude calcular esa operación. Por favor, intenta nuevamente.");
    }
  }
if (transcript.includes("abre whatsapp")) {
  window.open("https://web.whatsapp.com", "_blank");
  readOut("okay");
}
 // Comando "quiero escribir algo"
 if (transcript.includes("quiero escribir algo")) {
  readOut("Abriendo el editor de texto.");
  showWritingPopup();
}
 // Comando "quiero ver tus comandos"
 if (transcript.includes("quiero ver tus comandos")||transcript.includes("muéstrame tus comandos")) {
  showCommandsPopup();
}
if (transcript.includes("cierra todas las ventanas") || transcript.includes("cierra todas las pestañas")) {
  readOut("Cerrando todas las ventanas.");
  openedWindows.forEach(win => win.close());
  openedWindows = []; // Limpiar el arreglo una vez que se cierren las ventanas
}
if (transcript.includes("dormir")||(transcript.includes("go to sleep"))) {
  readOut("OKEY, si necesitas algo solo DI mi nombre");
  recognition.stop(); // Detiene el reconocimiento de voz
  return; // Termina la función para que no procese más comandos
}
 // Comando "cuéntame un chiste"
 if (transcript.includes("cuéntame un chiste") || transcript.includes("tell me a joke")|| transcript.includes("cuéntame otro chiste")) {
  readOut("Aquí va un chiste para ti.");
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  readOut(randomJoke);
}
  // Comando "abre google"
  if (transcript.includes("abre google")||transcript.includes("open google")) {
    readOut("Abriendo Google");
    window.open("https://www.google.com/");
  }
  //gracias
  if (transcript.includes("gracias") || transcript.includes("thank you")) {
    respondToThanks();
  }
  if (transcript.includes("¿por qué?") ) {
    respondTo2();
  }
  if (transcript.includes("sí")||transcript.includes("sí, hablemos.") ) {
    // Responder amablemente y entablar una conversación
    const respuestasConversacion = [
      "Ok , que te parece si hablamos del gymnasio ",
      "sobre que tema de gustaria hablar ",
      "claro hablemos un poco"
    ];
  
    // Seleccionar una respuesta aleatoria
    const respuestaAleatoria = respuestasConversacion[Math.floor(Math.random() * respuestasConversacion.length)];
  
    // Leer la respuesta seleccionada
    readOut(respuestaAleatoria);
  }
  if (transcript.includes("cásate conmigo.")||(transcript.includes("novia") )) {
    respondTo3();
  }
  if (transcript.includes("aquí está luis manuel") || transcript.includes("luismanuel") || transcript.includes("hermano")) {
    // Responder amablemente y entablar una conversación
    const respuestasConversacion = [
      "¡Hola! ¿Cómo estás? ¿Qué puedo hacer por ti hoy?",
      "¡Hola, Luis Manuel! ¿En qué puedo ayudarte?",
      "¡Hola, Luis manuel! ¿Necesitas algo o quieres charlar un poco?"
    ];
  
    // Seleccionar una respuesta aleatoria
    const respuestaAleatoria = respuestasConversacion[Math.floor(Math.random() * respuestasConversacion.length)];
  
    // Leer la respuesta seleccionada
    readOut(respuestaAleatoria);
  }
 
  if (transcript.includes("oye") ) {
    respondTo();
  }

  
  if (transcript.includes("creador") || transcript.includes("¿quién te creó?")|| transcript.includes(" ¿quién te hizo?")) {
    respondToCreator();
    window.open("https://github.com/Jolitechrdcoder");
  }

  // Comando "busca"
  if (transcript.includes("busca")) {
    readOut("Buscando en Google");
    let query = transcript.split("busca ")[1].split(" ").join("+");
    window.open(`https://www.google.com/search?q=${query}`);
  }

  // Comando "abre youtube"
  if (transcript.includes("abre youtube")||transcript.includes("open youtube")) {
    readOut("Abriendo YouTube");
    window.open("https://www.youtube.com/");
  }
 
  // Comando "qué hora es"
if (transcript.includes("qué hora es") || transcript.includes("¿what time is it?")|| transcript.includes("what time is it")|| transcript.includes("dime la hora")||transcript.includes("¿qué horas son?")) {
  const now = new Date();
  const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // Formato de 12 horas con AM/PM
  };
  const timeFormatter = new Intl.DateTimeFormat('es-ES', timeOptions);
  const time = timeFormatter.format(now);
  readOut(`Son las ${time}`);
}

   // Comando "reproduce álbum"
   if (transcript.includes("reproduce")) {
    let album = transcript.split("reproduce")[1].trim();
    
    // Buscar álbum que coincida parcialmente con el nombre
    let foundAlbum = Object.keys(albums).find(key => album.includes(key));
    
    if (foundAlbum) {
      readOut(`Reproduciendo${foundAlbum}`);
      window.open(albums[foundAlbum], "_blank");
    } else {
      readOut(`No se encontró el álbum ${album}`);
    }
  }

  // Comando "enciende cuarto"
  if (transcript.includes("enciende cuarto") || transcript.includes("enciende el cuarto") || transcript.includes("enciende el bombillo") 
    || transcript.includes("enciende luz") || transcript.includes("enciende la luz")||transcript.includes("turn on lights")) {
    readOut("OKEY");
    sendMQTTMessage("ASIST", "OFF1"); 
  }

  // Comando "apaga cuarto"
  if (transcript.includes("apaga cuarto") || transcript.includes("apaga el cuarto") || transcript.includes("apaga el bombillo") || 
  transcript.includes("apaga la luz") || transcript.includes("apaga luz")||transcript.includes("turn of lights")) {
    readOut("LISTO");
    sendMQTTMessage("ASIST", "ON1");
  }
   // Comando "perla"
   if (transcript.includes("perla")||transcript.includes("verla")) {
    
    recognition.stop(); // Detiene el reconocimiento actual
    recognition.start(); // Reinicia el reconocimiento de voz
    
    return; // Termina la función para que no procese más comandos
  }
  
 
  // Después de procesar el comando
  waitForNextCommand();
}
function waitForNextCommand() {
  clearTimeout(waitTimer);
  waitTimer = setTimeout(() => {
    perlaActive = false;
    waitingForCommand = false;
    hideIndicator();
    readOut(" ");
  }, 10000);
}
  // Otros comandos...
  function respondToThanks() {
    const respuestas = [
      "De nada, estoy aquí para ayudarte.",
      "Es un placer poder asistirte.",
      "No hay de qué, siempre a tu disposición.",
      "Me alegra haber sido de ayuda.",
      "Cuando quieras, para eso estoy.",
      "Encantada de ayudarte.",
      "No es nada, espero haber sido útil.",
      "Gracias a ti por utilizarme.",
      "Siempre es un placer poder ayudar.",
      "Me alegro de que mi asistencia haya sido útil."
    ];
  
    const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
    readOut(respuestaAleatoria);
  }

  function respondToCreator() {
    const respuestas = [
      "Mi creador es Jorge Luis Martínez. Te dejaré su perfil de GitHub.",
      "A veces me enojo con él, pero mi creador es Jorge Luis. Te dejaré su perfil de GitHub."
     
    ];

    // Seleccionar una respuesta aleatoria
    const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
  
    // Usar la función de lectura para decir la respuesta aleatoria
    readOut(respuestaAleatoria);
  }

  function respondTo() {
    const respuestas = [
      "Sii?",
      "que?"
     
    ];

    // Seleccionar una respuesta aleatoria
    const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
  
    // Usar la función de lectura para decir la respuesta aleatoria
    readOut(respuestaAleatoria);
  }
  function respondTo2() {
    const respuestas = [
      "porque no , tontito",
      "porque la vida es buena como yo.",
      "no hay que ser tan inteligente para saber que soy un programa tontito",
      "simplemente lo nuestro no funcionaria soy un programa, te insto a conocer a alguien de la vida real."

     
    ];

    // Seleccionar una respuesta aleatoria
    const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
  
    // Usar la función de lectura para decir la respuesta aleatoria
    readOut(respuestaAleatoria);
  }
  function respondTo3() {
    const respuestas = [
      "NOOO",
      "NOPE",
      "SORRY PERO NO"
     
    ];

    // Seleccionar una respuesta aleatoria
    const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
  
    // Usar la función de lectura para decir la respuesta aleatoria
    readOut(respuestaAleatoria);
  }
  
// Función para mostrar el popup con los comandos disponibles
function showCommandsPopup() {
  const popup = document.createElement('div');
  popup.id = 'commandsPopup';
  popup.style.position = 'fixed';
  popup.style.bottom = '10px';
  popup.style.left = '10px';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.color = 'white';
  popup.style.padding = '10px';
  popup.style.borderRadius = '5px';
  popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  popup.style.zIndex = '1000';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 1s';
  popup.innerHTML = '<h4>Comandos disponibles:</h4><ul>' +
    commandsList.map(command => `<li>${command}</li>`).join('') +
    '</ul>';
  
  document.body.appendChild(popup);

  // Animar el popup
  setTimeout(() => {
    popup.style.opacity = '1';
  }, 100);

  // Eliminar el popup después de 15 segundos
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.remove();
    }, 1000); // Tiempo de transición antes de eliminar el elemento
  }, 15000);
}


// Función de stop
recognition.onend = function () {
  console.log("Reconocimiento de voz finalizado");
  // Reiniciar el reconocimiento para que siempre esté escuchando
  recognition.start();
};

// Permitir reconocimiento continuo
recognition.continuous = true;

// Botones de iniciar y detener reconocimiento de voz
startBtn.addEventListener("click", () => {
  recognition.start();
});

stopBtn.addEventListener("click", () => {
  recognition.stop();
});

// Definir variable para almacenar voces
let voices = [];

// Función para hacer que "Perla" hable
function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  voices = window.speechSynthesis.getVoices();

  const spanishVoice = voices.find((voice) => voice.lang.includes("es"));
  if (spanishVoice) {
    speech.voice = spanishVoice;
  }

  speech.text = message;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
  
  // Mostrar mensaje del asistente en pantalla
  const messagesContainer = document.getElementById('messagesContainer');
  const messageElement = document.createElement('p');
  messageElement.textContent = `Perla: ${message}`;
  messagesContainer.appendChild(messageElement);

  // Mostrar mensaje solo por 4 segundos
  setTimeout(() => {
    messageElement.remove();
  }, 8000); // Elimina el mensaje después de 4 segundos
}
// Cargar voces cuando estén disponibles
window.speechSynthesis.onvoiceschanged = function () {
  voices = window.speechSynthesis.getVoices();
  console.log("Voces cargadas", voices);
};

// Evento para el botón de hablar
speakBtn.addEventListener("click", () => {
  readOut("Hola, soy Perla");
});

// Iniciar el reconocimiento de voz al cargar la página
window.onload = function () {
  recognition.start();
};
function generateClientId() {
  return 'clientId-' + Math.random().toString(16).substr(2, 8) + '-' + Date.now();
}
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateRandomPassword(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@!';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
// Configuración MQTT
var hostname = "mqtt-dashboard.com";
var port = 8884;
var clientId = generateClientId();
var username = generateRandomString(8);  // Genera un nombre de usuario de 8 caracteres
var password = generateRandomPassword(12);  // Genera una contraseña de 12 caracteres
var subscriptions = ["perla"];
var mqttClient = new Paho.MQTT.Client(hostname, port, clientId);

mqttClient.onMessageArrived = MessageArrived;
mqttClient.onConnectionLost = ConnectionLost;
Connect();

function Connect() {
    mqttClient.connect({
        onSuccess: Connected,
        onFailure: ConnectionFailed,
        keepAliveInterval: 10,
        userName: username,
        useSSL: true,
        password: password
    });
    showIndicator2();
}

function Connected() {
    console.log("Connected");
    subscriptions.forEach(topic => mqttClient.subscribe(topic));
}

function ConnectionFailed(res) {
  showIndicator3();
  hideIndicator2();
    console.log("Connect failed: " + res.errorMessage);
}

function ConnectionLost(res) {
    if (res.errorCode != 0) {
        showIndicator3();
        hideIndicator2();
        console.log("Connection Lost: " + res.errorMessage);
    }
}

function MessageArrived(message) {
    console.log("Message arrived: " + message.payloadString);
    // readOut("Mensaje recibido: " + message.payloadString);
}

// Función para mostrar el indicador
function showIndicator() {
  const indicator = document.getElementById('indicator');
  indicator.style.display = 'block';
}

// Función para ocultar el indicador
function hideIndicator() {
  const indicator = document.getElementById('indicator');
  indicator.style.display = 'none';
}
function showIndicator2() {
  const indicator = document.getElementById('indicator2');
  indicator.style.display = 'block';
}

// Función para ocultar el indicador
function hideIndicator2() {
  const indicator = document.getElementById('indicator2');
  indicator.style.display = 'none';
}

function showIndicator3() {
  const indicator = document.getElementById('indicator3');
  indicator.style.display = 'block';
}

// Función para ocultar el indicador
function hideIndicator3() {
  const indicator = document.getElementById('indicator3');
  indicator.style.display = 'none';
}
