function removeActivity() {
    xhttp.open("DELETE", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/members/delete", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            acceptRequests = false;
            console.log('[removeActivity] Activity deleted')
        }
        if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
            console.log("[removeActivity] Error: " + this.status);
        }
        if (this.readyState == 4 && this.status == 403 || this.status == 401) {
            console.log("[removeActivity] Error: " + this.status);
        }
    }
}