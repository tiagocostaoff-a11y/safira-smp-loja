module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { itemName, price } = req.body;
  if (!itemName || !price) return res.status(400).json({ error: 'itemName e price são obrigatórios' });

  try {
    const response = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ABACATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        products: [
          {
            externalId: itemName.toLowerCase().replace(/\s+/g, '-'),
            name: itemName,
            description: itemName,
            quantity: 1,
            price: Math.round(price * 100) // AbacatePay usa centavos
          }
        ],
        returnUrl: process.env.SITE_URL || 'https://seusite.vercel.app',
        completionUrl: process.env.SITE_URL || 'https://seusite.vercel.app'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('AbacatePay erro:', data);
      return res.status(500).json({ error: data.error || 'Erro ao gerar pagamento' });
    }

    // AbacatePay retorna o link de pagamento e o id da cobrança
    res.status(200).json({
      billingId: data.data.id,
      pixQrCode: data.data.pixQrCode,       // base64 do QR
      pixCopyPaste: data.data.pixCopyPaste  // copia-e-cola
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao gerar pagamento' });
  }
};
