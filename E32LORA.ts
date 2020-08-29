
/**
 * E32LORA block
 */
//% weight=100 color=#00cc00 icon="\uf012" block="E32LORA"
namespace E32LORA {

//    const E32LORA_I2C_ADDR=0x68


    function E32LORA_init() {
    }

    let pinM0: DigitalPin
    let pinM1: DigitalPin
    let pinAUX: DigitalPin

    /**
     * E32 Pin Config class
     */
    export class E32PinConfig {
        m0: DigitalPin;
        m1: DigitalPin;
        aux: DigitalPin;
        tx: SerialPin;
        rx: SerialPin;
        baud: BaudRate;
    }

    let e32Pins = new E32PinConfig();

    E32LORA_init()
//    setStatus(0x08)





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
     * e32Init
     */
    //% weight=44
    //% block="E32LORA pin config:|M0: %m0 M1: %m1 AUX: %aux|TX: %tx RX: %rx BAUD: %baud"
    //% m0.defl=DigitalPin.P16 m1.defl=DigitalPin.P12 aux.defl=DigitalPin.P1 tx.defl=SerialPin.P2 rx.defl=SerialPin.P8 baud.defl=BaudRate.BaudRate9600
      export function e32Init(m0: DigitalPin, m1: DigitalPin, aux: DigitalPin, tx: SerialPin, rx: SerialPin, baud: BaudRate) {
          pinM0 = m0
          pinM1 = m1
          pinAUX = aux
          serial.redirect(tx, rx, baud)

          e32Pins.m0 = m0;
          e32Pins.m1 = m1;
          e32Pins.aux= aux;

          e32Pins.tx= tx;
          e32Pins.rx= rx;
          e32Pins.baud = baud;
    }


    /**
     * setSetupMode
     */
    //% block
    //% weight=42
    export function setSetupMode () {
        pins.digitalWritePin(pinM0, 1)
        pins.digitalWritePin(pinM1, 1)
    }

    /**
     * setNormalMode
     */
    //% block
    //% weight=40
    export function setNormalMode () {
        pins.digitalWritePin(pinM0, 0)
        pins.digitalWritePin(pinM1, 0)
    }

    /**
     * auxPin
     */
    //% block
    //% weight=38
    export function auxPin () {
        return pins.digitalReadPin(pinAUX)
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