"""
gui.py

Main App - Python Backend
Methods(py_*) and Functions(js_*) are exposed via Eel.
https://github.com/ChrisKnott/Eel
"""


import mcpbridge
try:
    import eel
except ImportError:
    print("This app requires eel.")
    print("pip install eel")
    quit()

try:
    import toml
except ImportError:
    print("This module requires toml.")
    print("pip install toml")
    quit()

try:
    from easysettings import TOMLSettings
except ImportError:
    print("This module requires easysettings.")
    print("pip install EasySettings")
    quit()

# Debug print flag
enable_debug = False


def dprint(msg):
    """Debug print wrapper

    Arguments:
        msg {str} -- Debug message to be printed
    """
    if enable_debug is True:
        print(msg)


app_options = {
    'mode': "chrome-app",
    'port': 8080,
    'chromeFlags': [""]
}
"""app_options {dict} -- Eel app options"""

# Create mchpbridge class object
bridge = mcpbridge.MCP2221A()

# Create easysettings class object
settings = TOMLSettings()

# Eel Initialization
eel.init('gui')
eel.start('gui.html', size=(960, 720), options=app_options, block=False)


class State:
    """Stub class to qualify state machine variables"""

    current_app_state = 'None'
    """current_app_state {str} -- App state machine variable"""

    current_ui_state = 'None'
    """current_ui_state {str} -- UI state machine variable"""


# Create state class object
state = State()

# Expose functions to JavaScript
@eel.expose
def py_app_status():
    """Returns current app status to frontend

    Returns:
        str -- Current app status
    """
    return state.current_app_state


@eel.expose
def py_connect_mchpbridge():
    """This attempts to connect to the I2C bridge

    Returns:
        bool -- True if bridge was connected successfully
    """
    bool_temp = True
    try:
        bridge.connect()
        bridge.i2c_init()
    except mcpbridge.NoDeviceError:
        set_app_state_callback("No Devices Found")
        bool_temp = False
    except mcpbridge.LineLowError:
        set_app_state_callback("I2C Line Low")
        bool_temp = False
    except mcpbridge.RWError:
        set_app_state_callback("R/W Error")
        bool_temp = False

    if bool_temp:
        set_app_state_callback("Connected")
    return bool_temp


@eel.expose
def py_fetch_channel_data(channel_number, channel_avg):
    """Returns raw channel data to frontend

    Arguments:
        channel_number {int} -- PAC1934 channel number
        channel_avg {bool} -- Enable to fetch 8x averaged values

    Returns:
        list -- [raw voltage data, raw current data]
    """
    vbuf = 0
    ibuf = 0
    buf = [0]*2
    if state.current_app_state is "Connected":
        try:
            if channel_avg:
                vbuf = util_i2c_read(0x10, (0x0E+channel_number), 2)
            else:
                vbuf = util_i2c_read(0x10, (0x06+channel_number), 2)
            buf[0] = (vbuf[0]*256)+vbuf[1]
            if channel_avg:
                ibuf = util_i2c_read(0x10, (0x12+channel_number), 2)
            else:
                ibuf = util_i2c_read(0x10, (0x0A+channel_number), 2)
            buf[1] = (ibuf[0]*256)+ibuf[1]
        except TypeError:
            set_app_state_callback("Type Error")
            buf = [0]*2
    else:
        py_connect_mchpbridge()
    return buf


@eel.expose
def py_set_ctrl_register(ctrl_word):
    """Sets the PAC1934 CTRL register

    Arguments:
        ctrl_word {hex} -- The 8-bit control word to be written.

    Returns:
        bool -- True if write to CTRL register was successful
    """
    bool_temp = True
    if state.current_app_state is "Connected":
        try:
            bridge.i2c_write(0x10, [0x01, ctrl_word])
            eel.sleep(0.1)
            if util_i2c_read(0x10, 0x01, 1)[0] is not ctrl_word:
                bool_temp = False
        except mcpbridge.LineLowError:
            set_app_state_callback("I2C Line Low")
            bool_temp = False
        except mcpbridge.RWError:
            set_app_state_callback("R/W Error")
            bool_temp = False
    else:
        py_connect_mchpbridge()
        bool_temp = False
    return bool_temp


@eel.expose
def py_load_settings():
    """Tries to load settings from file, creates new instance on failure

    Returns:
        bool -- True if file was found, False if not found (implies new file instance was created)
    """
    try:
        global settings
        settings = TOMLSettings.from_file("config.txt")
        return True
    except FileNotFoundError:
        settings = TOMLSettings()
        settings.filename = "config.txt"
        return False


@eel.expose
def py_reset_settings():
    """Sets or adds all settings with default values
    """
    settings['saveFileDescription'] = 'PACView Config Save File'
    settings['channelName1'] = 'Channel 1'
    settings['channelName2'] = 'Channel 2'
    settings['channelName3'] = 'Channel 3'
    settings['channelName4'] = 'Channel 4'
    settings['senseResistorInOhms1'] = 1.0
    settings['senseResistorInOhms2'] = 1.0
    settings['senseResistorInOhms3'] = 1.0
    settings['senseResistorInOhms4'] = 1.0
    settings['sampleRateAllChannels'] = '1024'
    settings['refreshRateChannel1'] = 1000
    settings['refreshRateChannel2'] = 1000
    settings['refreshRateChannel3'] = 1000
    settings['refreshRateChannel4'] = 1000
    settings['averagingEnableChannel1'] = True
    settings['averagingEnableChannel2'] = True
    settings['averagingEnableChannel3'] = True
    settings['averagingEnableChannel4'] = True


@eel.expose
def py_save_settings():
    """Saves settings in UserDict to file
    """
    settings.save()


@eel.expose
def py_set_setting(item, value):
    """Adds to or modifies settings UserDict

    Arguments:
        item {pickleable} -- Settings item to be added or modified, must be serializable
        value {pickleable} -- Item's value, must be serializable
    """
    settings[item] = value


@eel.expose
def py_get_setting(item):
    """Tries to fetch an item's value

    Arguments:
        item {pickleable} -- Settings item name to fetch value

    Returns:
        pickleable -- Item value or 0 if item doesn't exist
    """
    try:
        return settings.get(item)
    except Exception:
        return 0


def set_app_state_callback(app_state):
    """Sets the current app state

    Arguments:
        app_state {str} -- Current app state
    """
    state.current_app_state = app_state
    dprint("current_app_state : " + state.current_app_state)


def set_ui_state_callback(ui_state):
    """Sets the current UI state

    Arguments:
        ui_state {str} -- Current UI state
    """
    state.current_ui_state = ui_state
    dprint("current_ui_state : " + state.current_ui_state)


def util_i2c_read(slave_address, register_address, size):
    """Performs a read on the I2C bus

    Arguments:
        slave_address {hexadecimal} -- I2C slave address
        register_address {hexadecimal} -- I2C slave register address
        size {int} -- Bytes to read

    Returns:
        list -- List of n ints; n = size (or) None
    """
    buf = None
    try:
        bridge.i2c_write(slave_address, [0x1f])
        bridge.i2c_write_no_stop(slave_address, [register_address])
        buf = bridge.i2c_read_repeated(slave_address, size)
    except mcpbridge.RWError:
        set_app_state_callback("R/W Error")
        buf = None
    except mcpbridge.LineLowError:
        set_app_state_callback("I2C Line Low")
        buf = None
    except OSError:
        set_app_state_callback("HIDAPI OSError")
        buf = None
    return buf


while True:
    eel.js_get_ui_state()(set_ui_state_callback)
    eel.sleep(5)
