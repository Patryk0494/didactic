import { getSessionStorage, setSessionStorage } from './utils';
const COMMAND_HISTORY = 'commandHistory'
const terminalInputElement = document.querySelector('#terminal_input');
const logsElement = document.querySelector('.terminal-window__logs');
const KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
}

let historyIndex = getSessionStorage(COMMAND_HISTORY)?.length || 0;
const getRandomQuote = async () => {
  
  return fetch('https://dummyjson.com/quotes/random')
   .then(res => res.json())
   .then(({quote}) => {
     return quote;
   })
   .catch(err => {
     console.log(err);
    });
}
  
document.addEventListener('keydown', (e) => {
  console.log(e)
  const commandHistory = getSessionStorage(COMMAND_HISTORY) || [];

  if (e.key === KEYS.ARROW_UP) {
    if(historyIndex > 0) {
      --historyIndex;
      terminalInputElement.value = commandHistory.at(historyIndex)
    }
  }
  if (e.key === KEYS.ARROW_DOWN) {
    console.log(historyIndex, commandHistory.length)
    if (historyIndex < commandHistory.length - 1) {
      ++historyIndex;
      terminalInputElement.value = commandHistory.at(historyIndex)
    }
  }
})

const addToHistory = (command) => {
  const commandHistory = getSessionStorage(COMMAND_HISTORY) || [];
  console.log(commandHistory);
  setSessionStorage(COMMAND_HISTORY, [...commandHistory, command]);
  historyIndex = commandHistory.length + 1;
};

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
      return 'clear terminal';
    },
    description: 'Clear terminal'
  },
  help: {
    msg: () => {
      const helper = Object.entries(commands).map(([key, {description}]) => { 
        const commandDesc = description ? key + ' - ' + description : key
        return `<br> ${commandDesc}`;
      });
      console.log(helper);
      return helper.join(' ');
    },
    description: 'Display all available commands'
  },
  quote: {
    msg: async () => {
      const quote = await getRandomQuote();
      return quote;
    },
    description: 'Display random quote'
  },
  double: {
    msg: function () {
     return this.param ? this.param * 2 : 'Enter a value';
    },
    description: 'Double enteret number'
  },
};

function isNumeric(num) {
  return !isNaN(num);
}

terminalInputElement.addEventListener('change', async function (e) {
  const terminalLog = document.createElement('span');
  const userLog = document.createElement('span');
  let terminalMessage;
  const { value } = e.target;
  addToHistory(value);
  userLog.innerHTML = `you: ${value}`;
  logsElement.appendChild(userLog)
  const commandWithParams= value.split(' ');
  const [command, param] = commandWithParams;
  if(value ==='clear') {
    logsElement.innerHTML = '';
    terminalInputElement.value = '';
    return;
  }
  if(commandWithParams.length > 2) {
    if(command === 'double') {
     terminalMessage = `Too much params. Try '${command} ${param}'`;
    } else {
     terminalMessage = 'Too much params.';
    }
  }
  else if (commandWithParams.length <= 2 && command === 'double') {
    if (isNumeric(param)) {
      terminalMessage = commands[command].msg.call({param: +param});
    } else {
      terminalMessage = `${param} is not a number`;
      // throw new Error(`${param} is not a number`);
    }
  } else {
    const message = commands?.[value]?.msg;
    if (typeof message === 'string') {
      terminalMessage = message
    } else if (typeof message === 'function') {
      terminalMessage = await message.call(value);
    } else {
      terminalMessage = 'Command not exist';
    }
  }
  terminalLog.innerHTML = `terminal: ${terminalMessage}`;
  logsElement.appendChild(terminalLog)
  if (logsElement.scrollHeight > logsElement.clientHeight) {
    logsElement.scrollTo(0, logsElement.scrollHeight);
  }

  return terminalInputElement.value = '';
});
