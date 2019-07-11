# PACView-Source
## Description
PACView is a multi-platform, mordern and minimal GUI for the PAC1934 evaluation kit sold by Microchip.

Part Number: ADM00805
<a href="https://www.microchip.com/DevelopmentTools/ProductDetails/PartNo/ADM00805">![PAC1934](https://raw.githubusercontent.com/mhtmhn/PACView-Source/master/ADM00805.png)</a>

The source code is provided under the terms of the permissive MIT license.
## Installation
### Windows
Just use the executable provided in the [release](https://github.com/mhtmhn/PACView-Source/releases).
### Ubuntu
You'll need to compile an executable from source.
##### Steps
1. Download the latest [release](https://github.com/mhtmhn/PACView-Source/releases) and extract it.
2. First cd to /PACView-Source-x.x.x/app/ folder then run these commands:
```shell-script sudo x
sudo apt-get update && sudo apt-get dist-upgrade
sudo apt-get install wget
sudo apt-get install python3
sudo apt-get install python3-pip
sudo python3 -m pip install --upgrade setuptools
sudo apt-get install python-dev libusb-1.0-0-dev libudev-dev
sudo python3 -m pip install hidapi
sudo python3 -m pip install eel
sudo python3 -m pip install EasySettings
sudo python3 -m pip install toml
sudo python3 -m pip install PyInstaller
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - 
sudo sh -c 'echo "deb https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt-get update
sudo apt-get install google-chrome-stable
python3 -m eel gui.py gui --noconsole --onefile
```
3. Add udev rules for the MCP2221A USB HID to I2C bridge.
In ```/etc/udev/rules.d/``` add a file ```99-hid.rules```
with the following contents and save. Use ```chmod``` to give it ```a+x``` access.
```
# HIDAPI/libusb
SUBSYSTEM=="usb", ATTRS{idVendor}=="04d8", ATTRS{idProduct}=="00dd", MODE="0666"

# HIDAPI/hidraw
KERNEL=="hidraw*", ATTRS{busnum}=="1", ATTRS{idVendor}=="04d8", ATTRS{idProduct}=="00dd", MODE="0666"
```
4. Restart your PC
5. Run executable from the /PACView-Source-x.x.x/app/dist/ folder

## Troubleshooting
### General
* Drivers are automatically installed in Windows 10, Ubuntu. If they're not installed automatically, try downloading and installing them from here: https://www.microchip.com/wwwproducts/en/MCP2221A
### Ubuntu
* If the ```port 8080``` is already in use, the application may fail to start/work.
  * #### Fix 1 (if PACView crashed without releasing the port): 
    Close the process using terminal.
    
    To find the process try:
    
    ```sudo lsof -i :8080```
    
    then kill the process which is currently using the port using its PID.
    
    ```kill PID```
    
    Check to see if the port closed. If not, try:
    
    ```kill -9 PID```
    
    and only do the following if the previous didn't work.
    
    ```sudo kill -9 PID```
    
  * #### Fix 2 (if another application needs to use this port): 
    Navigate to ```PACView-Source/app/gui.py``` and modify the port.
    
     ```python
     app_options = {
        'mode': "chrome-app",
        'port': 8080,
        'chromeFlags': [""]
     }
     ```
     Then rebuild the app.
