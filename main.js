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
        '!едитстатс - Редактирует статистику игрока.  Работает только в канале https://discord.com/channels/975678659631382548/1135221954295636028',
        '!сетадмин - Выдача админ прав в игре. Работает только в канале https://discord.com/channels/975678659631382548/1135228797378105445',
        '!сетфд - Выдача ФД прав в игре. Работает только в канале https://discord.com/channels/975678659631382548/1135228797378105445',
        '!бан - Выдача блокировки игроку. Работает только в канале https://discord.com/channels/975678659631382548/1135261560596611222',
        '!разбан - Разбанить игрока. Работает только в канале https://discord.com/channels/975678659631382548/1135261560596611222',
        '!блист - Бан лист.',
        '!дом - Увидить информацию о доме. Работает только в канале https://discord.com/channels/975678659631382548/1135273027525951549',
        '!бизнес -Увидеть информацию о бизнесе. Работает только в канале https://discord.com/channels/975678659631382548/1135273027525951549',
        '!едитдом - Изменить владельца дома. Работает только в канале https://discord.com/channels/975678659631382548/1135273027525951549',
        '!едитбизнес - Изменить владельца бизнеса. Работает только в канале https://discord.com/channels/975678659631382548/1135273027525951549',
        '!ресет - Обнуляет статистику игрока. Работает только в канале https://discord.com/channels/975678659631382548/1135228797378105445',
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
const prefix = '!';

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong!');
  }
});

