module.exports = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id é obrigatório' });

  try {
    const response = await fetch(`https://api.abacatepay.com/v1/billing/check?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.ABACATE_API_KEY}`
      }
    });

    const data = await response.json();

    if (!response.ok) return res.status(500).json({ error: 'Erro ao verificar pagamento' });

    // status possíveis: PENDING, PAID, EXPIRED, CANCELLED
    res.status(200).json({ status: data.data.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
};
