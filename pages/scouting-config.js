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
        "values": [],
        "className": ""
    },
    {
        "name": "MATCH TYPE",
        "type": "radio",
        "values": ["REGULAR MATCH", "SEMI-FINALS", "QUARTERFINALS", "FINALS"],
        "className": "matchtype"
    },
    {
        "name": "TEAM # YOU'RE SCOUTING",
        "type": "number",
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
            "values": [],
            "className": "auto-check"
        },
        {
            "name": "MOVE OFF TARMAC",
            "type": "checkbox",
            "values": [],
            "className": "auto-check auto-check-right"
        },
        {
            "name": "SCORED LOWER HUB",
            "type": "button",
            "values": [],
            "className": ""
        },
        {
            "name": "MISSED LOWER HUB",
            "type": "button",
            "values": [],
            "className": ""
        },
        {
            "name": "SCORED BY HP",
            "type": "button",
            "values": [],
            "className": "hp-input"
        },
        {
            "name": "SCORED UPPER HUB",
            "type": "button",
            "values": [],
            "className": ""
        },
        {
            "name": "MISSED UPPER HUB",
            "type": "button",
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
            "values": [],
            "className": "auto-check auto-check-right"
        },
        {
            "name": "TERMINAL PICKUP",
            "type": "checkbox",
            "values": [],
            "className": "auto-check"
        },
        {
            "name": "SCORED LOWER HUB",
            "type": "button",
            "values": [],
            "className": ""
        },
        {
            "name": "MISSED LOWER HUB",
            "type": "button",
            "values": [],
            "className": ""
        },
        {
            "name": "SCORED UPPER HUB",
            "type": "button",
            "values": [],
            "className": ""
        },
        {
            "name": "MISSED UPPER HUB",
            "type": "button",
            "values": [],
            "className": ""
        }
    ]
},
{
    "name": "END GAME",
    "parentClassName": "end-game",
    "inputs": [{
            "name": "CLIMB",
            "type": "radio",
            "values": ["ATTEMPTED CLIMB", "NO CLIMB", "FAILED CLIMB"],
            "className": "matchtype auto-check end-game"
        },
        {
            "name": "CLIMB TYPE",
            "type": "radio",
            "values": ["LOW CLIMB", "MID CLIMB", "HIGH CLIMB", "TRAVERSAL CLIMB"],
            "className": "matchtype climbtype"
        },
        {
            "name": "NOTES",
            "type": "textarea",
            "values": [],
            "className": "notes"
        }
    ]
}
];

module.exports = data;