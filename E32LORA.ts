
/**
 * E32LORA block
 */
//% weight=100 color=#00cc00 icon="\uf012" block="E32LORA"
namespace E32LORA {

//    const E32LORA_I2C_ADDR=0x68


    function E32LORA_init() {
    }

    E32LORA_init()
//    setStatus(0x08)


    /**
     * E32LORA class
     */
    export class E32LORA_WRL {
        clk: DigitalPin;
        dio: DigitalPin;
        cs: DigitalPin;

        /**
         * create a E32LORA_WRL object.
         * @param clk the CLK pin for E32LORA, eg: DigitalPin.P13
         * @param dio the DIO pin for E32LORA, eg: DigitalPin.P14
         * @param cs the CS pin for E32LORA, eg: DigitalPin.P15
         */
        //% weight=200 blockGap=8
        //% blockId="E32LORA_create" block="CLK %clk|DIO %dio|CS %cs"
        export function create(clk: DigitalPin, dio: DigitalPin, cs: DigitalPin): E32LORA_WRL {
            let ds = new E32LORA_WRL();
            ds.clk = clk;
            ds.dio = dio;
            ds.cs = cs;
            pins.digitalWritePin(ds.clk, 0);
            pins.digitalWritePin(ds.cs, 0);
            return ds;
        }


    }




    /**
     * decToHexString
     *
     * https://stackoverflow.com/questions/50967455/from-decimal-to-hexadecimal-without-tostring
     */
    function decToHexString(int: number, base: number): string {
        let letters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        let returnVal = "";
        if (base > 1 && base < 37) {
            while (int != 0) {
                let rest = int % base;
                int = Math.floor(int / base);
                returnVal = letters[rest] + returnVal;
            }
        }
        return returnVal;
    }

    function decToBcd(value: number): number {
        return (Math.floor(value / 10) << 4) + (value % 10)
    }

    function bcdToDec(value: number): number {
        return Math.floor(value / 16) * 10 + (value % 16)
    }


// ==========================================================================
// Export Functions.
// ==========================================================================



    /**
     * setSetupMode
     */
    //% block
    //% weight=40
    export function setSetupMode () {
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }


    /**
     * setNormalMode
     */
    //% block
    //% weight=42
    export function setNormalMode () {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.digitalWritePin(DigitalPin.P16, 0)
    }


// ==========================================================================
// Advanced Export Functions
// ==========================================================================



    /**
     * hexString
     */
    //% block
    //% weight=20
    export function hexString(value: number): string {
        return decToHexString(value, 16)
    }

    /**
     * binaryString
     */
    //% block
    //% weight=19
    export function binaryString(value: number): string {
        return decToHexString(value, 2)
    }

    /**
     * decimalString
     */
    //% block
    //% weight=18
    export function decimalString(value: number): string {
        return decToHexString(value, 10)
    }

}