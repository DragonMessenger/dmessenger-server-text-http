function getUsername() {
    xhttp.open("GET", window.WEBAPP_ENDPOINT + "/api/auth/username", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(null);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(response["username"]);
        }
    }
}