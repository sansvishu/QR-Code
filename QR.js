document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dataTypeSelect = document.getElementById('dataType');
    const urlInput = document.getElementById('urlInput');
    const textInput = document.getElementById('textInput');
    const contactInput = document.getElementById('contactInput');
    const wifiInput = document.getElementById('wifiInput');
    const generateBtn = document.getElementById('generateBtn');
    const qrcodeDiv = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('downloadBtn');

    // Event Listeners
    dataTypeSelect.addEventListener('change', handleDataTypeChange);
    generateBtn.addEventListener('click', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);

    // Initialize by showing URL input
    handleDataTypeChange();

    function handleDataTypeChange() {
        const type = dataTypeSelect.value;
        
        // Hide all inputs first
        urlInput.classList.add('hidden');
        textInput.classList.add('hidden');
        contactInput.classList.add('hidden');
        wifiInput.classList.add('hidden');
        
        // Show selected input
        if (type === 'url') {
            urlInput.classList.remove('hidden');
        } else if (type === 'text') {
            textInput.classList.remove('hidden');
        } else if (type === 'contact') {
            contactInput.classList.remove('hidden');
        } else if (type === 'wifi') {
            wifiInput.classList.remove('hidden');
        }
    }

    function generateQRCode() {
        const type = dataTypeSelect.value;
        let data = '';
        
        if (type === 'url') {
            data = document.getElementById('url').value.trim();
            if (!data) {
                alert('Please enter a URL');
                return;
            }
            if (!data.startsWith('http://') && !data.startsWith('https://')) {
                data = 'https://' + data;
            }
        } 
        else if (type === 'text') {
            data = document.getElementById('text').value.trim();
            if (!data) {
                alert('Please enter some text');
                return;
            }
        } 
        else if (type === 'contact') {
            const firstName = document.getElementById('firstName').value.trim() || '';
            const lastName = document.getElementById('lastName').value.trim() || '';
            const phone = document.getElementById('phone').value.trim() || '';
            const email = document.getElementById('email').value.trim() || '';
            
            if (!firstName && !lastName && !phone && !email) {
                alert('Please enter at least one contact detail');
                return;
            }
            
            data = `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName}\nFN:${firstName} ${lastName}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
        } 
        else if (type === 'wifi') {
            const ssid = document.getElementById('ssid').value.trim();
            const password = document.getElementById('password').value.trim();
            const encryption = document.getElementById('encryption').value;
            
            if (!ssid) {
                alert('Please enter a network name');
                return;
            }
            
            data = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
        }
        
        // Clear previous QR code
        qrcodeDiv.innerHTML = '';
        downloadBtn.classList.add('hidden');
        
        // Generate new QR code
        QRCode.toCanvas(qrcodeDiv, data, { 
            width: 200,
            errorCorrectionLevel: 'H',
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, function(error) {
            if (error) {
                console.error(error);
                alert('Error generating QR code');
            } else {
                downloadBtn.classList.remove('hidden');
            }
        });
    }

    function downloadQRCode() {
        const canvas = qrcodeDiv.querySelector('canvas');
        if (!canvas) {
            alert('No QR code generated yet');
            return;
        }
        
        const link = document.createElement('a');
        link.download = `qrcode-${new Date().toISOString().slice(0,10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
});
