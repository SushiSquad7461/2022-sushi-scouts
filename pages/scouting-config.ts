type ScoutingInput = {
  "name": String, // Name of input
  "type": String, // Type of input
  "values": String[], // if applicable, if not leave as empty array)
  "className": "" // "" for no className
}

type ScoutingDataSection = {
  "name": String, // Name of scouting sections
  "parentClassName": String, // "" for no className
  "inputs": ScoutingInput[] // All of the inputs in a section 
}

const data: ScoutingDataSection[] = [{
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

export default data;