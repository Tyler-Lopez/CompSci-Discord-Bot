const Discord = require("discord.js"); // imports the discord library
//const fs = require("fs"); // Imports the file io library  IGNORE ERRORS ON THIS LINE!  DO NOT REMOVE!
const { prefix, token, devstate } = require('./config.json');
//const file = require("cs-quotes.txt");
const { csquoteschannel, FOURSEVENTYTWOchannel, mcchat, mcconsole, compscibotstatuschannel, botdevstatuschannel }= require('./ids.json');
const client = new Discord.Client(); // creates a discord client

const Administrative = require("./user_code/Administrative");
const Entertainment = require("./user_code/Entertainment");
const Server = require("./user_code/Server");

client.once("ready", () => 
{
  if(`${devstate}`=='true')
  {
    console.info(`Logged in as ${client.user.tag}!`);
    console.info("Ready and stable!");
    //Displays Ready and stable in console on run to verify the bot actually starts and doesnt crash
    console.info("Starting in Development Mode");
  client.channels.cache.get(`${compscibotstatuschannel}`).send('Bot Ready and running on localhost!'); //Shoots message into #bot-status channel on CompSci server
  client.channels.cache.get(`${botdevstatuschannel}`).send('Bot Ready and running on localhost!'); //Shoots message into #bot-status channel on Bot test server
    //Shoots a Ready command into the corresponding channel
  }
  else
  {
    console.info(`Logged in as ${client.user.tag}!`);
    console.info("Ready and stable!");
    //Displays Ready and stable in console on run to verify the bot actually starts and doesnt crash

  client.channels.cache.get(`${compscibotstatuschannel}`).send('CompSci Bot Online and Ready!'); //Shoots message into #bot-status channel on CompSci server
  client.channels.cache.get(`${botdevstatuschannel}`).send('CompSci Bot Online and Ready!'); //Shoots message into #bot-status channel on Bot test server
    //Shoots a Ready command into the corresponding channel
  }
});

client.on('ready', () => 
    {
        // Set bot status to: "Playing with JavaScript"
        client.user.setActivity("with JavaScript and learning new features!");
        //client.users.cache.get("707293854507991172") Any idea where this line of code came from?  Or what the ID is for?
    });
///////Everything above is basic bot config information.  Do not touch unless you know what you are doing!/////

var softkill = false; 
var bypass = false;
var bypassdelete=false;

client.on("message", message => 
{ // runs whenever a message is sent

  //Ignores bots from deleting their own messages with spam filter, and deleting other bots messages
  if (message.author.bot) return;

  if (message.content.startsWith(`${prefix}tb`))
  {
      if(message.member.roles.cache.find(r => r.name === "tempbotbypass")) 
      {
        var args = message.content.slice(3).trim();
        message.channel.send(`${args} by: ${message.author.username}`);
      }
      else 
      {
        message.delete({ timeout: 2000 });
        console.log("Deleting message: "+message.content);
        return;
      }
  }
 
  if (!bypass && (message.author.id !== '404717378715385856'))
    {
      let capsbool = Server.capsProtect(message.content);
      if ((capsbool===false) && (!message.content.startsWith('Gave +1 Rep to')) && (message.channel.id != `${mcchat}`)&& (message.channel.id != `${mcconsole}`)&& (message.channel.id != `${FOURSEVENTYTWOchannel}`))
      {
        message.delete({ timeout: 2000 })
        console.log("Deleting message: "+message.content);
      }
      else if(bypassdelete===true)
      {
        bypassdelete=false;
      } 
    } 

  if (!softkill)
  {
    //Adds the bypass command to toggle bypassing the Caps Filter
    if (message.content === `${prefix}bypass`) 
    {
      bypass = Server.bypass(message,bypass);
    } 

    //Responds with a random quote from the list compiled on 2.7.2021 from cs-quotes channel
    if (message.content === `${prefix}quote`) 
    {
      Entertainment.quote(message);
    } 

    //Responds from a random quote at Saras personal collection of quotes
    if (message.content === `${prefix}makemelaugh`) 
    {
      Entertainment.makemelaugh(message);
    } 

    //Responds with Pong after send the ping command with prefix
    else if (message.content === `${prefix}ping`) 
    {  
      message.channel.send(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    } 

    //Kills and stops server with response when a specific user (In this case Brendan#9412) runs the kill command with prefix
    else if (message.content === `${prefix}kill`)  
    {
        Server.kill(message);
    }

    //Displays the user info of the person who sends
    else if (message.content === `${prefix}user-info`)
    {
      message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }

    //Send Custom emojis message when doing {prefix}ce comamnd
    else if (message.content === `${prefix}ce`)
    {
      Entertainment.ce(message);  
    }

    //Sends a motivational quote (or meme)
    else if (message.content === `${prefix}motivateme`)
    {
      Entertainment.motivateme(message);
    }

    //Attempts to kick user
    else if (message.content.startsWith(`${prefix}kick`)) 
    {
      if (!message.guild) return;

      Administrative.kick(message);
    }

    //Attempts to ban user
    else if (message.content.startsWith(`${prefix}ban`)) 
    {
      if (!message.guild) return;

      Administrative.ban(message);
    }

    //Prints help message
    else if (message.content.startsWith(`${prefix}help`)) 
    {
      Administrative.help(message);
    }

    if (message.content.startsWith(`${prefix}clean`))
    {
      var num = message.content.slice(6).trim();
      Administrative.clean(message, num, client);
    }
  }
  if(message.content === `${prefix}softkill`) 
  { //softkill functionality
    softkill = Server.soft_kill(message,softkill);
  }

  if(message.channel.id === `${csquoteschannel}`)
  {
    Server.quotecatcher(message.content);
  }
}); //End of Message Sent loop

client.login(token); // starts the bot up