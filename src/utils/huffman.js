class Node {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

// Function to build frequency map
function buildFrequencyMap(text) {
    const freqMap = {};
    for (let char of text) {
        freqMap[char] = (freqMap[char] || 0) + 1;
    }
    return freqMap;
}

// Function to build Huffman Tree
function buildHuffmanTree(freqMap) {
    const nodes = Object.entries(freqMap).map(([char, freq]) => new Node(char, freq));

    while (nodes.length > 1) {
        // Sort by frequency
        nodes.sort((a, b) => a.freq - b.freq);

        // Take two lowest frequency nodes
        const left = nodes.shift();
        const right = nodes.shift();

        // Create new internal node
        const newNode = new Node(null, left.freq + right.freq, left, right);
        nodes.push(newNode);
    }

    return nodes[0]; // Root of the Huffman Tree
}

// Function to generate Huffman Codes
function generateCodes(node, prefix = '', codeMap = {}) {
    if (!node) return;

    if (node.char !== null) {
        codeMap[node.char] = prefix;
    }

    generateCodes(node.left, prefix + '0', codeMap);
    generateCodes(node.right, prefix + '1', codeMap);

    return codeMap;
}

// Encode the text
function encode(text, codeMap) {
    return text.split('').map(char => codeMap[char]).join('');
}

// Decode the binary string
function decode(encoded, tree) {
    let result = '';
    let node = tree;
    for (let bit of encoded) {
        node = bit === '0' ? node.left : node.right;
        if (node.char !== null) {
            result += node.char;
            node = tree;
        }
    }
    return result;
}

// Example usage:
const text = "huffman encoding in javascript";
const freqMap = buildFrequencyMap(text);
const huffmanTree = buildHuffmanTree(freqMap);
const codeMap = generateCodes(huffmanTree);

const encoded = encode(text, codeMap);
const decoded = decode(encoded, huffmanTree);

console.log("Original Text:", text);
console.log("Huffman Codes:", codeMap);
console.log("Encoded Text:", encoded);
console.log("Decoded Text:", decoded);
