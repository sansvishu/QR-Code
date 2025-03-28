document.addEventListener('DOMContentLoaded', function() {
    const qrContainer = document.getElementById('qrContainer');
    const gameContainer = document.getElementById('gameContainer');
    const toggleToolBtn = document.getElementById('toggleTool');
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const qrLink = document.getElementById('qrLink');
    const imagePreview = document.getElementById('imagePreview');
    const qrPreview = document.getElementById('qrPreview');
    
    let currentFile = null;
    
    // Toggle between game and QR tool
    toggleToolBtn.addEventListener('click', function() {
        if (qrContainer.style.display === 'block') {
            qrContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            toggleToolBtn.textContent = 'Switch to QR Generator';
        } else {
            qrContainer.style.display = 'block';
            gameContainer.style.display = 'none';
            toggleToolBtn.textContent = 'Switch to Game';
        }
    });
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        if (files.length > 0) {
            currentFile = files[0];
            displayImagePreview(currentFile);
        }
    }
    
    function displayImagePreview(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
    
    generateBtn.addEventListener('click', function() {
        if (!currentFile && !qrLink.value) {
            alert('Please upload an image or enter a URL');
            return;
        }
        
        qrPreview.innerHTML = '';
        
        // Create data URL for QR code
        let qrData;
        if (currentFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                qrData = e.target.result;
                generateQRCode(qrData);
            };
            reader.readAsDataURL(currentFile);
        } else {
            qrData = qrLink.value;
            generateQRCode(qrData);
        }
    });
    
    function generateQRCode(data) {
        new QRCode(qrPreview, {
            text: data,
            width: 256,
            height: 256,
            colorDark: "#33ff33",
            colorLight: "transparent",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    downloadBtn.addEventListener('click', function() {
        if (!qrPreview.querySelector('img')) {
            alert('Please generate a QR code first');
            return;
        }
        
        const qrImage = qrPreview.querySelector('img');
        const link = document.createElement('a');
        link.download = 'menu-qr-code.png';
        link.href = qrImage.src;
        link.click();
    });
});
