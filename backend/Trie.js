const fs = require('fs');
const readline = require('readline');


T9Map = {
    'a': 2, 'b': 2, 'c': 2,
    'd': 3, 'e': 3, 'f': 3,
    'g': 4, 'h': 4, 'i': 4,
    'j': 5, 'k': 5, 'l': 5,
    'm': 6, 'n': 6, 'o': 6,
    'p': 7, 'q': 7, 'r': 7, 's': 7,
    't': 8, 'u': 8, 'v': 8,
    'x': 9, 'y': 9, 'z': 9,
}

const tokenizeWord = (word) => {
    return word.toLowerCase().split('')
        .map(l => T9Map[l])
        .join('');
}

class Trie {

    constructor(path){
        // root node
        this.root = new TrieNode("", false);

        // read file line by line and extract words

        const words = require('fs').readFileSync(path, 'utf-8')
            .split('\r\n')
            .filter(Boolean);

        // put words into nodes
        for(const word of words){
            this.insert(word);
        }

        console.log(this.searchExpansions("26672337"));
    }

    // traverse nodes & insert word
    insert(word){
        let _node = this.root;

        // tokenized word
        const tk_word = tokenizeWord(word);

        // traverse nodes and create new ones if don't exist
        for(let i = 0; i < tk_word.length; i ++){
            const key = tk_word[i];
            if(!_node.hasChild(key)){
                _node.insertChild(key);
            } 
            _node = _node.getChild(key);
        }

        // put word into node
        _node.insertWord(word);
    }

    printTree(node){
        if (!node)
            return;
                    
        const children = node.getChildren().map(d => node.getChild(d));
        for(const _node of children){
            console.log(_node);
            this.printTree(_node);
        }
    }

    // returns all possible expansions of a word
    // accepts tokens
    searchExpansions(word){
        let _node = this.root;

        // traverse nodes and create new ones if don't exist
        for(let i = 0; i < word.length; i ++){
            const key = word[i];
            if(!_node.hasChild(key)){
                return;
            } 
            _node = _node.getChild(key);
        }
        return _node.getWords();
    }
    
}

class TrieNode {

    static getSubtree(node, list){

    }

    constructor(key){
        this.key = key;
        this.children = new Map();
        this.words = [];
    }

    hasChild(key){
        return this.children.has(key);
    }

    /* --- */

    insertChild(key){
        this.children.set(key, new TrieNode(key, false));
    }

    getChild(key){
        return this.children.get(key);
    }

    getChildren(){
        return Array.from(this.children.keys());
    }


    /* --- */
    insertWord(word){
        this.words.push(word);
    }

    getWords(){
        return this.words;
    }

}

module.exports.Trie = Trie;