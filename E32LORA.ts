
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
     * e32Init
     */
    //% block
    //% weight=38
    //% blockId="E32LORA_init" block="M0 %m0|M1 %m1|TX %tx|RX %rx"
      export function e32Init(m0: DigitalPin, m1: DigitalPin, tx: SerialPin, rx: SerialPin, baud: BaudRate) {

         serial.redirect(tx, rx, baud)

// //        pins.digitalWritePin(rx, 0)
//         pins.digitalWritePin(tx, 0);
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
    export function setSetupMode (m0: DigitalPin, m1: DigitalPin) {
        pins.digitalWritePin(m0, 1)
        pins.digitalWritePin(m1, 1)
    }


    /**
     * setNormalMode
     */
    //% block
    //% weight=42
    export function setNormalMode (m0: DigitalPin, m1: DigitalPin) {
        pins.digitalWritePin(m0, 0)
        pins.digitalWritePin(m1, 0)
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