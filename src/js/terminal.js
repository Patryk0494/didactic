import { getSessionStorage, setSessionStorage, isNumeric } from './utils';
const COMMAND_HISTORY = 'commandHistory'
const terminalInputElement = document.querySelector('#terminal_input');
const logsElement = document.querySelector('.terminal-window__logs');
const commandHintsElement = document.querySelector('.terminal-hints');

const KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
}

const CUSTOM_COMMANDS = {
  hello: {
    msg: 'Hello :)',
  },
  /* niestandardowe komendy */
};
const COMMANDS = {
  ...CUSTOM_COMMANDS,
  clear: {
    description: 'Clear terminal',
  },
  help: {
    msg: () => {
      const helper = Object.entries(COMMANDS).map(([key, { description }]) => {
        const commandDesc = `${key}${description ? ` - ${description}` : ''}`;
        return `<br>${commandDesc}`;
      });
      return helper.join(' ');
    },
    description: 'Display all available commands',
  },
  quote: {
    msg: async () => {
      const quote = await getRandomQuote();
      return quote;
    },
    description: 'Display random quote',
  },
  double: {
    msg: function () {
      return this.param ? this.param * 2 : 'Enter a value';
    },
    description: 'Double input number',
  },
};

const allCommandList = Object.keys(COMMANDS);
const createHints = (commandList) => {
  commandHintsElement.innerHTML = '';
  commandList.forEach((command)=> {
  const commandElement = document.createElement('span');
  commandElement.textContent = command;
  commandElement.className = 'terminal-hints__pill'
 //  commandElement.onclick = function() {
 //  terminalInputElement.value = command
 // }
 commandHintsElement.appendChild(commandElement);
})}

createHints(allCommandList);

window.addEventListener('load',() => {
 const dateString = new Date().toString();
 applyLog(dateString, 'Last login');
})

let historyIndex = getSessionStorage(COMMAND_HISTORY)?.length || 0;
async function getRandomQuote() {
  
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
  const commandHistory = getSessionStorage(COMMAND_HISTORY) || [];

  if (e.key === KEYS.ARROW_UP) {
    if(historyIndex > 0) {
      --historyIndex;
      terminalInputElement.value = commandHistory[historyIndex];
    }
  }
  if (e.key === KEYS.ARROW_DOWN) {
    if (historyIndex < commandHistory.length - 1) {
      ++historyIndex;
      terminalInputElement.value = commandHistory[historyIndex];
    }
  }
})

const addToCommandHistory = (command) => {
  const commandHistory = getSessionStorage(COMMAND_HISTORY) || [];
  setSessionStorage(COMMAND_HISTORY, [...commandHistory, command]);
  historyIndex = commandHistory.length + 1;
};

const clearTerminal = () => {
  logsElement.innerHTML = '';
  terminalInputElement.value = '';
}

function applyLog(content, caption = 'you') {
   const userLog = document.createElement('span');
   userLog.innerHTML = `${caption}: ${content}`;
   logsElement.appendChild(userLog);
}

terminalInputElement.addEventListener('input', function (e) {
  const { value } = e.target
  if (!value.length) {
   return createHints(allCommandList);
  }
  const filtredCommandList = allCommandList.filter((command) => command.includes(value))
  return createHints(filtredCommandList);
});

terminalInputElement.addEventListener('change', async function (e) {
  const { value } = e.target;
  addToCommandHistory(value);

  if(value ==='clear') {
    clearTerminal();
    return;
  }
  applyLog(value)
  let terminalMessage;
  const commandWithParams= value.split(' ');
  const [command, param] = commandWithParams;
  if(commandWithParams.length > 2) {
    if(command === 'double') {
     terminalMessage = `Too much params. Try '${command} ${param}'`;
    } else {
     terminalMessage = 'Too much params.';
    }
  }
  else if (commandWithParams.length <= 2 && command === 'double') {
    if (isNumeric(param)) {
      terminalMessage = COMMANDS[command].msg.call({param: +param});
    } else {
      terminalMessage = `${param} is not a number`;
    }
  } else {
    const message = COMMANDS?.[value]?.msg;
    if (typeof message === 'string') {
      terminalMessage = message
    } else if (typeof message === 'function') {
      terminalMessage = await message.call(value);
    } else {
      terminalMessage = 'Command not exist';
    }
  }
  applyLog(terminalMessage, 'terminal')
  if (logsElement.scrollHeight > logsElement.clientHeight) {
    logsElement.scrollTo(0, logsElement.scrollHeight);
  }

  return terminalInputElement.value = '';
});
