class User {
    static getInfo(targetID = "") {
        xhttp.open("GET", window.WEBAPP_ENDPOINT + "/api/user/info/" + targetID, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log('[User.getInfo] Get info about user with id: ' + targetID)

                var response = JSON.parse(this.responseText);

                document.getElementById('member-info-id').innerHTML = "ID: " + response['id']
                document.getElementById('member-info-role').innerHTML = "Role: " + response['role']
				document.getElementById('member-info-status').innerHTML = "Status: " + response['status']
				document.getElementById('member-info-statusText').innerHTML = response['statusText']

                return response;
            }
            if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
                console.log("[User.getInfo] Error: " + this.status);
            }
            if (this.readyState == 4 && this.status == 403 || this.status == 401) {
                console.log("[User.getInfo] Error: " + this.status);
            }
        }
    }
}