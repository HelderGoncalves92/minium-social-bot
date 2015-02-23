<a href="url"><img src="http://viltgroup.github.io/minium/images/banner_minium.png" align="left" height="100" ></a>
<a href="url"><img src="http://seium.org/sei_15_webpage/img/mascote.png" height="100" ></a>

Minium wants to have a social live!

So you’ll have to teach him how to manage his social network, for instance, Facebook or Twitter.

Examples of what you can program Minium to do:

 * Reply to posts (you can use any online chat bot for the task), even in other languages than english (you can use google translator)
 * Add contents to its wall (news, memes, videos, you decide)
 * Accept friend requests
 * Congratulate friends for a new achievement or birthday
 * Pass Turing Test
 * In the best case scenario you can drive a "Social Media Manager" out of work !


In this challenge, I added to **Minium** the following features:
	
	* Check and reply to personal mails in Gmail
	* Check and reply to personal messages in Twitter
	* Check and reply if exists new tweets
	* Do multiple posts in Twitter like:
		* A music of Top 25 of the day
		* A celebraty birthday today
		* A news of pplware or publico
		* The weather of a random city
		* What I have to do in my Google Calendar


## Getting Started

*For more information take a look in http://minium.vilt.io.*

 * Download your platform [minium-tools-bundle-1.0.0-SNAPSHOT](http://sourceforge.net/projects/minium/files/minium-tools-1.0.0.SNAPSHOT/)
 * Uncompress it into some directory (lets refer to it as `MINIUM_HOME`)

```bash
git clone https://github.com/viltgroup/minium-social-bot
```

 * If you want to open **Minium Developer** and start editing scripts, run the following commands:

```bash
cd minium-social-bot
$MINIUM_HOME/bin/minium-developer
```
 * Or if you just want to run it, use **Minium Automator** instead

```bash
cd minium-social-bot

# Change to your values
TWITTER_EMAIL=youremail@yourdomain.com
TWITTER_PASSWORD=yourpassword
$MINIUM_HOME/bin/minium-automator -d . "credentials = { email : '$TWITTER_EMAIL', password : '$TWITTER_PASSWORD' }"
```

This will open your Twitter account and use a Chat Bot to generate a message that Minium will use to send a tweet for you, so watch out :)
