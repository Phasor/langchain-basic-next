
export default async function handler(req, res) {
    const domainList = req.body;
    console.log(`calling godaddy with ${domainList}`)
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_GODADDY_API_BASE_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `sso-key ${process.env.NEXT_PUBLIC_GODADDY_API_KEY}:${process.env.NEXT_PUBLIC_GODADDY_API_SECRET}`
      },
      body: JSON.stringify(domainList)
    }
    )
    const data = await response.json();
    res.status(200).json(data);
  }
  