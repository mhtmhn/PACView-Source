//Main App - Web Frontend
//Debug toggle
var debug = false;
//UI state machine variable
var uiState = "Init";
//App state machine variable
var appState = "Init";
//App state update rate variable - ms
var appStateUpdateRate = 1000;

//Expose functions to Python
//Function to query UI status
try {
    eel.expose(js_get_ui_state);
} catch (err) {
    debug && console.log(err);
}

//Send UI state
function js_get_ui_state() {
    return uiState;
}

//Set app state
function setAppState(state) {
    appState = state;
    $('#id-status-left').text(state)
    debug && console.log("appstate : " + state);
}

//Request app state
var requestAppState = function () {
    try {
        eel.py_app_status()(setAppState);
    } catch (err) {
        debug && console.log(err);
    }
    setTimeout(requestAppState, appStateUpdateRate);
}

//Recursively try to connect to device
function requestConnection(isConnected) {
    if (!isConnected) {
        try {
            eel.py_connect_mchpbridge()(requestConnection);
        } catch (err) {
            debug && console.log(err);
        }
    } else {
        startGUI();
    }
}

//Editable channel names
/* This variable allows the collapsible to be used to remove focus on the 
 * contenteditable while not togglling the collapsible
 */
var varEditNotComplete = false;

//Channel 1
var renameChannel1 = $('#id-rename-channel-1').text();
$('#id-rename-channel-1').blur(function () {
    if ($(this).text().trim().length == 0) {
        $(this).text(renameChannel1);
    } else if (renameChannel1 != $(this).text()) {
        renameChannel1 = $(this).text();
    }
    varEditNotComplete = true;
});

//Channel 2
var renameChannel2 = $('#id-rename-channel-2').text();
$('#id-rename-channel-2').blur(function () {
    if ($(this).text().trim().length == 0) {
        $(this).text(renameChannel2);
    } else if (renameChannel2 != $(this).text()) {
        renameChannel2 = $(this).text();
    }
    varEditNotComplete = true;
});

//Channel 3
var renameChannel3 = $('#id-rename-channel-3').text();
$('#id-rename-channel-3').blur(function () {
    if ($(this).text().trim().length == 0) {
        $(this).text(renameChannel3);
    } else if (renameChannel3 != $(this).text()) {
        renameChannel3 = $(this).text();
    }
    varEditNotComplete = true;
});

//Channel 4
var renameChannel4 = $('#id-rename-channel-4').text();
$('#id-rename-channel-4').blur(function () {
    if ($(this).text().trim().length == 0) {
        $(this).text(renameChannel4);
    } else if (renameChannel4 != $(this).text()) {
        renameChannel4 = $(this).text();
    }
    varEditNotComplete = true;
});

//Class to validate contenteditable
var validateLengthContenteditableMax = 20;

$('.validate-contenteditable').keydown(function (e) {
    var keycode = e.keyCode;

    if (keycode == 13) {
        /* Pressing return removes focus on contenteditable 
         * and unlocks collapsible 
         */
        e.stopPropagation();
        e.preventDefault();
        $('.collapsible-deadzone').blur();
        varEditNotComplete = false;
    }

    var validKeys =
        (keycode > 47 && keycode < 58) ||
        keycode == 32 ||
        (keycode > 64 && keycode < 91) ||
        (keycode > 95 && keycode < 112) ||
        (keycode > 185 && keycode < 193) ||
        (keycode > 218 && keycode < 223);
    if (validKeys) {
        return $(this).text().length <= validateLengthContenteditableMax;
    }
});

//Class to lock collapsible in place during text editing
$('.collapsible-deadzone').on("click", function (e) {
    e.stopPropagation();
});

/* Prevent toggling collapsible on mouseup during text-editing, 
 * for e.g. drag text-select in contenteditable block spilling 
 * into the collapsible click target.
 * Also prevents toggling collapsibles used to remove focus from 
 * contenteditable sections.
 */
$('.collapsible-header').on("click", function (e) {
    if ($(".collapsible-deadzone").is(":focus")) {
        e.stopPropagation();
    }
    if (varEditNotComplete) {
        e.stopPropagation();
        varEditNotComplete = false;
    }
});
/* Clicking anywhere else also affects focus on contenteditable,
 * prevents collapsible from being unresponsive for a single click
 * after editing text.
 */
$('#id-capture-click').on("click", function (e) {
    varEditNotComplete = false;
});

//Channel globals
var senseResistorChannel1 = 1;
var senseResistorChannel2 = 1;
var senseResistorChannel3 = 1;
var senseResistorChannel4 = 1;
var sampleRateValue = "1024";
var submitWasClicked = false;

//Set a flag if settings 'OK' button was pressed
$('#id-submit-settings').on("click", function (e) {
    submitWasClicked = true;
});

//Chartjs
//Chartjs global settings
Chart.defaults.global.legend.display = false;
Chart.defaults.global.tooltips.enabled = true;
Chart.defaults.global.animation = true;
Chart.defaults.global.responsive = true;
Chart.defaults.global.maintainAspectRatio = false;

//Chartjs global variables
//Channel 1
var channelIsPausedChart1 = false;
var updateRateChannel1 = 1000;
var xAxisTextChart1 = 'seconds';
var xAxisSuffixChart1 = 's';
var yAxisSuffixChart1 = ' A';
var channelVolatgeGuage1;
var channelCurrentGuage1;
var channelCurrentChart1;
var averagingChannel1 = true;

//Channel 2
var channelIsPausedChart2 = false;
var updateRateChannel2 = 1000;
var xAxisTextChart2 = 'seconds';
var xAxisSuffixChart2 = 's';
var yAxisSuffixChart2 = ' A';
var channelVolatgeGuage2;
var channelCurrentGuage2;
var channelCurrentChart2;
var averagingChannel2 = true;

//Channel 3
var channelIsPausedChart3 = false;
var updateRateChannel3 = 1000;
var xAxisTextChart3 = 'seconds';
var xAxisSuffixChart3 = 's';
var yAxisSuffixChart3 = ' A';
var channelVolatgeGuage3;
var channelCurrentGuage3;
var channelCurrentChart3;
var averagingChannel3 = true;

//Channel 4
var channelIsPausedChart4 = false;
var updateRateChannel4 = 1000;
var xAxisTextChart4 = 'seconds';
var xAxisSuffixChart4 = 's';
var yAxisSuffixChart4 = ' A';
var channelVolatgeGuage4;
var channelCurrentGuage4;
var channelCurrentChart4;
var averagingChannel4 = true;

