module.exports = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      error: 'ID obrigatório'
    });
  }

  try {
    const response = await fetch(
      `https://api.abacatepay.com/v2/transparents/check?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ABACATE_API_KEY}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json({
      status: result.data.status
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
};
