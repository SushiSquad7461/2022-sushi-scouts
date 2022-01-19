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
        ]
    },
    {
        "name" : "Teleop",
        "inputs": [
        ]
    },
    {
        "name" : "End Game",
        "inputs": [
        ]
    }
];

module.exports = data;