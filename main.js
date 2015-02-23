/*********** Includes ***********************/
var timeUnits = require("minium/timeunits"),
    keys      = require("minium/keys"),
    // our modules
    ChatBot   = require("bots/chatbot"),
    CleverBot = require("bots/cleverbot"),
    Facebook  = require("socialnetworks/facebook"),
    Twitter   = require("socialnetworks/twitter");
    
var twi_credentials = {"email": "heldergon92", "password":"put_your_pass"};
var goo_credentials = {"email": "heldergoncalves92", "password":"put_your_pass"};


var rfm = "http://rfm.sapo.pt/top25rfm";
var publico = "http://www.publico.pt/";
var pplware = "http://pplware.sapo.pt/";
var twitterPage = "https://twitter.com/";
var youtube = "https://www.youtube.com";  
var google = "https://www.google.pt/";
var googleMail ="https://mail.google.com/";
var googleCalendar = "https://www.google.com/calendar/";
var birthday = "http://www.famousbirthdays.com/";
var tradutorInit = "https://translate.google.pt/#auto/en";
var tradutorFinish = "https://translate.google.pt/#en/";
var tradSIGLAS = {"Inglês":"en","Português":"pt","Italiano":"it","Francês":"fr","Sueco":"sv"}; //Add more languages to recognize


/****************** Functions ***************************/
var goo_login = function(brow){
  brow.get(googleMail);
  brow.$("#Email").fill(goo_credentials["email"]);
  brow.$("#Passwd").fill(goo_credentials["password"]);
  brow.$("#signIn").click();
}


//Need to login in google (if not, the page is automaticaly changed)
var getLanguage = function(msg){
  
  //open tranlate with language detection activated
  tradbrowser.get(tradutorInit);
  tradbrowser.$("#source").fill(msg);
  
  //wait for result and get it
  tradbrowser.$(":root").waitTime(2, timeUnits.SECONDS);
  msg = tradbrowser.$("#result_box").text();

  var reply = bot.reply(msg); //Bot reply -> 'msg' in english
  
  //Get language of source text
  var language = tradbrowser.$("#gt-sl-sugg").find("[value='auto']").text();
  language = language.match(/[A-Za-zê]+/)[0];
  var sigla = tradSIGLAS[language];
  
  //Go to page that translates 'en' to source language
  tradbrowser.get(tradutorFinish + sigla);
  tradbrowser.$("#source").fill(reply);
  tradbrowser.$(":root").waitTime(2, timeUnits.SECONDS);
  reply = tradbrowser.$("#result_box").text();

  return reply;
}

//Check if have unread messages and reply if it's true
var twi_replyMsg = function(){
      var ask, reply;
      
      ask = twitter.getMsg();
      if(ask){
        reply = getLanguage(ask);
        twitter.replyMsg(reply);
      }else{
        var btn = $('#dm_dialog-dialog').find("button.js-close").click();
        return 0;
    }
    return 1;
}

//Select a rand element of the array passed || The element isn't an array, so .length doesn't work. Therefore you need to pass 'num'
var selectRand = function(array,num){
  var rand = parseInt(Math.random() * num);

    while(rand > 0){
      array = array.next();
      rand--;
    }
    return array.first();
}
 

var twi_replyPost = function(){
  browser.get("https://twitter.com/mentions");
  
  //Check if have new mentions (Couldn't work for every case. I don´t understand every case)
  var childs = $(".new-tweets-bar");
  if(!childs.checkForExistence()) return;
  childs.click();
  
  not = $("#stream-items-id").find('li').first();
  not.find('.stream-item-footer').find('button').first().click();
  
  var box = not.find("#tweet-box-template");
  var box2 = not.find(".rich-normalizer");
  var button = not.find(".js-tweet-btn");
  var ask = not.find("p").last().text();
  //ask = ask.replace(/@[A-Za-z0-9]+/,"");//Here, have a error that I don't understand. The goal is cut the ID
  
  reply = getLanguage(ask);
  var stack = box.text();
  box.fill(stack + reply);
  $(":root").waitTime(4, timeUnits.SECONDS);
  button.click();
}


