var CleverBot = require("bots/cleverbot");

function Twitter(browser) {
  var $          = browser.$;
 browser.get("https://twitter.com/");
}



Twitter.prototype.login = function (opts) {
  var emailFld     = $("#signin-email");
  var passwordFld  = $("#signin-password");
  var keepLoginFld = $(".remember input");
  var loginBtn     = $(".js-submit");
  
  emailFld.fill(opts.email);
  passwordFld.fill(opts.password);
  loginBtn.click();
};

Twitter.prototype.tweet = function (msg) {
  var msgboxContainer = $("#tweet-box-mini-home-profile div");
  var msgbox          = $("#tweet-box-mini-home-profile");
  var tweetBtn        = $(".js-tweet-btn");
  
  msgboxContainer.click();
  msgbox.fill(msg);
  tweetBtn.click();
};

Twitter.prototype.getMsg = function(){
  var msgs = $("#global-actions").find(".dm-nav").find("a").first();
  msgs.click();
  
  var msg = $("#dm_dialog_conversation_list").find(".DMInbox").find(".is-unread").first();
  if(!msg.checkForExistence()) return;
  msg.click();
  
  var textElem = $('#dm_dialog_conversation').find(".received").last().find("p");
  textElem.waitForExistence();
  
  return textElem.text();
  
}

Twitter.prototype.replyMsg = function(msg){
  
  var text = $("#tweet-box-dm-conversation").fill(msg);
  var dd = $('.messaging').click();
  var btn = $('#dm_dialog-dialog').find("button.js-close").click();
}

Twitter.prototype.getNot = function(){
  //$("#global-actions").find(".notifications").find("a").first().click();
  
  //var hasnot = $(".new-tweets-bar");
  //if(!hasnot) return; //Senão houverem novas
  
  //hasnot.click();
  
  not = $("#stream-items-id").find('li').first();
  not.find('.stream-item-footer').find('button').first().click();

  arr={"box":not.find("#tweet-box-template"),"button":not.find(".js-tweet-btn") , "ask":not.find("p").text()}
  
  return arr;
  
 // like = not.find(".u-linkClean")//.css("display");
//  if(like = "none")
}

 
  




module.exports = Twitter;