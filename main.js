function myFunction() {
  var threads = GmailApp.search('is:unread');
  for (var i=0; i < threads.length; i++) {
    var messages = threads[i].getMessages();

    for (var j=0; j < messages.length; j++) {
      var activeMessage = messages[j]
      var author = activeMessage.getFrom();
      if(author.includes('robot@edookit.com')){
        var body = activeMessage.getBody();
        var subject = activeMessage.getSubject();
        var tag = getSubjecttagFromSubject(subject);
        var name = getContentFromBody(body)
        if(subject.includes('Zadání')){
          if(tag==-1){
            sendEmail(subject + '<date today>', body);
            activeMessage.markRead();
          }else if(name.length > 0){
            sendEmail(name + ' ' + tag + '<date today>', body);
            activeMessage.markRead();
          }
        }
      }
    }
  }
}

function getSubjecttagFromSubject(subject){
  var subjectsList = ['Německý jazyk', 'Latina'];
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
  for (var subjectName of subjectsList){
    if(subject.includes(subjectName)){
      return tags[subjectName];
    }
  }
  return -1
}

function getContentFromBody(body){
  var originalBody = body;
  var index = body.search('-----------------------------<br />') + 36;
  body = body.substring(index);
  body = body.substring(0, body.search('----------------------------- <br />'));
  return body.substring(0, body.length-8);
}

function sendEmail(emailSubject, body){
  MailApp.sendEmail({
    to: "=xxxxxxxxxxxxxxxxx@todoist.net>",
    subject: emailSubject,
    htmlBody: body
  })
}
