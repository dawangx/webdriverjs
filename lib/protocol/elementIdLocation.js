module.exports = function elementIdLocation (id, callback) {

    var requestOptions = {
        path:"/session/:sessionId/element/:id/location",
        method:"GET"
    };

    requestOptions.path = requestOptions.path.replace(/:id/gi, id);

    this.requestHandler.create(requestOptions,{},callback);

};
