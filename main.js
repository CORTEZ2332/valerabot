const Discord = require('discord.js') // подключение библиотеки                  Видео про бота https://youtu.be/1lzPIhTaPDY
const client = new Discord.Client() // создание клиента
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '217.114.43.245', // адрес вашего MySQL сервера
  user: 'gs1420', // имя пользователя MySQL
  password: 'TI9y3pD5Yb', // пароль пользователя MySQL
  database: 'gs1420', // имя вашей базы данных MySQL
})

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ', err);
    return;
  }
  console.log('Подключено к базе данных MySQL!');
})
client.on('message', message => {
    if (message.author.bot) return;
    
    if (message.content === '!passport') {
      connection.query('SELECT Name FROM Passports', (err, rows) => {
        if (err) {
          console.error('Ошибка при выполнении запроса: ', err);
          return;
        }
        
        const names = rows.map(row => row.Name);
        const embed = new Discord.MessageEmbed()
          .setTitle('Список пользователей с пасспортом')
          .setDescription(names.join('\n')) // Здесь меняем запятую на \n
          .setColor('RANDOM');
  
        message.channel.send(embed);
      })
    }
  })
// Создаем объект с командами и их описаниями
const commands = {
    '!профиль': 'Показать информацию о вашем профиле.',
    '!nickname': 'Вывести список пользователей по имени из базы данных Passports.',
    // Добавьте другие команды и их описания здесь
    '!хепл': 'Вывести список всех доступных команд.',
  }
  
  client.on('message', message => {
    if (message.author.bot) return;
  
    if (message.content === '!хелп') {
      // Текст, который будет отображаться в команде !хелп (замените на свой текст)
      const helpText = [
        'Добро пожаловать!',
        'Вот список команд бота:',
        '!профиль - Показывает твой профиль',
        '!паспорт - Кидает список игроков с паспортом',
        '!логи - Показывает логи игроков сервера.  Работает только в канале https://discord.com/channels/975678659631382548/1135209701844455464',
        '!статс - Показывает статистику игрока.  Работает только в канале https://discord.com/channels/975678659631382548/1135221954295636028',
        '!сетадмин - Выдача админ прав в игре. Работает только в канале https://discord.com/channels/975678659631382548/1135228797378105445',
        '!сетфд - Выдача ФД прав в игре. Работает только в канале https://discord.com/channels/975678659631382548/1135228797378105445',
        // Добавьте другие команды здесь
      ];
  
      // Объединяем строки в один текст с переносами строк
      const formattedText = helpText.join('\n');
  
      let embed = new Discord.MessageEmbed()
        .setTitle('Список команд бота')
        .setDescription(formattedText)
        .setColor('RANDOM');
  
      message.channel.send(embed);
    }
  });
  client.on('message', message => {
    if (message.author.bot) return;
  
    if (message.content.startsWith('!статс')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const nickName = args.slice(1).join(' '); // Соединяем все остальные аргументы в ник нейм

  // Проверяем ID канала
  const channelId = '1135221954295636028'; // Здесь замените на ожидаемый ID канала
  if (message.channel.id !== channelId) {
    return; // Бот не будет выполнять команду в других каналах
  }
  
      // Проверяем, указан ли ник нейм
      if (!nickName) {
        message.channel.send('Укажите NickName игрока для получения статистики.');
        return;
      }
  
      // Выполняем запрос к базе данных для поиска статистики игрока
      connection.query(
        'SELECT Level, Admin, FullDostup, Money, Bank, DonateMoney, VirMoney, LastPlaying FROM Qelksekm WHERE NickName = ?',
        [nickName],
        (err, rows) => {
          if (err) {
            console.error('Ошибка при выполнении запроса: ', err);
            return;
          }
  
          // Проверяем, найден ли игрок
          if (rows.length === 0) {
            message.channel.send(`Статистика для игрока с NickName "${nickName}" не найдена.`);
            return;
          }
  
          // Получаем информацию о найденном игроке
          const playerStats = rows[0];
  
          // Формируем сообщение со статистикой игрока
          let embed = new Discord.MessageEmbed()
            .setTitle(`Статистика игрока: ${nickName}`)
            .setDescription(
              `Уровень: ${playerStats.Level}\n` +
              `Уровень Админки: ${playerStats.Admin}\n` +
              `Уровень фулл доступа: ${playerStats.FullDostup}\n` +
              `Деньги: ${playerStats.Money}\n` +
              `Деньги в банке: ${playerStats.Bank}\n` +
              `Донат рубли: ${playerStats.DonateMoney}\n` +
              `Донат az: ${playerStats.VirMoney}\n` +
              `Последний вход в игру: ${playerStats.LastPlaying}`
            )
            .setColor('RANDOM');
  
          message.channel.send(embed);
        }
      );
    }
  });
  client.on('message', message => {
    if (message.author.bot) return;

  // Проверяем ID канала
  const channelId = '1135228797378105445'; // Здесь замените на ожидаемый ID канала
  if (message.channel.id !== channelId) {
    return; // Бот не будет выполнять команду в других каналах
  }
  
    if (message.content.startsWith('!сетадмин')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const nickName = args[1]; // Второй аргумент - ник нейм
      const adminLevel = parseInt(args[2]); // Третий аргумент - уровень админки (число)
  
      // Проверяем, указаны ли все аргументы
      if (!nickName || isNaN(adminLevel)) {
        message.channel.send('Использование команды: !сетадмин Nick_Name Уровень Админки (0-9)');
        return;
      }
  
      // Проверяем, что уровень админки находится в диапазоне от 0 до 9
      if (adminLevel < 0 || adminLevel > 9) {
        message.channel.send('Уровень админки должен быть числом от 0 до 9.');
        return;
      }
  
      // Выполняем запрос к базе данных для поиска игрока по ник нейму
      connection.query(
        'SELECT NickName, Admin FROM Qelksekm WHERE NickName = ?',
        [nickName],
        (err, rows) => {
          if (err) {
            console.error('Ошибка при выполнении запроса: ', err);
            return;
          }
  
          // Проверяем, найден ли игрок
          if (rows.length === 0) {
            message.channel.send(`Игрок с NickName "${nickName}" не найден.`);
            return;
          }
  
          // Получаем информацию о найденном игроке
          const playerInfo = rows[0];
          const previousAdminLevel = playerInfo.Admin; // Сохраняем предыдущий уровень админки
  
          // Выполняем запрос к базе данных для обновления значения админки игрока
          connection.query(
            'UPDATE Qelksekm SET Admin = ? WHERE NickName = ?',
            [adminLevel, nickName],
            (err) => {
              if (err) {
                console.error('Ошибка при выполнении запроса: ', err);
                return;
              }
  
              // Отправляем сообщение о выдаче админки игроку
              message.channel.send(`${message.author}, выдал админку игроку ${playerInfo.NickName} (Предыдущий уровень админки: ${previousAdminLevel}, Новый уровень админки: ${adminLevel}).`);
            }
          );
        }
      );
    }
  
    if (message.content.startsWith('!сетфд')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const nickName = args[1]; // Второй аргумент - ник нейм
      const fullDostupLevel = parseInt(args[2]); // Третий аргумент - уровень FullDostup (число)
  
      // Проверяем, указаны ли все аргументы
      if (!nickName || isNaN(fullDostupLevel)) {
        message.channel.send('Использование команды: !сетфд Nick_Name Уровень FD ()');
        return;
      }
  
      // Проверяем, что уровень FullDostup находится в диапазоне от 0 до 9
      if (fullDostupLevel < 0 || fullDostupLevel > 6) {
        message.channel.send('Уровень FullDostup должен быть числом от 0 до 6.');
        return;
      }
  
      // Выполняем запрос к базе данных для поиска игрока по ник нейму
      connection.query(
        'SELECT NickName, FullDostup FROM Qelksekm WHERE NickName = ?',
        [nickName],
        (err, rows) => {
          if (err) {
            console.error('Ошибка при выполнении запроса: ', err);
            return;
          }
  
          // Проверяем, найден ли игрок
          if (rows.length === 0) {
            message.channel.send(`Игрок с NickName "${nickName}" не найден.`);
            return;
          }
  
          // Получаем информацию о найденном игроке
          const playerInfo = rows[0];
          const previousFullDostupLevel = playerInfo.FullDostup; // Сохраняем предыдущий уровень FullDostup
  
          // Выполняем запрос к базе данных для обновления значения FullDostup игрока
          connection.query(
            'UPDATE Qelksekm SET FullDostup = ? WHERE NickName = ?',
            [fullDostupLevel, nickName],
            (err) => {
              if (err) {
                console.error('Ошибка при выполнении запроса: ', err);
                return;
              }
  
              // Отправляем сообщение о выдаче FullDostup игроку
              message.channel.send(`${message.author}, выдал FullDostup игроку ${playerInfo.NickName} (Предыдущий уровень FullDostup: ${previousFullDostupLevel}, Новый уровень FullDostup: ${fullDostupLevel}).`);
            }
          );
        }
      );
    }
});
  




