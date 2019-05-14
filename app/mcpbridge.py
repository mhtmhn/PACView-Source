"""
This module exposes the MCP2221A I2C bridge via its USB HID interface

Based on PyMCP2221A:
The MIT License (MIT) Copyright (c) 2017 Yuta Kitagami (kitagami@artifactnoise.com,@nonnoise)
https://github.com/nonNoise/PyMCP2221A
"""


try:
    import hid
except ImportError:
    print("This module requires hidapi.")
    print("pip install hidapi")
    quit()


class NoDeviceError(IOError):
    """Raised when no MCP2221A device is found"""
    pass


class LineLowError(IOError):
    """Raised when an I2C line is held low"""
    pass


class RWError(IOError):
    """Raised when a Read/Write error occurs"""
    pass


class MCP2221A:
    def __init__(self):
        self.mcp2221a = hid.device()

    def connect(self, vid=0x04D8, pid=0x00DD, devnum=0):
        """Connects to the HID device

        Keyword Arguments:
            vid {hexadecimal} -- USB VID (default: {0x04D8})
            pid {hexadecimal} -- USB PID (default: {0x00DD})
            devnum {int} -- Device path index (default: {0})

        Raises:
            NoDeviceError: Raised when no MCP2221A device is found
        """
        self.device = hid.enumerate(vid, pid)
        if self.device:
            self.mcp2221a.open_path(self.device[devnum]["path"])
        else:
            raise NoDeviceError("No MCP2221A devices found")

    def device_driver_info(self):
        print("Manufacturer: %s" % self.mcp2221a.get_manufacturer_string())
        print("Product: %s" % self.mcp2221a.get_product_string())
        print("Serial No: %s" % self.mcp2221a.get_serial_number_string())

    def command_structure(self, i2c_cancel_bit, i2c_speed_set_up_bit, i2c_speed_set_value_byte):
        i2c_cancel_bit = 0
        i2c_speed_set_up_bit = 0
        i2c_speed_set_value_byte = 0
        buf = [0x00, 0x10, 0x00, i2c_cancel_bit << 4,
               i2c_speed_set_up_bit << 5, i2c_speed_set_value_byte]
        buf = buf + [0 for i in range(65 - len(buf))]
        try:
            self.mcp2221a.write(buf)
            buf = self.mcp2221a.read(65)
        except OSError:
            raise RWError("R/W Failed!")

        print(chr(buf[46]))
        print(chr(buf[47]))
        print(chr(buf[48]))
        print(chr(buf[49]))

    def i2c_init(self, speed=100000):
        """Initialises I2C communication

        Keyword Arguments:
            speed {int} -- I2C bus speed in kHz (default: {100000})

        Raises:
            RWError: Raised when a Read/Write error occurs
            LineLowError: Raised when an I2C line is held low
            LineLowError: Raised when an I2C line is held low
        """
        buf = [0x00, 0x10]
        buf = buf + [0 for i in range(65 - len(buf))]
        buf[2 + 1] = 0x00  # Cancel current I2C/SMBus transfer (sub-command)
        buf[3 + 1] = 0x20  # Set I2C/SMBus communication speed (sub-command)
        # The I2C/SMBus system clock divider that will be used to establish the communication speed
        buf[4 + 1] = int((12000000 / speed) - 3)
        try:
            self.mcp2221a.write(buf)
            rbuf = self.mcp2221a.read(65)
        except OSError:
            raise RWError("R/W Failed!")
        if(rbuf[22] == 0):
            raise LineLowError("SCL is low")
        if(rbuf[23] == 0):
            raise LineLowError("SDA is low")

    def i2c_state_check(self):
        buf = [0x00, 0x10]
        buf = buf + [0 for i in range(65 - len(buf))]
        try:
            self.mcp2221a.write(buf)
            rbuf = self.mcp2221a.read(65)
        except OSError:
            raise RWError("R/W Failed!")
        return rbuf[8]

    def i2c_cancel(self):
        buf = [0x00, 0x10]
        buf = buf + [0 for i in range(65 - len(buf))]
        buf[2 + 1] = 0x10  # Cancel current I2C/SMBus transfer (sub-command)
        try:
            self.mcp2221a.write(buf)
            self.mcp2221a.read(65)
        except OSError:
            raise RWError("R/W Failed!")

    def i2c_write(self, addrs, data):
        """ Writes a block of data with start and stop c condition on bus \n
        :param int addrs: 8-bit I2C slave address \n
        :param list data: list of int

        Referring to MCP2221A Datasheet(Rev.B 2017), section 3.1.5
        """
        buf = [0x00, 0x90]
        self._i2c_write(addrs, data, buf)

    def i2c_write_repeated(self, addrs, data):
        """ Writes a block of data with Repeated start and stop conditions on bus \n
        :param int addrs: 8-bit I2C slave address \n
        :param list data: list of int

        Referring to MCP2221A Datasheet(Rev.B 2017), section 3.1.6
        """
        buf = [0x00, 0x92]
        self._i2c_write(addrs, data, buf)

    def i2c_write_no_stop(self, addrs, data):
        """ Writes a block of data with start condition on bus \n
        :param int addrs: 8-bit I2C slave address \n
        :param list data: list of int

        Referring to MCP2221A Datasheet(Rev.B 2017), section 3.1.7
        """
        buf = [0x00, 0x94]
        self._i2c_write(addrs, data, buf)

    def _i2c_write(self, addrs, data, buf):
        buf = buf + [0 for i in range(65 - len(buf))]
        # Cancel current I2C/SMBus transfer (sub-command)
        buf[1 + 1] = (len(data) & 0x00FF)
        # Set I2C/SMBus communication speed (sub-command)
        buf[2 + 1] = (len(data) & 0xFF00) >> 8
        # The I2C/SMBus system clock divider that will be used to establish the communication speed
        buf[3 + 1] = 0xFF & (addrs << 1)
        for i in range(len(data)):
            # The I2C/SMBus system clock divider that will be used to establish the communication speed
            buf[4 + 1 + i] = data[i]
        try:
            self.mcp2221a.write(buf)
            rbuf = self.mcp2221a.read(65)
        except OSError:
            raise RWError("R/W Failed!")
        if(rbuf[22] == 0):
            raise LineLowError("SCL is low")
        if(rbuf[23] == 0):
            raise LineLowError("SDA is low")

    def i2c_read(self, addrs, size):
        """ Reads a block of data with start and stop conditions on bus \n
        :param int addrs: 8-bit I2C slave address \n
        :param int size: size of read out in bytes

        Referring to MCP2221A Datasheet(Rev.B 2017), section 3.1.8
        """
        buf = [0x00, 0x91]
        return self._i2c_read(addrs, size, buf)

    def i2c_read_repeated(self, addrs, size):
        """ Reads a block of data with Repeated start and stop conditions on bus \n
        :param int addrs: 8-bit I2C slave address \n
        :param int size: size of read out in bytes

        Referring to MCP2221A Datasheet(Rev.B 2017), section 3.1.9
        """
        buf = [0x00, 0x93]
        return self._i2c_read(addrs, size, buf)

    def _i2c_read(self, addrs, size, buf):
        buf = buf + [0 for i in range(65 - len(buf))]
        buf[1 + 1] = (size & 0x00FF)        # Read LEN
        buf[2 + 1] = (size & 0xFF00) >> 8   # Read LEN
        buf[3 + 1] = 0xFF & (addrs << 1)    # Address
        self.mcp2221a.write(buf)
        rbuf = self.mcp2221a.read(65)
        if (rbuf[1] != 0x00):
            self.i2c_cancel()
            self.i2c_init()
            return -1
        buf = [0x00, 0x40]
        buf = buf + [0 for i in range(65 - len(buf))]
        buf[1 + 1] = 0x00
        buf[2 + 1] = 0x00
        buf[3 + 1] = 0x00
        try:
            self.mcp2221a.write(buf)
            rbuf = self.mcp2221a.read(65)
        except OSError:
            raise RWError("R/W Failed!")
        if (rbuf[1] != 0x00):
            self.i2c_cancel()
            self.i2c_init()
            return -1
        if (rbuf[2] == 0x00 and rbuf[3] == 0x00):
            self.i2c_cancel()
            self.i2c_init()
            return rbuf[4]
        if (rbuf[2] == 0x55 and rbuf[3] == size):
            rdata = [0] * size
            for i in range(size):
                rdata[i] = rbuf[4 + i]
            return rdata

    def reset(self):
        print("Reset")
        buf = [0x00, 0x70, 0xAB, 0xCD, 0xEF]
        buf = buf + [0 for i in range(65 - len(buf))]
        try:
            self.mcp2221a.write(buf)
        except OSError:
            raise RWError("R/W Failed!")


if __name__ == '__main__':
    print("This is a module, use import instead")
