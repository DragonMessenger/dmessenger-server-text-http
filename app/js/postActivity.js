function postActivity() {
    xhttp.open("POST", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/members/add", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            acceptRequests = true;
            console.log('[postActivity] Activity sented')
        }
        if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
            console.log("[postActivity] Error: " + this.status);
        }
        if (this.readyState == 4 && this.status == 403 || this.status == 401) {
            console.log("[postActivity] Error: " + this.status);
        }
    }
}