client.on('message', message => {
  if (message.author.bot) return;

  const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
  const command = args[0]; // Первый аргумент - команда
  const nickName = args.slice(1).join(' '); // Соединяем все остальные аргументы в ник нейм

  // Проверяем ID канала
  const channelId = '1135209701844455464'; // Здесь замените на ожидаемый ID канала
  if (message.channel.id !== channelId) {
    return; // Бот не будет выполнять команду в других каналах
  }

  if (command === '!логи') {
    // Проверяем, указан ли ник нейм
    if (!nickName) {
      // Бот объясняет кнопки для фильтрации и поиска
      message.channel.send('Укажите ник нейм для поиска в логах. Например: `!логи НикНейм`.\n\n' +
        'Чтобы применить фильтр по ключевым словам, нажмите ⬅️.\n' +
        'Чтобы применить фильтр по ключевым словам, нажмите ➡️.\n' +
        'Чтобы применить фильтр по дате, нажмите 🔍.\n' +
        'Чтобы применить фильтр по времени, нажмите 🕓.\n' +
        'Чтобы изменить количество строк на странице, нажмите 🔢.\n');
      
      // Ожидаем сообщение с никнеймом от пользователя
      const collector = new Discord.MessageCollector(
        message.channel,
        (m) => m.author.id === message.author.id,
        { time: 60000 } // Время ожидания в миллисекундах, в данном случае - 60 секунд
      );

      collector.on('collect', (msg) => {
        const userNickName = msg.content.trim();
        if (userNickName) {
          // Пользователь указал никнейм, выполняем команду
          collector.stop();
          executeLogsCommand(userNickName);
        } else {
          // Пользователь не указал никнейм, продолжаем ожидать
          message.channel.send('Укажите ник нейм для поиска в логах. Например: `!логи НикНейм`.');
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          // Время ожидания истекло, закончим ожидание
          message.channel.send('Время ожидания истекло. Повторите команду, чтобы продолжить.');
        }
      });

      return;
    }

    // Выполняем команду с указанным никнеймом
    executeLogsCommand(nickName);
  }


function executeLogsCommand(nickName) {
  // Выполняем запрос к базе данных без ограничения
  connection.query('SELECT date, action FROM logs_all WHERE player = ? ORDER BY date DESC', [nickName], (err, rows) => {
        if (err) {
          console.error('Ошибка при выполнении запроса: ', err);
          return;
        }
  
        if (rows.length === 0) {
          message.channel.send(`Логи для ник нейма "${nickName}" не найдены.`);
          return;
        }
  
        // Формируем сообщение с результатами из базы данных
        let page = 0;
        let logsPerPage = 10; // Количество логов на странице по умолчанию
        let logsList = getLogsList(rows, page, logsPerPage);
        let embed = new Discord.MessageEmbed()
          .setTitle(`Логи для ник нейма: ${nickName}`)
          .setDescription(logsList)
          .setColor('RANDOM');
  
          message.channel.send(embed).then(msg => {
            msg.react('⬅️'); // Кнопка "Назад"
            msg.react('➡️'); // Кнопка "Вперед"
            msg.react('🔍'); // Кнопка "Фильтр"
            msg.react('📅'); // Кнопка "Поиск по дате"
            msg.react('🕓'); // Кнопка "Поиск по времени"
            msg.react('🔢'); // Кнопка "Количество строк"
          
            // Функция для обработки реакций
            const filter = (reaction, user) => ['⬅️', '➡️', '🔍', '📅', '🕓', '🔢'].includes(reaction.emoji.name) && !user.bot;
            const collector = msg.createReactionCollector(filter, { time: 60000 }); // Время в миллисекундах, в данном случае - 60 секунд
          
            // Отправляем сообщение об удалении кнопок через 60 секунд
            setTimeout(() => {
              collector.stop();
              msg.reactions.removeAll().catch(error => console.error('Ошибка при удалении реакций: ', error));
            }, 60000);
            
          let filterKeywords = []; // Массив для хранения ключевых слов фильтрации
          let filteredRows = rows; // Массив для хранения отфильтрованных строк
          let searchDate = null; // Переменная для хранения даты поиска
          let searchTime = null; // Переменная для хранения времени поиска
  
          collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === '⬅️') {
              if (page > 0) {
                page--;
                logsList = getLogsList(filteredRows, page, logsPerPage);
                embed.setDescription(logsList);
                msg.edit(embed);
              }
            } else if (reaction.emoji.name === '➡️') {
              if ((page + 1) * logsPerPage < filteredRows.length) {
                page++;
                logsList = getLogsList(filteredRows, page, logsPerPage);
                embed.setDescription(logsList);
                msg.edit(embed);
              }
            } else if (reaction.emoji.name === '🔍') {
              // Ожидаем сообщение с ключевыми словами от пользователя
              message.channel.send('Введите ключевые слова для фильтрации (через пробел):');
  
              const filterCollector = new Discord.MessageCollector(
                message.channel,
                (m) => m.author.id === user.id,
                { time: 30000 } // Время ожидания в миллисекундах, в данном случае - 30 секунд
              );
  
              filterCollector.on('collect', (filterMessage) => {
                filterKeywords = filterMessage.content.split(' ');
                filteredRows = rows.filter((row) => filterKeywords.some((keyword) => row.action.includes(keyword))); // Применяем фильтр
                logsList = getLogsList(filteredRows, page, logsPerPage);
                embed.setDescription(logsList);
                msg.edit(embed);
                filterCollector.stop();
              });
  
              filterCollector.on('end', () => {
                // Если время ожидания истекло и пользователь не ввел ключевые слова, выводим сообщение об этом
                if (filterKeywords.length === 0) {
                  message.channel.send('Фильтр не применен, так как ключевые слова не были указаны.');
                }
              });
            } else if (reaction.emoji.name === '📅') {
              // Ожидаем сообщение с датой поиска от пользователя
              message.channel.send('Введите дату для поиска в логах (в формате ГГГГ-ММ-ДД):');
  
              const dateCollector = new Discord.MessageCollector(
                message.channel,
                (m) => m.author.id === user.id,
                { time: 30000 } // Время ожидания в миллисекундах, в данном случае - 30 секунд
              );
  
              dateCollector.on('collect', (dateMessage) => {
                // Проверяем, корректно ли указана дата
                const inputDate = new Date(dateMessage.content);
                if (isNaN(inputDate)) {
                  message.channel.send('Некорректный формат даты. Пожалуйста, введите дату в формате ГГГГ-ММ-ДД.');
                  return;
                }
                searchDate = inputDate;
                dateCollector.stop();
              });
  
              dateCollector.on('end', () => {
                // Если время ожидания истекло и пользователь не ввел дату, выводим сообщение об этом
                if (!searchDate) {
                  message.channel.send('Поиск по дате не выполнен, так как дата не была указана.');
                  return;
                }
  
                // Фильтруем логи по указанной дате
                filteredRows = rows.filter((row) => {
                  const logDate = new Date(row.date);
                  return logDate.toDateString() === searchDate.toDateString();
                });
  
                logsList = getLogsList(filteredRows, page, logsPerPage);
                embed.setDescription(logsList);
                msg.edit(embed);
              });
            } else if (reaction.emoji.name === '🕓') {
              // Ожидаем сообщение с временем поиска от пользователя
              message.channel.send('Введите интервал времени для поиска в логах (в формате ЧЧ:ММ-ЧЧ:ММ):');
  
              const timeCollector = new Discord.MessageCollector(
                message.channel,
                (m) => m.author.id === user.id,
                { time: 30000 } // Время ожидания в миллисекундах, в данном случае - 30 секунд
              );
  
              timeCollector.on('collect', (timeMessage) => {
                // Проверяем, корректно ли указан интервал времени
                const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
                if (!timePattern.test(timeMessage.content)) {
                  message.channel.send('Некорректный формат интервала времени. Пожалуйста, введите интервал в формате ЧЧ:ММ-ЧЧ:ММ.');
                  return;
                }
                const [startTime, endTime] = timeMessage.content.split('-');
                searchTime = { startTime, endTime };
                timeCollector.stop();
              });
  
              timeCollector.on('end', () => {
                // Если время ожидания истекло и пользователь не ввел интервал времени, выводим сообщение об этом
                if (!searchTime) {
                  message.channel.send('Поиск по времени не выполнен, так как интервал времени не был указан.');
                  return;
                }
  
                // Фильтруем логи по указанному интервалу времени
                filteredRows = rows.filter((row) => {
                  const logTime = row.date.split(' ')[1];
                  return logTime >= searchTime.startTime && logTime <= searchTime.endTime;
                });
  
                logsList = getLogsList(filteredRows, page, logsPerPage);
                embed.setDescription(logsList);
                msg.edit(embed);
              });
            } else if (reaction.emoji.name === '🔢') {
              // Ожидаем сообщение с количеством строк от пользователя
              message.channel.send('Введите количество строк для вывода (от 10 до 100):');
  
              const countCollector = new Discord.MessageCollector(
                message.channel,
                (m) => m.author.id === user.id,
                { time: 30000 } // Время ожидания в миллисекундах, в данном случае - 30 секунд
              );
  
              countCollector.on('collect', (countMessage) => {
                const count = parseInt(countMessage.content);
                if (isNaN(count) || count < 10 || count > 60) {
                  message.channel.send('Некорректное количество строк. Пожалуйста, введите число от 10 до 60.');
                  return;
                }
                logsPerPage = count;
                logsList = getLogsList(filteredRows, page, logsPerPage);
                embed.setDescription(logsList);
                msg.edit(embed);
                countCollector.stop();
              });
  
              countCollector.on('end', () => {
                // Если время ожидания истекло и пользователь не ввел количество строк, выводим сообщение об этом
                if (!logsPerPage) {
                  message.channel.send('Количество строк не было указано, оставлено значение по умолчанию (10).');
                }
              });
            }
  
            reaction.users.remove(user);
          });
  
          collector.on('end', () => {
            msg.reactions.removeAll().catch(error => console.error('Ошибка при удалении реакций: ', error));
          });
        });
      });
    }
  });
  
  // Функция для форматирования списка логов из базы данных
  function getLogsList(rows, page, logsPerPage) {
    const startIndex = page * logsPerPage;
    const endIndex = Math.min(startIndex + logsPerPage, rows.length);
    return rows.slice(startIndex, endIndex).map(row => `${row.date}: ${row.action}`).join('\n');
  }
  
  
  
  // Функция для форматирования списка команд
  function getCommandsList(commandsObj) {
    return Object.entries(commandsObj)
      .map(([command, description]) => `${command}: ${description}`)
      .join('\n');
  }
  
  process.on('exit', () => {
    connection.end();
  })
    
