# PACView-Source
## Installation
### Windows
Juts use the executable provided in the [release](https://github.com/mhtmhn/PACView-Source/releases).
### Ubuntu
You'll need to compile an executable from source.
##### Steps
1. Download the latest [release](https://github.com/mhtmhn/PACView-Source/releases) and extract it.
2. First cd to \PACView-Source-0.1.0\app\ folder then run these commands:
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
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - 
sudo sh -c 'echo "deb https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt-get update
sudo apt-get install google-chrome-stable
```
3. Add udev rules for the MCP2221A USB HID to I2C bridge.
```
# HIDAPI/libusb
SUBSYSTEM=="usb", ATTRS{idVendor}=="04d8", ATTRS{idProduct}=="00dd", MODE="0666"

# HIDAPI/hidraw
KERNEL=="hidraw*", ATTRS{busnum}=="1", ATTRS{idVendor}=="04d8", ATTRS{idProduct}=="00dd", MODE="0666"
```
4. Restart your PC
