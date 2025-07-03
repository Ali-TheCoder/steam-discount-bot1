import { Telegraf, Markup } from "telegraf";
import fetch from "node-fetch";

const bot = new Telegraf("7252470204:AAHhdySpYucLyeGcQrCqAi13Ni2HafPqQIs");

async function getGameInfo(title) {
  const url = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(
    title
  )}&limit=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0]; // اولین نتیجه
}

async function getDealInfo(gameID) {
  const url = `https://www.cheapshark.com/api/1.0/games?id=${gameID}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.deals[0]; // بهترین Deal
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

async function sendGameCard(ctx, title) {
  await ctx.answerCbQuery();
  const game = await getGameInfo(title);

  if (game) {
    const deal = await getDealInfo(game.gameID);
    if (!deal) {
      ctx.reply("هیچ دیلی برای این بازی موجود نیست.");
      return;
    }

    const normalPrice = parseFloat(deal.retailPrice);
    const salePrice = parseFloat(deal.price);
    const discountPercent = Math.round((1 - salePrice / normalPrice) * 100);

    let discountText = "";
    if (discountPercent > 0) {
      discountText = `💸 تخفیف خورده: ${discountPercent}%\n💲 قیمت با تخفیف: $${salePrice}`;
    } else {
      discountText = "❌ تخفیف نخورده.";
    }

    ctx.replyWithPhoto(game.thumb, {
      caption: `🎮 *${game.external}*
${discountText}
🔗 [لینک خرید](https://www.cheapshark.com/redirect?dealID=${deal.dealID})`,
      parse_mode: "Markdown",
    });
  } else {
    ctx.reply("بازی پیدا نشد.");
  }
}

bot.action("mw2", (ctx) => sendGameCard(ctx, "modern warfare 2"));
bot.action("mw3", (ctx) => sendGameCard(ctx, "modern warfare 3"));

bot.action("back", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "🔙 برگشتی به منوی اصلی.",
    Markup.keyboard([["🎮 بازی‌ها"]]).resize()
  );
});

bot.launch();
console.log("🤖 Bot is running...");