client.on('ready', () =>{ // ивент, когда бот запускается https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-ready
    client.generateInvite("ADMINISTRATOR").then(invite => console.log(`Ссылка на добавление ${invite}`))
    console.log(`Привет! ${client.user.tag} запустился!`) // информация в консоль про успешный запуск
})

client.on('message', message =>{ // ивент, когда приходит любое сообщение в чат https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message
    if (message.author.bot) return; // если автор сообщения - бот, ничего не происходит 
    if (message.content == '!профиль') { // если пользователь написал "!профиль" 
    let embed = new Discord.MessageEmbed() // создание ембед сообщения
    .setTitle(message.author.username) // в тайтле имя автора 
    let status = ''
    switch (message.author.presence.status) { // проверка статусов 
        case 'online':
            status = 'онлайн'; break; 
            case 'idle':
                status = ':orange_circle:нет на месте'; break;
                case 'offline':
                    status = 'нет в сети'; break;
                    case 'dnd':
                        status = ':red_circle:не беспокоить'; break;
    }
    embed.setDescription(`**Ваш дискорд айди: ${message.author.id}
    Ваш статус: ${status}
    Дата создания аккаунта: ${message.author.createdAt.toLocaleDateString()}
    Дата входа на сервер: ${message.member.joinedAt.toLocaleDateString()}
    **`) // описание ембеда
    .setColor('RANDOM') // рандомный цвет ембеда
    .setThumbnail(message.author.avatarURL()) // вставляем в ембед аватарку пользователя
    message.channel.send(embed) // отправляем сообщение в канал где была написана команда   
    }
})

