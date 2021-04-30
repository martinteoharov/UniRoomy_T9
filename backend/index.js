const express = require('express')
const app = express()
const port = 3001

/* --- Trie Setup --- */
const { Trie } = require('./Trie')
console.log(Trie)

// debugging set
const word_list = [
    'comradely',
    'comradeliness',
    'comradery',
    'comrades',
    'amnsbefq',
    'comradeship',
    'comradeships',
    'comrado',
    'comras',
    'comrogue',
    'coms',
    'comsat',
    'comsymp',
    'comsymps',
    'comsomol',
    'comstock',
]

const trie = new Trie("words.txt")

/* --- Express Setup --- */
app.use(express.json());
app.post('/parse', (req, res) => {
    const expansions = trie.searchExpansions(req.body.str);

    const obj = {
        default: '',
        expansions: expansions ? expansions : [],
    }

    console.log(`response length: ${expansions ? expansions.length : 0}`);

    res.json(obj);
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
