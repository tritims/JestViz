window.addEventListener('message', function(event) {
    OFFSET = 0
    console.log("Inside popupJS...")
    // console.log(event.data);
    let fd = formatData(event.data);
    // document.querySelector('body').style.background = pickBGColor(fd.title.split(' ')[1]);
    document.getElementById('endevnottitle').innerText = fd.title;
    document.getElementById('endeverrormsg').innerText = 
    'Line No.: ' + String(fd.line - OFFSET) + '\n' + 'Column No.: ' + fd.col 
    + '\n' +  'Details: ' + fd.msg;
   
    /**document.getElementById('soflink').addEventListener('click', function(event) {
        chrome.runtime.sendMessage('https://www.google.com/search?q=' 
        + fd.msg + ' site:stackoverflow.com');
    })*/
    let stack;
    let mermaidEleContent = `
    graph TD \n
    `;
    if(fd.stack) {
        stack = parseStackTrace(fd.stack);
        for(let i=stack.length-1, c = 'A'; i>=0; i--, c = nextChar(c)){
            // If link doesn't exist (Anonymous function) or error line, put line, col, file
            mermaidEleContent += stack[i].link? c + '("' + stack[i].fun + "() @ " + 
            stack[i].link.split('/').pop().split(':')[0] + " | Line: " + 
            String(stack[i].link.split('/').pop().split(':')[1] - OFFSET) + '")':
             c + '["' + stack[i].fun.split('/').pop().split(':')[0]
              + " | Line: " + stack[i].fun.split('/').pop().split(":")[1] + '"]'; 
            if(i > 0)
                mermaidEleContent += ' -->' + nextChar(c) + '\n';
            else
                mermaidEleContent +=  '\nstyle ' + c +  ' fill:#EA3A22'        
        }
    }

    let mermaidEle = document.createElement('div');
    mermaidEle.className = 'mermaid'
    mermaidEle.id = 'seq-dig'
    console.log("Element created...", mermaidEle, mermaidEle.id)
    // mermaidEleContent = `
    // graph TD \n
    // A[foo] -->|Line No.| B(Anonymous) \n
    // B --> C[bar] \n
    // C --> D[lisp] \n
    
    
    // style D fill:#EA3A22
    // `
    mermaid.mermaidAPI.render(mermaidEle.id, mermaidEleContent, function(svgCode) { 
        mermaidEle.innerHTML = svgCode;
        document.getElementById('estrazer-root').appendChild(mermaidEle);
    })

});

// document.getElementById('closebtn').addEventListener('click', () => {
//     document.get
// })
function pickBGColor(errType) {
    console.log("Coloring.....")
    return colorMap[errType];
}


function parseStackTrace(stackTrace) {
    let line;
    let stack = [];
    let lines = stackTrace.split('\n');
    for(let i=1; i<lines.length-1; i++){
        line = lines[i].trim().split(' ');
        let ele = {
            fun: line[1],
            link: line[2]? line[2].slice(1,-1): null
        }
        stack.push(ele);
    }
    return stack;
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function formatData(data) {
    let line = data.line;
    let col = data.col;
    let title = data.text.split(':')[0];
    let msg = data.text.split(':')[1]
    return {
        title: title,
        msg: msg,
        line: line,
        col: col,
        stack: data.stack? data.stack: null
    }
}

function close() {
    console.log('closing....')
}

var colorMap = {
    'EvalError': '#FFEC33',
    'InternalError': '#FFC433',
    'RangeError': '#95721C',
    'ReferenceError': '#38610B',
    'SyntaxError': '#5E1261',
    'TypeError': '#0558C1'
}