client.on('messageDelete', message =>{ // ивент, когда удаляется любое сообщение с сервера https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
    let embed = new Discord.MessageEmbed()
    .setTitle('Было удалено сообщение!')
    .setColor('RANDOM')
    .addField(`Удалённое сообщение:`, message.content, true)
    .addField("Автор:",`${message.author.tag} (${message.author})`,true)
    .addField("Канал:", `${message.channel}`, false)
    .setFooter(' - ',`${message.author.avatarURL()}`)
    .setTimestamp(message.createdAt);
  client.channels.cache.get("975681053874331670").send(embed); // айди вашего канала с логами
})

client.on('guildMemberAdd', member =>{ // ивент, когда пользователь присоединяется к серверу https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
    let embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Привет, ${member.user.username}!`)
    .setDescription(`**Ты попал на мой сервер!
    Ты наш \`${client.guilds.get("975678659631382548").memberCount}\` участник! **`) // айди вашего сервера               !!!!!!!!!!
    .setFooter('Будь всегда на позитиве :3', 'https://cdn.discordapp.com/emojis/590614597610766336.gif?v=1')
    // .addField(`Участвуй в розыгрышах!`, `<#706487236220289054>`, true) // Добавляйте свои каналы по желанию
    // .addField(`Общайся в чате!`, `<#702364684199788625>`, true)
    // .addField(`Смотри видео наших ютуберов!`, `<#702363551184060546>`, true)
    .setColor('RANDOM')
    member.send(embed); // отправка сообщения в лс 

    let embed2 = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Пользователь вошел на сервер`)
    .addField('Пользователь:', member.user)
    .setColor('RANDOM')
    member.send(embed);
    client.channels.cache.get('975681053874331670').send(embed2) // айди вашего канала с логами
})

client.on('guildMemberRemove', member => { // ивент, когда пользователь выходит с сервера https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
    let embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Пользователь покинул сервер`)
    .addField('Пользователь:', member.user)
    .setColor('RANDOM')
    member.send(embed);
    client.channels.cache.get('975681053874331670').send(embed) // айди вашего канала с логами
  })

async function change() {
    let members = client.guilds.cache.get("975678659631382548").memberCount // сколько людей на сервере + указать айди своего сервера
    client.channels.cache.get("1135185293218164796").setName(`На сервере: ${members}`); // свой айди войса
}

var interval = setInterval(function () { change(); }, 2000  ); // время обновления в миллисекундах

client.login('OTgzMDg3NDkyMjA5MjA5MzY1.Gux1uS.yx2fO5weKlukRDgNCGXUdFB2VcK5kKD4Y8Z_ro') // токен вашего бота


// Хотите, чтобы ваш бот работал 24/7 бесплатно? Смотрите это видео: https://www.youtube.com/watch?v=wxdl4QK0am4

// Bot by Sanich https://youtube.com/sanich - фишки, гайды по приложению Discord