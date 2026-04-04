export default async function handler(req, res) {
  const { hex } = req.query;
  
  try {
    const response = await fetch(
      `https://www.colourlovers.com/api/palettes?hex=${hex}&format=json`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch palettes' });
  }
}