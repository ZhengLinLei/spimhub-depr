/* =========================================================================
    SpimHub - A MIPS Assembly IDE for Web Browsers

            _            _        _         _   _         _       _    _                  _        
           / /\         /\ \     /\ \      /\_\/\_\ _    / /\    / /\ /\_\               / /\      
          / /  \       /  \ \    \ \ \    / / / / //\_\ / / /   / / // / /         _    / /  \     
         / / /\ \__   / /\ \ \   /\ \_\  /\ \/ \ \/ / // /_/   / / / \ \ \__      /\_\ / / /\ \    
        / / /\ \___\ / / /\ \_\ / /\/_/ /  \____\__/ // /\ \__/ / /   \ \___\    / / // / /\ \ \   
        \ \ \ \/___// / /_/ / // / /   / /\/________// /\ \___\/ /     \__  /   / / // / /\ \_\ \  
         \ \ \     / / /__\/ // / /   / / /\/_// / // / /\/___/ /      / / /   / / // / /\ \ \___\ 
     _    \ \ \   / / /_____// / /   / / /    / / // / /   / / /      / / /   / / // / /  \ \ \__/ 
    /_/\__/ / /  / / /   ___/ / /__ / / /    / / // / /   / / /      / / /___/ / // / /____\_\ \   
    \ \/___/ /  / / /   /\__\/_/___\\/_/    / / // / /   / / /      / / /____\/ // / /__________\  
     \_____\/   \/_/    \/_________/        \/_/ \/_/    \/_/       \/_________/ \/_____________/  
                                                                                               


    © 2023 ZhengLinLei <zheng9112003@icloud.com>

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ========================================================================== */

window.addEventListener('load', function () {
    let find_content_input = document.getElementById('content-search-file');
    find_content_input.addEventListener('keyup', (event) => {
        if (event.keyCode === 13 || event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('content-find-btn').click();
        }
    });

    let replace_content_input = document.getElementById('content-replace-file');

    let occurences_list = document.querySelector('.file-occurences-list');

    // Button
    document.getElementById('content-find-btn').addEventListener('click', () => {
        if (find_content_input.value != '') {
            let occurences = find_files(find_content_input.value);
            document.querySelector('.file-occurences').innerHTML = `${occurences.length}`;

            occurences_list.innerHTML = '';

            /* 
            <li>
                <div class="level">
                    <a class="level-file">[dile.asm]</a>
                    <ul>
                        <li><a>David ...</a></li>
                        <li><a>David ...</a></li>
                    </ul>
                </div>
            </li>


            Object: {
                name: "code.asm",
                route: "/",
                content: "text"
            }
            */
            occurences.forEach((file) => {
                let li = document.createElement('li');
                    let level = document.createElement('div');
                    level.classList.add('level');

                        let level_file = document.createElement('a');
                        level_file.classList.add('level-file');
                        level_file.innerHTML = `[${file[0].name}]`;
                        level_file.addEventListener('click', () => {
                            // Open the file
                            open_file(file[0]);
                        });

                        let ul = document.createElement('ul');
                            //TMP
                            file[1].forEach((index) => {
                                let li2 = document.createElement('li');
                                    let a = document.createElement('a');
                                    a.classList.add('occurence-position');
                                    // Get substring from index to next \n or end of string
                                    let next_new_line = file[0].content.indexOf('\n', index);
                                    // Put the index to first char of word \n or \s or \t
                                    let subindex = file[0].content.lastIndexOf(' ', index);
                                    // If the next \n is not found, get the substring to the end of the string
                                    let substring = file[0].content.substring(subindex, (next_new_line == -1) ? file[0].content.length : next_new_line);
                                    // Replace the occurence with a span with style
                                    substring = substring.replace(find_content_input.value, `<span class="bg-warning">${find_content_input.value}</span>`);
                                    a.innerHTML = substring;
                                    a.addEventListener('click', () => {
                                        // Open the file
                                        open_file(file[0]);
                                        focus_occurence(file[0], index, find_content_input.value);
                                    });
                                li2.appendChild(a);
                                ul.appendChild(li2);
                            });
                    
                    level.appendChild(level_file);
                    level.appendChild(ul);
                li.appendChild(level);

                occurences_list.appendChild(li);
            });
        } else {
            document.querySelector('.file-occurences').innerHTML = `0`;
            occurences_list.innerHTML = '';
        }
    });

    document.getElementById('content-replace-btn').addEventListener('click', () => {

    });
});

/**
 * Find files in the file system with the content
 *
 * @param {String} content - Content to find
 * @param {String} dir - Directory to search
 *
 * @return {Array<Object>}
 * 
 * @example find_files("text", "/")
 */
const find_files = (content, dir = "/") => {
    let folders = (FILE_SYSTEM[dir]) ? FILE_SYSTEM[dir].folders : [];
    let files = (FILE_SYSTEM[dir]) ? Object.values(FILE_SYSTEM[dir].files) : [];

    let occurrences = [];

    for (let i = 0; i < files.length; i++) {
        let content_index = getIndicesOf(content, files[i].content, false);
        if (content_index.length > 0) {
            occurrences.push([files[i], content_index]);
        }
    }

    // Recursion for folders
    for (let i = 0; i < folders.length; i++) {
        let new_route = `${dir}${folders[i]}/`;
        occurrences = occurrences.concat(find_files(content, new_route));
    }

    return occurrences;
};


/**
 * Get all the occurences index
 * 
 * @param {String} searchStr - String to find
 * @param {String} str - String to search
 * @param {Boolean} caseSensitive - Case sensitive
 * 
 * @return {Array<Number>}
 * 
 * @example getIndicesOf("text", "text text", false)
 * @example getIndicesOf("text", "text text", true)
 * 
*/
function getIndicesOf(searchStr, str, caseInsensitive=false) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (caseInsensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    // while ((index = str.indexOf(searchStr, startIndex)) > -1) {    ---> Lineal Search
    //     indices.push(index);
    //     startIndex = index + searchStrLen;
    // }

    indices = [...str.matchAll(new RegExp(searchStr, 'g'))].map(a => a.index)
    return indices;
}


/**
 * Focus the occurence in the editor
 * 
 * @param {Object:FILE_SYSTEM[:string].files[:num]} file - File object
 * @param {Number} index - Index of the occurence
 * 
 * @example focus_occurence(FILE_SYSTEM["/"]["code.asm"].files[0], 0)
*/
const focus_occurence = (file, index, content) => {
    // The file is already open
    let opened = WINDOW_EDITOR.files[`w${WINDOW_EDITOR.active}`].find(el => (el.route + el.name) == (file.route + file.name));
    let textarea = opened.__f.querySelector('textarea');
    // Focus the cursor to the index
    if (opened) {
        textarea.focus();
        // Set cursor to index
        textarea.selectionStart = index;
        textarea.selectionEnd = index + content.length;
        focus_line(textarea);
    }
};