import mcpbridge
import time
import os

slave_address = 0x10
bridge = mcpbridge.MCP2221A()

flag = True
while flag:
    try:
        bridge.connect()
        bridge.i2c_init()
        flag = False
    except mcpbridge.NoDeviceError:
        # print("NoDeviceError!")
        pass
    except mcpbridge.LineLowError:
        # print("LineLowError!")
        pass


def cls():
    os.system('cls' if os.name == 'nt' else 'clear')


def i2c_read(register_address, size):
    try:
        bridge.i2c_write_no_stop(slave_address, [register_address])
        buf = bridge.i2c_read_repeated(slave_address, size)
        return buf
    except mcpbridge.RWError:
        print("RWError!")
    except mcpbridge.LineLowError:
        print("LineLowError!")


while True:
    try:
        bridge.i2c_write(slave_address, [0x1f])
    except mcpbridge.RWError:
        print("RWError!")
    except mcpbridge.LineLowError:
        print("LineLowError!")
    try:
        for i in range(1, 5):
            vbuf = i2c_read(0x06+i, 2)
            z = (vbuf[0]*256)+vbuf[1]
            print("VBUS" + str(i) + "     " +
                  "{0:.6f}".format((z*32)/pow(2, 16)) + " V")
        for i in range(1, 5):
            vbuf = i2c_read(0x0A+i, 2)
            z = (vbuf[0]*256)+vbuf[1]
            print("IBUS" + str(i) + "     " +
                  "{0:.6f}".format((z*0.1)/pow(2, 16)) + " A")
        for i in range(1, 5):
            vbuf = i2c_read(0x0E+i, 2)
            z = (vbuf[0]*256)+vbuf[1]
            print("VBUS" + str(i) + "_AVG " +
                  "{0:.6f}".format((z*32)/pow(2, 16)) + " V")
        for i in range(1, 5):
            vbuf = i2c_read(0x12+i, 2)
            z = (vbuf[0]*256)+vbuf[1]
            print("IBUS" + str(i) + "_AVG " +
                  "{0:.6f}".format((z*0.1)/pow(2, 16)) + " A")
    except TypeError:
        print("TypeError!")
    time.sleep(0.3)
    cls()
