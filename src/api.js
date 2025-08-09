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

  // Play audio if available
  if (data.audioBase64) {
    const binary = atob(data.audioBase64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.warn('Audio play failed', e));
  }

  return data;
}