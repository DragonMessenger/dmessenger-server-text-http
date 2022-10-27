window.onload = function() {
    setTimeout(() => Channel.getMessages(true), 50);
    Channel.getMembers();
    postActivity();
    checkConnection();
}