document.addEventListener('DOMContentLoaded', function() {
    // Get all elements
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
        if (qrContainer.style.display === 'none') {
            qrContainer.style.display = 'block';
            gameContainer.style.display = 'none';
            toggleToolBtn.textContent = 'Switch to Game';
        } else {
            qrContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            toggleToolBtn.textContent = 'Switch to QR Generator';
        }
    });
    
    // Handle drag and drop events
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
        if (files && files.length > 0) {
            currentFile = files[0];
            if (currentFile.type.startsWith('image/')) {
                displayImagePreview(currentFile);
            } else {
                alert('Please select an image file');
            }
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
        if (!currentFile && !qrLink.value.trim()) {
            alert('Please upload an image or enter a URL');
            return;
        }
        
        qrPreview.innerHTML = '';
        
        const qrData = currentFile ? 
            new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.readAsDataURL(currentFile);
            }) : 
            Promise.resolve(qrLink.value.trim());
        
        qrData.then(data => {
            QRCode.toCanvas(qrPreview, data, {
                width: 200,
                color: {
                    dark: '#33ff33',
                    light: '#00000000'
                }
            }, function(error) {
                if (error) {
                    console.error(error);
                    alert('Error generating QR code');
                }
            });
        });
    });
    
    downloadBtn.addEventListener('click', function() {
        const canvas = qrPreview.querySelector('canvas');
        if (!canvas) {
            alert('Please generate a QR code first');
            return;
        }
        
        const link = document.createElement('a');
        link.download = 'menu-qr-code.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});
