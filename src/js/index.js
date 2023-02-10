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


// ================== //
//  Global Variables  //
// ================== //
let FILE_SYSTEM, ROOT_DIR, WINDOW_EDITOR, TAB_SIZE, TAB_REGEX, FORMAT;
let toggle_terminal, toggle_opt,
    create_file, create_window, open_file, open_window, focus_file,
    remove_window, new_project, set_theme;

// Global functions
let __pop_up, __group_h, __group_register,
    __new_file, __new_folder;

// COOKIE ACTIVATED IN BROWSER
let COOKIE_ACTIVATED = navigator.cookieEnabled;
// ================== //
const setup_dialog = {
    i: 0,
    content: [
             `Hi 👋, you look new here. Awesome! \nWelcome to SpimHub!`,
             `Let's start setting up the dev environment. \nIt will take a few seconds. \nAlso, you can skip this setup by reloading the page or by pressing [Esc] at any time.`,
             `Please select your preferred editor theme (default: light mode). 💡 \nYou can change it or install different themes once the setting up is finished:`,
             `SpimHub use a virtual filesystem to store your files in locaStorage (cookies). 🍪 \nYou can create new files, folders and save it in the virtual filesystem. \nYou can also download the project backup and load existing one.`,
             `To do this SpimHub need you to activate your cookies for SpimHub. \nThis allow us to control the localStorage to save the files data. 🔧 \n\n >> ` + (COOKIE_ACTIVATED ? "Cookies are already [ACTIVATED] in your browser." : "Cookies are [DISABLED] in your browser. Please consider to activate them. Otherwise you won't be able to save your files."),
             `By the way, if you use SpimHub in a public computer, you can disable cookies to prevent other users to see your files. \nAnd if you are in incognito mode, cookies are disabled by default.`,
             `SpimHub understands that you accept our cookie policy by continuing to use the editor`,
             // Share link
             `Lastly SpimHub hope you enjoy the editor and if you want to share it with your friends, you can use this link:`,
             // Finish 
             `That's all! 🎉 \nNow you can start using SpimHub, the page will reload and you will see the editor interface. \n\n\nEnjoy!`
             ],
    writing: false,
    finished: false,
    exception: [2, 7],
    exception_callback: {
        2: ()=> {
            return `<div class="themes" style="margin-top: 10px"><a href="javascript:set_theme('light')">[light mode]</a> <a href="javascript:set_theme('dark')">[dark mode]</a></div>`;
        },
        7: ()=> {
            return `<div class="themes" style="margin-top: 10px"><a href="https://ZhengLinLei.github.io/spimhub/" target="_blank">[https://ZhengLinLei.github.io/spimhub/]</a></div>`;
        }
    }
};

// Next dialog
setup_dialog.next = (i)=> {
    setup_dialog.writing = true;
    let setup_main = document.querySelector('#setup-init main');
    let dialog_text = setup_main.querySelector('main pre.text');

    // Write each letter from setup_dialog.content[i]
    let j = 0;
    let write = setInterval(()=> {
        dialog_text.innerHTML += setup_dialog.content[i][j];
        j++;
        if (j >= setup_dialog.content[i].length) {
            setup_dialog.writing = false;
            clearInterval(write);
            // Create all links
            // dialog_text.innerHTML = dialog_text.innerHTML.replace(url_regex, ' <a href="$1" target="_blank">$1</a>');

            // Add exception
            dialog_text.innerHTML += (setup_dialog.exception.includes(i)) ? 
                                        setup_dialog.exception_callback[i]() : "";
            dialog_text.innerHTML += '\n\n<span class="muted">>> Press [Enter] to continue.</span>\n\n';
        }

        // Scroll to bottom
        setup_main.scrollTop = setup_main.scrollHeight;
    }, 50);

};

// Set theme
set_theme = (theme)=> {

    let themes = ['light', 'dark'];
    if (!themes.includes(theme)) {
        theme = 'light';
    }
    // Set theme
    document.documentElement.setAttribute('theme', theme);

    // Save theme
    // localStorage.setItem('sh-theme', theme);
};

// ================== //
//  GET USER OS DATA  //
// ================== //
// Check if the user is using a MACOS or Windows
let isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
var isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
var isIOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);

// ================== //
if (isMac || isMacLike || isIOS) {
    // Mac OS
    document.documentElement.setAttribute('pc', 'mac');
} 

