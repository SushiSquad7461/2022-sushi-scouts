/*
    Format for adding data point:

    {
        "name": "Team Number",
        "type": "number",
        "default": "12" (undefined for no default: DO NOT USE NULL),
        "values" (if applicable, if not leave as empty array): ["low climb", "no climb", "high climb"],
        "className" ("" for no className): ""
    }

*/

const data = [{
    "name": "MATCH INFO",
    "parentClassName": "",
    "inputs": [{
        "name": "MATCH #",
        "type": "number",
        "default": undefined,
        "values": [],
        "className": ""
    },
    {
        "name": "MATCH TYPE",
        "type": "radio",
        "default": undefined,
        "values": ["REGULAR MATCH", "SEMI-FINALS", "QUARTERFINALS", "FINALS"],
        "className": "matchtype"
    },
    {
        "name": " TEAM # YOU'RE SCOUTING",
        "type": "number",
        "default": undefined,
        "values": [],
        "className": ""
    }]
},
{
    "name": "AUTO",        
    "parentClassName": "auto",
    "inputs": [{
            "name": "NO SHOW",
            "type": "checkbox",
            "default": false,
            "values": [],
            "className": "auto-check"
        },
        {
            "name": "MOVE OFF TARMAC",
            "type": "checkbox",
            "default": false,
            "values": [],
            "className": "auto-check auto-check-right"
        },
        {
            "name": "SCORED LOWER HUB",
            "type": "button",
            "default": undefined,
            "values": [],
            "className": ""
        },
        {
            "name": "MISSED LOWER HUB",
            "type": "button",
            "default": undefined,
            "values": [],
            "className": ""
        },
        {
            "name": "SCORED BY HP",
            "type": "button",
            "default": undefined,
            "values": [],
            "className": "hp-input"
        },
        {
            "name": "SCORED UPPER HUB",
            "type": "button",
            "default": undefined,
            "values": [],
            "className": ""
        },
        {
            "name": "MISSED UPPER HUB",
            "type": "button",
            "default": undefined,
            "values": [],
            "className": ""
        }
    ]
},
{
    "name": "TELEOP",
    "parentClassName": "teleop",
    "inputs": [{
            "name": "GROUND PICKUP",
            "type": "checkbox",
            "default": false,
            "values": [],
            "className": "auto-check auto-check-right"
        },
        {
            "name": "TERMINAL PICKUP",
            "type": "checkbox",
            "default": false,
            "values": [],
            "className": "auto-check"
        },
        {
            "name": "SCORED LOWER HUB",
            "type": "button",
            "default": undefined,
            "values": [],
            "className": ""
        },
        {
            "name": "MISSED LOWER HUB",
            "type": "button",
            "default": undefined,
            "values": [],
            "className": ""
        },
        {
            "name": "SCORED UPPER HUB",
            "type": "button",
            "default": undefined,
            "values": [],
            "className": ""
        },
        {
            "name": "MISSED UPPER HUB",
            "type": "button",
            "default": undefined,
            "values": [],
            "className": ""
        }
    ]
},
{
    "name": "END GAME",
    "parentClassName": "end-game",
    "inputs": [{
            "name": "ATTEMPTED CLIMB",
            "type": "checkbox",
            "default": false,
            "values": [],
            "className": "auto-check"
        },
        {
            "name": "MATCH TYPE",
            "type": "radio",
            "default": undefined,
            "values": ["NO CLIMB", "LOW CLIMB", "MID CLIMB", "HIGH CLIMB", "TRAVERSAL CLIMB"],
            "className": "matchtype"
        },
        {
            "name": "STOPPED DURING MATCH",
            "type": "checkbox",
            "default": false,
            "values": [],
            "className": "auto-check auto-check-right"
        },
        {
            "name": "NOTES",
            "type": "textarea",
            "default": false,
            "values": [],
            "className": ""
        }
    ]
}
];

module.exports = data;