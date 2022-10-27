let pinsHTML = document.getElementById("pins");

class PinsUI {
    static toggle()
    {
        Channel.getPins();
        document.getElementById('pins').hidden = !document.getElementById('pins').hidden;
    }
}