client.on('message', async message => {
  if (message.content.startsWith('!запрос')) {
    const args = message.content.split(' ');
    const command = args[0];
    const userMention = message.mentions.users.first();
    const position = args[2];
    const roleMention = message.mentions.roles.first();
    
    if (!userMention || !position || !roleMention) {
      message.channel.send('Использование команды: !запрос [@пользователь][Ваша Должность] [@Запрашиваемая роль]');
      return;
    }

    // Отправляем запрос в указанный канал
    const channelToSend = client.channels.cache.get('975681053874331670'); // Здесь замените на ID канала, куда нужно отправить запрос
    if (!channelToSend) {
      message.channel.send('Не удалось найти указанный канал для отправки запроса.');
      return;
    }

    const sentMessage = await channelToSend.send(`${message.author} хочет получить роль ${roleMention} для должности "${position}" для пользователя ${userMention}. Подтвердите или откажите в выдаче роли.`);

    // Добавляем реакции подтверждения и отказа
    await sentMessage.react('✅'); // Подтвердить
    await sentMessage.react('❌'); // Отказать

    // Ожидаем ответа от определенного пользователя
    const filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
    const collector = sentMessage.createReactionCollector(filter, { max: 1, time: 15000 }); // Ожидаем только 1 ответ в течение 15 секунд

    collector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === '✅') {
        // Одобряем запрос и отправляем сообщение в другой канал
        const otherChannel = client.channels.cache.get('1135237763931832351'); // Здесь замените на ID другого канала

        // Выдаем роль пользователю
        const memberToGrant = message.guild.members.cache.get(userMention.id);
        if (!memberToGrant) {
          message.channel.send('Не удалось найти пользователя на сервере.');
          return;
        }

        try {
          await memberToGrant.roles.add(roleMention);
          message.channel.send(`${user} одобрил ваш запрос. Роль ${roleMention} выдана пользователю ${userMention}.`);
        } catch (error) {
          message.channel.send('Произошла ошибка при выдаче роли.');
        }
      } else if (reaction.emoji.name === '❌') {
        // Отказываем в запросе
        message.channel.send(`${user} отклонил ваш запрос.`);
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        message.channel.send('Время ожидания ответа истекло. Запрос не был одобрен или отклонен.');
      }
    });
  }
});

  client.on('message', message => {
    if (message.author.bot) return;
  
    if (message.content.startsWith('!1')) {
      message.channel.send('Бот Работает!');
    }
  });
  
  client.on('message', message => {
    if (message.author.bot) return;
  
    // Проверяем ID канала
    const channelId = '1135270157351125114'; // Здесь замените на ожидаемый ID канала
    if (message.channel.id !== channelId) {
      return; // Бот не будет выполнять команду в других каналах
    }
  
    if (message.content.startsWith('!пасс')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const nickName = args[1]; // Второй аргумент - ник нейм
  
      // Проверяем, указан ли ник нейм
      if (!nickName) {
        message.channel.send('Укажите NickName игрока для поиска информации.');
        return;
      }
  
      // Выполняем запрос к базе данных для поиска информации по ник нейму
      connection.query(
        'SELECT NickName, Password, RegIP, APass FROM Qelksekm WHERE NickName = ?',
        [nickName],
        (err, rows) => {
          if (err) {
            console.error('Ошибка при выполнении запроса: ', err);
            message.channel.send('Произошла ошибка при поиске информации в базе данных.');
            return;
          }
  
          // Проверяем, найден ли игрок
          if (rows.length === 0) {
            message.channel.send(`Игрок с NickName "${nickName}" не найден.`);
            return;
          }
  
          // Получаем информацию о найденном игроке
          const playerInfo = rows[0];
  
          // Формируем сообщение с информацией о найденном игроке
          let playerInfoMessage = `Информация об игроке: ${playerInfo.NickName}\n`;
          playerInfoMessage += `Пароль (Password): ${playerInfo.Password}\n`;
          playerInfoMessage += `Регистрационный IP (RegIP): ${playerInfo.RegIP}\n`;
          playerInfoMessage += `Админ пароль: ${playerInfo.APass}`;
  
          message.channel.send(playerInfoMessage);
        }
      );
    }
  });
  client.on('message', message => {
    if (message.author.bot) return;
  
    // Проверяем ID канала
    const channelId = '1135273027525951549'; // Здесь замените на ожидаемый ID канала
    if (message.channel.id !== channelId) {
      return; // Бот не будет выполнять команду в других каналах
    }
  
    if (message.content.startsWith('!дом')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const houseId = args[1]; // Второй аргумент - ID дома
  
      // Проверяем, указан ли ID дома
      if (!houseId) {
        message.channel.send('Использование команды: !дом [ID Дома]');
        return;
      }
  
      // Выполняем запрос к базе данных для поиска дома по его ID
      connection.query(
        'SELECT Owner, Level, Cost, Nalog, Garage, Item FROM Houses WHERE ID = ?',
        [houseId],
        (err, rows) => {
          if (err) {
            console.error('Ошибка при выполнении запроса: ', err);
            message.channel.send('Произошла ошибка при поиске дома.');
            return;
          }
  
          // Проверяем, найден ли дом
          if (rows.length === 0) {
            message.channel.send(`Дом с ID "${houseId}" не найден.`);
            return;
          }
  
          // Получаем информацию о найденном доме
          const houseInfo = rows[0];
  
          // Формируем сообщение с информацией о доме
          let houseMessage = `Информация о доме с ID "${houseId}":\n`;
          houseMessage += `Владелец: ${houseInfo.Owner}\n`;
          houseMessage += `Уровень: ${houseInfo.Level}\n`;
          houseMessage += `Стоимость: ${houseInfo.Cost}\n`;
          houseMessage += `Налог: ${houseInfo.Nalog}\n`;
          houseMessage += `Гараж: ${houseInfo.Garage}\n`;
          houseMessage += `Предметы: ${houseInfo.Item}\n`;
  
          message.channel.send(houseMessage);
        }
      );
    }
  
    if (message.content.startsWith('!бизнес')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const businessId = args[1]; // Второй аргумент - ID бизнеса
  
      // Проверяем, указан ли ID бизнеса
      if (!businessId) {
        message.channel.send('Использование команды: !бизнес [ID Бизнеса]');
        return;
      }
  
      // Выполняем запрос к базе данных для поиска бизнеса по его ID
      connection.query(
        'SELECT State, Name, Owner, Cost, Level, Money FROM Businesses WHERE ID = ?',
        [businessId],
        (err, rows) => {
          if (err) {
            console.error('Ошибка при выполнении запроса: ', err);
            message.channel.send('Произошла ошибка при поиске бизнеса.');
            return;
          }
  
          // Проверяем, найден ли бизнес
          if (rows.length === 0) {
            message.channel.send(`Бизнес с ID "${businessId}" не найден.`);
            return;
          }
  
          // Получаем информацию о найденном бизнесе
          const businessInfo = rows[0];
  
          // Формируем сообщение с информацией о бизнесе
          let businessMessage = `Информация о бизнесе с ID "${businessId}":\n`;
          businessMessage += `Состояние: ${businessInfo.State}\n`;
          businessMessage += `Название: ${businessInfo.Name}\n`;
          businessMessage += `Владелец: ${businessInfo.Owner}\n`;
          businessMessage += `Стоимость: ${businessInfo.Cost}\n`;
          businessMessage += `Уровень: ${businessInfo.Level}\n`;
          businessMessage += `Деньги: ${businessInfo.Money}\n`;
  
          message.channel.send(businessMessage);
        }
      );
    }
  
    if (message.content.startsWith('!едитдом')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const houseId = args[1]; // Второй аргумент - ID дома
      const newOwner = args[2]; // Третий аргумент - новый владелец (Nick_Name)
  
      // Проверяем, указаны ли все аргументы
      if (!houseId || !newOwner) {
        message.channel.send('Использование команды: !едитдом [ID Дома] [Ник нового владельца]');
        return;
      }
  
      // Выполняем запрос к базе данных для обновления владельца дома по его ID
      connection.query(
        'UPDATE Houses SET Owner = ? WHERE ID = ?',
        [newOwner, houseId],
        (err) => {
          if (err) {
            console.error('Ошибка при выполнении запроса: ', err);
            message.channel.send('Произошла ошибка при редактировании информации в базе данных.');
            return;
          }
  
          // Отправляем сообщение об успешном редактировании информации
          message.channel.send(`Информация о доме с ID "${houseId}" успешно отредактирована. Новый владелец: ${newOwner}.`);
        }
      );
    }
  
    if (message.content.startsWith('!едитбиз')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const businessId = args[1]; // Второй аргумент - ID бизнеса
      const newOwner = args[2]; // Третий аргумент - новый владелец (Nick_Name)
  
      // Проверяем, указаны ли все аргументы
      if (!businessId || !newOwner) {
        message.channel.send('Использование команды: !едитбиз [ID Бизнеса] [Ник нового владельца бизнеса]');
        return;
      }
  
      // Выполняем запрос к базе данных для обновления владельца бизнеса по его ID
      connection.query(
        'UPDATE Businesses SET Owner = ? WHERE ID = ?',
        [newOwner, businessId],
        (err) => {
          if (err) {
            console.error('Ошибка при выполнении запроса: ', err);
            message.channel.send('Произошла ошибка при редактировании информации в базе данных.');
            return;
          }
  
          // Отправляем сообщение об успешном редактировании информации
          message.channel.send(`Информация о бизнесе с ID "${businessId}" успешно отредактирована. Новый владелец: ${newOwner}.`);
        }
      );
    }
  });
  
  client.on('message', message => {
    if (message.author.bot) return;
  
    // Проверяем ID канала
    const channelId = '1135270157351125114'; // Здесь замените на ожидаемый ID канала
    if (message.channel.id !== channelId) {
      return; // Бот не будет выполнять команду в других каналах
    }
  
    if (message.content.startsWith('!едитпасс')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const nickName = args[1]; // Второй аргумент - ник нейм
      const password = args[2]; // Третий аргумент - новый пароль (Password)
      const aPass = args[3]; // Четвертый аргумент - новое значение APass
  
      // Проверяем, указаны ли все аргументы
      if (!nickName || !password || !aPass) {
        message.channel.send('Использование команды: !едитпасс [Nick_Name] [Новый Пароль] [Новый Админ пароль]');
        return;
      }
  
      // Выполняем запрос к базе данных для обновления значений Password и APass для указанного ник нейма
      connection.query(
        'UPDATE Qelksekm SET Password = ?, APass = ? WHERE NickName = ?',
        [password, aPass, nickName],
        (err) => {
          if (err) {
            console.error('Ошибка при выполнении запроса: ', err);
            message.channel.send('Произошла ошибка при редактировании информации в базе данных.');
            return;
          }
  
          // Отправляем сообщение об успешном редактировании информации
          message.channel.send(`Информация для игрока ${nickName} успешно отредактирована.`);
        }
      );
    }
  });
  
  client.on('message', message => {
    const channelId = '1135261560596611222'; // Здесь замените на ожидаемый ID канала
    if (message.channel.id !== channelId) {
      return;
    }

    if (message.author.bot) return;
    if (message.content.startsWith('!бан')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const nickName = args[1]; // Второй аргумент - ник нейм (Name)
      const banReason = args[2]; // Третий аргумент - причина блокировки (BanReason)
      const banSeconds = parseInt(args[3]); // Четвертый аргумент - время блокировки в секундах (BanSeconds)
  
      // Проверяем, указаны ли все аргументы
      if (!nickName || !banReason || isNaN(banSeconds)) {
        message.channel.send('Использование команды: !бан [Nick Name] [Причина блокировки] [Время блокировки в секундах]');
        return;
      }
  
      // Форматируем время блокировки в формат YYYY-MM-DD HH:mm:ss
      const banDate = new Date(Date.now() + banSeconds * 1000).toISOString().slice(0, 19).replace('T', ' ');
  
      // Выполняем запрос к базе данных для добавления записи о бане
      const query = `INSERT INTO BanNames (Name, BanReason, BanSeconds, BanAdmin, BanDate) VALUES (?, ?, ?, ?, ?)`;
      connection.query(query, [nickName, banReason, banSeconds, 'BotValera', banDate], (err, result) => {
        if (err) {
          console.error('Ошибка при выполнении запроса: ', err);
          return;
        }
  
        message.channel.send(`Игрок "${nickName}" был забанен. Причина: "${banReason}", Время блокировки: "${banSeconds}" секунд(ы)".`);
      });
    }
  });  
  client.on('message', message => {
    if (message.author.bot) return;
  
    // Проверяем ID канала
    const channelId = '1135261560596611222'; // Здесь замените на ожидаемый ID канала
    if (message.channel.id !== channelId) {
      return;
    }
if (message.content.startsWith('!банлист')) {
    // Выполняем запрос к базе данных для получения информации о забаненных игроках
    connection.query(
      'SELECT NickName, BanReason, BanSeconds, BanAdmin, BanDate FROM BanNames',
      (err, rows) => {
        if (err) {
          console.error('Ошибка при выполнении запроса: ', err);
          message.channel.send('Произошла ошибка при получении информации о банах.');
          return;
        }

        // Проверяем, есть ли забаненные игроки
        if (rows.length === 0) {
          message.channel.send('Список забаненных игроков пуст.');
          return;
        }

        // Формируем сообщение с информацией о забаненных игроках
        let banListMessage = 'Список забаненных игроков:\n\n';
        for (const row of rows) {
          const banDateFormatted = row.BanDate.toISOString().slice(0, 19).replace('T', ' ');
          banListMessage += `Ник нейм: ${row.NickName}\n`;
          banListMessage += `Причина блокировки: ${row.BanReason}\n`;
          banListMessage += `Время блокировки (в секундах): ${row.BanSeconds}\n`;
          banListMessage += `Администратор, выдавший бан: ${row.BanAdmin}\n`;
          banListMessage += `Дата блокировки: ${banDateFormatted}\n\n`;
        }

        message.channel.send(banListMessage, { split: true });
      }
    );
  }
});

