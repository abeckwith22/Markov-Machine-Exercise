/** Command-line tool to generate Markov text. */

const { MarkovMachine } = require("./markov");
const axios = require("axios").default;
const fs = require("fs");
const argv = process.argv;


options = new Set(['--url', '--file'])

function getResult(URL){
    return axios.get(URL).then(function (response){
        data = response.data;
        let mm = new MarkovMachine(data);
        mm.makeChains()
        console.log(mm.makeText());
    })
}

for (let arg of argv){
    if(options.has(arg)){
        if(arg.toLowerCase() === '--url'){
            url_path = argv[3];
            let response = getResult(url_path);
            console.log(`... generated text from URL ${url_path} ...`);
        }
        else if(arg.toLowerCase() === '--file'){
            file_path = argv[3];
            fs.readFile(file_path, 'utf8', (err, data)=>{
                if(err){
                    console.log(`ERROR: ${err}`);
                    process.exit(1);
                }
                console.log(`... generated text from file ${file_path} ...`);
                let mm = new MarkovMachine(data);
                mm.makeChains();
                console.log(mm.makeText());
            })
        }
    }
}
