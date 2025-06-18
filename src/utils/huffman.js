// Huffman Node
class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

// Build Huffman Tree and return root
function buildHuffmanTree(str) {
  const freqMap = {};
  for (const char of str) freqMap[char] = (freqMap[char] || 0) + 1;
  const nodes = Object.entries(freqMap).map(([char, freq]) => new HuffmanNode(char, freq));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push(new HuffmanNode(null, left.freq + right.freq, left, right));
  }
  return nodes[0];
}

// Generate codes from tree
function generateCodes(node, prefix = '', codeMap = {}) {
  if (!node) return;
  if (node.char !== null) codeMap[node.char] = prefix;
  generateCodes(node.left, prefix + '0', codeMap);
  generateCodes(node.right, prefix + '1', codeMap);
  return codeMap;
}

// Encode string
export function huffmanEncode(str) {
  if (!str) return { encoded: '', tree: null, codeMap: {} };
  const tree = buildHuffmanTree(str);
  const codeMap = generateCodes(tree);
  const encoded = str.split('').map(ch => codeMap[ch]).join('');
  return { encoded, tree, codeMap };
}

// Decode string
export function huffmanDecode(encoded, tree) {
  let result = '';
  let node = tree;
  for (const bit of encoded) {
    node = bit === '0' ? node.left : node.right;
    if (node.char !== null) {
      result += node.char;
      node = tree;
    }
  }
  return result;
}

// For visualization: get tree as array of {char, freq, left, right}
export function serializeTree(node) {
  if (!node) return null;
  return {
    char: node.char,
    freq: node.freq,
    left: serializeTree(node.left),
    right: serializeTree(node.right),
  };
}