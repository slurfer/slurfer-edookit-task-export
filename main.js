function myFunction() {
  Logger.log(MailApp.getRemainingDailyQuota())
  var threads = GmailApp.search('is:unread');
  for (var i=0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j=0; j < messages.length; j++) {
      var activeMessage = messages[j]
      var author = activeMessage.getFrom();
      var subject = activeMessage.getSubject();
      Logger.log(subject + '; from: ' + author);
      if(author.includes('robot@edookit.com')){
        var body = activeMessage.getBody();
        var tag = getSubjecttagFromSubjectEdookit(subject);
        var name = getContentFromBodyEdookit(body)
        if(subject.includes('Zadání')){
          if(tag=='@Nezařazeno'){
            sendTodoEmail(subject + ' @Nezařazeno @Edookit<date today>', body);
            Logger.log('sent');
            activeMessage.markRead();
          }else if(name.length > 0){
            sendTodoEmail(name + ' ' + tag + ' @Edookit<date today>', body);
            Logger.log('sent');
            activeMessage.markRead();
          }else{
            sendTodoEmail('Untitled' + ' ' + tag + ' @Edookit<date today>', body);
            Logger.log('WARNING (no name of TODO task): ' + subject);
            activeMessage.markRead();
          }
        }
      }else if(subject.includes('Nový úkol')){
        var body = activeMessage.getBody();
        var tag = getSubjecttagFromSubjectClassroom(body);
        var name = getNameFromSubjectClassroom(subject);
        var content = getContentFromBodyClassroom(body);
        var date = '<date ' + getDueDateClassroom(body) + '>';
        sendTodoEmail(name + ' ' + tag + ' @Google_Classroom' + date, content);
        Logger.log('sent');
        activeMessage.markRead();
      }
    }
  }
}

function getSubjecttagFromSubjectEdookit(subject){
  var tags = {
    'Německý jazyk': '@Němčina',
    'Latina': '@Latina',
    'Anglický jazyk': "@Angličtina",
    'Biologie': "@Biologie",
    'Český jazyk a literatura': "@Ceština",
    'Dějepis': "@Dějepis",
    'Fyzika': "@Fyzika",
    'Hudební výchova': "@Hudebka",
    'Chemie': "@Chemie",
    'Informatika': "@Informatika",
    'Křesťanská výchova': "@Křesťanka",
    'Matematika': "@Matematika",
    'Třídní kruh': "@Třídní kruh",
    'Tělesná výchova': "@Tělocvik",
    'Zeměpis': "@Zeměpis",
    'Základy společenských věd': "@ZSV"
  };
  for (var subjectName of Object.keys(tags)){
    if(subject.includes(subjectName)){
      return tags[subjectName];
    }
  }
  return '@Nezařazeno';
}

function getContentFromBodyEdookit(body){
  var originalBody = body;
  var index = body.search('-----------------------------<br />') + 36;
  body = body.substring(index);
  body = body.substring(0, body.search('----------------------------- <br />'));
  return body.substring(0, body.length-8);
}


function getSubjecttagFromSubjectClassroom(subject){
  var tags = {
    'Nj G6': '@Němčina',
    'L G6': '@Latina',
    'G6 AJK1': "@Angličtina",
    'AJ G6 2022': "@Angličtina",
    'G6 - Bi - 2021/22': "@Biologie",
    'ČJ G6': "@Ceština",
    'G6 - Dějepis': "@Dějepis",
    'Fyzika': "@Fyzika",
    'G6 Hv': "@Hudebka",
    'Ch G6 21 - 22': "@Chemie",
    'G6 - informatika': "@Informatika",
    'Křesťanská výchova': "@Křesťanka",
    'Matematika G5': "@Matematika",
    'Třídní kruh': "@Třídní kruh",
    'Tělesná výchova': "@Tělocvik",
    'G6 Z': "@Zeměpis",
    'ZSV - G6': "@ZSV"
  };
  for (var subjectName of Object.keys(tags)){
    if(subject.includes(subjectName)){
      return tags[subjectName];
    }
  }
  return '@Nezařazeno';
}


function getNameFromSubjectClassroom(subject){
  return subject.substring(subject.search('„')+1, subject.search('“'));
}


function getContentFromBodyClassroom(body){
  var index = body.search('<img height="24px" src="') + 18;
  body = body.substring(index);
  body = body.substring(body.search('; font-size: 14px; font-weight: 400; line-height: 20px; letter-spacing: 0.2px;">')+80);
  return body.substring(0, body.search('</td>'));
}


function getDueDateClassroom(body){
  if(body.includes('Termín odevzdání: ')){
    var index = body.search('Termín odevzdání: ') + 18;
    body = body.substring(index);
    return body.substring(0, body.search('. - ') + 1);  
  }else{
    return 'today'
  }
  
}


function sendTodoEmail(emailSubject, body){
  MailApp.sendEmail({
    to: "example@todoist.com",
    subject: emailSubject,
    htmlBody: body
  })
}

function stop(){}
