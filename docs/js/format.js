class Format{static capitalize(t){return t.charAt(0).toUpperCase()+t.slice(1)}static capitalizeAll(t){return t.split(" ").map((t=>this.capitalize(t))).join(" ")}constructor(t){if(null==t||t==={})return console.error("Please enter specific language scope regex"),!1;this._data=t}get data(){return this._data}set data(t){this._data=t}DestroyCode(t){return t.map((t=>t.map((()=>null))))}JoinCode(t){return t.map((t=>`<p>${t||" "}</p>`)).join("\n")}RNFC(t,e){let a=this._data.contains.regexDynamic.number,s=this._data.builtin;return t.forEach(((e,r)=>{e.forEach(((e,n)=>{let i=e.split(",");i=i.map((t=>{let e=[];return s.forEach((a=>{t.includes(a)&&e.push(a)})),[...new Set(e)].sort().reverse().forEach((e=>{t=t.replaceAll(e,`<span class=__f_builtin>${e}</span>`)})),e=t.match(a),[...new Set(e)].sort().reverse().forEach((e=>{t=t.replaceAll(e,`<span class=__f_numbers>${e}</span>`)})),t})),t[r][n]=i.join(",")}))})),t}BFC(t,e){let a={__f_meta:this._data.meta,__f_keywords:this._data.keywords,__f_builtin:this._data.builtin};return Object.keys(a).forEach((s=>{t.forEach(((t,r)=>{t.forEach(((t,n)=>{if(null===e[r][n]){let i=null;if("__f_meta"===s)a[s].includes(t)&&(i=`<span class=__f_meta>${t}</span>`);else if("__f_keywords"===s)a[s].test(t)&&(i=`<span class=__f_keywords>${t}</span>`);else if("__f_builtin"===s){i=t;let e=[];a.__f_builtin.forEach((a=>{t.includes(a)&&e.push(a)})),e=[...new Set(e)].sort().reverse(),e.forEach((t=>{i=i.replaceAll(t,`<span class=__f_builtin>${t}</span>`)}))}e[r][n]=i}}))}))})),e}AFC(t,e){let a={__f_strings:this._data.contains.regexDynamic.string,__f_chars:this._data.contains.regexDynamic.char,__f_punctuation:this._data.contains.regexStatic.punctuation,__f_operators:this._data.contains.regexStatic.operator};return e=e.map((t=>{let e=[];return Object.keys(a).forEach((s=>{let r=t.match(a[s]);r&&r.forEach((t=>{e.push({match:t,key:s})}))})),e=e.filter(((t,e,a)=>a.findIndex((e=>e.match===t.match))===e)),e.length>0&&e.forEach((e=>{t=t.replaceAll(e.match,`<span class=${e.key}>${e.match}</span>`)})),t}))}FC(t,e){return e.map((t=>t.join(" "))).map((t=>{let e=t.match(this._data.comments);if(null!==e){let a=t.indexOf(e[0]),s=`<span class=__f_comment>${t.slice(a)}</span>`;return t.slice(0,a)+s}return t}))}NullCopyCode(t,e){return t.forEach(((t,a)=>{t.forEach(((t,s)=>{null===e[a][s]&&(e[a][s]=t)}))})),e}formateCode(t){let e=t.map((t=>t.split(" "))),a=this.DestroyCode(e);return e=this.RNFC(e,a),a=this.BFC(e,a),a=this.NullCopyCode(e,a),a=this.FC(e,a),a=this.AFC(e,a),a=this.JoinCode(a),a}}