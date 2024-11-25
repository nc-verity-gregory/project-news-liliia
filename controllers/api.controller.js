const endpointsJson = require("../endpoints.json");

function getApi(req, res) {
    console.log(endpointsJson, "<------ endpoints Json");
    res.status(200).send({ endpoints: endpointsJson });
};

module.exports = getApi;