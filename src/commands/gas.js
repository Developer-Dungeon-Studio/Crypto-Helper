const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gas")
    .setDescription("Shows the current gas price for the selected coin")
    .addSubcommand((subCommand) =>
      subCommand
        .setName("ethereum")
        .setDescription("Shows the current ethereum gas price")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("bitcoin")
        .setDescription("Shows the current bitcoin gas price")
    ),

  async execute(interaction, client) {
    switch (interaction.options.getSubcommand()) {
      case "ethereum": {
        let data;

        await fetch(
          `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.API_KEY}`
        )
          .then((res) => res.json())
          .then((res) => {
            data = res;
          });

        if (data.result.suggestBaseFee >= 90) {
          var embedcolor = "#dd2f45";
        } else if (data.result.suggestBaseFee >= 45) {
          var embedcolor = "#ffac32";
        } else {
          var embedcolor = "#79b359";
        }
        if (data.result.FastGasPrice >= 100) {
          var fastemoji = "🔴";
        } else if (data.result.FastGasPrice >= 50) {
          var fastemoji = "🟠";
        } else {
          var fastemoji = "🟢";
        }
        // Normal
        if (data.result.ProposeGasPrice >= 90) {
          var normalemoji = "🔴";
        } else if (data.result.ProposeGasPrice >= 45) {
          var normalemoji = "🟠";
        } else {
          var normalemoji = "🟢";
        }
        // Slow
        if (data.result.SafeGasPrice >= 85) {
          var slowemoji = "🔴";
        } else if (data.result.SafeGasPrice >= 40) {
          var slowemoji = "🟠";
        } else {
          var slowemoji = "🟢";
        }
        var gasembed = new MessageEmbed()
          .setAuthor({
            name: `${client.user.username}`,
            iconURL: client.user.avatarURL(),
          })
          .setColor(embedcolor)
          .setTitle("Last Block: **" + data.result.LastBlock + "**")
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/926292185748496446/972791200308416532/eth.png"
          )
          .setURL("https://etherscan.io/block/" + `${data.result.LastBlock}`)
          .setDescription("Current Ethereum transaction Price:")
          .addFields(
            {
              name: "⚡Fast",
              value: `> ${fastemoji} **${data.result.FastGasPrice}**gwei`,
              inline: true,
            },
            {
              name: "🚶Normal",
              value: `> ${normalemoji} **${data.result.ProposeGasPrice}**gwei`,
              inline: true,
            },
            {
              name: "🐢Slow",
              value: `> ${slowemoji} **${data.result.SafeGasPrice}**gwei`,
              inline: true,
            },
            {
              name: "Suggested BaseFee",
              value: `> **${data.result.suggestBaseFee}**gwei`,
              inline: true,
            }
          )
          .setTimestamp()
          .setFooter({ text: "Crypto Helper made by Mezo#0001" });
        break;
      }
      case "bitcoin": {
        const {
          fastestFee,
          halfHourFee,
          hourFee,
        } = require("../coindata/bitcoin.json");
        var gasembed = new MessageEmbed()
          .setAuthor({
            name: `${client.user.username}`,
            iconURL: client.user.avatarURL(),
          })
          .setColor("#5865f4")
          .setTitle("Bitcoin Fees")
          .setThumbnail(
            "https://imgs.search.brave.com/w_GvHFdrOmNalH99UCRvAnyRauMdsfrriLg__MAL8Gw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9sb2dv/c3BuZy5vcmcvZG93/bmxvYWQvYml0Y29p/bi9sb2dvLWJpdGNv/aW4tNDA5Ni5wbmc"
          )
          .setURL("https://wikipedia.org/wiki/Bitcoin")
          .setDescription("Current Bitcoin transaction price:")
          .addFields(
            {
              name: "⚡Fast",
              value: `> **${fastestFee}**satoshis/byte`,
              inline: true,
            },
            {
              name: "🕧 Half hour",
              value: `> **${halfHourFee}**satoshis/byte`,
              inline: true,
            },
            {
              name: "🕛 Hour",
              value: `> **${hourFee}**satoshis/byte`,
              inline: true,
            }
          )
          .setTimestamp()
          .setFooter({ text: "Crypto Helper made by Mezo#0001" });
      }
      default:
        break;
    }
    interaction.reply({
      embeds: [gasembed],
    });
  },
};
