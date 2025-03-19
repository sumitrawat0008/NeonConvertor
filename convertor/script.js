let currentFile = null;
let currentTool = null;
let outputFormat = '';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // File Input
    document.getElementById('browseBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    // Tool Selection
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => selectTool(card));
    });

    // Drag/Drop
    const dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // File Input Change
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);

    // Preview Button
    document.getElementById('previewBtn').addEventListener('click', showPreview);

    // Convert Button
    document.getElementById('convertBtn').addEventListener('click', startConversion);
});

// Drag/Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#00f3ff';
}

function handleDragLeave(e) {
    e.currentTarget.style.borderColor = '#ff00ff';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#ff00ff';
    handleFiles(e.dataTransfer.files);
}

// File Handling
function handleFileSelect(e) {
    handleFiles(e.target.files);
}

function handleFiles(files) {
    if (files.length > 0) {
        currentFile = files[0];
        document.getElementById('fileName').textContent = 
            `Selected: ${currentFile.name} (${Math.round(currentFile.size/1024)}KB)`;
        document.getElementById('filePreview').style.display = 'block';
    }
}

// Tool Selection
function selectTool(toolElement) {
    document.querySelectorAll('.tool-card').forEach(card => card.classList.remove('active'));
    toolElement.classList.add('active');
    currentTool = toolElement.dataset.tool;
    outputFormat = toolElement.dataset.output;
    document.getElementById('selectedToolDisplay').textContent = 
        `Selected Tool: ${toolElement.querySelector('h3').textContent} | Output: ${outputFormat}`;
}

// Preview Modal
function showPreview() {
    if (!currentFile) {
        alert('Please select a file first!');
        return;
    }

    const modalPreview = document.getElementById('modalPreview');
    const reader = new FileReader();

    if (currentFile.type.startsWith('image/')) {
        reader.onload = (e) => {
            modalPreview.innerHTML = `<img src="${e.target.result}" class="preview-image" alt="Preview">`;
        };
        reader.readAsDataURL(currentFile);
    } else {
        modalPreview.innerHTML = `
            <p>File Name: ${currentFile.name}</p>
            <p>File Type: ${currentFile.type}</p>
            <p>File Size: ${Math.round(currentFile.size/1024)}KB</p>
        `;
    }
    document.getElementById('previewModal').style.display = 'flex';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

// Conversion Logic
function startConversion() {
    if (!currentTool) {
        alert('Please select a conversion tool first!');
        return;
    }
    if (!currentFile) {
        alert('Please select a file first!');
        return;
    }

    const progressBar = document.getElementById('progressBar');
    const downloadLink = document.getElementById('downloadLink');
    const convertBtn = document.getElementById('convertBtn');

    // Reset state
    progressBar.style.width = '0%';
    convertBtn.disabled = true;
    downloadLink.style.display = 'none';

    // Simulate conversion
    let progress = 0;
    const conversion = setInterval(() => {
        progress += Math.random() * 10;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(conversion);
            convertBtn.disabled = false;
            createDownloadFile();
        }
    }, 300);
}

function createDownloadFile() {
    const ext = outputFormat.split('/')[0].toLowerCase();
    const filename = `converted-${currentFile.name.split('.')[0]}.${ext}`;
    
    // Create dummy content
    const content = `NeonConvert ${currentTool} conversion result\n` +
                    `Original file: ${currentFile.name}\n` +
                    `Converted at: ${new Date().toLocaleString()}`;

    const blob = new Blob([content], {type: 'application/octet-stream'});
    const url = URL.createObjectURL(blob);

    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'block';
}