//jQuery Document Ready
$(document).ready(function () {
    //Set UI State
    uiState = "Ready";

    //Trigger app status update routine
    setTimeout(requestAppState, appStateUpdateRate);

    //Materialize Auto Init
    M.AutoInit();

    //Enable overlay scrollbars
    $("body").overlayScrollbars({
        className: "os-theme-thick-light",
        overflowBehavior: {
            x: "hidden",
            y: "scroll"
        },
        scrollbars: {
            visibility: "auto",
            autoHide: "move",
            autoHideDelay: 3000,
            dragScrolling: true,
            touchSupport: true
        }
    });

    //Init settings on start
    initSettings();

    //Initialize modals
    var instanceSettingsModal = M.Modal.init(document.querySelectorAll('#id-title-bar-tools-settings-modal'), {
        onOpenStart: function () {
            //Sense resistor text fields
            $('#id-tbtsm-sense-value-channel-1').val(senseResistorChannel1);
            $('#id-tbtsm-sense-value-channel-2').val(senseResistorChannel2);
            $('#id-tbtsm-sense-value-channel-3').val(senseResistorChannel3);
            $('#id-tbtsm-sense-value-channel-4').val(senseResistorChannel4);

            //Sample rate radio button group
            $("input[name='id-tbtsm-samples-radio-group'][value=" + sampleRateValue + "]").prop('checked', true);

            //Refresh rate text fields
            $('#id-tbtsm-refresh-value-channel-1').val(updateRateChannel1);
            $('#id-tbtsm-refresh-value-channel-2').val(updateRateChannel2);
            $('#id-tbtsm-refresh-value-channel-3').val(updateRateChannel3);
            $('#id-tbtsm-refresh-value-channel-4').val(updateRateChannel4);
            M.updateTextFields();

            //Channel averaging enable state switches
            $('#id-tbtsm-avg-channel-1').prop('checked', averagingChannel1);
            $('#id-tbtsm-avg-channel-2').prop('checked', averagingChannel2);
            $('#id-tbtsm-avg-channel-3').prop('checked', averagingChannel3);
            $('#id-tbtsm-avg-channel-4').prop('checked', averagingChannel4);
        },
        onCloseEnd: function () {
            //Validate if settings 'OK' button was pressed
            if (submitWasClicked) {
                //Sense resistor value update
                if (document.getElementById('id-tbtsm-sense-value-channel-1').checkValidity())
                    senseResistorChannel1 = $('#id-tbtsm-sense-value-channel-1').val();
                if (document.getElementById('id-tbtsm-sense-value-channel-2').checkValidity())
                    senseResistorChannel2 = $('#id-tbtsm-sense-value-channel-2').val();
                if (document.getElementById('id-tbtsm-sense-value-channel-3').checkValidity())
                    senseResistorChannel3 = $('#id-tbtsm-sense-value-channel-3').val();
                if (document.getElementById('id-tbtsm-sense-value-channel-4').checkValidity())
                    senseResistorChannel4 = $('#id-tbtsm-sense-value-channel-4').val();

                //Sample rate value update
                changeSampleRate($("input[name='id-tbtsm-samples-radio-group']:checked").val());

                //Refresh rate value update
                if (document.getElementById('id-tbtsm-refresh-value-channel-1').checkValidity())
                    updateRateChannel1 = $('#id-tbtsm-refresh-value-channel-1').val();
                if (document.getElementById('id-tbtsm-refresh-value-channel-2').checkValidity())
                    updateRateChannel2 = $('#id-tbtsm-refresh-value-channel-2').val();
                if (document.getElementById('id-tbtsm-refresh-value-channel-3').checkValidity())
                    updateRateChannel3 = $('#id-tbtsm-refresh-value-channel-3').val();
                if (document.getElementById('id-tbtsm-refresh-value-channel-4').checkValidity())
                    updateRateChannel4 = $('#id-tbtsm-refresh-value-channel-4').val();

                //Channel averaging enable state update
                averagingChannel1 = $('#id-tbtsm-avg-channel-1').prop('checked');
                averagingChannel2 = $('#id-tbtsm-avg-channel-2').prop('checked');
                averagingChannel3 = $('#id-tbtsm-avg-channel-3').prop('checked');
                averagingChannel4 = $('#id-tbtsm-avg-channel-4').prop('checked');

                //Reset submit flag
                submitWasClicked = false;
            }
        }
    });

    //Customize dropdown menus
    $(".dropdown-content>li>a").css("color", "#FFFFFF");
    $(".dropdown-trigger").dropdown({
        coverTrigger: false,
        constrainWidth: false
    });

    //Guages
    //Chartjs guage initialization
    //Get context for gradients
    var id_gradient_voltage_guage = document
        .getElementById("id-channel-voltage-guage-1")
        .getContext("2d")
        .createLinearGradient(150.0, 0.0, 150.0, 300.0);

    var id_gradient_current_guage = document
        .getElementById("id-channel-voltage-guage-1")
        .getContext("2d")
        .createLinearGradient(150.0, 0.0, 150.0, 300.0);

    var id_gradient_common_bg = document
        .getElementById("id-channel-voltage-guage-1")
        .getContext("2d")
        .createLinearGradient(150.0, 0.0, 150.0, 300.0);

    //Add colors
    id_gradient_voltage_guage.addColorStop(0.000, 'rgba(25, 118, 210, 1.000)');
    id_gradient_voltage_guage.addColorStop(1.000, 'rgba(9, 82, 150, 1.000)');

    //Add colors
    id_gradient_current_guage.addColorStop(0.000, 'rgba(25, 118, 210, 1.000)');
    id_gradient_current_guage.addColorStop(1.000, 'rgba(9, 82, 150, 1.000)');

    //Add colors
    id_gradient_common_bg.addColorStop(0.0, "rgba(122, 122, 122, 0.620)");
    id_gradient_common_bg.addColorStop(1.0, "rgba(0, 0, 0, 0.000)");

    //Channel 1 voltage guage initialization
    channelVolatgeGuage1 = new Chart(
        document.getElementById("id-channel-voltage-guage-1").getContext("2d"), {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: [id_gradient_voltage_guage, id_gradient_common_bg],
                        label: "data",
                        hoverBackgroundColor: [id_gradient_voltage_guage, id_gradient_common_bg],
                        hoverBorderColor: "#fff"
                    }
                ],
                labels: ["", ""]
            },
            options: {
                circumference: Math.PI,
                rotation: Math.PI,
                cutoutPercentage: 60,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: "Voltage",
                    fontSize: 24,
                    fontColor: "#000",
                    position: "bottom"
                },
                animation: {
                    duration: 500,
                    easing: "easeOutQuad",
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
    );

    //Channel 2 voltage guage initialization
    channelVolatgeGuage2 = new Chart(
        document.getElementById("id-channel-voltage-guage-2").getContext("2d"), {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: [id_gradient_voltage_guage, id_gradient_common_bg],
                        label: "data",
                        hoverBackgroundColor: [id_gradient_voltage_guage, id_gradient_common_bg],
                        hoverBorderColor: "#fff"
                    }
                ],
                labels: ["", ""]
            },
            options: {
                circumference: Math.PI,
                rotation: Math.PI,
                cutoutPercentage: 60,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: "Voltage",
                    fontSize: 24,
                    fontColor: "#000",
                    position: "bottom"
                },
                animation: {
                    duration: 500,
                    easing: "easeOutQuad",
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
    );

    //Channel 3 voltage guage initialization
    channelVolatgeGuage3 = new Chart(
        document.getElementById("id-channel-voltage-guage-3").getContext("2d"), {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: [id_gradient_voltage_guage, id_gradient_common_bg],
                        label: "data",
                        hoverBackgroundColor: [id_gradient_voltage_guage, id_gradient_common_bg],
                        hoverBorderColor: "#fff"
                    }
                ],
                labels: ["", ""]
            },
            options: {
                circumference: Math.PI,
                rotation: Math.PI,
                cutoutPercentage: 60,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: "Voltage",
                    fontSize: 24,
                    fontColor: "#000",
                    position: "bottom"
                },
                animation: {
                    duration: 500,
                    easing: "easeOutQuad",
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
    );

    //Channel 4 voltage guage initialization
    channelVolatgeGuage4 = new Chart(
        document.getElementById("id-channel-voltage-guage-4").getContext("2d"), {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: [id_gradient_voltage_guage, id_gradient_common_bg],
                        label: "data",
                        hoverBackgroundColor: [id_gradient_voltage_guage, id_gradient_common_bg],
                        hoverBorderColor: "#fff"
                    }
                ],
                labels: ["", ""]
            },
            options: {
                circumference: Math.PI,
                rotation: Math.PI,
                cutoutPercentage: 60,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: "Voltage",
                    fontSize: 24,
                    fontColor: "#000",
                    position: "bottom"
                },
                animation: {
                    duration: 500,
                    easing: "easeOutQuad",
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
    );

    //Channel 1 current guage initialization
    channelCurrentGuage1 = new Chart(
        document.getElementById("id-channel-current-guage-1").getContext("2d"), {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: [id_gradient_current_guage, id_gradient_common_bg],
                        label: "data",
                        hoverBackgroundColor: [id_gradient_current_guage, id_gradient_common_bg],
                        hoverBorderColor: "#fff"
                    }
                ],
                labels: ["", ""]
            },
            options: {
                circumference: Math.PI,
                rotation: Math.PI,
                cutoutPercentage: 60,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: "Current",
                    fontSize: 24,
                    fontColor: "#000",
                    position: "bottom"
                },
                animation: {
                    duration: 500,
                    easing: "easeOutQuad",
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
    );

    //Channel 2 current guage initialization
    channelCurrentGuage2 = new Chart(
        document.getElementById("id-channel-current-guage-2").getContext("2d"), {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: [id_gradient_current_guage, id_gradient_common_bg],
                        label: "data",
                        hoverBackgroundColor: [id_gradient_current_guage, id_gradient_common_bg],
                        hoverBorderColor: "#fff"
                    }
                ],
                labels: ["", ""]
            },
            options: {
                circumference: Math.PI,
                rotation: Math.PI,
                cutoutPercentage: 60,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: "Current",
                    fontSize: 24,
                    fontColor: "#000",
                    position: "bottom"
                },
                animation: {
                    duration: 500,
                    easing: "easeOutQuad",
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
    );

    //Channel 3 current guage initialization
    channelCurrentGuage3 = new Chart(
        document.getElementById("id-channel-current-guage-3").getContext("2d"), {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: [id_gradient_current_guage, id_gradient_common_bg],
                        label: "data",
                        hoverBackgroundColor: [id_gradient_current_guage, id_gradient_common_bg],
                        hoverBorderColor: "#fff"
                    }
                ],
                labels: ["", ""]
            },
            options: {
                circumference: Math.PI,
                rotation: Math.PI,
                cutoutPercentage: 60,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: "Current",
                    fontSize: 24,
                    fontColor: "#000",
                    position: "bottom"
                },
                animation: {
                    duration: 500,
                    easing: "easeOutQuad",
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
    );

    //Channel 4 current guage initialization
    channelCurrentGuage4 = new Chart(
        document.getElementById("id-channel-current-guage-4").getContext("2d"), {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: [id_gradient_current_guage, id_gradient_common_bg],
                        label: "data",
                        hoverBackgroundColor: [id_gradient_current_guage, id_gradient_common_bg],
                        hoverBorderColor: "#fff"
                    }
                ],
                labels: ["", ""]
            },
            options: {
                circumference: Math.PI,
                rotation: Math.PI,
                cutoutPercentage: 60,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: "Current",
                    fontSize: 24,
                    fontColor: "#000",
                    position: "bottom"
                },
                animation: {
                    duration: 500,
                    easing: "easeOutQuad",
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
    );

    //Chartjs chart initialization
    //Channel 1 chart initialization
    channelCurrentChart1 = new Chart(document.getElementById("id-channel-current-chart-1").getContext("2d"), {
        type: "line",
        data: {
            labels: [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "seconds"
            ],
            datasets: [
                {
                    label: "mA",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "rgba(0,0,0,0)",
                    pointRadius: 0,
                    pointBorderColor: "#1976D2",
                    pointBackgroundColor: "#000000",
                    borderColor: "#000000",
                    borderWidth: 3
                }
            ]
        },
        options: {
            animation: {
                duration: 0,
                easing: "linear"
            },
            scales: {
                yAxes: [{
                    type: "logarithmic",
                    ticks: {
                        autoSkip: true,
                        min: 0,
                        max: 100,
                        callback: function (value, index, values) {
                            if (value == 0 || value == 0.01 || value == 0.1 || value == 1 || value == 10 || value == 100) {
                                return value + yAxisSuffixChart1;
                            }
                        }
                    }
                }]
            },
            tooltips: {
                enabled: false,
                mode: "single",
                custom: function (tooltip) {
                    if (!tooltip) return;
                    tooltip.displayColors = false;
                },
                callbacks: {
                    label: function (tooltipItem, data) {
                        return tooltipItem.yLabel + yAxisSuffixChart1;
                    },
                    title: function (tooltipItem, data) {
                        return;
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.1
                }
            }
        }
    });

    //Channel 2 chart initialization
    channelCurrentChart2 = new Chart(document.getElementById("id-channel-current-chart-2").getContext("2d"), {
        type: "line",
        data: {
            labels: [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "seconds"
            ],
            datasets: [
                {
                    label: "mA",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "rgba(0,0,0,0)",
                    pointRadius: 0,
                    pointBorderColor: "#1976D2",
                    pointBackgroundColor: "#000000",
                    borderColor: "#000000",
                    borderWidth: 3
                }
            ]
        },
        options: {
            animation: {
                duration: 0,
                easing: "linear"
            },
            scales: {
                yAxes: [{
                    type: "logarithmic",
                    ticks: {
                        autoSkip: true,
                        min: 0,
                        max: 100,
                        callback: function (value, index, values) {
                            if (value == 0 || value == 0.01 || value == 0.1 || value == 1 || value == 10 || value == 100) {
                                return value + yAxisSuffixChart2;
                            }
                        }
                    }
                }]
            },
            tooltips: {
                enabled: false,
                mode: "single",
                custom: function (tooltip) {
                    if (!tooltip) return;
                    tooltip.displayColors = false;
                },
                callbacks: {
                    label: function (tooltipItem, data) {
                        return tooltipItem.yLabel + yAxisSuffixChart2;
                    },
                    title: function (tooltipItem, data) {
                        return;
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.1
                }
            }
        }
    });

    //Channel 3 chart initialization
    channelCurrentChart3 = new Chart(document.getElementById("id-channel-current-chart-3").getContext("2d"), {
        type: "line",
        data: {
            labels: [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "seconds"
            ],
            datasets: [
                {
                    label: "mA",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "rgba(0,0,0,0)",
                    pointRadius: 0,
                    pointBorderColor: "#1976D2",
                    pointBackgroundColor: "#000000",
                    borderColor: "#000000",
                    borderWidth: 3
                }
            ]
        },
        options: {
            animation: {
                duration: 0,
                easing: "linear"
            },
            scales: {
                yAxes: [{
                    type: "logarithmic",
                    ticks: {
                        autoSkip: true,
                        min: 0,
                        max: 100,
                        callback: function (value, index, values) {
                            if (value == 0 || value == 0.01 || value == 0.1 || value == 1 || value == 10 || value == 100) {
                                return value + yAxisSuffixChart3;
                            }
                        }
                    }
                }]
            },
            tooltips: {
                enabled: false,
                mode: "single",
                custom: function (tooltip) {
                    if (!tooltip) return;
                    tooltip.displayColors = false;
                },
                callbacks: {
                    label: function (tooltipItem, data) {
                        return tooltipItem.yLabel + yAxisSuffixChart3;
                    },
                    title: function (tooltipItem, data) {
                        return;
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.1
                }
            }
        }
    });

    //Channel 4 chart initialization
    channelCurrentChart4 = new Chart(document.getElementById("id-channel-current-chart-4").getContext("2d"), {
        type: "line",
        data: {
            labels: [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "seconds"
            ],
            datasets: [
                {
                    label: "mA",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "rgba(0,0,0,0)",
                    pointRadius: 0,
                    pointBorderColor: "#1976D2",
                    pointBackgroundColor: "#000000",
                    borderColor: "#000000",
                    borderWidth: 3
                }
            ]
        },
        options: {
            animation: {
                duration: 0,
                easing: "linear"
            },
            scales: {
                yAxes: [{
                    type: "logarithmic",
                    ticks: {
                        autoSkip: true,
                        min: 0,
                        max: 100,
                        callback: function (value, index, values) {
                            if (value == 0 || value == 0.01 || value == 0.1 || value == 1 || value == 10 || value == 100) {
                                return value + yAxisSuffixChart4;
                            }
                        }
                    }
                }]
            },
            tooltips: {
                enabled: false,
                mode: "single",
                custom: function (tooltip) {
                    if (!tooltip) return;
                    tooltip.displayColors = false;
                },
                callbacks: {
                    label: function (tooltipItem, data) {
                        return tooltipItem.yLabel + yAxisSuffixChart4;
                    },
                    title: function (tooltipItem, data) {
                        return;
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.1
                }
            }
        }
    });

    //Start requesting connection
    requestConnection(false);
});

// Function to check if value is within limits 
function isWithinLimits(value, min, max) {
    return value >= min && value < max;
}

//Channel 1 variables
var pointsInXAxisChart1 = 20;
var timeVarChart1 = 0;
var varMaxVoltageGuage1 = 100;
var varMaxCurrentGuage1 = 100;
var dataVarCurrentGuage1 = 0;
var dataVarVoltageGuage1 = 0;
var dataVarChart1 = 0;
var unitV1 = " V";
var unitA1 = " A";

//Channel 1 update routine
var intervalChannel1 = async function () {
    //Fetch channel 1 data
    let data = await eel.py_fetch_channel_data(1, averagingChannel1)();
    dataVarVoltageGuage1 = (data[0] * 32) / 65536;
    dataVarCurrentGuage1 = (data[1] * (0.1 / senseResistorChannel1)) / 65536;

    //Assign channel 1 data to chart
    dataVarChart1 = dataVarCurrentGuage1.toFixed(6);

    //Scale voltage
    if (isWithinLimits(dataVarVoltageGuage1, 0, 0.1)) {
        dataVarVoltageGuage1 = (dataVarVoltageGuage1 * 1000).toFixed(3);
        varMaxVoltageGuage1 = 100;
        unitV1 = " mV";
    } else if (isWithinLimits(dataVarVoltageGuage1, 0.1, 1)) {
        dataVarVoltageGuage1 = (dataVarVoltageGuage1 * 1000).toFixed(2);
        varMaxVoltageGuage1 = 1000;
        unitV1 = " mV";
    } else if (isWithinLimits(dataVarVoltageGuage1, 1, 10)) {
        dataVarVoltageGuage1 = dataVarVoltageGuage1.toFixed(3);
        varMaxVoltageGuage1 = 10;
        unitV1 = " V";
    } else if (isWithinLimits(dataVarVoltageGuage1, 10, 100)) {
        dataVarVoltageGuage1 = dataVarVoltageGuage1.toFixed(2);
        varMaxVoltageGuage1 = 100;
        unitV1 = " V";
    }

    //Scale current
    if (isWithinLimits(dataVarCurrentGuage1, 0, 0.1)) {
        dataVarCurrentGuage1 = (dataVarCurrentGuage1 * 1000).toFixed(3);
        varMaxCurrentGuage1 = 100;
        unitA1 = " mA";
    } else if (isWithinLimits(dataVarCurrentGuage1, 0.1, 1)) {
        dataVarCurrentGuage1 = (dataVarCurrentGuage1 * 1000).toFixed(2);
        varMaxCurrentGuage1 = 1000;
        unitA1 = " mA";
    } else if (isWithinLimits(dataVarCurrentGuage1, 1, 10)) {
        dataVarCurrentGuage1 = dataVarCurrentGuage1.toFixed(3);
        varMaxCurrentGuage1 = 10;
        unitA1 = " A";
    } else if (isWithinLimits(dataVarCurrentGuage1, 10, 100)) {
        dataVarCurrentGuage1 = dataVarCurrentGuage1.toFixed(2);
        varMaxCurrentGuage1 = 100;
        unitA1 = " A";
    }

    //Voltage guage 1
    channelVolatgeGuage1.data.datasets[0].data[0] = dataVarVoltageGuage1 / varMaxVoltageGuage1 * 100;
    channelVolatgeGuage1.data.datasets[0].data[1] =
        100 - channelVolatgeGuage1.data.datasets[0].data[0];
    channelVolatgeGuage1.options.title.text = dataVarVoltageGuage1 + unitV1;
    channelVolatgeGuage1.update();

    //Current guage 1
    channelCurrentGuage1.data.datasets[0].data[0] = dataVarCurrentGuage1 / varMaxCurrentGuage1 * 100;
    channelCurrentGuage1.data.datasets[0].data[1] =
        100 - channelCurrentGuage1.data.datasets[0].data[0];
    channelCurrentGuage1.options.title.text = dataVarCurrentGuage1 + unitA1;
    channelCurrentGuage1.update();

    //Chart 1
    if (!channelIsPausedChart1) {
        channelCurrentChart1.data.labels[pointsInXAxisChart1 - 1] = timeVarChart1.toFixed(2) + xAxisSuffixChart1;
        channelCurrentChart1.data.datasets[0].data[pointsInXAxisChart1 - 1] = dataVarChart1;
        for (var i = 0; i < pointsInXAxisChart1; i++) {
            channelCurrentChart1.data.labels[i] = channelCurrentChart1.data.labels[i + 1];
            channelCurrentChart1.data.datasets[0].data[i] =
                channelCurrentChart1.data.datasets[0].data[i + 1];
        }
        channelCurrentChart1.data.labels[pointsInXAxisChart1 - 1] = xAxisTextChart1;
        channelCurrentChart1.update();
        channelCurrentChart1.config.options.animation.duration = 0;
    }
    timeVarChart1 += updateRateChannel1 / 1000;
    setTimeout(intervalChannel1, updateRateChannel1);
}

//Channel 2 variables
var pointsInXAxisChart2 = 20;
var timeVarChart2 = 0;
var varMaxVoltageGuage2 = 100;
var varMaxCurrentGuage2 = 100;
var dataVarCurrentGuage2 = 0;
var dataVarVoltageGuage2 = 0;
var dataVarChart2 = 0;
var unitV2 = " V";
var unitA2 = " A";

//Channel 2 routine
var intervalChannel2 = async function () {
    //Fetch channel 2 data
    let data = await eel.py_fetch_channel_data(2, averagingChannel2)();
    dataVarVoltageGuage2 = (data[0] * 32) / 65536;
    dataVarCurrentGuage2 = (data[1] * (0.1 / senseResistorChannel2)) / 65536;

    //Assign channel 2 data to chart
    dataVarChart2 = dataVarCurrentGuage2.toFixed(6);

    //Scale voltage
    if (isWithinLimits(dataVarVoltageGuage2, 0, 0.1)) {
        dataVarVoltageGuage2 = (dataVarVoltageGuage2 * 1000).toFixed(3);
        varMaxVoltageGuage2 = 100;
        unitV2 = " mV";
    } else if (isWithinLimits(dataVarVoltageGuage2, 0.1, 1)) {
        dataVarVoltageGuage2 = (dataVarVoltageGuage2 * 1000).toFixed(2);
        varMaxVoltageGuage2 = 1000;
        unitV2 = " mV";
    } else if (isWithinLimits(dataVarVoltageGuage2, 1, 10)) {
        dataVarVoltageGuage2 = dataVarVoltageGuage2.toFixed(3);
        varMaxVoltageGuage2 = 10;
        unitV2 = " V";
    } else if (isWithinLimits(dataVarVoltageGuage2, 10, 100)) {
        dataVarVoltageGuage2 = dataVarVoltageGuage2.toFixed(2);
        varMaxVoltageGuage2 = 100;
        unitV2 = " V";
    }

    //Scale current
    if (isWithinLimits(dataVarCurrentGuage2, 0, 0.1)) {
        dataVarCurrentGuage2 = (dataVarCurrentGuage2 * 1000).toFixed(3);
        varMaxCurrentGuage2 = 100;
        unitA2 = " mA";
    } else if (isWithinLimits(dataVarCurrentGuage2, 0.1, 1)) {
        dataVarCurrentGuage2 = (dataVarCurrentGuage2 * 1000).toFixed(2);
        varMaxCurrentGuage2 = 1000;
        unitA2 = " mA";
    } else if (isWithinLimits(dataVarCurrentGuage2, 1, 10)) {
        dataVarCurrentGuage2 = dataVarCurrentGuage2.toFixed(3);
        varMaxCurrentGuage2 = 10;
        unitA2 = " A";
    } else if (isWithinLimits(dataVarCurrentGuage2, 10, 100)) {
        dataVarCurrentGuage2 = dataVarCurrentGuage2.toFixed(2);
        varMaxCurrentGuage2 = 100;
        unitA2 = " A";
    }

    //Voltage guage 2
    channelVolatgeGuage2.data.datasets[0].data[0] = dataVarVoltageGuage2 / varMaxVoltageGuage2 * 100;
    channelVolatgeGuage2.data.datasets[0].data[1] =
        100 - channelVolatgeGuage2.data.datasets[0].data[0];
    channelVolatgeGuage2.options.title.text = dataVarVoltageGuage2 + unitV2;
    channelVolatgeGuage2.update();

    //Current guage 2
    channelCurrentGuage2.data.datasets[0].data[0] = dataVarCurrentGuage2 / varMaxCurrentGuage2 * 100;
    channelCurrentGuage2.data.datasets[0].data[1] =
        100 - channelCurrentGuage2.data.datasets[0].data[0];
    channelCurrentGuage2.options.title.text = dataVarCurrentGuage2 + unitA2;
    channelCurrentGuage2.update();

    //Chart 2
    if (!channelIsPausedChart2) {
        channelCurrentChart2.data.labels[pointsInXAxisChart2 - 1] = timeVarChart2.toFixed(2) + xAxisSuffixChart2;
        channelCurrentChart2.data.datasets[0].data[pointsInXAxisChart2 - 1] = dataVarChart2;
        for (var i = 0; i < pointsInXAxisChart2; i++) {
            channelCurrentChart2.data.labels[i] = channelCurrentChart2.data.labels[i + 1];
            channelCurrentChart2.data.datasets[0].data[i] =
                channelCurrentChart2.data.datasets[0].data[i + 1];
        }
        channelCurrentChart2.data.labels[pointsInXAxisChart2 - 1] = xAxisTextChart2;
        channelCurrentChart2.update();
        channelCurrentChart2.config.options.animation.duration = 0;
    }
    timeVarChart2 += updateRateChannel2 / 1000;
    setTimeout(intervalChannel2, updateRateChannel2);
}

//Channel 3 variables
var pointsInXAxisChart3 = 20;
var timeVarChart3 = 0;
var varMaxVoltageGuage3 = 100;
var varMaxCurrentGuage3 = 100;
var dataVarCurrentGuage3 = 0;
var dataVarVoltageGuage3 = 0;
var dataVarChart3 = 0;
var unitV3 = " V";
var unitA3 = " A";

//Channel 3 update routine
var intervalChannel3 = async function () {
    //Fetch channel 3 data
    let data = await eel.py_fetch_channel_data(3, averagingChannel3)();
    dataVarVoltageGuage3 = (data[0] * 32) / 65536;
    dataVarCurrentGuage3 = (data[1] * (0.1 / senseResistorChannel3)) / 65536;

    //Assign channel 3 data to chart
    dataVarChart3 = dataVarCurrentGuage3.toFixed(6);

    //Scale voltage
    if (isWithinLimits(dataVarVoltageGuage3, 0, 0.1)) {
        dataVarVoltageGuage3 = (dataVarVoltageGuage3 * 1000).toFixed(3);
        varMaxVoltageGuage3 = 100;
        unitV3 = " mV";
    } else if (isWithinLimits(dataVarVoltageGuage3, 0.1, 1)) {
        dataVarVoltageGuage3 = (dataVarVoltageGuage3 * 1000).toFixed(2);
        varMaxVoltageGuage3 = 1000;
        unitV3 = " mV";
    } else if (isWithinLimits(dataVarVoltageGuage3, 1, 10)) {
        dataVarVoltageGuage3 = dataVarVoltageGuage3.toFixed(3);
        varMaxVoltageGuage3 = 10;
        unitV3 = " V";
    } else if (isWithinLimits(dataVarVoltageGuage3, 10, 100)) {
        dataVarVoltageGuage3 = dataVarVoltageGuage3.toFixed(2);
        varMaxVoltageGuage3 = 100;
        unitV3 = " V";
    }

    //Scale current
    if (isWithinLimits(dataVarCurrentGuage3, 0, 0.1)) {
        dataVarCurrentGuage3 = (dataVarCurrentGuage3 * 1000).toFixed(3);
        varMaxCurrentGuage3 = 100;
        unitA3 = " mA";
    } else if (isWithinLimits(dataVarCurrentGuage3, 0.1, 1)) {
        dataVarCurrentGuage3 = (dataVarCurrentGuage3 * 1000).toFixed(2);
        varMaxCurrentGuage3 = 1000;
        unitA3 = " mA";
    } else if (isWithinLimits(dataVarCurrentGuage3, 1, 10)) {
        dataVarCurrentGuage3 = dataVarCurrentGuage3.toFixed(3);
        varMaxCurrentGuage3 = 10;
        unitA3 = " A";
    } else if (isWithinLimits(dataVarCurrentGuage3, 10, 100)) {
        dataVarCurrentGuage3 = dataVarCurrentGuage3.toFixed(2);
        varMaxCurrentGuage3 = 100;
        unitA3 = " A";
    }

    //Voltage guage 3
    channelVolatgeGuage3.data.datasets[0].data[0] = dataVarVoltageGuage3 / varMaxVoltageGuage3 * 100;
    channelVolatgeGuage3.data.datasets[0].data[1] =
        100 - channelVolatgeGuage3.data.datasets[0].data[0];
    channelVolatgeGuage3.options.title.text = dataVarVoltageGuage3 + unitV3;
    channelVolatgeGuage3.update();

    //Current guage 3
    channelCurrentGuage3.data.datasets[0].data[0] = dataVarCurrentGuage3 / varMaxCurrentGuage3 * 100;
    channelCurrentGuage3.data.datasets[0].data[1] =
        100 - channelCurrentGuage3.data.datasets[0].data[0];
    channelCurrentGuage3.options.title.text = dataVarCurrentGuage3 + unitA3;
    channelCurrentGuage3.update();

    //Chart 3
    if (!channelIsPausedChart3) {
        channelCurrentChart3.data.labels[pointsInXAxisChart3 - 1] = timeVarChart3.toFixed(2) + xAxisSuffixChart3;
        channelCurrentChart3.data.datasets[0].data[pointsInXAxisChart3 - 1] = dataVarChart3;
        for (var i = 0; i < pointsInXAxisChart3; i++) {
            channelCurrentChart3.data.labels[i] = channelCurrentChart3.data.labels[i + 1];
            channelCurrentChart3.data.datasets[0].data[i] =
                channelCurrentChart3.data.datasets[0].data[i + 1];
        }
        channelCurrentChart3.data.labels[pointsInXAxisChart3 - 1] = xAxisTextChart3;
        channelCurrentChart3.update();
        channelCurrentChart3.config.options.animation.duration = 0;
    }
    timeVarChart3 += updateRateChannel3 / 1000;
    setTimeout(intervalChannel3, updateRateChannel3);
}

//Channel 4 variables
var pointsInXAxisChart4 = 20;
var timeVarChart4 = 0;
var varMaxVoltageGuage4 = 100;
var varMaxCurrentGuage4 = 100;
var dataVarCurrentGuage4 = 0;
var dataVarVoltageGuage4 = 0;
var dataVarChart4 = 0;
var unitV4 = " V";
var unitA4 = " A";

//Channel 4 update routine
var intervalChannel4 = async function () {
    //Fetch channel 4 data
    let data = await eel.py_fetch_channel_data(4, averagingChannel4)();
    dataVarVoltageGuage4 = (data[0] * 32) / 65536;
    dataVarCurrentGuage4 = (data[1] * (0.1 / senseResistorChannel4)) / 65536;

    //Assign channel 4 data to chart
    dataVarChart4 = dataVarCurrentGuage4.toFixed(6);

    //Scale voltage
    if (isWithinLimits(dataVarVoltageGuage4, 0, 0.1)) {
        dataVarVoltageGuage4 = (dataVarVoltageGuage4 * 1000).toFixed(3);
        varMaxVoltageGuage4 = 100;
        unitV4 = " mV";
    } else if (isWithinLimits(dataVarVoltageGuage4, 0.1, 1)) {
        dataVarVoltageGuage4 = (dataVarVoltageGuage4 * 1000).toFixed(2);
        varMaxVoltageGuage4 = 1000;
        unitV4 = " mV";
    } else if (isWithinLimits(dataVarVoltageGuage4, 1, 10)) {
        dataVarVoltageGuage4 = dataVarVoltageGuage4.toFixed(3);
        varMaxVoltageGuage4 = 10;
        unitV4 = " V";
    } else if (isWithinLimits(dataVarVoltageGuage4, 10, 100)) {
        dataVarVoltageGuage4 = dataVarVoltageGuage4.toFixed(2);
        varMaxVoltageGuage4 = 100;
        unitV4 = " V";
    }

    //Scale current
    if (isWithinLimits(dataVarCurrentGuage4, 0, 0.1)) {
        dataVarCurrentGuage4 = (dataVarCurrentGuage4 * 1000).toFixed(3);
        varMaxCurrentGuage4 = 100;
        unitA4 = " mA";
    } else if (isWithinLimits(dataVarCurrentGuage4, 0.1, 1)) {
        dataVarCurrentGuage4 = (dataVarCurrentGuage4 * 1000).toFixed(2);
        varMaxCurrentGuage4 = 1000;
        unitA4 = " mA";
    } else if (isWithinLimits(dataVarCurrentGuage4, 1, 10)) {
        dataVarCurrentGuage4 = dataVarCurrentGuage4.toFixed(3);
        varMaxCurrentGuage4 = 10;
        unitA4 = " A";
    } else if (isWithinLimits(dataVarCurrentGuage4, 10, 100)) {
        dataVarCurrentGuage4 = dataVarCurrentGuage4.toFixed(2);
        varMaxCurrentGuage4 = 100;
        unitA4 = " A";
    }

    //Voltage guage 4
    channelVolatgeGuage4.data.datasets[0].data[0] = dataVarVoltageGuage4 / varMaxVoltageGuage4 * 100;
    channelVolatgeGuage4.data.datasets[0].data[1] =
        100 - channelVolatgeGuage4.data.datasets[0].data[0];
    channelVolatgeGuage4.options.title.text = dataVarVoltageGuage4 + unitV4;
    channelVolatgeGuage4.update();

    //Current guage 4
    channelCurrentGuage4.data.datasets[0].data[0] = dataVarCurrentGuage4 / varMaxCurrentGuage4 * 100;
    channelCurrentGuage4.data.datasets[0].data[1] =
        100 - channelCurrentGuage4.data.datasets[0].data[0];
    channelCurrentGuage4.options.title.text = dataVarCurrentGuage4 + unitA4;
    channelCurrentGuage4.update();

    //Chart 4
    if (!channelIsPausedChart4) {
        channelCurrentChart4.data.labels[pointsInXAxisChart4 - 1] = timeVarChart4.toFixed(2) + xAxisSuffixChart4;
        channelCurrentChart4.data.datasets[0].data[pointsInXAxisChart4 - 1] = dataVarChart4;
        for (var i = 0; i < pointsInXAxisChart4; i++) {
            channelCurrentChart4.data.labels[i] = channelCurrentChart4.data.labels[i + 1];
            channelCurrentChart4.data.datasets[0].data[i] =
                channelCurrentChart4.data.datasets[0].data[i + 1];
        }
        channelCurrentChart4.data.labels[pointsInXAxisChart4 - 1] = xAxisTextChart4;
        channelCurrentChart4.update();
        channelCurrentChart4.config.options.animation.duration = 0;
    }
    timeVarChart4 += updateRateChannel4 / 1000;
    setTimeout(intervalChannel4, updateRateChannel4);
}

//Start GUI
function startGUI() {
    var collapsible_element = document.querySelector('.collapsible.expandable');

    //Materialize collapsible set as expandable
    M.Collapsible.init(collapsible_element, {
        accordion: false
    });

    var collapsible_instance = M.Collapsible.getInstance(collapsible_element);
    setTimeout(function () {
        collapsible_instance.open(0);
    }, 250);
    setTimeout(function () {
        collapsible_instance.open(1);
    }, 500);
    setTimeout(function () {
        collapsible_instance.open(2);
    }, 750);
    setTimeout(function () {
        collapsible_instance.open(3);
    }, 1000);

    //Trigger all channel update routines
    setTimeout(intervalChannel1, updateRateChannel1);
    setTimeout(intervalChannel2, updateRateChannel2);
    setTimeout(intervalChannel3, updateRateChannel3);
    setTimeout(intervalChannel4, updateRateChannel4);
}

//Set sample rate in CTRL register
async function changeSampleRate(newSampleRate) {
    var flag = false;
    if (newSampleRate === "8") {
        flag = await eel.py_set_ctrl_register(0xC0)();
    } else if (newSampleRate === "64") {
        flag = await eel.py_set_ctrl_register(0x80)();
    } else if (newSampleRate === "256") {
        flag = await eel.py_set_ctrl_register(0x40)();
    } else {
        flag = await eel.py_set_ctrl_register(0x00)();
    }
    if (flag) {
        sampleRateValue = newSampleRate;
    }
}

//Chart play-pause control
//Channel 1 control
$("#id-control-current-chart-1").click(function () {
    channelIsPausedChart1 = !channelIsPausedChart1;
    if (channelIsPausedChart1) {
        channelCurrentChart1.options.tooltips.enabled = channelIsPausedChart1;
        channelCurrentChart1.data.datasets[0].pointRadius = 4;
        channelCurrentChart1.update();
    } else {
        channelCurrentChart1.options.tooltips.enabled = channelIsPausedChart1;
        channelCurrentChart1.data.datasets[0].pointRadius = 0;
        channelCurrentChart1.update();
    }
});

//Channel 2 control
$("#id-control-current-chart-2").click(function () {
    channelIsPausedChart2 = !channelIsPausedChart2;
    if (channelIsPausedChart2) {
        channelCurrentChart2.options.tooltips.enabled = channelIsPausedChart2;
        channelCurrentChart2.data.datasets[0].pointRadius = 4;
        channelCurrentChart2.update();
    } else {
        channelCurrentChart2.options.tooltips.enabled = channelIsPausedChart2;
        channelCurrentChart2.data.datasets[0].pointRadius = 0;
        channelCurrentChart2.update();
    }
});

//Channel 3 control
$("#id-control-current-chart-3").click(function () {
    channelIsPausedChart3 = !channelIsPausedChart3;
    if (channelIsPausedChart3) {
        channelCurrentChart3.options.tooltips.enabled = channelIsPausedChart3;
        channelCurrentChart3.data.datasets[0].pointRadius = 4;
        channelCurrentChart3.update();
    } else {
        channelCurrentChart3.options.tooltips.enabled = channelIsPausedChart3;
        channelCurrentChart3.data.datasets[0].pointRadius = 0;
        channelCurrentChart3.update();
    }
});

//Channel 4 control
$("#id-control-current-chart-4").click(function () {
    channelIsPausedChart4 = !channelIsPausedChart4;
    if (channelIsPausedChart4) {
        channelCurrentChart4.options.tooltips.enabled = channelIsPausedChart4;
        channelCurrentChart4.data.datasets[0].pointRadius = 4;
        channelCurrentChart4.update();
    } else {
        channelCurrentChart4.options.tooltips.enabled = channelIsPausedChart4;
        channelCurrentChart4.data.datasets[0].pointRadius = 0;
        channelCurrentChart4.update();
    }
});

//Title bar - Tools - Reset All
$('#id-title-bar-tools-reset-all-confirm').click(async function () {
    //Fill default config
    await eel.py_reset_settings()();
    //Save to disk
    await eel.py_save_settings()();
    //Fetch and apply settings
    await applySettings();
    //Notify
    M.toast({
        html: 'Settings Reset!'
    });
});

//Title bar - Help - Source
$('#id-title-bar-help-source').click(function () {
    var url = "https://github.com/mhtmhn/PACView-Source";
    window.open(url, '_blank');
});

//Prevent context menus on right click
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

//Disable some keys and key combinations
$(document).keydown(function (event) {
    //Function keys
    if ((event.keyCode >= 112 && event.keyCode <= 123) && !debug) {
        return false;
    }
    //Ctrl+Shift+I
    else if (event.ctrlKey && event.shiftKey && event.keyCode == 73 && !debug) {
        return false;
    }
    //Ctrl+R
    else if (event.ctrlKey && event.keyCode == 82 && !debug) {
        return false;
    }
    //Ctrl+Shift+R
    else if (event.ctrlKey && event.shiftKey && event.keyCode == 82 && !debug) {
        return false;
    }
});

//Settings system
//Fetch and apply settings from backend
async function applySettings() {
    try {
        //Fetch and apply saved channel names
        let channelName1 = await eel.py_get_setting('channelName1')();
        $('#id-rename-channel-1').text(channelName1);
        let channelName2 = await eel.py_get_setting('channelName2')();
        $('#id-rename-channel-2').text(channelName2);
        let channelName3 = await eel.py_get_setting('channelName3')();
        $('#id-rename-channel-3').text(channelName3);
        let channelName4 = await eel.py_get_setting('channelName4')();
        $('#id-rename-channel-4').text(channelName4);

        //Fetch and apply saved sense resistor values
        let senseResistorInOhms1 = await eel.py_get_setting('senseResistorInOhms1')();
        senseResistorChannel1 = senseResistorInOhms1;
        let senseResistorInOhms2 = await eel.py_get_setting('senseResistorInOhms2')();
        senseResistorChannel2 = senseResistorInOhms2;
        let senseResistorInOhms3 = await eel.py_get_setting('senseResistorInOhms3')();
        senseResistorChannel3 = senseResistorInOhms3;
        let senseResistorInOhms4 = await eel.py_get_setting('senseResistorInOhms4')();
        senseResistorChannel4 = senseResistorInOhms4;

        //Fetch and apply sample rate value
        let sampleRateAllChannels = await eel.py_get_setting('sampleRateAllChannels')();
        sampleRateValue = sampleRateAllChannels;
        await changeSampleRate(sampleRateValue);

        //Fetch and apply refresh rate value
        let refreshRateChannel1 = await eel.py_get_setting('refreshRateChannel1')();
        updateRateChannel1 = refreshRateChannel1;
        let refreshRateChannel2 = await eel.py_get_setting('refreshRateChannel2')();
        updateRateChannel2 = refreshRateChannel2;
        let refreshRateChannel3 = await eel.py_get_setting('refreshRateChannel3')();
        updateRateChannel3 = refreshRateChannel3;
        let refreshRateChannel4 = await eel.py_get_setting('refreshRateChannel4')();
        updateRateChannel4 = refreshRateChannel4;

        //Fetch and apply channel averaging enable state
        let averagingEnableChannel1 = await eel.py_get_setting('averagingEnableChannel1')();
        averagingChannel1 = averagingEnableChannel1;
        let averagingEnableChannel2 = await eel.py_get_setting('averagingEnableChannel2')();
        averagingChannel2 = averagingEnableChannel2;
        let averagingEnableChannel3 = await eel.py_get_setting('averagingEnableChannel3')();
        averagingChannel3 = averagingEnableChannel3;
        let averagingEnableChannel4 = await eel.py_get_setting('averagingEnableChannel4')();
        averagingChannel4 = averagingEnableChannel4;
    } catch (err) {
        debug && console.log(err);
    }
}

//Send settings to backend
async function sendSettings() {
    //Send current channel names
    let channelName1 = $('#id-rename-channel-1').text();
    await eel.py_set_setting('channelName1', channelName1)();
    let channelName2 = $('#id-rename-channel-2').text();
    await eel.py_set_setting('channelName2', channelName2)();
    let channelName3 = $('#id-rename-channel-3').text();
    await eel.py_set_setting('channelName3', channelName3)();
    let channelName4 = $('#id-rename-channel-4').text();
    await eel.py_set_setting('channelName4', channelName4)();

    //Send current sense resistor values
    let senseResistorInOhms1 = senseResistorChannel1;
    await eel.py_set_setting('senseResistorInOhms1', senseResistorInOhms1)();
    let senseResistorInOhms2 = senseResistorChannel2;
    await eel.py_set_setting('senseResistorInOhms2', senseResistorInOhms2)();
    let senseResistorInOhms3 = senseResistorChannel3;
    await eel.py_set_setting('senseResistorInOhms3', senseResistorInOhms3)();
    let senseResistorInOhms4 = senseResistorChannel4;
    await eel.py_set_setting('senseResistorInOhms4', senseResistorInOhms4)();

    //Send current sample rate value
    let sampleRateAllChannels = sampleRateValue;
    await eel.py_set_setting('sampleRateAllChannels', sampleRateAllChannels)();

    //Send current refresh rate values
    let refreshRateChannel1 = updateRateChannel1;
    await eel.py_set_setting('refreshRateChannel1', refreshRateChannel1)();
    let refreshRateChannel2 = updateRateChannel2;
    await eel.py_set_setting('refreshRateChannel2', refreshRateChannel2)();
    let refreshRateChannel3 = updateRateChannel3;
    await eel.py_set_setting('refreshRateChannel3', refreshRateChannel3)();
    let refreshRateChannel4 = updateRateChannel4;
    await eel.py_set_setting('refreshRateChannel4', refreshRateChannel4)();

    //Send current channel averaging enable state
    let averagingEnableChannel1 = averagingChannel1;
    await eel.py_set_setting('averagingEnableChannel1', averagingEnableChannel1)();
    let averagingEnableChannel2 = averagingChannel2;
    await eel.py_set_setting('averagingEnableChannel2', averagingEnableChannel2)();
    let averagingEnableChannel3 = averagingChannel3;
    await eel.py_set_setting('averagingEnableChannel3', averagingEnableChannel3)();
    let averagingEnableChannel4 = averagingChannel4;
    await eel.py_set_setting('averagingEnableChannel4', averagingEnableChannel4)();
}

//Initialize settings
async function initSettings() {
    try {
        //Try to load config.txt on startup
        let fileExists = await eel.py_load_settings()();
        //Fill defaults and save if file doesn't exist
        if (fileExists == false) {
            debug && console.log('Config file missing!');
            //Fill default config
            await eel.py_reset_settings()();
            //Save to disk
            await eel.py_save_settings()();
            debug && console.log('Config file saved!');
            //Fetch settings
            await applySettings();
            debug && console.log('Default config loaded!');
        } else {
            //Fetch settings
            await applySettings();
            debug && console.log('Saved config loaded!');
        }
    } catch (err) {
        debug && console.log(err);
    }
}

//Handle setting related events
//Title bar - File - Save Settings
$('#id-title-bar-file-save-settings').click(async function () {
    //Propogate current settings to backend
    await sendSettings();
    //Save to disk
    await eel.py_save_settings()();
    //Notify
    M.toast({
        html: 'Settings Saved!'
    });
});

//Title bar - File - Load Settings
$('#id-title-bar-file-load-settings').click(async function () {
    //Load current settings from disk
    await eel.py_load_settings()();
    //Fetch and apply settings
    await applySettings();
    //Notify
    M.toast({
        html: 'Settings Loaded!'
    });
});
