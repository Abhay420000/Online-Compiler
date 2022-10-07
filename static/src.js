const textarea = document.getElementById('editor');
const lineNumbers = document.getElementById('line-numbers');                                                            ;
const output_window = document.querySelector('.output-window');
const selected_lang = document.getElementById('language');
const lost_code_modal = document.getElementById('clear_m');

//Used for displaying output
const output_line = "<div class='row output-line text-nowrap'>";
var print_output = "<div class='col print-output m-0 p-0' style='white-space: pre-wrap'>"; 
const input_area_el = `<div class="col take-input m-0 p-0"><textarea id="input-area" rows="1"></textarea></div>`;

//Programing Language Templates
const dlang = {"C++": `// C++ Hello World Program
#include <iostream>

int main() {
    // Write C++ code here
    std::cout << "Hello world!";

    return 0;
}`,

"Python": `# Python Hello World Program
print('Hello World!')
`,
}
/*
"Java": `// Java Hello World Program

class Main{
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
}
*/
const lang_exts = {
    "C++": "cpp",
    "Java": "java",
    "Python": "py"
}

//No Input without code
var input_area = null;

var mode = "light";

var cinput = "";

//To clear output window in fresh run
var clear_out_putW = 0;

//To increment line number
textarea.addEventListener("onkeyup",lnum,);

//Default selected language's template
fill_temp();

//Scroll and height fix of editor and outputwindow
var r1 = document.getElementById("op");
addEventListener('resize', changeLay);
changeLay();
function changeLay(){
    var width = document.body.clientWidth;
    if (width <768){
        r1.style.height = "50%";
        output_window.style.height = "50%";
    }
    else{
        r1.style.height = "100%";
        output_window.style.height = "100%";
    }
}

function display(text, input, end){
    /*
    Loop over all childrens("row"'s) of "output-window"
    then loop over all childrens of the "row" to
    make output editor string by excluding all elements
    which contains input_value at class which will give 
    "garbage_str".
    Finally remove the "garbage_str" from server response
    then the resultant string will be appended to output
    editor string.
    */

    //console.log("Text String:", text);
    //console.log("Input",input);
    //console.log("End:",end);

    if (clear_out_putW == 1){
        output_window.innerHTML = "";
    }

    garbage_str = "";
    qel = document.querySelectorAll(".input_value")

    let rows = output_window.children;
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];

        let cols = row.children;
        for (let i = 0; i<cols.length; i++){
            let col = cols[i];

            let to_rem = false;
            let len = qel.length;
            for (let j = 0; j < len; j++) {
                //console.log("All Content:", col.textContent);
                //console.log("Input Content:", qel[j].textContent);
                if (col == qel[j]){
                    //console.log("Matched!")
                    to_rem = true;
                }
            }
            if (to_rem == false){
                garbage_str = garbage_str + col.textContent;
            }
        }
    }

    //console.log("Garbage String:", garbage_str);
    text = remove_first_occurrence(text, garbage_str);
    //console.log("Final Text: ", text);

    s = text.split('\n');
    
    if (s[s.length-1] == ""){
        s.pop(s.length-1);
    }
    //console.log(s);

    let i = 0;//Used Later
    //console.log("Loop Ends before:",s.length-1);
    for (i = 0; i<s.length-1; i++){
        output_window.innerHTML += output_line + print_output + s[i] + "</div>" + "</div>";
    }

    //console.log("Value of i:",i);
    if (input == 1){
        output_window.innerHTML += output_line + print_output + s[i] + "</div>" + input_area_el + "</div>";                                       
        input_area = document.getElementById('input-area');
        input_area.addEventListener("input", handleIn,);
    }

    if (end == 1){
        output_window.innerHTML += output_line + print_output + s[i] + "</div>" + "</div>";
        output_window.innerHTML += output_line + print_output + ">" + "</div>" + "</div>";

        clear_out_putW = 1;
    }
    else{
        clear_out_putW = 0;
    }
}

