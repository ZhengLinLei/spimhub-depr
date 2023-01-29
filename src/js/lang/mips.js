const __mipsasm_scope = () => {
    return {
        meta : [
            '.2byte',   '.4byte',  '.align',   '.ascii',
            '.asciiz',   '.balign', '.byte',    '.code',
            '.data',    '.else',   '.end',     '.endif',
            '.endm',    '.endr',   '.equ',     '.err',
            '.exitm',   '.extern', '.global',  '.globl',
            '.hword',   '.if',     '.ifdef',   '.ifndef',
            '.include', '.irp',    '.long',    '.macro',
            '.rept',    '.req',    '.section', '.set',
            '.skip',    '.space',  '.text',    '.word',
            '.ltorg'
        ],
        builtin : [
            '$31',  '$30',  '$29',  '$28',  '$27',  '$26',  '$25',  '$24',
            '$23',  '$22',  '$21',  '$20',  '$19',  '$18',  '$17',  '$16',
            '$15',  '$14',  '$13',  '$12',  '$11',  '$10',  '$9',   '$8',
            '$7',   '$6',   '$5',   '$4',   '$3',   '$2',   '$1',   '$0',
            
            '$zero','$at',  '$v0',  '$v1',  '$a0',  '$a1',  '$a2',  '$a3',
            '$a4',  '$a5',  '$a6',  '$a7',  '$t0',  '$t1',  '$t2',  '$t3',
            '$t4',  '$t5',  '$t6',  '$t7',  '$t8',  '$t9',  '$s0',  '$s1',
            '$s2',  '$s3',  '$s4',  '$s5',  '$s6',  '$s7',  '$s8',  '$k0',
            '$k1',  '$gp',  '$sp',  '$fp',  '$ra',  

            '$f31', '$f30', '$f29', '$f28', '$f27', '$f26', '$f25', '$f24',
            '$f23', '$f22', '$f21', '$f20', '$f19', '$f18', '$f17', '$f16',
            '$f15', '$f14', '$f13', '$f12', '$f11', '$f10', '$f9',  '$f8',
            '$f7',  '$f6',  '$f5',  '$f4',  '$f3',  '$f2',  '$f2',  '$f1',
            '$f0',

            // 'zero', 'at',   'v0',   'v1',   'a0',   'a1',   'a2',   'a3',
            // 'a4',   'a5',   'a6',   'a7',   't0',   't1',   't2',   't3',
            // 't4',   't5',   't6',   't7',   't8',   't9',   's0',   's1',
            // 's2',   's3',   's4',   's5',   's6',   's7',   's8',   'k0',
            // 'k1',   'gp',   'sp',   'fp',   'ra',
            
            'Context',  'Random',   'EntryLo0',
            'EntryLo1', 'Context',  'PageMask', 'Wired',
            'EntryHi',  'HWREna',   'BadVAddr', 'Count',
            'Compare',  'SR',       'IntCtl',   'SRSCtl',
            'SRSMap',   'Cause',    'EPC',      'PRId',
            'EBase',    'Config',   'Config1',  'Config2',
            'Config3',  'LLAddr',   'Debug',    'DEPC',
            'DESAVE',   'CacheErr', 'ECC',      'ErrorEPC',
            'TagLo',    'DataLo',   'TagHi',    'DataHi',
            'WatchLo',  'WatchHi',  'PerfCtl',  'PerfCnt'
        ],  
        keywords : /^\b(addi?u?|andi|b[al]?|beql?|bgez(al)?l?|bgtzl?|blezl?|bltz(al)?l?|bnel?|cl[oz]|divu?|ext|ins|j(al)?|jalr(\\.hb)?|jr(\\.hb)?|lbu?|lhu?|ll|lui|lw[lr]?|maddu?|l[ai]|mfhi|mflo|movn|movz|move|msubu?|mthi|mtlo|mul|multu?|nop|nor|ori?|rotrv?|sb|sc|se[bh]|sh|sllv?|slti?u?|srav?|srlv?|subu?|sw[lr]?|xori?|wsbh|abs\\.[sd]|add\\.[sd]|alnv.ps|bc1[ft]l?|c\\.(s?f|un|u?eq|[ou]lt|[ou]le|ngle?|seq|l[et]|ng[et])\\.[sd]|(ceil|floor|round|trunc)\\.[lw]\\.[sd]|cfc1|cvt\\.d\\.[lsw]|cvt\\.l\\.[dsw]|cvt\\.ps\\.s|cvt\\.s\\.[dlw]|cvt\\.s\\.p[lu]|cvt\\.w\\.[dls]|div\\.[ds]|ldx?c1|luxc1|lwx?c1|madd\\.[sd]|mfc1|mov[fntz]?\\.[ds]|msub\\.[sd]|mth?c1|mul\\.[ds]|neg\\.[ds]|nmadd\\.[ds]|nmsub\\.[ds]|p[lu][lu]\\.ps|recip\\.fmt|r?sqrt\\.[ds]|sdx?c1|sub\\.[ds]|suxc1|swx?c1|break|cache|d?eret|[de]i|ehb|mfc0|mtc0|pause|prefx?|rdhwr|rdpgpr|sdbbp|ssnop|synci?|syscall|teqi?|tgei?u?|tlb(p|r|w[ir])|tlti?u?|tnei?|wait|wrpgpr)$/g,
        comments : /(#|;).*/,
        contains : {
            regexDynamic: {
                number : /\b(?:\b[2-9]_\d+|(?:\b\d+(?:\.\d+)?|\B\.\d+)(?:e-?\d+)?|\b0(?:[fd]_|x|b|o)[0-9a-f]+|&[0-9a-f]+)\b/g,
                string : /"(?:[^"\r\n]|"")*"/g,
                char : /'(?:[^'\r\n]{0,4}|'')'/g,
            },
            regexStatic: {
                punctuation : /[\(\)\,\:]/g,
                operator : /[\+\-\*]/g,
            }
        }
    };
}
// \b(?<!\$)(?:\b[2-9]_\d+|(?:\b\d+(?:\.\d+)?|\B\.\d+)(?:e-?\d+)?|\b0(?:[fd]_|x|b|o)[0-9a-f]+|&[0-9a-f]+)\b ---> Doesn't work in safari
// Solution:
//      
//      -- 1 --
//      Match the register first
//      
//      -- 2 --
//      Match the number
//      (?:\b\d+(?:\.\d+)?|\B\.\d+)(?:e-?\d+)?
//      \b\d+(?:\.\d+)?
//      \B\.\d+
//      (?:e-?\d+)?
//      
//      -- Output --
//      <span class="__f_builtin">$f<span class="__f_numbers">0</span></span>
//
//      -- 3 --
//      Change css to make the register !important
//      .__f_builtin, .__f_builtin * {
//          color: #000 !important; 
//      }       