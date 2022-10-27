document.querySelector("input[name=\"messages_search\"]").addEventListener("input", (e) => {
  [...document.querySelectorAll("div[class=\"message\"]")].forEach(item => {
	if (item.textContent.toLowerCase().includes(e.target.value.toLowerCase())) {
		//console.debug("%c [Dynamic Search] Show: " + item.textContent, 'color: #4bed42');
		item.style.display = "block";
	}
	else {
		//console.debug("%c [Dynamic Search] Hide: " + item.textContent, 'color: #ed4245');
		item.style.display = "none";
	}
  });
});