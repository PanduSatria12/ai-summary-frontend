// ELEMENT
const noteInput  = document.getElementById('noteInput');
const charCount  = document.getElementById('charCount');
const runBtn     = document.getElementById('runBtn');
const resultCard = document.getElementById('resultCard');
const resultBox  = document.getElementById('resultBox');

let selectedMode = 'ringkas';

// PROMPT
const prompts = {
  ringkas: 'Ringkas dalam 2 kalimat',
  poin: 'Ambil poin penting',
  eli5: 'Jelaskan seperti anak SD',
  aksi: 'Buat action items'
};

// CHAR COUNT
noteInput.addEventListener('input', () => {
  charCount.textContent = noteInput.value.length + ' karakter';
});

// MODE BUTTON
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn')
      .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');
    selectedMode = btn.dataset.mode;
  });
});

// MAIN FUNCTION
async function runSummarize() {
  const text = noteInput.value.trim();
  if (!text) return alert('Masukkan teks dulu');

  runBtn.disabled = true;
  runBtn.textContent = 'Memproses...';

  resultCard.style.display = 'block';
  resultBox.textContent = '⏳ Sedang memproses...';

  try {
    const response = await fetch('https://ai-summary-backend.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        systemPrompt: prompts[selectedMode]
      })
    });

    // cek status response
    if (!response.ok) {
      throw new Error('Server error');
    }

    const data = await response.json();

    // fallback kalau kosong
    resultBox.textContent = data.result || 'Tidak ada hasil';

  } catch (err) {
    resultBox.textContent = '⚠️ Error: ' + err.message;
  }

  runBtn.disabled = false;
  runBtn.textContent = 'Ringkas Sekarang';
}

// EVENT
runBtn.addEventListener('click', runSummarize);