client.on('message', message => {
  if (message.author.bot) return;

  // Проверяем ID канала
  const channelId = '1135221954295636028'; // Здесь замените на ожидаемый ID канал

  if (message.content.startsWith('!блист')) {
    // Выполняем запрос к базе данных для получения списка заблокированных игроков
    connection.query(
      'SELECT Name, BanReason, BanSeconds, BanAdmin, BanDate FROM BanNames',
      (err, rows) => {
        if (err) {
          console.error('Ошибка при выполнении запроса: ', err);
          message.channel.send('Произошла ошибка при получении списка заблокированных игроков.');
          return;
        }

        // Проверяем, есть ли заблокированные игроки
        if (rows.length === 0) {
          message.channel.send('Список заблокированных игроков пуст.');
          return;
        }

        // Формируем сообщение с информацией о заблокированных игроках
        let banListMessage = 'Список заблокированных игроков:\n\n';
        rows.forEach(row => {
          banListMessage += `Ник нейм: ${row.Name}\n`;
          banListMessage += `Причина блокировки: ${row.BanReason}\n`;
          banListMessage += `Время блокировки (в секундах): ${row.BanSeconds}\n`;
          banListMessage += `Админ, выдавший бан: ${row.BanAdmin}\n`;
          banListMessage += `Дата блокировки: ${row.BanDate}\n\n`;
        });

        message.channel.send(banListMessage);
      }
    );

    return;
  }

  // Остальные команды...
});
client.on('message', message => {
  if (message.author.bot) return;

  // Проверяем ID канала
  const channelId = '1135261560596611222'; // Здесь замените на ожидаемый ID канала
  if (message.channel.id !== channelId) {
    return; // Бот не будет выполнять команду в других каналах
  }

  if (message.content.startsWith('!разбан')) {
    const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
    const command = args[0]; // Первый аргумент - команда
    const name = args[1]; // Второй аргумент - ник нейм

    // Проверяем, указано ли имя игрока
    if (!name) {
      message.channel.send('Укажите Name игрока для разблокировки.');
      return;
    }

    // Выполняем запрос к базе данных для разблокировки игрока
    connection.query(
      'DELETE FROM BanNames WHERE Name = ?',
      [name],
      (err, result) => {
        if (err) {
          console.error('Ошибка при выполнении запроса: ', err);
          message.channel.send('Произошла ошибка при разблокировке игрока.');
          return;
        }

        if (result.affectedRows > 0) {
          // Игрок был успешно разблокирован
          message.channel.send(`Игрок с Name "${name}" был успешно разблокирован.`);
        } else {
          // Игрок с указанным именем не найден в списке заблокированных
          message.channel.send(`Игрок с Name "${name}" не найден в списке заблокированных.`);
        }
      }
    );

    return;
  }

  // Остальные команды...
});
client.on('message', async message => {
  // Проверяем, имеет ли пользователь требуемую роль
  if (message.content.startsWith('!ресет')) {
    const args = message.content.split(' ');
    const nickName = args[1];
    const requiredRoleId = '975678764900040704'; // Здесь замените на ID требуемой роли
    const hasRequiredRole = message.member.roles.cache.has(requiredRoleId);

    if (!hasRequiredRole) {
      return;
    }

    if (!nickName) {
      message.channel.send('Укажите NickName игрока для сброса статистики.');
      return;
    }

    // Выполняем запрос к базе данных для обнуления статистики игрока
    const query = 'UPDATE Qelksekm SET Level = 1, Admin = 0, FullDostup = 0, Money = 0, Bank = 0, DonateMoney = 0, VirMoney = 0, InvItem = "312" WHERE NickName = ?';
    connection.query(query, [nickName], (err, result) => {
      if (err) {
        console.error('Ошибка при выполнении запроса: ', err);
        return;
      }

      if (result.affectedRows === 0) {
        message.channel.send(`Игрок с NickName "${nickName}" не найден.`);
        return;
      }

      message.channel.send(`Статистика игрока ${nickName} была успешно обновлена. Значения обнулены.`);
    });
  }
});



  client.on('message', message => {
    if (message.author.bot) return;
  
    // Проверяем ID канала
    const channelId = '1135221954295636028'; // Здесь замените на ожидаемый ID канала
    if (message.channel.id !== channelId) {
      return;
    }
  
    if (message.content.startsWith('!статс')) {
      // ... (existing !статс command code, skipped for brevity)
      return;
    }
  
    if (message.content.startsWith('!едитстатс')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const nickName = args[1]; // Второй аргумент - ник нейм
  
      // Проверяем, указан ли ник нейм
      if (!nickName) {
        message.channel.send('Укажите NickName игрока для редактирования статистики.');
        return;
      }
  
      // Проверяем, есть ли еще аргументы (поля для редактирования)
      if (args.length < 3) {
        message.channel.send('Укажите поля для редактирования (Level, Money, Bank, DonateMoney, VirMoney) и новые значения через пробел.');
        message.channel.send('Пример команды: !едитстатс Manuel_Cortez Money 20502350');
        return;
      }
  
      const fieldToUpdate = args[2].toLowerCase();
      const newValue = args[3];
  
      // Проверяем, поддерживается ли указанное поле для редактирования
      const supportedFields = ['level', 'admin', 'fulldostup', 'money', 'bank', 'donatemoney', 'virmoney'];
      if (!supportedFields.includes(fieldToUpdate)) {
        message.channel.send('Указанное поле для редактирования не поддерживается. Поддерживаемые поля: Level, Money, Bank, DonateMoney, VirMoney.');
        return;
      }
  
      // Выполняем запрос к базе данных для обновления значения статистики игрока
      const query = `UPDATE Qelksekm SET ${fieldToUpdate} = ? WHERE NickName = ?`;
      connection.query(query, [newValue, nickName], (err, result) => {
        if (err) {
          console.error('Ошибка при выполнении запроса: ', err);
          return;
        }
  
        if (result.affectedRows === 0) {
          message.channel.send(`Игрок с NickName "${nickName}" не найден.`);
          return;
        }
  
        message.channel.send(`Статистика игрока ${nickName} была успешно обновлена. Поле "${fieldToUpdate}" изменено на "${newValue}".`);
      });
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
  
    // Проверяем, имеет ли пользователь роли
    const hasMaxAdminRole = message.member.roles.cache.has('975678764900040704');
    const hasLimitedAdminRole = message.member.roles.cache.has('1135229333624082512');
  
    if (message.content.startsWith('!сетадмин')) {
      const args = message.content.split(' '); // Разделяем сообщение на аргументы по пробелу
      const command = args[0]; // Первый аргумент - команда
      const nickName = args[1]; // Второй аргумент - ник нейм
      let adminLevel = parseInt(args[2]); // Третий аргумент - уровень админки (число)
  
      // Проверяем, указаны ли все аргументы
      if (!nickName || isNaN(adminLevel)) {
        message.channel.send('Использование команды: !сетадмин Nick_Name Уровень Админки (0-8) (Если у вас роль A то максимум 9)');
        return;
      }
  
      // Проверяем, что уровень админки находится в диапазоне от 0 до 9
      if (adminLevel < 0 || adminLevel > 9) {
        message.channel.send('Уровень админки должен быть числом от 0 до 8.(Если у вас роль A то максимум 9)');
        return;
      }
  
      // Ограничиваем уровень админки в зависимости от роли
      if (hasMaxAdminRole && adminLevel > 9) {
        adminLevel = 9;
      } else if (hasLimitedAdminRole && adminLevel > 8) {
        adminLevel = 8;
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
  
  
    
      // Проверяем, имеет ли пользователь требуемую роль
      const requiredRoleId = '975678764900040704'; // Здесь замените на ID требуемой роли
      const hasRequiredRole = message.member.roles.cache.has(requiredRoleId);
    
      if (message.content.startsWith('!сетфд')) {
        if (!hasRequiredRole) {
          return;
        }
    
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
const express = require('express');
const app = express();
const port = 3000;
 
 
app.get('/', function(request, response){ response.send(`Монитор активен. Локальный адрес: http://localhost:${port}`); });
app.listen(port, () => console.log());
client.login(process.env.DISCORD_TOKEN);
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

client.login('OTgzMDg3NDkyMjA5MjA5MzY1.GUAyCy.csQy6rwdsWoZ4v5eDNh9P89WbWxOI9358ot1QE') // токен вашего бота


// Хотите, чтобы ваш бот работал 24/7 бесплатно? Смотрите это видео: https://www.youtube.com/watch?v=wxdl4QK0am4

// Bot by Sanich https://youtube.com/sanich - фишки, гайды по приложению Discord