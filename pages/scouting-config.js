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
        "name": "Auto",
        "inputs": [{
                "name": "NO SHOW",
                "type": "checkbox",
                "default": false,
                "values": [],
                "className": ""
            },
            {
                "name": "Move Off Tarmac",
                "type": "checkbox",
                "default": false,
                "values": [],
                "className": ""
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
            },
            {
                "name": "SCORED BY HP",
                "type": "button",
                "default": undefined,
                "values": [],
                "className": ""
            }
        ]
    },
    {
        "name": "Teleop",
        "inputs": [{
                "name": "Ground Pickup",
                "type": "checkbox",
                "default": false,
                "values": [],
                "className": ""
            },
            {
                "name": "Terminal Pickup",
                "type": "checkbox",
                "default": false,
                "values": [],
                "className": ""
            },
            {
                "name": "Scored Lower Hub",
                "type": "number",
                "default": undefined,
                "values": [],
                "className": ""
            },
            {
                "name": "Missed Lower Hub",
                "type": "number",
                "default": undefined,
                "values": [],
                "className": ""
            },
            {
                "name": "Scored Upper Hub",
                "type": "number",
                "default": undefined,
                "values": [],
                "className": ""
            },
            {
                "name": "Missed Upper Hub",
                "type": "number",
                "default": undefined,
                "values": [],
                "className": ""
            }
        ]
    },
    {
        "name": "End Game",
        "inputs": [{
                "name": "Attempted Climb",
                "type": "checkbox",
                "default": false,
                "values": [],
                "className": ""
            },
            {
                "name": "Scored Lower Hub",
                "type": "number",
                "default": undefined,
                "values": [],
                "className": ""
            },
            {
                "name": "Missed Lower Hub",
                "type": "number",
                "default": undefined,
                "values": [],
                "className": ""
            },
            {
                "name": "Scored Upper Hub",
                "type": "number",
                "default": undefined,
                "values": [],
                "className": ""
            },
            {
                "name": "Missed Upper Hub",
                "type": "number",
                "default": undefined,
                "values": [],
                "className": ""
            }
        ]
    }
];

module.exports = data;