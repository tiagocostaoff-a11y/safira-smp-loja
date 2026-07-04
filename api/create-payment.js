module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { itemName, price } = req.body;

  if (!itemName || !price) {
    return res.status(400).json({
      error: 'itemName e price são obrigatórios'
    });
  }

  try {
    const response = await fetch(
      'https://api.abacatepay.com/v2/transparents/create',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.ABACATE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          method: "PIX",
          data: {
            amount: Math.round(price * 100),
            description: itemName,
            expiresIn: 3600
          }
        })
      }
    );

    const result = await response.json();

    console.log(result);

    if (!response.ok || result.success !== true) {
      console.error(result);
      return res.status(500).json(result);
    }

    return res.status(200).json({
      billingId: result.data.id,
      pixQrCode: result.data.brCodeBase64,
      pixCopyPaste: result.data.brCode
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
};
