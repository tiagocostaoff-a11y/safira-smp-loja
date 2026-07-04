module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { itemName, price } = req.body;
  if (!itemName || !price) return res.status(400).json({ error: 'itemName e price são obrigatórios' });

  try {
    const response = await fetch('https://api.abacatepay.com/v1/pixQrCode/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ABACATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(price * 100),
        expiresIn: 3600,
        description: itemName
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('AbacatePay erro:', JSON.stringify(data));
      return res.status(500).json({ error: data.error || 'Erro ao gerar pagamento' });
    }

    res.status(200).json({
      billingId: data.data.id,
      pixQrCode: data.data.brCodeBase64,
      pixCopyPaste: data.data.brCode
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao gerar pagamento' });
  }
};