var goo_replyMsg = function(){
  browser.get(googleMail);
  
  var unread = $(".Cp").find(".zA.zE").first().checkForExistence();
  if(!unread) return 0;
  $(".Cp").find(".zA.zE").first().click()//open unread
  var msg = $(".G3.G2").find(".adn.ads").find(".adP.adO").find(".a3s").find("[dir='ltr']").first().html(); //Last message - Contend - Without Extra
  msg = msg.match(/[^<]+/)[0]; //Just work in simple messages. The message sent to bot is up to first '<'
  var reply = getLanguage(msg);
  
  
  $(".G3.G2").find(".gA.gt").click();//Open editable
  $(".G3.G2").find(".editable").fill(reply); //Fill text
  $(".aDh").find(".J-J5-Ji.T-I").click();//Send Mail
  return 1;
}
  
var getBirthday = function(){
   browser.get(birthday);
   var date = new Date();
   date = (date.getMonth()+1)  +" " + date.getDate();
   $("#zipsearch").fill(date);
   $(".search-bar").find("[action='http://www.famousbirthdays.com/s/thesearch.php']").find('input').first().click();
   
   var actor = $(".mtop10").find("a");
   actor = selectRand(actor, 12);
   var name = actor.find(".title").text();
   var work = actor.find(".overflow").text();
   var link = actor.attr("href");
   
    browser.get(twitterPage);
    $("#tweet-box-mini-home-profile").fill("Birthday today:" + "\n" + name + " || " + work + "\n" + link);
    $(".timeline-tweet-box").find('.js-tweet-btn').click();
}

var getWeather = function(city){
  browser.get(google);
  $("#gbqfq").fill("weather " + city);
  $(":root").waitTime(2, timeUnits.SECONDS); //2 minutes listening some music
  //$("#gbqfb").click() 
  
  city = $("#wob_loc").text();
  var condiction = $("#wob_dcp").text();
  var temp = $("#wob_tm").text();
  var precipitation = $("#wob_pp").text();
  var humidity = $("#wob_hm").text();
  var wind = $("#wob_ws").text();
  
  browser.get(twitterPage);
  $("#tweet-box-mini-home-profile").fill(
    "Hoje vai estar "+ condiction + " em "+ city +
    "\nTemperatura: " + temp + "ºC" +
    "\nPrecipitação: " + precipitation + 
    "\nHumidade: " + humidity +
    "\nVento: " + wind);
  $(".timeline-tweet-box").find('.js-tweet-btn').click();
}

var getToDo = function(){
  browser.get(googleCalendar);
  var events = $("#tgCol0").find(".chip").text().match(/[a-zA-ZÀ-ú ]{2,}/g);
  var num = events.length;
  
  browser.get(twitterPage);
  if(num==0){
     $("#tweet-box-mini-home-profile").fill("Hoje não faço nada!!");
  }else if(num<=2){
    var msg="\n"; 
    while((num-1)>=0){msg = msg +"\n" + events[num-1];num--;}
       $("#tweet-box-mini-home-profile").fill("Hoje tenho alguma coisa para fazer:" + msg);
    
  }else if(num>2){
    var msg="\n";
    while((num-1)>=0){msg = msg +"\n" + events[num-1];num--;}
       $("#tweet-box-mini-home-profile").fill("Hoje tenho muito que fazer:" + msg);
  }
  
  $(".timeline-tweet-box").find('.js-tweet-btn').click();
}

