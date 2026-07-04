module.exports = async (req, res) => {
  try {
    const { event, data } = req.body;

    if (event === 'checkout.completed' && data && process.env.DISCORD_WEBHOOK_URL) {
      const billing = data.billing || data;
      const product = billing.products && billing.products[0];
      const amount = ((billing.amount || 0) / 100).toFixed(2).replace('.', ',');

      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content:
            `✅ **Pagamento recebido no Nubank!**\n` +
            `🛒 Item: **${product ? product.name : 'Item'}**\n` +
            `💰 Valor: **R$ ${amount}**\n` +
            `🆔 ID: ${billing.id}`
        })
      });
    }

    res.status(200).send('ok');
  } catch (err) {
    console.error(err);
    res.status(200).send('erro tratado');
  }
};
