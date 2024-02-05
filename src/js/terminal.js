const terminalInputElement = document.querySelector('#terminal_input');
const logsElement = document.querySelector('.terminal-window__logs');

const getRandomQuote = async () => {
  return await fetch('https://dummyjson.com/quotes/random')
   .then(res => res.json())
   .then(({quote}) => {
    console.log(quote);
     return quote;
   })
   .catch(err => {
     console.log(err);
   });
}

const CUSTOM_COMMANDS = {
  hello: {
    msg: 'Hello :)',
  },
  /* niestandardowe komendy */
};
const commands = {
  ...CUSTOM_COMMANDS,
  clear: {
    msg: () => {
      console.log('clear terminal');
      return 'clear terminal';
    },
  },
  help: {
    msg: () => {
      console.log(Object.keys(commands));
      return Object.keys(commands).join(', ');
    },
  },
  quote: {
    msg: async () => {
      console.log('random quote');
      const { quote } = await getRandomQuote();
      return 'random quote' + quote;
    },
  },
  double: {
    msg: function () {
     console.log('X 2', this.param, this.param * 2);
     return this.param * 2;
    },
  },
};

function isNumeric(num) {
  return !isNaN(num);
}

terminalInputElement.addEventListener('change', function (e) {
  const log = document.createElement('span'); 
  const { value } = e.target;
  console.log(value);
  const commandWithParams= value.split(' ');
  const [command, param] = commandWithParams;
  if(commandWithParams.length > 2) {
    if(command === 'double') {
     log.innerHTML = `Command is too long. Try '${command} ${param}'`;
    } else {
     log.innerHTML = 'Command is to long';
    }
  }
  else if (commandWithParams.length <= 2 && command === 'double') {
    if (isNumeric(param)) {
      log.innerHTML = commands[command].msg.call({param: +param});
    } else {
      throw new Error(`${param} Is not a number`);
    }
  } else {
    const message = commands?.[value]?.msg;
    if (typeof message === 'string') {
      log.innerHTML = message
      // return console.log(message);
    } else if (typeof message === 'function') {
      log.innerHTML = message.call(value);

      // return console.log(message.call(value));
    } else {
      log.innerHTML = 'Command not exist';
     // return console.error('Command not exist')
    }
  }
  logsElement.appendChild(log)
  logsElement.scrollTo(0, logsElement.scrollHeight);

  return (terminalInputElement.value = '');
});
