


// ================== //
//  Global Variables  //
// ================== //
let FILE_SYSTEM, ROOT_DIR, WINDOW_EDITOR, TAB_SIZE, TAB_REGEX, FORMAT;
let toggle_terminal, create_file, create_window, remove_window;

// Global functions
let __pop_up, __group_h, __group_register;

window.addEventListener('load', ()=> {

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
    // MEMORY FILESYSTEM
    FILE_SYSTEM = {
        "/" : {
            name: "[project]",
            files: [],
            folders: [],

        }
    }

    // ROOT 
    ROOT_DIR = {
        cd: "/"
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
    //  File Manager Menu //
    // ================== //
    // Add click event to file manager and open extra menu
    let file_manager = {
        el: document.querySelector('#file-manager'),
        menu: document.querySelector('#file-manager-extra-menu'),
    };
    // Add click event to file manager and open extra menu
    file_manager.el.addEventListener('contextmenu', (e)=> {
        e.preventDefault();
        return pop_menu(e, file_manager.menu);
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

    const update_code = (textarea) => {
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
    };

    // Remove the window
    remove_window = (w) => {
        //
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
                    execute_file.el.push(__w_execute_file);

                    // Create execute status
                    let __w_execute_status = document.createElement('span');
                    __w_execute_status.classList.add('a');
                    __w_execute_status.innerHTML = '[status]';

                    // Close window
                    let __w_close = document.createElement('a');
                    __w_close.href = './';
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

        // If empty file in current window, create new file
        if (WINDOW_EDITOR.files[`w${WINDOW_EDITOR.current}`].length === 0)  create_file(WINDOW_EDITOR.current);

        // Update current window
        WINDOW_EDITOR.current++;
        WINDOW_EDITOR.active = WINDOW_EDITOR.current - 1;

        // Update window attributes
        __w.parentElement.setAttribute('window-opened', WINDOW_EDITOR.current);
        // __w.parentElement.id = `window-opened-${WINDOW_EDITOR.current}`; ----------------> Less convenient; Donot use it anymore
    };

    create_file = (__wnum = WINDOW_EDITOR.active, name = "file", saved = false) => {
        // Get window
        let __w = WINDOW_EDITOR.windows[__wnum];

        // <div class="active">
        //     <a>[active.s]</a>
        //     <a class="muted">x</a>
        // </div>

        // Create file wrapper to insert in queue
        let __fw = document.createElement('div');
        __fw.classList.add('active');

        if(!saved) __fw.classList.add('not-saved');

        __fw.classList.add(`w-${__wnum}-f-${WINDOW_EDITOR.files[`w${__wnum}`].length}`);

            // Create file name
            let __fw_name = document.createElement('a');
            __fw_name.innerHTML = `[${name}.s]`;

            // Create file close
            let __fw_close = document.createElement('a');
            __fw_close.classList.add('muted');
            __fw_close.innerHTML = 'x';
        
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
        let __f = document.createElement('div');
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
            __f_textarea.classList.add('textarea-main');
            __f_textarea.spellcheck = false;
            __f_textarea.outline = 'none';
            __f_textarea.autocorrect = 'off';
            __f_textarea.autocapitalize = 'off';
            __f_textarea.setAttribute('aria-label', 'SpimHub');
            __f_textarea.tabindex = 0;

            __f_textarea.addEventListener('input', () => update_code(__f_textarea));
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
                    update_code(__f_textarea);

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

        // Update active file
        WINDOW_EDITOR.files[`w${__wnum}`].forEach(el => {
            el.forEach(e => {
                e.classList.remove('active');
            });
        });

        // Update current file
        WINDOW_EDITOR.files[`w${__wnum}`].push([__fw, __f]);
    
    }
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
    }

    // Save new file
    __pop_up._save = (type) => {
        let __type = ['file', 'folder'];

        // Reject if type is not valid
        if(!__type.includes(type)) return;

        __pop_up.open();
        extras_pop_up.querySelector(`.create-${type}`).classList.add('active');
    }


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
    document.querySelector('#clicker-changer').addEventListener('click', e => {
        e.target.classList.remove('active');


        // Remove active class from all extras
        extras_pop_up.classList.remove('active');

        for (let el of extras_pop_up.children) {
            // Remove active class from all extras children
            el.classList.remove('active');
        }
    });



    // Create first window
    create_window(false);
});