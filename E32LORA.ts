    enum Power {
        //% block="20dBm (100mW)"
        p20dBm = "0",
        //% block="17dBm (50mW)"
        p17dBm = "1",
        //% block="14dBm (25mW)"
        p14dBm = "2",
        //% block="10dBm (10mW)"
        p10dBm = "3"
    }

/*
    const enum UartBoud {
        //% block="1.2K"
        BaudRate1200 = "0",
        //% block="2.4K"
        BaudRate2400 = "1",
        //% block="4.8K"
        BaudRate4800 = "2",
        //% block="9.6K"
        BaudRate9600 = "3",
        //% block="19.2K"
        BaudRate19200 = "4",
        //% block="38.4K"
        BaudRate38400 = "5",
        //% block="57.6K"
        BaudRate57600 = "6",
        //% block="115.2K"
        BaudRate115200 = "7"
    }

    const enum AirBoud {
        //% block="0.3K"
        BaudRate300 = "0",
        //% block="1.2K"
        BaudRate1200 = "1",
        //% block="2.4K"
        BaudRate2400 = "2",
        //% block="4.8K"
        BaudRate4800 = "3",
        //% block="9.6K"
        BaudRate9600 = "4",
        //% block="19.2K"
        BaudRate19200 = "5"
    }
*/



/**
 * E32LORA block
 */
//% weight=100 color=#00cc00 icon="\uf012" block="E32LORA"
namespace E32LORA {

//    const E32LORA_I2C_ADDR=0x68


    function E32LORA_init() {
    }

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
    let initialized = false;

    function init() {
        if (initialized) return;
        initialized = true;
//        onDataReceived(handleDataReceived);
    }


    E32LORA_init()
//    setStatus(0x08)

    let onReceivedStringHandler: (receivedString: string) => void;

    serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
        let str: string = serial.readString()
        onReceivedStringHandler(str)
    //    basic.showIcon(IconNames.Heart)
    //    OLED.writeStringNewLine(serial.readString())
    //    basic.showIcon(IconNames.Yes)
    })



    /**
     * decToHexString
     *
     * https://stackoverflow.com/questions/50967455/from-decimal-to-hexadecimal-without-tostring
     */
    function decToHexString(int: number, base: number): string {
//        let letters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        let letters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
        let returnVal = "";
        if (base > 1 && base < 37) {
            while (int != 0) {
                let rest = int % base;
                int = Math.floor(int / base);
                returnVal = letters[rest] + returnVal;
            }
        }
        if (returnVal == "") {
            returnVal = "0"
        }
        if (returnVal.length == 1) {
            returnVal = "0" + returnVal
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
     * e32configNoSave
     */
    //% weight=46
    //% block="E32LORA module config: | ADDR: %addr CHANNEL: %channel FIXED: %fixed POWER: %pwr"
    //% addr.defl="0000" channel.min=0 channel.max=31 channel.defl=15 fixed.defl=false pwr.defl=Power.p20dBm
    export function e32configNoSave(addr: string, channel: number, fixed: boolean, pwr: Power): string {

//        let _uartbaud: NumberFormat.UInt8LE = parseInt(ubaud);
//        let _airbaud: NumberFormat.UInt8LE = parseInt(airbaud);
//        let byte3: NumberFormat.UInt8LE = ((_uartbaud << 3) + _airbaud) & 0x3f;
//        let byte3String: string = decToHexString(byte3, 16);

        let byte4String: string = decToHexString(channel & 0x1f, 16);

        let _power: NumberFormat.UInt8LE = parseInt(pwr);
        let byte5: NumberFormat.UInt8LE;
/*
        if(fixed == true) {
            byte5 = 0xc4 + _power;
        }
        else {
            byte5 = 0x44 + _power;
        }
*/
       byte5 = 0x44;
       let byte5String  = decToHexString(byte5, 16);

        let cmdBuffer=Buffer.fromHex("c2" + addr + "1a" + byte4String + byte5String)
        return buffer2string(cmdBuffer);
    }



    function buffer2string(buf: Buffer): string {
        let str: string = "";
        let recArray=buf.toArray(NumberFormat.UInt8LE)
        for (let idx = 0; idx <= recArray.length - 1; idx++) {
            str = str + (decToHexString(recArray[idx], 16) + " ")
        }
      return str;
    }


    /**
     * e32Init
     */
    //% weight=44
    //% block="E32LORA pin config:|M0: %m0 M1: %m1 AUX: %aux|TX: %tx RX: %rx BAUD: %baud"
    //% m0.defl=DigitalPin.P16 m1.defl=DigitalPin.P12 aux.defl=DigitalPin.P1 tx.defl=SerialPin.P2 rx.defl=SerialPin.P8 baud.defl=BaudRate.BaudRate9600
      export function e32Init(m0: DigitalPin, m1: DigitalPin, aux: DigitalPin, tx: SerialPin, rx: SerialPin, baud: BaudRate) {

          serial.redirect(rx, tx, baud)

          e32Pins.m0 = m0;
          e32Pins.m1 = m1;
          e32Pins.aux= aux;
          e32Pins.tx= tx;
          e32Pins.rx= rx;
          e32Pins.baud = baud;
    }



    /**
     * Registers code to run when the radio receives a string.
     */
    //% help=radio/on-received-string
    //% block="on e32radio received" blockGap=16
    //% useLoc="E32LORA.onDataPacketReceived" draggableParameters=reporter
    export function onReceivedString(cb: (receivedString: string) => void) {
        init();
        onReceivedStringHandler = cb;
    }



    /**
     * e32SendString
     */
    //% block
    //% weight=50
    export function e32SendString (str: string) {
      serial.writeLine(str)
    }

    /**
     * setSetupMode
     */
    //% block
    //% weight=42
    export function setSetupMode () {
        pins.digitalWritePin(e32Pins.m0, 1)
        pins.digitalWritePin(e32Pins.m1, 1)
        e32auxTimeout(100)
    }

    /**
     * setNormalMode
     */
    //% block
    //% weight=40
    export function setNormalMode () {
        pins.digitalWritePin(e32Pins.m0, 0)
        pins.digitalWritePin(e32Pins.m1, 0)
        e32auxTimeout(100)
    }

    /**
     * auxPin
     */
    //% block
    //% weight=38
    export function auxPin () {
        return pins.digitalReadPin(e32Pins.aux)
    }

    /**
     * e32version
     */
    //% block
    //% weight=36
    export function e32version (): string {
      let rcvData: Buffer = null
      let params = ""

      setSetupMode()
//      basic.showNumber(pins.digitalReadPin(DigitalPin.P1))
      let dataToSend2=Buffer.fromHex("c3c3c3")
      serial.writeBuffer(dataToSend2)
      rcvData = serial.readBuffer(4)

      let recArray=rcvData.toArray(NumberFormat.UInt8LE)
      for (let idx = 0; idx <= recArray.length - 1; idx++) {
          params = "" + params + ("" + decToHexString(recArray[idx], 16) + " ")
      }
      setNormalMode()
      return params
    }

    /**
     * e32parameters
     */
    //% block
    //% weight=34
    export function e32parameters () {
      let rcvData: Buffer = null
      let params = ""

      setSetupMode()
//      basic.showNumber(pins.digitalReadPin(DigitalPin.P1))
      let dataToSend=Buffer.fromHex("c1c1c1")
      serial.writeBuffer(dataToSend)
      rcvData = serial.readBuffer(6)
      let recArray=rcvData.toArray(NumberFormat.UInt8LE)
      for (let idx = 0; idx <= recArray.length - 1; idx++) {
          params = "" + params + ("" + decToHexString(recArray[idx], 16) + " ")
      }
      setNormalMode()
      return params
    }


    /**
     * e32reset
     */
    //% block
    //% weight=34
    export function e32reset () {
      setSetupMode()
      let dataToSend=Buffer.fromHex("c4c4c4")
      serial.writeBuffer(dataToSend)
      setNormalMode()
      e32auxTimeout(100)
    }



// ==========================================================================
// Internal Functions
// ==========================================================================


    /**
     * e32auxTimeout
     */
    function e32auxTimeout(value: number) {
      basic.pause(value)
      if(auxPin() == 0){
        basic.showIcon(IconNames.Angry)
        basic.showString("e: aux timeout")
      }
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