window.addEventListener('load', ()=> {

    // ================== //
    // COOKIES WARNING    //
    // ================== //
    if (localStorage.getItem('sh-cookies') !== 'true' || !localStorage.getItem('sh-cookies')) {
        // Enable cookies
        localStorage.setItem('sh-cookies', 'true');

        // Show cookies warning
        let setup = document.querySelector('#setup-init');
        setup.classList.add('active');


        // Next dialog fnc
        let __next = ()=> {
            if (!setup_dialog.finished && !setup_dialog.writing) {
                if (setup_dialog.i >= setup_dialog.content.length - 1) {
                    setup_dialog.finished = true;
                    document.location.reload();
                }

                setup_dialog.i++; // Next dialog
                setup_dialog.next(setup_dialog.i);

            }
        };
        // Show setup dialog
        document.addEventListener('keydown', (e)=> {
            if (e.key === 'Enter') {
                __next();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                document.location.reload();
            }
        });

        // Show first dialog
        setup_dialog.next(setup_dialog.i);
    }

    // Full screen
    // document.documentElement.requestFullscreen();

    // ================== //
    //  Global Variables  //
    // ================== //


    // ==========
    // File system
    //    \  \_____ FSKey-1.0
    //     \________ FSPath-1.0
    //
    //      Explained: https://tinyurl.com/spimhub-filesystem
    //
    //        Git branch
    //          \   \
    //           \   \____ fskey1.0-dev
    //            \________ fspath1.0-dev
    //
    // ==========

    // ==========
    // FILESYSTEM : FSPath-1.0
    // BRANCH     : fspath1.0-dev
    // DATA       : 2023-02-05
    //
    // EXPLANATION
    /*

        /
        |--> user
        |    |----> zll
        |            |---> filemio.js
        |            |---> otherfile.js
        |            |---> folder2
        |            |        |---> gg.html
        |            |
        |            |---> folder
        |                     |---> ... (more)
        |
        |--> otherFolder


    let dir = {

        "/": [],
        "/user": [],
        "/otherFolder": [],
        "/user/zll": ["filemio.js", "otherfile.js"],
        "/user/zll/folder2": ["gg.html"],
        "/user/zll/folder": [... (more) ]

    }


    ----UPDATED TEMPLATE
    "/": {
        name: "NAME",
        files: {
            "files1.asm": {
                content: "DATA"
            }
        },
        folders: ["FOLDER1", "FOLDER2"]
    },
    "/FOLDER1/": {...}
    "/FOLDER2/": {...}

    */

    // MEMORY FILESYSTEM
    /*
        Will use localStorage memory or will create new one

        1. localStorage --> sh-virtual-disk
        2. new Object({})

    */
    FILE_SYSTEM = 
        JSON.parse(localStorage.getItem('sh-virtual-disk'))         // First choice
        ||
        ({
            "/" : {
                name: "[project]",
                files: {},
                folders: [],
                active: true
            }
            
        })
    ;

    // ROOT 
    ROOT_DIR = {
        cd: "/",
        dir: [],
        clean_gui: (dir = "/") => {
            let _parent = document.querySelector(`.explorer-folder[route="${dir}"] ul[route="${dir}"]`);
            _parent.innerHTML = '';
        }
    };
    // Focus cd
    ROOT_DIR.focus_dir = (dir = '/') => {
        ROOT_DIR.cd = dir;
        ROOT_DIR.dir = dir.split('/').filter((e) => e !== '');
    }
    // Get dir GUI
    // ==========
    ROOT_DIR._get_dir_tree = (dir = "/") => {
        let result = {};
        let folders = (FILE_SYSTEM[dir]) ? FILE_SYSTEM[dir].folders : [];
    
        folders.forEach(folder => {
            result[folder] = ROOT_DIR._get_dir_tree(dir + folder + "/");
        })
    
        return result;
    }
    /* ======================

        STORAGE TREE

        
        Problem: Show the tree of filesystem (Only folders)

        /
        |--- docs
        |      |--- libs
        |      |--- layers
        |--- src
        |      |--- asm
        |      |--- model
        |      |--- controller
        |      |--- resource
        |--- public
        |      |--- domain
        |      |     |--- machine
        |      |     |--- apache
        |      |--- global
        |--- credits
            |--- licenses




        Storage simulation:
        
        {
            "/" : {
                name: "[project]",
                files: {},
                folders: ["docs", "src", "public", "credits"]
            },
            "/docs/" : {
                name: "[docs]",
                files: {}
                folders: ["libs", "layers"]
            },
            "/src/" : {
                name: "[src]",
                files: {}
                folders: ["asm", "model", "controller", "resource"]
            },
            "/public/" : {
                name: "[public]",
                files: {}
                folders: ["domain", "global"]
            },
            "/credits/" : {
                name: "[credits]",
                files: {}
                folders: ["licenses"]
            },
            "/docs/libs/" : {
                name: "[libs]",
                files: {}
                folders: []
            },
            "/docs/layers/" : {
                ...
            },
            "/src/asm/" : {
                ...
            },
            "/src/model/" : {
                ...
            },
            ... 
        }



        Explained: https://tinyurl.com/spimhub-storagetree
    */
    ROOT_DIR.get_dir_gui = (dir = '/') => {
        let folders = (FILE_SYSTEM[dir]) ? FILE_SYSTEM[dir].folders : [];
        let files = (FILE_SYSTEM[dir]) ? Object.values(FILE_SYSTEM[dir].files) : [];

        
        // Sort name
        folders.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        });
        files.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });

        let _parent = document.querySelector(`.explorer-folder[route="${dir}"] ul[route="${dir}"]`);


        // Folders
        folders.forEach(folder => {
            // <li>
            //     <div class="explorer-folder" route="/docs">
            //         <a onclick="this.parentElement.classList.toggle('active')" class="x-folder">[docs]</a>
            //         <ul>
            //             <li>
            //                 <a class="x-file" href="./">readme.md</a>
            //             </li>
            //             <li>
            //                 <a class="x-file" href="./">index.html</a>
            //             </li>
            //         </ul>
            //     </div>
            // </li>
            let new_route = `${dir}${folder}/`;
            let _folder_el = document.createElement('li');
                let __folder_el_x = document.createElement('div');
                __folder_el_x.classList.add('explorer-folder');
                if (FILE_SYSTEM[new_route].active) __folder_el_x.classList.add('active');    // ------> If active is saved in memory
                __folder_el_x.setAttribute('route', `${new_route}`);

                    let __folder_el_x_a = document.createElement('a');
                    __folder_el_x_a.classList.add('x-folder');
                    __folder_el_x_a.innerHTML = `[${folder}]`;
                    __folder_el_x_a.addEventListener('click', () => {
                        // Focus folder directory
                        ROOT_DIR.focus_dir(new_route);
                        // Toggle active class
                        __folder_el_x.classList.toggle('active');

                        // Active folder
                        FILE_SYSTEM[new_route].active = !FILE_SYSTEM[new_route].active;

                    });
                    __folder_el_x_a.addEventListener('contextmenu', (e) => {
                        
                        
                    });

                    let __folder_el_x_ul = document.createElement('ul');
                    __folder_el_x_ul.setAttribute('route', `${new_route}`);

                
                __folder_el_x.appendChild(__folder_el_x_a);
                __folder_el_x.appendChild(__folder_el_x_ul);

            _folder_el.appendChild(__folder_el_x);
            _parent.appendChild(_folder_el);

            // Recursive
            ROOT_DIR.get_dir_gui(new_route);
        });

        // Files
        files.forEach(file => {
            // Create file
            let _file_el = document.createElement('li');
                let _file_el_a = document.createElement('a');
                _file_el_a.classList.add('x-file');
                _file_el_a.innerHTML = file.name;
                _file_el_a.addEventListener('click', () => {
                    // Focus file directory
                    ROOT_DIR.focus_dir(file.route);

                    // Open file
                    open_file(file);
                });
            
            _file_el.appendChild(_file_el_a);
            _parent.appendChild(_file_el);
        });
    }

    // SET TAB SIZE
    TAB_SIZE = 4;
    TAB_REGEX = /\t/g;

    // SET FORMAT
    FORMAT = new Format(__mipsasm_scope());


    const pop_menu = (e, menu)=> {
        // Close all opened menus
        close_all_menus();

        menu.classList.add('active');

        // Open menu
        // Set menu position
        if (e.pageY + menu.offsetHeight > window.innerHeight)
            menu.style.top = e.pageY - menu.offsetHeight + 'px';
        else
            menu.style.top = e.pageY  + 'px';

        if (e.pageX + menu.offsetWidth > window.innerWidth)
            menu.style.left = e.pageX - menu.offsetWidth + 'px';
        else
            menu.style.left = e.pageX + 'px';


        // Disable menu items
        return false;
    };
    const close_all_menus = (e)=> {
        let menus = document.querySelectorAll('.menu');
        for (let i = 0; i < menus.length; i++) {
            // If actived
            if (menus[i].classList.contains('active'))
                menus[i].classList.remove('active');
        }
    }

    // ================== //
    //  Scroll sections   //
    // ================== //
    // ==== RESIZE ====
    // Get (x,y) position of event
    const _getXY = (e) => {
        if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];

            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
            x = e.clientX;
            y = e.clientY;
        }
        return {x, y};
    }
    // Resize section
    document.querySelector('.scroll-x.header').addEventListener('mousedown', (e)=> {
        let _parent = opt_main.el;

        let _xy = _getXY(e);

        // Resize terminal height
        let _MAX = window.innerWidth / 2;
        let _MIN = 100;
        let _SIZE = _parent.getBoundingClientRect()["width"];
        let _START = _xy['x'];

        // Add mousemove event
        window.onmousemove = (e2) => {

            // Remove if the event is passive
            if(!['touchstart', 'touchmove', 'touchend', 'touchcancel'].includes(e.type)){
                e2.preventDefault();
            }
            
            // If the event is touchstart
            let coordsM = _getXY(e2);

            document.body.classList.add('col-resize');

            let _NEW_SIZE = _SIZE + (coordsM['x'] - _START); // - (e.clientY - _START); ---> Because the width grows to the right

            if(_NEW_SIZE > _MIN && _NEW_SIZE < _MAX){
                // _parent.classList.add('active');
                (document.documentElement || document.querySelector(':root')).style.setProperty('--explorer-size', `${_NEW_SIZE}px`);
            }
            
            // Close if NEW_SIZE is less than MIN
            if(_NEW_SIZE < _MIN - (_MIN / 2)){
                _parent.classList.remove('active');
            }else {
                _parent.classList.add('active');
            }
            
        };
        window.onmouseup = () => {
            document.body.classList.remove('col-resize');

            window.onmousemove = null;
            window.ontouchmove = null;
            window.onmouseup = null;
            window.ontouchend = null;

            // Save terminal height and option width

            // localStorage.setItem(
            //     _Y ? 'terminalHeight' : 'terminalOptWidth',
            //     _Y ? terminal.parentElement.parentElement.getBoundingClientRect().height : document.querySelector('#terminal-fast-option').getBoundingClientRect().width
            // );
        };
    });

    // ================== //
    //  File Manager Menu //
    // ================== //
    // Add click event to file manager and open extra menu
    let file_manager = {
        el: document.querySelector('#file-manager'),
        layer: document.querySelector('#file-manager > .explorer-main-layer'),
        menu: document.querySelector('#file-manager-extra-menu'),
    };
    // Add click event to file manager and open extra menu
    file_manager.layer.addEventListener('contextmenu', (e)=> {
        e.preventDefault();
        return pop_menu(e, file_manager.menu);
    });
    // Add click event to focus root '/'
    file_manager.layer.addEventListener('mousedown', (e)=> {
        ROOT_DIR.focus_dir('/');
    });

    // ================== //
    //  Execute File Menu //
    // ================== //
    let execute_file = {
        el: [],
        menu: document.querySelector('#execute-file-extra-menu'),
    };

    // ================== //
    //  File Editor Menu  //
    // ================== //
    let file_editor = {
        el: document.querySelector('#main-editor'),
        menu: document.querySelector('#file-editor-extra-menu'),
        disabled: execute_file.el,
    };
    // Add click event to file editor and open extra menu
    file_editor.el.addEventListener('contextmenu', (e)=> {
        // If selected disabled target, do nothing
        if (file_editor.disabled.indexOf(e.target) !== -1) return true;

        e.preventDefault();
        return pop_menu(e, file_editor.menu);

    });

    // ================== //
    //  Terminal    Menu  //
    // ================== //
    let terminal_editor = {
        el: document.querySelector('#terminal'),
        close_dom: document.querySelector('#close-t'),
        menu: document.querySelector('#terminal-extra-menu'),
    };
    terminal_editor.disabled = [terminal_editor.close_dom];
    terminal_editor.tab = terminal_editor.el.querySelectorAll('.tab');
    terminal_editor.window = terminal_editor.el.querySelectorAll('.window');


    // Add click event to terminal and open extra menu
    terminal_editor.el.addEventListener('contextmenu', (e)=> {
        // If selected disabled target, do nothing
        if (terminal_editor.disabled.indexOf(e.target) !== -1) return true;

        e.preventDefault();
        return pop_menu(e, terminal_editor.menu);
    });

    // ================== //
    //  Runner      Menu  //
    // ================== //
    let runner_editor = {
        el: document.querySelector('#main-runner'),
        menu: execute_file.menu,
    }

    // Add contextmenu event to runner_editor
    runner_editor.el.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        return pop_menu(e, runner_editor.menu);
    });

    // =============================
    // TERMINAL

    toggle_terminal = (type=-1, window="terminal")=> {
        // Toggle terminal
        if (type === -1)
            terminal_editor.el.classList.toggle('active');
        else if (type === 1)
            terminal_editor.el.classList.add('active');
        else if (type === 0)
            terminal_editor.el.classList.remove('active');

        // Reject
        if (!["terminal", "console", "output"].includes(window)) return;

        // Disable terminal and console
        [... terminal_editor.tab, ... terminal_editor.window].forEach(el => {
            el.classList.remove('active');
        });

        // Active window
        terminal_editor.el.querySelector(`header .${window}-tab`).classList.add('active');
        terminal_editor.el.querySelector(`main #${window}-main`).classList.add('active');
    };

    // Close terminal
    terminal_editor.close_dom.addEventListener('click', (e)=> {
        toggle_terminal(0);
    });

    // =============================
    // OPT MAIN

    let opt_main = {
        el: document.querySelector('#main-folder'),
        opt_files: document.querySelector('#opt-files'),
        opt_search: document.querySelector('#opt-search'),
        opt_extensions: document.querySelector('#opt-extensions'),
        tab: ['opt-files', 'opt-search', 'opt-extensions']
    };

    toggle_opt = (type=-1, window="files")=> {
        // Toggle header
        if (type === -1) {
            if (opt_main.el.classList.contains(`opt-${window}`)) {
                opt_main.el.classList.toggle('active');
            }
        }else if (type === 1)
            opt_main.el.classList.add('active');
        else if (type === 0)
            opt_main.el.classList.remove('active');

        // Reject
        if (!["files", "search", "extensions"].includes(window)) return;

        // Disable terminal and console
        [... opt_main.tab].forEach(el => {
            opt_main.el.classList.remove(el);
        });

        // Active window
        opt_main.el.classList.add(`opt-${window}`);
    };

    // =============================
    // EDITORS

    const focus_line = (textarea, delay=-1, reset = true) => {
        // Get parent
        let file_w = textarea.parentElement;

        // Get line index
        const index = textarea.value.substring(0, textarea.selectionStart).split("\n").length;

        const lines = [file_w.querySelector('.line-numbers-rows'), file_w.querySelector('.export-code > code')];

        // Set line active

        if((index + delay) < lines[0].children.length && !lines[0].children[index+delay].classList.contains('active')) {
            // Unfocus all lines
            if (reset)  // -------> Only unfocus all lines if reset is true , 
                        // ---      it means when the the user is writing and
                        // ---      when onwrite the html is being updated so
                        // ---      is not necessary to reset the lines.
                unfocus_line(textarea);
            // Focus current line
            lines.forEach(el => el.children[index+delay].classList.add('active'));
        }
    }
    const unfocus_line = (textarea, all = true, num = 0) => {
        // Get parent
        let file_w = textarea.parentElement;
        const lines = [file_w.querySelector('.line-numbers-rows'), file_w.querySelector('.export-code > code')];

        if (all) {
            // Clear lines class
            lines.forEach(el => {
                for (let i = 0; i < el.children.length; i++) {
                    el.children[i].classList.remove('active');
                }
            });
        } else {
            // Clear selected line
            lines.forEach(el => el.children[num].classList.remove('active'));
        }
    };

    const formate_code = (code) => {
        // Create <p> tags
        // Escape html
        code = code.map(line => { 
            return line
            .replaceAll(/&/g, '&amp;')
            .replaceAll(/</g, '&lt;')
            .replaceAll(/>/g, '&gt;')
            ;
        });
        return FORMAT.formateCode(code);
    };

    const update_code = (textarea, metadata, file) => {
        // Get parent
        let file_w = textarea.parentElement;
        
        // Replace tabs with spaces
        if (TAB_REGEX.test(textarea.value)) textarea.value = textarea.value.replaceAll(TAB_REGEX, " ".repeat(TAB_SIZE));

        // Get code
        let code = textarea.value;

        // Get lines
        const _LINES = code.split('\n')

        // Get export code
        let export_code = file_w.querySelector('.export-code > code');
        export_code.innerHTML = formate_code(_LINES); // Formate code with format.js and postupdate with <p> tags

        // Update line numbers
        file_w.style
        .setProperty('--editor-padd',
            (_LINES.length >= 100) ?
                (_LINES.length >= 1000) ? 
                    (_LINES.length >= 10000) ?
                        "55px"
                    : "45px"
                : "35px"
            : "25px"
        );

        // Get line numbers
        const lineNumbers = file_w.querySelector('.line-numbers-rows');
        lineNumbers.innerHTML = Array(_LINES.length).fill('<span></span>').join('');

        // Check if window is focused
        if(textarea === document.activeElement){
            // Update line numbers
            focus_line(textarea, -1, false);
        }

        // Update metadata
        metadata.content = code;

        if (metadata.content !== file.content) {
            metadata.__fw.classList.add('not-saved');
        } else {
            metadata.__fw.classList.remove('not-saved');
        }
    };

    // Remove the window
    remove_window = (w=WINDOW_EDITOR.current-1, focus_editor = true) => {

        // Focus editor window group
        if(focus_editor)
            __group_h.open_group('editor');

        // > min windows
        if (WINDOW_EDITOR.current <= 1) return;

        // 
        WINDOW_EDITOR.current --;
        // Update window attributes
        WINDOW_EDITOR.windows[w].parentElement.setAttribute('window-opened', WINDOW_EDITOR.current);

        // Remove window from DOM
        WINDOW_EDITOR.windows[w].remove();

        // Remove Window from array
        WINDOW_EDITOR.windows[w] = null;

        // Remove files from window
        WINDOW_EDITOR.files[`w${w}`] = [];

        // If the same window is active will focus w0
        if (WINDOW_EDITOR.active === w) {
            // Focus w0
            WINDOW_EDITOR.active = 0;
        }

        // Testing window_config
        // console.log(WINDOW_EDITOR);
    }
    // <div class="w-0 editor-window">
    //     <div class="window-header d-flex">
    //         <div class="file-queue">
    //             <div href="./" class="active">
    //                 <a>[active.s]</a>
    //                 <a class="muted">x</a>
    //             </div>
    //         </div>
    //         <div class="execute d-flex">
    //             <a href="./" id="execute-file">[run]</a>
    //             <span class="a bg-error">[status]</span>
    //             <a href="./" id="close-file">[close]</a>
    //         </div>
    //     </div>
    //     <div class="f-0 editor-file">
    //         <span aria-hidden="true" class="line-numbers-rows no-select">
    //             <span></span>
    //         </span>
    //         <textarea class="textarea-main" spellcheck="false" outline="none" autocorrect="off" autocapitalize="off" aria-label="Paste Code" tabindex="0"></textarea>
    //         <pre aria-hidden="true" class="export-code">
    //             <code>
    //             </code>
    //         </pre>
    //     </div>
    // </div>
    // Create a new window
    create_window = (focus_editor = true) => {
        // Focus editor window group
        if(focus_editor)
            __group_h.open_group('editor');


        // <div class="w-0 editor-window">
        //     <div class="window-header d-flex">
        //         <div class="file-queue">
                    
        //         </div>
        //         <div class="execute d-flex">
        //             <a href="./" id="execute-file">[run]</a>
        //             <span class="a bg-error">[status]</span>
        //         </div>
        //     </div>
        // </div>

        if (WINDOW_EDITOR.current >= WINDOW_EDITOR.max) return;

        let __w = document.createElement('div');
        __w.classList.add(`w-${WINDOW_EDITOR.current}`);
        __w.classList.add('editor-window');

        // Active window when the user interact with __w
        __w.addEventListener('click', () => {
            WINDOW_EDITOR.active = WINDOW_EDITOR.windows.indexOf(__w);
        });

        // Save window
        WINDOW_EDITOR.windows[WINDOW_EDITOR.current] = (__w);

            // Create window header
            let __w_header = document.createElement('div');
            __w_header.classList.add('window-header');
            __w_header.classList.add('d-flex');

                // Create file queue
                let __w_file_queue = document.createElement('div');
                __w_file_queue.classList.add('file-queue');

                // Create execute
                let __w_execute = document.createElement('div');
                __w_execute.classList.add('execute');
                __w_execute.classList.add('d-flex');

                    // Create execute file
                    let __w_execute_file = document.createElement('a');
                    __w_execute_file.href = './';
                    __w_execute_file.classList.add('execute-file');
                    __w_execute_file.innerHTML = '[run]';
                    // Add it to dom execution array
                    // execute_file.el.push(... __w_execute_file);              -----> Not copied at all //TODO: Fix this 

                    // Create execute status
                    let __w_execute_status = document.createElement('span');
                    __w_execute_status.classList.add('a');
                    __w_execute_status.innerHTML = '[status]';

                    // Close window
                    let __w_close = document.createElement('a');
                    __w_close.href = `javascript:remove_window(${WINDOW_EDITOR.current})`;
                    __w_close.classList.add('close-window');
                    __w_close.innerHTML = '[ x ]';

        // Append execute file and status to execute
        __w_execute.appendChild(__w_execute_file);
        __w_execute.appendChild(__w_execute_status);
        __w_execute.appendChild(__w_close);

        // Append file queue to window header
        __w_header.appendChild(__w_file_queue);
        __w_header.appendChild(__w_execute);


        // Append window header to window
        __w.appendChild(__w_header);

        // Append window to editor
        WINDOW_EDITOR.parent.appendChild(__w);

        // Update current window
        WINDOW_EDITOR.current++;
        WINDOW_EDITOR.active = WINDOW_EDITOR.current-1;

        // If empty file in current window, create new file
        if (WINDOW_EDITOR.files[`w${WINDOW_EDITOR.current-1}`].length === 0)
            __w.innerHTML += `
                <div class="empty-window">
                    <div class="empty-window-content">
                        <div class="logo">
                            <svg width="100" height="79" viewBox="0 0 100 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M72.5691 28.1201C68.8572 28.1201 65.8515 31.1294 65.8515 34.8395C65.8515 38.5497 68.8572 41.5589 72.5691 41.5589C76.2775 41.5589 79.2885 38.5497 79.2885 34.8395C79.2885 31.1294 76.2775 28.1201 72.5691 28.1201ZM28.2187 28.1201C24.505 28.1201 21.4994 31.1294 21.4994 34.8395C21.4994 38.5497 24.5068 41.5589 28.2187 41.5589C31.9289 41.5589 34.9363 38.5497 34.9363 34.8395C34.9363 31.1294 31.9289 28.1201 28.2187 28.1201ZM9.50678 19.6483C8.19512 18.3314 7.54195 16.6073 7.54195 14.8938C7.54195 13.1715 8.19512 11.4491 9.50678 10.1375C10.8255 8.82759 12.5408 8.17442 14.2613 8.17442C15.9837 8.17442 17.706 8.82759 19.0159 10.1375L17.4458 11.2969C26.5389 4.22528 37.9739 0 50.393 0C62.8158 0 74.2348 4.22351 83.3403 11.2969L81.7755 10.1428C83.0872 8.83113 84.8042 8.17796 86.5301 8.17796C88.2471 8.17796 89.9712 8.83113 91.2793 10.1428C92.5857 11.4615 93.2388 13.1839 93.2388 14.8973C93.2388 16.6214 92.591 18.342 91.2793 19.6537L92.8476 20.806C115.567 43.5237 76.8971 53.7533 76.8971 53.7533H23.8908C22.7756 53.7533 -16.3635 45.108 7.94022 20.806L9.50678 19.6483Z"/>
                                <path d="M85.8273 77.7491C81.3135 77.7491 77.6547 74.0902 77.6547 69.5746C77.6547 65.0608 81.3135 61.402 85.8273 61.402C90.3412 61.402 94 65.0608 94 69.5746C94.0018 74.0902 90.3412 77.7491 85.8273 77.7491Z"/>
                                <path d="M18.676 78.4925C14.1604 78.4925 10.5016 74.8336 10.5016 70.318C10.5016 65.8042 14.1604 62.1454 18.676 62.1454C23.1916 62.1454 26.8504 65.8042 26.8504 70.318C26.8504 74.8336 23.1916 78.4925 18.676 78.4925Z"/>
                                <path d="M25.9406 55.442H75.019C75.019 55.442 51.225 63.62 25.9406 55.442Z"/>
                            </svg>                        
                        </div>
                        <div class="text">
                            <ul class="pop-menu">
                                <li>
                                    <a href="javascript:__pop_up._save('file')">
                                        <span>[new file]</span>
                                        <span>
                                            <span class="__s-win">Alt + N</span>
                                            <span class="__s-mac">⌥ + N</span>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:__pop_up._open('file')">
                                        <span>[open file]</span>
                                        <span>
                                            <span class="__s-win">Alt + O</span>
                                            <span class="__s-mac">⌥ + O</span>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:__pop_up._open('folder')">
                                        <span>[open folder]</span>
                                        <span>
                                            <span class="__s-win">Alt + P</span>
                                            <span class="__s-mac">⌥ + P</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;

        // Update window attributes
        __w.parentElement.setAttribute('window-opened', WINDOW_EDITOR.current);
        // __w.parentElement.id = `window-opened-${WINDOW_EDITOR.current}`; ----------------> Less convenient; Donot use it anymore


        // Testing window_config
        // console.log(WINDOW_EDITOR);
    };

    create_file = (file = {name : 'file.asm', route : '/', content : ''}, __wnum = WINDOW_EDITOR.active) => {
        let __fw = document.createElement('div');
        let __f = document.createElement('div');

        // Create file metadata
        let metadata = {
            name: file.name,
            route: file.route,
            saved: false,
            content: file.content,
            __fw,
            __f

        }
        // Get window
        let __w = WINDOW_EDITOR.windows[__wnum];

        // <div class="active">
        //     <a>[active.s]</a>
        //     <a class="muted">x</a>
        // </div>

        // Create file wrapper to insert in queue
        __fw.classList.add('active');

        // if(!saved) __fw.classList.add('not-saved');

        __fw.classList.add(`w-${__wnum}-f-${WINDOW_EDITOR.files[`w${__wnum}`].length}`);

            // Create file name
            let __fw_name = document.createElement('a');
            __fw_name.innerHTML = `[${file.name}]`;
            __fw_name.addEventListener('click', () => {
                // Focus
                focus_file(__wnum, metadata);
            });

            // Create file close
            let __fw_close = document.createElement('a');
            __fw_close.classList.add('muted');
            __fw_close.innerHTML = 'x';
            __fw_close.addEventListener('click', () => {
                // Close __fw
                __fw.remove();


                let i = WINDOW_EDITOR.files[`w${__wnum}`].indexOf(metadata);

                // Remove file from files array
                WINDOW_EDITOR.files[`w${__wnum}`].splice(i, 1);

                // Remove file from window
                __f.remove();

                if (metadata.__fw.classList.contains('active')) {
                    // Focus on last file
                    if (WINDOW_EDITOR.files[`w${__wnum}`].length !== 0) {
                        if (i > 0)
                            focus_file(__wnum, WINDOW_EDITOR.files[`w${__wnum}`][i-1]);
                        else if(i == 0)
                            focus_file(__wnum, WINDOW_EDITOR.files[`w${__wnum}`][i]);
                    }
                }

            });
        
        // Append file name and close to file wrapper
        __fw.appendChild(__fw_name);
        __fw.appendChild(__fw_close);

        // Append file wrapper to file queue
        __w.querySelector('.file-queue').appendChild(__fw);

        
        // <div class="f-0 editor-file">
        //     <span aria-hidden="true" class="line-numbers-rows no-select">
        //         <span></span>
        //     </span>
        //     <textarea class="textarea-main" spellcheck="false" outline="none" autocorrect="off" autocapitalize="off" aria-label="SpimHub" tabindex="0"></textarea>
        //     <pre aria-hidden="true" class="export-code">
        //         <code>
        //         </code>
        //     </pre>
        // </div>

        // Create file
        __f.classList.add(`f-${WINDOW_EDITOR.files[`w${__wnum}`].length}`);
        __f.classList.add('editor-file');
        __f.classList.add('active');

            // Create line numbers
            let __f_line_numbers = document.createElement('span');
            __f_line_numbers.classList.add('line-numbers-rows');
            __f_line_numbers.classList.add('no-select');

                // Create line number
                let __f_line_number = document.createElement('span');

            // Create textarea
            let __f_textarea = document.createElement('textarea');
            __f_textarea.value = file.content;

            __f_textarea.classList.add('textarea-main');
            __f_textarea.spellcheck = false;
            __f_textarea.outline = 'none';
            __f_textarea.autocorrect = 'off';
            __f_textarea.autocapitalize = 'off';
            __f_textarea.setAttribute('aria-label', 'SpimHub');
            __f_textarea.tabindex = 0;

            __f_textarea.addEventListener('input', () => update_code(__f_textarea, metadata, file));
            __f_textarea.addEventListener('mouseup', () =>  {
                // Focus selected line
                focus_line(__f_textarea)
            });

            __f_textarea.addEventListener('scroll', () => {
                // Get and set x and y
                __f_export_code.scrollTo(__f_textarea.scrollLeft, __f_textarea.scrollTop);
                __f_line_numbers.scrollTo(__f_textarea.scrollLeft, __f_textarea.scrollTop);
            });

            __f_textarea.addEventListener('focusout', () => unfocus_line(__f_textarea));

            __f_textarea.addEventListener('keydown', (e) => {
                // Write tab on tab press
                if(e.key == 'Tab' || e.keyCode == 9 || e.which == 9) {
                    e.preventDefault();

                    const start = __f_textarea.selectionStart;
                    __f_textarea.value = __f_textarea.value.substring(0, start) + " ".repeat(TAB_SIZE) + __f_textarea.value.substring(__f_textarea.selectionEnd);
                    // fix caret position
                    __f_textarea.selectionStart = __f_textarea.selectionEnd = start + TAB_SIZE;

                    // Update code
                    update_code(__f_textarea, metadata, file);

                }
                // Update lines number if the user jump lines
                if(e.key == 'ArrowUp' || e.keyCode == 38 || e.which == 38){
                    // Overload line numbers fnc
                    focus_line(__f_textarea, delay=-2);
                }
                
                if(e.key == 'ArrowDown' || e.keyCode == 40 || e.which == 40){
                    // Overload line numbers fnc
                    focus_line(__f_textarea, delay=0);
                }
            });


            // Create export code
            let __f_export_code = document.createElement('pre');
            __f_export_code.classList.add('export-code');

                // Create code
                let __f_code = document.createElement('code');
                __f_code.setAttribute('aria-hidden', 'true');
                __f_code.classList.add('language-mipsasm');
                __f_code.innerHTML = '<p> </p>';


        // Append line number to line numbers
        __f_line_numbers.appendChild(__f_line_number);

        // Append code to export code
        __f_export_code.appendChild(__f_code);

        // Append line numbers, textarea and export code to file
        __f.appendChild(__f_line_numbers);
        __f.appendChild(__f_textarea);
        __f.appendChild(__f_export_code);

        // Append file to window
        __w.appendChild(__f);

        // Focus file
        focus_file(__wnum, metadata);

        // Update current file
        WINDOW_EDITOR.files[`w${__wnum}`].push(metadata);

        // Focus editor window group
         __group_h.open_group('editor');

        // Update code if value is not empty
        if(file.content !== '') update_code(__f_textarea);
    }

    focus_file = (w, file) => {
        // Update active file
        WINDOW_EDITOR.files[`w${w}`].forEach(el => {
            [el.__fw, el.__f].forEach(e => {
                e.classList.remove('active');
            });
        });

        // Update active file
        [file.__fw, file.__f].forEach(e => {
            e.classList.add('active');
        });
    };
    
    open_file = (file) => {
        // If file is already open
        let opened = WINDOW_EDITOR.files[`w${WINDOW_EDITOR.active}`].find(el => (el.route + el.name) == (file.route + file.name));

        if (opened){
            // Focus file
            focus_file(WINDOW_EDITOR.active, opened);
            return;
        }

        // Create file window
        create_file(file);
    };

    WINDOW_EDITOR = {
        parent: document.querySelector('#main-editor'),
        max: 4,
        min: 1,
        current: 0,
        active: 0,
        label: 'Window',
        windows: [null, null, null, null],
        files: {
            w0: [],
            w1: [],
            w2: [],
            w3: [],
        }
    }

    __new_file = (filename, route) => {
        if (!filename || !route || !FILE_SYSTEM[route]) return false;

        let warning = document.querySelector('section#warning');
        // If filename is not valid
        // If file already exists
        let files = Object.values(FILE_SYSTEM[route].files).map(el => el.name);
        if (!filename.match(/^[a-zA-Z0-9_\-\.]+$/) || files.includes(filename)){
            if (files.includes(filename)){
                warning.innerHTML = `<p>File "[${filename}]" already exists.</p>`;
            }else {
                warning.innerHTML = `<p>Filename "[${filename}]" is invalid.</p>`;
            }
            warning.classList.add('active');
            setTimeout(() => {
                warning.classList.remove('active');
            }, 10000);
            return false;
        }

        // Import it into filesystem
        let _file = {
            name: filename,
            route: route,
            content: '',
            saved: true,
        }

        // Add file to filesystem
        FILE_SYSTEM[route].files[filename] = _file;

        // Clean GUI
        ROOT_DIR.clean_gui('/');

        // Create folders
        ROOT_DIR.get_dir_gui('/');

        // Set new route
        ROOT_DIR.focus_dir(route);

        // Open file
        create_file(_file);
        
        return true;
    }

    // <li>
    //     <div class="explorer-folder" route="/docs">
    //         <a onclick="this.parentElement.classList.toggle('active')" class="x-folder">[docs]</a>
    //         <ul>
    //             <li>
    //                 <a class="x-file" href="./">readme.md</a>
    //             </li>
    //             <li>
    //                 <a class="x-file" href="./">index.html</a>
    //             </li>
    //         </ul>
    //     </div>
    // </li>
    __new_folder = (foldername, route) => {
        if (!foldername || !route) return false;

        // If folder already exists
        if (FILE_SYSTEM[route].folders.includes(foldername)){
            let warning = document.querySelector('section#warning');

            warning.innerHTML = `<p>Folder "[${foldername}]" already exists.</p>`;
            warning.classList.add('active');
            setTimeout(() => {
                warning.classList.remove('active');
            }, 10000);
            return false;
        }

        // Import it into filesystem
        let _folder = {
            name: `[${foldername}]`,
            files: {},
            folders: [],
            active: true,
        }

        let new_route = `${route}${foldername}/`;

        // Add folder to filesystem
        // Parent folder
        FILE_SYSTEM[route].folders.push(foldername);
        // Current folder
        FILE_SYSTEM[new_route] = _folder;

        // Clean GUI
        ROOT_DIR.clean_gui('/');

        // Create folders
        ROOT_DIR.get_dir_gui('/');

        // Set new route
        ROOT_DIR.focus_dir(new_route);

        return true;
    }


    // ======================= //
    //  GROUP CONTROLS    (editor, runner, extensions)     

    let window_main = {
        el: document.querySelector('#main-files'),
        groups : {
            editor: document.querySelector('#main-editor'),
            runner: runner_editor.el,
            extensions: document.querySelector('#main-extensions'),
        },
    }
    __group_h = {
        open: () => {
            // Disable all groups
            Object.keys(window_main.groups).forEach(el => {
                window_main.groups[el].classList.remove('active');
            });
        },

        open_group: (group) => {
            let __groups = ['editor', 'runner', 'extensions'];

            // Reject if group is not valid
            if(!__groups.includes(group)) return;


            // Open group
            __group_h.open();
            window_main.groups[group].classList.add('active');

            // Update active group
            __group_h.active = group;
            
        }
    }



    // ======================= //
    // SAVE FILES

    let extras_pop_up = document.querySelector('footer#extra-pop-up');

    // Open pop-up
    __pop_up = {
        open: () => {
            extras_pop_up.classList.add('active');
            document.querySelector('#clicker-changer').classList.add('active');
        },
        close: e => {
            e.target.classList.remove('active');


            // Remove active class from all extras
            extras_pop_up.classList.remove('active');

            for (let el of extras_pop_up.children) {
                // Remove active class from all extras children
                el.classList.remove('active');
            }
        }
    }

    // Save new file
    __pop_up._save = (type) => {
        let __type = ['file', 'folder'];

        // Reject if type is not valid
        if(!__type.includes(type)) return;

        __pop_up.open();
        extras_pop_up.querySelector(`.create-${type}`).classList.add('active');
        extras_pop_up.querySelector(`.create-${type} input`).focus();
    };
    __pop_up._open = (type) => {
        let __type = ['file', 'folder'];

        // Reject if type is not valid
        if(!__type.includes(type)) return;

        __pop_up.open();
        extras_pop_up.querySelector(`.open-${type}`).classList.add('active');
    };
    // Ask remove current project
    __pop_up._new_project = (layer=false) => {
        if (!layer) {
            __pop_up.open();
            extras_pop_up.querySelector(`.new-project`).classList.add('active');
        }
    }

    // ======================= //
    // NEW 
    let new_dir = {
        file: {
            el: extras_pop_up.querySelector('a[action="new-file"]'),
            input: extras_pop_up.querySelector('.create-file input'),
            create: () => {
                // Get input value
                let filename = new_dir.file.input.value + '.asm';
        
                // Reject if filename is empty
                if(filename == '') return;
        
                // FNC
                if (__new_file(filename, (ROOT_DIR.cd || '/'))) {
            
                    // Reset input value
                    new_dir.file.input.value = '';
            
                    // Close pop-up
                    __pop_up.close({target: document.querySelector('#clicker-changer')});
                };
            }
        },
        folder: {
            el: extras_pop_up.querySelector('a[action="new-folder"]'),
            input: extras_pop_up.querySelector('.create-folder input'),
            create: () => {
                // Get input value
                let foldername = new_dir.folder.input.value;

                // Reject if foldername is empty
                if(foldername == '') return;

                // FNC
                if (__new_folder(foldername, (ROOT_DIR.cd || '/'))) {

                    // Reset input value
                    new_dir.folder.input.value = '';

                    // Close pop-up
                    __pop_up.close({target: document.querySelector('#clicker-changer')});
                }
            }
        },
    }

    // Create new file
    new_dir.file.el.addEventListener('click', new_dir.file.create);
    let input_enter = (e, fnc) => {
        if (e.keyCode == 13 || e.key == 'Enter') {
            e.preventDefault();
            fnc();
        }else {
            document.getElementById('warning').classList.remove('active');
        }
    }
    new_dir.file.input.addEventListener('keydown', e => input_enter(e, new_dir.file.create));

    // Create new folder
    new_dir.folder.el.addEventListener('click', new_dir.folder.create);
    new_dir.folder.input.addEventListener('keydown', e => input_enter(e, new_dir.folder.create));
    

    // ======================= //
    // REGISTER LABEL CONTROL

    let register_window = {
        el: document.querySelector('#register-section'),
        header: document.querySelector('#register-section header'),
        tabs: {
            register: document.querySelector('#register-section .tab.register'),
            coproc1: document.querySelector('#register-section .tab.coproc1'),
            coproc0: document.querySelector('#register-section .tab.coproc0'),
        }
    }
    register_window.windows = {
        register: register_window.el.querySelector('.runner-register'),
        coproc1: register_window.el.querySelector('.runner-coproc1'),
        coproc0: register_window.el.querySelector('.runner-coproc0'),
    }

    // Open register window
    __group_register = {
        open: () => {
            // Disable all tabs
            Object.keys(register_window.tabs).forEach(el => {
                register_window.tabs[el].classList.remove('active');
                register_window.windows[el].classList.remove('active');
            });
        },

        open_tab: (tab) => {
            let __tabs = ['register', 'coproc1', 'coproc0'];

            // Reject if tab is not valid
            if(!__tabs.includes(tab)) return;

            // Open tab
            __group_register.open();
            register_window.tabs[tab].classList.add('active');
            register_window.windows[tab].classList.add('active');
        }
    }

    // ======================= //
    //  Close all opened tabs  //
    //  and menus on click     //
    // ======================= //
    document.addEventListener('click', close_all_menus);

    // ======================= //
    //  Close extras pop-up    //
    //  on click               //
    // ======================= //
    document.querySelector('#clicker-changer').addEventListener('click', __pop_up.close);



    // Create first window
    create_window(false);
});