var pplPost = function(){
    browser.get(pplware);
    //var noticia = browser.$("#content-area").find('.entry').first().find('.title'); //Select first news
    
    /***** More errors about javascript driver:minium.web.internal.drivers.JavascriptInvocationFailedException: Failed invoking expression:  *******/
    var noticia = browser.$("#content-area").find('.entry');
    noticia.waitForExistence();
    noticia = selectRand(noticia,10).find('.title');
    
    
    var titulo = noticia.text();  
    var href = noticia.find('a').attr("href");
    browser.get(twitterPage);
    
    $("#tweet-box-mini-home-profile").fill(titulo + "\n" + href);
    $(".timeline-tweet-box").find('.js-tweet-btn').click();
}

var publicoPost = function(){
  browser.get(publico);
  var noticia = browser.$(".entries-primary").first().find("a").first();
  var titulo = noticia.find("h2").text();  
  var href = noticia.attr("href");
  
  browser.get(twitterPage);
  $("#tweet-box-mini-home-profile").fill(titulo + "\n" + href);
  $(".timeline-tweet-box").find('.js-tweet-btn').click();
}
  
var topMusic = function(){
  browser.get(rfm);
  var music = $(".row.item");
  
  music.waitForExistence();
  music = selectRand(music,25);
  var info = music.find(".rowInfo").first().find("span");
  var title = info.first().text();
  var author = info.text().replace(title,"");

  /***** I try share in facebook, but it open other window and I can control it ******/  
  // var button = music.find(".btnmais").first().click();
  //var btnface = music.find(".facebookRFMShare").last().click();
  browser.get(youtube);
  var search = $("#masthead-search-term");
  search.fill(title + " "+author);
  $("#masthead-search").find("button").click();
  $(":root").waitTime(2, timeUnits.SECONDS); 
 
  var link = $("#section-list").find("h3.yt-lockup-title").first().find("a");
  title = link.text();
  link = link.attr("href")
  link = youtube+link;
  browser.get(link);
  
  //2 minutes listening some music. This bot is a music lover
  $(":root").waitTime(10, timeUnits.SECONDS); 
  
  browser.get(home);
  $("#tweet-box-mini-home-profile").fill(title + "\n" + link);
  $(".timeline-tweet-box").find('.js-tweet-btn').click();
}

var twi_doPost = function(){
  
  var i = parseInt(Math.random() * 6);
  
  if(i==0) getBirthday();
  else if(i==1) getWeather("Lisboa");
  else if(i==2) getToDo();
  else if(i==3) pplPost();
  else if(i==4) publicoPost();
  else if(i==5) topMusic();
    
}

/**********************************************************/

//Init CleverBot
var botbrowser = minium.newBrowser({
  desiredCapabilities : { browserName : "firefox" }
});

botbrowser.$(":root").configure()
  .defaultTimeout(20, timeUnits.SECONDS);
  
// we'll use a bot to our first post message
var bot = new CleverBot(botbrowser);
var msg = bot.start();


//Init translate - Need do login
var tradbrowser = minium.newBrowser({
  desiredCapabilities : { browserName : "firefox" }
});
  
//Init Google && Twitter
  goo_login(tradbrowser);
  goo_login(browser);


var twitter = new Twitter(browser);
twitter.login(credentials);


/********************** Now do what you want *****************************/
  
  //Example - While's not tested
  while(true){
    twi_replyPost(); //Reply one tweet

    while(twi_replyMsg());  //Check every messages unread
    while(goo_replyMsg());  //Check every mails unread

    twi_doPost(); //Do a random post
    $(":root").waitTime(3600, timeUnits.SECONDS); //Check every hour
  }


  twi_replyPost();
  twi_replyMsg();
  twi_doPost();

  goo_replyMsg();


  //This features are in Twi_doPost()
  getBirthday();
  getWeather("Lisboa");
  getToDo();
  pplPost();
  publicoPost();
  topMusic();
  
  
// and we tweet that message (pray for it to be harmless)
twitter.tweet(msg);

$(":root").waitTime(5, timeUnits.SECONDS);
botbrowser.quit();
