let FILE_SYSTEM,ROOT_DIR,WINDOW_EDITOR,TAB_SIZE,TAB_REGEX,FORMAT,toggle_terminal,toggle_opt,create_file,create_window,open_file,open_folder,change_file,change_folder,delete_file,open_window,focus_file,check_file,check_folder,copy_path,remove_window,new_project,set_theme,html_open,html_delete,html_rename,__pop_up,__group_h,__group_register,__new_file,__new_folder,__rename_file,__rename_folder,__delete_file,__delete_folder;function getRelativePath(e,t){if(e==t)return"./";for(var n=-1!==e.indexOf("/")?"/":"\\",l=t.split(n),i=e.split(n),o=l.pop(),r=l.join(n),a="";-1===r.indexOf(i.join(n));)i.pop(),a+=".."+n;var s=l.slice(i.length);return s.length&&(a+=s.join(n)+n),a+o}let COPY_CLIPBOARD=e=>{try{return void navigator.clipboard.writeText(e)}catch(t){let n=document.createElement("input");document.body.appendChild(n),n.value=e,n.focus(),n.select(),n.setSelectionRange(0,99999),document.execCommand("Copy"),n.remove()}},COOKIE_ACTIVATED=navigator.cookieEnabled;const setup_dialog={i:0,content:["Hi 👋, you look new here. Awesome! \nWelcome to SpimHub!","Let's start setting up the dev environment. \nIt will take a few seconds. \nAlso, you can skip this setup by reloading the page or by pressing [Esc] at any time.","Please select your preferred editor theme (default: light mode). 💡 \nYou can change it or install different themes once the setting up is finished:","SpimHub use a virtual filesystem to store your files in locaStorage (cookies). 🍪 \nYou can create new files, folders and save it in the virtual filesystem. \nYou can also download the project backup and load existing one.","To do this SpimHub need you to activate your cookies for SpimHub. \nThis allow us to control the localStorage to save the files data. 🔧 \n\n >> "+(COOKIE_ACTIVATED?"Cookies are already [ACTIVATED] in your browser.":"Cookies are [DISABLED] in your browser. Please consider to activate them. Otherwise you won't be able to save your files."),"By the way, if you use SpimHub in a public computer, you can disable cookies to prevent other users to see your files. \nAnd if you are in incognito mode, cookies are disabled by default.","SpimHub understands that you accept our cookie policy by continuing to use the editor","Lastly SpimHub hope you enjoy the editor and if you want to share it with your friends, you can use this link:","That's all! 🎉 \nNow you can start using SpimHub, the page will reload and you will see the editor interface. \n\n\nEnjoy!"],writing:!1,finished:!1,exception:[2,7],exception_callback:{2:()=>'<div class="themes" style="margin-top: 10px"><a href="javascript:set_theme(\'light\')">[light mode]</a> <a href="javascript:set_theme(\'dark\')">[dark mode]</a></div>',7:()=>'<div class="themes" style="margin-top: 10px"><a href="https://ZhengLinLei.github.io/spimhub/" target="_blank">[https://ZhengLinLei.github.io/spimhub/]</a></div>'},next:e=>{setup_dialog.writing=!0;let t=document.querySelector("#setup-init main"),n=t.querySelector("main pre.text"),l=0,i=setInterval((()=>{n.innerHTML+=setup_dialog.content[e][l],l++,l>=setup_dialog.content[e].length&&(setup_dialog.writing=!1,clearInterval(i),n.innerHTML+=setup_dialog.exception.includes(e)?setup_dialog.exception_callback[e]():"",n.innerHTML+='\n\n<span class="muted">>> Press [Enter] to continue.</span>\n\n'),t.scrollTop=t.scrollHeight}),50)}};set_theme=e=>{["light","dark"].includes(e)||(e="light"),document.documentElement.setAttribute("theme",e)};let isMac=navigator.platform.toUpperCase().indexOf("MAC")>=0;var isMacLike=/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),isIOS=/(iPhone|iPod|iPad)/i.test(navigator.platform);(isMac||isMacLike||isIOS)&&document.documentElement.setAttribute("pc","mac"),window.addEventListener("load",(()=>{if("true"!==localStorage.getItem("sh-cookies")||!localStorage.getItem("sh-cookies")){localStorage.removeItem("sh-cookies"),document.querySelector("#setup-init").classList.add("active");let e=()=>{setup_dialog.finished||setup_dialog.writing||(setup_dialog.i>=setup_dialog.content.length-1&&(setup_dialog.finished=!0,document.location.reload()),setup_dialog.i++,setup_dialog.next(setup_dialog.i))};document.addEventListener("keydown",(t=>{"Enter"===t.key&&e(),"Escape"===t.key&&(t.preventDefault(),document.location.reload())})),setup_dialog.next(setup_dialog.i)}let e={file:document.querySelector("#file-option-menu"),folder:document.querySelector("#folder-option-menu")};copy_path=(t="abs",n="file")=>{if(!["file","folder"].includes(n)||!["abs","rel"].includes(t))return;let l=e[n].getAttribute("route");COPY_CLIPBOARD(l)};let t=t=>{let n=e[t],l=n.getAttribute("route"),i=n.getAttribute("file");return{_route:l,_files:i,folder:FILE_SYSTEM[l],file:FILE_SYSTEM[l].files[i]}};html_open=e=>{if(!["file","folder"].includes(e))return;let{_route:n,_files:l,folder:i,file:o}=t(e);"file"===e?open_file(o):open_folder(i)},html_delete=e=>{if(!["file","folder"].includes(e))return;let{_route:n,_files:l,folder:i,file:o}=t(e),r="file"===e?o.name:i.name;__pop_up._delete(e,r,n,l),document.onkeydown=t=>{if("Enter"===t.key){("file"===e?__delete_file(n,l):__delete_folder(n))&&(__pop_up.close({target:document.querySelector("#clicker-changer")}),document.onkeydown=null)}"Escape"===t.key&&(t.preventDefault(),__pop_up.close({target:document.querySelector("#clicker-changer")}),document.onkeydown=null)}},html_rename=e=>{if(!["file","folder"].includes(e))return;let{_route:n,_files:l,folder:i,file:o}=t(e);__pop_up._rename(e,n,l)},FILE_SYSTEM=localStorage.getItem("sh-virtual-disk")?JSON.parse(localStorage.getItem("sh-virtual-disk")):{"/":{name:"[project]",files:{},folders:[],active:!0}},ROOT_DIR={cd:"/",dir:[],clean_gui:(e="/")=>{document.querySelector(`.explorer-folder[route="${e}"] ul[route="${e}"]`).innerHTML=""}},ROOT_DIR.focus_dir=(e="/")=>{ROOT_DIR.cd=e,ROOT_DIR.dir=e.split("/").filter((e=>""!==e))},ROOT_DIR._get_dir_tree=(e="/")=>{let t={};return(FILE_SYSTEM[e]?FILE_SYSTEM[e].folders:[]).forEach((n=>{t[n]=ROOT_DIR._get_dir_tree(e+n+"/")})),t},ROOT_DIR.get_dir_gui=(e="/")=>{let t=FILE_SYSTEM[e]?FILE_SYSTEM[e].folders:[],l=FILE_SYSTEM[e]?Object.values(FILE_SYSTEM[e].files):[];t.sort(((e,t)=>e.toLowerCase()<t.toLowerCase()?-1:e.toLowerCase()>t.toLowerCase()?1:0)),l.sort(((e,t)=>e.name.toLowerCase()<t.name.toLowerCase()?-1:e.name.toLowerCase()>t.name.toLowerCase()?1:0));let o=document.querySelector(`.explorer-folder[route="${e}"] ul[route="${e}"]`);t.forEach((t=>{let l=`${e}${t}/`,r=document.createElement("li"),a=document.createElement("div");a.classList.add("explorer-folder"),FILE_SYSTEM[l].active&&a.classList.add("active"),a.setAttribute("route",`${l}`);let s=document.createElement("a");s.classList.add("x-folder"),s.innerHTML=`[${t}]`,s.addEventListener("click",(()=>{ROOT_DIR.focus_dir(l),a.classList.toggle("active"),FILE_SYSTEM[l].active=!FILE_SYSTEM[l].active,n(s)})),s.addEventListener("contextmenu",(e=>{e.preventDefault(),ROOT_DIR.focus_dir(l);let t=document.querySelector("#folder-option-menu");t.setAttribute("route",l),i(e,t),n(s)}));let c=document.createElement("ul");c.setAttribute("route",`${l}`),a.appendChild(s),a.appendChild(c),r.appendChild(a),o.appendChild(r),ROOT_DIR.get_dir_gui(l)})),l.forEach((e=>{let t=document.createElement("li"),l=document.createElement("a");l.classList.add("x-file"),l.innerHTML=e.name,l.addEventListener("click",(()=>{ROOT_DIR.focus_dir(e.route),open_file(e),n(l)})),l.addEventListener("contextmenu",(t=>{t.preventDefault(),ROOT_DIR.focus_dir(e.route);let o=document.querySelector("#file-option-menu");o.setAttribute("route",e.route),o.setAttribute("file",e.name),i(t,o),n(l)})),t.appendChild(l),o.appendChild(t)}))};const n=e=>{l(),e.classList.add("focus")},l=e=>{if(e&&e.target.classList.contains("focus"))return;document.querySelectorAll(".focus").forEach((e=>{e.classList.remove("focus")}))};TAB_SIZE=4,TAB_REGEX=/\t/g,FORMAT=new Format(__mipsasm_scope());const i=(e,t)=>(o(),t.classList.add("active"),e.pageY+t.offsetHeight>window.innerHeight?t.style.top=e.pageY-t.offsetHeight+"px":t.style.top=e.pageY+"px",e.pageX+t.offsetWidth>window.innerWidth?t.style.left=e.pageX-t.offsetWidth+"px":t.style.left=e.pageX+"px",!1),o=e=>{let t=document.querySelectorAll(".menu");for(let e=0;e<t.length;e++)t[e].classList.contains("active")&&t[e].classList.remove("active")},r=e=>{if("touchstart"==e.type||"touchmove"==e.type||"touchend"==e.type||"touchcancel"==e.type){var t=void 0===e.originalEvent?e:e.originalEvent,n=t.touches[0]||t.changedTouches[0];x=n.pageX,y=n.pageY}else"mousedown"!=e.type&&"mouseup"!=e.type&&"mousemove"!=e.type&&"mouseover"!=e.type&&"mouseout"!=e.type&&"mouseenter"!=e.type&&"mouseleave"!=e.type||(x=e.clientX,y=e.clientY);return{x:x,y:y}};document.querySelector(".scroll-x.header").addEventListener("mousedown",(e=>{let t=p.el,n=r(e),l=window.innerWidth/2,i=t.getBoundingClientRect().width,o=n.x;window.onmousemove=n=>{["touchstart","touchmove","touchend","touchcancel"].includes(e.type)||n.preventDefault();let a=r(n);document.body.classList.add("col-resize");let s=i+(a.x-o);s>100&&s<l&&(document.documentElement||document.querySelector(":root")).style.setProperty("--explorer-size",`${s}px`),s<50?t.classList.remove("active"):t.classList.add("active")},window.onmouseup=()=>{document.body.classList.remove("col-resize"),window.onmousemove=null,window.ontouchmove=null,window.onmouseup=null,window.ontouchend=null}}));let a={el:document.querySelector("#file-manager"),layer:document.querySelector("#file-manager > .explorer-main-layer"),menu:document.querySelector("#file-manager-extra-menu")};a.layer.addEventListener("contextmenu",(e=>(e.preventDefault(),i(e,a.menu)))),a.layer.addEventListener("mousedown",(e=>{ROOT_DIR.focus_dir("/")}));let s={el:[],menu:document.querySelector("#execute-file-extra-menu")},c={el:document.querySelector("#main-editor"),menu:document.querySelector("#file-editor-extra-menu"),disabled:s.el};c.el.addEventListener("contextmenu",(e=>-1!==c.disabled.indexOf(e.target)||(e.preventDefault(),i(e,c.menu))));let d={el:document.querySelector("#terminal"),close_dom:document.querySelector("#close-t"),menu:document.querySelector("#terminal-extra-menu")};d.disabled=[d.close_dom],d.tab=d.el.querySelectorAll(".tab"),d.window=d.el.querySelectorAll(".window"),d.el.addEventListener("contextmenu",(e=>-1!==d.disabled.indexOf(e.target)||(e.preventDefault(),i(e,d.menu))));let u={el:document.querySelector("#main-runner"),menu:s.menu};u.el.addEventListener("contextmenu",(e=>(e.preventDefault(),i(e,u.menu)))),toggle_terminal=(e=-1,t="terminal")=>{-1===e?d.el.classList.toggle("active"):1===e?d.el.classList.add("active"):0===e&&d.el.classList.remove("active"),["terminal","console","output"].includes(t)&&([...d.tab,...d.window].forEach((e=>{e.classList.remove("active")})),d.el.querySelector(`header .${t}-tab`).classList.add("active"),d.el.querySelector(`main #${t}-main`).classList.add("active"))},d.close_dom.addEventListener("click",(e=>{toggle_terminal(0)}));let p={el:document.querySelector("#main-folder"),opt_files:document.querySelector("#opt-files"),opt_search:document.querySelector("#opt-search"),opt_extensions:document.querySelector("#opt-extensions"),tab:["opt-files","opt-search","opt-extensions"]};toggle_opt=(e=-1,t="files")=>{-1===e?p.el.classList.contains(`opt-${t}`)&&p.el.classList.toggle("active"):1===e?p.el.classList.add("active"):0===e&&p.el.classList.remove("active"),["files","search","extensions"].includes(t)&&([...p.tab].forEach((e=>{p.el.classList.remove(e)})),p.el.classList.add(`opt-${t}`))};const _=(e,t=-1,n=!0)=>{let l=e.parentElement;const i=e.value.substring(0,e.selectionStart).split("\n").length,o=[l.querySelector(".line-numbers-rows"),l.querySelector(".export-code > code")];i+t<o[0].children.length&&!o[0].children[i+t].classList.contains("active")&&(n&&f(e),o.forEach((e=>e.children[i+t].classList.add("active"))))},f=(e,t=!0,n=0)=>{let l=e.parentElement;const i=[l.querySelector(".line-numbers-rows"),l.querySelector(".export-code > code")];t?i.forEach((e=>{for(let t=0;t<e.children.length;t++)e.children[t].classList.remove("active")})):i.forEach((e=>e.children[n].classList.remove("active")))},m=(e,t,n)=>{let l=e.parentElement;TAB_REGEX.test(e.value)&&(e.value=e.value.replaceAll(TAB_REGEX," ".repeat(TAB_SIZE)));let i=e.value;const o=i.split("\n");l.querySelector(".export-code > code").innerHTML=(e=>(e=e.map((e=>e.replaceAll(/&/g,"&amp;").replaceAll(/</g,"&lt;").replaceAll(/>/g,"&gt;"))),FORMAT.formateCode(e)))(o),l.style.setProperty("--editor-padd",o.length>=100?o.length>=1e3?o.length>=1e4?"55px":"45px":"35px":"25px");l.querySelector(".line-numbers-rows").innerHTML=Array(o.length).fill("<span></span>").join(""),e===document.activeElement&&_(e,-1,!1),t.content=i,t.content!==n.content?t.__fw.classList.add("not-saved"):t.__fw.classList.remove("not-saved")};remove_window=(e=WINDOW_EDITOR.current-1,t=!0)=>{t&&__group_h.open_group("editor"),WINDOW_EDITOR.current<=1||(WINDOW_EDITOR.current--,WINDOW_EDITOR.windows[e].parentElement.setAttribute("window-opened",WINDOW_EDITOR.current),WINDOW_EDITOR.windows[e].remove(),WINDOW_EDITOR.windows[e]=null,WINDOW_EDITOR.files[`w${e}`]=[],WINDOW_EDITOR.active===e&&(WINDOW_EDITOR.active=0))},create_window=(e=!0)=>{if(e&&__group_h.open_group("editor"),WINDOW_EDITOR.current>=WINDOW_EDITOR.max)return;let t=document.createElement("div");t.classList.add(`w-${WINDOW_EDITOR.current}`),t.classList.add("editor-window"),t.addEventListener("click",(()=>{WINDOW_EDITOR.active=WINDOW_EDITOR.windows.indexOf(t)})),WINDOW_EDITOR.windows[WINDOW_EDITOR.current]=t;let n=document.createElement("div");n.classList.add("window-header"),n.classList.add("d-flex");let l=document.createElement("div");l.classList.add("file-queue");let i=document.createElement("div");i.classList.add("execute"),i.classList.add("d-flex");let o=document.createElement("a");o.href="./",o.classList.add("execute-file"),o.innerHTML="[run]";let r=document.createElement("span");r.classList.add("a"),r.innerHTML="[status]";let a=document.createElement("a");a.href=`javascript:remove_window(${WINDOW_EDITOR.current})`,a.classList.add("close-window"),a.innerHTML="[ x ]",i.appendChild(o),i.appendChild(r),i.appendChild(a),n.appendChild(l),n.appendChild(i),t.appendChild(n),WINDOW_EDITOR.parent.appendChild(t),WINDOW_EDITOR.current++,WINDOW_EDITOR.active=WINDOW_EDITOR.current-1,0===WINDOW_EDITOR.files["w"+(WINDOW_EDITOR.current-1)].length&&(t.innerHTML+='\n                <div class="empty-window">\n                    <div class="empty-window-content">\n                        <div class="logo">\n                            <svg width="100" height="79" viewBox="0 0 100 79" fill="none" xmlns="http://www.w3.org/2000/svg">\n                                <path d="M72.5691 28.1201C68.8572 28.1201 65.8515 31.1294 65.8515 34.8395C65.8515 38.5497 68.8572 41.5589 72.5691 41.5589C76.2775 41.5589 79.2885 38.5497 79.2885 34.8395C79.2885 31.1294 76.2775 28.1201 72.5691 28.1201ZM28.2187 28.1201C24.505 28.1201 21.4994 31.1294 21.4994 34.8395C21.4994 38.5497 24.5068 41.5589 28.2187 41.5589C31.9289 41.5589 34.9363 38.5497 34.9363 34.8395C34.9363 31.1294 31.9289 28.1201 28.2187 28.1201ZM9.50678 19.6483C8.19512 18.3314 7.54195 16.6073 7.54195 14.8938C7.54195 13.1715 8.19512 11.4491 9.50678 10.1375C10.8255 8.82759 12.5408 8.17442 14.2613 8.17442C15.9837 8.17442 17.706 8.82759 19.0159 10.1375L17.4458 11.2969C26.5389 4.22528 37.9739 0 50.393 0C62.8158 0 74.2348 4.22351 83.3403 11.2969L81.7755 10.1428C83.0872 8.83113 84.8042 8.17796 86.5301 8.17796C88.2471 8.17796 89.9712 8.83113 91.2793 10.1428C92.5857 11.4615 93.2388 13.1839 93.2388 14.8973C93.2388 16.6214 92.591 18.342 91.2793 19.6537L92.8476 20.806C115.567 43.5237 76.8971 53.7533 76.8971 53.7533H23.8908C22.7756 53.7533 -16.3635 45.108 7.94022 20.806L9.50678 19.6483Z"/>\n                                <path d="M85.8273 77.7491C81.3135 77.7491 77.6547 74.0902 77.6547 69.5746C77.6547 65.0608 81.3135 61.402 85.8273 61.402C90.3412 61.402 94 65.0608 94 69.5746C94.0018 74.0902 90.3412 77.7491 85.8273 77.7491Z"/>\n                                <path d="M18.676 78.4925C14.1604 78.4925 10.5016 74.8336 10.5016 70.318C10.5016 65.8042 14.1604 62.1454 18.676 62.1454C23.1916 62.1454 26.8504 65.8042 26.8504 70.318C26.8504 74.8336 23.1916 78.4925 18.676 78.4925Z"/>\n                                <path d="M25.9406 55.442H75.019C75.019 55.442 51.225 63.62 25.9406 55.442Z"/>\n                            </svg>                        \n                        </div>\n                        <div class="text">\n                            <ul class="pop-menu">\n                                <li>\n                                    <a href="javascript:__pop_up._save(\'file\')">\n                                        <span>[new file]</span>\n                                        <span>\n                                            <span class="__s-win">Alt + N</span>\n                                            <span class="__s-mac">⌥ + N</span>\n                                        </span>\n                                    </a>\n                                </li>\n                                <li>\n                                    <a href="javascript:__pop_up._open(\'file\')">\n                                        <span>[open file]</span>\n                                        <span>\n                                            <span class="__s-win">Alt + O</span>\n                                            <span class="__s-mac">⌥ + O</span>\n                                        </span>\n                                    </a>\n                                </li>\n                                <li>\n                                    <a href="javascript:__pop_up._open(\'folder\')">\n                                        <span>[open folder]</span>\n                                        <span>\n                                            <span class="__s-win">Alt + P</span>\n                                            <span class="__s-mac">⌥ + P</span>\n                                        </span>\n                                    </a>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n                </div>\n            '),t.parentElement.setAttribute("window-opened",WINDOW_EDITOR.current)},create_file=(e={name:"file.asm",route:"/",content:""},t=WINDOW_EDITOR.active)=>{let n=document.createElement("div"),l=document.createElement("div"),i={name:e.name,route:e.route,saved:!1,content:e.content,__fw:n,__f:l,file:e},o=WINDOW_EDITOR.windows[t];n.classList.add("active"),n.classList.add(`w-${t}-f-${WINDOW_EDITOR.files[`w${t}`].length}`),n.setAttribute("route",`~${e.route+e.name}`);let r=document.createElement("a");r.innerHTML=`[${e.name}]`,r.classList.add("filename"),r.addEventListener("click",(()=>{focus_file(t,i)}));let a=document.createElement("a");a.classList.add("muted"),a.innerHTML="x",a.addEventListener("click",(()=>{n.remove();let e=WINDOW_EDITOR.files[`w${t}`].indexOf(i);WINDOW_EDITOR.files[`w${t}`].splice(e,1),l.remove(),i.__fw.classList.contains("active")&&0!==WINDOW_EDITOR.files[`w${t}`].length&&(e>0?focus_file(t,WINDOW_EDITOR.files[`w${t}`][e-1]):0==e&&focus_file(t,WINDOW_EDITOR.files[`w${t}`][e]))})),n.appendChild(r),n.appendChild(a),o.querySelector(".file-queue").appendChild(n),l.classList.add(`f-${WINDOW_EDITOR.files[`w${t}`].length}`),l.classList.add("editor-file"),l.classList.add("active");let s=document.createElement("span");s.classList.add("line-numbers-rows"),s.classList.add("no-select");let c=document.createElement("span"),d=document.createElement("textarea");d.value=e.content,d.classList.add("textarea-main"),d.spellcheck=!1,d.outline="none",d.autocorrect="off",d.autocapitalize="off",d.setAttribute("aria-label","SpimHub"),d.tabindex=0,d.addEventListener("input",(()=>m(d,i,e))),d.addEventListener("mouseup",(()=>{_(d)})),d.addEventListener("scroll",(()=>{u.scrollTo(d.scrollLeft,d.scrollTop),s.scrollTo(d.scrollLeft,d.scrollTop)})),d.addEventListener("focusout",(()=>f(d))),d.addEventListener("keydown",(t=>{if("Tab"==t.key||9==t.keyCode||9==t.which){t.preventDefault();const n=d.selectionStart;d.value=d.value.substring(0,n)+" ".repeat(TAB_SIZE)+d.value.substring(d.selectionEnd),d.selectionStart=d.selectionEnd=n+TAB_SIZE,m(d,i,e)}"ArrowUp"!=t.key&&38!=t.keyCode&&38!=t.which||_(d,delay=-2),"ArrowDown"!=t.key&&40!=t.keyCode&&40!=t.which||_(d,delay=0)}));let u=document.createElement("pre");u.classList.add("export-code");let p=document.createElement("code");p.setAttribute("aria-hidden","true"),p.classList.add("language-mipsasm"),p.innerHTML="<p> </p>",s.appendChild(c),u.appendChild(p),l.appendChild(s),l.appendChild(d),l.appendChild(u),o.appendChild(l),focus_file(t,i),WINDOW_EDITOR.files[`w${t}`].push(i),__group_h.open_group("editor"),""!==e.content&&m(d)},focus_file=(e,t)=>{WINDOW_EDITOR.files[`w${e}`].forEach((e=>{[e.__fw,e.__f].forEach((e=>{e.classList.remove("active")}))})),[t.__fw,t.__f].forEach((e=>{e.classList.add("active")}))};let v=(e,t)=>{let n=[];return Object.values(WINDOW_EDITOR.files).forEach(((l,i)=>{l.find(((l,o)=>{l.route+l.name==e+t&&n.push({window:i,index:o,data:l})}))})),n},E=e=>{let t=[];return Object.values(WINDOW_EDITOR.files).forEach(((n,l)=>{n.find(((n,i)=>{n.route==e&&t.push({window:l,index:i,data:n})}))})),t};change_file=(e,t,n)=>{let l=v(e,t);l.length>0&&l.forEach((t=>{t.data.name=n,t.data.__fw.setAttribute("route",e+n),t.data.__fw.querySelector("a.filename").innerHTML=`[${n}]`}))},change_folder=(e,t)=>{let n=E(e);n.length>0&&n.forEach((e=>{e.data.route=t,e.data.__fw.setAttribute("route",t+e.data.name)}))},delete_file=(e,t)=>{let n=t?v(e,t):E(e);n.length>0&&n.forEach((e=>{e.data.__fw.remove(),e.data.__f.remove(),WINDOW_EDITOR.files[`w${e.window}`].splice(e.index,1)}))},open_file=e=>{let t=WINDOW_EDITOR.files[`w${WINDOW_EDITOR.active}`].find((t=>t.route+t.name==e.route+e.name));t?focus_file(WINDOW_EDITOR.active,t):create_file(e)},open_folder=e=>{Object.values(e.files).forEach((e=>{open_file(e)}))},check_file=(e,t=!0)=>{let n=e.split("/").pop();e=e.replace(n,"");let l=((FILE_SYSTEM[e]||{}).files||{})[n];if(l&&l.name==n)return t&&open_file(l),l;{let t=document.querySelector("section#warning");t.innerHTML=`<p>File [${e+n}] not found.</p>`,t.classList.add("active"),setTimeout((()=>{t.classList.remove("active")}),1e4)}return!1},check_folder=(e,t=!0)=>{let n=FILE_SYSTEM[e];if(n)return t&&open_folder(n),n;{let t=document.querySelector("section#warning");t.innerHTML=`<p>Folder [${e}] not found.</p>`,t.classList.add("active"),setTimeout((()=>{t.classList.remove("active")}),1e4)}return!1},WINDOW_EDITOR={parent:document.querySelector("#main-editor"),max:4,min:1,current:0,active:0,label:"Window",windows:[null,null,null,null],files:{w0:[],w1:[],w2:[],w3:[]}},__new_file=(e,t)=>{if(!e||!t||!FILE_SYSTEM[t])return!1;let n=document.querySelector("section#warning"),l=Object.values(FILE_SYSTEM[t].files).map((e=>e.name));if(!e.match(/^[a-zA-Z0-9_\-\.]+$/)||l.includes(e))return l.includes(e)?n.innerHTML=`<p>File "[${e}]" already exists.</p>`:n.innerHTML=`<p>Filename "[${e}]" is invalid.</p>`,n.classList.add("active"),setTimeout((()=>{n.classList.remove("active")}),1e4),!1;let i={name:e,route:t,content:"",saved:!0};return FILE_SYSTEM[t].files[e]=i,FILE_SYSTEM[t].active=!0,ROOT_DIR.clean_gui("/"),ROOT_DIR.get_dir_gui("/"),ROOT_DIR.focus_dir(t),create_file(i),!0},__new_folder=(e,t)=>{if(!e||!t)return!1;if(FILE_SYSTEM[t].folders.includes(e)){let t=document.querySelector("section#warning");return t.innerHTML=`<p>Folder "[${e}]" already exists.</p>`,t.classList.add("active"),setTimeout((()=>{t.classList.remove("active")}),1e4),!1}let n={name:`[${e}]`,files:{},folders:[],active:!0},l=`${t}${e}/`;return FILE_SYSTEM[t].folders.push(e),FILE_SYSTEM[t].active=!0,FILE_SYSTEM[l]=n,ROOT_DIR.clean_gui("/"),ROOT_DIR.get_dir_gui("/"),ROOT_DIR.focus_dir(l),!0},__rename_file=(e,t,n)=>{if(!e||!t||!n)return!1;let l=document.querySelector("section#warning"),i=Object.values(FILE_SYSTEM[t].files).map((e=>e.name));return!e.match(/^[a-zA-Z0-9_\-\.]+$/)||i.includes(e)?(i.includes(e)?l.innerHTML=`<p>File "[${e}]" already exists.</p>`:l.innerHTML=`<p>Filename "[${e}]" is invalid.</p>`,l.classList.add("active"),setTimeout((()=>{l.classList.remove("active")}),1e4),!1):(FILE_SYSTEM[t].files[e]=FILE_SYSTEM[t].files[n],delete FILE_SYSTEM[t].files[n],FILE_SYSTEM[t].files[e].name=e,ROOT_DIR.clean_gui("/"),ROOT_DIR.get_dir_gui("/"),ROOT_DIR.focus_dir(t),change_file(t,n,e),!0)},__rename_folder=(e,t)=>{let n=t.split("/").slice(0,-2).join("/")+"/",l=t.split("/").slice(-2)[0];if(!e||!t||!FILE_SYSTEM[n])return!1;if(FILE_SYSTEM[n].folders.includes(e)){let t=document.querySelector("section#warning");return t.innerHTML=`<p>Folder "[${e}]" already exists.</p>`,t.classList.add("active"),setTimeout((()=>{t.classList.remove("active")}),1e4),!1}let i=FILE_SYSTEM[n].folders.indexOf(l);FILE_SYSTEM[n].folders[i]=e;let o=`${n}${e}/`;return FILE_SYSTEM[o]=FILE_SYSTEM[t],delete FILE_SYSTEM[t],FILE_SYSTEM[o].name=`[${e}]`,ROOT_DIR.clean_gui("/"),ROOT_DIR.get_dir_gui("/"),ROOT_DIR.focus_dir(o),change_folder(t,o),!0},__delete_file=(e,t)=>(delete FILE_SYSTEM[e].files[t],ROOT_DIR.clean_gui("/"),ROOT_DIR.get_dir_gui("/"),delete_file(e,t),!0),__delete_folder=e=>{delete FILE_SYSTEM[e];let t=e.split("/").slice(0,-2).join("/")+"/",n=e.split("/").slice(-2)[0],l=FILE_SYSTEM[t].folders.indexOf(n);return delete FILE_SYSTEM[t].folders[l],ROOT_DIR.focus_dir(t),ROOT_DIR.clean_gui("/"),ROOT_DIR.get_dir_gui("/"),delete_file(e),!0};let g={el:document.querySelector("#main-files"),groups:{editor:document.querySelector("#main-editor"),runner:u.el,extensions:document.querySelector("#main-extensions")}};__group_h={open:()=>{Object.keys(g.groups).forEach((e=>{g.groups[e].classList.remove("active")}))},open_group:e=>{["editor","runner","extensions"].includes(e)&&(__group_h.open(),g.groups[e].classList.add("active"),__group_h.active=e)}};let h=document.querySelector("footer#extra-pop-up");__pop_up={open:()=>{h.classList.add("active"),document.querySelector("#clicker-changer").classList.add("active")},close:e=>{e.target.classList.remove("active"),h.classList.remove("active"),document.getElementById("warning").classList.remove("active");for(let e of h.children)e.classList.remove("active")}},__pop_up._save=e=>{["file","folder"].includes(e)&&(__pop_up.open(),h.querySelector(`.create-${e}`).classList.add("active"),h.querySelector(`.create-${e} input`).focus())},__pop_up._open=e=>{["file","folder"].includes(e)&&(__pop_up.open(),h.querySelector(`.open-${e}`).classList.add("active"),h.querySelector(`.open-${e} input`).focus())},__pop_up._rename=(e,t,n)=>{["file","folder"].includes(e)&&(__pop_up.open(),h.querySelector(`.rename-${e}`).classList.add("active"),h.querySelector(`.rename-${e}`).setAttribute("route",t),"file"==e&&h.querySelector(`.rename-${e}`).setAttribute("file",n),h.querySelector(`.rename-${e} input`).focus())},__pop_up._new_project=(e=!1)=>{e||(__pop_up.open(),h.querySelector(".new-project").classList.add("active"))},__pop_up._delete=(e,t,n,l)=>{__pop_up.open();let i=h.querySelector(".delete-item");i.classList.add("active"),i.setAttribute("route",n),i.setAttribute("file",l),i.setAttribute("type",e),h.querySelector(".delete-item .item-name").innerHTML=t};let L=(e,t)=>{13==e.keyCode||"Enter"==e.key?(e.preventDefault(),t()):document.getElementById("warning").classList.remove("active")},S={file:{el:h.querySelector('a[action="new-file"]'),input:h.querySelector(".create-file input"),create:()=>{let e=S.file.input.value+".asm";""!=e&&__new_file(e,ROOT_DIR.cd||"/")&&(S.file.input.value="",__pop_up.close({target:document.querySelector("#clicker-changer")}))}},folder:{el:h.querySelector('a[action="new-folder"]'),input:h.querySelector(".create-folder input"),create:()=>{let e=S.folder.input.value;""!=e&&__new_folder(e,ROOT_DIR.cd||"/")&&(S.folder.input.value="",__pop_up.close({target:document.querySelector("#clicker-changer")}))}}};S.file.el.addEventListener("click",S.file.create),S.file.input.addEventListener("keydown",(e=>L(e,S.file.create))),S.folder.el.addEventListener("click",S.folder.create),S.folder.input.addEventListener("keydown",(e=>L(e,S.folder.create)));let w={file:{el:h.querySelector('a[action="rename-file"]'),input:h.querySelector(".rename-file input"),parent:h.querySelector(".rename-file")},folder:{el:h.querySelector('a[action="rename-folder"]'),input:h.querySelector(".rename-folder input"),parent:h.querySelector(".rename-folder")}};w.folder.rename=()=>{let e=w.folder.input.value,t=w.folder.parent.getAttribute("route");""!=e&&__rename_folder(e,t)&&(w.folder.input.value="",__pop_up.close({target:document.querySelector("#clicker-changer")}))},w.file.rename=()=>{let e=w.file.input.value,t=w.file.parent.getAttribute("route"),n=w.file.parent.getAttribute("file");""!=e&&(e+=".asm",__rename_file(e,t,n)&&(w.file.input.value="",__pop_up.close({target:document.querySelector("#clicker-changer")})))},w.file.el.addEventListener("click",w.file.rename),w.file.input.addEventListener("keydown",(e=>L(e,w.file.rename))),w.folder.el.addEventListener("click",w.folder.rename),w.folder.input.addEventListener("keydown",(e=>L(e,w.folder.rename)));let O={file:{el:h.querySelector('a[action="open-file"]'),input:h.querySelector(".open-file input"),open:()=>{let e=O.file.input.value;""!=e&&("/"!=e[0]&&(e="/"+e),".asm"!=e.slice(-4)&&(e+=".asm"),check_file(e)&&(O.file.input.value="",__pop_up.close({target:document.querySelector("#clicker-changer")})))}},folder:{el:h.querySelector('a[action="open-folder"]'),input:h.querySelector(".open-folder input"),open:()=>{let e=O.folder.input.value;""!=e&&("/"!=e[0]&&(e="/"+e),"/"!=e[e.length-1]&&(e+="/"),check_folder(e)&&(O.folder.input.value="",__pop_up.close({target:document.querySelector("#clicker-changer")})))}}};O.file.el.addEventListener("click",O.file.open),O.file.input.addEventListener("keydown",(e=>L(e,O.file.open))),O.folder.el.addEventListener("click",O.folder.open),O.folder.input.addEventListener("keydown",(e=>L(e,O.folder.open)));h.querySelector('a[action="delete-item"]').addEventListener("click",(()=>{let e=h.querySelector(".delete-item"),t=e.getAttribute("route"),n=e.getAttribute("file");("file"===e.getAttribute("type")?__delete_file(t,n):__delete_folder(t))&&__pop_up.close({target:document.querySelector("#clicker-changer")})}));let I={el:document.querySelector("#register-section"),header:document.querySelector("#register-section header"),tabs:{register:document.querySelector("#register-section .tab.register"),coproc1:document.querySelector("#register-section .tab.coproc1"),coproc0:document.querySelector("#register-section .tab.coproc0")}};I.windows={register:I.el.querySelector(".runner-register"),coproc1:I.el.querySelector(".runner-coproc1"),coproc0:I.el.querySelector(".runner-coproc0")},__group_register={open:()=>{Object.keys(I.tabs).forEach((e=>{I.tabs[e].classList.remove("active"),I.windows[e].classList.remove("active")}))},open_tab:e=>{["register","coproc1","coproc0"].includes(e)&&(__group_register.open(),I.tabs[e].classList.add("active"),I.windows[e].classList.add("active"))}},document.addEventListener("click",(e=>{l(e),o(e)})),document.querySelector("#clicker-changer").addEventListener("click",__pop_up.close),ROOT_DIR.get_dir_gui("/"),create_window(!1)}));