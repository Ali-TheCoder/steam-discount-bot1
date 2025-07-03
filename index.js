import { Telegraf, Markup } from "telegraf";
import fetch from "node-fetch";

const bot = new Telegraf(`7252470204:AAHhdySpYucLyeGcQrCqAi13Ni2HafPqQIs`);

async function getGameInfo(title) {
  const url = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(
    title
  )}&limit=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0];
}

bot.start((ctx) => {
  ctx.reply(
    "سلام! برای دیدن لیست بازی‌ها دکمه زیر رو بزن.",
    Markup.keyboard([["🎮 بازی‌ها"]]).resize()
  );
});

bot.hears("🎮 بازی‌ها", (ctx) => {
  ctx.reply(
    "کدوم بازی رو میخوای ببینی؟",
    Markup.inlineKeyboard([
      [Markup.button.callback("Modern Warfare 2", "mw2")],
      [Markup.button.callback("Modern Warfare 3", "mw3")],
      [Markup.button.callback("🔙 برگشت", "back")],
    ])
  );
});

bot.action("mw2", async (ctx) => {
  await ctx.answerCbQuery(); // بستن لودینگ تلگرام
  const game = await getGameInfo("modern warfare 2");
  if (game) {
    ctx.reply(
      `🎮 نام: ${game.external}\n💲 قیمت ارزان‌ترین: $${game.cheapest}\n🔗 [لینک خرید](https://www.cheapshark.com/redirect?dealID=${game.cheapestDealID})`,
      { parse_mode: "Markdown" }
    );
  } else {
    ctx.reply("بازی پیدا نشد.");
  }
});

bot.action("mw3", async (ctx) => {
  await ctx.answerCbQuery();
  const game = await getGameInfo("modern warfare 3");
  if (game) {
    ctx.reply(
      `🎮 نام: ${game.external}\n💲 قیمت ارزان‌ترین: $${game.cheapest}\n🔗 [لینک خرید](https://www.cheapshark.com/redirect?dealID=${game.cheapestDealID})`,
      { parse_mode: "Markdown" }
    );
  } else {
    ctx.reply("بازی پیدا نشد.");
  }
});

bot.action("back", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "🔙 برگشتی به منوی اصلی.",
    Markup.keyboard([["🎮 بازی‌ها"]]).resize()
  );
});

bot.launch();
console.log("🤖 Bot is running...");
