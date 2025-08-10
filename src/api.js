const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || window._env?.REACT_APP_API_ENDPOINT;

export async function sendMessage(customerId, text, lang) {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, text, lang })
  });

  if (!response.ok) {
    const errTxt = await response.text();
    throw new Error('API call failed: ' + errTxt);
  }

  const data = await response.json();

  // Play audio if available from audioUrl
  if (data.audioUrl) {
    const audio = new Audio(data.audioUrl);
    audio.play().catch(e => console.warn('Audio play failed', e));
  }

  // Return in the format the UI expects
  return {
    reply: data.text,      // mapped from API's "text"
    audioUrl: data.audioUrl || null
  };
}
