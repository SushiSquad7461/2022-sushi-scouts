/*
    Format for adding data point:

    {
        "name": "Team Number",
        "type": "number",
        "default": "12" (undefined for no default: DO NOT USE NULL),
        "values" (if applicable, if not leave as empty array): ["low climb", "no climb", "high climb"]
    }

*/

const data = [
    {
        "name" : "Match Info",
        "inputs": [
            {
                "name": "Team Number",
                "type": "number",
                "default": undefined,
                "values": []
            }
        ]
    },
    {
        "name" : "Auto",
        "inputs": [
            {
                "name": "No Show",
                "type": "checkbox",
                "default": false,
                "values": []
            },
            {
                "name": "Move Off Tarmac",
                "type": "checkbox",
                "default": false,
                "values": []
            },
            {
                "name": "Scored Lower Hub",
                "type": "number",
                "default": undefined,
                "values": []
            },
            {
                "name": "Missed Lower Hub",
                "type": "number",
                "default": undefined,
                "values": []
            },
            {
                "name": "Scored Upper Hub",
                "type": "number",
                "default": undefined,
                "values": []
            },
            {
                "name": "Missed Upper Hub",
                "type": "number",
                "default": undefined,
                "values": []
            }
        ]
    },
    {
        "name" : "Teleop",
        "inputs": [
            {
                "name": "Ground Pickup",
                "type": "checkbox",
                "default": false,
                "values": []
            },
            {
                "name": "Terminal Pickup",
                "type": "checkbox",
                "default": false,
                "values": []
            },
            {
                "name": "Scored Lower Hub",
                "type": "number",
                "default": undefined,
                "values": []
            },
            {
                "name": "Missed Lower Hub",
                "type": "number",
                "default": undefined,
                "values": []
            },
            {
                "name": "Scored Upper Hub",
                "type": "number",
                "default": undefined,
                "values": []
            },
            {
                "name": "Missed Upper Hub",
                "type": "number",
                "default": undefined,
                "values": []
            },
            {
                "name": "Scored by Human Player",
                "type": "number",
                "default": undefined,
                "values": []
            }
        ]
    },
    {
        "name" : "End Game",
        "inputs": [
            {
                "name": "Attempted Climb",
                "type": "checkbox",
                "default": false,
                "values": []
            },
        ]
    }
];

module.exports = data;