function remove_first_occurrence(str, searchstr){
	var index = str.indexOf(searchstr);
	if (index === -1) {
		return str;
	}
	return str.slice(0, index) + str.slice(index + searchstr.length);
}

function handleIn() {
    /*console.log(input_area.value);*/
    if (input_area.value.length>=50){
        input_area.style.width = input_area.value.length + "ch";
    }
    
    if (input_area.value.charAt(input_area.value.length-1) == "\n"){                                                                    
        
        //Appending value to send the server
        var x = input_area.value
        cinput += x;

        if (input_area.value.length>500){
            alert("Maximum Input Length Reached!");
            return;
        }
        var to_remove = input_area.parentNode;
        var parentE = to_remove.parentNode;
        parentE.removeChild(to_remove);
        parentE.innerHTML += "<div class='col print-output m-0 p-0 text-nowrap input_value'>"+x+"</div>";

        if (cinput.length>1200){
            alert("Maximum Input Length Reached!");
            return;
        }
        else{
            runCode();
        }
    }
}

function lnum(){
    const lcount = textarea.value.split("\n").length;
    //console.log(lcount)

    var text = "";
    for (let i = 0; i < lcount; i++) {
        text += (i+1)+" \n";
    }
    lineNumbers.value = text;
    lineNumbers.scrollTop = textarea.scrollTop;
}

function fill_temp(){
    /*
    To Clear Editor and Output Window
    */
    textarea.value = dlang[selected_lang.value];
    lnum();
    output_window.innerHTML = "";
}

textarea.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
  
      // put caret at right position again
      this.selectionStart =
        this.selectionEnd = start + 1;
    }
});

function download(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function save(){
    download('Input.'+lang_exts[selected_lang.value], textarea.value);                                               
}

function change_mode(mode_ico){
    if (mode == "light"){
        document.getElementById("navbarc").className = "navbar navbar-expand navbar-dark bg-dark"
        mode_ico.style.color = "white";
        lineNumbers.style.background = "#280137";
        lineNumbers.style.color = "#d3d3d3";
        textarea.style.background = "#2a2a35";
        textarea.style.color = "white";
        output_window.style.background = "black";
        document.body.style.background = "#1d0200";
        document.getElementsByClassName("owind")[0].style.color = "white";
        mode = "dark";
        let e = document.querySelectorAll("div.print-output");
        for (let i = 0; i<e.length; i++){
            e[i].style.color = "white";
        }
        print_output = "<div class='col print-output m-0 p-0' style='white-space: pre-wrap; color:white;'>"; 
    }
    else if (mode == "dark"){
        document.getElementById("navbarc").className = "navbar navbar-expand navbar-light bg-light"
        mode_ico.style.color = "black";
        lineNumbers.style.backgroundColor = "";
        lineNumbers.style.color = "";
        textarea.style.background = "";
        textarea.style.color = "";
        output_window.style.background = "whitesmoke";
        document.body.style.background = "beige";
        document.getElementsByClassName("owind")[0].style.color = "";
        mode = "light";
        let e = document.querySelectorAll("div.print-output");
        for (let i = 0; i<e.length; i++){
            e[i].style.color = "";
        }
        print_output = "<div class='col print-output m-0 p-0' style='white-space: pre-wrap; color:black;'>";
    }
    //console.log(mode);
}

function runCode(){
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
    var data = JSON.stringify({"language":selected_lang.value, "code":textarea.value, "input":cinput});                                                     
    xhttp.send(data);

    xhttp.onload = function() {
    //console.log(xhttp);
    //console.log(xhttp.responseText);
    res = JSON.parse(xhttp.responseText);
    //console.log(res);
    var is_input = res["status"];
    if (is_input != 1){
        is_input = 0;
    }

    display(res["output"], is_input, res['end']);
    }

}

function getCookie(c_name)
{
    if (document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
 }

 /*
function start_loading(){                                                                                           
    document.body.innerHTML += `<div class="position-absolute top-50 start-50 translate-middle" id="loading">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;
}

function stop_loading(){
    document.getElementById("loading").remove();
}
*/