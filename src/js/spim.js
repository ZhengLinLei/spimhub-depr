/* =========================================================================
    SpimHub - A MIPS Assembly IDE for Web Browsers

    Zheng Lin Lei



    This file is part of SpimHub.

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


// Path: src/js/spim.js


// SPIM class
class SPIM {

    // Internal Variables
    _instance = {
        // Registers
        registers: {
            // General Purpose Registers
            $0:  0, $1:  0, $2:  0, $3:  0, $4:  0, $5:  0, $6:  0, $7:  0, $8:  0,
            $9:  0, $10: 0, $11: 0, $12: 0, $13: 0, $14: 0, $15: 0, $16: 0,
            $17: 0, $18: 0, $19: 0, $20: 0, $21: 0, $22: 0, $23: 0, $24: 0,
            $25: 0, $26: 0, $27: 0, $28: 0, $29: 0, $30: 0, $31: 0,

            // Floating Point Registers
            $f0:  0, $f1:  0, $f2:  0, $f3:  0, $f4:  0, $f5:  0, $f6:  0, $f7:  0, $f8:  0,
            $f9:  0, $f10: 0, $f11: 0, $f12: 0, $f13: 0, $f14: 0, $f15: 0, $f16: 0,
            $f17: 0, $f18: 0, $f19: 0, $f20: 0, $f21: 0, $f22: 0, $f23: 0, $f24: 0,
            $f25: 0, $f26: 0, $f27: 0, $f28: 0, $f29: 0, $f30: 0, $f31: 0,

            // Control Registers
            $pc: 0,
            $hi: 0,
            $lo: 0,
            $ir: 0,
            $psr: 0,
            $cause: 0,
            $epc: 0,
            $badvaddr: 0,
        },
        
        // Memory
        memory: {
            // Data Memory
            data: {
                // Data
            },
            // Text Memory
            text: {
                // Text
            }
        }
    }

    /**
     * @desc: Constructor; creates a new SPIM instance
     * @param: data {:string}- The assembly code to be run
     * @return: {:void}
    */
    constructor(data) {

        this.predata = data;
        // Parse the assembly code
        this._data ||= this.data ||= this.parse(data);
    }


    // Getters and Setters
    /**
        * @desc: Gets the assembly code
        * @return: data {:string}- The assembly code to be run
    */
    get data() {
        return this._data;
    }

    /**
         * @desc: Sets the assembly code
         * @param: data {:string}- The assembly code to be run
         * @return: {:void}
         * @note: This will also parse the assembly code
         * @note: This will also reset the SPIM instance
    */
    set data(data) {
        // Parse the assembly code
        this._data ||= this.data ||= this.parse(data);
        this.reset();
    }

    // Internal Methods
    /**
        * @desc: Parses the assembly code
        * @param: data {:string}- The assembly code to be run
        * @return: data {:string}- The parsed assembly code
    */
    parse(data) {

        // Remove all comments
        data = data.replace(/(#|\/\/).*/g, "");

        // Split into lines
        data = data.split("\n");

        // Remove all empty lines
        data = data.filter((line) => line.trim() != "");

        // Return parsed data
        return data;
    }




    // Public Methods
    /**
         * @desc: Runs the assembly code
         * @return: {:void} 
    */
    run() {
        // Run all
    }


    /**
         * @desc: Resets the SPIM instance
         * @return: {:void}
         * @note: This will also reset the SPIM instance
    */
    reset() {
        // Reset all
    }
}
