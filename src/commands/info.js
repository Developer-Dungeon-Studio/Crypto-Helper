const { EmbedBuilder, SlashCommandBuilder, version: djsversion } = require('discord.js');

const os = require('os');
const { version } = require('../../package.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows some information about the bot.'),
  async execute(interaction, client) {
    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor(client.uptime / 3600000) % 24;
    const minutes = Math.floor(client.uptime / 60000) % 60;
    const seconds = Math.floor(client.uptime / 1000) % 60;

    const core = os.cpus()[0];

    const infoEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username}`,
        iconURL: client.user.avatarURL(),
      })
      .setColor('#5865f4')
      .setTitle('Bot Info')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields({
        name: '> General',
        value: [
          '**❯  Discord:** [Server Invite](https://discord.gg/vMyXAxEznS)',
          '**❯  Client:** [Bot Invite](https://discord.com/oauth2/authorize?client_id=747050613656911892&permissions=274878294080&scope=bot%20applications.commands)',
          `**❯  Servers:** ${client.guilds.cache.size.toLocaleString()} `,
          `**❯  Users:** ${client.guilds.cache
            .reduce((a, b) => a + b.memberCount, 0)
            .toLocaleString()}`,
          `**❯  Channels:** ${client.channels.cache.size.toLocaleString()}`,
          `**❯  Bot Version:** v${version}`,
          `**❯  Node.js:** ${process.version}`,
          `**❯  Discord.js:** v${djsversion}`,
        ].join('\n'),
      })
      .addFields({
        name: '> System',
        value: [
          `**❯  Platform:** ${process.platform}`,
          `**❯  Uptime:** ${`${days}d ${hours}h ${minutes}m ${seconds}s`}`,
          '**❯  CPU:**',
          `❯  Cores: ${os.cpus().length}`,
          `❯  Threads: ${os.cpus().length * 2}`,
          `❯  Model: ${core.model}`,
          `❯  Base Speed: ${core.speed}MHz`,
        ].join('\n'),
      })
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      })
      .setTimestamp();

    interaction.reply({ embeds: [infoEmbed], ephemeral: false });
  },
};
